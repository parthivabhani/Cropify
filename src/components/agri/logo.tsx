// Two leaves on one stem — the real plant and its digital twin.
export function AgriTwinLogo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 29V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15.5 16.5C15.5 9 10.5 4 3 4c0 7.5 5 12.5 12.5 12.5Z" fill="currentColor" />
      <path
        d="M16.5 21C16.5 14 21 9.5 29 9.5 29 16.5 24.5 21 16.5 21Z"
        fill="currentColor"
        fillOpacity="0.5"
      />
    </svg>
  );
}
