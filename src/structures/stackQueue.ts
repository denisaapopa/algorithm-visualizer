// Stack (LIFO) and queue (FIFO) share one implementation that differs only in
// which end you remove from. Each operation emits a short frame trace so the
// add/remove animates like every other structure in the app.

export type SQMode = 'stack' | 'queue'

export interface SQItem {
  id: number
  value: number
}

export interface SQFrame {
  items: SQItem[] // index 0 = bottom (stack) / front (queue)
  mode: SQMode
  highlight: number | null
  removing: number | null
  message: string
}

let nextId = 0

export class StackQueue {
  items: SQItem[] = []
  mode: SQMode

  constructor(mode: SQMode) {
    this.mode = mode
  }

  snapshot(opts: Partial<SQFrame> & { message: string }): SQFrame {
    return {
      items: this.items.map((i) => ({ ...i })),
      mode: this.mode,
      highlight: opts.highlight ?? null,
      removing: opts.removing ?? null,
      message: opts.message,
    }
  }

  addSilent(value: number) {
    this.items.push({ id: nextId++, value })
  }

  // push / enqueue — always appends to the end.
  add(value: number): SQFrame[] {
    const node = { id: nextId++, value }
    this.items.push(node)
    const where = this.mode === 'stack' ? 'top of the stack' : 'back of the queue'
    return [this.snapshot({ highlight: node.id, message: `Add ${value} to the ${where} — O(1).` })]
  }

  // pop / dequeue — stack removes the end (LIFO), queue the front (FIFO).
  remove(): SQFrame[] {
    if (this.items.length === 0) {
      return [this.snapshot({ message: `The ${this.mode} is empty — nothing to remove.` })]
    }
    const idx = this.mode === 'stack' ? this.items.length - 1 : 0
    const node = this.items[idx]
    const where = this.mode === 'stack' ? 'top of the stack (LIFO)' : 'front of the queue (FIFO)'
    const f1 = this.snapshot({ removing: node.id, highlight: node.id, message: `Take from the ${where}: ${node.value}.` })
    this.items.splice(idx, 1)
    const f2 = this.snapshot({ message: `Removed ${node.value} — O(1).` })
    return [f1, f2]
  }
}
