import logging
import os
import fitz
import json
import argparse
import requests
import cv2
import torch
import openai
import base64
import numpy as np
from functools import partial
from psd_tools import PSDImage
from transformers import pipeline
from torchmetrics.functional.multimodal import clip_score
from utils import *
from prompt import *


# ------------------------ Preliminaries ------------------------
own_cache_dir = ""
os.environ["HF_HOME"] = own_cache_dir
os.environ["HF_DATASETS"] = own_cache_dir
HF_TOKEN = ""

pipe = pipeline(
    "image-text-to-text", 
    model="llava-hf/llava-1.5-7b-hf", 
    cache_dir=own_cache_dir,
    device_map="auto",
    use_fast=True,
)


# ---------------------------- LLMs -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
OPENAI_API_KEY = ""
client = openai.OpenAI(api_key=OPENAI_API_KEY)


class Evaluator:
    def __init__(self):
        logging.basicConfig(level=logging.INFO)

    def download_image(self, url):
        """Download image from URL and return as OpenCV format."""
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            print(f"Error downloading {url}: {e}")
            return None

    def process_pdf(self, pdf_path, png_path):
        pdf_document = fitz.open(pdf_path)
        page = pdf_document[0]
        pix = page.get_pixmap()
        pix.save(png_path)        
        pdf_document.close()
        return png_path
        
    def call_llava7b(self, image_url, prompt):
        # LLaVA-1.5-7B for VQA evaluation
        messages = [
            {
            "role": "user",
            "content": [
                {"type": "image", "url": image_url},
                {"type": "text", "text": prompt},
                ],
            },
        ]
        out = pipe(text=messages, max_new_tokens=512)
        generation = out[0]['generated_text'][1]['content']
        return generation

    # Final design: Fidelity
    def eval_fidelity(self, input_images, generation):
        method = cv2.TM_CCORR_NORMED  # Cross correlation normalized
        scores = []

        # Read the generated image
        img2 = cv2.imread(generation)
        if img2 is None:
            print(f"Error: Cannot read generated image {generation}")
            return 0.0

        img2_gray = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

        for input_image in input_images:
            if input_image.startswith("http"):  # Check if input_image is a URL
                img1 = self.download_image(input_image)
            else:
                img1 = cv2.imread(input_image)

            if img1 is None:
                print(f"Error: Cannot read input image {input_image}")
                continue

            img1_gray = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)

            # Check size before template matching
            h1, w1 = img1_gray.shape
            h2, w2 = img2_gray.shape

            print(f"Input image size: {h1}x{w1}, Generated image size: {h2}x{w2}")

            # Resize img1_gray if it is larger than img2_gray
            if h1 > h2 or w1 > w2:
                scale_factor = min(h2 / h1, w2 / w1)  # Find the best scaling factor
                new_size = (int(w1 * scale_factor), int(h1 * scale_factor))
                img1_gray = cv2.resize(img1_gray, new_size, interpolation=cv2.INTER_AREA)
                print(f"Resized input image to: {img1_gray.shape}")

            res = cv2.matchTemplate(img1_gray, img2_gray, method)
            if np.any(res > 0.9):
                scores.append(1)
            else:
                scores.append(0)

        print("Fidelity: ", round(sum(scores) / max(len(scores), 1), 2))
        return round(sum(scores) / max(len(scores), 1), 2)  # Avoid division by zero

    # Final design: CLIPScore
    def eval_clipscore(self, user_request, generation):
        clip_score_fn = partial(clip_score, model_name_or_path="openai/clip-vit-base-patch16")

        def calculate_clip_score(images, prompts):
            images_int = (images * 255).astype("uint8")  # Ensure proper dtype conversion
            clip_score_value = clip_score_fn(torch.from_numpy(images_int).permute(0, 3, 1, 2), prompts).detach()
            return round(float(clip_score_value), 4)

        # Load the image
        img = cv2.imread(generation)  # Read the image from the file path
        if img is None:
            print(f"Error: Cannot read generated image {generation}")
            return 0.0

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
        img_array = np.array(img_rgb) / 255.0  # Normalize pixel values to [0,1]

        # Expand dimensions if necessary (ensure it is in batch format)
        if len(img_array.shape) == 3:
            img_array = np.expand_dims(img_array, axis=0)

        # Calculate CLIP score
        sd_clip_score = calculate_clip_score(img_array, user_request)
        print("CLIP score: ", sd_clip_score)
        return sd_clip_score
    
    # Final design: VQA
    def eval_vqa(self, questions, generation):        
        correct_answers = 0
        total_questions = len(questions)
        responses = []
        
        for question in questions:
            prompt = f"Instruction: Look at the image and answer the question with 'Yes' or 'No'.\n\nQuestion: {question}\nAnswer: "
            response = self.call_llava7b(generation, prompt)
            print("Question: ", question)
            print("Response: ", response.strip())
            responses.append(response)

            if response.strip().lower() in ["yes", "true", "t", "y"]:
                correct_answers += 1
        
        if total_questions == 0:  # Prevent division by zero
            print("Warning: No questions were provided for VQA evaluation.")
            return 0.0  # Return 0 accuracy if no questions exist

        accuracy = (correct_answers / total_questions) * 100
        print("VQA accuracy: ", accuracy)
        return round(accuracy, 2)

    # Final design: Creativity
    def encode_image(self, image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode("utf-8")
    
    def eval_creativity(self, prompt_type, image_path, user_query):
        generated_image = self.encode_image(image_path)

        if prompt_type == "originality":
            prompt = originality_prompt.replace("{{user_query}}", user_query)
        elif prompt_type == "elaboration":
            prompt = elaboration_prompt.replace("{{user_query}}", user_query)
        else:
            raise ValueError("Prompt type needs to be either originality or elaboration.")

        response = client.chat.completions.create(
            model="gpt-o1",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": f"data:image/png;base64,{generated_image}",
                        },
                    ],
                },
            ],
            max_tokens=1000
        )
        generation = response.choices[0].message.content
        return generation



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str)
    args = parser.parse_args()

    design_types = ["bookcover", "businesscard", "poster", "postcard"]

    for design_type in design_types:
        # File paths
        input_jsonl = f"../planning/results/{args.model}/{design_type}.jsonl"
        question_file = f"../data/with_questions/{design_type}.jsonl"
        output_path = f"results/{args.model}/{design_type}.jsonl"
        execution_path = f"../execution/results/{args.model}/{design_type}/"

        # Ensure the output directory exists
        os.makedirs(f"results/{args.model}", exist_ok=True)

        if not os.path.exists(output_path):
            with open(output_path, 'w') as f:
                pass

        question_mapping = {}

        with open(question_file, 'r', encoding='utf-8') as qfile:
            for line in qfile:
                q_data = json.loads(line.strip())
                q_id = q_data.get("ID")  # Assuming questions have an "ID" field
                if q_id is not None:
                    question_mapping[q_id] = q_data.get("questions", [])

        with open(input_jsonl, 'r', encoding='utf-8') as file, open(output_path, 'w', encoding='utf-8') as outfile:
            for line in file:
                data = json.loads(line.strip())

                record_id = data.get("id", None)
                user_request = data.get("user_query", None)
                images = data.get("images", [])
                urls = [img["url"] for img in images]
                input_images = urls

                execution_success_rate = 0
                generation = None
                
                # Check for matching files in execution_path
                matching_files = [f for f in os.listdir(execution_path) if f.startswith(f"{record_id}_")]
                if matching_files:
                    execution_success_rate = 1
                    filename = matching_files[0]  # Use the first matching file
                    file_path = os.path.join(execution_path, filename)
                    
                    if filename.endswith(".psd"):
                        psd = PSDImage.open(file_path)
                        generation = os.path.splitext(file_path)[0] + ".png"
                        psd.composite().save(generation)
                    else:
                        generation = file_path  # Use as PNG directly
                print("Generation: ", generation)
                print("Input Images: ", input_images)

                questions = question_mapping.get(record_id, [])
                ct_ev = Evaluator()

                if isinstance(questions, str):
                    try:
                        questions = clean_json_string(questions)
                        questions = json.loads(questions)
                    except:
                        pass
                if isinstance(questions, list):
                    pass
                
                print("Questions: ", questions)
                print("Execution success rate: ", execution_success_rate)

                # (0) Process pdf to png
                if generation:
                    if generation.lower().endswith(".pdf"):
                        generation = ct_ev.process_pdf(generation, os.path.splitext(generation)[0] + ".png")
                    else: pass

                    eval_result = {
                        "id": record_id,
                        "design": design_type,
                        "generation": generation,
                        "execution_success_rate": execution_success_rate,
                        "fidelity": ct_ev.eval_fidelity(input_images, generation),
                        "clipscore": ct_ev.eval_clipscore(user_request, generation),
                        "vqa": ct_ev.eval_vqa(questions, generation),
                        "creativity_originality": ct_ev.eval_creativity("origniality", generation, user_request),
                        "creativity_elaboration": ct_ev.eval_creativity("elabroation", generation, user_request),
                    }
                else:
                    eval_result = {
                        "id": record_id,
                        "design": design_type,
                        "generation": generation,
                        "execution_success_rate": execution_success_rate,
                        "fidelity": None,
                        "clipscore": None,
                        "vqa": None,
                        "creativity_originality": None,
                        "creativity_elaboration": None
                    }
                print(json.dumps(eval_result, indent=2))
                outfile.write(json.dumps(eval_result, ensure_ascii=False) + '\n')
                outfile.flush()
                print("="*80)
