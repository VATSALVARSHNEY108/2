
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # Use re.MULTILINE and better whitespace matching
    
    # 1. Fix the double-parentheses map closure in complexity/code
    # Matches: ))}); followed by return
    new_content = re.sub(r'\)\)\s*\}\s*;\s*\n\s*return', r'          </div>\n        ))}\n      </div>\n    </div>\n  );\n\n  return', new_content)
    
    # 2. Fix the single-div truncation in complexity/explanation/visualization
    # Matches: {step.message} );
    new_content = re.sub(r'\{step\.message\}\s*\)\s*;\s*\n\s*const', r'{step.message}\n      </div>\n    </div>\n  );\n\n  const', new_content)
    
    # 3. Fix the map closure in visualization (Selection Sort style)
    # Matches: Reorder.Item followed by )}) followed by Reorder.Group
    new_content = re.sub(r'<\/Reorder\.Item>\s*\n\s*\}\s*\)\s*\}\s*\n\s*<\/Reorder\.Group>', r'</Reorder.Item>\n            );\n          })}\n        </Reorder.Group>', new_content)

    # 4. Handle cases with empty lines between the tokens
    new_content = re.sub(r'\)\)\s*\}\s*;\s*\n\s*\n\s*return', r'          </div>\n        ))}\n      </div>\n    </div>\n  );\n\n  return', new_content)
    
    # 5. Fix truncated explanation blocks
    new_content = re.sub(r'<\/p>\s*\n\s*\)\s*;\s*\n\s*const', r'</p>\n      </div>\n    </div>\n  );\n\n  const', new_content)

    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    if "graphs" in root: continue
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))
