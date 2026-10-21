import { ClientDto } from '@/lib/services/landing-page'
import { twMerge } from 'tailwind-merge'
import styles from './our-clients.module.css'

interface ClientCardProps {
  client: ClientDto
  isLarge?: boolean
}

export default function ClientCard({ client, isLarge = false }: ClientCardProps) {
  const content = (
    <div
      className={twMerge(
        isLarge
          ? 'w-20 h-20 sm:w-[104px] sm:h-[104px] md:w-[140px] md:h-[140px] p-1.5'
          : 'w-[88px] h-[88px] max-md:w-16 max-md:h-16 max-sm:w-[56px] max-sm:h-[56px] p-1',
        styles.logoRing,
        'rounded-full shadow-[var(--shadow)] flex items-center justify-center transition-all duration-400 relative overflow-hidden group-hover:scale-105'
      )}
    >
      <img
        src={client.logo}
        alt={client.name}
        className="w-full h-full object-cover transition-all duration-300 rounded-full relative z-10"
        loading="lazy"
      />
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-2.5 shrink-0 cursor-default group">
      {client.link ? (
        <a
          href={client.link}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline block"
        >
          {content}
        </a>
      ) : (
        content
      )}
      <span className="text-[11px] sm:text-[12px] md:text-[14px] text-white/75 font-medium max-w-20 sm:max-w-[104px] md:max-w-[140px] text-center whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-300 group-hover:text-white">
        {client.name}
      </span>
    </div>
  )
}
