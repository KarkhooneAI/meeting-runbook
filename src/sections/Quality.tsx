import { useI18n } from '../i18n'
import { useRunbook, useStore } from '../store/store'
import { Section } from '../components/Section'
import { Checklist } from '../components/Checklist'
import { uid, type Quality as Q } from '../model/types'

export function Quality() {
  const { t } = useI18n()
  const rb = useRunbook()
  const { patch } = useStore()
  const cols: { k: keyof Q; title: string; desc: string; c: string }[] = [
    { k: 'dor', title: t('q_dor'), desc: t('q_dor_d'), c: 'var(--yellow)' },
    { k: 'dod', title: t('q_dod'), desc: t('q_dod_d'), c: 'var(--green)' },
    { k: 'milestone', title: t('q_ms'), desc: t('q_ms_d'), c: 'var(--red)' },
  ]
  return (
    <Section id="quality" title={t('nav_quality')} sub={t('q_sub')}>
      <div className="qcols">
        {cols.map(c => (
          <div className="card" key={c.k} style={{ ['--c' as string]: c.c }}>
            <h3><i className="mark" />{c.title}</h3>
            <p className="small muted" style={{ marginBottom: 6 }}>{c.desc}</p>
            <Checklist items={rb.quality[c.k]} onChange={items => patch(r => ({ ...r, quality: { ...r.quality, [c.k]: items } }))} addLabel={t('q_addItem')} newItem={() => ({ id: uid(), text: '', done: false })} />
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>{t('q_flow')}</h3>
        <textarea rows={3} value={rb.qualityFlow} onChange={e => patch(r => ({ ...r, qualityFlow: e.target.value }))} placeholder={t('q_flow_ph')} />
        <div className="note g" style={{ marginTop: 10 }}>{t('q_qaqc')}</div>
      </div>
    </Section>
  )
}
