type Props = { label: string; before: string; brand: string; after: string };

export default function WhatsAppTrustBadge({ label, before, brand, after }: Props) {
  return (
    <div className="inline-flex max-w-full self-center lg:self-start items-center gap-3 sm:gap-3.5 mt-2.5 mb-4">
      <div
        className="relative flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full
                   bg-[linear-gradient(155deg,#3ADB7F_0%,#1C9D51_100%)]
                   shadow-[0_0_0_5px_rgba(170,239,201,.10),0_10px_22px_-8px_rgba(6,32,20,.7),inset_0_1px_0_rgba(255,255,255,.35)]"
      >
        <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true" className="size-[22px] sm:size-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        {/* the border colour matches the hero green behind the badge, so the tick reads as cut out of the circle */}
        <span className="absolute -bottom-[3px] -start-[3px] flex size-[17px] sm:size-[18px] items-center justify-center rounded-full border-[2.5px] border-[#35624B] bg-[#AAEFC9]">
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="#163D2B"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-2 sm:size-[9px]"
          >
            <path d="M2.5 6.3 5 8.6 9.5 3.6" />
          </svg>
        </span>
      </div>

      <span aria-hidden="true" className="h-7 sm:h-[30px] w-px shrink-0 bg-white/20" />

      <p className="min-w-0 text-start text-[15px] sm:text-base font-normal leading-[1.4] text-white/80">
        <span className="block sm:inline font-medium text-[#AAEFC9]">{label}</span>{' '}
        {before} <b className="font-semibold text-white">{brand}</b> {after}
      </p>
    </div>
  );
}
