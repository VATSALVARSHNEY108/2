
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # Selection Sort & friends specific fixes
    
    # 1. Map closure in visualization
    new_content = new_content.replace('            )})', '            );\n          })}')
    
    # 2. Variable closure truncation
    new_content = new_content.replace('      ))});', '          </div>\n        ))}\n      </div>\n    </div>\n  );')
    new_content = new_content.replace('    ))});', '          </div>\n        ))}\n      </div>\n    </div>\n  );')
    new_content = new_content.replace('  ))});', '          </div>\n        ))}\n      </div>\n    </div>\n  );')
    
    # 3. Simple div truncation
    # If a line has ); and it's not followed by anything, it might be a truncated variable.
    # But only if it's within the SimulationStudio props.
    
    # Let's fix the ones we saw in the view_file
    new_content = re.sub(r'\{step\.message\}\s*\);\s*\n\s*const explanation', r'{step.message}\n      </div>\n    </div>\n  );\n\n  const explanation', new_content)
    new_content = re.sub(r'already sorted\.\s*<\/p>\s*\n\s*\)\s*;\s*\n\s*const code', r'already sorted.</p>\n      </div>\n    </div>\n  );\n\n  const code', new_content)

    # 4. Linked List Basics specific
    new_content = new_content.replace('NULL);', 'NULL\n      </div>\n    </div>\n  );')
    new_content = new_content.replace('))});', '))}\n      </div>\n    </div>\n  );')

    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    if "graphs" in root: continue
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))
