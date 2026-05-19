const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'content', 'dsa', 'linked-list');

const theoryFiles = [
  'advantages-disadvantages.tsx',
  'types-of-linked-list.tsx',
  'node-structure.tsx',
  'memory-representation.tsx',
  'dynamic-memory-allocation.tsx',
  'stl-list.tsx',
  'iterator-linked-list.tsx',
  'practice-patterns.tsx'
];

function toPascalCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function toTitleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

for (const file of theoryFiles) {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) continue;
  
  const baseName = path.basename(file, '.tsx');
  const compName = toPascalCase(baseName);
  const title = toTitleCase(baseName);

  const strippedContent = `"use client";

import { TheorySection } from "../../../components/TheorySection";

export default function ${compName}() {
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight: "calc(100vh - 56px)", background:"#0d1117", color:"#c9d1d9", fontFamily:"'JetBrains Mono','Fira Code',monospace" } }>
      <TheorySection 
        title="${title}"
        definition="A comprehensive theoretical overview of ${title}."
        timeComplexity="-"
        spaceComplexity="-"
        keyPoints={["Theoretical concept", "Fundamental knowledge"]}
      />
      <div style={{display:"flex",flex:1, alignItems: "center", justifyContent: "center", color: "#484f58", fontSize: 14 }}>
        [ Theoretical Topic: Detailed static visual diagrams will be added here ]
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(fp, strippedContent, 'utf8');
}

console.log('Stripped simulations from ' + theoryFiles.length + ' theory files.');
