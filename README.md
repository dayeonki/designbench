# GraphicBench: A Planning Benchmark for Graphic Design Generation with Language Agents

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
- [Preliminaries](#preliminaries)
- [MT-Agnostic](#mt-agnostic)
- [Task-Aware](#task-aware)
- [Translate](#translate)
- [Evaluate](#evaluate)

