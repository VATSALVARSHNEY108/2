const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'content', 'dsa', 'linked-list');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let changedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // 1. Change outer div height to minHeight and remove overflow
  content = content.replace(/height:\s*"calc\(100vh - 56px\)"/g, 'minHeight: "calc(100vh - 56px)"');
  
  // Replace the FIRST occurrence of overflow:"hidden" or "auto" or "scroll" (which belongs to the outer div)
  // Let's do a more robust regex to only target the outer div's style.
  // We know it looks like: style={{ display:"flex", flexDirection:"column", minHeight:"calc(100vh - 56px)", background:"#0d1117", color:"#c9d1d9", fontFamily:"'JetBrains Mono','Fira Code',monospace", overflow:"scroll" }}
  content = content.replace(/,\s*overflow:\s*"(?:hidden|auto|scroll)"\s*}\s*}/g, ' } }');
  
  // 2. Change BODY flex to have minHeight
  content = content.replace(/<div style={{display:"flex",flex:1,overflow:"hidden"}}>/g, '<div style={{display:"flex", flex:1, minHeight:"calc(100vh - 130px)", overflow:"hidden"}}>');
  
  // Also try with spaces in case it has them
  content = content.replace(/<div style={{\s*display:"flex",\s*flex:1,\s*overflow:"hidden"\s*}}>/g, '<div style={{display:"flex", flex:1, minHeight:"calc(100vh - 130px)", overflow:"hidden"}}>');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedCount++;
  }
}

console.log(`Fixed ${changedCount} files.`);
