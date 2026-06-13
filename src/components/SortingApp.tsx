import { BarVisualizer } from './BarVisualizer'
import { CompareView } from './CompareView'
import { Controls } from './Controls'
import { InfoPanel } from './InfoPanel'
import { PseudocodePanel } from './PseudocodePanel'
import { usePlaybackLoop } from '../hooks/usePlaybackLoop'
import { useKeyboardPlayback } from '../hooks/useKeyboardPlayback'
import { usePlayerStore } from '../store/playerStore'

export function SortingApp() {
  usePlaybackLoop()
  useKeyboardPlayback(usePlayerStore)
  const compareMode = usePlayerStore((s) => s.compareMode)

  if (compareMode) {
    return (
      <main className="flex flex-1 flex-col gap-5">
        <CompareView />
        <Controls />
      </main>
    )
  }

  return (
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
  )
}
