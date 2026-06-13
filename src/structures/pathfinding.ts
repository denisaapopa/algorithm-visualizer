// Grid pathfinding that emits a frame trace per run — same step-trace idea as
// the rest of the app. BFS, DFS, Dijkstra and A* are unified as a best-first
// search that differs only in which frontier cell it expands next.

export const HEAVY = 8 // cost to enter a weighted cell (normal cells cost 1)

export interface Grid {
  rows: number
  cols: number
  walls: Set<number>
  weights: Set<number> // costly terrain — passable but expensive
  start: number
  end: number
}

export interface GridFrame {
  visited: number[]
  frontier: number[]
  current: number | null
  path: number[]
  message: string
  stats: { visited: number; pathLength: number; pathCost: number }
}

export type PathAlgo = 'bfs' | 'dfs' | 'dijkstra' | 'astar'

const rc = (i: number, cols: number) => ({ r: Math.floor(i / cols), c: i % cols })

function neighbors(g: Grid, i: number): number[] {
  const { r, c } = rc(i, g.cols)
  const out: number[] = []
  if (r > 0) out.push(i - g.cols)
  if (c < g.cols - 1) out.push(i + 1)
  if (r < g.rows - 1) out.push(i + g.cols)
  if (c > 0) out.push(i - 1)
  return out
}

function manhattan(a: number, b: number, cols: number): number {
  const pa = rc(a, cols)
  const pb = rc(b, cols)
  return Math.abs(pa.r - pb.r) + Math.abs(pa.c - pb.c)
}

function reconstruct(cameFrom: Map<number, number>, start: number, end: number): number[] {
  const path = [end]
  let cur = end
  while (cur !== start && cameFrom.has(cur)) {
    cur = cameFrom.get(cur)!
    path.push(cur)
  }
  return path.reverse()
}

const LABEL: Record<PathAlgo, string> = {
  bfs: 'BFS',
  dfs: 'DFS',
  dijkstra: 'Dijkstra',
  astar: 'A*',
}

export function runPathfinding(g: Grid, algo: PathAlgo): GridFrame[] {
  const frames: GridFrame[] = []
  const visited = new Set<number>()
  const cameFrom = new Map<number, number>()
  const gScore = new Map<number, number>([[g.start, 0]])
  const open: number[] = [g.start]
  const openSet = new Set<number>([g.start])

  const cost = (i: number) => (g.weights.has(i) ? HEAVY : 1)

  const snap = (current: number | null, message: string, path: number[] = []) => {
    const pathCost = path.reduce((acc, idx, k) => (k === 0 ? 0 : acc + cost(idx)), 0)
    frames.push({
      visited: [...visited],
      frontier: [...openSet],
      current,
      path,
      message,
      stats: { visited: visited.size, pathLength: path.length ? path.length - 1 : 0, pathCost },
    })
  }

  const take = (): number => {
    if (algo === 'bfs') return open.shift()!
    if (algo === 'dfs') return open.pop()!
    // dijkstra / astar: lowest score
    let bestI = 0
    let best = Infinity
    for (let i = 0; i < open.length; i++) {
      const n = open[i]
      const score = algo === 'astar' ? gScore.get(n)! + manhattan(n, g.end, g.cols) : gScore.get(n)!
      if (score < best) {
        best = score
        bestI = i
      }
    }
    return open.splice(bestI, 1)[0]
  }

  snap(g.start, `${LABEL[algo]}: start exploring from the source.`)

  let reached = false
  while (open.length) {
    const cur = take()
    openSet.delete(cur)
    if (visited.has(cur)) continue
    visited.add(cur)

    if (cur === g.end) {
      reached = true
      break
    }
    snap(cur, `Expand a cell and look at its neighbours (${visited.size} explored).`)

    for (const nb of neighbors(g, cur)) {
      if (g.walls.has(nb) || visited.has(nb)) continue
      const tentative = gScore.get(cur)! + cost(nb)
      if (!gScore.has(nb) || tentative < gScore.get(nb)!) {
        gScore.set(nb, tentative)
        cameFrom.set(nb, cur)
      }
      if (!openSet.has(nb)) {
        open.push(nb)
        openSet.add(nb)
      }
    }
  }

  if (reached) {
    const path = reconstruct(cameFrom, g.start, g.end)
    const total = path.reduce((acc, idx, k) => (k === 0 ? 0 : acc + (g.weights.has(idx) ? HEAVY : 1)), 0)
    snap(
      g.end,
      `Goal reached — ${path.length} cells, total cost ${total}, ${visited.size} cells explored.`,
      path,
    )
  } else {
    snap(null, `No path exists — explored ${visited.size} cells and the goal is unreachable.`)
  }

  return frames
}
