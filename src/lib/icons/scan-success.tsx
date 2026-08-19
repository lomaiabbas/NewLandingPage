export default function ScanSuccessIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" width="30" height="30">
      <g stroke="#52c41a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* corners */}
        <path d="M15 35V20a5 5 0 0 1 5-5h15" />
        <path d="M65 15h15a5 5 0 0 1 5 5v15" />
        <path d="M15 65v15a5 5 0 0 0 5 5h15" />
        <path d="M65 85h15a5 5 0 0 0 5-5V65" />

        {/* check */}
        <path d="M34 50L47 63L70 40" />
      </g>
    </svg>
  )
}
