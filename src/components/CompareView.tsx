import { usePlayerStore } from '../store/playerStore'
import { algorithms, getAlgorithm } from '../engine/algorithms'
import type { Frame } from '../engine/types'
import { Bars } from './Bars'

function AlgoSelect({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm font-medium text-slate-100"
    >
      {algorithms.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </select>
  )
}

function RaceColumn({ which }: { which: 'A' | 'B' }) {
  const cursor = usePlayerStore((s) => s.cursor)
  const frames = usePlayerStore((s) => (which === 'A' ? s.frames : s.framesB))
  const otherFrames = usePlayerStore((s) => (which === 'A' ? s.framesB : s.frames))
  const algoId = usePlayerStore((s) => (which === 'A' ? s.algorithmId : s.algorithmIdB))
  const setAlgo = usePlayerStore((s) => (which === 'A' ? s.setAlgorithm : s.setAlgorithmB))

  const lastOwn = frames.length - 1
  const clamped = Math.min(cursor, lastOwn)
  const frame: Frame = frames[clamped] ?? frames[0]
  const done = cursor >= lastOwn
  // Fewer total steps wins the race; ties broken to neither.
  const isWinner = frames.length < otherFrames.length
  const meta = getAlgorithm(algoId)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <AlgoSelect value={algoId} onChange={setAlgo} />
        {done && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              isWinner ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/60 text-slate-300'
            }`}
          >
            {isWinner ? '🏆 fewest steps' : '✓ done'}
          </span>
        )}
      </div>

      <div className="h-[260px] rounded-xl border border-slate-800 bg-slate-900/40 p-2 sm:h-[320px]">
        <Bars frame={frame} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Metric label="Compares" value={frame.stats.comparisons} color="#fbbf24" />
        <Metric label="Swaps" value={frame.stats.swaps} color="#f43f5e" />
        <Metric label="Steps" value={`${clamped}/${lastOwn}`} color="#a5b4fc" />
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {meta.complexity.average} avg · {meta.complexity.worst} worst · {meta.complexity.space} space
      </p>
    </div>
  )
}

function Metric({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="font-mono text-sm font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  )
}

export function CompareView() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <RaceColumn which="A" />
      <RaceColumn which="B" />
    </div>
  )
}
