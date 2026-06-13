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
  removing: number | null // node about to be unlinked
  sequence: number[] // accumulated traversal output
  message: string
}

export type TraversalOrder = 'in' | 'pre' | 'post' | 'level'

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
      removing: opts.removing ?? null,
      sequence: opts.sequence ?? [],
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

  traverse(order: TraversalOrder): TreeFrame[] {
    const frames: TreeFrame[] = []
    const seq: number[] = []
    const seen: number[] = []
    const label = { in: 'In-order', pre: 'Pre-order', post: 'Post-order', level: 'Level-order' }[order]

    const visit = (node: BstNode) => {
      seq.push(node.value)
      seen.push(node.id)
      frames.push(
        this.snapshot({
          highlight: [node.id],
          path: [...seen],
          sequence: [...seq],
          message: `Visit ${node.value} — output so far: ${seq.join(', ')}`,
        }),
      )
    }

    if (order === 'level') {
      const queue: BstNode[] = this.root ? [this.root] : []
      while (queue.length) {
        const n = queue.shift()!
        visit(n)
        if (n.left) queue.push(n.left)
        if (n.right) queue.push(n.right)
      }
    } else {
      const rec = (node: BstNode | null) => {
        if (!node) return
        if (order === 'pre') visit(node)
        rec(node.left)
        if (order === 'in') visit(node)
        rec(node.right)
        if (order === 'post') visit(node)
      }
      rec(this.root)
    }

    if (frames.length === 0) {
      frames.push(this.snapshot({ message: 'Tree is empty — nothing to traverse.' }))
    } else {
      frames.push(
        this.snapshot({
          path: [...seen],
          sequence: [...seq],
          message: `${label} traversal complete: ${seq.join(', ')}${order === 'in' ? '  (sorted!)' : ''}`,
        }),
      )
    }
    return frames
  }

  deleteTrace(value: number): TreeFrame[] {
    const frames: TreeFrame[] = []
    const path: number[] = []
    let parent: BstNode | null = null
    let cur = this.root

    while (cur) {
      path.push(cur.id)
      frames.push(
        this.snapshot({ highlight: [cur.id], path: [...path], message: `Compare ${value} with ${cur.value}.` }),
      )
      if (value === cur.value) break
      parent = cur
      cur = value < cur.value ? cur.left : cur.right
    }

    if (!cur) {
      frames.push(this.snapshot({ path: [...path], message: `${value} is not in the tree — nothing to delete.` }))
      return frames
    }

    frames.push(
      this.snapshot({ removing: cur.id, path: [...path], message: `Found ${value}. Now remove it without breaking the ordering.` }),
    )

    if (cur.left && cur.right) {
      // Two children: replace with in-order successor (smallest in right subtree).
      frames.push(
        this.snapshot({
          highlight: [cur.right.id],
          removing: cur.id,
          path: [...path],
          message: `Two children — find the in-order successor: the smallest value in the right subtree.`,
        }),
      )
      let succParent = cur
      let succ = cur.right
      while (succ.left) {
        succParent = succ
        succ = succ.left
        frames.push(this.snapshot({ highlight: [succ.id], removing: cur.id, message: `Go left… now at ${succ.value}.` }))
      }
      frames.push(
        this.snapshot({
          highlight: [succ.id],
          removing: cur.id,
          message: `Successor is ${succ.value} — copy it into the node being deleted, then unlink the successor.`,
        }),
      )
      cur.value = succ.value
      if (succParent.left === succ) succParent.left = succ.right
      else succParent.right = succ.right
      frames.push(this.snapshot({ highlight: [cur.id], message: `Done — ${succ.value} took the deleted node's place. Ordering preserved.` }))
    } else {
      // Zero or one child: splice the node out.
      const child = cur.left ?? cur.right
      if (!parent) this.root = child
      else if (parent.left === cur) parent.left = child
      else parent.right = child
      const kind = child ? 'one child' : 'a leaf'
      frames.push(
        this.snapshot({
          message: `${value} was ${kind} — link its parent directly to ${child ? child.value : 'null'}.`,
        }),
      )
    }
    return frames
  }
}
