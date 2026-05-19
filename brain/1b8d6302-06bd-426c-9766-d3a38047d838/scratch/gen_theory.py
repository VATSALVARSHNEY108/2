import os
import json

topics_data = {
    'advantages-disadvantages': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'Comparing Linked Lists with Arrays to understand dynamic memory vs contiguous memory.', 'kp': ['Dynamic size', 'No memory waste', 'Sequential access only', 'Extra memory for pointers'] },
    'types-of-linked-list': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'Overview of Singly, Doubly, and Circular Linked Lists.', 'kp': ['Singly: Forward only', 'Doubly: Forward and Backward', 'Circular: Tail connects to Head'] },
    'singly-linked-list': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'A linear data structure where each node points to the next node in the sequence.', 'kp': ['Contains data and next pointer', 'Ends with NULL pointer'] },
    'doubly-linked-list': { 'tc': 'O(1)', 'sc': 'O(N)', 'def': 'A linked list where each node contains pointers to both the next and previous nodes.', 'kp': ['Bidirectional traversal', 'Extra memory for prev pointer', 'Easier deletion'] },
    'circular-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'A linked list where the last node points back to the first node.', 'kp': ['No NULL pointers', 'Used in round-robin scheduling', 'Can be singly or doubly'] },
    'circular-doubly-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'A doubly linked list where the tail connects to the head and head connects to tail.', 'kp': ['Bidirectional and circular', 'Complex pointer updates'] },
    'node-structure': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'The foundational building block of a linked list containing data and a reference.', 'kp': ['Self-referential structure', 'Defines the structural boundaries'] },
    'memory-representation': { 'tc': 'O(1)', 'sc': 'O(N)', 'def': 'How linked lists are dynamically allocated in the heap memory.', 'kp': ['Non-contiguous allocation', 'Nodes scattered in memory'] },
    'dynamic-memory-allocation': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'Allocating memory at runtime using new/malloc.', 'kp': ['Memory grows as needed', 'Requires manual memory management (delete/free)'] },
    'traversal': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Visiting each node of the linked list sequentially to process data.', 'kp': ['Use a temporary pointer (cur)', 'Move until cur is NULL'] },
    'insertion-at-beginning': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'Adding a new node at the head of the linked list.', 'kp': ['Create new node', 'Point new node to head', 'Update head to new node'] },
    'insertion-at-end': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Adding a new node after the current tail of the list.', 'kp': ['Traverse to the last node', 'Update tail pointer to new node'] },
    'insertion-at-position': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Inserting a node at a specific zero-indexed or one-indexed position.', 'kp': ['Traverse to Position-1', 'Wire new node to next', 'Wire current to new node'] },
    'deletion-from-beginning': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'Removing the head node of the linked list.', 'kp': ['Store head in temp', 'Move head to next', 'Delete temp'] },
    'deletion-from-end': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Removing the last node of the linked list.', 'kp': ['Traverse to second-to-last node', 'Update next to NULL', 'Delete last node'] },
    'deletion-by-value': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Finding and removing the first node that matches a specific value.', 'kp': ['Keep track of prev pointer', 'Unlink target node'] },
    'deletion-by-position': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Removing a node at a specific index.', 'kp': ['Traverse to index-1', 'Bypass the node at index'] },
    'searching': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Iterating through the list to find a target value.', 'kp': ['Linear search only', 'Return true or index if found'] },
    'updating-nodes': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Modifying the data value of a specific node.', 'kp': ['Traverse to node', 'Reassign data field'] },
    'length': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Counting the total number of nodes in the linked list.', 'kp': ['Initialize count to 0', 'Increment while traversing'] },
    'reverse-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Reversing the direction of all pointers in the list in-place.', 'kp': ['Maintain prev, cur, next pointers', 'Flip cur->next to prev'] },
    'recursive-reversal': { 'tc': 'O(N)', 'sc': 'O(N)', 'def': 'Reversing the list using the call stack instead of loops.', 'kp': ['Recursive trust', 'head->next->next = head', 'Space complexity O(N) due to stack'] },
    'middle-of-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Finding the middle node of a linked list in one pass.', 'kp': ['Tortoise and Hare algorithm', 'Slow moves 1x, Fast moves 2x'] },
    'detect-loop': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Detecting if a cycle exists in the linked list.', 'kp': ["Floyd's Cycle Finding", 'If Slow and Fast meet, there is a loop'] },
    'floyd-cycle-detection': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Using slow and fast pointers to detect cycles and find their starting point.', 'kp': ['Same as Detect Loop', 'Foundation for loop removal'] },
    'loop-start-point': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Finding the exact node where the cycle begins.', 'kp': ['Reset slow to head after meeting', 'Move both at 1x speed until they meet again'] },
    'remove-loop': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Detecting and breaking a cycle to restore a linear list.', 'kp': ['Find loop start', 'Traverse to node right before start', 'Set next to NULL'] },
    'merge-sorted-lists': { 'tc': 'O(N+M)', 'sc': 'O(1)', 'def': 'Combining two sorted linked lists into a single sorted list.', 'kp': ['Use a dummy node', 'Two pointers comparing values'] },
    'sort-linked-list': { 'tc': 'O(N log N)', 'sc': 'O(log N)', 'def': 'Sorting a linked list using optimal O(N log N) algorithms.', 'kp': ['Merge Sort is preferred over Quick Sort for lists', 'No random access needed'] },
    'merge-sort-linked-list': { 'tc': 'O(N log N)', 'sc': 'O(log N)', 'def': 'Applying the divide and conquer merge sort algorithm to linked lists.', 'kp': ['Find middle', 'Split list', 'Recursively merge'] },
    'remove-duplicates-sorted': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Removing duplicate values from an already sorted list.', 'kp': ['Compare cur and cur->next', 'Skip identical contiguous nodes'] },
    'remove-duplicates-unsorted': { 'tc': 'O(N)', 'sc': 'O(N)', 'def': 'Removing duplicate values from an unsorted list using a Hash Set.', 'kp': ['Track seen values in unordered_set', 'O(N) space tradeoff'] },
    'nth-node-from-end': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Finding the value of the N-th node from the tail.', 'kp': ['Two pointers spaced N apart', 'Move both until fast reaches end'] },
    'delete-nth-node-from-end': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Removing the N-th node from the tail in a single pass.', 'kp': ['Use dummy node for edge cases (deleting head)', 'Two pointer gap method'] },
    'odd-even-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Grouping all odd-indexed nodes together followed by even-indexed nodes.', 'kp': ['Separate odd and even streams', 'Merge odd tail to even head'] },
    'segregate-even-odd': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Grouping nodes based on their value (even values first, then odd).', 'kp': ['Use two dummy nodes', 'Filter values into two streams'] },
    'intersection-of-lists': { 'tc': 'O(N+M)', 'sc': 'O(1)', 'def': 'Finding the node where two singly linked lists merge.', 'kp': ['Calculate lengths', 'Advance longer list by difference'] },
    'intersection-point': { 'tc': 'O(N+M)', 'sc': 'O(1)', 'def': 'Alternative two-pointer method for finding list intersection.', 'kp': ['When a pointer reaches NULL, redirect to other head', 'Equalizes travel distance'] },
    'add-two-numbers': { 'tc': 'O(max(N,M))', 'sc': 'O(max(N,M))', 'def': 'Adding numbers represented as linked lists with digits in reverse order.', 'kp': ['Maintain carry', 'Create new nodes for sum % 10'] },
    'multiply-linked-lists': { 'tc': 'O(N*M)', 'sc': 'O(1)', 'def': 'Multiplying two numbers represented as linked lists.', 'kp': ['Convert to integers (mod 10^9+7)', 'Multiply integers'] },
    'flatten-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Flattening a multi-level linked list with next and bottom pointers.', 'kp': ['Recursively merge lists using bottom pointers', 'Result is sorted vertically'] },
    'rotate-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Rotating the linked list to the right by K places.', 'kp': ['Form circular list', 'Find new tail at Length - (K % Length)', 'Break circle'] },
    'clone-with-random-pointer': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Deep copying a linked list that has random pointers without extra space.', 'kp': ['Interweave clones', 'clone->random = orig->random->next', 'Unweave lists'] },
    'partition-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Partitioning a list around a value X (lesser values before greater values).', 'kp': ['Two dummy nodes (less and greater)', 'Preserve relative order'] },
    'swap-nodes-in-pairs': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Swapping every two adjacent nodes in the list.', 'kp': ['Use a dummy node', 'Pointer rewiring: prev->next = second'] },
    'reverse-in-k-groups': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Reversing the list in blocks of size K.', 'kp': ['Count remaining nodes', 'Reverse K nodes', 'Link blocks together'] },
    'circular-operations': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Insertion, deletion, and traversal operations specific to circular lists.', 'kp': ['Tail->next always points to Head', 'Be careful of infinite loops'] },
    'doubly-operations': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Managing both next and prev pointers during list operations.', 'kp': ['Symmetrical updates required', 'newNode->prev = cur'] },
    'insertion-in-dll': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'Inserting nodes at head, tail, or position in a Doubly Linked List.', 'kp': ['Update four pointers per insert', 'cur->next->prev = newNode'] },
    'deletion-in-dll': { 'tc': 'O(1)', 'sc': 'O(1)', 'def': 'Removing nodes from a Doubly Linked List in O(1) if pointer is given.', 'kp': ['delnode->prev->next = delnode->next'] },
    'reverse-dll': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Reversing a Doubly Linked List in-place.', 'kp': ['Swap next and prev pointers for every node', 'Update head to last node'] },
    'lru-using-dll': { 'tc': 'O(1)', 'sc': 'O(Capacity)', 'def': 'Implementing Least Recently Used Cache with DLL and HashMap.', 'kp': ['HashMap for O(1) lookup', 'DLL for O(1) move to front and evict tail'] },
    'stack-using-linked-list': { 'tc': 'O(1)', 'sc': 'O(N)', 'def': 'Implementing Stack operations (Push, Pop, Top) using a linked list.', 'kp': ['Insert at Head (Push)', 'Delete at Head (Pop)'] },
    'queue-using-linked-list': { 'tc': 'O(1)', 'sc': 'O(N)', 'def': 'Implementing Queue operations (Enqueue, Dequeue) using a linked list.', 'kp': ['Maintain Head and Tail pointers', 'Insert at Tail, Delete at Head'] },
    'header-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'A linked list containing a special header node that stores metadata (like length).', 'kp': ['Header never stores actual data', 'Useful for O(1) length queries'] },
    'sparse-matrix-linked-list': { 'tc': 'O(N)', 'sc': 'O(N)', 'def': 'Representing a sparse matrix where only non-zero elements are stored as nodes.', 'kp': ['Node stores row, col, and value', 'Saves massive amounts of memory'] },
    'polynomial-linked-list': { 'tc': 'O(N+M)', 'sc': 'O(N+M)', 'def': 'Representing and adding polynomials (e.g., 5x^2 + 3x) using linked lists.', 'kp': ['Node stores coefficient and exponent', 'Add like terms by matching exponents'] },
    'skip-list-basics': { 'tc': 'O(log N)', 'sc': 'O(N log N)', 'def': 'A probabilistic data structure allowing O(log N) search within a linked list.', 'kp': ['Multiple layers of express lanes', 'Coin flip determines layer height'] },
    'xor-linked-list-basics': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'A memory-efficient doubly linked list storing XOR of next and prev addresses.', 'kp': ['Saves pointer memory', 'Traversal requires remembering previous node'] },
    'stl-list': { 'tc': 'O(1)', 'sc': 'O(N)', 'def': 'Using the standard library std::list container in C++.', 'kp': ['Implemented as a Doubly Linked List', 'Does not support random access []'] },
    'iterator-linked-list': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Navigating STL lists using bidirectional iterators.', 'kp': ['list::iterator', 'Use std::advance to move N steps'] },
    'practice-patterns': { 'tc': 'N/A', 'sc': 'N/A', 'def': 'Summary of common Linked List problem-solving patterns.', 'kp': ['Slow and Fast Pointers', 'Dummy Nodes', 'Reversing in chunks', 'Two Pointer tracking'] },
    'check-palindrome': { 'tc': 'O(N)', 'sc': 'O(1)', 'def': 'Checking if a linked list reads the same forwards and backwards.', 'kp': ['Find middle', 'Reverse second half', 'Compare halves'] }
}

