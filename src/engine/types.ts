// The core abstraction: algorithms don't render. They emit a stream of
// semantic events. `buildFrames` replays that stream into snapshots, and the
// UI player renders snapshots. This decouples algorithm logic from animation
// and gives play/pause/step/scrub + complexity counters for free.

export type EventType =
  | 'compare'    // two positions are being compared
  | 'swap'       // two positions exchanged values
  | 'overwrite'  // a position was written with a new value (merge sort)
  | 'markSorted' // a position is locked in its final place
  | 'pivot'      // a position chosen as pivot (quick sort)
  | 'select'     // a position tracked as current min/target (selection sort)

export interface SortEvent {
  type: EventType
  indices: number[]
  message?: string
  line?: number // pseudocode line index this event executes
}

export interface Stats {
  comparisons: number
  swaps: number
  accesses: number
}

export interface Frame {
  array: number[]
  active: number[]
  activeRole: EventType
  sorted: number[]
  stats: Stats
  message: string
  line: number // pseudocode line to highlight for this frame
}

export interface Complexity {
  best: string
  average: string
  worst: string
  space: string
  stable: boolean
}

export interface AlgorithmMeta {
  id: string
  name: string
  generator: (a: number[]) => Generator<SortEvent>
  complexity: Complexity
  blurb: string
  pseudocode: string[] // one entry per line; events reference these by index
}
