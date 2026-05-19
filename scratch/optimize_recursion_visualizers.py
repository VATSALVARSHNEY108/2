import os
import re

DIRECTORY = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\recursion-backtracking"

files_to_optimize = [
    "indirect-recursion.tsx",
    "head-recursion.tsx",
    "functional-recursion.tsx",
    "factorial.tsx",
    "expression-add-operators.tsx",
    "dry-run-recursion.tsx",
    "decision-tree-visualization.tsx",
    "constraint-checking.tsx"
]

def to_camel_case(s):
    s = s.replace('.tsx', '')
    words = re.split(r'[^a-zA-Z0-9]+', s)
    return ''.join(w.capitalize() for w in words if w)

def main():
    if not os.path.exists(DIRECTORY):
        print(f"Directory {DIRECTORY} not found!")
        return

    count = 0
    for filename in files_to_optimize:
        path = os.path.join(DIRECTORY, filename)
        if not os.path.exists(path):
            print(f"File {filename} not found, skipping.")
            continue
            
        comp_name = to_camel_case(filename)
        slug = filename.replace(".tsx", "")

        optimized_code = f'''"use client";

import RecursionBacktrackingLessonLab from "../../../components/RecursionBacktrackingLessonLab";

export default function {comp_name}Lesson() {{
  return (
    <RecursionBacktrackingLessonLab
      lessonId="{slug}"
    />
  );
}}
'''
        with open(path, 'w', encoding='utf-8') as f:
            f.write(optimized_code)

        count += 1
        print(f"Successfully optimized: {filename}")

    print(f"Finished! Optimized {count} recursion-backtracking lesson files.")

if __name__ == "__main__":
    main()
