export type Preset = 'random' | 'nearlySorted' | 'reversed' | 'fewUnique'

export const PRESETS: { id: Preset; label: string }[] = [
  { id: 'random', label: 'Random' },
  { id: 'nearlySorted', label: 'Nearly sorted' },
  { id: 'reversed', label: 'Reversed' },
  { id: 'fewUnique', label: 'Few unique' },
]

function shuffle(a: number[]): number[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Produces an input array shaped to highlight how an algorithm behaves on a
// given distribution — e.g. "nearly sorted" makes insertion sort shine and
// "reversed" exposes quick sort's worst case.
export function generateArray(size: number, preset: Preset): number[] {
  const base = Array.from({ length: size }, (_, i) => i + 1)
  switch (preset) {
    case 'random':
      return shuffle(base)
    case 'reversed':
      return base.reverse()
    case 'nearlySorted': {
      const swaps = Math.max(1, Math.floor(size * 0.08))
      for (let s = 0; s < swaps; s++) {
        const i = Math.floor(Math.random() * size)
        const j = Math.min(size - 1, i + 1 + Math.floor(Math.random() * 2))
        ;[base[i], base[j]] = [base[j], base[i]]
      }
      return base
    }
    case 'fewUnique': {
      const buckets = 5
      const step = Math.max(1, Math.floor(size / buckets))
      return Array.from(
        { length: size },
        () => (1 + Math.floor(Math.random() * buckets)) * step,
      )
    }
  }
}
