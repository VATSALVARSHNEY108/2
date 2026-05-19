import os
import re
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "content" / "dsa" / "stack-queue"
LAB_FILE = ROOT / "components" / "StackQueueLessonLab.tsx"


@dataclass(frozen=True)
class LessonMeta:
    title: str
    definition: str
    time: str
    space: str
    key_points: list[str]


def title_from_slug(slug: str) -> str:
    parts = slug.split("-")
    out: list[str] = []
    lower_words = {"and", "or", "to", "of", "in", "on", "for", "with", "using", "from", "the", "a", "an"}
    for i, p in enumerate(parts):
        low = p.lower()
        if low in {"stl", "lru", "bfs", "cpu"}:
            word = low.upper()
        elif low in {"nge"}:
            word = "NGE"
        else:
            word = low[:1].upper() + low[1:]
        if i > 0 and word.lower() in lower_words:
            word = word.lower()
        out.append(word)
    return " ".join(out)


def load_lesson_topics() -> dict[str, str]:
    text = LAB_FILE.read_text(encoding="utf-8")
    anchor = "const LESSON_TOPIC"
    start = text.find(anchor)
    if start == -1:
        raise RuntimeError("Could not find LESSON_TOPIC in StackQueueLessonLab.tsx")
    brace = text.find("{", start)
    end = text.find("};", brace)
    body = text[brace + 1 : end]

    topics: dict[str, str] = {}
    for raw in body.splitlines():
        line = raw.strip()
        if not line or line.startswith("//"):
            continue
        # "slug": "topic",
        m = re.match(r"^\"([^\"]+)\"\s*:\s*\"([^\"]+)\"\s*,?\s*$", line)
        if m:
            topics[m.group(1)] = m.group(2)
    return topics


