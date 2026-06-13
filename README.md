# AlgoViz

Interactive algorithm visualizer — see *how* algorithms work, *why* they're faster or slower, and what their complexity really means, step by step.

This first milestone covers **sorting algorithms**. The architecture is built to extend to data structures and pathfinding next.

## How it works

The core idea: **algorithms don't render**. Each algorithm is instrumented as a generator that mutates an array and `yield`s a stream of semantic events (`compare`, `swap`, `overwrite`, `pivot`, `markSorted`, …). A generic frame builder replays that stream into snapshots, and a player renders them. This single abstraction gives, for free:

- ▶️ play / pause / step-forward / step-back / scrub
- 🐢🐇 speed control
- 📊 live counters (comparisons, swaps, array accesses) — the complexity story, made visible
- 🧠 per-step narration + per-algorithm Big-O reference

See `src/engine/` for the engine and `src/engine/algorithms.ts` for the textbook-faithful generators.

## Algorithms

Bubble · Insertion · Selection · Merge · Quick · Heap — each with best/average/worst/space complexity and stability.

Input distributions (random / nearly-sorted / reversed / few-unique) let you *see* why, e.g., insertion sort shines on nearly-sorted data and quick sort degrades on already-ordered input.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

Built with Vite + React + TypeScript + Tailwind + Zustand.

> Requires Node.js 20.19+ (or 22.12+) for Vite 8.

## Roadmap

- [x] Phase 0–1: scaffold + step-trace engine + player
- [x] Phase 2: sorting algorithms
- [ ] Phase 3: pseudocode highlighting synced to steps
- [ ] Phase 4: side-by-side algorithm race / compare mode
- [ ] Next milestone: data structures (trees, graphs, hash tables), pathfinding (BFS/DFS/Dijkstra/A*)
