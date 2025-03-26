import os
import ast
import argparse
import logging
import openai
import torch
import json
from utils import *
from prompt import *
from collections import OrderedDict
from skillsets import ps_tools, ai_tools, id_tools
from transformers import AutoModelForCausalLM, AutoTokenizer


# ------------------------ Preliminaries ------------------------
own_cache_dir = ""
os.environ["HF_HOME"] = own_cache_dir
os.environ["HF_DATASETS"] = own_cache_dir
os.environ["TRANSFORMERS_CACHE"] = own_cache_dir

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ------------------------ Interaction mode ------------------------
class InteractionMode:
    def __init__(self, llm_type=None):
        logging.basicConfig(level=logging.INFO)
        self.llm = llm_type
        self.llama_model = None  # For LLaMA
        self.llama_tokenizer = None  # For LLaMA
        self.gemma_model = None  # For Gemma
        self.gemma_tokenizer = None  # For Gemma
        self.qwen_model = None  # For Qwen
        self.qwen_tokenizer = None  # For Qwen
        self.client = None  # For GPT

        if "llama" in self.llm.lower():
            self.llama_tokenizer = AutoTokenizer.from_pretrained(
                self.llm, 
                cache_dir=own_cache_dir,
            )
            self.llama_model = AutoModelForCausalLM.from_pretrained(
                self.llm,
                torch_dtype=torch.bfloat16,
                cache_dir=own_cache_dir,
                device_map="auto",
            )
        
        elif "gemma" in self.llm.lower():
            self.gemma_tokenizer = AutoTokenizer.from_pretrained(
                self.llm, 
                cache_dir=own_cache_dir,
            )
            self.gemma_model = AutoModelForCausalLM.from_pretrained(
                self.llm,
                torch_dtype=torch.bfloat16,
                cache_dir=own_cache_dir,
                device_map="auto",
            ).eval()
        
        elif "qwen" in self.llm.lower():
            self.qwen_tokenizer = AutoTokenizer.from_pretrained(
                self.llm, 
                cache_dir=own_cache_dir,
            )
            self.qwen_model = AutoModelForCausalLM.from_pretrained(
                self.llm,
                torch_dtype="auto",
                cache_dir=own_cache_dir,
                device_map="auto"
            )
        
        elif "gpt" in self.llm.lower():
            OPENAI_API_KEY = ""
            self.client = openai.OpenAI(api_key=OPENAI_API_KEY)

        else:
            raise ValueError("LLM type not defined.")


    def llm_query_text(self, prompt, prefix):
        if self.llama_model and self.llama_tokenizer:
            messages = [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ]
            input_ids = self.llama_tokenizer.apply_chat_template(
                    messages,
                    add_generation_prompt=True,
                    return_tensors="pt",
                ).to(device)
            terminators = [
                    self.llama_tokenizer.eos_token_id,
                    self.llama_tokenizer.convert_tokens_to_ids("<|eot_id|>")
                ]
            
            with torch.no_grad():
                outputs = self.llama_model.generate(
                    input_ids,
                    max_new_tokens=8192,
                    eos_token_id=terminators,
                )
            response = outputs[0][input_ids.shape[-1]:]
            generation = self.llama_tokenizer.decode(response, skip_special_tokens=True)

            if prefix in generation:
                try:
                    processed_text = generation.split(prefix)[-1].strip().split()[0]
                except:
                    processed_text = generation
            else:
                processed_text = generation

            if processed_text:
                processed_text = processed_text.strip('"\'')
            return processed_text
        
        elif self.gemma_model and self.gemma_tokenizer:
            input_ids = self.gemma_tokenizer(prompt, return_tensors="pt").to(device)
            with torch.no_grad():
                outputs = self.gemma_model.generate(
                    **input_ids,
                    max_new_tokens=8192,
                    num_beams=1,
                )

            decoded_out = self.gemma_tokenizer.decode(outputs[0], skip_special_tokens=True)

            if prefix in decoded_out:
                generation = decoded_out.split(prefix)[-1].strip()
                generation = generation.split("<")[0].strip()
            else:
                generation = decoded_out
            return generation

        elif self.qwen_model and self.qwen_tokenizer:
            messages = [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
            text = self.qwen_tokenizer.apply_chat_template(
                messages,
                tokenize=False,
                add_generation_prompt=True
            )
            model_inputs = self.qwen_tokenizer([text], return_tensors="pt").to(device)

            generated_ids = self.qwen_model.generate(
                **model_inputs,
                max_new_tokens=8192
            )
            generated_ids = [
                output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
            ]

            generated_text = self.qwen_tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

            if prefix in generated_text:
                try:
                    processed_text = generated_text.split(prefix)[-1].strip().split()[0]
                except:
                    processed_text = generated_text
            else:
                processed_text = generated_text
            return processed_text

        elif self.client:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."}, 
                    {"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        else:
            raise ValueError("LLM type not defined.")


    # (1) Expert recruitment (supervisor)
    def expert_recruit(self, prompt, user_request, user_images):
        query = prompt.replace("{{user_request}}", user_request).replace("{{user_images}}", str(user_images))
        prefix = "Recruitment status [list]: "
        result = self.llm_query_text(query, prefix).replace("user's", "user").replace("'", "")
        return result
    
    # (2) Generate workflow (each expert agent)
    def generate_workflow(self, prompt, expert, task, design_outline, user_images):
        query = prompt.replace("{{expert}}", expert).replace("{{task}}", task).replace("{{outline}}", str(design_outline)).replace("{{user_images}}", str(user_images))
        prefix = "Sequence of subtasks [list]: "
        result = self.llm_query_text(query, prefix).replace("\n  ", "")
        return result
    
    # (3) Combine workflow (supervisor)
    def combine_workflow(self, prompt, workflow, recruitment_status):
        query = prompt.replace("{{workflow}}", str(workflow)).replace("{{recruitment_status}}", str(recruitment_status))
        prefix = "Supervised sequence of subtasks [list]: "
        result = self.llm_query_text(query, prefix).replace("\n", "").replace("```json", "").replace("```", "").replace("```json\n ", "").replace("```json\n", "").replace("\n   ", "").replace("\n", "").replace("    ", "")
        return result
    
    # (4) Retrieve tools (supervisor)
    def retrieve_tool(self, prompt, workflow):
        try:
            workflow = json.loads(workflow)
        except:
            workflow = workflow
        try:
            experts = list(OrderedDict.fromkeys(task["expert"] for task in workflow))
            ordered_tasks = {expert: [] for expert in experts}
            for task in workflow:
                ordered_tasks[task["expert"]].append(task)

            retrieved_workflows = []
            for expert in experts:
                tool_map = {
                    "Photo Editor": ps_tools,
                    "Graphic Designer": ai_tools,
                    "Layout Designer": id_tools
                }
                skillsets = tool_map.get(expert, [])
                each_workflow = ordered_tasks[expert]
                query = prompt.replace("{{workflow}}", str(each_workflow)).replace("{{expert}}", str(expert)).replace("{{skillsets}}", str(skillsets))
                
                prefix = "Sequence of subtasks [list]: "
                retrieved_workflow = self.llm_query_text(query, prefix)
                retrieved_workflow = retrieved_workflow.replace("```json\n", "").replace("```json\n ", "").replace("```", "").replace("\n   ", "").replace("\n", "")
                retrieved_workflows.append(retrieved_workflow)
            return retrieved_workflows
        except:
            return "NOT RETRIEVED"


class Planner:
    def __init__(self, llm_type=None):
        self.interaction_mode = InteractionMode(llm_type)
        self.user_request = None
        self.user_images = None
        self.design_outline = None
        self.recruitment_status = None
        self.workflows = []
        self.combined_workflow = None
        self.retrieved_workflow = None
        self.final_workflow = []
    
    def get_input(self, user_request, design_outline, user_images):
        self.user_request = user_request
        self.design_outline = design_outline
        self.user_images = user_images
        return None

    def expert_recruit(self):
        self.recruitment_status = None
        self.recruitment_status = self.interaction_mode.expert_recruit(expert_recruit_prompt, self.user_request, self.user_images)
        self.recruitment_status = postprocess_response(self.recruitment_status)

        parsed_data = None
        try:
            parsed_data = ast.literal_eval(self.recruitment_status)
        except (SyntaxError, ValueError):
            try:
                parsed_data = json.loads(self.recruitment_status)
            except (json.JSONDecodeError, TypeError):
                parsed_data = None

        if isinstance(parsed_data, list):
            self.recruitment_status = parsed_data
        else:
            pass
        res_type = type(self.recruitment_status)
        return self.recruitment_status, res_type
    
    def generate_workflow(self):
        self.workflows = []
        for state in self.recruitment_status:
            expert = state['expert']
            task = state['task']
            workflow = self.interaction_mode.generate_workflow(generate_workflow_prompt, expert, task, self.design_outline, self.user_images)
            workflow = postprocess_response(workflow)
            self.workflows.append(workflow)
        res_type = type(self.workflows)
        return self.workflows, res_type
    
    def combine_workflow(self):
        self.combined_workflow = None
        self.combined_workflow = self.interaction_mode.combine_workflow(combine_workflow_prompt, self.workflows, self.recruitment_status)
        for each_workflow in self.combined_workflow:
            each_workflow = postprocess_response(each_workflow)
        try:
            self.combined_workflow = json.loads(self.combined_workflow)
        except: pass
        res_type = type(self.combined_workflow)
        return self.combined_workflow, res_type

    def retrieve_tool(self):
        self.retrieved_workflow = None
        self.final_workflow = []

        self.retrieved_workflow = self.interaction_mode.retrieve_tool(retrieve_prompt, self.combined_workflow)
        self.retrieved_workflow = postprocess_response(self.retrieved_workflow)

        try:
            for each_workflow in self.retrieved_workflow:
                each_workflow = json.loads(each_workflow)
                for each_step in each_workflow:
                    self.final_workflow.append(each_step)
        except:
            self.final_workflow = self.retrieved_workflow
        res_type = type(self.final_workflow)
        return self.final_workflow, res_type



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_path", type=str)
    parser.add_argument("--output_path", type=str)
    parser.add_argument("--llm", type=str, default="meta-llama/Llama-3.1-8B-Instruct")
    args = parser.parse_args()

    planner = Planner(llm_type=args.llm)

    # Step 1: Read existing IDs from the output file (if exists)
    processed_ids = set()
    if os.path.exists(args.output_path):
        with open(args.output_path, 'r') as outfile:
            for line in outfile:
                try:
                    existing_data = json.loads(line)
                    processed_ids.add(existing_data.get("id"))
                except json.JSONDecodeError:
                    continue  # Skip corrupted lines

    # Step 2: Process only new IDs
    with open(args.input_path, 'r') as file, open(args.output_path, 'a') as outfile:
        for line in file:
            data = json.loads(line)
            id = data.get("id")

            if id in processed_ids:
                continue  

            user_query = data.get("user_query")
            design_choices = data.get("design_choices")
            images = data.get("images")

            print("ID: ", id)
            print("User Query: ", user_query)
            print("User Design Choices: ", design_choices)
            print("User Image: ", images)
            print("="*150)

            planner.get_input(user_query, design_choices, images)

            recruitment_status, res_type = planner.expert_recruit()
            print(f"Recruitment Status [{res_type}]: \n", recruitment_status)
            print("="*150)

            workflows, res_type = planner.generate_workflow()
            print(f"Workflows [{res_type}]: \n", workflows)
            print("="*150)

            combined_workflow, res_type = planner.combine_workflow()
            print(f"Combined Workflow [{res_type}]: \n", combined_workflow)
            print("="*150)

            retrieved_workflow, res_type = planner.retrieve_tool()
            print(f"Final workflow [{res_type}]: \n", retrieved_workflow)
            print("="*150)
            print("\n\n")

            output_data = {
                "ID": id,
                "user_query": user_query,
                "design_choices": design_choices,
                "images": images,
                "recruitment_status": recruitment_status,
                "workflows": workflows,
                "combined_workflow": combined_workflow,
                "final_workflow": retrieved_workflow
            }
            outfile.write(json.dumps(output_data, ensure_ascii=False) + "\n")
            outfile.flush()
