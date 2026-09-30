import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { useRunbook, useStore } from '../store/store'
import { Section, COLORS } from '../components/Section'
import { uid, type AgendaItem } from '../model/types'

const mmss = (s: number) => { s = Math.round(s || 0); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` }

export function Agenda() {
  const { t, num } = useI18n()
  const rb = useRunbook()
  const { patch } = useStore()
  const [running, setRunning] = useState<string | null>(null)
  const [openAll, setOpenAll] = useState<boolean | null>(null)
  const last = useRef(0)

  // timer: accumulate seconds into the running item
  useEffect(() => {
    if (!running) return
    last.current = Date.now()
    const id = window.setInterval(() => {
      const now = Date.now(); const delta = (now - last.current) / 1000; last.current = now
      patch(r => ({ ...r, agenda: r.agenda.map(a => (a.id === running ? { ...a, spentSec: a.spentSec + delta } : a)) }))
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, patch])
  useEffect(() => { setRunning(null) }, [rb.id])

  const upd = (id: string, p: Partial<AgendaItem>) => patch(r => ({ ...r, agenda: r.agenda.map(a => (a.id === id ? { ...a, ...p } : a)) }))
  const remove = (id: string) => { if (window.confirm(t('confirmRow'))) patch(r => ({ ...r, agenda: r.agenda.filter(a => a.id !== id) })) }
  const add = () => patch(r => ({ ...r, agenda: [...r.agenda, { id: uid(), title: '', minutes: 10, topics: [], notes: '', summary: '', done: false, spentSec: 0 }] }))

  const total = rb.agenda.reduce((a, b) => a + (b.minutes || 0), 0)
  const spent = rb.agenda.reduce((a, b) => a + (b.spentSec || 0), 0)
  const done = rb.agenda.filter(a => a.done).length

  return (
    <Section id="agenda" title={t('nav_agenda')} sub={t('ag_sub')}>
      <div className="total-bar">
        <span className="chip">{t('ag_total')}: <b className="en">{num(total)}</b> {t('min')}</span>
        <span className="chip">{t('ag_spent')}: <b className="en">{num(Math.round(spent / 60))}</b> {t('min')}</span>
        <span className="chip ok">{num(done)} / {num(rb.agenda.length)} {t('ag_doneOf')}</span>
        <button className="btn sm ghost" onClick={() => setOpenAll(true)}>{t('openAll')}</button>
        <button className="btn sm ghost" onClick={() => setOpenAll(false)}>{t('closeAll')}</button>
      </div>
      {rb.agenda.map((a, i) => (
        <AgendaBlock key={a.id} a={a} index={i} running={running === a.id} over={a.spentSec > a.minutes * 60} forceOpen={openAll}
          onStart={() => setRunning(a.id)} onStop={() => setRunning(null)} onReset={() => { if (running === a.id) setRunning(null); upd(a.id, { spentSec: 0 }) }}
          onChange={p => upd(a.id, p)} onRemove={() => remove(a.id)} />
      ))}
      <button className="btn sm" onClick={add}>{t('ag_add')}</button>
    </Section>
  )
}

interface BlockProps { a: AgendaItem; index: number; running: boolean; over: boolean; forceOpen: boolean | null; onStart: () => void; onStop: () => void; onReset: () => void; onChange: (p: Partial<AgendaItem>) => void; onRemove: () => void }

function AgendaBlock({ a, index, running, over, forceOpen, onStart, onStop, onReset, onChange, onRemove }: BlockProps) {
  const { t, num } = useI18n()
  const ref = useRef<HTMLDetailsElement>(null)
  useEffect(() => { if (forceOpen !== null && ref.current) ref.current.open = forceOpen }, [forceOpen])
  const [topicsText, setTopicsText] = useState(a.topics.join('\n'))
  useEffect(() => { setTopicsText(a.topics.join('\n')) }, [a.id]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <details ref={ref} className={'ag' + (a.done ? ' done' : '')} id={`ag-${a.id}`} style={{ ['--c' as string]: COLORS[index % 4] }}>
      <summary>
        <span className="num">{num(index + 1)}</span>
        <span className="ttl">{a.title || '—'}</span>
        <span className="meta"><span className="chip">{num(a.minutes)} {t('min')}</span>{a.done && <span className="chip ok">✓</span>}{running && <span className="timer run">{mmss(a.spentSec)}</span>}</span>
        <svg className="chev" width="14" height="14" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      </summary>
      <div className="ag-body">
        <div className="topics">
          <div className="field">
            <label>{t('ag_title')}</label>
            <input type="text" value={a.title} onChange={e => onChange({ title: e.target.value })} />
            <div className="kv" style={{ marginTop: 8 }}>
              <div className="field"><label>{t('ag_minutes')}</label><input type="number" min={1} step={5} value={a.minutes} onChange={e => onChange({ minutes: +e.target.value || 0 })} /></div>
            </div>
            {a.hint && <p className="small muted" style={{ marginTop: 6 }}>↳ {a.hint}</p>}
          </div>
          <div className="field">
            <label>{t('ag_topics')}</label>
            <textarea rows={4} value={topicsText} onChange={e => { setTopicsText(e.target.value); onChange({ topics: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }) }} />
          </div>
        </div>
        <div className="field"><label htmlFor={`n-${a.id}`}>{t('ag_notes')}</label><textarea id={`n-${a.id}`} rows={4} value={a.notes} onChange={e => onChange({ notes: e.target.value })} /></div>
        <div className="field"><label htmlFor={`s-${a.id}`}>{t('ag_summary')}</label><textarea id={`s-${a.id}`} rows={4} value={a.summary} onChange={e => onChange({ summary: e.target.value })} /></div>
        <div className="ag-foot">
          <span className={'timer' + (running ? ' run' : '') + (over ? ' over' : '')}>{mmss(a.spentSec)}</span>
          {running ? <button className="btn sm" onClick={onStop}>⏸ {t('tStop')}</button> : <button className="btn sm" onClick={onStart}>▶ {t('tStart')}</button>}
          <button className="btn sm ghost" onClick={onReset}>↺ {t('tReset')}</button>
          <span className="spacer" />
          <label className="check" style={{ padding: 0 }}><input type="checkbox" checked={a.done} onChange={e => onChange({ done: e.target.checked })} /><span className="t">{t('ag_done')}</span></label>
          <button className="btn sm ghost danger" onClick={onRemove} title={t('ag_delete')}>✕</button>
        </div>
      </div>
    </details>
  )
}
