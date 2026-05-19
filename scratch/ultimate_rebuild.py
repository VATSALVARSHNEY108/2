
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # Fix the 'code' block over-replacement
    new_content = re.sub(
        r'<\/div>\s*<\/div>\s*\}\)\)\}\s*<\/div>\s*<\/div>\s*;\s*\n\s*\n\s*return',
        r'</div>\n      ))}\n    </div>\n  );\n\n  return',
        new_content, flags=re.DOTALL
    )
    
    # Fix the 'code' block in selection-sort style
    new_content = re.sub(
        r'<\/div>\s*<\/div>\s*\}\)\)\}\s*<\/div>\s*<\/div>\s*;\s*\n\s*return',
        r'</div>\n      ))}\n    </div>\n  );\n\n  return',
        new_content, flags=re.DOTALL
    )
    
    # Fix the specific broken state of selection-sort.tsx
    # 236:         </div>
    # 237:           </div>
    # 238:         ))}
    # 239:       </div>
    # 240:     </div>
    # 241:   );
    new_content = re.sub(
        r'<\/div>\s*<\/div>\s*\}\)\)\}\s*<\/div>\s*<\/div>\s*;',
        r'</div>\n      ))}\n    </div>\n  );',
        new_content
    )

    # Re-fix the Reorder map
    new_content = new_content.replace('            )})', '            );\n          })}')

    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    if "graphs" in root: continue
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))
