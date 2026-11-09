type Props = { label: string; rest: string };

export default function WhatsAppTrustLine({ label, rest }: Props) {
  return (
    <div className="flex w-full max-w-[540px] items-center gap-3">
      <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
        <path
          d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
          fill="#AAEFC9"
        />
        <path
          d="m9 12 2 2 4-4"
          fill="none"
          stroke="#163D2B"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="min-w-0 text-sm leading-[1.4] text-white/[.82] min-[380px]:text-[15px] sm:shrink-0 sm:whitespace-nowrap">
        <span className="font-medium text-[#AAEFC9]">{label}</span> {rest}
      </span>
    </div>
  );
}
