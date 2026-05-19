import os
import re

DIRECTORY = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\trees"

def to_camel_case(s):
    s = s.replace('.tsx', '')
    words = re.split(r'[^a-zA-Z0-9]+', s)
    return ''.join(w.capitalize() for w in words if w)

def main():
    if not os.path.exists(DIRECTORY):
        print(f"Directory {DIRECTORY} not found!")
        return

    count = 0
    errors = 0

    for filename in os.listdir(DIRECTORY):
        if filename.endswith(".tsx"):
            path = os.path.join(DIRECTORY, filename)
            
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Skip if it is already optimized (does not contain the duplicate state boilerplate)
            if "export default function" in content and "TreesLessonLab" in content:
                print(f"Skipping already optimized file: {filename}")
                continue

            # Parse TheorySection props using robust regexes
            title_m = re.search(r'title=["\']([^"\']+)["\']', content)
            def_m = re.search(r'definition=["\']([^"\']+)["\']', content)
            time_m = re.search(r'timeComplexity=["\']([^"\']+)["\']', content)
            space_m = re.search(r'spaceComplexity=["\']([^"\']+)["\']', content)
            
            # KeyPoints match (brackets containing single/double quoted items)
            points_m = re.search(r'keyPoints=\{\[([^\]]+)\]\}', content)

            if not (title_m and def_m and time_m and space_m and points_m):
                print(f"[Warning] Could not parse metadata for {filename}. Using default fallback.")
                slug = filename.replace(".tsx", "")
                title = slug.replace("-", " ").title()
                definition = f"Interactive visual lab exploring {title} algorithms, node balance states, and C++ logic execution."
                time_comp = "O(log N)"
                space_comp = "O(H)"
                points = ["Process nodes in a specific order.", "Handle base cases (null nodes).", "Consider tree balance for performance."]
            else:
                title = title_m.group(1)
                definition = def_m.group(1)
                time_comp = time_m.group(1)
                space_comp = space_m.group(1)
                
                # Parse points array
                raw_points = points_m.group(1)
                points = [p.strip().strip('"').strip("'") for p in raw_points.split(",")]
                points = [p for p in points if p]

            comp_name = to_camel_case(filename)
            slug = filename.replace(".tsx", "")

            # Generate elegant, lightweight visual wrapper
            optimized_code = f'''"use client";

import TreesLessonLab from "../../../components/TreesLessonLab";

export default function {comp_name}Lesson() {{
  return (
    <TreesLessonLab
      lessonId="{slug}"
      title="{title}"
      definition="{definition}"
      timeComplexity="{time_comp}"
      spaceComplexity="{space_comp}"
      keyPoints={{{repr(points)}}}
    />
  );
}}
'''
            with open(path, 'w', encoding='utf-8') as f:
                f.write(optimized_code)

            count += 1
            print(f"Successfully optimized: {filename}")

    print(f"Finished! Optimized {count} tree lesson files. Errors: {errors}")

if __name__ == "__main__":
    main()
