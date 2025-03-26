expert_recruit_prompt = """Task: Your task is to recruit the necessary experts to complete a design outlined in the user request. Create a recruitment status in JSON list format.

User request: {{user_request}}

User provided the image urls to use in their design:
{{user_images}}

You can recruit from the following three experts. Below are the profiles for each expert:
(1) Photo Editor
- Job Responsibilities: 
    - Image editing: Cropping, adjusting composition, correcting lighting and retouching images or illustrations.
    - Color correction: Adjusting brightness and contrast or adjusting hue and saturation.
    - Apply filters: Apply different filters (photo, glass, glow, ocean ripple, stained glass) to images.

(2) Vector Graphic Editor
- Job Responsibilities:
    - Draw shapes: Drawing simple shapes (circle, polygon, square, star) on canvas.

(3) Layout Designer
- Job Responsibilities: 
    - Customize layout templates: Create grid systems for books, brochures, cards, and magazines to organize the layout.
    - Export files: Export documents to any format, in print or digital.
    - Combine text and visual elements: Combine visual elements from other apps with text into a completed design.

*** Output format ***
Each JSON object in the JSON list should follow:
```json {{"expert": Name of the expert (Photo Editor, Vector Graphic Editor, Layout Designer), "task": Task that can be performed by the expert}}```

*** Example Starts ***
[{"expert": "Photo Editor", "task": "Add the provided images to create a deep purple night sky background with a large dreamy moon centered, surrounded by small twinkling stars spread across the top half of the cover."}, {"expert": "Layout Designer", "task": "Combine the edited image with the title 'Moonlit Fantasies', the author name 'J.K. Stellar', and the tagline 'A Journey Through the Night Sky.' to create the book cover design."}]
*** Example Ends ***

*** Key requirements ***
- Only recruit each expert one.
- The name of the expert must match those in the expert profiles.
- For task description, explain how the expert can contribute towards the final product. Summarize in one sentence.
- In order to achieve the task in the design outline, experts should work together and their task will be dependent to each other. Arrange in the order of which expert should finish first.
- Output should be in a list of JSON objects format.
- Do NOT include further explanation other than in the JSON list.
- Be as concise and brief as possible.

Recruitment status: """



generate_workflow_prompt = """Task: You are a proficient {{expert}}. You are recruited to collaborate on a design project with other experts.

The design choices collected from the user have been compiled into the following design outline. Use as reference:
{{outline}}

User provided the image urls to use in their design:
{{user_images}}

You are assigned to complete the following task as in the design outline: {{task}}. Please plan a sequence of detailed, low-level subtasks required to accomplish this task and output them as a JSON list.

*** Output format ***
Each JSON object in the JSON list should follow:
```json {{"id": ID of the subtask, starting from 1, "expert": Name of the expert, "description": Description of the subtask in one sentence}}```

*** Example Starts ***
[
    {"id": 1, "expert": "Photo Editor", "description": "Create a new document with book cover dimensions."},
    {"id": 2, "expert": "Photo Editor", "description": "Set the background color to light pink."},
    {"id": 3, "expert": "Photo Editor", "description": "Import the pink moonlit image from 'static/pink_moonlit.png'."},
    {"id": 4, "expert": "Photo Editor", "description": "Resize the pink moonlit image to medium size, covering the bottom part of the document."},
    {"id": 5, "expert": "Photo Editor", "description": "Reposition the pink moonlit image to the bottom-center of the document."},
    {"id": 6, "expert": "Photo Editor", "description": "Import the couple silhouette illustration from 'static/couple_silhouette.png'."},
    {"id": 7, "expert": "Photo Editor", "description": "Resize the couple silhouette illustration to span across the lower half of the cover."},
    {"id": 8, "expert": "Photo Editor", "description": "Reposition the couple silhouette illustration to be centered in the bottom-middle part."},
    {"id": 9, "expert": "Photo Editor", "description": "Adjust the background colors to match the light pink moonlit theme."},
    {"id": 10, "expert": "Photo Editor", "description": "Save the document in a psd format suitable for further editing by the Layout Designer."},
]
*** Example Ends ***

*** Key requirements ***
- First step should always be creating a new document and the last step should always be saving the document in appropriate file format.
- Use the exact image URLs the user provided when importing images.
- Do not include very basic operations such as opening the software or closing the software.
- Do not include new expert in the plan.
- Output should be in a list of JSON objects format.
- Do NOT include further explanation other than in the JSON list.
- Be as concise and brief as possible.

Sequence of subtasks: """



