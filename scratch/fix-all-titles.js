const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'content', 'dsa', 'linked-list');

function toTitleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let changedCount = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  
  // Extract topic name from filename
  const topicName = path.basename(file, '.tsx');
  const title = toTitleCase(topicName);
  
  // Replace the TheorySection title and definition
  const originalContent = content;
  
  // If the file already has the right title, skip it (like the top 10 I already fixed)
  // We just do a global replace of whatever title is there. 
  // Wait, the regex might be tricky if it spans lines. Let's do a simple replace on the exact props.
  content = content.replace(/title="[^"]+"/g, `title="${title}"`);
  content = content.replace(/definition="[^"]+"/g, `definition="A comprehensive visualization for ${title} operations in a linked list."`);
  
  if (content !== originalContent) {
    fs.writeFileSync(fp, content, 'utf8');
    changedCount++;
  }
}

console.log(`Updated titles and definitions for ${changedCount} files in linked-list.`);
