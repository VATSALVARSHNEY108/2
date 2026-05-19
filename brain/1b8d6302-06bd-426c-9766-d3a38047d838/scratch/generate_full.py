import os

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

# Read the base template
with open("content/dsa/linked-list/introduction-to-linked-list.tsx", "r", encoding="utf-8") as f:
    template = f.read()

def get_mode(name):
    if 'insert' in name or 'add' in name: return "insert"
    if 'delete' in name or 'remove' in name: return "delete"
    if 'reverse' in name: return "reverse"
    if 'search' in name: return "search"
    return "traverse"

for t in topics:
    title = ' '.join(w.capitalize() for w in t.split('-'))
    mode = get_mode(t)
    
    # We replace the Title
    content = template.replace('title="Linked List"', f'title="{title}"')
    
    # We replace the default mode
    content = content.replace('useState<Mode>("traverse")', f'useState<Mode>("{mode}")')
    
    with open(f"content/dsa/linked-list/{t}.tsx", "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(topics)} standalone files.")
