import json
import re
import textwrap


def postprocess_response(input):
    try:
        input = extract_json_block(input)
    except: pass
    try:
        processed_input = json_to_list(input)
    except: processed_input = input
    return processed_input


def wrap_text(text, width):
        if isinstance(text, dict):
            text = str(text)
        elif not isinstance(text, str):
            text = str(text)
        return "\n".join(textwrap.wrap(text, width))


def json_to_list(json_object):
    if json_object:
        json_object = json_object.replace("```json", "").replace("```", "")
        json_object = json.loads(json_object)
    return json_object


def extract_json_block(text):
    match = re.search(r'```json(.*?)```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text