import { useBstStore } from '../store/bstStore'
import { useTracePlayback } from '../hooks/useTracePlayback'
import { TreeView } from './TreeView'
import { Explainer } from './Explainer'
import { EXPLANATIONS } from '../content/explanations'

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

export function BstView() {
  useTracePlayback(useBstStore)
  const s = useBstStore()
  const frame = s.frames[s.cursor] ?? s.frames[0]
  const last = s.frames.length - 1

  return (
    <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={s.input}
            onChange={(e) => s.setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && s.insert()}
            placeholder="value"
            inputMode="numeric"
            className="h-10 w-24 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <Btn onClick={s.insert} variant="primary">
            Insert
          </Btn>
          <Btn onClick={s.search}>Search</Btn>
          <div className="ml-auto flex gap-2">
            <Btn onClick={s.randomize}>⟳ Random</Btn>
            <Btn onClick={s.reset}>Clear</Btn>
          </div>
        </div>

        <div className="h-[340px] rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:h-[440px]">
          <TreeView frame={frame} />
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
      </section>

      <aside className="flex flex-col gap-5 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <Explainer data={EXPLANATIONS.bst} />

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
          <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Complexity</div>
          <Row label="Search" value="O(log n) avg · O(n) worst" />
          <Row label="Insert" value="O(log n) avg · O(n) worst" />
          <Row label="Space" value="O(n)" />
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Try the worst case: insert <span className="font-mono text-slate-300">1, 2, 3, 4, 5</span> in
          order and watch the tree degenerate into a linked list — every search becomes O(n).
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <Legend color="#fbbf24" label="Comparing" />
          <Legend color="#6366f1" label="Path" />
          <Legend color="#34d399" label="Found / inserted" />
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
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
