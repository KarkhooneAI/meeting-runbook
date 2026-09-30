import { useMemo } from 'react'
import { useI18n } from '../i18n'
import { useRunbook, useStore } from '../store/store'
import { Section } from '../components/Section'
import { useToast } from '../components/Toast'
import { summaryText } from '../lib/exports'
import { copyText } from '../lib/download'

export function Summary({ onDelete }: { onDelete: () => void }) {
  const { t, lang } = useI18n()
  const rb = useRunbook()
  const { setMeta } = useStore()
  const toast = useToast()
  const text = useMemo(() => summaryText(rb, lang, false), [rb, lang])
  const copy = async (full: boolean) => {
    const ok = await copyText(full ? summaryText(rb, lang, true) : text)
    toast(ok ? t('sm_copied') : t('copySelect'))
  }
  return (
    <Section id="summary" title={t('nav_summary')} sub={t('sm_sub')}>
      <div className="card">
        <div className="toolbar" style={{ marginBottom: 10 }}>
          <button className="btn primary" onClick={() => copy(false)}>{t('sm_copy')}</button>
          <button className="btn" onClick={() => copy(true)}>{t('sm_copyAll')}</button>
        </div>
        <div className="summary-out" id="summaryOut">{text}</div>
      </div>
      <div className="card">
        <h3>{t('sm_notes')}</h3>
        <textarea rows={3} value={rb.meta.closingNotes} onChange={e => setMeta('closingNotes', e.target.value)} placeholder={t('sm_notes_ph')} />
      </div>
      <div className="card no-print">
        <button className="btn sm danger" onClick={onDelete}>{t('deleteRunbook')}</button>
      </div>
    </Section>
  )
}
