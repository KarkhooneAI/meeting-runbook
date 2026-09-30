import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { normalizeRunbook, useStore } from '../store/store'
import { useToast } from './Toast'
import { exportDocx, exportExcel, exportJson, exportMarkdown } from '../lib/exports'
import { encodeShare, shareUrl, MAX_LINK_CHARS } from '../lib/share'
import { copyText } from '../lib/download'

const THEME_KEY = 'meeting-runbook:theme'

export function applySavedTheme() {
  try { const th = localStorage.getItem(THEME_KEY); if (th === 'dark' || th === 'light') document.documentElement.dataset.theme = th } catch { /* ignore */ }
}

function Menu({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  return (
    <div className="menu" ref={ref}>
      <button className="btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>{label} ▾</button>
      {open && <div className="menu-pop" role="menu" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}

export function Toolbar() {
  const { t, lang, setLang } = useI18n()
  const { current, dispatch } = useStore()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [theme, setThemeState] = useState<string>(() => document.documentElement.dataset.theme || 'auto')
  if (!current) return null
  const rb = current

  const share = async () => {
    const payload = await encodeShare(rb)
    if (payload.length > MAX_LINK_CHARS) { toast(t('linkTooLong')); return }
    const ok = await copyText(shareUrl(payload))
    toast(ok ? t('linkCopied') : t('copySelect'))
  }
  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = ''
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      try {
        const rbk = normalizeRunbook(JSON.parse(String(r.result)))
        if (!rbk) throw new Error('bad')
        dispatch({ type: 'add', runbook: rbk }); toast(t('imported'))
      } catch { toast(t('importBad')) }
    }
    r.readAsText(f)
  }
  const toggleTheme = () => {
    // auto → dark → light → auto
    const cur = document.documentElement.dataset.theme || 'auto'
    const next = cur === 'auto' ? 'dark' : cur === 'dark' ? 'light' : 'auto'
    if (next === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = next
    try { localStorage.setItem(THEME_KEY, next) } catch { /* ignore */ }
    setThemeState(next)
  }
  const themeLabel = theme === 'dark' ? t('themeDark') : theme === 'light' ? t('themeLight') : t('themeAuto')
  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '◐'
  const print = () => { document.querySelectorAll('details.ag').forEach(d => ((d as HTMLDetailsElement).open = true)); setTimeout(() => window.print(), 60) }
  const dl = (fn: () => void | Promise<void>) => async () => { await fn(); toast(t('exported')) }

  return (
    <div className="toolbar" role="group">
      <Menu label={t('share')}>
        <button onClick={share}>🔗 {t('copyLink')}</button>
        <div className="hint">{t('shareHint')}</div>
        <button onClick={dl(() => exportJson(rb))}>📄 {t('exportJson')}</button>
        <button onClick={() => fileRef.current?.click()}>📂 {t('importJson')}</button>
      </Menu>
      <Menu label={t('export')}>
        <button onClick={dl(() => exportExcel(rb, lang))}>📊 {t('exportExcel')}</button>
        <button onClick={dl(() => exportMarkdown(rb, lang))}>📝 {t('exportMd')}</button>
        <button onClick={dl(() => exportDocx(rb, lang))}>📘 {t('exportDocx')}</button>
        <button onClick={print}>🖨 {t('print')}</button>
      </Menu>
      <button className="btn ghost" onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}>{t('lang')}</button>
      <button className="btn ghost" title={`${t('theme')}: ${themeLabel}`} aria-label={`${t('theme')}: ${themeLabel}`} onClick={toggleTheme}>{themeIcon}</button>
      <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
    </div>
  )
}
