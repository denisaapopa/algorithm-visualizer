import { create } from 'zustand'
import { StackQueue, type SQFrame, type SQMode } from '../structures/stackQueue'

let sq = new StackQueue('stack')

function idleMsg(mode: SQMode) {
  return mode === 'stack'
    ? 'A stack (LIFO). Push adds to the top; pop removes the top.'
    : 'A queue (FIFO). Enqueue adds to the back; dequeue removes from the front.'
}

function seed(mode: SQMode, n: number): SQFrame {
  sq = new StackQueue(mode)
  for (let i = 0; i < n; i++) sq.addSilent(1 + Math.floor(Math.random() * 99))
  return sq.snapshot({ message: idleMsg(mode) })
}

interface SQState {
  mode: SQMode
  frames: SQFrame[]
  cursor: number
  playing: boolean
  speed: number
  input: string

  setMode: (m: SQMode) => void
  setInput: (v: string) => void
  add: () => void
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

export const useSqStore = create<SQState>((set, get) => ({
  mode: 'stack',
  frames: [seed('stack', 4)],
  cursor: 0,
  playing: false,
  speed: 4,
  input: '',

  setMode: (m) => set({ mode: m, frames: [seed(m, 4)], cursor: 0, playing: false, input: '' }),
  setInput: (v) => set({ input: v.replace(/[^0-9]/g, '').slice(0, 3) }),

  add: () => {
    if (!get().input) return
    set({ frames: sq.add(Number(get().input)), cursor: 0, playing: true, input: '' })
  },
  remove: () => set({ frames: sq.remove(), cursor: 0, playing: true }),

  randomize: () => set((s) => ({ frames: [seed(s.mode, 4)], cursor: 0, playing: false, input: '' })),
  reset: () => {
    sq = new StackQueue(get().mode)
    set((s) => ({ frames: [sq.snapshot({ message: `Empty ${s.mode} — add a value to begin.` })], cursor: 0, playing: false, input: '' }))
  },

  play: () => set((s) => (s.cursor >= s.frames.length - 1 ? { playing: true, cursor: 0 } : { playing: true })),
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),
  stepForward: () => set((s) => ({ cursor: Math.min(s.cursor + 1, s.frames.length - 1), playing: false })),
  stepBack: () => set((s) => ({ cursor: Math.max(s.cursor - 1, 0), playing: false })),
  seek: (i) => set((s) => ({ cursor: Math.max(0, Math.min(i, s.frames.length - 1)), playing: false })),
  setSpeed: (sp) => set({ speed: sp }),
}))
