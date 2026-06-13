import { usePlayerStore } from '../store/playerStore'
import { Bars } from './Bars'

export function BarVisualizer() {
  const frames = usePlayerStore((s) => s.frames)
  const cursor = usePlayerStore((s) => s.cursor)
  return <Bars frame={frames[cursor] ?? frames[0]} />
}
