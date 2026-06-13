import { create } from 'zustand'
import { BST, type TraversalOrder, type TreeFrame } from '../structures/bst'

// Single live tree, mutated by inserts. Rendering is driven purely by `frames`.
let tree = new BST()

const IDLE = 'A binary search tree. Insert or search a value to watch the path it walks.'

function seed(n: number): TreeFrame {
  tree = new BST()
  const used = new Set<number>()
  while (used.size < n) used.add(1 + Math.floor(Math.random() * 99))
  used.forEach((v) => tree.insertSilent(v))
  return tree.snapshot({ message: IDLE })
}

interface BstState {
  frames: TreeFrame[]
  cursor: number
  playing: boolean
  speed: number
  input: string

  setInput: (v: string) => void
  insert: () => void
  search: () => void
  remove: () => void
  traverse: (order: TraversalOrder) => void
  randomize: () => void
  reset: () => void
  play: () => void
  pause: () => void
  toggle: () => void
  stepForward: () => void
  stepBack: () => void
  seek: (i: number) => void
  setSpeed: (s: number) => void
}

const initial = seed(7)

export const useBstStore = create<BstState>((set, get) => ({
  frames: [initial],
  cursor: 0,
  playing: false,
  speed: 4,
  input: '',

  setInput: (v) => set({ input: v.replace(/[^0-9]/g, '').slice(0, 3) }),

  insert: () => {
    const value = Number(get().input)
    if (!get().input || Number.isNaN(value)) return
    set({ frames: tree.insertTrace(value), cursor: 0, playing: true, input: '' })
  },

  search: () => {
    const value = Number(get().input)
    if (!get().input || Number.isNaN(value)) return
    set({ frames: tree.searchTrace(value), cursor: 0, playing: true, input: '' })
  },

  remove: () => {
    const value = Number(get().input)
    if (!get().input || Number.isNaN(value)) return
    set({ frames: tree.deleteTrace(value), cursor: 0, playing: true, input: '' })
  },

  traverse: (order) => set({ frames: tree.traverse(order), cursor: 0, playing: true }),

  randomize: () => set({ frames: [seed(7)], cursor: 0, playing: false, input: '' }),

  reset: () => {
    tree = new BST()
    set({ frames: [tree.snapshot({ message: 'Empty tree — insert a value to begin.' })], cursor: 0, playing: false, input: '' })
  },

  play: () => set((s) => (s.cursor >= s.frames.length - 1 ? { playing: true, cursor: 0 } : { playing: true })),
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),
  stepForward: () => set((s) => ({ cursor: Math.min(s.cursor + 1, s.frames.length - 1), playing: false })),
  stepBack: () => set((s) => ({ cursor: Math.max(s.cursor - 1, 0), playing: false })),
  seek: (i) => set((s) => ({ cursor: Math.max(0, Math.min(i, s.frames.length - 1)), playing: false })),
  setSpeed: (sp) => set({ speed: sp }),
}))
