import os

TREE_DIR = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\trees"
TEMPLATE_PATH = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\scratch\tree_template.txt"

def get_title(filename):
    name = filename.replace(".tsx", "").replace("-", " ")
    return name.title()

def get_metadata(filename):
    title = get_title(filename)
    definition = f"Information about {title}."
    time_comp = "O(N)"
    space_comp = "O(H)"
    key_points = ["Process nodes in a specific order.", "Handle base cases (null nodes).", "Consider tree balance for performance."]

    if "traversal" in filename:
        definition = f"Tree traversal involves visiting all the nodes in a tree in a specific order."
        key_points = ["Used to search or process every node.", "Recursive or iterative implementations.", "Order determines the processing sequence."]
        if "inorder" in filename:
            definition = "Inorder traversal visits the left subtree, then the root, then the right subtree. In a BST, this yields nodes in non-decreasing order."
        elif "preorder" in filename:
            definition = "Preorder traversal visits the root node first, then the left subtree, and finally the right subtree. Useful for copying trees."
        elif "postorder" in filename:
            definition = "Postorder traversal visits the left subtree, then the right subtree, and finally the root node. Useful for deleting trees."
    elif "bst" in filename:
        space_comp = "O(H)"
        key_points = ["Left subtree values < Root.", "Right subtree values > Root.", "Average time complexity is O(log N)."]
        if "search" in filename:
            definition = "Searching in a BST takes advantage of the property that values are ordered, allowing for O(log N) search on average."
        elif "insert" in filename:
            definition = "Insertion in a BST adds a new node while maintaining the ordering property."
        elif "delete" in filename:
            definition = "Deletion in a BST involves removing a node and re-linking the tree to maintain its property."
    elif "heap" in filename:
        time_comp = "O(log N)"
        definition = "A Heap is a special Tree-based data structure in which the tree is a complete binary tree."
        key_points = ["Max-Heap: Root is maximum.", "Min-Heap: Root is minimum.", "Used in Priority Queues and Heap Sort."]
    elif "avl" in filename or "red-black" in filename:
        time_comp = "O(log N)"
        definition = f"{title} is a self-balancing binary search tree."
        key_points = ["Maintains balance during insertions and deletions.", "Guarantees logarithmic height.", "Prevents worst-case O(N) performance."]

    return title, definition, time_comp, space_comp, key_points

with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
    template = f.read()

for filename in os.listdir(TREE_DIR):
    if filename.endswith(".tsx"):
        path = os.path.join(TREE_DIR, filename)
        title, definition, time_comp, space_comp, key_points = get_metadata(filename)
        
        comp_name = filename.replace(".tsx", "").replace("-", " ").title().replace(" ", "")
        if not comp_name.endswith("Lab"):
            comp_name += "Lab"

        content = template.replace("[[TITLE]]", title) \
                          .replace("[[DEFINITION]]", definition) \
                          .replace("[[TIME_COMP]]", time_comp) \
                          .replace("[[SPACE_COMP]]", space_comp) \
                          .replace("[[KEY_POINTS]]", str(key_points)) \
                          .replace("[[COMPONENT_NAME]]", comp_name)
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Migrated {filename}")
