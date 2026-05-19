import os

content_dir = 'content/dsa/trees'

old_inorder_code = """const INORDER_CODE = [
  "function inorder(node, res = []) {",
  "  if (!node) return;",
  "  inorder(node.left, res);",
  "  res.push(node.value);",
  "  inorder(node.right, res);",
  "}",
];"""

new_inorder_code = """const INORDER_CODE = [
  "void inorder(Node* node, vector<int>& res) {",
  "  if (node == nullptr) return;",
  "  inorder(node->left, res);",
  "  res.push_back(node->value);",
  "  inorder(node->right, res);",
  "}",
];"""

old_search_code = """const SEARCH_CODE = [
  "function search(node, target) {",
  "  if (!node) return null;",
  "  if (target === node.value) return node;",
  "  if (target < node.value) return search(node.left, target);",
  "  return search(node.right, target);",
  "}",
];"""

new_search_code = """const SEARCH_CODE = [
  "Node* search(Node* node, int target) {",
  "  if (node == nullptr) return nullptr;",
  "  if (target == node->value) return node;",
  "  if (target < node->value) return search(node->left, target);",
  "  return search(node->right, target);",
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
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1

print(f"Updated code tracker to C++ in {count} files.")
