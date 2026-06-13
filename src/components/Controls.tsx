import { lastFrame, usePlayerStore } from '../store/playerStore'
import { algorithms } from '../engine/algorithms'
import { PRESETS, type Preset } from '../engine/generateArray'

function IconButton({
  label,
  onClick,
  children,
  primary,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  primary?: boolean
}) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
        primary
          ? 'border-indigo-400 bg-indigo-500 text-white hover:bg-indigo-400'
          : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

export function Controls() {
  const s = usePlayerStore()
  const last = lastFrame(s)

  return (
    <div className="flex flex-col gap-4">
      {/* transport */}
      <div className="flex items-center gap-2">
        <IconButton label="Restart" onClick={s.restart}>
          ⏮
        </IconButton>
        <IconButton label="Step back" onClick={s.stepBack}>
          ◀
        </IconButton>
        <IconButton label={s.playing ? 'Pause' : 'Play'} onClick={s.toggle} primary>
          {s.playing ? '❚❚' : '▶'}
        </IconButton>
        <IconButton label="Step forward" onClick={s.stepForward}>
          ▶
        </IconButton>
        <IconButton label="Shuffle / new array" onClick={s.regenerate}>
          ⟳
        </IconButton>

        <button
          onClick={s.toggleCompare}
          title="Race two algorithms on the same input"
          className={`ml-2 flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors ${
            s.compareMode
              ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
              : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          ⚔ Compare
        </button>

        <div className="ml-auto font-mono text-xs text-slate-400">
          step {s.cursor} / {last}
        </div>
      </div>

      {/* scrubber */}
      <input
        type="range"
        min={0}
        max={last}
        value={s.cursor}
        onChange={(e) => s.seek(Number(e.target.value))}
        className="w-full"
      />

      {/* selectors + sliders */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {!s.compareMode && (
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Algorithm
            <select
              value={s.algorithmId}
              onChange={(e) => s.setAlgorithm(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-100"
            >
              {algorithms.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Distribution
          <select
            value={s.preset}
            onChange={(e) => s.setPreset(e.target.value as Preset)}
            className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-100"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Size · {s.size}
          <input
            type="range"
            min={8}
            max={60}
            value={s.size}
            onChange={(e) => s.setSize(Number(e.target.value))}
            className="mt-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Speed · {s.speed}/s
          <input
            type="range"
            min={1}
            max={60}
            value={s.speed}
            onChange={(e) => s.setSpeed(Number(e.target.value))}
            className="mt-2"
          />
        </label>
      </div>
    </div>
  )
}
