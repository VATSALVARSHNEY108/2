import os
import re

content_dir = 'content/dsa/trees'

old_inorder_code = """const INORDER_CODE = [
  "function inorder(node):",
  "  if node is null: return",
  "  inorder(node.left)       // go left",
  "  visit(node)              // add to result",
  "  inorder(node.right)      // go right",
  "  // traversal complete",
];"""

new_inorder_code = """const INORDER_CODE = [
  "function inorder(node, res = []) {",
  "  if (!node) return;",
  "  inorder(node.left, res);",
  "  res.push(node.value);",
  "  inorder(node.right, res);",
  "}",
];"""

old_search_code = """const SEARCH_CODE = [
  "function search(node, target):",
  "  if target < node.val: go left",
  "  if target > node.val: go right",
  "  if target === node.val: found!",
  "  if node is null: not found",
  "  return result",
];"""

new_search_code = """const SEARCH_CODE = [
  "function search(node, target) {",
  "  if (!node) return null;",
  "  if (target === node.value) return node;",
  "  if (target < node.value) return search(node.left, target);",
  "  return search(node.right, target);",
  "}",
];"""

count = 0

for root, dirs, files in os.walk(content_dir):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            original_content = content
            
            # Replace code arrays
            content = content.replace(old_inorder_code, new_inorder_code)
            content = content.replace(old_search_code, new_search_code)
            
            # Update search line numbers
            # line: 3, compareResult: "found" -> line: 2
            content = re.sub(r'line:\s*3,\s*compareResult:\s*"found"', 'line: 2, compareResult: "found"', content)
            
            # line: 1, compareResult: "left" -> line: 3
            content = re.sub(r'line:\s*1,\s*compareResult:\s*"left"', 'line: 3, compareResult: "left"', content)
            
            # line: 2, compareResult: "right" -> line: 4
            content = re.sub(r'line:\s*2,\s*compareResult:\s*"right"', 'line: 4, compareResult: "right"', content)
            
            # line: 4 for not-found
            content = re.sub(r'line:\s*4\s*(,\s*\n\s*\})', r'line: 1\1', content) # Only the not-found block ends with `line: 4, }` basically
            # Let's be safer with the not-found block
            content = re.sub(r'speechMessage:\s*`\$\{target\} not found\.`,\s*\n\s*line:\s*4,', 'speechMessage: `${target} not found.`,\n    line: 1,', content)
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1

print(f"Updated code tracker in {count} files.")
