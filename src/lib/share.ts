/**
 * Share links: the whole runbook is deflated + base64url-encoded into the URL hash.
 * No server involved. Falls back to plain base64 when CompressionStream is missing.
 */
import type { Runbook } from '../model/types'

const PREFIX_DEFLATE = 'z.'
const PREFIX_PLAIN = 'p.'
export const MAX_LINK_CHARS = 60_000

function b64url(bytes: Uint8Array): string {
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function fromB64url(s: string): Uint8Array {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4))
  return Uint8Array.from(b, c => c.charCodeAt(0))
}
async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const res = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream as unknown as ReadableWritablePair<Uint8Array, Uint8Array>))
  return new Uint8Array(await res.arrayBuffer())
}

export async function encodeShare(rb: Runbook): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(rb))
  if (typeof CompressionStream !== 'undefined') {
    const z = await pipe(json, new CompressionStream('deflate-raw'))
    return PREFIX_DEFLATE + b64url(z)
  }
  return PREFIX_PLAIN + b64url(json)
}

export async function decodeShare(payload: string): Promise<unknown> {
  if (payload.startsWith(PREFIX_DEFLATE)) {
    const bytes = fromB64url(payload.slice(2))
    const out = await pipe(bytes, new DecompressionStream('deflate-raw'))
    return JSON.parse(new TextDecoder().decode(out))
  }
  if (payload.startsWith(PREFIX_PLAIN)) return JSON.parse(new TextDecoder().decode(fromB64url(payload.slice(2))))
  throw new Error('unknown share format')
}

export function shareUrl(payload: string): string {
  const u = new URL(window.location.href)
  u.hash = 'share=' + payload
  return u.toString()
}

export function readShareFromLocation(): string | null {
  const h = window.location.hash
  if (!h.startsWith('#share=')) return null
  return h.slice('#share='.length)
}

export function clearShareFromLocation() {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}
