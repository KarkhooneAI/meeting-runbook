import { useI18n } from '../i18n'

export interface CheckItem { id: string; text: string; done: boolean }

interface Props { items: CheckItem[]; onChange: (items: CheckItem[]) => void; addLabel: string; newItem: () => CheckItem; plain?: boolean }

/** Editable checklist: tick, edit text, add, remove. */
export function Checklist({ items, onChange, addLabel, newItem, plain }: Props) {
  const { t } = useI18n()
  const set = (id: string, patch: Partial<CheckItem>) => onChange(items.map(i => (i.id === id ? { ...i, ...patch } : i)))
  return (
    <div>
      {items.map(i => (
        <div key={i.id} className={'check' + (i.done ? ' done' : '')}>
          <input type="checkbox" checked={i.done} onChange={e => set(i.id, { done: e.target.checked })} aria-label="done" />
          <input type="text" className={plain ? 'plain t' : 't'} value={i.text} onChange={e => set(i.id, { text: e.target.value })} />
          <button className="btn sm ghost danger" aria-label={t('delete')} onClick={() => onChange(items.filter(x => x.id !== i.id))}>✕</button>
        </div>
      ))}
      <div className="tbl-foot"><button className="btn sm" onClick={() => onChange([...items, newItem()])}>{addLabel}</button></div>
    </div>
  )
}
