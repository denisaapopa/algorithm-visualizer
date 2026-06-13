import type { AlgorithmMeta, SortEvent } from './types'

// Each generator mutates the array it's given and yields semantic events.
// They read like textbook pseudocode — that's the point.

export function* bubbleSort(a: number[]): Generator<SortEvent> {
  const n = a.length
  for (let i = 0; i < n; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1] }
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        yield { type: 'swap', indices: [j, j + 1] }
        swapped = true
      }
    }
    yield { type: 'markSorted', indices: [n - i - 1] }
    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) yield { type: 'markSorted', indices: [k] }
      break
    }
  }
}

export function* insertionSort(a: number[]): Generator<SortEvent> {
  const n = a.length
  for (let i = 1; i < n; i++) {
    let j = i
    while (j > 0) {
      yield { type: 'compare', indices: [j - 1, j] }
      if (a[j - 1] > a[j]) {
        ;[a[j - 1], a[j]] = [a[j], a[j - 1]]
        yield { type: 'swap', indices: [j - 1, j] }
        j--
      } else break
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'markSorted', indices: [i] }
}

export function* selectionSort(a: number[]): Generator<SortEvent> {
  const n = a.length
  for (let i = 0; i < n; i++) {
    let min = i
    yield { type: 'select', indices: [min] }
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [min, j] }
      if (a[j] < a[min]) {
        min = j
        yield { type: 'select', indices: [min] }
      }
    }
    if (min !== i) {
      ;[a[i], a[min]] = [a[min], a[i]]
      yield { type: 'swap', indices: [i, min] }
    }
    yield { type: 'markSorted', indices: [i] }
  }
}

function* merge(a: number[], lo: number, mid: number, hi: number): Generator<SortEvent> {
  const left = a.slice(lo, mid + 1)
  const right = a.slice(mid + 1, hi + 1)
  let i = 0
  let j = 0
  let k = lo
  while (i < left.length && j < right.length) {
    yield { type: 'compare', indices: [lo + i, mid + 1 + j] }
    if (left[i] <= right[j]) a[k] = left[i++]
    else a[k] = right[j++]
    yield { type: 'overwrite', indices: [k] }
    k++
  }
  while (i < left.length) {
    a[k] = left[i++]
    yield { type: 'overwrite', indices: [k] }
    k++
  }
  while (j < right.length) {
    a[k] = right[j++]
    yield { type: 'overwrite', indices: [k] }
    k++
  }
}

function* msort(a: number[], lo: number, hi: number): Generator<SortEvent> {
  if (lo >= hi) return
  const mid = (lo + hi) >> 1
  yield* msort(a, lo, mid)
  yield* msort(a, mid + 1, hi)
  yield* merge(a, lo, mid, hi)
}

export function* mergeSort(a: number[]): Generator<SortEvent> {
  yield* msort(a, 0, a.length - 1)
  for (let i = 0; i < a.length; i++) yield { type: 'markSorted', indices: [i] }
}

function* partition(a: number[], lo: number, hi: number): Generator<SortEvent, number> {
  const pivot = a[hi]
  yield { type: 'pivot', indices: [hi] }
  let i = lo
  for (let j = lo; j < hi; j++) {
    yield { type: 'compare', indices: [j, hi] }
    if (a[j] < pivot) {
      ;[a[i], a[j]] = [a[j], a[i]]
      yield { type: 'swap', indices: [i, j] }
      i++
    }
  }
  ;[a[i], a[hi]] = [a[hi], a[i]]
  yield { type: 'swap', indices: [i, hi] }
  return i
}

function* qsort(a: number[], lo: number, hi: number): Generator<SortEvent> {
  if (lo > hi) return
  if (lo === hi) {
    yield { type: 'markSorted', indices: [lo] }
    return
  }
  const p = yield* partition(a, lo, hi)
  yield { type: 'markSorted', indices: [p] }
  yield* qsort(a, lo, p - 1)
  yield* qsort(a, p + 1, hi)
}

export function* quickSort(a: number[]): Generator<SortEvent> {
  yield* qsort(a, 0, a.length - 1)
  for (let i = 0; i < a.length; i++) yield { type: 'markSorted', indices: [i] }
}

function* heapify(a: number[], n: number, i: number): Generator<SortEvent> {
  let largest = i
  const l = 2 * i + 1
  const r = 2 * i + 2
  if (l < n) {
    yield { type: 'compare', indices: [l, largest] }
    if (a[l] > a[largest]) largest = l
  }
  if (r < n) {
    yield { type: 'compare', indices: [r, largest] }
    if (a[r] > a[largest]) largest = r
  }
  if (largest !== i) {
    ;[a[i], a[largest]] = [a[largest], a[i]]
    yield { type: 'swap', indices: [i, largest] }
    yield* heapify(a, n, largest)
  }
}

export function* heapSort(a: number[]): Generator<SortEvent> {
  const n = a.length
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(a, n, i)
  for (let i = n - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]
    yield { type: 'swap', indices: [0, i] }
    yield { type: 'markSorted', indices: [i] }
    yield* heapify(a, i, 0)
  }
  yield { type: 'markSorted', indices: [0] }
}

export const algorithms: AlgorithmMeta[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    generator: bubbleSort,
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
    blurb:
      'Repeatedly walks the list, swapping adjacent out-of-order pairs so the largest value "bubbles" to the end each pass. Simple but slow — quadratic on most inputs.',
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    generator: insertionSort,
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
    blurb:
      'Builds the sorted list one item at a time, sliding each new value left into place. Excellent on small or nearly-sorted data — that best-case O(n) is real.',
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    generator: selectionSort,
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false },
    blurb:
      'Finds the minimum of the unsorted region and swaps it to the front, repeating. Always O(n²) comparisons, but does the fewest swaps of any of these.',
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    generator: mergeSort,
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true },
    blurb:
      'Divides the list in half, sorts each half, then merges them. Rock-solid O(n log n) every time — the cost is O(n) extra memory for the merge.',
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    generator: quickSort,
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false },
    blurb:
      'Picks a pivot, partitions values around it, then recurses. Usually the fastest in practice, but a bad pivot on already-sorted data degrades to O(n²).',
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    generator: heapSort,
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false },
    blurb:
      'Builds a max-heap, then repeatedly pulls the largest element to the end. Guaranteed O(n log n) with no extra memory — but cache-unfriendly jumps make it slower than quick sort in practice.',
  },
]

const byId = new Map(algorithms.map((a) => [a.id, a]))

export function getAlgorithm(id: string): AlgorithmMeta {
  const meta = byId.get(id)
  if (!meta) throw new Error(`Unknown algorithm: ${id}`)
  return meta
}
