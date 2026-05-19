import os

content_dir = 'content/dsa/trees'

target = 'title="Logic Tracker"'
replacement = 'title="C++ Code Tracker"'

count = 0

for root, dirs, files in os.walk(content_dir):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            original_content = content
            
            content = content.replace(target, replacement)
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1

print(f"Renamed Logic Tracker to C++ Code Tracker in {count} files.")
