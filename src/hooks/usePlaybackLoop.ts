import { useEffect } from 'react'
import { lastFrame, usePlayerStore } from '../store/playerStore'

// Advances the cursor while playing. Lives outside the store so the timer is
// tied to component lifecycle and cleaned up properly (incl. React StrictMode).
export function usePlaybackLoop() {
  const playing = usePlayerStore((s) => s.playing)
  const speed = usePlayerStore((s) => s.speed)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      const s = usePlayerStore.getState()
      if (s.cursor >= lastFrame(s)) {
        usePlayerStore.setState({ playing: false })
        return
      }
      usePlayerStore.setState({ cursor: s.cursor + 1 })
    }, 1000 / speed)
    return () => clearInterval(id)
  }, [playing, speed])
}
