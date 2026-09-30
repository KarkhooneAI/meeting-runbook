export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 3000)
}

export function downloadText(text: string, filename: string, type = 'text/plain;charset=utf-8') {
  downloadBlob(new Blob([text], { type }), filename)
}

export function safeFilename(s: string, fallback = 'meeting-runbook'): string {
  const t = (s || '').trim().replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, '-').slice(0, 60)
  return t || fallback
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}
