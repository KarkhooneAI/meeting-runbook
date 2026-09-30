import { useEffect, useState } from 'react'
import { useI18n } from './i18n'
import { createRunbook, normalizeRunbook, useStore } from './store/store'
import { useToast } from './components/Toast'
import { Setup } from './components/Setup'
import { Sidebar, NavLinks, useActiveSection } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { Overview } from './sections/Overview'
import { Agenda } from './sections/Agenda'
import { Team } from './sections/Team'
import { Backlog, Metrics, Plan, Decisions } from './sections/Tables'
import { Quality } from './sections/Quality'
import { Summary } from './sections/Summary'
import { clearShareFromLocation, decodeShare, readShareFromLocation } from './lib/share'

export default function App() {
  const { t } = useI18n()
  const { state, current, dispatch } = useStore()
  const toast = useToast()
  const [creating, setCreating] = useState(false)

  // Open a shared runbook from the URL hash (#share=...)
  useEffect(() => {
    const payload = readShareFromLocation()
    if (!payload) return
    ;(async () => {
      try {
        const rb = normalizeRunbook(await decodeShare(payload))
        if (!rb) throw new Error('bad')
        if (state.runbooks.some(r => r.id === rb.id) && !window.confirm(t('sharedOpen'))) { clearShareFromLocation(); return }
        dispatch({ type: 'add', runbook: rb })
        toast(t('sharedImported'))
      } catch { toast(t('importBad')) }
      clearShareFromLocation()
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!current || creating) {
    return <Setup onCancel={current ? () => setCreating(false) : undefined} onCreate={input => { dispatch({ type: 'add', runbook: createRunbook(input) }); setCreating(false); window.scrollTo(0, 0) }} />
  }
  return <Workspace onNew={() => setCreating(true)} />
}

function Workspace({ onNew }: { onNew: () => void }) {
  const { t } = useI18n()
  const { current, dispatch } = useStore()
  const active = useActiveSection()
  const rb = current!
  const remove = () => { if (window.confirm(t('confirmDelete'))) dispatch({ type: 'remove', id: rb.id }) }
  return (
    <>
      <div className="app">
        <Sidebar active={active} onNew={onNew} />
        <main id="main">
          <div className="top">
            <div><h1>{rb.meta.title || t('appName')}</h1><div className="sub">{rb.meta.date}{rb.meta.startTime ? ` · ${rb.meta.startTime}` : ''}</div></div>
            <Toolbar />
          </div>
          <Overview />
          <Agenda />
          <Team />
          <Backlog />
          <Metrics />
          <Quality />
          <Plan />
          <Decisions />
          <Summary onDelete={remove} />
          <p className="small muted no-print">{t('footer')}</p>
        </main>
      </div>
      <nav className="mnav" aria-label="sections"><NavLinks active={active} /></nav>
    </>
  )
}
