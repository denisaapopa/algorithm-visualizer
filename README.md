# AlgoViz

Interactive algorithm & data-structure visualizer — see *how* things work, *why* they're faster or slower, and what their complexity really means, step by step.

Three pillars, all on one consistent engine:

- **Sorting** — Bubble, Insertion, Selection, Merge, Quick, Heap. Race two at once, follow the synced pseudocode, and watch the comparison/swap counters explain the speed difference.
- **Data Structures** — Binary Search Tree, Hash Table, Linked List, Stack & Queue. Insert, search, delete (and BST traversals) animated step by step.
- **Pathfinding** — BFS, DFS, Dijkstra, A* on a grid you draw yourself, with walls *and* weighted terrain so the algorithms visibly disagree.

Every algorithm and structure comes with live visualization, full transport controls, keyboard shortcuts, and plain-language explanations (how it works · when to use it · strengths · trade-offs · real-world uses).

## How it works

The core idea: **algorithms don't render**. Each algorithm or operation is instrumented to emit a stream of semantic *frames* — snapshots of state plus what's being touched. A generic player replays them. That single abstraction gives, for free:

- ▶️ play / pause / step-forward / step-back / scrub
- 🐢🐇 speed control
- 📊 live counters (comparisons, swaps, cells explored, path cost…) — the complexity story, made visible
- 🧠 per-step narration, pseudocode highlighting, Big-O reference
- ⌨️ keyboard transport: `Space` play/pause, `←` / `→` step

Sorting algorithms are generators that `yield` events (`compare`, `swap`, `pivot`, …) — see `src/engine/`. Data structures and pathfinding each produce their own `*Frame[]` traces in `src/structures/`. The grid algorithms (BFS/DFS/Dijkstra/A*) share one best-first search that differs only in which frontier cell it expands next.

## Highlights to try

- **Sorting** — open Compare mode and race Quick vs Merge on *reversed* input to see quick sort's worst case; or Insertion on *nearly-sorted* data to see its O(n) best case.
- **BST** — run an *in-order* traversal and watch the output come out sorted; insert `1, 2, 3, 4, 5` in order to watch the tree degenerate into a linked list; delete a node with two children to see the in-order successor take its place.
- **Hash Table** — insert until you see collisions chain, and watch the load factor climb.
- **Pathfinding** — paint a band of weighted terrain, then run BFS vs Dijkstra: BFS charges straight through (fewest cells) while Dijkstra detours around it (lowest cost). A* reaches the same optimal path while exploring a fraction of the cells.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

Built with **Vite + React + TypeScript + Tailwind + Zustand**. No backend — it's a pure client-side SPA.

> Requires Node.js 20.19+ (or 22.12+) for Vite 8.

## Project layout

```
src/
  engine/        sorting: step-trace types, algorithms, frame builder
  structures/    bst · hashTable · linkedList · stackQueue · pathfinding
  store/         one Zustand store per visualizer
  components/    views + shared Bars/TreeView/Explainer
  content/       plain-language explanations
  hooks/         playback loop + keyboard transport
```

## Status

- [x] Sorting — 6 algorithms, race/compare mode, pseudocode sync, explanations
- [x] Data Structures — BST (insert/search/delete/traversals), Hash Table, Linked List, Stack & Queue
- [x] Pathfinding — BFS/DFS/Dijkstra/A*, walls + weighted terrain
- [x] Polish — keyboard shortcuts, per-section intros, explanations everywhere

### Possible next steps

- Self-balancing trees (AVL / red-black)
- Draggable start/goal on the pathfinding grid
- More sorting algorithms (Tim/Shell/radix) and graph algorithms
