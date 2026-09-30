export type Lang = 'fa' | 'en'

export const SCHEMA_VERSION = 1

export interface Meta {
  title: string
  date: string
  startTime: string
  durationMin: number
  bufferMin: number
  participants: string[]
  focus: string
  sourceOfTruth: string
  firstReview: string
  retro: string
  syncRhythm: string
  closingNotes: string
}

export interface OutputItem { id: string; text: string; done: boolean }

export interface AgendaItem {
  id: string
  title: string
  minutes: number
  topics: string[]
  hint?: string
  notes: string
  summary: string
  done: boolean
  spentSec: number
}

export interface TeamEntry { person: string; q1: string; q2: string; q3: string }

export interface BacklogRow { id: string; space: string; topic: string; outcome: string; priority: string; person: string; due: string; milestone: string; status: string }
export interface MetricRow { id: string; objective: string; kr: string; baseline: string; target: string; source: string; person: string; cadence: string }
export interface PlanRow { id: string; range: string; action: string; person: string; due: string; criteria: string; status: string }
export interface DecisionRow { id: string; decision: string; why: string; person: string; review: string }
export interface ParkingRow { id: string; topic: string; next: string; person: string }

export interface QualityItem { id: string; text: string; done: boolean }
export interface Quality { dor: QualityItem[]; dod: QualityItem[]; milestone: QualityItem[] }

export interface Runbook {
  schema: number
  id: string
  createdAt: string
  updatedAt: string
  lang: Lang
  template: string
  meta: Meta
  outputs: OutputItem[]
  agenda: AgendaItem[]
  team: TeamEntry[]
  teamShared: string
  backlog: BacklogRow[]
  metrics: MetricRow[]
  quality: Quality
  qualityFlow: string
  plan: PlanRow[]
  decisions: DecisionRow[]
  parking: ParkingRow[]
}

export type TableKey = 'backlog' | 'metrics' | 'plan' | 'decisions' | 'parking'

export const PRIORITIES = ['P0', 'P1', 'P2', 'later'] as const
export const BACKLOG_STATUS = ['Backlog', 'Ready', 'In Progress', 'Review', 'QA/QC', 'Done', 'Blocked'] as const
export const PLAN_STATUS = ['Not started', 'In Progress', 'Done', 'Blocked'] as const

export const uid = (): string =>
  (globalThis.crypto && 'randomUUID' in globalThis.crypto)
    ? globalThis.crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)
