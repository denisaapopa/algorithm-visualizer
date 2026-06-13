import { create } from 'zustand'
import { buildFrames } from '../engine/buildFrames'
import { getAlgorithm } from '../engine/algorithms'
import { generateArray, type Preset } from '../engine/generateArray'
import type { Frame } from '../engine/types'

interface PlayerState {
  algorithmId: string
  size: number
  preset: Preset
  baseArray: number[]
  frames: Frame[]
  cursor: number
  playing: boolean
  speed: number // steps per second

  setAlgorithm: (id: string) => void
  setSize: (n: number) => void
  setPreset: (p: Preset) => void
  regenerate: () => void
  play: () => void
  pause: () => void
  toggle: () => void
  stepForward: () => void
  stepBack: () => void
  seek: (i: number) => void
  setSpeed: (s: number) => void
  restart: () => void
}

function rebuild(algorithmId: string, baseArray: number[]): Frame[] {
  return buildFrames(getAlgorithm(algorithmId).generator, baseArray)
}

const INITIAL_SIZE = 28
const INITIAL_PRESET: Preset = 'random'
const INITIAL_ALGO = 'bubble'
const initialArray = generateArray(INITIAL_SIZE, INITIAL_PRESET)

export const usePlayerStore = create<PlayerState>((set, get) => ({
  algorithmId: INITIAL_ALGO,
  size: INITIAL_SIZE,
  preset: INITIAL_PRESET,
  baseArray: initialArray,
  frames: rebuild(INITIAL_ALGO, initialArray),
  cursor: 0,
  playing: false,
  speed: 8,

  setAlgorithm: (id) =>
    set((s) => ({ algorithmId: id, frames: rebuild(id, s.baseArray), cursor: 0, playing: false })),

  setSize: (n) => {
    const base = generateArray(n, get().preset)
    set((s) => ({ size: n, baseArray: base, frames: rebuild(s.algorithmId, base), cursor: 0, playing: false }))
  },

  setPreset: (p) => {
    const base = generateArray(get().size, p)
    set((s) => ({ preset: p, baseArray: base, frames: rebuild(s.algorithmId, base), cursor: 0, playing: false }))
  },

  regenerate: () => {
    const base = generateArray(get().size, get().preset)
    set((s) => ({ baseArray: base, frames: rebuild(s.algorithmId, base), cursor: 0, playing: false }))
  },

  play: () =>
    set((s) => (s.cursor >= s.frames.length - 1 ? { playing: true, cursor: 0 } : { playing: true })),
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),
  stepForward: () => set((s) => ({ cursor: Math.min(s.cursor + 1, s.frames.length - 1), playing: false })),
  stepBack: () => set((s) => ({ cursor: Math.max(s.cursor - 1, 0), playing: false })),
  seek: (i) => set((s) => ({ cursor: Math.max(0, Math.min(i, s.frames.length - 1)), playing: false })),
  setSpeed: (sp) => set({ speed: sp }),
  restart: () => set({ cursor: 0, playing: false }),
}))
