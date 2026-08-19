export default function QrScanSVG({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="6"
        fill="#ffffff"
        stroke={color}
        stroke-width="1.5"
      />
      <rect
        x="7"
        y="7"
        width="7"
        height="7"
        rx="1.2"
        fill="none"
        stroke={color}
        stroke-width="1.6"
      />
      <rect
        x="18"
        y="7"
        width="7"
        height="7"
        rx="1.2"
        fill="none"
        stroke={color}
        stroke-width="1.6"
      />
      <rect
        x="7"
        y="18"
        width="7"
        height="7"
        rx="1.2"
        fill="none"
        stroke={color}
        stroke-width="1.6"
      />
      <rect x="10" y="10" width="1.5" height="1.5" fill={color} />
      <rect x="21" y="10" width="1.5" height="1.5" fill={color} />
      <rect x="10" y="21" width="1.5" height="1.5" fill={color} />
      <rect x="18" y="18" width="2" height="2" fill={color} />
      <rect x="22" y="18" width="2" height="2" fill={color} />
      <rect x="18" y="22" width="2" height="2" fill={color} />
      <rect x="22" y="22" width="2" height="2" fill={color} />
    </svg>
  )
}
