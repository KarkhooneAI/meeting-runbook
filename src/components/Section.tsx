import type { ReactNode } from 'react'

export const SECTION_COLORS: Record<string, string> = {
  overview: 'var(--yellow)', agenda: 'var(--orange)', team: 'var(--green)', backlog: 'var(--red)', metrics: 'var(--yellow)',
  quality: 'var(--green)', plan: 'var(--orange)', decisions: 'var(--red)', summary: 'var(--green)',
}
export const SECTION_IDS = Object.keys(SECTION_COLORS)
export const COLORS = ['var(--yellow)', 'var(--orange)', 'var(--green)', 'var(--red)']

export function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section className="sec" id={id} style={{ ['--c' as string]: SECTION_COLORS[id] }}>
      <div className="sec-h"><i className="mark" /><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
      {children}
    </section>
  )
}
