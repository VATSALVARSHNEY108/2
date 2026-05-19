const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)/content/dsa/linked-list';
const files = [
  'remove-duplicates-sorted.tsx',
  'intersection-of-lists.tsx',
  'swap-nodes-in-pairs.tsx',
  'insertion-at-beginning.tsx',
  'insertion-at-end.tsx',
  'deletion-from-beginning.tsx',
  'deletion-from-end.tsx',
  'deletion-by-position.tsx',
  'deletion-by-value.tsx',
  'circular-linked-list.tsx',
  'doubly-linked-list.tsx',
  'insertion-at-position.tsx',
  'remove-loop.tsx',
  'odd-even-linked-list.tsx',
  'searching.tsx'
];

for (const f of files) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) continue;
  let code = fs.readFileSync(p, 'utf8');

  // We look for the CtrlBtn row div.
  const target = `<div style={{display:"flex",gap:5,marginBottom:12}}>`;
  const replacement = `<div style={{marginBottom: 12}}><label style={{fontSize:10,color:"#8b949e",marginBottom:4,display:"block",textTransform:"uppercase"}}>Custom Input (CSV)</label><input type="text" defaultValue="10, 20, 30, 40" onBlur={(e) => { const vals = e.target.value.split(',').map(n=>parseInt(n.trim())).filter(n=>!isNaN(n)); if(vals.length) { setData(build${f.includes('doubly') ? 'DoublyList' : f.includes('circular') ? 'CircularList' : f.includes('cycle')||f.includes('loop') ? 'LinkedListCycle' : 'LinkedList'}(vals)); setStepIdx(0); setIsPlaying(false); } }} style={{width:"100%", background:"#0d1117", border:"1px solid #30363d", color:"#c9d1d9", padding:"6px 8px", borderRadius:4, fontSize: 12, outline:"none"}} /></div><div style={{display:"flex",gap:5,marginBottom:12}}>`;

  if (code.includes(target) && !code.includes('Custom Input')) {
    // Note: intersection-of-lists has a special builder, let's skip replacing for intersection for now or hardcode bypass
    if (f === 'intersection-of-lists.tsx') continue;
    
    code = code.replace(target, replacement);
    fs.writeFileSync(p, code);
    console.log("Updated", f);
  }
}
