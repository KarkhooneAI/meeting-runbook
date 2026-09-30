import type { Runbook, Lang } from '../model/types'
import { makeT, numFor } from '../i18n'
import { buildXlsx, type Sheet } from './xlsx'
import { buildReport, renderMarkdown, renderText, priorityLabel, spaceLabel, cadenceLabel } from './report'
import { reportToDocx } from './exportDocx'
import { downloadBlob, downloadText, safeFilename } from './download'

const base = (rb: Runbook) => safeFilename(rb.meta.title)

export function exportJson(rb: Runbook) {
  downloadText(JSON.stringify(rb, null, 2), `${base(rb)}.runbook.json`, 'application/json')
}

export function exportExcel(rb: Runbook, lang: Lang) {
  const t = makeT(lang), rtl = lang === 'fa'
  const sheets: Sheet[] = [
    { name: t('nav_backlog'), rtl, header: [t('c_priority'), t('c_space'), t('c_topic'), t('c_outcome'), t('c_person'), t('c_due'), t('c_milestone'), t('c_status')],
      rows: rb.backlog.map(r => [priorityLabel(r.priority, t), spaceLabel(r.space, t), r.topic, r.outcome, r.person, r.due, r.milestone, r.status]) },
    { name: t('nav_plan'), rtl, header: [t('c_range'), t('c_action'), t('c_companion'), t('c_due'), t('c_criteria'), t('c_status')],
      rows: rb.plan.map(r => [r.range, r.action, r.person, r.due, r.criteria, r.status]) },
    { name: t('dc_log'), rtl, header: [t('c_decision'), t('c_why'), t('c_companion'), t('c_review')],
      rows: rb.decisions.map(r => [r.decision, r.why, r.person, r.review]) },
    { name: t('pk_title'), rtl, header: [t('c_topic'), t('c_next'), t('c_person')], rows: rb.parking.map(r => [r.topic, r.next, r.person]) },
    { name: t('nav_metrics'), rtl, header: [t('c_objective'), t('c_kr'), t('c_baseline'), t('c_target'), t('c_source'), t('c_measure'), t('c_cadence')],
      rows: rb.metrics.map(r => [r.objective, r.kr, r.baseline, r.target, r.source, r.person, cadenceLabel(r.cadence, t)]) },
    { name: t('nav_agenda'), rtl, header: [t('ag_title'), t('ag_minutes'), t('ag_summary'), t('ag_notes'), t('c_status')],
      rows: rb.agenda.map(a => [a.title, numFor(lang)(a.minutes), a.summary, a.notes, a.done ? '✓' : '']) },
  ]
  downloadBlob(buildXlsx(sheets), `${base(rb)}.xlsx`)
}

export function summaryText(rb: Runbook, lang: Lang, full: boolean) {
  return renderText(buildReport(rb, lang, full))
}

export function exportMarkdown(rb: Runbook, lang: Lang) {
  downloadText(renderMarkdown(buildReport(rb, lang, true)), `${base(rb)}.md`, 'text/markdown;charset=utf-8')
}

export async function exportDocx(rb: Runbook, lang: Lang) {
  const blob = await reportToDocx(buildReport(rb, lang, true), lang === 'fa')
  downloadBlob(blob, `${base(rb)}.docx`)
}
