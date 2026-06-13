// A singly linked list that emits a frame trace per operation. The teaching
// point is the contrast with arrays: O(1) work at the head, but you must walk
// the chain (O(n)) to reach anything by position or value.

export interface ListNodeView {
  id: number
  value: number
}

export interface ListFrame {
  nodes: ListNodeView[] // in list order
  head: number | null
  highlight: number[]
  found: number | null
  inserted: number | null
  removing: number | null
  message: string
}

let nextId = 0

export class LinkedList {
  nodes: { id: number; value: number }[] = []

  snapshot(opts: Partial<ListFrame> & { message: string }): ListFrame {
    return {
      nodes: this.nodes.map((n) => ({ ...n })),
      head: this.nodes.length ? this.nodes[0].id : null,
      highlight: opts.highlight ?? [],
      found: opts.found ?? null,
      inserted: opts.inserted ?? null,
      removing: opts.removing ?? null,
      message: opts.message,
    }
  }

  insertSilent(value: number) {
    this.nodes.push({ id: nextId++, value })
  }

  insertHead(value: number): ListFrame[] {
    const node = { id: nextId++, value }
    this.nodes.unshift(node)
    return [
      this.snapshot({
        inserted: node.id,
        highlight: [node.id],
        message: `Point the new node's next at the old head, then move head to it — O(1).`,
      }),
    ]
  }

  insertTail(value: number): ListFrame[] {
    const frames: ListFrame[] = []
    if (this.nodes.length === 0) {
      const node = { id: nextId++, value }
      this.nodes.push(node)
      frames.push(
        this.snapshot({ inserted: node.id, highlight: [node.id], message: `List was empty — ${value} becomes the head.` }),
      )
      return frames
    }
    for (const n of this.nodes) {
      frames.push(this.snapshot({ highlight: [n.id], message: `Walk toward the tail… now at ${n.value}.` }))
    }
    const node = { id: nextId++, value }
    this.nodes.push(node)
    frames.push(
      this.snapshot({
        inserted: node.id,
        highlight: [node.id],
        message: `Reached the tail — link its next to the new node ${value}. Walking the list is O(n).`,
      }),
    )
    return frames
  }

  search(value: number): ListFrame[] {
    const frames: ListFrame[] = []
    if (this.nodes.length === 0) {
      frames.push(this.snapshot({ message: `List is empty — ${value} is not here.` }))
      return frames
    }
    for (const n of this.nodes) {
      frames.push(this.snapshot({ highlight: [n.id], message: `Compare ${value} with ${n.value}.` }))
      if (n.value === value) {
        frames.push(this.snapshot({ highlight: [n.id], found: n.id, message: `Found ${value} ✓` }))
        return frames
      }
    }
    frames.push(this.snapshot({ message: `Reached the end — ${value} is not in the list.` }))
    return frames
  }

  remove(value: number): ListFrame[] {
    const frames: ListFrame[] = []
    if (this.nodes.length === 0) {
      frames.push(this.snapshot({ message: `List is empty — nothing to delete.` }))
      return frames
    }
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i]
      frames.push(this.snapshot({ highlight: [n.id], message: `Compare ${value} with ${n.value}.` }))
      if (n.value === value) {
        frames.push(
          this.snapshot({
            highlight: [n.id],
            removing: n.id,
            message: `Found ${value} — point the previous node's next past it to unlink it.`,
          }),
        )
        this.nodes.splice(i, 1)
        frames.push(this.snapshot({ message: `${value} removed. Finding it was O(n); unlinking is O(1).` }))
        return frames
      }
    }
    frames.push(this.snapshot({ message: `${value} not found — nothing removed.` }))
    return frames
  }
}
