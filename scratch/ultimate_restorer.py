
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Fix corrupted map closures
    # If we have a map with { return ( ... ) }
    # It should end with ); \n })}
    # But it currently ends with )}) or ))});
    
    # Match map start with brace
    # and then the return block
    # and then the broken closure
    
    # This regex looks for a map call that starts with a brace {
    # and ends with )}) or ))}); without the intermediate };
    # Pattern: .map((...) => { ... return ( ... ); } ) }
    
    # Actually, let's fix the most obvious ones first.
    
    # Fix 1: Add missing }; before })} in maps that use braces
    # Regex: Find ); followed by whitespace and })}
    # If the map started with { return (
    # This is hard to do with regex perfectly.
    
    # Let's try to fix the specific corruption in selection-sort.tsx
    # 172:               </Reorder.Item>
    # 173:             )})
    # Should be:
    # 172:               </Reorder.Item>
    # 173:             );
    # 174:           })}
    
    # Actually, a lot of files have:
    # 179:         {step.message});
    # where it should be
    # 179:         {step.message}
    # 180:       </div>
    # 181:     </div>
    # 182:   );
    
    # I will use a list of targeted replacements for the common structures.
    
    new_content = content
    
    # Fix truncated visualization/explanation/complexity/code blocks
    patterns = [
        # Pattern: {step.message}); \n \n const explanation = (
        (r'\{step\.message\}\);\s*\n\s*const explanation = \(', r'{step.message}\n      </div>\n    </div>\n  );\n\n  const explanation = ('),
        # Pattern: {text}\n \n </div> \n ))}); \n \n return (
        (r'\}\)\s*\}\s*\)\s*\}\s*;\s*\n\s*return\s*\(', r'          </div>\n        ))}\n      </div>\n    </div>\n  );\n\n  return ('),
        # Pattern: {line}\n \n </div> \n \)\s*\}\s*\)\s*\}\s*;\s*\n\s*return\s*\(', r'          </div>\n        ))}\n      </div>\n    </div>\n  );\n\n  return ('),
        # Fix the map inside complexity
        (r'\{\s*\[\s*[^\]]+\s*\]\.map\(\(text,\s*i\)\s*=>\s*\(\s*[^;]+?\s*\)\s*\}\s*\)\s*\}\s*;\s*\n\s*return\s*\(', r'          </div>\n        ))}\n      </div>\n    </div>\n  );\n\n  return ('),
    ]
    
    for old, new in patterns:
        new_content = re.sub(old, new, new_content, flags=re.DOTALL)
    
    # Fix the map closures specifically
    # If it's idx) => { ... return ( ... ); })}
    # We want to make sure it's ); \n })}
    
    # This regex targets the map closure corruption
    new_content = re.sub(r'\)\s*\}\s*\)\s*\}', r');\n            })}\n', new_content)
    # Correcting common over-replaces
    new_content = new_content.replace(';;\n', ';\n')
    
    # Fix specific truncation in linked-list-basics.tsx
    new_content = new_content.replace('NULL);', 'NULL\n      </div>\n    </div>\n  );')
    
    # Fix the missing ); for variables
    for var in ['visualization', 'explanation', 'complexity', 'code']:
        # If const var = ( is not followed by ); before the next const or return
        # This is a bit risky.
        pass

    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    if "graphs" in root: continue # Already fixed/migrated
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))
