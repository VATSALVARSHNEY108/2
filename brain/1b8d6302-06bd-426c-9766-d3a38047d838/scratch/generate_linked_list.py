import json
import os

files = [
    'advantages-disadvantages', 'types-of-linked-list', 'singly-linked-list', 'doubly-linked-list',
    'circular-linked-list', 'circular-doubly-linked-list', 'node-structure', 'memory-representation',
    'dynamic-memory-allocation', 'traversal', 'insertion-at-beginning', 'insertion-at-end',
    'insertion-at-position', 'deletion-from-beginning', 'deletion-from-end', 'deletion-by-value',
    'deletion-by-position', 'searching', 'updating-nodes', 'length', 'reverse-linked-list',
    'recursive-reversal', 'middle-of-linked-list', 'detect-loop', 'floyd-cycle-detection',
    'loop-start-point', 'remove-loop', 'merge-sorted-lists', 'sort-linked-list',
    'merge-sort-linked-list', 'remove-duplicates-sorted', 'remove-duplicates-unsorted',
    'nth-node-from-end', 'delete-nth-node-from-end', 'check-palindrome', 'odd-even-linked-list',
    'segregate-even-odd', 'intersection-of-lists', 'intersection-point', 'add-two-numbers',
    'multiply-linked-lists', 'flatten-linked-list', 'rotate-linked-list', 'clone-with-random-pointer',
    'partition-linked-list', 'swap-nodes-in-pairs', 'reverse-in-k-groups', 'circular-operations',
    'doubly-operations', 'insertion-in-dll', 'deletion-in-dll', 'reverse-dll', 'lru-using-dll',
    'stack-using-linked-list', 'queue-using-linked-list', 'header-linked-list',
    'sparse-matrix-linked-list', 'polynomial-linked-list', 'skip-list-basics', 'xor-linked-list-basics',
    'stl-list', 'iterator-linked-list', 'practice-patterns'
]

template_path = 'content/dsa/linked-list/introduction-to-linked-list.tsx'
with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

for f_name in files:
    title = ' '.join(w.capitalize() for w in f_name.split('-'))
    content = template.replace('title="Linked List"', f'title="{title}"')
    
    out_path = f'content/dsa/linked-list/{f_name}.tsx'
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(content)

print(f'Generated {len(files)} files.')
