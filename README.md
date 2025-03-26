# <img src="https://github.com/user-attachments/assets/d585178d-9fe9-4d71-8347-4ba181065a26" style="width: 30px;" alt="design"> GraphicBench: A Planning Benchmark for Graphic Design Generation with Language Agents

Authors: Dayeon Ki*, Tianyi Zhou, Marine Carpuat, Gang Wu**, Puneet Mathur**, Viswanathan Swaminathan** <br>
<sub>(*: This work is done during internship at Adobe Research., **: Co-mentors)</sub>

This repository contains the code and dataset for our paper **GraphicBench: A Planning Benchmark for Graphic Design Generation with Language Agents**.

<div align="center">
<img src="https://github.com/user-attachments/assets/b3415a65-ccac-4468-a291-07602cb95509" style="width: 15px;" alt="code"> <b><a href=https://github.com/dayeonki/designbench>Code</a></b> | <img src="https://github.com/user-attachments/assets/2bd9af9b-2182-4aef-83cd-6e9ca6189a39" style="width: 15px;" alt="data">
 <b><a>Dataset</a></b> | <img src="https://github.com/user-attachments/assets/fc2ca3c2-3e78-4ca4-a208-448c0a6c7068" style="width: 15px;" alt="paper"> <b><a>Paper</a></b>
</div>


## Abstract
Large Language Model (LLM)-powered agents have unlocked new possibilities for automating human tasks. While prior work has focused on well-defined tasks with specified goals, the capabilities of agents in creative design tasks with _open-ended_ goals remain underexplored. We introduce **GraphicBench**, a new planning benchmark graphic design generation with 1,079 user queries and input images across four design types. We further present **GraphicTown**, an LLM agent framework with three design experts and 46 actions to choose from for executing each step of the planned workflows in web-based design tool environments.
Experiments with six LLMs demonstrate their ability to generate workflows that integrate both explicit design constraints from user queries and implicit commonsense constraints. However, these workflows often do not lead to successful execution outcomes, primarily due to challenges in: 1) reasoning about spatial relationships, 2) coordinating global dependencies across agents, and 3) retrieving the most appropriate action at each step. We envision GraphicBench as a challenging yet valuable testbed for advancing LLM-driven planning and execution in creative design tasks.

<p align="center">
<img width="728" alt="Screenshot 2025-03-21 at 1 48 51 PM" src="https://github.com/user-attachments/assets/39590db8-e3d6-4b24-ad92-85ea5c30255d" />
</p>


