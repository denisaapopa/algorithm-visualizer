import { useListStore } from '../store/listStore'
import { useTracePlayback } from '../hooks/useTracePlayback'
import { useKeyboardPlayback } from '../hooks/useKeyboardPlayback'
import { Explainer } from './Explainer'
import { EXPLANATIONS } from '../content/explanations'
import type { ListFrame } from '../structures/linkedList'

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

function Chain({ frame }: { frame: ListFrame }) {
  if (frame.nodes.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-slate-600">
        Empty list — head → null
      </div>
    )
  }
  return (
    <div className="flex h-full w-full flex-wrap content-center items-center gap-1">
      <span className="mr-1 font-mono text-xs text-emerald-400">head</span>
      <span className="text-slate-600">→</span>
      {frame.nodes.map((n) => {
        let cls = 'border-slate-700 bg-slate-800 text-slate-200'
        if (frame.highlight.includes(n.id)) cls = 'border-amber-400 bg-amber-500/20 text-amber-200'
        if (n.id === frame.found || n.id === frame.inserted)
          cls = 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
        if (n.id === frame.removing) cls = 'border-rose-400 bg-rose-500/20 text-rose-200 line-through'
        return (
          <div key={n.id} className="flex items-center gap-1">
            <div className={`flex h-11 min-w-11 items-center justify-center rounded-md border px-2 font-mono text-sm transition-colors ${cls}`}>
              {n.value}
            </div>
            <span className="text-slate-600">→</span>
          </div>
        )
      })}
      <span className="font-mono text-xs text-slate-600">null</span>
    </div>
  )
}

export function LinkedListView() {
  useTracePlayback(useListStore)
  useKeyboardPlayback(useListStore)
  const s = useListStore()
  const frame = s.frames[s.cursor] ?? s.frames[0]
  const last = s.frames.length - 1

  return (
    <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={s.input}
            onChange={(e) => s.setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && s.insertTail()}
            placeholder="value"
            inputMode="numeric"
            className="h-10 w-24 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <Btn onClick={s.insertHead} variant="primary">
            Insert head
          </Btn>
          <Btn onClick={s.insertTail}>Insert tail</Btn>
          <Btn onClick={s.search}>Search</Btn>
          <Btn onClick={s.remove}>Delete</Btn>
          <div className="ml-auto flex gap-2">
            <Btn onClick={s.randomize}>⟳ Random</Btn>
            <Btn onClick={s.reset}>Clear</Btn>
          </div>
        </div>

        <div className="h-[200px] rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:h-[240px]">
          <Chain frame={frame} />
        </div>

        <div className="rounded-lg border border-indigo-900/60 bg-indigo-950/40 px-3 py-2 text-sm text-indigo-200">
          {frame.message}
        </div>

        <div className="flex items-center gap-2">
          <Btn onClick={() => s.seek(0)}>⏮</Btn>
          <Btn onClick={s.stepBack}>◀</Btn>
          <Btn onClick={s.toggle} variant="primary">
            {s.playing ? '❚❚' : '▶'}
          </Btn>
          <Btn onClick={s.stepForward}>▶</Btn>
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
            min={1}
            max={20}
            value={s.speed}
            onChange={(e) => s.setSpeed(Number(e.target.value))}
            className="mt-1"
          />
        </label>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <Legend color="#fbbf24" label="Visiting" />
          <Legend color="#34d399" label="Found / inserted" />
          <Legend color="#f43f5e" label="Removing" />
        </div>
      </section>

      <aside className="flex flex-col gap-5 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <Explainer data={EXPLANATIONS.linkedlist} />

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
          <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Complexity</div>
          <Row label="Insert head" value="O(1)" />
          <Row label="Insert tail / search" value="O(n)" />
          <Row label="Delete (by value)" value="O(n)" />
          <Row label="Space" value="O(n)" />
        </div>
      </aside>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-1.5 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-200">{value}</span>
    </div>
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
