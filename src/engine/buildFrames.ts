import type { EventType, Frame, SortEvent } from './types'

function describe(ev: SortEvent): string {
  const [i, j] = ev.indices
  switch (ev.type) {
    case 'compare':
      return `Comparing positions ${i} and ${j}`
    case 'swap':
      return `Swapping positions ${i} and ${j}`
    case 'overwrite':
      return `Writing merged value into position ${i}`
    case 'pivot':
      return `Pivot chosen at position ${i}`
    case 'select':
      return `Current minimum tracked at position ${i}`
    case 'markSorted':
      return `Position ${i} locked into its final place`
  }
}

// Replays an algorithm's event stream into an array of frames. Each frame is a
// full snapshot of the array plus what's being touched and the running stats.
// O(n) snapshots are fine for the modest array sizes used in the visualizer.
export function buildFrames(
  gen: (a: number[]) => Generator<SortEvent>,
  initial: number[],
): Frame[] {
  const arr = initial.slice()
  const frames: Frame[] = []
  const sorted = new Set<number>()
  const stats = { comparisons: 0, swaps: 0, accesses: 0 }
  let line = -1 // last known pseudocode line; carried forward when an event omits it

  const push = (active: number[], role: EventType, message: string) => {
    frames.push({
      array: arr.slice(),
      active,
      activeRole: role,
      sorted: [...sorted],
      stats: { ...stats },
      message,
      line,
    })
  }

  push([], 'compare', 'Initial array — nothing is sorted yet')

  for (const ev of gen(arr)) {
    switch (ev.type) {
      case 'compare':
        stats.comparisons++
        stats.accesses += 2
        break
      case 'swap':
        stats.swaps++
        stats.accesses += 4
        break
      case 'overwrite':
        stats.accesses += 1
        break
    }
    if (ev.line !== undefined) line = ev.line
    if (ev.type === 'markSorted') ev.indices.forEach((i) => sorted.add(i))
    push(ev.type === 'markSorted' ? [] : ev.indices, ev.type, ev.message ?? describe(ev))
  }

  for (let i = 0; i < arr.length; i++) sorted.add(i)
  line = -1
  push(
    [],
    'compare',
    `Done — sorted in ${stats.comparisons} comparisons and ${stats.swaps} swaps`,
  )

  return frames
}
