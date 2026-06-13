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
}
