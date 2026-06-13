// A binary search tree that, like the sorting engine, produces a trace of
// frames for each operation. Insert/search walk the tree and snapshot the
// structure + the node under inspection at every step, so the UI gets
// play/pause/step/scrub for free — and the O(log n) path is made visible.

export interface BstNode {
  id: number
  value: number
  left: BstNode | null
  right: BstNode | null
}

export interface TreeNodeView {
  id: number
  value: number
  x: number // in-order slot (column)
  y: number // depth (row)
}

export interface TreeEdge {
  from: number
  to: number
}

export interface TreeFrame {
  nodes: TreeNodeView[]
  edges: TreeEdge[]
  highlight: number[] // node currently being compared
  path: number[] // nodes visited so far
  inserted: number | null
  found: number | null
  message: string
}

let nextId = 0

export class BST {
  root: BstNode | null = null

  // In-order x (column), depth y (row). In-order x guarantees left-of/right-of
  // ordering reads correctly left to right.
  private layout(): { nodes: TreeNodeView[]; edges: TreeEdge[] } {
    const nodes: TreeNodeView[] = []
    const edges: TreeEdge[] = []
    let order = 0
    const rec = (node: BstNode | null, depth: number) => {
      if (!node) return
      rec(node.left, depth + 1)
      nodes.push({ id: node.id, value: node.value, x: order++, y: depth })
      if (node.left) edges.push({ from: node.id, to: node.left.id })
      if (node.right) edges.push({ from: node.id, to: node.right.id })
      rec(node.right, depth + 1)
    }
    rec(this.root, 0)
    return { nodes, edges }
  }

  snapshot(opts: Partial<TreeFrame> & { message: string }): TreeFrame {
    const { nodes, edges } = this.layout()
    return {
      nodes,
      edges,
      highlight: opts.highlight ?? [],
      path: opts.path ?? [],
      inserted: opts.inserted ?? null,
      found: opts.found ?? null,
      message: opts.message,
    }
  }

  // Insert without producing a trace — used to seed a starting tree.
  insertSilent(value: number) {
    if (!this.root) {
      this.root = { id: nextId++, value, left: null, right: null }
      return
    }
    let cur = this.root
    for (;;) {
      if (value < cur.value) {
        if (!cur.left) {
          cur.left = { id: nextId++, value, left: null, right: null }
          return
        }
        cur = cur.left
      } else if (value > cur.value) {
        if (!cur.right) {
          cur.right = { id: nextId++, value, left: null, right: null }
          return
        }
        cur = cur.right
      } else {
        return // duplicate
      }
    }
  }

  insertTrace(value: number): TreeFrame[] {
    const frames: TreeFrame[] = []
    const path: number[] = []
    if (!this.root) {
      this.root = { id: nextId++, value, left: null, right: null }
      frames.push(
        this.snapshot({
          highlight: [this.root.id],
          inserted: this.root.id,
          message: `Tree is empty — ${value} becomes the root.`,
        }),
      )
      return frames
    }
    let cur: BstNode = this.root
    for (;;) {
      path.push(cur.id)
      frames.push(
        this.snapshot({ highlight: [cur.id], path: [...path], message: `Compare ${value} with ${cur.value}.` }),
      )
      if (value === cur.value) {
        frames.push(
          this.snapshot({
            highlight: [cur.id],
            path: [...path],
            found: cur.id,
            message: `${value} is already in the tree — nothing to insert.`,
          }),
        )
        return frames
      }
      if (value < cur.value) {
        if (!cur.left) {
          const node: BstNode = { id: nextId++, value, left: null, right: null }
          cur.left = node
          frames.push(
            this.snapshot({
              highlight: [node.id],
              path: [...path, node.id],
              inserted: node.id,
              message: `${value} < ${cur.value} and the left slot is empty → insert here.`,
            }),
          )
          return frames
        }
        frames.push(
          this.snapshot({ highlight: [cur.id], path: [...path], message: `${value} < ${cur.value} → go left.` }),
        )
        cur = cur.left
      } else {
        if (!cur.right) {
          const node: BstNode = { id: nextId++, value, left: null, right: null }
          cur.right = node
          frames.push(
            this.snapshot({
              highlight: [node.id],
              path: [...path, node.id],
              inserted: node.id,
              message: `${value} > ${cur.value} and the right slot is empty → insert here.`,
            }),
          )
          return frames
        }
        frames.push(
          this.snapshot({ highlight: [cur.id], path: [...path], message: `${value} > ${cur.value} → go right.` }),
        )
        cur = cur.right
      }
    }
  }

  searchTrace(value: number): TreeFrame[] {
    const frames: TreeFrame[] = []
    const path: number[] = []
    if (!this.root) {
      frames.push(this.snapshot({ message: `Tree is empty — ${value} is not here.` }))
      return frames
    }
    let cur: BstNode | null = this.root
    while (cur) {
      path.push(cur.id)
      frames.push(
        this.snapshot({ highlight: [cur.id], path: [...path], message: `Compare ${value} with ${cur.value}.` }),
      )
      if (value === cur.value) {
        frames.push(
          this.snapshot({ highlight: [cur.id], path: [...path], found: cur.id, message: `Found ${value} ✓` }),
        )
        return frames
      }
      if (value < cur.value) {
        frames.push(
          this.snapshot({ highlight: [cur.id], path: [...path], message: `${value} < ${cur.value} → go left.` }),
        )
        cur = cur.left
      } else {
        frames.push(
          this.snapshot({ highlight: [cur.id], path: [...path], message: `${value} > ${cur.value} → go right.` }),
        )
        cur = cur.right
      }
    }
    frames.push(
      this.snapshot({ path: [...path], message: `Reached an empty slot — ${value} is not in the tree.` }),
    )
    return frames
  }
}
