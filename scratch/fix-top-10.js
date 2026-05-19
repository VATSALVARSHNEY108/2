const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'content', 'dsa', 'linked-list');

const filesToTitles = {
  'introduction-to-linked-list.tsx': 'Introduction To Linked List',
  'advantages-disadvantages.tsx': 'Advantages & Disadvantages',
  'types-of-linked-list.tsx': 'Types of Linked Lists',
  'singly-linked-list.tsx': 'Singly Linked List',
  'doubly-linked-list.tsx': 'Doubly Linked List',
  'circular-linked-list.tsx': 'Circular Linked List',
  'circular-doubly-linked-list.tsx': 'Circular Doubly Linked List',
  'node-structure.tsx': 'Node Structure',
  'memory-representation.tsx': 'Memory Representation',
  'dynamic-memory-allocation.tsx': 'Dynamic Memory Allocation'
};

for (const [filename, title] of Object.entries(filesToTitles)) {
  const fp = path.join(dir, filename);
  if (!fs.existsSync(fp)) continue;
  
  let content = fs.readFileSync(fp, 'utf8');
  
  // Replace the TheorySection title and definition
  content = content.replace(/title="[^"]+"/, `title="${title}"`);
  content = content.replace(/definition="[^"]+"/, `definition="A comprehensive visualization for ${title} operations in a linked list."`);
  
  // Specific simulations
  if (filename === 'doubly-linked-list.tsx') {
    // Add prev pointer
    content = content.replace(/next: string \| null;/g, 'next: string | null; prev: string | null;');
    content = content.replace(/nodes\[id\] = \{ id, value: v, next: null \};/g, 'nodes[id] = { id, value: v, next: null, prev: null };');
    content = content.replace(/if \(prevId\) nodes\[prevId\]\.next = id;/g, 'if (prevId) { nodes[prevId].next = id; nodes[id].prev = prevId; }');
    
    // Replace SVG edges for doubly
    content = content.replace(/<line key=\{\`edge-\$\{n\.id\}\`\}.*?\/>;/s, `
              const sx1=fp.x+nx2*(NODE_W/2), sy1=fp.y+ny2*(NODE_H/2) - 8;
              const ex1=tp.x-nx2*(NODE_W/2 + 5), ey1=tp.y-ny2*(NODE_H/2 + 5) - 8;
              const sx2=tp.x-nx2*(NODE_W/2), sy2=tp.y-ny2*(NODE_H/2) + 8;
              const ex2=fp.x+nx2*(NODE_W/2 + 5), ey2=fp.y+ny2*(NODE_H/2 + 5) + 8;
              return (
                <g key={\`edge-\${n.id}\`}>
                  <line x1={sx1} y1={sy1} x2={ex1} y2={ey1} stroke={stroke} strokeWidth={sw} markerEnd={marker} style={{transition:"stroke .25s,stroke-width .25s"}}/>
                  <line x1={sx2} y1={sy2} x2={ex2} y2={ey2} stroke={stroke} strokeWidth={sw} markerEnd={marker} style={{transition:"stroke .25s,stroke-width .25s"}}/>
                </g>
              );
    `);
  }
  
  if (filename === 'circular-linked-list.tsx') {
    // Modify buildLinkedList to point last to first
    content = content.replace(/return \{ nodes, head \};/g, 'if (prevId && head) nodes[prevId].next = head; return { nodes, head };');
    
    // SVG edges: need an arc if it goes backwards
    content = content.replace(/return <line key=\{\`edge-\$\{n\.id\}\`\} x1=\{sx\} y1=\{sy\} x2=\{ex\} y2=\{ey\}\s*stroke=\{stroke\} strokeWidth=\{sw\} markerEnd=\{marker\}\s*style=\{\{transition:"stroke \.25s,stroke-width \.25s"\}\}\/>;/s, `
              if (cid === data.head && n.id !== data.head) {
                // Arc from last to first
                const sxA = fp.x, syA = fp.y + NODE_H/2;
                const exA = tp.x, eyA = tp.y + NODE_H/2;
                return <path key={\`edge-\${n.id}\`} d={\`M \${sxA} \${syA} Q \${(sxA+exA)/2} \${syA+100} \${exA} \${eyA+5}\`} fill="none" stroke={stroke} strokeWidth={sw} markerEnd={marker} style={{transition:"stroke .25s,stroke-width .25s"}}/>;
              }
              return <line key={\`edge-\${n.id}\`} x1={sx} y1={sy} x2={ex} y2={ey} stroke={stroke} strokeWidth={sw} markerEnd={marker} style={{transition:"stroke .25s,stroke-width .25s"}}/>;
    `);
  }

  fs.writeFileSync(fp, content, 'utf8');
}

console.log('Processed top 10 files.');
