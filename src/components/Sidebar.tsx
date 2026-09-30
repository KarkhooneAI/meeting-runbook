import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { useStore } from '../store/store'
import { Logo } from './Logo'
import { SECTION_COLORS, SECTION_IDS } from './Section'

export function useActiveSection(): string {
  const [active, setActive] = useState('overview')
  useEffect(() => {
    const els = SECTION_IDS.map(id => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver(entries => {
      for (const en of entries) if (en.isIntersecting) setActive(en.target.id)
    }, { rootMargin: '-20% 0px -70% 0px' })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [])
  return active
}

export function NavLinks({ active, className }: { active: string; className?: string }) {
  const { t } = useI18n()
  return (
    <>
      {SECTION_IDS.map(id => (
        <a key={id} href={`#${id}`} className={(className || '') + (active === id ? ' active' : '')} style={{ ['--c' as string]: SECTION_COLORS[id] }}>
          <i className="dot" /><span>{t(`nav_${id}` as 'nav_overview')}</span>
        </a>
      ))}
    </>
  )
}

export function Sidebar({ active, onNew }: { active: string; onNew: () => void }) {
  const { t, lang } = useI18n()
  const { state, dispatch } = useStore()
  const fmt = (iso: string) => { try { return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB', { month: 'short', day: 'numeric' }).format(new Date(iso)) } catch { return '' } }
  return (
    <aside className="side">
      <a className="brand" href="#overview" title={`${t('appName')} — ${t('by')}`}>
        <Logo /><div><b>{t('appName')}</b><span>{t('by')}</span></div>
      </a>
      <nav className="nav" aria-label="sections"><NavLinks active={active} /></nav>
      <div className="side-block">
        <h4>{t('runbooks')}</h4>
        <div className="rb-list">
          {state.runbooks.map(r => (
            <button key={r.id} className={r.id === state.currentId ? 'active' : ''} onClick={() => dispatch({ type: 'select', id: r.id })}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.meta.title || '—'}</span><span className="d">{fmt(r.updatedAt)}</span>
            </button>
          ))}
          <button onClick={onNew} style={{ color: 'var(--accent)' }}>{t('newRunbook')}</button>
        </div>
      </div>
      <div className="side-foot">
        <div className="storage"><i className={'led' + (state.storageOk ? '' : ' off')} /><span>{state.storageOk ? t('saved') : t('savedOff')}</span></div>
        <div className="hint small muted">{t('tagline')}</div>
      </div>
    </aside>
  )
}
