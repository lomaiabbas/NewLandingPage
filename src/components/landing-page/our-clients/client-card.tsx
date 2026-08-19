import { ClientDto } from '@/lib/services/landing-page'
import { twMerge } from 'tailwind-merge'

interface ClientCardProps {
  client: ClientDto
  isLarge?: boolean
}

export default function ClientCard({ client, isLarge = false }: ClientCardProps) {
  const accent = client.primaryColor || 'var(--primary-color)'

  const content = (
    <div
      className={twMerge(
        isLarge
          ? 'w-[148px] h-[148px] md:w-[176px] md:h-[176px] p-1.5'
          : 'w-[110px] h-[110px] max-md:w-20 max-md:h-20 max-sm:w-[70px] max-sm:h-[70px] p-1',
        'rounded-full border bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-md flex items-center justify-center transition-all duration-400 relative overflow-hidden group-hover:scale-105',
        `border-[rgb(from_${accent}_r_g_b/0.12)]`,
        `group-hover:border-[rgb(from_${accent}_r_g_b/0.35)]`,
        `group-hover:shadow-[0_4px_24px_rgb(from_${accent}_r_g_b/0.15)]`,
        `before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgb(from_${accent}_r_g_b/0.12),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 before:rounded-full group-hover:before:opacity-100`
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
      <span className="text-[12px] md:text-[14px] text-white/75 font-medium max-w-[140px] md:max-w-[170px] text-center whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-300 group-hover:text-white">
        {client.name}
      </span>
    </div>
  )
}
