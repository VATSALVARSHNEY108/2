import os

content_dir = 'content'

for root, dirs, files in os.walk(content_dir):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Fix the first replacement
            target1_1 = 'height:"calc(100vh - 124px)", background:"#0d1117", color:"#c9d1d9", fontFamily:"\'JetBrains Mono\',\'Fira Code\',monospace", overflow:"hidden"'
            target1_2 = 'height:"calc(100vh - 64px)", background:"#0d1117", color:"#c9d1d9", fontFamily:"\'JetBrains Mono\',\'Fira Code\',monospace", overflow:"hidden"'
            target1_3 = 'height:"calc(100vh - 140px)", background:"#0d1117", color:"#c9d1d9", fontFamily:"\'JetBrains Mono\',\'Fira Code\',monospace", overflow:"hidden"'
            replacement1 = 'minHeight:"100vh", background:"#0d1117", color:"#c9d1d9", fontFamily:"\'JetBrains Mono\',\'Fira Code\',monospace"'
            
            content = content.replace(target1_1, replacement1)
            content = content.replace(target1_2, replacement1)
            content = content.replace(target1_3, replacement1)
            
            # Fix the second replacement (clean up the buggy PowerShell literal string if present)
            target2_buggy = '{/* BODY */}`n      <div style={{display:"flex", minHeight:"calc(100vh - 124px)", overflow:"hidden"}}>'
            replacement2 = '{/* BODY */}\n      <div style={{display:"flex", minHeight:"calc(100vh - 124px)", overflow:"hidden"}}>'
            content = content.replace(target2_buggy, replacement2)
            
            # And do the actual intended second replacement for files that weren't caught
            target2 = '{/* BODY */}\n      <div style={{display:"flex",flex:1,overflow:"hidden"}}>'
            content = content.replace(target2, replacement2)
            
            # Also catch Windows CRLF
            target2_crlf = '{/* BODY */}\r\n      <div style={{display:"flex",flex:1,overflow:"hidden"}}>'
            replacement2_crlf = '{/* BODY */}\r\n      <div style={{display:"flex", minHeight:"calc(100vh - 124px)", overflow:"hidden"}}>'
            content = content.replace(target2_crlf, replacement2_crlf)
            
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)

print("Replacement complete!")