def meta_for(lesson_id: str, kind: str) -> LessonMeta:
    title = title_from_slug(lesson_id)

    if lesson_id == "front-and-rear":
        return LessonMeta(
            title="Front and Rear",
            definition="In a queue, the front points to the next element to remove (dequeue) and the rear points to where new elements are added (enqueue). Correctly updating these pointers keeps operations O(1).",
            time="O(1) per Operation",
            space="O(N) Storage",
            key_points=[
                "Front is the dequeue boundary",
                "Rear is the enqueue boundary",
                "Handle empty -> one element transitions",
            ],
        )

    if lesson_id == "cpu-scheduling":
        return LessonMeta(
            title="CPU Scheduling",
            definition="Many CPU schedulers use queues to manage processes: ready queues hold runnable tasks, and scheduling policies (like Round Robin) dequeue the next task and enqueue it back after a time slice.",
            time="O(1) Queue Ops (Policy Dependent)",
            space="O(N) Processes",
            key_points=[
                "Ready queue stores runnable processes",
                "Round Robin cycles via enqueue/dequeue",
                "Queues make scheduling order explicit",
            ],
        )

    # Stack basics
    if kind == "stack":
        definition = "A stack is a linear data structure that follows LIFO (Last-In-First-Out): items are added and removed from the top."
        time = "O(1) Core Operations"
        space = "O(N) Total Storage"
        key_points = [
            "LIFO access pattern",
            "Push/Pop happen at the top",
            "Peek/top reads without removing",
        ]
        if lesson_id in {"push-operation", "pop-operation", "peek-top-operation", "isempty-isfull"}:
            definition = "Stack operations manage the top boundary. Push adds an item, Pop removes the top item, Peek inspects it, and IsEmpty/IsFull check underflow/overflow conditions."
            key_points = [
                "Watch for underflow on pop/peek",
                "Watch for overflow in fixed-size stacks",
                "All operations are O(1)",
            ]
        if lesson_id in {"stack-arrays", "stack-linked-list", "dynamic-stack"}:
            definition = "Stacks can be implemented using arrays (contiguous memory) or linked lists (dynamic memory). The interface stays the same; only memory behavior changes."
            key_points = [
                "Array stack: simple, fixed capacity",
                "Linked stack: dynamic growth",
                "Same push/pop/peek API",
            ]
        if lesson_id == "recursion-call-stack":
            definition = "The call stack stores function activation records (parameters, local variables, return address). Recursive calls push frames; returning pops them in LIFO order."
            time = "O(depth) Calls"
            space = "O(depth) Stack Frames"
            key_points = [
                "Each call pushes a frame",
                "Return pops in reverse order",
                "Deep recursion can overflow",
            ]
        if lesson_id == "complexity-stack":
            definition = "Stack operations are typically O(1): push, pop, and peek each touch only the top element. Total storage grows with the number of elements."
            key_points = [
                "Push/pop/peek are O(1)",
                "Space is O(N) for N elements",
                "Amortized O(1) with dynamic arrays",
            ]
        return LessonMeta(title=title, definition=definition, time=time, space=space, key_points=key_points)

    # Queue basics
    if kind == "queue":
        definition = "A queue is a linear data structure that follows FIFO (First-In-First-Out): enqueue at the rear, dequeue from the front."
        time = "O(1) Core Operations"
        space = "O(N) Total Storage"
        key_points = [
            "FIFO access pattern",
            "Enqueue adds to the rear",
            "Dequeue removes from the front",
        ]
        if lesson_id in {"enqueue-operation", "dequeue-operation", "queue-operations"}:
            definition = "Queue operations maintain two ends: rear for enqueue and front for dequeue. Correct pointer/index updates keep each operation O(1)."
            key_points = [
                "Enqueue at rear, dequeue at front",
                "Track front/rear indices",
                "Handle empty transitions safely",
            ]
        if lesson_id in {"queue-arrays", "queue-linked-list", "dynamic-queue"}:
            definition = "Queues can be implemented using arrays (often as circular buffers) or linked lists (dynamic nodes). Both support FIFO semantics; memory behavior differs."
            key_points = [
                "Array queue often uses wrap-around",
                "Linked queue grows dynamically",
                "Same enqueue/dequeue interface",
            ]
        if lesson_id == "circular-queue":
            definition = "A circular queue (ring buffer) uses modulo arithmetic to reuse freed array slots, avoiding wasted space after dequeues."
            time = "O(1) per Operation"
            space = "O(N) Capacity"
            key_points = [
                "Use (index + 1) % capacity",
                "Distinguish empty vs full carefully",
                "Efficient fixed-size buffering",
            ]
        return LessonMeta(title=title, definition=definition, time=time, space=space, key_points=key_points)

    # Deque
    if kind == "deque":
        return LessonMeta(
            title=title,
            definition="A deque (double-ended queue) supports insertion and deletion at both ends, combining stack-like and queue-like behavior.",
            time="O(1) End Operations",
            space="O(N) Total Storage",
            key_points=[
                "push_front/push_back add at ends",
                "pop_front/pop_back remove at ends",
                "Great for sliding-window patterns",
            ],
        )

    # Priority queue
    if kind == "priority":
        return LessonMeta(
            title=title,
            definition="A priority queue removes elements by priority rather than arrival order. It is commonly implemented with a binary heap.",
            time="Push/Pop: O(log N), Top: O(1)",
            space="O(N) Total Storage",
            key_points=[
                "Heap maintains partial order",
                "Top returns highest/lowest priority",
                "Insert/remove are O(log N)",
            ],
        )

    # Expression / conversion
    if kind in {"expression", "conversion"}:
        if lesson_id in {"balanced-parentheses", "valid-parentheses"}:
            return LessonMeta(
                title=title,
                definition="Use a stack to match opening and closing brackets. Push opens; when a close appears, it must match the current top.",
                time="O(N) Scan",
                space="O(N) Stack in worst case",
                key_points=[
                    "Push opening brackets",
                    "Pop only if types match",
                    "Non-empty stack at end means invalid",
                ],
            )
        if lesson_id.endswith("-expression") or lesson_id in {"infix-expression", "prefix-expression", "postfix-expression"}:
            return LessonMeta(
                title=title,
                definition="Expression notations differ by operator placement: infix (a+b), prefix (+ab), postfix (ab+). Stack-based parsing often converts or evaluates them.",
                time="O(N) Parse",
                space="O(N) Auxiliary Stack",
                key_points=[
                    "Infix needs precedence/parentheses handling",
                    "Prefix/postfix remove parentheses needs",
                    "Stacks simplify conversion/evaluation",
                ],
            )
        if lesson_id in {"infix-to-postfix", "infix-to-prefix", "postfix-to-infix", "prefix-to-infix"}:
            return LessonMeta(
                title=title,
                definition="Conversion between infix/prefix/postfix typically uses a stack to manage operators (or partial expressions) while respecting precedence and associativity.",
                time="O(N) Conversion",
                space="O(N) Stack",
                key_points=[
                    "Use precedence rules for operators",
                    "Push/pop operators or partial expressions",
                    "Linear scan with stack assistance",
                ],
            )
        if lesson_id in {"evaluate-postfix", "evaluate-prefix"}:
            return LessonMeta(
                title=title,
                definition="Evaluate postfix/prefix expressions using a stack: push operands, and when an operator appears, pop the required operands, compute, and push the result back.",
                time="O(N) Evaluation",
                space="O(N) Stack",
                key_points=[
                    "Operands push to stack",
                    "Operators pop and combine values",
                    "Final stack value is the answer",
                ],
            )
        return LessonMeta(
            title=title,
            definition="This topic uses stacks/queues to parse, convert, or evaluate expressions in a single pass.",
            time="O(N)",
            space="O(N)",
            key_points=["Single-pass scan", "Uses an auxiliary stack", "Respects precedence/associativity"],
        )

    # Monotonic
    if kind == "monotonic":
        if lesson_id == "monotonic-stack":
            return LessonMeta(
                title=title,
                definition="A monotonic stack maintains elements in increasing or decreasing order, enabling next/previous greater/smaller queries in linear time.",
                time="O(N) Total",
                space="O(N) Stack",
                key_points=["Each element pushed/popped once", "Supports NGE/NSE/PGE/PSE", "Choose increasing vs decreasing"],
            )
        if lesson_id == "monotonic-queue":
            return LessonMeta(
                title=title,
                definition="A monotonic queue keeps candidates for min/max in a window by maintaining a decreasing/increasing deque, supporting sliding-window queries efficiently.",
                time="O(N) Total",
                space="O(N) Deque",
                key_points=["Drop worse elements from back", "Expire indices from front", "Sliding window max/min in O(N)"],
            )
        if lesson_id in {"next-greater-element", "next-smaller-element", "previous-greater-element", "previous-smaller-element"}:
            return LessonMeta(
                title=title,
                definition="Use a monotonic stack to find the nearest greater/smaller element to the left/right for every position in one pass.",
                time="O(N) Total",
                space="O(N) Stack",
                key_points=["Maintain monotonic order", "Pop until condition holds", "Each index processed once"],
            )
        if lesson_id == "stock-span":
            return LessonMeta(
                title=title,
                definition="Stock span counts consecutive days with price <= today. A monotonic stack of indices allows computing spans in linear time.",
                time="O(N) Total",
                space="O(N) Stack",
                key_points=["Stack stores decreasing prices", "Span = i - previous greater index", "Linear-time processing"],
            )
        if lesson_id in {"largest-rectangle-histogram", "maximal-rectangle"}:
            return LessonMeta(
                title=title,
                definition="These problems use a monotonic stack to find nearest smaller bars, enabling rectangle area computations in linear time.",
                time="O(N) Total",
                space="O(N) Stack",
                key_points=["Nearest smaller boundaries", "Each bar pushed/popped once", "Compute area with widths"],
            )
        if lesson_id == "trapping-rain-water":
            return LessonMeta(
                title=title,
                definition="Trapping rain water can be solved with a monotonic stack that detects bounded valleys, accumulating water when a right boundary appears.",
                time="O(N) Total",
                space="O(N) Stack",
                key_points=["Stack stores boundary indices", "Compute trapped water by height difference", "Each index used once"],
            )
        if lesson_id in {"sliding-window-max", "first-negative-window"}:
            return LessonMeta(
                title=title,
                definition="Sliding window problems keep a deque/queue of useful candidates so each element enters and leaves the structure at most once.",
                time="O(N) Total",
                space="O(N) Deque",
                key_points=["Expire out-of-window indices", "Maintain candidates efficiently", "Amortized O(1) per step"],
            )
        return LessonMeta(
            title=title,
            definition="This topic uses monotonic data structures (stack/queue) to answer range or nearest-element queries efficiently.",
            time="O(N) Total",
            space="O(N)",
            key_points=["Monotonic invariant", "Each element touched O(1) times", "Turns nested loops into linear time"],
        )

    # Implementations
    if kind == "implementation":
        if lesson_id in {"stack-using-queue", "stack-using-queue-queue"}:
            return LessonMeta(
                title=title,
                definition="A stack can be implemented using one or two queues by reordering elements so the most recent item is removed first (LIFO behavior).",
                time="Push/Pop: O(N) or O(1) (Tradeoff)",
                space="O(N) Storage",
                key_points=["Reordering simulates LIFO with FIFO", "Choose push-heavy vs pop-heavy design", "Uses extra queue operations"],
            )
        if lesson_id == "queue-using-stack":
            return LessonMeta(
                title=title,
                definition="A queue can be implemented using two stacks: one stack handles incoming pushes, the other handles outgoing pops, giving FIFO behavior.",
                time="Amortized O(1) per Operation",
                space="O(N) Storage",
                key_points=["In-stack for enqueue", "Out-stack for dequeue", "Move elements only when needed"],
            )
        if lesson_id == "two-stack-one-array":
            return LessonMeta(
                title=title,
                definition="Two stacks can share one array by growing from opposite ends, maximizing space utilization while keeping O(1) push/pop (until overlap).",
                time="O(1) per Operation",
                space="O(N) Shared Array",
                key_points=["Stacks grow toward each other", "Overflow when pointers cross", "Better space usage than two arrays"],
            )
        if lesson_id == "k-queue-one-array":
            return LessonMeta(
                title=title,
                definition="K queues can be implemented in one array using a free list and next pointers, allowing O(1) enqueue/dequeue for each queue.",
                time="O(1) per Operation",
                space="O(N + K) Metadata",
                key_points=["Free list tracks available slots", "Front/rear per queue", "Next array links elements"],
            )
        return LessonMeta(
            title=title,
            definition="This topic focuses on implementing stacks/queues using other structures while preserving the required access order.",
            time="Varies by Design",
            space="O(N)",
            key_points=["Simulate LIFO/FIFO with primitives", "Trade time between ops", "Preserve invariants carefully"],
        )

    # Applications
    if kind == "application":
        if lesson_id == "bfs-using-queue":
            return LessonMeta(
                title="BFS Using Queue",
                definition="Breadth-first search (BFS) explores a graph level by level using a queue: enqueue neighbors, dequeue the next node to process.",
                time="O(V + E)",
                space="O(V)",
                key_points=["Queue drives level-order traversal", "Mark visited to avoid repeats", "Shortest path in unweighted graphs"],
            )
        if lesson_id == "printer-queue":
            return LessonMeta(
                title=title,
                definition="A printer queue models tasks arriving over time and being processed in FIFO order, often with priorities or time slices in real systems.",
                time="O(1) Queue Ops (Policy Dependent)",
                space="O(N) Jobs",
                key_points=["FIFO ordering by arrival", "Enqueue jobs, dequeue to print", "Extensions add priority handling"],
            )
        if lesson_id == "lru-cache-queue":
            return LessonMeta(
                title="LRU Cache (Queue)",
                definition="LRU cache evicts the least-recently-used item. A queue-like order is maintained (usually with a doubly linked list + hash map) to update recency quickly.",
                time="O(1) Average Operations",
                space="O(N) Cache Storage",
                key_points=["Track recency order", "Move accessed item to front", "Evict from the least-recent end"],
            )
        if lesson_id == "circular-tour":
            return LessonMeta(
                title=title,
                definition="Circular tour problems often use queue-like reasoning to maintain a candidate starting point while validating feasibility around a cycle.",
                time="O(N)",
                space="O(1) or O(N)",
                key_points=["Maintain a moving start", "Track current surplus/deficit", "Single pass with resets"],
            )
        if lesson_id == "backtracking-stack":
            return LessonMeta(
                title=title,
                definition="Backtracking can be implemented iteratively with an explicit stack that stores states to explore, mirroring recursive DFS behavior.",
                time="Depends on Search Space",
                space="O(depth)",
                key_points=["Stack stores decision states", "Pop to backtrack", "Iterative alternative to recursion"],
            )
        if lesson_id == "applications-stack":
            return LessonMeta(
                title="Applications of Stack",
                definition="Stacks power common tasks like undo/redo, parsing, expression evaluation, and DFS-style traversals by managing last-added context first.",
                time="Varies by Use Case",
                space="O(N)",
                key_points=["Undo/redo histories", "Parsing and evaluation", "Depth-first style workflows"],
            )
        if lesson_id == "applications-queue":
            return LessonMeta(
                title="Applications of Queue",
                definition="Queues are used for scheduling, buffering, BFS traversal, and producer/consumer workflows where order of arrival matters.",
                time="Varies by Use Case",
                space="O(N)",
                key_points=["Scheduling and buffering", "BFS / level order", "Fair FIFO processing"],
            )
        return LessonMeta(
            title=title,
            definition="This topic demonstrates real-world use-cases where stacks/queues model order, control-flow, or buffering.",
            time="Varies",
            space="Varies",
            key_points=["Models order of processing", "Keeps operations efficient", "Maps naturally to real systems"],
        )

    # Special
    if kind == "special":
        if lesson_id == "min-stack":
            return LessonMeta(
                title=title,
                definition="A min stack supports retrieving the minimum element in O(1) alongside normal stack operations, typically by keeping an auxiliary stack of mins.",
                time="O(1) per Operation",
                space="O(N)",
                key_points=["Aux stack tracks current minimum", "Min updates on push/pop", "Top/min are O(1)"],
            )
        return LessonMeta(
            title=title,
            definition="Specialized stack variants augment the basic stack API with extra capabilities while keeping core operations efficient.",
            time="O(1) per Operation",
            space="O(N)",
            key_points=["Extra metadata per element", "Keep min/max/other info", "Maintain invariants on pop"],
        )

    # Fallback
    return LessonMeta(
        title=title,
        definition="This lesson introduces a stack/queue concept and how it is used in algorithms.",
        time="Varies",
        space="Varies",
        key_points=["Matches the lesson topic", "Uses correct access-order model", "Focuses on core invariants"],
    )