template = """\"use client\";

import {{ TheorySection }} from "../../../components/TheorySection";
import {{ CodeTabs }} from "../../../components/CodeTabs";

export default function {comp_name}Lab() {{
  return (
    <div style={{{{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0B0F19", color: "#c9d1d9", fontFamily: "monospace" }}}}>
      <TheorySection 
        title="{title}" 
        definition="{definition}" 
        timeComplexity="{tc}" 
        spaceComplexity="{sc}" 
        keyPoints={{{keypoints}}} 
      />
      
      <CodeTabs 
        cpp={{`class Solution {{\npublic:\n    // C++ Implementation for {title}\n    void solve() {{\n        // TODO: Implement logic\n    }}\n}};`}}
        java={{`class Solution {{\n    // Java Implementation for {title}\n    public void solve() {{\n        // TODO: Implement logic\n    }}\n}}`}}
        python={{`class Solution:\n    # Python Implementation for {title}\n    def solve(self):\n        pass # TODO: Implement logic`}}
      />

      <div style={{{{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #30363d", margin: "0 80px 40px", borderRadius: 10, background: "rgba(22,27,34,0.3)" }}}}>
         <h2 style={{{{ color: "#8b949e", fontWeight: "normal" }}}}>[ Simulation Space Reserved for {title} ]</h2>
      </div>
    </div>
  );
}}
"""

directory = "content/dsa/linked-list"

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        topic_slug = filename[:-4]
        
        comp_name = "".join([w.capitalize() for w in topic_slug.split('-')])
        title = " ".join([w.capitalize() for w in topic_slug.split('-')])
        
        theory = topics_data.get(topic_slug, {
            'tc': 'O(N)', 'sc': 'O(1)', 'def': f'Algorithm overview for {title}.', 'kp': ['Understand pointer manipulation', 'Handle edge cases (head is null)']
        })
        
        kp_str = json.dumps(theory['kp'])
        
        file_content = template.format(
            comp_name=comp_name,
            title=title,
            definition=theory['def'],
            tc=theory['tc'],
            sc=theory['sc'],
            keypoints=kp_str
        )
        
        with open(os.path.join(directory, filename), 'w', encoding='utf-8') as f:
            f.write(file_content)

print("Injected specific theory sections, code tabs, and simulation placeholders into all 64 files.")
