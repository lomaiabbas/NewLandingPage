export type SocialProofIcon = 'send' | 'qrcode' | 'chart'

export type SocialProofToast = {
  id: string
  icon: SocialProofIcon
  titleKey: string
  ctaKey: string
  href: (lng: string) => string
}

export const SOCIAL_PROOF_INTERVAL_MS = 4000
export const SOCIAL_PROOF_INITIAL_DELAY_MS = 1500
// After this many full loops through the toasts, hide automatically instead
// of cycling forever — keeps it from lingering on screen indefinitely.
export const SOCIAL_PROOF_MAX_LOOPS = 2
export const SOCIAL_PROOF_EXIT_MS = 300

export const SOCIAL_PROOF_TOASTS: SocialProofToast[] = [
  {
    id: 'invitations-sent',
    icon: 'send',
    titleKey: 'SocialProofToast1Title',
    ctaKey: 'SocialProofToast1Cta',
    href: (lng) => `/${lng}#why-us`,
  },
  {
    id: 'invitees-logged-in',
    icon: 'qrcode',
    titleKey: 'SocialProofToast2Title',
    ctaKey: 'SocialProofToast2Cta',
    href: (lng) => `/${lng}/register`,
  },
  {
    id: 'ditch-spreadsheets',
    icon: 'chart',
    titleKey: 'SocialProofToast3Title',
    ctaKey: 'SocialProofToast3Cta',
    href: (lng) => `/${lng}#contact`,
  },
]
