export type SocialProofIcon = 'send' | 'qrcode' | 'chart'

export type SocialProofToast = {
  id: string
  icon: SocialProofIcon
  titleKey: string
  ctaKey: string
  href: (lng: string) => string
}

export const SOCIAL_PROOF_AUTO_HIDE_MS = 10000
export const SOCIAL_PROOF_INITIAL_DELAY_MS = 1500
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

export const SOCIAL_PROOF_HIDDEN_SECTIONS = ['hero', 'why-us']

export const SOCIAL_PROOF_SECTION_TOAST: Record<string, string> = {
  'key-features': 'ditch-spreadsheets',
  about: 'invitations-sent',
  'our-clients': 'invitees-logged-in',
  contact: 'invitations-sent',
}

export const SOCIAL_PROOF_SECTION_IDS = [
  ...SOCIAL_PROOF_HIDDEN_SECTIONS,
  ...Object.keys(SOCIAL_PROOF_SECTION_TOAST),
]
