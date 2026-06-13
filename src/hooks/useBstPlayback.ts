import { useEffect } from 'react'
import { useBstStore } from '../store/bstStore'

// Advances the BST animation cursor while playing. Mirrors usePlaybackLoop but
// bound to the BST store.
export function useBstPlayback() {
  const playing = useBstStore((s) => s.playing)
  const speed = useBstStore((s) => s.speed)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      const s = useBstStore.getState()
      if (s.cursor >= s.frames.length - 1) {
        useBstStore.setState({ playing: false })
        return
      }
      useBstStore.setState({ cursor: s.cursor + 1 })
    }, 1000 / speed)
    return () => clearInterval(id)
  }, [playing, speed])
}
