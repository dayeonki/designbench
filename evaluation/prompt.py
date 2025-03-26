color_prompt = """Instruction: Evaluate if some part of the workflow plan (1) correctly applies the background color and (2) the background and the text color are contrasting. Return a score between 1 to 5 according to the scoring rubric.

Background color: {{background_color}}
Text elements: {{text}}

Workflow plan: 
{{workflow}}

Scoring rubric:
- 1: Workflow plan fails to reflect any of the color constraints specified.
- 3: Workflow plan reflects approximately half of the color constraints specified.
- 5: Workflow plan reflects all of the color constraints specified.

Score should strictly be a number between 1 to 5. Do not include any further explanation other than the score.
Score: """


text_prompt = """Instruction: Evaluate if some part of the workflow plan adequately applies the text elements (e.g., title, tagline) specified. Return a score between 1 to 5 according to the scoring rubric.

Text elements: {{text}}

Workflow plan: 
{{workflow}}

Scoring rubric:
- 1: Workflow plan fails to reflect any of the text elements specified.
- 3: Workflow plan reflects approximately half of the text elements specified.
- 5: Workflow plan reflects all of the text elements specified.

Score should strictly be a number between 1 to 5. Do not include any further explanation other than the score.
Score: """


visual_prompt = """Instruction: Evaluate if some part of the workflow plan adequately applies the visual elements (e.g., size, position) specified. Return a score between 1 to 5 according to the scoring rubric.

Visual elements: {{visual}}

Workflow plan: 
{{workflow}}

Scoring rubric:
- 1: Workflow plan fails to reflect any of the visual elements specified.
- 3: Workflow plan reflects approximately half of the visual elements specified.
- 5: Workflow plan reflects all of the visual elements specified.

Score should strictly be a number between 1 to 5. Do not include any further explanation other than the score.
Score: """


originality_prompt = """Instruction: Evaluate the originality of the image generated based on the user query. Originality measures the uniqueness of the ideas generated. Original ideas are those that are rare or unconventional, differing from the norm. Return a score between 1 to 5 according to the scoring rubric.

User query: {{user_query}}

Scoring rubric:
- 1: Image is highly conventional and predictable. No significant signs of creative thinking is shown.
- 2: Image shows minimal originality and mostly align with typical or common responses. Few novel elements are present.
- 3: Image is somewhat original, with a mix of conventional and unique elements.
- 4: Image is noticeable original and uncommon. It shows creative thinking and depart meaningfully from conventional norms.
- 5: Image is highly unique, rare, and stand out as unconventional. They demonstrate a strong departure from typical or expected approaches.

Score should strictly be a number between 1 to 5. Do not include any further explanation other than the score.
Score: """


elaboration_prompt = """Instruction: Evaluate the elaboration of the image generated based on the user query. Elaboration refers to the ability to expand upon, refine, and embellish an idea. It involves adding details, developing nuances, and building upon a basic concept to make it more intricate or complex. Return a score between 1 to 5 according to the scoring rubric.

User query: {{user_query}}

Scoring rubric:
- 1: Image is presented in a simpler or vague manner with no meaningful development or supporting detail.
- 2: Image is minimally expanded, with few details or refinements added.
- 3: Image includes expansion of some details, but elaboration is somewhat surface-level.
- 4: Image well-expands the user query with several added details and refinements.
- 5: Image thoroughly expands the user query with rich, specific details or refinements added beyond the core concept.

Score should strictly be a number between 1 to 5. Do not include any further explanation other than the score.
Score: """