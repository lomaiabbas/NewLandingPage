export type SocialProofToast = {
  id: string
  titleKey: string
  ctaKey: string
  href: (lng: string) => string
}

export const SOCIAL_PROOF_INTERVAL_MS = 4000
export const SOCIAL_PROOF_INITIAL_DELAY_MS = 1500

export const SOCIAL_PROOF_TOASTS: SocialProofToast[] = [
  {
    id: 'invitations-sent',
    titleKey: 'SocialProofToast1Title',
    ctaKey: 'SocialProofToast1Cta',
    href: (lng) => `/${lng}#why-us`,
  },
  {
    id: 'invitees-logged-in',
    titleKey: 'SocialProofToast2Title',
    ctaKey: 'SocialProofToast2Cta',
    href: (lng) => `/${lng}/register`,
  },
  {
    id: 'ditch-spreadsheets',
    titleKey: 'SocialProofToast3Title',
    ctaKey: 'SocialProofToast3Cta',
    href: (lng) => `/${lng}#contact`,
  },
]
