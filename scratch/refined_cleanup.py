
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # Fix the map closure corruption where it matches 'idx) => { ... })' or similar
    # Pattern 1: idx) => { ... })}) -> idx) => { ... }; })}
    # This happens when it uses a block return
    
    # Match map with block return
    # .map((...) => { ... return ( ... ); })
    # The corruption changed it to something else.
    
    # Actually, let's just fix the tokens at the end of the line.
    
    # 1. Fix the double-parentheses map closure in complexity/code
    # Matches: ))}); \n \n return
    new_content = re.sub(r'\)\)\s*\}\s*;\s*\n\s*return', r'          </div>\n        ))}\n      </div>\n    </div>\n  );\n\n  return', new_content)
    
    # 2. Fix the single-div truncation in complexity/explanation
    # Matches: </p> \n ); \n \n const
    new_content = re.sub(r'<\/p>\s*\n\s*\)\s*;\s*\n\s*const', r'</p>\n      </div>\n    </div>\n  );\n\n  const', new_content)
    
    # 3. Fix the map closure in visualization (Selection Sort style)
    # Matches: </motion.div> \n </Reorder.Item> \n )}) \n </Reorder.Group>
    new_content = re.sub(r'<\/Reorder\.Item>\s*\n\s*\}\s*\)\s*\}\s*\n\s*<\/Reorder\.Group>', r'</Reorder.Item>\n            );\n          })}\n        </Reorder.Group>', new_content)

    # 4. Fix general map return missing };
    # Matches: ); \n }) \n
    # Only if it follows a return (
    # This is common in graph/array files.
    # But wait, we want to be careful.
    
    # 5. Fix the linked-list-basics specific corruption
    new_content = new_content.replace('NULL);', 'NULL\n      </div>\n    </div>\n  );')
    
    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    if "graphs" in root: continue
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))
