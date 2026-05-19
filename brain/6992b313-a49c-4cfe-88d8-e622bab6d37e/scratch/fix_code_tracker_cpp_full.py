import os

content_dir = 'content/dsa/trees'

old_inorder = """const INORDER_CODE = [
  "void inorder(Node* node, vector<int>& res) {",
  "  if (node == nullptr) return;",
  "  inorder(node->left, res);",
  "  res.push_back(node->value);",
  "  inorder(node->right, res);",
  "}",
];"""

new_inorder = """const INORDER_CODE = [
  "struct Node {",
  "    int value;",
  "    Node *left;",
  "    Node *right;",
  "    Node(int x) : value(x), left(nullptr), right(nullptr) {}",
  "};",
  "",
  "class Solution {",
  "public:",
  "    void inorder(Node* node, vector<int>& res) {",
  "        if (node == nullptr) return;",
  "        inorder(node->left, res);",
  "        res.push_back(node->value);",
  "        inorder(node->right, res);",
  "    }",
  "};",
];"""

old_search = """const SEARCH_CODE = [
  "Node* search(Node* node, int target) {",
  "  if (node == nullptr) return nullptr;",
  "  if (target == node->value) return node;",
  "  if (target < node->value) return search(node->left, target);",
  "  return search(node->right, target);",
  "}",
];"""

new_search = """const SEARCH_CODE = [
  "struct Node {",
  "    int value;",
  "    Node *left;",
  "    Node *right;",
  "    Node(int x) : value(x), left(nullptr), right(nullptr) {}",
  "};",
  "",
  "class Solution {",
  "public:",
  "    Node* search(Node* node, int target) {",
  "        if (node == nullptr) return nullptr;",
  "        if (target == node->value) return node;",
  "        if (target < node->value) return search(node->left, target);",
  "        return search(node->right, target);",
  "    }",
  "};",
];"""

count = 0

for root, dirs, files in os.walk(content_dir):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            original_content = content
            
            content = content.replace(old_inorder, new_inorder)
            content = content.replace(old_search, new_search)
            
            # Update line numbers safely. 
            # We replace sequentially downwards to avoid double replacing (e.g. 0 -> 9, 9 -> 18)
            # Actually, going backwards (5 to 0) prevents replacing newly created 9s.
            if content != original_content:
                content = content.replace('line: 5,', 'line: 14,')
                content = content.replace('line: 4,', 'line: 13,')
                content = content.replace('line: 3,', 'line: 12,')
                content = content.replace('line: 2,', 'line: 11,')
                content = content.replace('line: 1,', 'line: 10,')
                content = content.replace('line: 0,', 'line: 9,')
                
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1

print(f"Updated code tracker to full C++ structure in {count} files.")
