
import os

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    # Selection Sort & others broken code block
    old_code_block = """        </div>
          </div>
        ))}
      </div>
    </div>
  );"""
    
    new_code_block = """        </div>
      ))}
    </div>
  );"""
    
    new_content = new_content.replace(old_code_block, new_code_block)
    
    # Other variants
    new_content = new_content.replace('        </div>\n          </div>\n        ))}\n      </div>\n    </div>\n  );', '        </div>\n      ))}\n    </div>\n  );')
    new_content = new_content.replace('        </div>\n          </div>\n        ))}\n      </div>\n    </div>\n  );', '        </div>\n      ))}\n    </div>\n  );')

    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    if "graphs" in root: continue
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))
