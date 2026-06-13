import { usePlayerStore } from '../store/playerStore'
import { getAlgorithm } from '../engine/algorithms'
import { Explainer } from './Explainer'
import { EXPLANATIONS } from '../content/explanations'

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="font-mono text-lg font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  )
}

function ComplexityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-1.5 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-200">{value}</span>
    </div>
  )
}

export function InfoPanel() {
  const algorithmId = usePlayerStore((s) => s.algorithmId)
  const frames = usePlayerStore((s) => s.frames)
  const cursor = usePlayerStore((s) => s.cursor)
  const meta = getAlgorithm(algorithmId)
  const frame = frames[cursor] ?? frames[0]
  const { comparisons, swaps, accesses } = frame.stats
  const c = meta.complexity

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-slate-100">{meta.name}</h2>

      {/* live narration */}
      <div className="rounded-lg border border-indigo-900/60 bg-indigo-950/40 px-3 py-2 text-sm text-indigo-200">
        {frame.message}
      </div>

      {/* live counters */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Compares" value={comparisons} color="#fbbf24" />
        <Stat label="Swaps" value={swaps} color="#f43f5e" />
        <Stat label="Accesses" value={accesses} color="#22d3ee" />
      </div>

      {/* complexity table */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
        <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Complexity</div>
        <ComplexityRow label="Best" value={c.best} />
        <ComplexityRow label="Average" value={c.average} />
        <ComplexityRow label="Worst" value={c.worst} />
        <ComplexityRow label="Space" value={c.space} />
        <ComplexityRow label="Stable" value={c.stable ? 'Yes' : 'No'} />
      </div>

      {/* legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        <Legend color="#475569" label="Unsorted" />
        <Legend color="#fbbf24" label="Comparing" />
        <Legend color="#f43f5e" label="Swapping" />
        <Legend color="#a855f7" label="Pivot" />
        <Legend color="#34d399" label="Sorted" />
      </div>

      {/* full explanation */}
      {EXPLANATIONS[algorithmId] && (
        <div className="border-t border-slate-800 pt-4">
          <Explainer data={EXPLANATIONS[algorithmId]} />
        </div>
      )}
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