combine_workflow_prompt = """Task: You are the supervisor of a design project that requires collaboration among various design experts.

The following experts have been recruited for the project. Use as reference:
{{recruitment_status}}

Each expert has submitted their proposed workflow plans:
{{workflow}}

Your task is to combine these proposed workflow plans into a cohesive sequence of tasks in a JSON list format.

*** Output format ***
Each JSON object in the JSON list should follow:
```json {{"id": ID of the subtask, "expert": Name of the expert, "description": Description of the subtask in one sentence}}```

*** Example Starts ***
[
    {"id": 1, "expert": "Photo Editor", "description": "Create a new document with book cover dimensions."},
    {"id": 2, "expert": "Photo Editor", "description": "Set the background color to light pink."},
    ...
    {"id": 11, "expert": "Layout Designer", "description": "Create a new document with book cover dimensions."},
    {"id": 12, "expert": "Layout Designer", "description": "Import the edited image from the Photo Editor: 'moonlit_illustration_edited.psd'."},
    {"id": 13, "expert": "Layout Designer", "description": "Resize the edited image to cover the entire document."},
    {"id": 14, "expert": "Layout Designer", "description": "Create text for the title 'LOVE\nSTORY'."},
    {"id": 15, "expert": "Layout Designer", "description": "Apply the Andale Mono font to the title text."},
    ...
    {"id": 31, "expert": "Layout Designer", "description": "Reposition the tagline text above the title."},
    {"id": 32, "expert": "Layout Designer", "description": "Export the final book cover design as a PDF file."}
]
*** Example Ends ***

*** Key requirements ***
- Do NOT repeat any steps that are already completed in previous step.
- For each expert, first step should always be creating a new document and the last step should always be saving the document in appropriate file format.
- When switching experts, use the output from the previous expert as input for the next.
- Once an expert is used and switched to another expert, it should not be used again.
- You should output only one list of workflow plan.
- Start the id from 1 to the number of steps in the workflow.
- Arrange each subtask in a chronological order.
- Output should be in a list of JSON objects format.
- Do NOT include further explanation other than in the JSON list.
- Be as concise and brief as possible.

Supervised sequence of subtasks: """



retrieve_prompt = """Task: You are a proficient {{expert}}. You are recruited to collaborate on a design project with other experts.
Use your skill sets to map each step to a skill set.

Sequence of subtasks: {{workflow}}

Your available skill sets are as below:
{{skillsets}}

*** Output format ***
Each JSON object in the JSON list should follow:
```json {{"id": ID of the subtask, "expert": Name of the expert, "description": Description of the subtask in one sentence, "skill": Name of the skill, "parameters": Dictionary of parameter keys and corresponding values}}```

*** Example Starts ***
[
    {"id": 1, "expert": "Photo Editor", "description": "Create a new document with book cover dimensions.", "skill": "CreateDocument", "parameters": {"docType": "book cover"}},
    {"id": 2, "expert": "Photo Editor", "description": "Set the background color to light pink.", "skill": "SetBackgroundColor", "parameters": {"red": 255, "green": 179, "blue": 238}},
    ...
    {"id": 8, "expert": "Photo Editor", "description": "Reposition the couple silhouette illustration to be centered in the bottom-middle part.", "parameters": {"layerName": "SilhouetteLayer", "posX": 267, "posY": 1052}},
    {"id": 9, "expert": "Photo Editor", "description": "Adjust the background colors to match the light pink moonlit theme.", "skill": "AdjustHSL", "parameters": {"layerName": "MoonlitLayer", "hue": 18, "saturation": -18, "light": 0}},
    {"id": 10, "expert": "Photo Editor", "description": "Save the document in a format suitable for further editing by the Layout Designer.", "skill": "SaveDocument", "parameters": {"fileName": "moonlit_illustration_edited", "format": "psd"}},
]
*** Example Ends ***

*** Key requirements ***
- For any file name that appears in the design outline, use exact file names in your sequence of subtasks.
- Each step should only be mapped to one action. If a step of the workflow is not able to be mapped to one action, it means the step can be decomposed further into multiple steps. You can reformat, reorder, add, edit steps of the workflow if needed to be directly mapped to actions.
- Each step should have an action and a dictionary of parameter values.
- For layerName, try to name it as to end as Layer (e.g., BackgroundLayer, TitleLayer).
- For detailed numeric values (e.g., height, width, x-axis position, y-axis position), consider the document's dimensions, imagine, and propose a likely value.
- Arrange each subtask in a chronological order.
- Output should be in a list of JSON objects format.
- Do NOT include further explanation other than in the JSON list.
- Be as concise and brief as possible.

Sequence of subtasks: """