import { useEffect } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'

interface TraceStore {
  playing: boolean
  speed: number
  cursor: number
  frames: unknown[]
}

// Advances a trace store's cursor while playing. Works for any store exposing
// { playing, speed, cursor, frames } — shared by the BST and hash-table views.
export function useTracePlayback<T extends TraceStore>(store: UseBoundStore<StoreApi<T>>) {
  const playing = store((s) => s.playing)
  const speed = store((s) => s.speed)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      const s = store.getState()
      if (s.cursor >= s.frames.length - 1) {
        store.setState({ playing: false } as Partial<T>)
        return
      }
      store.setState({ cursor: s.cursor + 1 } as Partial<T>)
    }, 1000 / speed)
    return () => clearInterval(id)
  }, [playing, speed, store])
}
