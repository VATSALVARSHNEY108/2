const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'content', 'dsa', 'linked-list');

if (!fs.existsSync(dir)) {
  console.log('Dir not found');
  process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let changedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace height: "100vh" or minHeight: "100vh"
  let newContent = content.replace(/height:\s*\"100vh\"/g, 'height: "calc(100vh - 56px)"');
  newContent = newContent.replace(/height:\s*'100vh'/g, 'height: "calc(100vh - 56px)"');
  newContent = newContent.replace(/minHeight:\s*\"100vh\"/g, 'minHeight: "calc(100vh - 56px)"');
  newContent = newContent.replace(/minHeight:\s*'100vh'/g, 'minHeight: "calc(100vh - 56px)"');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    changedCount++;
  }
}

console.log(`Fixed ${changedCount} files in linked-list.`);
