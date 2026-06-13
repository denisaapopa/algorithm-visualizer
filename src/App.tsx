import { useState } from 'react'
import { SortingApp } from './components/SortingApp'
import { DataStructuresApp } from './components/DataStructuresApp'

type Tab = 'sorting' | 'structures'

const TABS: { id: Tab; label: string }[] = [
  { id: 'sorting', label: 'Sorting' },
  { id: 'structures', label: 'Data Structures' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('sorting')

  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          Algo<span className="text-indigo-400">Viz</span>
        </h1>
        <nav className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
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
      </header>

      {tab === 'sorting' ? <SortingApp /> : <DataStructuresApp />}
    </div>
  )
}
