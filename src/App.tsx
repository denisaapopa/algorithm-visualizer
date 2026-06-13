import { BarVisualizer } from './components/BarVisualizer'
import { CompareView } from './components/CompareView'
import { Controls } from './components/Controls'
import { InfoPanel } from './components/InfoPanel'
import { PseudocodePanel } from './components/PseudocodePanel'
import { usePlaybackLoop } from './hooks/usePlaybackLoop'
import { usePlayerStore } from './store/playerStore'

export default function App() {
  usePlaybackLoop()
  const compareMode = usePlayerStore((s) => s.compareMode)

  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          Algo<span className="text-indigo-400">Viz</span>
        </h1>
        <p className="text-xs text-slate-500">Sorting algorithms, made visible</p>
      </header>

      {compareMode ? (
        <main className="flex flex-1 flex-col gap-5">
          <CompareView />
          <Controls />
        </main>
      ) : (
        <main className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <section className="flex flex-col gap-4">
            <div className="h-[320px] rounded-xl border border-slate-800 bg-slate-900/40 p-3 sm:h-[420px]">
              <BarVisualizer />
            </div>
            <Controls />
            <PseudocodePanel />
          </section>

          <aside className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <InfoPanel />
          </aside>
        </main>
      )}
    </div>
  )
}
