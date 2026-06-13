import { useSqStore } from '../store/sqStore'
import { useTracePlayback } from '../hooks/useTracePlayback'
import { useKeyboardPlayback } from '../hooks/useKeyboardPlayback'
import { Explainer } from './Explainer'
import { EXPLANATIONS } from '../content/explanations'
import type { SQFrame, SQMode } from '../structures/stackQueue'

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

function box(id: number, value: number, frame: SQFrame) {
  let cls = 'border-slate-700 bg-slate-800 text-slate-200'
  if (id === frame.highlight && id !== frame.removing) cls = 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
  if (id === frame.removing) cls = 'border-rose-400 bg-rose-500/20 text-rose-200'
  return (
    <div key={id} className={`flex h-11 min-w-16 items-center justify-center rounded-md border px-3 font-mono text-sm transition-colors ${cls}`}>
      {value}
    </div>
  )
}

function Visual({ frame }: { frame: SQFrame }) {
  if (frame.items.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-600">empty</div>
  }
  if (frame.mode === 'stack') {
    return (
      <div className="flex h-full flex-col items-center justify-end gap-1.5">
        <span className="text-xs font-medium text-slate-500">↑ top (push / pop here)</span>
        {[...frame.items].reverse().map((it) => box(it.id, it.value, frame))}
        <span className="text-xs text-slate-600">bottom</span>
      </div>
    )
  }
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <span className="text-xs font-medium text-slate-500">front →</span>
      {frame.items.map((it) => box(it.id, it.value, frame))}
      <span className="text-xs font-medium text-slate-500">← back</span>
    </div>
  )
}

const MODES: { id: SQMode; label: string }[] = [
  { id: 'stack', label: 'Stack' },
  { id: 'queue', label: 'Queue' },
]

export function StackQueueView() {
  useTracePlayback(useSqStore)
  useKeyboardPlayback(useSqStore)
  const s = useSqStore()
  const frame = s.frames[s.cursor] ?? s.frames[0]
  const last = s.frames.length - 1
  const isStack = s.mode === 'stack'

  return (
    <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => s.setMode(m.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  s.mode === m.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <input
            value={s.input}
            onChange={(e) => s.setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && s.add()}
            placeholder="value"
            inputMode="numeric"
            className="h-10 w-24 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <Btn onClick={s.add} variant="primary">
            {isStack ? 'Push' : 'Enqueue'}
          </Btn>
          <Btn onClick={s.remove}>{isStack ? 'Pop' : 'Dequeue'}</Btn>
          <div className="ml-auto flex gap-2">
            <Btn onClick={s.randomize}>⟳ Random</Btn>
            <Btn onClick={s.reset}>Clear</Btn>
          </div>
        </div>

        <div className="h-[300px] rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:h-[360px]">
          <Visual frame={frame} />
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

      <aside className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <Explainer data={isStack ? EXPLANATIONS.stack : EXPLANATIONS.queue} />
      </aside>
    </div>
  )
}
