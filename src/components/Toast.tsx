import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

const Ctx = createContext<(msg: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const toast = useCallback((m: string) => {
    setMsg(m); setShow(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setShow(false), 2400)
  }, [])
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className={'toast' + (show ? ' show' : '')} role="status" aria-live="polite">{msg}</div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
