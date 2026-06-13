import { create } from 'zustand'
import { HashTable, type HashFrame } from '../structures/hashTable'

let table = new HashTable(8)

const IDLE = 'A hash table with separate chaining. Insert or search a value to see it hash and walk the chain.'

function seed(n: number): HashFrame {
  table = new HashTable(8)
  const used = new Set<number>()
  while (used.size < n) used.add(1 + Math.floor(Math.random() * 99))
  used.forEach((v) => table.insertSilent(v))
  return table.snapshot({ message: IDLE })
}

interface HashState {
  frames: HashFrame[]
  cursor: number
  playing: boolean
  speed: number
  input: string

  setInput: (v: string) => void
  insert: () => void
  search: () => void
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

export const useHashStore = create<HashState>((set, get) => ({
  frames: [seed(6)],
  cursor: 0,
  playing: false,
  speed: 4,
  input: '',

  setInput: (v) => set({ input: v.replace(/[^0-9]/g, '').slice(0, 3) }),

  insert: () => {
    if (!get().input) return
    set({ frames: table.insertTrace(Number(get().input)), cursor: 0, playing: true, input: '' })
  },

  search: () => {
    if (!get().input) return
    set({ frames: table.searchTrace(Number(get().input)), cursor: 0, playing: true, input: '' })
  },

  randomize: () => set({ frames: [seed(6)], cursor: 0, playing: false, input: '' }),

  reset: () => {
    table = new HashTable(8)
    set({ frames: [table.snapshot({ message: 'Empty hash table — insert a value to begin.' })], cursor: 0, playing: false, input: '' })
  },

  play: () => set((s) => (s.cursor >= s.frames.length - 1 ? { playing: true, cursor: 0 } : { playing: true })),
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),
  stepForward: () => set((s) => ({ cursor: Math.min(s.cursor + 1, s.frames.length - 1), playing: false })),
  stepBack: () => set((s) => ({ cursor: Math.max(s.cursor - 1, 0), playing: false })),
  seek: (i) => set((s) => ({ cursor: Math.max(0, Math.min(i, s.frames.length - 1)), playing: false })),
  setSpeed: (sp) => set({ speed: sp }),
}))
