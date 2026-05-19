const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'content', 'dsa', 'linked-list');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let changedCount = 0;

const searchPattern = /const rect = svgRef\.current\.getBoundingClientRect\(\);\s*setDraggedPos\(prev => \(\{\s*\.\.\.prev,\s*\[nodeDrag\.current!\.id\]: \{\s*x: e\.clientX - rect\.left\s*- nodeDrag\.current!\.ox,\s*y: e\.clientY - rect\.top\s*- nodeDrag\.current!\.oy,?\s*\},?\s*\}\)\);/g;

const replacePattern = `const dragId = nodeDrag.current.id;
    const dragOx = nodeDrag.current.ox;
    const dragOy = nodeDrag.current.oy;
    const rect = svgRef.current.getBoundingClientRect();
    const nx = e.clientX - rect.left - dragOx;
    const ny = e.clientY - rect.top - dragOy;
    setDraggedPos(prev => ({
      ...prev,
      [dragId]: { x: nx, y: ny },
    }));`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  content = content.replace(searchPattern, replacePattern);
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedCount++;
  }
}

console.log(`Fixed ${changedCount} files with drag bug.`);
