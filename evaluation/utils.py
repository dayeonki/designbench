import json
import re
import textwrap


def convert_to_num(output):
    if isinstance(output, (int, float)):
        return output
    
    if isinstance(output, str):
        try:
            return int(output) if output.isdigit() else float(output)
        except:
            return 1
    return 1


def wrap_text(text, width):
        if isinstance(text, dict):
            text = str(text)
        elif not isinstance(text, str):
            text = str(text)
        return "\n".join(textwrap.wrap(text, width))
    

def json_to_list(json_object):
    json_object = json_object.replace("```json", "").replace("```", "")
    json_object = json.loads(json_object)
    return json_object


def clean_json_string(json_str):
    json_str = re.sub(r',\s*\]', ']', json_str)
    json_str = re.sub(r"(?<=: )'([^']+)'", r'"\1"', json_str)
    return json_str


def extract_json_block(text):
    match = re.search(r'```json(.*?)```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None


def format_bullet_point(json_data, indent_level=0):
    indent = "  " * indent_level
    result = []
    if isinstance(json_data, dict):
        for key, value in json_data.items():
            if isinstance(value, (dict, list)):
                result.append(f"{indent}- **{key}:**")
                result.append(format_bullet_point(value, indent_level + 1))
            else:
                result.append(f"{indent}- **{key}:** {value}")
    elif isinstance(json_data, list):
        for item in json_data:
            result.append(f"{indent}- {format_bullet_point(item, indent_level)}")
    else:
        result.append(f"{indent}{json_data}")
    
    return "\n".join(result)
