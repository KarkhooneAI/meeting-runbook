import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import fa, { type Dict } from './fa'
import en from './en'
import type { Lang } from '../model/types'

const DICTS: Record<Lang, Dict> = { fa, en }
const LANG_KEY = 'meeting-runbook:lang'

export type TFn = (key: keyof Dict, vars?: Record<string, string | number>) => string

interface I18n { lang: Lang; setLang: (l: Lang) => void; t: TFn; dir: 'rtl' | 'ltr'; num: (n: number | string) => string }

const Ctx = createContext<I18n | null>(null)

export function makeT(lang: Lang): TFn {
  const d = DICTS[lang]
  return (key, vars) => {
    let s: string = d[key] ?? fa[key] ?? String(key)
    if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]))
    return s
  }
}
export const toFaDigits = (s: string | number) => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])
export const numFor = (lang: Lang) => (n: number | string) => (lang === 'fa' ? toFaDigits(n) : String(n))

function initialLang(): Lang {
  try { const v = localStorage.getItem(LANG_KEY); if (v === 'fa' || v === 'en') return v } catch { /* ignore */ }
  return 'fa'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = (l: Lang) => { setLangState(l); try { localStorage.setItem(LANG_KEY, l) } catch { /* ignore */ } }
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }, [lang])
  const value = useMemo<I18n>(() => ({ lang, setLang, t: makeT(lang), dir: lang === 'fa' ? 'rtl' : 'ltr', num: numFor(lang) }), [lang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n(): I18n {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n outside provider')
  return v
}
