import type { Explanation } from '../content/explanations'

function Section({
  label,
  items,
  marker,
  markerColor,
}: {
  label: string
  items: string[]
  marker: string
  markerColor: string
}) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <ul className="flex flex-col gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-300">
            <span className="select-none" style={{ color: markerColor }}>
              {marker}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Renders the teaching content for one structure/algorithm. Used in every
// data-structure and pathfinding sidebar.
export function Explainer({ data }: { data: Explanation }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">{data.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{data.summary}</p>
      </div>

      <Section label="How it works" items={data.how} marker="›" markerColor="#818cf8" />
      <Section label="Use it when" items={data.useWhen} marker="•" markerColor="#64748b" />
      <Section label="Strengths" items={data.strengths} marker="+" markerColor="#34d399" />
      <Section label="Trade-offs" items={data.weaknesses} marker="−" markerColor="#fb7185" />
      <Section label="In the real world" items={data.realWorld} marker="→" markerColor="#64748b" />
    </div>
  )
}
