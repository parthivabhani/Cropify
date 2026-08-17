export function AgriTwinLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.6" />
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="10 90"
        className="text-primary"
      />
      <path
        d="M24 37c0-9 5-14 12-15.5C36 31 31 37 24 37Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 37c0-6-3-10-8-12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <g className="text-primary" stroke="currentColor" strokeWidth="1.3">
        <path d="M16 25 24 16l8 6" strokeLinecap="round" />
        <path d="M24 16v-6" strokeLinecap="round" />
      </g>
      <g fill="currentColor" className="text-primary">
        <circle cx="24" cy="16" r="2.6" />
        <circle cx="16" cy="25" r="2.1" />
        <circle cx="32" cy="22" r="2.1" />
        <circle cx="24" cy="10" r="1.8" />
      </g>
    </svg>
  );
}
