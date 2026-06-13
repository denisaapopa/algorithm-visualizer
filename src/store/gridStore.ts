import { create } from 'zustand'
import { runPathfinding, type Grid, type GridFrame, type PathAlgo } from '../structures/pathfinding'

const ROWS = 13
const COLS = 25
const START = 6 * COLS + 3
const END = 6 * COLS + (COLS - 4)

function idleFrame(): GridFrame {
  return {
    visited: [],
    frontier: [],
    current: null,
    path: [],
    message: 'Draw walls with the mouse, pick an algorithm, then press Run.',
    stats: { visited: 0, pathLength: 0 },
  }
}

function emptyGrid(walls: Set<number>): Grid {
  return { rows: ROWS, cols: COLS, walls, start: START, end: END }
}

function randomWalls(): Set<number> {
  const walls = new Set<number>()
  for (let i = 0; i < ROWS * COLS; i++) {
    if (i === START || i === END) continue
    if (Math.random() < 0.25) walls.add(i)
  }
  return walls
}

interface GridState {
  grid: Grid
  algo: PathAlgo
  frames: GridFrame[]
  cursor: number
  playing: boolean
  speed: number

  setAlgo: (a: PathAlgo) => void
  toggleWall: (i: number, on: boolean) => void
  run: () => void
  clearWalls: () => void
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
  grid: emptyGrid(new Set()),
  algo: 'astar',
  frames: [idleFrame()],
  cursor: 0,
  playing: false,
  speed: 25,

  setAlgo: (a) => set({ algo: a, frames: [idleFrame()], cursor: 0, playing: false }),

  toggleWall: (i, on) => {
    const { grid } = get()
    if (i === grid.start || i === grid.end) return
    const walls = new Set(grid.walls)
    if (on) walls.add(i)
    else walls.delete(i)
    set({ grid: emptyGrid(walls), frames: [idleFrame()], cursor: 0, playing: false })
  },

  run: () => {
    const { grid, algo } = get()
    set({ frames: runPathfinding(grid, algo), cursor: 0, playing: true })
  },

  clearWalls: () => set({ grid: emptyGrid(new Set()), frames: [idleFrame()], cursor: 0, playing: false }),

  randomMaze: () => set({ grid: emptyGrid(randomWalls()), frames: [idleFrame()], cursor: 0, playing: false }),

  play: () => set((s) => (s.cursor >= s.frames.length - 1 ? { playing: true, cursor: 0 } : { playing: true })),
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),
  stepForward: () => set((s) => ({ cursor: Math.min(s.cursor + 1, s.frames.length - 1), playing: false })),
  stepBack: () => set((s) => ({ cursor: Math.max(s.cursor - 1, 0), playing: false })),
  seek: (i) => set((s) => ({ cursor: Math.max(0, Math.min(i, s.frames.length - 1)), playing: false })),
  setSpeed: (sp) => set({ speed: sp }),
}))
