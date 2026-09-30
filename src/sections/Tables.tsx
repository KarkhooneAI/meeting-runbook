import { useI18n } from '../i18n'
import { useRunbook, useStore } from '../store/store'
import { Section } from '../components/Section'
import { EditableTable, type Col } from '../components/EditableTable'
import { BACKLOG_STATUS, PLAN_STATUS, PRIORITIES } from '../model/types'

const opts = (vals: readonly string[], label?: (v: string) => string) => vals.map(v => ({ v, l: label ? label(v) : v }))

function usePeople() {
  const { t } = useI18n()
  const rb = useRunbook()
  return [{ v: '', l: t('none') }, ...rb.meta.participants.map(p => ({ v: p, l: p })), { v: t('team'), l: t('team') }, { v: t('all'), l: t('all') }]
}

export function Backlog() {
  const { t, num } = useI18n()
  const rb = useRunbook()
  const people = usePeople()
  const cols: Col[] = [
    { k: 'space', label: t('c_space'), type: 'select', width: '12%', options: [{ v: 'product', l: t('sp_product') }, { v: 'client', l: t('sp_client') }, { v: 'platform', l: t('sp_platform') }, { v: 'internal', l: t('sp_internal') }, { v: 'other', l: t('sp_other') }] },
    { k: 'topic', label: t('c_topic'), width: '18%' },
    { k: 'outcome', label: t('c_outcome'), width: '20%' },
    { k: 'priority', label: t('c_priority'), type: 'select', width: '8%', options: opts(PRIORITIES, v => (v === 'later' ? t('later') : v)) },
    { k: 'person', label: t('c_person'), type: 'select', width: '10%', options: people },
    { k: 'due', label: t('c_due'), width: '10%' },
    { k: 'milestone', label: t('c_milestone'), width: '11%' },
    { k: 'status', label: t('c_status'), type: 'select', width: '11%', options: opts(BACKLOG_STATUS) },
  ]
  const p0 = rb.backlog.filter(r => r.priority === 'P0').length
  const ready = rb.backlog.filter(r => r.status === 'Ready').length
  return (
    <Section id="backlog" title={t('nav_backlog')} sub={t('bk_sub')}>
      <div className="card">
        <EditableTable table="backlog" cols={cols} addLabel={t('bk_add')} blank={{ space: 'product', topic: '', outcome: '', priority: 'P1', person: '', due: '', milestone: '', status: 'Backlog' }}
          rowClass={r => (r.status === 'Done' ? 's-done' : r.status === 'Blocked' ? 's-blocked' : (r.priority || '').toLowerCase())}
          footer={<><span className={'chip' + (p0 > 3 ? ' warn' : '')}>{t('bk_stats', { n: num(rb.backlog.length), p0: num(p0), ready: num(ready) })}</span><span className="small muted">{t('bk_p0hint')}</span></>} />
      </div>
    </Section>
  )
}

export function Metrics() {
  const { t } = useI18n()
  const people = usePeople()
  const cols: Col[] = [
    { k: 'objective', label: t('c_objective'), width: '20%' },
    { k: 'kr', label: t('c_kr'), width: '20%' },
    { k: 'baseline', label: t('c_baseline'), width: '10%' },
    { k: 'target', label: t('c_target'), width: '10%' },
    { k: 'source', label: t('c_source'), width: '14%' },
    { k: 'person', label: t('c_measure'), type: 'select', width: '12%', options: people },
    { k: 'cadence', label: t('c_cadence'), type: 'select', width: '12%', options: [{ v: '', l: t('none') }, { v: 'weekly', l: t('cad_weekly') }, { v: 'biweekly', l: t('cad_biweekly') }, { v: 'monthly', l: t('cad_monthly') }, { v: 'milestone', l: t('cad_milestone') }] },
  ]
  return (
    <Section id="metrics" title={t('nav_metrics')} sub={t('mt_sub')}>
      <div className="card"><EditableTable table="metrics" cols={cols} addLabel={t('mt_add')} blank={{ objective: '', kr: '', baseline: '', target: '', source: '', person: '', cadence: '' }} /></div>
      <div className="grid g3" style={{ marginTop: 12 }}>
        <div className="note">{t('mt_r1')}</div><div className="note">{t('mt_r2')}</div><div className="note">{t('mt_r3')}</div>
      </div>
    </Section>
  )
}

export function Plan() {
  const { t } = useI18n()
  const rb = useRunbook()
  const { setMeta } = useStore()
  const people = usePeople()
  const cols: Col[] = [
    { k: 'range', label: t('c_range'), width: '11%' },
    { k: 'action', label: t('c_action'), width: '30%' },
    { k: 'person', label: t('c_companion'), type: 'select', width: '12%', options: people },
    { k: 'due', label: t('c_due'), width: '11%' },
    { k: 'criteria', label: t('c_criteria'), width: '24%' },
    { k: 'status', label: t('c_status'), type: 'select', width: '10%', options: opts(PLAN_STATUS) },
  ]
  return (
    <Section id="plan" title={t('nav_plan')} sub={t('pl_sub')}>
      <div className="card"><EditableTable table="plan" cols={cols} addLabel={t('pl_add')} blank={{ range: '', action: '', person: '', due: '', criteria: '', status: 'Not started' }}
        rowClass={r => (r.status === 'Done' ? 's-done' : r.status === 'Blocked' ? 's-blocked' : '')} /></div>
      <div className="kv" style={{ marginTop: 12 }}>
        <div className="field card"><label>{t('f_firstReview')}</label><input type="text" value={rb.meta.firstReview} onChange={e => setMeta('firstReview', e.target.value)} placeholder={t('f_dayTime')} /></div>
        <div className="field card"><label>{t('f_retro')}</label><input type="text" value={rb.meta.retro} onChange={e => setMeta('retro', e.target.value)} placeholder={t('f_dayTime')} /></div>
        <div className="field card"><label>{t('f_sync')}</label><input type="text" value={rb.meta.syncRhythm} onChange={e => setMeta('syncRhythm', e.target.value)} placeholder={t('f_sync_ph')} /></div>
      </div>
    </Section>
  )
}

export function Decisions() {
  const { t } = useI18n()
  const people = usePeople()
  const dcols: Col[] = [
    { k: 'decision', label: t('c_decision'), width: '34%' },
    { k: 'why', label: t('c_why'), width: '32%' },
    { k: 'person', label: t('c_companion'), type: 'select', width: '14%', options: people },
    { k: 'review', label: t('c_review'), width: '16%' },
  ]
  const pcols: Col[] = [
    { k: 'topic', label: t('c_topic'), width: '42%' },
    { k: 'next', label: t('c_next'), width: '36%' },
    { k: 'person', label: t('c_person'), type: 'select', width: '18%', options: people },
  ]
  return (
    <Section id="decisions" title={t('nav_decisions')} sub={t('dc_sub')}>
      <div className="card"><h3>{t('dc_log')}</h3><EditableTable table="decisions" cols={dcols} addLabel={t('dc_add')} blank={{ decision: '', why: '', person: '', review: '' }} /></div>
      <div className="card"><h3>{t('pk_title')}</h3><p className="small muted">{t('pk_sub')}</p><EditableTable table="parking" cols={pcols} addLabel={t('pk_add')} blank={{ topic: '', next: '', person: '' }} /></div>
    </Section>
  )
}
