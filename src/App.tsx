import { useState } from 'react'
import { SortingApp } from './components/SortingApp'
import { DataStructuresApp } from './components/DataStructuresApp'
import { PathfindingApp } from './components/PathfindingApp'

type Tab = 'sorting' | 'structures' | 'pathfinding'

const TABS: { id: Tab; label: string; intro: string }[] = [
  {
    id: 'sorting',
    label: 'Sorting',
    intro: 'Watch six sorting algorithms run step by step. Race two at once, follow the pseudocode, and see the comparison and swap counts that explain why some are faster.',
  },
  {
    id: 'structures',
    label: 'Data Structures',
    intro: 'Insert, search and delete in real time across trees, hash tables, linked lists, stacks and queues — and see why each one makes different operations fast or slow.',
  },
  {
    id: 'pathfinding',
    label: 'Pathfinding',
    intro: 'Draw walls and weighted terrain, then watch BFS, DFS, Dijkstra and A* search the grid — and see how a good heuristic explores far fewer cells.',
  },
]

const REPO = 'https://github.com/denisaapopa/algorithm-visualizer'

export default function App() {
  const [tab, setTab] = useState<Tab>('sorting')
  const active = TABS.find((t) => t.id === tab)!

  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Algo<span className="text-indigo-400">Viz</span>
            </h1>
            <span className="hidden text-sm text-slate-500 sm:inline">
              Algorithms &amp; data structures, made visible
            </span>
          </div>
          <nav className="flex flex-wrap gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-400">{active.intro}</p>
      </header>

      {tab === 'sorting' && <SortingApp />}
      {tab === 'structures' && <DataStructuresApp />}
      {tab === 'pathfinding' && <PathfindingApp />}

      <footer className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4 text-xs text-slate-500">
        <span>
          Shortcuts: <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">Space</kbd> play/pause ·{' '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">←</kbd>{' '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">→</kbd> step
        </span>
        <a href={REPO} target="_blank" rel="noreferrer" className="text-slate-400 transition-colors hover:text-indigo-300">
          Source on GitHub ↗
        </a>
      </footer>
    </div>
  )
}
