import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useI18n } from '../i18n'
import { Logo } from './Logo'
import { TEMPLATE_IDS, type TemplateId } from '../model/templates'
import type { NewRunbookInput } from '../store/store'

function todayFor(lang: 'fa' | 'en'): string {
  try {
    if (lang === 'fa') {
      const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).formatToParts(new Date())
      const g = (type: string) => parts.find(p => p.type === type)?.value ?? ''
      return `${g('weekday')} ${g('day')} ${g('month')} ${g('year')}`
    }
    return new Intl.DateTimeFormat('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())
  } catch { return new Date().toISOString().slice(0, 10) }
}

export function Setup({ onCreate, onCancel }: { onCreate: (i: NewRunbookInput) => void; onCancel?: () => void }) {
  const { t, lang, setLang } = useI18n()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => todayFor(lang))
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(90)
  const [buffer, setBuffer] = useState(15)
  const [people, setPeople] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [template, setTemplate] = useState<TemplateId>('alignment')
  const [focus, setFocus] = useState('')
  const [tried, setTried] = useState(false)

  const addPerson = (raw: string) => {
    const names = raw.split(/[,،\n]/).map(s => s.trim()).filter(Boolean)
    if (!names.length) return
    setPeople(p => [...p, ...names.filter(n => !p.includes(n))])
    setDraft('')
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === '،') { e.preventDefault(); addPerson(draft) }
    if (e.key === 'Backspace' && !draft && people.length) setPeople(p => p.slice(0, -1))
  }
  const valid = title.trim() && date.trim() && (people.length > 0 || draft.trim())
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    const all = [...people, ...draft.split(/[,،\n]/).map(s => s.trim()).filter(Boolean)]
    if (!title.trim() || !date.trim() || !all.length) return
    onCreate({ title: title.trim(), date: date.trim(), startTime: time, durationMin: duration || 60, bufferMin: buffer || 0, participants: all, template, focus: focus.trim(), lang })
  }

  return (
    <div className="setup">
      <form className="card" onSubmit={submit}>
        <div className="brand"><Logo /><div><b>{t('appName')}</b><span>{t('by')} · {t('tagline')}</span></div>
          <button type="button" className="btn sm ghost" style={{ marginInlineStart: 'auto' }} onClick={() => { const l = lang === 'fa' ? 'en' : 'fa'; setLang(l); setDate(todayFor(l)) }}>{t('lang')}</button>
        </div>
        <h1>{t('setupTitle')}</h1>
        <p className="muted small" style={{ marginBottom: 16 }}>{t('setupSub')}</p>

        <div className="kv">
          <div className="field wide">
            <label htmlFor="s_title">{t('f_title')} <span className="muted">({t('required')})</span></label>
            <input id="s_title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('f_title_ph')} autoFocus />
            {tried && !title.trim() && <span className="err">{t('required')}</span>}
          </div>
          <div className="field"><label htmlFor="s_date">{t('f_date')}</label><input id="s_date" type="text" value={date} onChange={e => setDate(e.target.value)} /><span className="muted small">{t('jalaliHint')}</span></div>
          <div className="field"><label htmlFor="s_time">{t('f_time')}</label><input id="s_time" type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
          <div className="field"><label htmlFor="s_dur">{t('f_duration')}</label><input id="s_dur" type="number" min={15} step={5} value={duration} onChange={e => setDuration(+e.target.value)} /></div>
          <div className="field"><label htmlFor="s_buf">{t('f_buffer')}</label><input id="s_buf" type="number" min={0} step={5} value={buffer} onChange={e => setBuffer(+e.target.value)} /></div>
          <div className="field wide">
            <label htmlFor="s_people">{t('f_participants')} <span className="muted">({t('minOne')})</span></label>
            {people.length > 0 && <div className="chips" style={{ marginBottom: 6 }}>{people.map(p => <span className="chip" key={p}>{p}<button type="button" aria-label={t('delete')} onClick={() => setPeople(x => x.filter(y => y !== p))}>✕</button></span>)}</div>}
            <input id="s_people" type="text" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={onKey} placeholder={t('f_participants_ph')} />
            {tried && !people.length && !draft.trim() && <span className="err">{t('minOne')}</span>}
          </div>
          <div className="field wide">
            <label>{t('f_template')}</label>
            <div className="tpl">
              {TEMPLATE_IDS.map(id => (
                <label key={id} className={template === id ? 'on' : ''}>
                  <input type="radio" name="tpl" value={id} checked={template === id} onChange={() => setTemplate(id)} />
                  <b>{t(`tpl_${id}` as 'tpl_alignment')}</b><span>{t(`tpl_${id}_d` as 'tpl_alignment_d')}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="field wide"><label htmlFor="s_focus">{t('f_focus')}</label><input id="s_focus" type="text" value={focus} onChange={e => setFocus(e.target.value)} placeholder={t('f_focus_ph')} /></div>
        </div>
        <div className="toolbar" style={{ marginTop: 18, justifyContent: 'flex-end' }}>
          {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>✕</button>}
          <button type="submit" className="btn primary" disabled={!valid}>{t('start')}</button>
        </div>
      </form>
    </div>
  )
}