## Quick Links
- [Overview](#overview)
- [GraphicBench](#graphicbench)
- [GraphicTown](#graphictown)
- [Evaluation](#evaluation)


## Overview
Recent advances of Large Language Models (LLMs) have expanded the potential for automating various human tasks. However, research on the planning capabilities of LLM agents for creative design tasks remains limited. **Design planning** involves translating a high-level user request into a structured workflow composed of executable sub-tasks that collectively produce the final design. This is inherently complex, posing multiple challenges in terms of handling user queries, planning workflows, and evaluating design outcomes:

1. Planning for a complex design often requires involvement of multiple expert agents.
2. Planning a design workflow is long-horizon, involving a large number of interdependent decisions across agents, with an expansive action space to explore.
3. Design planning must accommodate both explicit constraints from user queries (e.g., _the title text color must be white_) and implicit constraints inferred through commonsense reasoning (e.g., _the background should contrast with the color of text elements_) since user queries might be incomplete and lack explicit details necessary for planning.
4. Assessing design outcomes is inherently subjective, as the notion of _better_ design varies among individuals.

These challenges raise a key question: Can multiple LLM agents collaboratively plan a cohesive workflow for creative design tasks?


## GraphicBench
GraphicBench contains 1,079 pairs of diverse user queries and input images across four types of graphic design: book covers, business cards, postcards, and posters. The dataset is divided into training and test sets, with the training set containing 5 instances per design type with human-annotated reference plans (20 pairs in total) and the test set comprising 1,059 instances.

- **Training set:** `data/graphicbench_train.jsonl`
- **Test set:** `data/graphicbench_test.jsonl`
- **Human annotation interface:** `human_annotation/`

<p align="center">
<img width="772" alt="Screenshot 2025-03-21 at 1 48 51 PM" src="https://github.com/user-attachments/assets/d966d561-7623-4694-a732-c75befc0b417" />
</p>


## GraphicTown
We propose a LLM agent framework, GraphicTown to evaluate the creative design planning abilities of LLM agents on GraphicBench. GraphicTown consists of the following steps:

1. A supervisor agent generates a design outline based on the user query and image captions.
2. The supervisor agent recruits expert agents and forms an expert group.
3. Each expert agent generates individual workflow plans.
4. The supervisor agent integrates individual workflows into a cohesive plan.
5. The supervisor agent retrieves appropriate actions for each workflow step.
6. Each step in the planned workflow is executed to produce a final design outcome. For action retrieval, we define a set of 46 actions executable within three web-based design tool environments.

### (1) Planning phase
The planning phase covers from step 1 to 5.

To run the planner code,
```bash
python -u planning/planner.py \
  --input_path $PATH_TO_INPUT_FILE \
  --output_path $PATH_TO_OUTPUT_FILE \
  --llm $LLM
```

Arguments for the planner code are as follows:
  - `--input_path`: Path to input data file.
  - `--output_path`: Save path of output file (after rewriting).
  - `--llm`: The name or path of a transformers-based pre-trained checkpoint. You can directly refer to the Huggingface model.

The output file will contain the intermediate results (recruitment status, individual workflows of expert agent(s), the combined workflow) and the final workflow with mapped actions. It follows the below format:
```
output_data = {
    "id": id,
    "user_query": user_query,
    "design_choices": design_choices,
    "images": images,
    "recruitment_status": recruitment_status,
    "workflows": workflows,
    "combined_workflow": combined_workflow,
    "final_workflow": retrieved_workflow
}
```

Planning results for each model are in:
- **GPT-3.5:** `planning/results/chatgpt`
- **LLaMA-3.1 8B:** `planning/results/llama8b`
- **Gemma-2 9B:** `planning/results/gemma9b`
- **Gemma-2 27B:** `planning/results/gemma27b`
- **Qwen-2.5 7B:** `planning/results/qwen7b`
- **Qwen-2.5 14B:** `planning/results/qwen14b`


### (2) Execution phase
The execution phase refers to step 6. 

To run the execution code, you need to be using a Darwin system and have <a href="https://www.adobe.com/creativecloud.html">Adobe Creative Cloud applications</a> downloaded in your Desktop.
```bash
python -u execution/executor_darwin.py \
  --input_path $PATH_TO_INPUT_FILE
```

Arguments for the executor code are as follows:
  - `--input_path`: Path to input data file.
  - Execution outcome will be saved according to the path referred in the planned workflow.

#### Executable Javascript files
Since Adobe Creative Cloud applications do not support direct API calls, we utilize their scripting environment to execute the actions. We provide manually written JavaScript codes that only require parameter values as inputs. Parameter keys for each action are defined based on Adobe’s scripting guides. Javascript for each Adobe application are in:

- **Photo Editor (Adobe Photoshop):** `execution/skillset/ps`
- **Vector Graphic Editor (Adobe Illustrator):** `execution/skillset/ai`
- **Layout Designer (Adobe InDesign):** `execution/skillset/id`


## Evaluation
### (1) Workflow Evaluation

We define four evaluation criteria:
- **Delivery Rate:** This metric measures whether agents can successfully deliver a workflow within a limited number of steps. The step limit is determined by the difficulty level, based on the number of expert agents involved: 1) Easy: 1 expert, max 10 steps; 2) Medium: 2 experts, max 20 steps; 3) Hard: 3 experts, max 30 steps. Workflow that fall into dead loops or exceed the step limit are considered as failures.
- **Design Pass Rate:** This metric assesses whether agents can correctly incorporate both explicit design components specified in the user query and implicit commonsense constraints. We prompt GPT-4 to provide a score from 1 to 5 for each of the three aspects: color, text, and images.
- **Step Efficiency:** We measure the ratio of non-duplicate steps to the total number of steps.
- **Agent Use Efficiency:** Since a single workflow might involve multiple expert agents, we define efficiency as minimizing the frequency of switching between agents. A higher efficiency score indicates fewer transitions and better agent utilization.

To run evaluation of the planned workflow, run:
```bash
python -u evaluation/evaluation_workflow.py \
  --model $LLM
```
For `--model`, put the model name to evaluate.

  
### (2) Execution Evaluation

We define five evaluation criteria:
- **Execution Success Rate:** This metric measures the success rate of execution attempts, calculated as the percentage of successful executions out of the total executions performed.
- **Fidelity:** A successful design should correctly incorporate the input images specified in the user query. We quantify fidelity using template matching from opencv library.
- **Content Similarity:** We measure the semantic similarity between the user query and the execution outcome using CLIPScore.
- **VQA Pass Rate:** We measure whether the execution outcome aligns with the design components in the user query using Visual Question Answering (VQA). We generate questions for each query by prompting GPT-4. We use a prompt LLaVA-1.5 7b to generate answers as Yes or No. The final pass rate is the average accuracy across all questions.
  - Generated questions for each design type is in: `data/with_questions`
- **Creativity:** We assess the creativity of our design outcomes along two axes: 1) Originality, which measures the uniqueness of the design, and 2) Elaboration, which measures the extent to which the design expands on the information in the user query by adding meaningful details. We prompt GPT-o1 to provide a score from 1 to 5 for each axis.

To run evaluation of the execution outcomes, run:
```bash
python -u evaluation/evaluation_execution.py \
  --model $LLM
```
For `--model`, put the model name to evaluate.


## Citation
```
TBD
```
