/**
 * One structured report model → rendered as plain text (copy), Markdown, or Word.
 */
import type { Runbook, Lang } from '../model/types'
import { makeT, numFor, type TFn } from '../i18n'
import { PRIORITIES } from '../model/types'

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'table'; header: string[]; rows: string[][] }

export interface Section { title: string; blocks: Block[] }
export interface Report { title: string; subtitle: string; sections: Section[]; footer: string }

const nz = (s: string | undefined) => (s || '').trim()
const join = (parts: (string | false | undefined)[], sep = ' · ') => parts.filter(Boolean).join(sep)

export function priorityLabel(p: string, t: TFn) { return p === 'later' ? t('later') : p }
export function spaceLabel(s: string, t: TFn) {
  const map: Record<string, string> = { product: t('sp_product'), client: t('sp_client'), platform: t('sp_platform'), internal: t('sp_internal'), other: t('sp_other') }
  return map[s] ?? s
}
export function cadenceLabel(c: string, t: TFn) {
  const map: Record<string, string> = { weekly: t('cad_weekly'), biweekly: t('cad_biweekly'), monthly: t('cad_monthly'), milestone: t('cad_milestone') }
  return map[c] ?? c
}

/** summary=true → the short group-ready wrap-up; false → everything including raw notes */
export function buildReport(rb: Runbook, lang: Lang, full: boolean): Report {
  const t = makeT(lang), num = numFor(lang), m = rb.meta
  const S: Section[] = []

  // outputs
  S.push({ title: t('sm_h_outputs'), blocks: [{ kind: 'bullets', items: rb.outputs.length ? rb.outputs.map(o => `${o.done ? '✅' : '⬜️'} ${o.text}`) : [t('sm_none')] }] })

  // agenda wrap-ups (+ notes when full)
  const ag = rb.agenda.filter(a => nz(a.summary) || (full && nz(a.notes)))
  if (ag.length) {
    if (full) {
      S.push({ title: t('sm_h_sections'), blocks: ag.flatMap(a => {
        const b: Block[] = [{ kind: 'p', text: `**${a.title}** (${num(a.minutes)} ${t('min')})` }]
        if (nz(a.summary)) b.push({ kind: 'p', text: `${t('ag_summary')}: ${nz(a.summary)}` })
        if (nz(a.notes)) b.push({ kind: 'p', text: `${t('ag_notes')}: ${nz(a.notes)}` })
        return b
      }) })
    } else {
      S.push({ title: t('sm_h_sections'), blocks: [{ kind: 'bullets', items: ag.map(a => `${a.title}: ${nz(a.summary)}`) }] })
    }
  }

  // decisions
  const dec = rb.decisions.filter(d => nz(d.decision))
  S.push({ title: t('sm_h_decisions'), blocks: [{ kind: 'bullets', items: dec.length
    ? dec.map(d => join([nz(d.decision) + (nz(d.why) ? ` — ${nz(d.why)}` : ''), nz(d.person) && `${t('sm_follow')}: ${d.person}`, nz(d.review) && `${t('sm_reviewAt')}: ${d.review}`]))
    : [t('sm_none')] }] })

  // backlog
  const bk = rb.backlog.filter(r => nz(r.topic) && (full || r.priority !== 'later'))
    .sort((a, b) => PRIORITIES.indexOf(a.priority as typeof PRIORITIES[number]) - PRIORITIES.indexOf(b.priority as typeof PRIORITIES[number]))
  if (full) {
    S.push({ title: t('nav_backlog'), blocks: [bk.length ? { kind: 'table', header: [t('c_priority'), t('c_space'), t('c_topic'), t('c_outcome'), t('c_person'), t('c_due'), t('c_milestone'), t('c_status')],
      rows: bk.map(r => [priorityLabel(r.priority, t), spaceLabel(r.space, t), r.topic, r.outcome, r.person, r.due, r.milestone, r.status]) } : { kind: 'p', text: t('sm_none') }] })
  } else {
    S.push({ title: t('sm_h_backlog'), blocks: [{ kind: 'bullets', items: bk.length ? bk.slice(0, 10).map(r =>
      join([`[${priorityLabel(r.priority, t)}] ${join([spaceLabel(r.space, t), nz(r.topic)])}${nz(r.outcome) ? ` → ${nz(r.outcome)}` : ''}`, nz(r.person) && `${t('sm_follow')}: ${r.person}`, nz(r.due) && `${t('sm_due')}: ${r.due}`, nz(r.milestone), r.status])) : [t('sm_none')] }] })
  }

  // metrics
  const kp = rb.metrics.filter(r => nz(r.kr))
  S.push({ title: t('sm_h_metrics'), blocks: [full && kp.length
    ? { kind: 'table', header: [t('c_objective'), t('c_kr'), t('c_baseline'), t('c_target'), t('c_source'), t('c_measure'), t('c_cadence')], rows: kp.map(r => [r.objective, r.kr, r.baseline, r.target, r.source, r.person, cadenceLabel(r.cadence, t)]) }
    : { kind: 'bullets', items: kp.length ? kp.map(r => join([`${nz(r.objective) ? nz(r.objective) + ': ' : ''}${nz(r.kr)}`, nz(r.baseline) && `Baseline: ${r.baseline}`, nz(r.target) && `Target: ${r.target}`, nz(r.source) && `${t('sm_source')}: ${r.source}`, nz(r.person) && `${t('sm_measure')}: ${r.person}`, nz(r.cadence) && cadenceLabel(r.cadence, t)])) : [t('sm_none')] }] })

  // quality
  const qb: Block[] = [{ kind: 'bullets', items: ([['dor', t('q_dor')], ['dod', t('q_dod')], ['milestone', t('q_ms')]] as const).map(([k, label]) => {
    const items = rb.quality[k]
    return `${label}: ${t('sm_agreed', { d: num(items.filter(i => i.done).length), n: num(items.length) })}`
  }) }]
  if (full) for (const [k, label] of [['dor', t('q_dor')], ['dod', t('q_dod')], ['milestone', t('q_ms')]] as const) {
    if (rb.quality[k].length) qb.push({ kind: 'p', text: `**${label}**` }, { kind: 'bullets', items: rb.quality[k].map(i => `${i.done ? '☑' : '☐'} ${i.text}`) })
  }
  if (nz(rb.qualityFlow)) qb.push({ kind: 'p', text: `${t('sm_flow')}: ${nz(rb.qualityFlow)}` })
  S.push({ title: t('sm_h_quality'), blocks: qb })

  // plan
  const pl = rb.plan.filter(r => nz(r.action))
  const plBlocks: Block[] = [full && pl.length
    ? { kind: 'table', header: [t('c_range'), t('c_action'), t('c_companion'), t('c_due'), t('c_criteria'), t('c_status')], rows: pl.map(r => [r.range, r.action, r.person, r.due, r.criteria, r.status]) }
    : { kind: 'bullets', items: pl.length ? pl.map(r => join([`${nz(r.range) ? nz(r.range) + ' — ' : ''}${nz(r.action)}`, nz(r.person), nz(r.due) && `${t('sm_due')}: ${r.due}`, nz(r.criteria) && `${t('sm_criteria')}: ${nz(r.criteria)}`])) : [t('sm_none')] }]
  const extras = [nz(m.firstReview) && `${t('sm_review')}: ${m.firstReview}`, nz(m.syncRhythm) && `${t('sm_sync')}: ${m.syncRhythm}`, nz(m.retro) && `${t('sm_retro')}: ${m.retro}`].filter(Boolean) as string[]
  if (extras.length) plBlocks.push({ kind: 'bullets', items: extras })
  S.push({ title: t('sm_h_plan'), blocks: plBlocks })

  // team (full only)
  if (full) {
    const tm = rb.team.filter(x => nz(x.q1) || nz(x.q2) || nz(x.q3))
    if (tm.length || nz(rb.teamShared)) {
      const b: Block[] = tm.map(x => ({ kind: 'p', text: `**${x.person}** — ${join([nz(x.q1) && `${t('tm_q1')} ${nz(x.q1)}`, nz(x.q2) && `${t('tm_q2')}: ${nz(x.q2)}`, nz(x.q3) && `${t('tm_q3')}: ${nz(x.q3)}`])}` }))
      if (nz(rb.teamShared)) b.push({ kind: 'p', text: `${t('tm_shared')}: ${nz(rb.teamShared)}` })
      S.push({ title: t('sm_h_team'), blocks: b })
    }
  }

  // parking
  const pk = rb.parking.filter(r => nz(r.topic))
  if (pk.length) S.push({ title: t('sm_h_parking'), blocks: [{ kind: 'bullets', items: pk.map(r => join([`${nz(r.topic)}${nz(r.next) ? ` → ${nz(r.next)}` : ''}`, nz(r.person) && `(${r.person})`], ' ')) }] })

  if (nz(m.closingNotes)) S.push({ title: t('sm_h_notes'), blocks: [{ kind: 'p', text: nz(m.closingNotes) }] })

  const subtitle = join([m.date, nz(m.startTime) && `${t('sm_time')} ${num(m.startTime)}`, m.participants.length > 0 && `${t('sm_participants')}: ${m.participants.join(lang === 'fa' ? '، ' : ', ')}`])
  const head: Section = { title: '', blocks: [] }
  const headItems = [nz(m.focus) && `${t('sm_focus')}: ${m.focus}`, nz(m.sourceOfTruth) && `${t('sm_sot')}: ${m.sourceOfTruth}`].filter(Boolean) as string[]
  if (headItems.length) head.blocks.push({ kind: 'bullets', items: headItems })

  return { title: nz(m.title) || t('appName'), subtitle, sections: head.blocks.length ? [head, ...S] : S, footer: `${t('appName')} · ${t('by')} · Kourosh Sedigh (iamkourosh)` }
}

