import type { ReactNode } from 'react'
import { useI18n } from '../i18n'
import { useStore } from '../store/store'
import type { TableKey } from '../model/types'

export interface Col { k: string; label: string; type?: 'text' | 'select'; options?: { v: string; l: string }[]; ph?: string; width?: string }

interface Props { table: TableKey; cols: Col[]; blank: Record<string, string>; addLabel: string; rowClass?: (row: Record<string, string>) => string; footer?: ReactNode }

export function EditableTable({ table, cols, blank, addLabel, rowClass, footer }: Props) {
  const { t } = useI18n()
  const { current, addRow, updateRow, removeRow } = useStore()
  const rows = ((current?.[table] ?? []) as unknown) as Record<string, string>[]

  const del = (row: Record<string, string>) => {
    const has = cols.some(c => c.type !== 'select' && (row[c.k] || '').trim())
    if (has && !window.confirm(t('confirmRow'))) return
    removeRow(table, row.id)
  }

  return (
    <div>
      <table className="tbl">
        <colgroup>{cols.map(c => <col key={c.k} style={{ width: c.width }} />)}<col style={{ width: 38 }} /></colgroup>
        <thead><tr>{cols.map(c => <th key={c.k}>{c.label}</th>)}<th /></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td className="empty" colSpan={cols.length + 1}>{t('empty')}</td></tr>}
          {rows.map(row => (
            <tr key={row.id} className={rowClass ? rowClass(row) : ''}>
              {cols.map(c => (
                <td key={c.k} data-l={c.label}>
                  {c.type === 'select' ? (
                    <select aria-label={c.label} value={row[c.k] ?? ''} onChange={e => updateRow(table, row.id, c.k, e.target.value)}>
                      {c.options!.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  ) : (
                    <input type="text" aria-label={c.label} placeholder={c.ph} value={row[c.k] ?? ''} onChange={e => updateRow(table, row.id, c.k, e.target.value)} />
                  )}
                </td>
              ))}
              <td className="act"><button className="btn sm ghost danger" title={t('delete')} aria-label={t('delete')} onClick={() => del(row)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tbl-foot">
        <button className="btn sm primary" onClick={() => addRow(table, blank)}>{addLabel}</button>
        {footer}
      </div>
    </div>
  )
}
