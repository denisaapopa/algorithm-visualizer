import { create } from 'zustand'
import { LinkedList, type ListFrame } from '../structures/linkedList'

let list = new LinkedList()

const IDLE = 'A singly linked list. Insert at the head (O(1)) or tail (O(n)), search, or delete a value.'

function seed(n: number): ListFrame {
  list = new LinkedList()
  for (let i = 0; i < n; i++) list.insertSilent(1 + Math.floor(Math.random() * 99))
  return list.snapshot({ message: IDLE })
}

interface ListState {
  frames: ListFrame[]
  cursor: number
  playing: boolean
  speed: number
  input: string

  setInput: (v: string) => void
  insertHead: () => void
  insertTail: () => void
  search: () => void
  remove: () => void
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

export const useListStore = create<ListState>((set, get) => ({
  frames: [seed(5)],
  cursor: 0,
  playing: false,
  speed: 4,
  input: '',

  setInput: (v) => set({ input: v.replace(/[^0-9]/g, '').slice(0, 3) }),

  insertHead: () => {
    if (!get().input) return
    set({ frames: list.insertHead(Number(get().input)), cursor: 0, playing: true, input: '' })
  },
  insertTail: () => {
    if (!get().input) return
    set({ frames: list.insertTail(Number(get().input)), cursor: 0, playing: true, input: '' })
  },
  search: () => {
    if (!get().input) return
    set({ frames: list.search(Number(get().input)), cursor: 0, playing: true, input: '' })
  },
  remove: () => {
    if (!get().input) return
    set({ frames: list.remove(Number(get().input)), cursor: 0, playing: true, input: '' })
  },

  randomize: () => set({ frames: [seed(5)], cursor: 0, playing: false, input: '' }),
  reset: () => {
    list = new LinkedList()
    set({ frames: [list.snapshot({ message: 'Empty list — insert a value to begin.' })], cursor: 0, playing: false, input: '' })
  },

  play: () => set((s) => (s.cursor >= s.frames.length - 1 ? { playing: true, cursor: 0 } : { playing: true })),
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),
  stepForward: () => set((s) => ({ cursor: Math.min(s.cursor + 1, s.frames.length - 1), playing: false })),
  stepBack: () => set((s) => ({ cursor: Math.max(s.cursor - 1, 0), playing: false })),
  seek: (i) => set((s) => ({ cursor: Math.max(0, Math.min(i, s.frames.length - 1)), playing: false })),
  setSpeed: (sp) => set({ speed: sp }),
}))
