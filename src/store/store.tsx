import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { SCHEMA_VERSION, uid, type Lang, type Runbook, type TableKey } from '../model/types'
import { seedTemplate, type TemplateId } from '../model/templates'

export const STORAGE_KEY = 'meeting-runbook:v1'

export interface Persisted { runbooks: Runbook[]; currentId: string | null }

interface State extends Persisted { storageOk: boolean }

export interface NewRunbookInput {
  title: string; date: string; startTime: string; durationMin: number; bufferMin: number
  participants: string[]; template: TemplateId; focus: string; lang: Lang
}

export function createRunbook(input: NewRunbookInput): Runbook {
  const seed = seedTemplate(input.template, input.lang)
  const now = new Date().toISOString()
  return {
    schema: SCHEMA_VERSION, id: uid(), createdAt: now, updatedAt: now, lang: input.lang, template: input.template,
    meta: { title: input.title, date: input.date, startTime: input.startTime, durationMin: input.durationMin, bufferMin: input.bufferMin,
      participants: input.participants, focus: input.focus, sourceOfTruth: '', firstReview: '', retro: '', syncRhythm: '', closingNotes: '' },
    outputs: seed.outputs, agenda: seed.agenda,
    team: input.participants.map(p => ({ person: p, q1: '', q2: '', q3: '' })), teamShared: '',
    backlog: [], metrics: seed.metrics, quality: seed.quality, qualityFlow: '', plan: seed.plan, decisions: [], parking: [],
  }
}

/** Accepts any object and returns a Runbook if it looks like one (keeps unknown extra fields out). */
export function normalizeRunbook(x: unknown): Runbook | null {
  if (!x || typeof x !== 'object') return null
  const r = x as Partial<Runbook>
  if (!r.meta || !Array.isArray(r.agenda)) return null
  const base = createRunbook({ title: '', date: '', startTime: '', durationMin: 60, bufferMin: 0, participants: [], template: 'blank', focus: '', lang: r.lang === 'en' ? 'en' : 'fa' })
  const arr = <T,>(v: unknown, d: T[]): T[] => (Array.isArray(v) ? (v as T[]) : d)
  return {
    ...base,
    ...r,
    schema: SCHEMA_VERSION,
    id: typeof r.id === 'string' && r.id ? r.id : uid(),
    meta: { ...base.meta, ...(r.meta || {}), participants: arr<string>(r.meta?.participants, []) },
    outputs: arr(r.outputs, []), agenda: arr(r.agenda, []), team: arr(r.team, []),
    backlog: arr(r.backlog, []), metrics: arr(r.metrics, []), plan: arr(r.plan, []), decisions: arr(r.decisions, []), parking: arr(r.parking, []),
    quality: { dor: arr(r.quality?.dor, []), dod: arr(r.quality?.dod, []), milestone: arr(r.quality?.milestone, []) },
    teamShared: r.teamShared ?? '', qualityFlow: r.qualityFlow ?? '',
  }
}

type Action =
  | { type: 'add'; runbook: Runbook; select?: boolean }
  | { type: 'select'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'patch'; id: string; fn: (r: Runbook) => Runbook }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'add': return { ...s, runbooks: [a.runbook, ...s.runbooks.filter(r => r.id !== a.runbook.id)], currentId: a.select === false ? s.currentId : a.runbook.id }
    case 'select': return { ...s, currentId: a.id }
    case 'remove': { const rest = s.runbooks.filter(r => r.id !== a.id); return { ...s, runbooks: rest, currentId: s.currentId === a.id ? (rest[0]?.id ?? null) : s.currentId } }
    case 'patch': return { ...s, runbooks: s.runbooks.map(r => (r.id === a.id ? { ...a.fn(r), updatedAt: new Date().toISOString() } : r)) }
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw) as Persisted
      const runbooks = (p.runbooks || []).map(normalizeRunbook).filter((r): r is Runbook => !!r)
      return { runbooks, currentId: runbooks.some(r => r.id === p.currentId) ? p.currentId : (runbooks[0]?.id ?? null), storageOk: true }
    }
    localStorage.setItem(STORAGE_KEY + ':probe', '1'); localStorage.removeItem(STORAGE_KEY + ':probe')
    return { runbooks: [], currentId: null, storageOk: true }
  } catch {
    return { runbooks: [], currentId: null, storageOk: false }
  }
}

interface Store {
  state: State
  current: Runbook | null
  dispatch: (a: Action) => void
  patch: (fn: (r: Runbook) => Runbook) => void
  setMeta: (k: keyof Runbook['meta'], v: string | number | string[]) => void
  addRow: (t: TableKey, blank: Record<string, string>) => void
  updateRow: (t: TableKey, id: string, k: string, v: string) => void
  removeRow: (t: TableKey, id: string) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ runbooks: state.runbooks, currentId: state.currentId })) } catch { /* storage full / unavailable */ }
  }, [state.runbooks, state.currentId])

  const current = useMemo(() => state.runbooks.find(r => r.id === state.currentId) ?? null, [state.runbooks, state.currentId])
  const id = current?.id
  const patch = useCallback((fn: (r: Runbook) => Runbook) => { if (id) dispatch({ type: 'patch', id, fn }) }, [id])
  const setMeta = useCallback<Store['setMeta']>((k, v) => patch(r => ({ ...r, meta: { ...r.meta, [k]: v } })), [patch])
  const addRow = useCallback<Store['addRow']>((t, blank) => patch(r => ({ ...r, [t]: [...(r[t] as unknown as Record<string, string>[]), { id: uid(), ...blank }] })), [patch])
  const updateRow = useCallback<Store['updateRow']>((t, rowId, k, v) => patch(r => ({ ...r, [t]: (r[t] as unknown as Record<string, string>[]).map(row => (row.id === rowId ? { ...row, [k]: v } : row)) })), [patch])
  const removeRow = useCallback<Store['removeRow']>((t, rowId) => patch(r => ({ ...r, [t]: (r[t] as unknown as Record<string, string>[]).filter(row => row.id !== rowId) })), [patch])

  const value = useMemo<Store>(() => ({ state, current, dispatch, patch, setMeta, addRow, updateRow, removeRow }), [state, current, patch, setMeta, addRow, updateRow, removeRow])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside provider')
  return v
}

/** Convenience: the current runbook, guaranteed (sections render only when one exists). */
export function useRunbook(): Runbook {
  const { current } = useStore()
  if (!current) throw new Error('no current runbook')
  return current
}
