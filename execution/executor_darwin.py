import argparse
import json
import subprocess
import platform
import sys
from utils import *


# ------------------------ Executor ------------------------
class Executor:
    def __init__(self):
        pass

    def check_system(self):
        print("System: ", platform.system())
        if platform.system() != 'Darwin':
            print("This script can only be run on macOS.")
            sys.exit(1)
        else: pass

    def convert_param(self, param):
        try:
            return int(param)
        except ValueError:
            try:
                return float(param)
            except ValueError:
                return param

    def execute_script(self, expert, skill, parameters):
        parameters_values = [self.convert_param(value) for value in parameters.values()]
        parameters_list = ", ".join([f'"{v}"' if isinstance(v, str) else str(v) for v in parameters_values])

        if expert == "Layout Designer":
            app_name = "InDesign 2025"
            file_path = f"skillset/id/{skill}.jsx"
            applescript = f"""
                tell application "Adobe {app_name}"
                    activate
                    delay 1
                    set jsFile to POSIX file "{file_path}"
                    do script jsFile language javascript with arguments {{{parameters_list}}}
                end tell
            """

        elif expert == "Photo Editor":
            app_name = "Photoshop 2025"
            file_path = f"skillset/ps/{skill}.jsx"
            applescript = f"""
            tell application "Adobe {app_name}"
                activate
                delay 1
                do javascript file (POSIX file "{file_path}") with arguments {{{parameters_list}}}
            end tell
            """

        elif expert == "Vector Graphic Editor":
            app_name = "Illustrator"
            file_path = f"skillset/ai/{skill}.jsx"
            applescript = f"""
            tell application "Adobe {app_name}"
                activate
                delay 1
                do javascript file (POSIX file "{file_path}") with arguments {{{parameters_list}}}
            end tell
            """
        else:
            raise ValueError("Expert should be one of the following: Layout Designer, Photo Editor, Vector Graphic Editor.")

        result = subprocess.run(['osascript', '-e', applescript], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        execution_output = result.stdout.strip()
        execution_error = result.stderr.strip()

        print("Output: ", execution_output)
        print("Error: ", execution_error)

        return execution_output, execution_error 


    def execute_each_step(self, current_step):
        execution_output, execution_error = None, None
        
        expert = current_step["expert"]
        skill = current_step["skill"]
        parameters = current_step["parameters"]
        
        execution_output, execution_error = executor.execute_script(expert, skill, parameters)
        return execution_output, execution_error



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_path", type=str)
    args = parser.parse_args()

    executor = Executor()
    executor.check_system()

    with open(args.input_path, 'r') as file:
        for line in file:
            data = json.loads(line)
            final_workflow = data.get("final_workflow")

            for each_step in final_workflow:
                execution_output, execution_error = executor.execute_each_step(args.planning, each_step)
                print("Output: ", execution_output)
                print("Error: ", execution_output)
