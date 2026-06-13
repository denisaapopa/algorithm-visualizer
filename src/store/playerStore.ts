import { create } from 'zustand'
import { buildFrames } from '../engine/buildFrames'
import { getAlgorithm } from '../engine/algorithms'
import { generateArray, type Preset } from '../engine/generateArray'
import type { Frame } from '../engine/types'

interface PlayerState {
  algorithmId: string
  algorithmIdB: string
  compareMode: boolean
  size: number
  preset: Preset
  baseArray: number[]
  frames: Frame[]
  framesB: Frame[]
  cursor: number
  playing: boolean
  speed: number // steps per second

  setAlgorithm: (id: string) => void
  setAlgorithmB: (id: string) => void
  toggleCompare: () => void
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

// Highest cursor index across the active trace(s). In compare mode both
// algorithms step in lockstep over the same input, so the timeline spans the
// longer of the two — the shorter one simply finishes (and "wins") first.
export const lastFrame = (s: PlayerState): number =>
  (s.compareMode ? Math.max(s.frames.length, s.framesB.length) : s.frames.length) - 1

const INITIAL_SIZE = 28
const INITIAL_PRESET: Preset = 'random'
const INITIAL_ALGO = 'bubble'
const INITIAL_ALGO_B = 'quick'
const initialArray = generateArray(INITIAL_SIZE, INITIAL_PRESET)

export const usePlayerStore = create<PlayerState>((set, get) => ({
  algorithmId: INITIAL_ALGO,
  algorithmIdB: INITIAL_ALGO_B,
  compareMode: false,
  size: INITIAL_SIZE,
  preset: INITIAL_PRESET,
  baseArray: initialArray,
  frames: rebuild(INITIAL_ALGO, initialArray),
  framesB: rebuild(INITIAL_ALGO_B, initialArray),
  cursor: 0,
  playing: false,
  speed: 8,

  setAlgorithm: (id) =>
    set((s) => ({ algorithmId: id, frames: rebuild(id, s.baseArray), cursor: 0, playing: false })),

  setAlgorithmB: (id) =>
    set((s) => ({ algorithmIdB: id, framesB: rebuild(id, s.baseArray), cursor: 0, playing: false })),

  toggleCompare: () => set((s) => ({ compareMode: !s.compareMode, cursor: 0, playing: false })),

  setSize: (n) => {
    const base = generateArray(n, get().preset)
    set((s) => ({
      size: n,
      baseArray: base,
      frames: rebuild(s.algorithmId, base),
      framesB: rebuild(s.algorithmIdB, base),
      cursor: 0,
      playing: false,
    }))
  },

  setPreset: (p) => {
    const base = generateArray(get().size, p)
    set((s) => ({
      preset: p,
      baseArray: base,
      frames: rebuild(s.algorithmId, base),
      framesB: rebuild(s.algorithmIdB, base),
      cursor: 0,
      playing: false,
    }))
  },

  regenerate: () => {
    const base = generateArray(get().size, get().preset)
    set((s) => ({
      baseArray: base,
      frames: rebuild(s.algorithmId, base),
      framesB: rebuild(s.algorithmIdB, base),
      cursor: 0,
      playing: false,
    }))
  },

  play: () => set((s) => (s.cursor >= lastFrame(s) ? { playing: true, cursor: 0 } : { playing: true })),
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),
  stepForward: () => set((s) => ({ cursor: Math.min(s.cursor + 1, lastFrame(s)), playing: false })),
  stepBack: () => set((s) => ({ cursor: Math.max(s.cursor - 1, 0), playing: false })),
  seek: (i) => set((s) => ({ cursor: Math.max(0, Math.min(i, lastFrame(s))), playing: false })),
  setSpeed: (sp) => set({ speed: sp }),
  restart: () => set({ cursor: 0, playing: false }),
}))
