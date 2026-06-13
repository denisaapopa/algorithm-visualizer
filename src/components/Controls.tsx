import { usePlayerStore } from '../store/playerStore'
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
  const {
    algorithmId,
    setAlgorithm,
    playing,
    toggle,
    stepBack,
    stepForward,
    restart,
    regenerate,
    cursor,
    frames,
    seek,
    speed,
    setSpeed,
    size,
    setSize,
    preset,
    setPreset,
  } = usePlayerStore()

  const lastFrame = frames.length - 1

  return (
    <div className="flex flex-col gap-4">
      {/* transport */}
      <div className="flex items-center gap-2">
        <IconButton label="Restart" onClick={restart}>
          ⏮
        </IconButton>
        <IconButton label="Step back" onClick={stepBack}>
          ◀
        </IconButton>
        <IconButton label={playing ? 'Pause' : 'Play'} onClick={toggle} primary>
          {playing ? '❚❚' : '▶'}
        </IconButton>
        <IconButton label="Step forward" onClick={stepForward}>
          ▶
        </IconButton>
        <IconButton label="Shuffle / new array" onClick={regenerate}>
          ⟳
        </IconButton>
        <div className="ml-auto font-mono text-xs text-slate-400">
          step {cursor} / {lastFrame}
        </div>
      </div>

      {/* scrubber */}
      <input
        type="range"
        min={0}
        max={lastFrame}
        value={cursor}
        onChange={(e) => seek(Number(e.target.value))}
        className="w-full"
      />

      {/* selectors + sliders */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Algorithm
          <select
            value={algorithmId}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-100"
          >
            {algorithms.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Distribution
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as Preset)}
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
          Size · {size}
          <input
            type="range"
            min={8}
            max={60}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Speed · {speed}/s
          <input
            type="range"
            min={1}
            max={60}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="mt-2"
          />
        </label>
      </div>
    </div>
  )
}
