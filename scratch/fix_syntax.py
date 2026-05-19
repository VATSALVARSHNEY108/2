import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\arrays"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern for truncated return statements in these files
    # Usually they end with something like:
    # {heights.map((h, i) => { ... return ( ... ); }) }); }
    
    # We want to find the return statement of the main component.
    # It starts with 'return (' and ends with ');'
    
    # But wait, many files are truncated before the final closing tags.
    # Let's look for the point where the main map ends.
    
    # Pattern 1: {step.array.map(...) => ( ... ) }); }
    # Pattern 2: {heights.map(...) => { ... return ( ... ); }) }); }
    
    # Actually, let's just count open/close braces and tags in the whole file and fix the tail.
    
    # First, let's fix the common line-level errors like:
    # {isL ? "L" : isR ? "R" : i});
    # into
    # {isL ? "L" : isR ? "R" : i}</div>
    
    # Find the line that ends with }); inside the map.
    
    lines = content.splitlines()
    new_lines = []
    in_map = False
    map_start_line = -1
    
    # This is tricky because the files are very similar but not identical.
    # Let's try a simpler approach.
    # Find the line that looks like: ... { ... } });
    # and has a missing </div> before it.
    
    changed = False
    for i, line in enumerate(lines):
        # Look for lines like: {isL ? "L" : isR ? "R" : i});
        # or {val}</div> ... (missing </div>)
        if "});" in line and "map" not in line and "setInterval" not in line and "setPanels" not in line and "steps.push" not in line:
            # Check if it's the truncated end
            if i > len(lines) - 10:
                # This is likely the truncated end.
                pass
    
    # Alternative: Use the known structure.
    # The files always define constants like btnStyle at the end.
    # If the file is truncated, those constants might be after the truncation point or missing.
    
    # Let's look at sort-colors.tsx:
    # 272:                       {(!isLow && !isMid && !isHigh) && <div style={{ fontSize: 9, color: COLORS.textDark }}>[{i}]</div>});
    # 273:               })});
    # 274: }
    
    # Line 272 is clearly wrong. It has }); at the end instead of </div>
    
    fixed_content = re.sub(r'(\s+)<div[^>]*>\{[^}]+\}\);', r'\1<div>\g<1></div>', content) # Too generic
    
    # Let's target the exact patterns from view_file.
    
    # For two-sum.tsx:
    # {i === step.left ? "L" : i === step.right ? "R" : `[${i}]`});
    # For trapping-rain-water.tsx:
    # {isL ? "L" : isR ? "R" : i});
    # For sort-colors.tsx:
    # {(!isLow && !isMid && !isHigh) && <div style={{ fontSize: 9, color: COLORS.textDark }}>[{i}]</div>});
    
    # They all seem to have been truncated and then had '}); }' appended or something.
    
    # Let's try to find the 'map' and rebuild the tail.
    
    # I'll use a more manual approach for a few and see if I can find a better regex.
    
    return None

def manual_fix_content(content, filename):
    # Standard tail for these files:
    #                 );
    #               })}
    #             </div>
    #           </div>
    #         </div>
    #       </div>
    #     </div>
    #   </div>
    # );
    # }
    
    # But wait, some have more or fewer divs.
    
    # Let's count divs in the return block.
    return content

# I will use the tool to fix them in batches of 5.