def rewrite_file(path: Path, meta: LessonMeta) -> None:
    original = path.read_text(encoding="utf-8")

    # Keep component name and lessonId stable; rewrite props only.
    def repl_prop(name: str, value: str) -> str:
        pattern = rf'({name}=)\"[^\"]*\"'
        return re.sub(pattern, rf'\\1\"{value}\"', original)

    text = original
    text = re.sub(r'(title=)\"[^\"]*\"', rf'\\1\"{meta.title}\"', text)
    text = re.sub(r'(definition=)\"[^\"]*\"', rf'\\1\"{meta.definition}\"', text)
    text = re.sub(r'(timeComplexity=)\"[^\"]*\"', rf'\\1\"{meta.time}\"', text)
    text = re.sub(r'(spaceComplexity=)\"[^\"]*\"', rf'\\1\"{meta.space}\"', text)

    # keyPoints: keyPoints={[...]}
    key_points_js = "[" + ", ".join([repr(p) for p in meta.key_points]) + "]"
    # Use single quotes inside array to match existing style
    key_points_js = key_points_js.replace('"', "'")
    text = re.sub(r'keyPoints=\{\[[^\]]*\]\}', f"keyPoints={{{key_points_js}}}", text)

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")


def main() -> None:
    topics = load_lesson_topics()
    changed = 0
    for path in sorted(LESSON_DIR.glob("*.tsx")):
        m = re.search(r'lessonId=\"([^\"]+)\"', path.read_text(encoding="utf-8"))
        if not m:
            continue
        lesson_id = m.group(1)
        kind = topics.get(lesson_id)
        if not kind:
            # If missing, infer basic bucket by filename prefix.
            if "queue" in lesson_id:
                kind = "queue"
            else:
                kind = "stack"
        meta = meta_for(lesson_id, kind)
        before = path.read_text(encoding="utf-8")
        rewrite_file(path, meta)
        after = path.read_text(encoding="utf-8")
        if after != before:
            changed += 1
    print(f\"Updated {changed} lesson files\")\n+\n+\n+if __name__ == \"__main__\":\n+    main()\n*** End Patch"}>>>","timeout_ms":10000}  برد to=functions.apply_patch code str???"}>commentary to=functions.apply_patch  仲博 to=functions.apply_patch code{} We need correct tool call format: apply_patch FREEFORM no JSON. Let's do. We'll craft patch. We'll ensure file ends properly. Let's redo in correct channel. We'll call functions.apply_patch with patch text. We'll remove mistaken bits. Let's craft carefully. Use ascii. The title replacements: we replaced "To" etc. Might undesired. We'll keep simple: not replacing To/And? Actually earlier we wanted title case; may not require lowercasing. We'll just use proper Title Case but keep "to" and "and" maybe. But ok. For now leave as simple but not messing. We'll remove those replacements to avoid altering "To" in "Introduction To Queue" maybe to "Introduction to Queue" nice. We'll keep as in script. Ok.
