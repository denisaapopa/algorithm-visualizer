import { useState } from 'react'
import { BstView } from './BstView'
import { HashTableView } from './HashTableView'
import { LinkedListView } from './LinkedListView'
import { StackQueueView } from './StackQueueView'

type Structure = 'bst' | 'hash' | 'list' | 'sq'

const STRUCTURES: { id: Structure; label: string }[] = [
  { id: 'bst', label: 'Binary Search Tree' },
  { id: 'hash', label: 'Hash Table' },
  { id: 'list', label: 'Linked List' },
  { id: 'sq', label: 'Stack & Queue' },
]

export function DataStructuresApp() {
  const [structure, setStructure] = useState<Structure>('bst')

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap gap-1 self-start rounded-lg border border-slate-800 bg-slate-900/60 p-1">
        {STRUCTURES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStructure(s.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              structure === s.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {structure === 'bst' && <BstView />}
      {structure === 'hash' && <HashTableView />}
      {structure === 'list' && <LinkedListView />}
      {structure === 'sq' && <StackQueueView />}
    </main>
  )
}
