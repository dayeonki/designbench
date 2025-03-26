import logging
import os
import fitz
import json
import argparse
import torch
import openai
from utils import *


# ------------------------ Preliminaries ------------------------
own_cache_dir = ""
os.environ["HF_HOME"] = own_cache_dir
os.environ["HF_DATASETS"] = own_cache_dir
HF_TOKEN = ""


# ---------------------------- LLMs -----------------------------
# GPT-4 as LLM-as-judge evaluation
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

OPENAI_API_KEY = ""
client = openai.OpenAI(api_key=OPENAI_API_KEY)


class Evaluator:
    def __init__(self):
        logging.basicConfig(level=logging.INFO)
    
    def process_pdf(self, pdf_path, png_path):
        pdf_document = fitz.open(pdf_path)
        page = pdf_document[0]
        pix = page.get_pixmap()
        pix.save(png_path)        
        pdf_document.close()
        return png_path
    
    def call_gpt(self, prompt):        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."}, 
                {"role": "user", "content": prompt}]
        )
        generation = response.choices[0].message.content
        return generation
    
    # Workflow: Delievery rate
    def eval_difficulty(self, workflow):
        try:
            unique_experts = set(task['expert'] for task in workflow)
            if len(unique_experts) == 1:
                difficulty = "easy"
            elif len(unique_experts) == 2:
                difficulty = "medium"
            elif len(unique_experts) == 3:
                difficulty = "hard"
            else:
                raise ValueError("Number of unique experts should be between 1 to 3.")
        except:
            difficulty = None
        return difficulty
            

    def eval_delievery_rate(self, workflow, difficulty):
        try:
            thresholds = {"easy": 10, "medium": 20, "hard": 30}
            max_length = thresholds.get(difficulty, 30)
            return 1 if len(workflow) < max_length else 0
        except:
            return None
    
    # Workflow: Agent use efficiency
    def eval_efficiency(self, workflow):
        try:
            expert_sequence = [step["expert"] for step in workflow]
            print("Expert sequence: ", expert_sequence)
            transitions = sum(1 for i in range(len(expert_sequence) - 1) if expert_sequence[i] != expert_sequence[i + 1])
            unique_experts = len(set(expert_sequence))
            ideal_transitions = unique_experts - 1
            efficiency_score = ideal_transitions / transitions if transitions > 0 else 1
        except:
            efficiency_score = None
        return efficiency_score

    # Workflow: Step efficiency
    def eval_step_redundancy(self, workflow):
        try:
            each_steps = [step["description"] for step in workflow]
            print("Description sequence: ", each_steps)
            total_steps = len(each_steps)
            unique_steps = set(each_steps)
            non_duplicate_count = len(unique_steps)
            step_redundancy = non_duplicate_count / total_steps
        except:
            step_redundancy = None
        return step_redundancy



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str)
    args = parser.parse_args()

    design_types = ["bookcover", "businesscard", "postcard", "poster"]

    for design_type in design_types:
        # File paths
        input_jsonl = f"../planning/results/{args.model}/{design_type}.jsonl"
        output_path = f"results/{args.model}/{design_type}.jsonl"

        os.makedirs(f"results/{args.model}", exist_ok=True)

        if not os.path.exists(output_path):
            with open(output_path, 'w') as f:
                pass

        with open(input_jsonl, 'r', encoding='utf-8') as file, open(output_path, 'w', encoding='utf-8') as outfile:
            for line in file:
                data = json.loads(line.strip())

                record_id = data.get("ID", None)
                user_request = data.get("user_query", None)
                design_choices = data.get("design_choices", None)
                workflow = data.get("final_workflow", None)

                ct_ev = Evaluator()

                color_score, text_score, visual_score, design_score = ct_ev.eval_design_pass_rate(design_choices, workflow)

                if isinstance(workflow, str):
                    try:
                        workflow = clean_json_string(workflow)
                        workflow = json.loads(workflow)
                    except:
                        pass
                if isinstance(workflow, list):
                    pass

                eval_result = {
                    # Workflow Evaluation
                    "id": record_id,
                    "design": design_type,
                    "difficulty": ct_ev.eval_difficulty(workflow),
                    "delivery_rate": ct_ev.eval_delievery_rate(workflow, ct_ev.eval_difficulty(workflow)),
                    "agent_use_efficiency": ct_ev.eval_efficiency(workflow),
                    "step_redundancy": ct_ev.eval_step_redundancy(workflow),
                    "color_pass_rate": color_score,
                    "text_pass_rate": text_score,
                    "visual_pass_rate": visual_score,
                    "design_pass_rate": design_score,
                }
                print(json.dumps(eval_result, indent=2))
                outfile.write(json.dumps(eval_result, ensure_ascii=False) + '\n')
                outfile.flush()
