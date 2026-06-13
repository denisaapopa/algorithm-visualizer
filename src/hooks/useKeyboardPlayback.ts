import { useEffect } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'

interface Transport {
  toggle: () => void
  stepForward: () => void
  stepBack: () => void
}

// Global keyboard transport: space = play/pause, ← / → = step. Ignored while
// typing in a field. Reads actions from the store at event time so the effect
// subscribes once per store.
export function useKeyboardPlayback<T extends Transport>(store: UseBoundStore<StoreApi<T>>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const s = store.getState()
      if (e.key === ' ') {
        e.preventDefault()
        s.toggle()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        s.stepForward()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        s.stepBack()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [store])
}
