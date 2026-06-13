import type { EventType, Frame } from '../engine/types'

const ROLE_COLOR: Record<EventType, string> = {
  compare: '#fbbf24', // amber
  swap: '#f43f5e', // rose
  overwrite: '#22d3ee', // cyan
  pivot: '#a855f7', // violet
  select: '#38bdf8', // sky
  markSorted: '#34d399', // emerald
}

const DEFAULT = '#475569' // slate-600
const SORTED = '#34d399' // emerald-400

// Pure renderer for a single frame. Shared by the single-algorithm view and
// each column of the compare view.
export function Bars({ frame }: { frame: Frame }) {
  const max = Math.max(...frame.array, 1)
  const sortedSet = new Set(frame.sorted)
  const activeSet = new Set(frame.active)
  const wide = frame.array.length > 45

  return (
    <div className="flex h-full w-full items-end justify-center gap-[2px] px-1">
      {frame.array.map((v, i) => {
        let color = DEFAULT
        if (sortedSet.has(i)) color = SORTED
        if (activeSet.has(i)) color = ROLE_COLOR[frame.activeRole] ?? color
        return (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-[height] duration-75 ease-out"
            style={{
              height: `${(v / max) * 100}%`,
              backgroundColor: color,
              maxWidth: wide ? 22 : 40,
            }}
          />
        )
      })}
    </div>
  )
}
