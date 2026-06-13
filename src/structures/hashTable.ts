// A hash table with separate chaining that emits a frame trace per operation,
// same as the other structures. The point is to make collisions visible: hash
// to a bucket, then walk the chain — O(1) average, O(n) when everything
// collides into one bucket.

export interface HashEntry {
  id: number
  value: number
}

export interface HashBucketView {
  index: number
  entries: HashEntry[]
}

export interface HashFrame {
  buckets: HashBucketView[]
  capacity: number
  size: number
  loadFactor: number
  highlightBucket: number | null
  highlightEntry: number | null
  found: number | null
  inserted: number | null
  message: string
}

let nextId = 0

export class HashTable {
  capacity: number
  buckets: HashEntry[][]
  size = 0

  constructor(capacity = 8) {
    this.capacity = capacity
    this.buckets = Array.from({ length: capacity }, () => [])
  }

  private hash(v: number): number {
    return ((v % this.capacity) + this.capacity) % this.capacity
  }

  snapshot(opts: Partial<HashFrame> & { message: string }): HashFrame {
    return {
      buckets: this.buckets.map((b, i) => ({ index: i, entries: b.map((e) => ({ ...e })) })),
      capacity: this.capacity,
      size: this.size,
      loadFactor: this.size / this.capacity,
      highlightBucket: opts.highlightBucket ?? null,
      highlightEntry: opts.highlightEntry ?? null,
      found: opts.found ?? null,
      inserted: opts.inserted ?? null,
      message: opts.message,
    }
  }

  insertSilent(v: number) {
    const bucket = this.buckets[this.hash(v)]
    if (bucket.some((e) => e.value === v)) return
    bucket.push({ id: nextId++, value: v })
    this.size++
  }

  insertTrace(v: number): HashFrame[] {
    const frames: HashFrame[] = []
    const idx = this.hash(v)
    frames.push(
      this.snapshot({ highlightBucket: idx, message: `hash(${v}) = ${v} % ${this.capacity} = ${idx}` }),
    )
    const bucket = this.buckets[idx]
    for (const e of bucket) {
      frames.push(
        this.snapshot({
          highlightBucket: idx,
          highlightEntry: e.id,
          message: `Bucket ${idx}: compare ${v} with ${e.value}.`,
        }),
      )
      if (e.value === v) {
        frames.push(
          this.snapshot({
            highlightBucket: idx,
            highlightEntry: e.id,
            found: e.id,
            message: `${v} is already in bucket ${idx} — nothing to insert.`,
          }),
        )
        return frames
      }
    }
    const node = { id: nextId++, value: v }
    const collision = bucket.length > 0
    bucket.push(node)
    this.size++
    frames.push(
      this.snapshot({
        highlightBucket: idx,
        highlightEntry: node.id,
        inserted: node.id,
        message: collision
          ? `Collision in bucket ${idx} → append ${v} to the chain.`
          : `Bucket ${idx} was empty → store ${v} there.`,
      }),
    )
    return frames
  }

  searchTrace(v: number): HashFrame[] {
    const frames: HashFrame[] = []
    const idx = this.hash(v)
    frames.push(
      this.snapshot({ highlightBucket: idx, message: `hash(${v}) = ${v} % ${this.capacity} = ${idx}` }),
    )
    const bucket = this.buckets[idx]
    if (bucket.length === 0) {
      frames.push(this.snapshot({ highlightBucket: idx, message: `Bucket ${idx} is empty — ${v} not found.` }))
      return frames
    }
    for (const e of bucket) {
      frames.push(
        this.snapshot({
          highlightBucket: idx,
          highlightEntry: e.id,
          message: `Bucket ${idx}: compare ${v} with ${e.value}.`,
        }),
      )
      if (e.value === v) {
        frames.push(
          this.snapshot({
            highlightBucket: idx,
            highlightEntry: e.id,
            found: e.id,
            message: `Found ${v} ✓ in bucket ${idx}.`,
          }),
        )
        return frames
      }
    }
    frames.push(
      this.snapshot({ highlightBucket: idx, message: `Walked the whole chain — ${v} is not in bucket ${idx}.` }),
    )
    return frames
  }
}
