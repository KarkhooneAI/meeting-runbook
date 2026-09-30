import { useI18n } from '../i18n'
import { useRunbook, useStore } from '../store/store'
import { Section, COLORS } from '../components/Section'

export function Team() {
  const { t } = useI18n()
  const rb = useRunbook()
  const { patch } = useStore()
  const Q = [['q1', t('tm_q1')], ['q2', t('tm_q2')], ['q3', t('tm_q3')]] as const
  const set = (person: string, k: 'q1' | 'q2' | 'q3', v: string) => patch(r => ({ ...r, team: r.team.map(x => (x.person === person ? { ...x, [k]: v } : x)) }))
  return (
    <Section id="team" title={t('nav_team')} sub={t('tm_sub')}>
      <div className="grid g3">
        {rb.team.map((p, i) => (
          <div className="card" key={p.person} style={{ borderTop: `3px solid ${COLORS[i % 4]}` }}>
            <h3>{p.person}</h3>
            {Q.map(([k, label]) => (
              <div className="field" style={{ marginTop: 8 }} key={k}><label>{label}</label><textarea rows={2} value={p[k]} onChange={e => set(p.person, k, e.target.value)} /></div>
            ))}
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>{t('tm_shared')}</h3>
        <p className="small muted">{t('tm_shared_h')}</p>
        <textarea rows={3} value={rb.teamShared} onChange={e => patch(r => ({ ...r, teamShared: e.target.value }))} />
      </div>
    </Section>
  )
}