/* ---------- renderers ---------- */
const stripMd = (s: string) => s.replace(/\*\*/g, '')

export function renderText(r: Report): string {
  const L: string[] = [`📋 ${r.title}`, r.subtitle]
  for (const s of r.sections) {
    L.push('')
    if (s.title) L.push(`▪ ${s.title}`)
    for (const b of s.blocks) {
      if (b.kind === 'p') L.push(stripMd(b.text))
      else if (b.kind === 'bullets') L.push(...b.items.map(i => `• ${stripMd(i)}`))
      else L.push(...b.rows.map(row => `• ${row.filter(Boolean).join(' · ')}`))
    }
  }
  L.push('', `— ${r.footer}`)
  return L.join('\n')
}

export function renderMarkdown(r: Report): string {
  const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ')
  const L: string[] = [`# ${r.title}`, '', r.subtitle, '']
  for (const s of r.sections) {
    if (s.title) L.push(`## ${s.title}`, '')
    for (const b of s.blocks) {
      if (b.kind === 'p') L.push(b.text, '')
      else if (b.kind === 'bullets') L.push(...b.items.map(i => `- ${i}`), '')
      else L.push(`| ${b.header.map(esc).join(' | ')} |`, `| ${b.header.map(() => '---').join(' | ')} |`, ...b.rows.map(row => `| ${row.map(c => esc(c || '')).join(' | ')} |`), '')
    }
  }
  L.push('---', '', `_${r.footer}_`, '')
  return L.join('\n')
}
