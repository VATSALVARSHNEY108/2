import os
import re

content_dir = 'content'

pattern = re.compile(
    r'const onSvgMouseMove = useCallback\(\(e: React\.MouseEvent<SVGSVGElement>\) => \{\s*'
    r'if \(!nodeDrag\.current \|\| !svgRef\.current\) return;\s*'
    r'const rect = svgRef\.current\.getBoundingClientRect\(\);\s*'
    r'setDraggedPos\(prev => \(\{\s*'
    r'\.\.\.prev,\s*'
    r'\[nodeDrag\.current!?\.id\]: \{\s*'
    r'x: e\.clientX - rect\.left\s*- nodeDrag\.current!?\.ox,\s*'
    r'y: e\.clientY - rect\.top\s*- nodeDrag\.current!?\.oy,?\s*'
    r'\},\s*'
    r'\}\)\);\s*'
    r'\}, \[\]\);'
)

replacement = """const onSvgMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!nodeDrag.current || !svgRef.current) return;
    const dragId = nodeDrag.current.id;
    const dragOx = nodeDrag.current.ox;
    const dragOy = nodeDrag.current.oy;
    const rect = svgRef.current.getBoundingClientRect();
    const nx = e.clientX - rect.left - dragOx;
    const ny = e.clientY - rect.top - dragOy;
    setDraggedPos(prev => ({
      ...prev,
      [dragId]: { x: nx, y: ny },
    }));
  }, []);"""

count = 0
for root, dirs, files in os.walk(content_dir):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            if pattern.search(content):
                new_content = pattern.sub(replacement, content)
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                count += 1

print(f"Fixed onSvgMouseMove in {count} files.")
