import { create } from 'zustand'
import { runPathfinding, type Grid, type GridFrame, type PathAlgo } from '../structures/pathfinding'

const ROWS = 13
const COLS = 25
const START = 6 * COLS + 3
const END = 6 * COLS + (COLS - 4)

export type PaintMode = 'wall' | 'weight'

function idleFrame(): GridFrame {
  return {
    visited: [],
    frontier: [],
    current: null,
    path: [],
    message: 'Draw walls or weighted terrain, pick an algorithm, then press Run.',
    stats: { visited: 0, pathLength: 0, pathCost: 0 },
  }
}

function makeGrid(walls: Set<number>, weights: Set<number>): Grid {
  return { rows: ROWS, cols: COLS, walls, weights, start: START, end: END }
}

function randomMazeGrid(): Grid {
  const walls = new Set<number>()
  const weights = new Set<number>()
  for (let i = 0; i < ROWS * COLS; i++) {
    if (i === START || i === END) continue
    const r = Math.random()
    if (r < 0.18) walls.add(i)
    else if (r < 0.4) weights.add(i)
  }
  return makeGrid(walls, weights)
}

interface GridState {
  grid: Grid
  algo: PathAlgo
  paintMode: PaintMode
  frames: GridFrame[]
  cursor: number
  playing: boolean
  speed: number

  setAlgo: (a: PathAlgo) => void
  setPaintMode: (m: PaintMode) => void
  paintCell: (i: number, on: boolean) => void
  run: () => void
  clearGrid: () => void
  randomMaze: () => void
  play: () => void
  pause: () => void
  toggle: () => void
  stepForward: () => void
  stepBack: () => void
  seek: (i: number) => void
  setSpeed: (s: number) => void
}

export const useGridStore = create<GridState>((set, get) => ({
  grid: makeGrid(new Set(), new Set()),
  algo: 'astar',
  paintMode: 'wall',
  frames: [idleFrame()],
  cursor: 0,
  playing: false,
  speed: 25,

  setAlgo: (a) => set({ algo: a, frames: [idleFrame()], cursor: 0, playing: false }),
  setPaintMode: (m) => set({ paintMode: m }),

  paintCell: (i, on) => {
    const { grid, paintMode } = get()
    if (i === grid.start || i === grid.end) return
    const walls = new Set(grid.walls)
    const weights = new Set(grid.weights)
    // a cell is at most one of: wall, weight, normal
    if (paintMode === 'wall') {
      weights.delete(i)
      if (on) walls.add(i)
      else walls.delete(i)
    } else {
      walls.delete(i)
      if (on) weights.add(i)
      else weights.delete(i)
    }
    set({ grid: makeGrid(walls, weights), frames: [idleFrame()], cursor: 0, playing: false })
  },

  run: () => {
    const { grid, algo } = get()
    set({ frames: runPathfinding(grid, algo), cursor: 0, playing: true })
  },

  clearGrid: () => set({ grid: makeGrid(new Set(), new Set()), frames: [idleFrame()], cursor: 0, playing: false }),
  randomMaze: () => set({ grid: randomMazeGrid(), frames: [idleFrame()], cursor: 0, playing: false }),

  play: () => set((s) => (s.cursor >= s.frames.length - 1 ? { playing: true, cursor: 0 } : { playing: true })),
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),
  stepForward: () => set((s) => ({ cursor: Math.min(s.cursor + 1, s.frames.length - 1), playing: false })),
  stepBack: () => set((s) => ({ cursor: Math.max(s.cursor - 1, 0), playing: false })),
  seek: (i) => set((s) => ({ cursor: Math.max(0, Math.min(i, s.frames.length - 1)), playing: false })),
  setSpeed: (sp) => set({ speed: sp }),
}))
