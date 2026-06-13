// Plain-language teaching content rendered by <Explainer>. Keyed by structure
// or algorithm id so any view can drop in its explanation.

export interface Explanation {
  title: string
  summary: string
  how: string[]
  useWhen: string[]
  strengths: string[]
  weaknesses: string[]
  realWorld: string[]
}

export const EXPLANATIONS: Record<string, Explanation> = {
  bst: {
    title: 'Binary Search Tree',
    summary:
      'A tree where every node keeps smaller values on its left and larger values on its right, so the data stays sorted by structure.',
    how: [
      'Start at the root and compare your value with the node.',
      'Smaller? Go left. Larger? Go right. Equal? You found it.',
      'Repeat until you find the value or reach an empty slot.',
      'Because each step throws away half the remaining tree, a balanced tree needs only ~log₂(n) steps.',
    ],
    useWhen: [
      'You need fast lookups but also want to iterate values in sorted order.',
      'Data changes often (frequent inserts/deletes) and you still want ordered access.',
      'You need range queries like "all values between 10 and 20".',
    ],
    strengths: [
      'O(log n) search/insert/delete when balanced.',
      'In-order traversal yields sorted output for free.',
      'Supports min, max, predecessor, successor and range queries.',
    ],
    weaknesses: [
      'Degenerates to O(n) if values arrive already sorted (becomes a linked list).',
      'Needs balancing logic (AVL, red-black) to guarantee performance.',
      'Slower constant factors and worse cache behaviour than a hash table for plain lookups.',
    ],
    realWorld: [
      'Database indexes (B-trees are a generalisation).',
      'Language standard libraries: C++ std::map, Java TreeMap.',
      'Filesystem and in-memory ordered key stores.',
    ],
  },

  hash: {
    title: 'Hash Table',
    summary:
      'A structure that turns a value into an array index with a hash function, giving near-instant lookups regardless of how much data it holds.',
    how: [
      'A hash function maps each value to a bucket index (here, value % capacity).',
      'Insert: jump to that bucket and add the value to its chain.',
      'Search: jump to the bucket and scan its (usually tiny) chain.',
      'When two values map to the same bucket — a collision — they share a chain.',
    ],
    useWhen: [
      'You need the fastest possible key lookups and do not care about order.',
      'Membership tests: "have I seen this before?"',
      'Counting, caching, deduplication, indexing by id.',
    ],
    strengths: [
      'O(1) average insert, search and delete.',
      'Simple mental model and extremely common in practice.',
      'Scales to huge datasets while staying fast.',
    ],
    weaknesses: [
      'No ordering — cannot iterate sorted or do range queries.',
      'Worst case O(n) if many values collide into one bucket.',
      'Needs a good hash function and resizing to keep chains short.',
    ],
    realWorld: [
      'Dictionaries / maps / sets in every major language (Python dict, JS Map/Object).',
      'Database hash indexes and in-memory caches (Redis, memcached).',
      'Deduplication, symbol tables in compilers, routing tables.',
    ],
  },

  bfs: {
    title: 'Breadth-First Search',
    summary:
      'Explores the grid in expanding rings from the start, guaranteeing the shortest path on an unweighted graph.',
    how: [
      'Keep a FIFO queue of cells to explore, starting with the source.',
      'Take the oldest cell, mark it visited, and add its unvisited neighbours to the back of the queue.',
      'Because cells are processed in the order discovered, you reach everything at distance 1 before distance 2, and so on.',
      'The first time you reach the goal, you have found a shortest path.',
    ],
    useWhen: [
      'Edges are unweighted (every move costs the same).',
      'You need the guaranteed shortest path or fewest moves.',
      'Level-by-level exploration (shortest number of hops).',
    ],
    strengths: [
      'Always finds the shortest path on unweighted graphs.',
      'Simple and predictable.',
    ],
    weaknesses: [
      'Explores in all directions equally — visits many cells.',
      'Ignores edge weights, so it is wrong for weighted graphs.',
    ],
    realWorld: [
      'Shortest path in mazes and unweighted maps.',
      'Social-network "degrees of separation".',
      'Web crawlers exploring links level by level.',
    ],
  },

  dfs: {
    title: 'Depth-First Search',
    summary:
      'Plunges as deep as possible down one path before backtracking. Fast to reach somewhere, but the path it finds is usually not the shortest.',
    how: [
      'Keep a LIFO stack, starting with the source.',
      'Take the most recently added cell, mark it visited, and push its unvisited neighbours.',
      'This drives exploration deep along one branch before retreating.',
      'It stops when it stumbles onto the goal — not necessarily by the shortest route.',
    ],
    useWhen: [
      'You just need to know if a path exists.',
      'Exploring/enumerating all possibilities (maze generation, backtracking).',
      'Memory is tight — DFS uses less than BFS on wide graphs.',
    ],
    strengths: [
      'Low memory footprint.',
      'Natural fit for backtracking and topological problems.',
    ],
    weaknesses: [
      'Does not find the shortest path.',
      'Can wander far from the goal before finding it.',
    ],
    realWorld: [
      'Maze generation and solving.',
      'Cycle detection, topological sort, connected components.',
      'Backtracking solvers (Sudoku, N-Queens).',
    ],
  },

  dijkstra: {
    title: "Dijkstra's Algorithm",
    summary:
      'Expands outward by cheapest cumulative cost, guaranteeing the shortest path even when moves have different weights.',
    how: [
      'Track the best-known distance to every cell, starting at 0 for the source.',
      'Always expand the unvisited cell with the smallest distance so far.',
      'Relax neighbours: if reaching them through the current cell is cheaper, record it.',
      'Once the goal is expanded, its recorded distance is optimal.',
    ],
    useWhen: [
      'Edges have different (non-negative) weights.',
      'You need a guaranteed shortest/cheapest path.',
      'There is no useful estimate of distance to the goal.',
    ],
    strengths: [
      'Optimal on any graph with non-negative weights.',
      'Generalises BFS to weighted graphs.',
    ],
    weaknesses: [
      'Explores in all directions — no sense of where the goal is.',
      'Slower than A* when a good heuristic is available.',
      'Fails with negative edge weights.',
    ],
    realWorld: [
      'GPS and map routing.',
      'Network routing protocols (OSPF).',
      'Any least-cost path over a weighted network.',
    ],
  },

  astar: {
    title: 'A* Search',
    summary:
      "Dijkstra's algorithm plus a heuristic that points toward the goal, so it explores far fewer cells while still finding the shortest path.",
    how: [
      'Score each cell by f = g + h: g is the cost so far, h estimates the remaining distance to the goal.',
      'Here h is the Manhattan distance (grid steps ignoring walls).',
      'Always expand the cell with the lowest f — the one that looks most promising.',
      'With an admissible heuristic (never overestimates), the path found is still optimal.',
    ],
    useWhen: [
      'You have a good estimate of distance to the goal (e.g. geometry).',
      'You want the shortest path but faster than Dijkstra.',
      'Pathfinding in games and maps.',
    ],
    strengths: [
      'Usually explores far fewer cells than BFS/Dijkstra.',
      'Optimal when the heuristic is admissible.',
      'Tunable: the heuristic controls the speed/accuracy trade-off.',
    ],
    weaknesses: [
      'Only as good as its heuristic.',
      'A bad (inadmissible) heuristic can break optimality.',
      'Slightly more complex to implement.',
    ],
    realWorld: [
      'Game AI pathfinding (the industry standard).',
      'Robotics and motion planning.',
      'Route planning where straight-line distance estimates the remainder.',
    ],
  },

  bubble: {
    title: 'Bubble Sort',
    summary:
      'Repeatedly walks the list swapping adjacent out-of-order pairs, so the largest value "bubbles" to the end on each pass.',
    how: [
      'Compare each adjacent pair from left to right; swap them if they are out of order.',
      'After one full pass the largest value has settled at the end.',
      'Repeat over the shrinking unsorted region.',
      'If a whole pass makes no swaps, the list is already sorted — stop early.',
    ],
    useWhen: [
      'Teaching how sorting and swaps work.',
      'Tiny inputs where simplicity beats speed.',
      'Detecting an already-sorted list cheaply (early exit).',
    ],
    strengths: ['Dead simple to write.', 'Stable and in-place.', 'O(n) on already-sorted input with early exit.'],
    weaknesses: ['O(n²) average and worst case.', 'Far more swaps than selection sort.', 'Impractical beyond small n.'],
    realWorld: ['Almost never used in practice.', 'A teaching staple.', 'Occasionally as a tiny "is this sorted?" check.'],
  },

  insertion: {
    title: 'Insertion Sort',
    summary:
      'Builds a sorted prefix one element at a time, sliding each new value left until it sits in the right place.',
    how: [
      'Take the next element from the unsorted part.',
      'Compare it leftward, shifting larger elements one slot right.',
      'Drop it into the gap that opens up.',
      'Repeat until every element has been inserted.',
    ],
    useWhen: [
      'Small arrays.',
      'Nearly-sorted data — it runs in close to O(n).',
      'Online sorting, where elements arrive one at a time.',
    ],
    strengths: ['O(n) best case on nearly-sorted data.', 'Stable, in-place, very low overhead.', 'Excellent for small n.'],
    weaknesses: ['O(n²) on random/reverse data.', 'Lots of element shifting.'],
    realWorld: [
      'The base case inside hybrid sorts (Timsort, introsort) for small subarrays.',
      'Keeping a nearly-sorted stream ordered.',
    ],
  },

  selection: {
    title: 'Selection Sort',
    summary:
      'Repeatedly finds the smallest remaining value and swaps it into the next position — fewest swaps of any of these.',
    how: [
      'Scan the unsorted region to find its minimum.',
      'Swap that minimum into the front of the unsorted region.',
      'Shrink the unsorted region by one.',
      'Repeat until nothing is left unsorted.',
    ],
    useWhen: [
      'When writing/swapping is far more expensive than comparing.',
      'Tiny inputs where its simplicity is fine.',
    ],
    strengths: ['At most n−1 swaps — the fewest here.', 'In-place and simple.'],
    weaknesses: ['Always O(n²) comparisons, even on sorted input.', 'Not stable.'],
    realWorld: ['Niche: when write cost dominates (e.g. minimising flash-memory wear).', 'Teaching.'],
  },

  merge: {
    title: 'Merge Sort',
    summary:
      'Divide and conquer: split the list in half, sort each half, then merge the two sorted halves back together.',
    how: [
      'Recursively split the list until each piece is a single element (already sorted).',
      'Merge pairs of pieces by repeatedly taking the smaller front element.',
      'Combine merged pieces up the tree until the whole list is one sorted run.',
    ],
    useWhen: [
      'You need guaranteed O(n log n) every time.',
      'Stability matters.',
      'Sorting linked lists, or external sorting of data too big for memory.',
    ],
    strengths: ['Guaranteed O(n log n) always.', 'Stable and predictable.', 'Parallelises and works well on linked lists / external data.'],
    weaknesses: ['Needs O(n) extra memory.', 'Larger constants than quicksort in memory.', 'Not in-place for arrays.'],
    realWorld: ['External sorting of huge files.', 'Library stable sorts (Timsort is merge-based).', 'Sorting linked lists.'],
  },

  quick: {
    title: 'Quick Sort',
    summary:
      'Pick a pivot, partition values into smaller-than and larger-than groups around it, then recurse on each group.',
    how: [
      'Choose a pivot element.',
      'Partition: move smaller values to its left, larger to its right.',
      'The pivot is now in its final sorted position.',
      'Recurse on the left and right partitions.',
    ],
    useWhen: [
      'General-purpose in-memory sorting.',
      'Average speed matters and stability does not.',
    ],
    strengths: ['Usually the fastest in practice.', 'In-place and cache-friendly.', 'O(n log n) average.'],
    weaknesses: ['O(n²) worst case with bad pivots (e.g. sorted input).', 'Not stable.', 'Recursion depth on degenerate splits.'],
    realWorld: ['The default sort in many standard libraries — often as introsort (quicksort + heapsort fallback).'],
  },

  heap: {
    title: 'Heap Sort',
    summary:
      'Turn the array into a max-heap, then repeatedly move the largest element to the end and re-heapify.',
    how: [
      'Build a max-heap from the array in place.',
      'Swap the root (the maximum) with the last element.',
      'Shrink the heap by one and sift the new root down to restore the heap.',
      'Repeat until the heap is empty — the array is now sorted.',
    ],
    useWhen: [
      'You need guaranteed O(n log n) with O(1) extra memory.',
      'Worst-case guarantees matter (real-time systems).',
    ],
    strengths: ['Guaranteed O(n log n).', 'In-place, O(1) extra space.', 'No catastrophic worst case.'],
    weaknesses: ['Not stable.', 'Poor cache locality from heap index jumps.', 'Slower in practice than quicksort.'],
    realWorld: ['Introsort’s fallback to guarantee worst case.', 'Priority-queue-driven scheduling.', 'Real-time / embedded systems.'],
  },

  stack: {
    title: 'Stack (LIFO)',
    summary:
      'Last in, first out. You can only touch the top — the most recently added item is the first one out.',
    how: [
      'Push adds an item to the top of the stack.',
      'Pop removes and returns the item from the top.',
      'Both are O(1) — you never reach into the middle.',
      'Think of a stack of plates: you add and take from the top only.',
    ],
    useWhen: [
      'Undo/redo histories.',
      'Backtracking and depth-first traversal.',
      'Evaluating expressions and matching brackets.',
    ],
    strengths: ['O(1) push and pop.', 'Dead simple.', 'Natural fit for nested / recursive processes.'],
    weaknesses: ['Only the top is reachable.', 'No random access or search without emptying it.'],
    realWorld: [
      'The function call stack itself.',
      'Browser back button and editor undo.',
      'DFS, parsers, and expression evaluation.',
    ],
  },

  queue: {
    title: 'Queue (FIFO)',
    summary:
      'First in, first out. Add at the back, remove from the front — items are served in arrival order.',
    how: [
      'Enqueue adds an item to the back.',
      'Dequeue removes the item at the front.',
      'Order is preserved: the oldest item leaves first.',
      'Think of a line at a checkout — first to arrive is first served.',
    ],
    useWhen: [
      'Processing work in the order it arrived.',
      'Breadth-first traversal.',
      'Buffering between a producer and a consumer.',
    ],
    strengths: ['O(1) enqueue and dequeue (with the right backing store).', 'Preserves order — fair processing.'],
    weaknesses: [
      'Only the front and back are reachable.',
      'A naive array that shifts on dequeue is O(n) — use a linked list or ring buffer.',
    ],
    realWorld: ['Job/task queues and OS scheduling.', 'BFS.', 'Print spoolers and message queues.'],
  },

  linkedlist: {
    title: 'Linked List (singly)',
    summary:
      'A chain of nodes where each node holds a value and a pointer to the next; the list is reachable only through the head.',
    how: [
      'Each node stores its value and a reference (“next”) to the following node.',
      'The head pointer marks the first node; the last node points to nothing.',
      'To reach the k-th node you must follow next k times — there is no random jump.',
      'Insert and delete just rewire a couple of next pointers — no shifting.',
    ],
    useWhen: [
      'Frequent insertion/deletion at the front or at a known node.',
      'The size changes a lot and you never need indexed access.',
      'Building other structures (stacks, queues, adjacency lists).',
    ],
    strengths: ['O(1) insert/delete at the head.', 'Grows without resizing or copying.', 'No need for one contiguous block of memory.'],
    weaknesses: ['O(n) to reach an index or search — you must walk the chain.', 'Extra memory per node for the pointer.', 'Poor cache locality versus an array.'],
    realWorld: ['Implementations of stacks and queues.', 'Adjacency lists in graphs.', 'LRU caches (doubly linked) and allocator free lists.'],
  },
}
