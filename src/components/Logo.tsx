/** Karkhoone AI mark — four shapes, four colors. Inline SVG so it works offline. */
export function Logo({ size = 42 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Karkhoone AI">
      <g fill="#F8B03A"><circle cx="16" cy="16" r="10" /><circle cx="36" cy="16" r="10" /><circle cx="16" cy="36" r="10" /><circle cx="36" cy="36" r="10" /></g>
      <g fill="#EB5B26"><rect x="54" y="6" width="10" height="40" /><rect x="69" y="6" width="10" height="40" /><rect x="84" y="6" width="10" height="40" /></g>
      <path fill="#44AE4C" d="M6 54H46V94H34V74.5L14.5 94 6 85.5 25.5 66H6Z" />
      <path fill="#C1272F" d="M54 54A20 20 0 0 1 54 94ZM94 54A20 20 0 0 0 94 94Z" />
    </svg>
  )
}
