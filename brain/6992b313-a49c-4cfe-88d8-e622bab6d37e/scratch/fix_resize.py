import os
import re

content_dir = 'content/dsa/trees'

target_float_panel = """    <div style={{
      position: "absolute", left: pos.x, top: pos.y, width,
      background: "rgba(22,27,34,0.95)", border: "1px solid #21262d",
      borderRadius: 10, overflow: "hidden", backdropFilter: "blur(8px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)", userSelect: "none", zIndex: 10,
    }}>"""

replacement_float_panel = """    <div style={{
      position: "absolute", left: pos.x, top: pos.y, minWidth: width,
      background: "rgba(22,27,34,0.95)", border: "1px solid #21262d",
      borderRadius: 10, overflow: "auto", backdropFilter: "blur(8px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)", userSelect: "none", zIndex: 10,
      resize: "both"
    }}>"""

# We also want to add whiteSpace: "nowrap" to the logic tracker line
target_logic_span = """<span style={{fontSize:11,color:step.line===i?"#c9d1d9":"#484f58",fontFamily:"inherit"}}>{line}</span>"""
replacement_logic_span = """<span style={{fontSize:11,color:step.line===i?"#c9d1d9":"#484f58",fontFamily:"inherit",whiteSpace:"nowrap"}}>{line}</span>"""

count = 0

for root, dirs, files in os.walk(content_dir):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            original_content = content
            
            content = content.replace(target_float_panel, replacement_float_panel)
            content = content.replace(target_logic_span, replacement_logic_span)
            
            # Windows CRLF variations
            target_float_panel_crlf = target_float_panel.replace('\n', '\r\n')
            replacement_float_panel_crlf = replacement_float_panel.replace('\n', '\r\n')
            content = content.replace(target_float_panel_crlf, replacement_float_panel_crlf)
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1

print(f"Made FloatPanels resizable in {count} files.")
