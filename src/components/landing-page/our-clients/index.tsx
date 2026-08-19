import { getTranslation } from '@/app/i18n'
import landingPageServiceInstance, { ClientDto } from '@/lib/services/landing-page'
import ClientCard from './client-card'
import StatsBar from './stats-bar'
import styles from './our-clients.module.css'

export default async function OurClients({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng)

  let clients: ClientDto[] = []
  try {
    const data = await landingPageServiceInstance.getClients(lng)
    clients = data || []
  } catch (error) {
    console.error('Failed to fetch clients:', error)
  }

  if (!clients || clients.length === 0) return null

  const isSmallList = clients.length <= 6
  const doubled = isSmallList ? clients : [...clients, ...clients]

  return (
    <section
      className={`${styles.section} pt-[92px] pb-[60px] md:pt-[112px] md:pb-[80px]`}
      id="our-clients"
    >
      <div className="container">
        <div className="text-center mb-14 flex flex-col gap-3 items-center">
          <span
            className="text-white text-[13px] font-bold tracking-[0.03em] rounded-xl px-[15px] py-[10px] relative before:absolute before:inset-0 before:bg-white/15 before:rounded-xl"
            data-aos="fade-up"
          >
            {t('OurClients')}
          </span>
          <h2
            className="font-bold text-white m-0"
            style={{ fontSize: 'var(--h2-fs)', lineHeight: 'var(--h2-line)' }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t('TrustedByLeadingBrands')}
          </h2>
          <p
            className="text-base text-white/80 max-w-[520px] leading-relaxed m-0"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            {lng === 'ar' ? (
              <>
                انضم إلى قائمة الشركات التي تعتمد على{' '}
                <span className="text-primary font-extrabold tracking-wide text-[1.1rem] drop-shadow-[0_0_1px_rgba(var(--primary-color-rgb),0.2)]">
                  AtrasLink
                </span>
              </>
            ) : (
              <>
                Join the list of businesses that rely on{' '}
                <span className="text-primary font-extrabold tracking-wide text-[1.1rem] drop-shadow-[0_0_1px_rgba(var(--primary-color-rgb),0.2)]">
                  AtrasLink
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {isSmallList ? (
        <div className="container mb-14" data-aos="fade-up" data-aos-delay="400">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 py-8">
            {clients.map((client, idx) => (
              <ClientCard key={`${client.name}-${idx}`} client={client} isLarge={true} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden mb-14 [mask-image:linear-gradient(90deg,transparent_0%,#000_12%,#000_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_12%,#000_88%,transparent_100%)]"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div
            className={`flex gap-12 md:gap-20 w-max py-6 hover:[animation-play-state:paused] ${lng === 'ar' ? 'animate-marquee-rtl' : 'animate-marquee'}`}
          >
            {doubled.map((client, idx) => (
              <ClientCard key={`${client.name}-${idx}`} client={client} isLarge={true} />
            ))}
          </div>
        </div>
      )}

      {/* Stats bar */}
      <StatsBar clientCount={clients.length} t={t} />
    </section>
  )
}
