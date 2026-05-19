
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Let's use a very clean set of replacements that match the exact lines
    new_content = content
    
    # 1. Selection Sort Visualization fix
    new_content = new_content.replace('            )})', '            );\n          })}')
    
    # 2. Code block closure (for map with implicit return)
    # The corruption was ))});
    # It should be )} </div> );
    new_content = new_content.replace('      ))});', '      ))}\n    </div>\n  );')
    new_content = new_content.replace('    ))});', '    ))}\n    </div>\n  );')
    new_content = new_content.replace('  ))});', '  ))}\n    </div>\n  );')

    # 3. Complexity/Explanation closure (usually ends with </p> ); )
    new_content = re.sub(r'<\/p>\s*\n\s*\)\s*;\s*\n\s*const', r'</p>\n    </div>\n  );\n\n  const', new_content)
    
    # 4. Step message closure
    new_content = re.sub(r'\{step\.message\}\s*\);\s*\n\s*const explanation', r'{step.message}\n      </div>\n    </div>\n  );\n\n  const explanation', new_content)

    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    if "graphs" in root: continue
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))
