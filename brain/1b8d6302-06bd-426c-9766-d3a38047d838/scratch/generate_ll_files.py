import os
import json

topics = [
    'advantages-disadvantages', 'types-of-linked-list', 'singly-linked-list', 'doubly-linked-list',
    'circular-linked-list', 'circular-doubly-linked-list', 'node-structure', 'memory-representation',
    'dynamic-memory-allocation', 'traversal', 'insertion-at-beginning', 'insertion-at-end',
    'insertion-at-position', 'deletion-from-beginning', 'deletion-from-end', 'deletion-by-value',
    'deletion-by-position', 'searching', 'updating-nodes', 'length', 'reverse-linked-list',
    'recursive-reversal', 'middle-of-linked-list', 'detect-loop', 'floyd-cycle-detection',
    'loop-start-point', 'remove-loop', 'merge-sorted-lists', 'sort-linked-list',
    'merge-sort-linked-list', 'remove-duplicates-sorted', 'remove-duplicates-unsorted',
    'nth-node-from-end', 'delete-nth-node-from-end', 'odd-even-linked-list',
    'segregate-even-odd', 'intersection-of-lists', 'intersection-point', 'add-two-numbers',
    'multiply-linked-lists', 'flatten-linked-list', 'rotate-linked-list', 'clone-with-random-pointer',
    'partition-linked-list', 'swap-nodes-in-pairs', 'reverse-in-k-groups', 'circular-operations',
    'doubly-operations', 'insertion-in-dll', 'deletion-in-dll', 'reverse-dll', 'lru-using-dll',
    'stack-using-linked-list', 'queue-using-linked-list', 'header-linked-list',
    'sparse-matrix-linked-list', 'polynomial-linked-list', 'skip-list-basics', 'xor-linked-list-basics',
    'stl-list', 'iterator-linked-list', 'practice-patterns'
]

# Note: check-palindrome is explicitly removed from this list to preserve the custom version

codes = {
    "traverse": [
        "cur = head;",
        "while (cur != nullptr) {",
        "  visit(cur->value);",
        "  cur = cur->next;",
        "}"
    ],
    "insert": [
        "Node* newNode = new Node(val);",
        "if (!head) return newNode;",
        "Node* cur = head;",
        "while (cur->next) {",
        "  cur = cur->next;",
        "}",
        "cur->next = newNode;"
    ],
    "delete": [
        "if (!head) return;",
        "if (head->value == target) {",
        "  head = head->next; return;",
        "}",
        "Node* prev = head; Node* cur = head->next;",
        "while (cur) {",
        "  if (cur->value == target) {",
        "    prev->next = cur->next; return;",
        "  }",
        "  prev = cur; cur = cur->next;",
        "}"
    ],
    "reverse": [
        "Node* prev = nullptr;",
        "Node* cur = head;",
        "while (cur) {",
        "  Node* next = cur->next;",
        "  cur->next = prev;",
        "  prev = cur;",
        "  cur = next;",
        "}",
        "head = prev;"
    ],
    "slowfast": [
        "Node* slow = head;",
        "Node* fast = head;",
        "while (fast && fast->next) {",
        "  slow = slow->next;",
        "  fast = fast->next->next;",
        "}"
    ],
    "theory": [
        "// Theoretical Concept",
        "// Focus on memory representation and structure.",
        "struct Node {",
        "  int data;",
        "  Node* next;",
        "};"
    ]
}

def get_archetype(name):
    if 'insert' in name or 'add' in name or 'push' in name: return "insert"
    if 'delete' in name or 'remove' in name or 'pop' in name: return "delete"
    if 'reverse' in name: return "reverse"
    if 'loop' in name or 'middle' in name or 'cycle' in name or 'intersection' in name: return "slowfast"
    if 'traverse' in name or 'search' in name or 'length' in name or 'node' in name: return "traverse"
    return "theory"

template = """"use client";

import LinkedListLab, {{ LLConfig }} from "../../../components/LinkedListLab";

const config: LLConfig = {{
  title: "{title}",
  definition: "This is the interactive learning module for {title}. Here you will visualize the algorithm and understand its underlying pointers.",
  timeComplexity: "O(N)",
  spaceComplexity: "O(1)",
  keyPoints: [
    "Understand the pointer movements.",
    "Pay attention to edge cases like empty lists.",
    "Analyze the time and space complexity."
  ],
  code: {code},
  archetype: "{archetype}"
}};

export default function Page() {{
  return <LinkedListLab config={{config}} />;
}}
"""

for t in topics:
    arch = get_archetype(t)
    title = ' '.join(w.capitalize() for w in t.split('-'))
    code_str = json.dumps(codes[arch], indent=2)
    
    content = template.format(title=title, code=code_str, archetype=arch)
    
    with open(f"content/dsa/linked-list/{t}.tsx", "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(topics)} files using LinkedListLab component.")
