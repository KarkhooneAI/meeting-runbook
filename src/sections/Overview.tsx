import { useI18n } from '../i18n'
import { useRunbook, useStore } from '../store/store'
import { Section, SECTION_COLORS, SECTION_IDS } from '../components/Section'
import { Checklist } from '../components/Checklist'
import { uid } from '../model/types'

export function Overview() {
  const { t, num } = useI18n()
  const rb = useRunbook()
  const { setMeta, patch } = useStore()
  const m = rb.meta
  const doneOutputs = rb.outputs.filter(o => o.done).length
  const doneAgenda = rb.agenda.filter(a => a.done).length
  const decisions = rb.decisions.filter(d => d.decision.trim()).length

  return (
    <Section id="overview" title={t('nav_overview')}>
      <div className="hero">
        <div className="card">
          <h2>{t('ov_info')}</h2>
          <div className="kv">
            <div className="field wide"><label htmlFor="m_title">{t('f_title')}</label><input id="m_title" type="text" value={m.title} onChange={e => setMeta('title', e.target.value)} /></div>
            <div className="field"><label htmlFor="m_date">{t('f_date')}</label><input id="m_date" type="text" value={m.date} onChange={e => setMeta('date', e.target.value)} /></div>
            <div className="field"><label htmlFor="m_time">{t('f_time')}</label><input id="m_time" type="time" value={m.startTime} onChange={e => setMeta('startTime', e.target.value)} /></div>
            <div className="field"><label htmlFor="m_dur">{t('f_duration')}</label><input id="m_dur" type="number" min={15} step={5} value={m.durationMin} onChange={e => setMeta('durationMin', +e.target.value)} /></div>
            <div className="field"><label htmlFor="m_buf">{t('f_buffer')}</label><input id="m_buf" type="number" min={0} step={5} value={m.bufferMin} onChange={e => setMeta('bufferMin', +e.target.value)} /></div>
            <div className="field wide"><label htmlFor="m_part">{t('f_participants')}</label>
              <input id="m_part" type="text" value={m.participants.join(', ')} onChange={e => setMeta('participants', e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean))}
                onBlur={() => patch(r => ({ ...r, team: r.meta.participants.map(p => r.team.find(x => x.person === p) ?? { person: p, q1: '', q2: '', q3: '' }) }))} />
            </div>
            <div className="field wide"><label htmlFor="m_focus">{t('f_focus')}</label><input id="m_focus" type="text" value={m.focus} onChange={e => setMeta('focus', e.target.value)} placeholder={t('f_focus_ph')} /></div>
            <div className="field wide"><label htmlFor="m_sot">{t('f_sot')}</label><input id="m_sot" type="text" value={m.sourceOfTruth} onChange={e => setMeta('sourceOfTruth', e.target.value)} placeholder={t('f_sot_ph')} /></div>
          </div>
          <div className="stats">
            <div className="stat"><b>{num(m.durationMin)}</b><span>{t('ov_planned')}</span></div>
            <div className="stat"><b>+{num(m.bufferMin)}</b><span>{t('ov_buffer')}</span></div>
            <div className="stat"><b>{num(doneAgenda)}/{num(rb.agenda.length)}</b><span>{t('ov_done')}</span></div>
            <div className="stat"><b>{num(decisions)}</b><span>{t('ov_decisions')}</span></div>
          </div>
        </div>
        <div className="card">
          <h2>{t('ov_outputs')}</h2>
          <Checklist plain items={rb.outputs} onChange={outputs => patch(r => ({ ...r, outputs }))} addLabel={t('ov_addOutput')} newItem={() => ({ id: uid(), text: '', done: false })} />
          <div className="progress" aria-hidden="true"><i style={{ width: `${rb.outputs.length ? (doneOutputs / rb.outputs.length) * 100 : 0}%` }} /></div>
          <div className="quick">
            {SECTION_IDS.slice(1).map(id => <a key={id} className="chip" href={`#${id}`} style={{ ['--c' as string]: SECTION_COLORS[id] }}><i className="dot" />{t(`nav_${id}` as 'nav_overview')}</a>)}
          </div>
        </div>
      </div>
      <div className="note o" style={{ marginTop: 12 }}>{t('ov_rule')}</div>
    </Section>
  )
}
