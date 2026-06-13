import { usePlayerStore } from '../store/playerStore'
import { getAlgorithm } from '../engine/algorithms'

// Renders the current algorithm's pseudocode and highlights the line that the
// active frame is executing — kept in sync with the bar animation via
// `frame.line`, which the engine tags onto every event.
export function PseudocodePanel() {
  const algorithmId = usePlayerStore((s) => s.algorithmId)
  const frames = usePlayerStore((s) => s.frames)
  const cursor = usePlayerStore((s) => s.cursor)
  const meta = getAlgorithm(algorithmId)
  const active = (frames[cursor] ?? frames[0]).line

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <div className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">Pseudocode</div>
      <pre className="overflow-x-auto font-mono text-[13px] leading-6">
        {meta.pseudocode.map((row, i) => {
          const isActive = i === active
          return (
            <div
              key={i}
              className={`flex gap-3 rounded px-2 transition-colors ${
                isActive ? 'bg-indigo-500/20 text-indigo-100' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-4 select-none text-right ${
                  isActive ? 'text-indigo-300' : 'text-slate-600'
                }`}
              >
                {isActive ? '▸' : i + 1}
              </span>
              <span className="whitespace-pre">{row}</span>
            </div>
          )
        })}
      </pre>
    </div>
  )
}
