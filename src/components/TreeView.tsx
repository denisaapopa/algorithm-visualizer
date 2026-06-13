import type { TreeFrame } from '../structures/bst'

const SLOT = 56 // px per in-order column
const LEVEL = 72 // px per depth row
const R = 18

export function TreeView({ frame }: { frame: TreeFrame }) {
  if (frame.nodes.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-slate-600">
        Empty tree — insert a value to begin.
      </div>
    )
  }

  const maxX = Math.max(...frame.nodes.map((n) => n.x))
  const maxY = Math.max(...frame.nodes.map((n) => n.y))
  const w = (maxX + 1) * SLOT
  const h = (maxY + 1) * LEVEL
  const pos = new Map(frame.nodes.map((n) => [n.id, { cx: n.x * SLOT + SLOT / 2, cy: n.y * LEVEL + LEVEL / 2 }]))
  const hi = new Set(frame.highlight)
  const path = new Set(frame.path)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      {frame.edges.map((e, i) => {
        const a = pos.get(e.from)!
        const b = pos.get(e.to)!
        const onPath = path.has(e.from) && path.has(e.to)
        return (
          <line
            key={i}
            x1={a.cx}
            y1={a.cy}
            x2={b.cx}
            y2={b.cy}
            stroke={onPath ? '#6366f1' : '#334155'}
            strokeWidth={onPath ? 3 : 2}
          />
        )
      })}
      {frame.nodes.map((n) => {
        const p = pos.get(n.id)!
        let fill = '#1e293b'
        let stroke = '#475569'
        if (path.has(n.id)) stroke = '#6366f1'
        if (n.id === frame.inserted || n.id === frame.found) {
          fill = '#064e3b'
          stroke = '#34d399'
        }
        if (hi.has(n.id) && n.id !== frame.inserted && n.id !== frame.found) {
          fill = '#78350f'
          stroke = '#fbbf24'
        }
        if (n.id === frame.removing) {
          fill = '#4c0519'
          stroke = '#fb7185'
        }
        return (
          <g key={n.id}>
            <circle cx={p.cx} cy={p.cy} r={R} fill={fill} stroke={stroke} strokeWidth={2.5} />
            <text
              x={p.cx}
              y={p.cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="13"
              fontFamily="ui-monospace, monospace"
              fill="#e2e8f0"
            >
              {n.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
