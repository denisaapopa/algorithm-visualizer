import { useEffect, useRef } from 'react'
import { useGridStore, type PaintMode } from '../store/gridStore'
import { useTracePlayback } from '../hooks/useTracePlayback'
import { useKeyboardPlayback } from '../hooks/useKeyboardPlayback'
import { Explainer } from './Explainer'
import { EXPLANATIONS } from '../content/explanations'
import type { PathAlgo } from '../structures/pathfinding'

const ALGOS: { id: PathAlgo; label: string }[] = [
  { id: 'bfs', label: 'BFS' },
  { id: 'dfs', label: 'DFS' },
  { id: 'dijkstra', label: 'Dijkstra' },
  { id: 'astar', label: 'A*' },
]

const PAINT: { id: PaintMode; label: string }[] = [
  { id: 'wall', label: 'Wall' },
  { id: 'weight', label: 'Weight' },
]

function Btn({
  onClick,
  children,
  variant = 'default',
}: {
  onClick: () => void
  children: React.ReactNode
  variant?: 'default' | 'primary'
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
        variant === 'primary'
          ? 'border-indigo-400 bg-indigo-500 text-white hover:bg-indigo-400'
          : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function GridCanvas() {
  const grid = useGridStore((s) => s.grid)
  const frames = useGridStore((s) => s.frames)
  const cursor = useGridStore((s) => s.cursor)
  const paintMode = useGridStore((s) => s.paintMode)
  const paintCell = useGridStore((s) => s.paintCell)
  const frame = frames[cursor] ?? frames[0]

  const drawing = useRef(false)
  const paintOn = useRef(true)

  useEffect(() => {
    const up = () => (drawing.current = false)
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  const visited = new Set(frame.visited)
  const frontier = new Set(frame.frontier)
  const path = new Set(frame.path)
  const cells = grid.rows * grid.cols

  const color = (i: number): string => {
    if (i === grid.start) return '#10b981' // emerald
    if (i === grid.end) return '#f43f5e' // rose
    if (path.has(i)) return '#fbbf24' // amber
    if (i === frame.current) return '#f8fafc' // near-white
    if (visited.has(i)) return '#4f46e5' // indigo
    if (frontier.has(i)) return '#0ea5e9' // sky
    if (grid.walls.has(i)) return '#334155' // slate-700
    if (grid.weights.has(i)) return '#7c2d12' // orange-900 terrain
    return '#0f172a' // slate-900
  }

  return (
    <div
      className="grid w-full select-none gap-px overflow-hidden rounded-xl border border-slate-800 bg-slate-800 p-px"
      style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))` }}
      onMouseLeave={() => (drawing.current = false)}
    >
      {Array.from({ length: cells }, (_, i) => {
        const heavy = grid.weights.has(i)
        const isOn = paintMode === 'wall' ? grid.walls.has(i) : grid.weights.has(i)
        return (
          <div
            key={i}
            onMouseDown={() => {
              drawing.current = true
              paintOn.current = !isOn
              paintCell(i, paintOn.current)
            }}
            onMouseEnter={() => {
              if (drawing.current) paintCell(i, paintOn.current)
            }}
            className="aspect-square transition-colors duration-150"
            style={{
              backgroundColor: color(i),
              boxShadow: heavy ? 'inset 0 0 0 2px rgba(234,88,12,0.85)' : undefined,
            }}
          />
        )
      })}
    </div>
  )
}

export function PathfindingApp() {
  useTracePlayback(useGridStore)
  useKeyboardPlayback(useGridStore)
  const s = useGridStore()
  const frame = s.frames[s.cursor] ?? s.frames[0]
  const last = s.frames.length - 1

  return (
    <main className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pills options={ALGOS} value={s.algo} onChange={s.setAlgo} />
          <Btn onClick={s.run} variant="primary">
            ▶ Run
          </Btn>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500">Paint</span>
            <Pills options={PAINT} value={s.paintMode} onChange={s.setPaintMode} />
            <Btn onClick={s.randomMaze}>⟳ Maze</Btn>
            <Btn onClick={s.clearGrid}>Clear</Btn>
          </div>
        </div>

        <GridCanvas />

        <div className="rounded-lg border border-indigo-900/60 bg-indigo-950/40 px-3 py-2 text-sm text-indigo-200">
          {frame.message}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Btn onClick={() => s.seek(0)}>⏮</Btn>
          <Btn onClick={s.stepBack}>◀</Btn>
          <Btn onClick={s.toggle} variant="primary">
            {s.playing ? '❚❚' : '▶'}
          </Btn>
          <Btn onClick={s.stepForward}>▶</Btn>
          <div className="font-mono text-xs text-slate-400">
            explored {frame.stats.visited} · path {frame.stats.pathLength} · cost {frame.stats.pathCost}
          </div>
          <div className="ml-auto font-mono text-xs text-slate-400">
            step {s.cursor} / {last}
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={last}
          value={s.cursor}
          onChange={(e) => s.seek(Number(e.target.value))}
          className="w-full"
        />
        <label className="flex w-48 flex-col gap-1 text-xs text-slate-400">
          Speed · {s.speed}/s
          <input
            type="range"
            min={2}
            max={60}
            value={s.speed}
            onChange={(e) => s.setSpeed(Number(e.target.value))}
            className="mt-1"
          />
        </label>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <Legend color="#10b981" label="Start" />
          <Legend color="#f43f5e" label="Goal" />
          <Legend color="#334155" label="Wall" />
          <Legend color="#7c2d12" label="Weight (cost 8)" />
          <Legend color="#0ea5e9" label="Frontier" />
          <Legend color="#4f46e5" label="Visited" />
          <Legend color="#fbbf24" label="Path" />
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Paint a band of <span className="text-orange-400">weighted terrain</span> across the grid,
          then run <span className="font-mono text-slate-300">BFS</span> and{' '}
          <span className="font-mono text-slate-300">Dijkstra</span> in turn: BFS charges straight
          through (fewest cells), while Dijkstra detours around it for a lower total cost.
        </p>
      </section>

      <aside className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <Explainer data={EXPLANATIONS[s.algo]} />
      </aside>
    </main>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
