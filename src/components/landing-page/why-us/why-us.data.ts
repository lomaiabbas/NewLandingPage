export type WhyUsStep = {
  titleKey: string;
  bodyKey?: string;
  tagKeys?: string[];
  img?: string;
};

export type WhyUsTab = {
  id: string;
  labelKey: string;
  steps: WhyUsStep[];
};

export const WHY_US_STEP_MS = 3200;

export const WHY_US_TABS: WhyUsTab[] = [
  {
    id: 'organizer',
    labelKey: 'WhyUsTabOrganizer',
    steps: [
      {
        titleKey: 'WhyUsOrgStep1Title',
        bodyKey: 'WhyUsOrgStep1Desc',
        img: '/images/why-us/organizer-01-login.webp',
      },
      {
        titleKey: 'WhyUsOrgStep2Title',
        img: '/images/why-us/organizer-02-create-request.webp',
      },
      {
        titleKey: 'WhyUsOrgStep3Title',
        bodyKey: 'WhyUsOrgStep3Desc',
        img: '/images/why-us/organizer-03-event-details.webp',
      },
      {
        titleKey: 'WhyUsOrgStep4Title',
        bodyKey: 'WhyUsOrgStep4Desc',
        img: '/images/why-us/organizer-04-guest-list.webp',
      },
    ],
  },
  {
    id: 'guest',
    labelKey: 'WhyUsTabGuest',
    steps: [
      {
        titleKey: 'WhyUsGuestStep1Title',
        bodyKey: 'WhyUsGuestStep1Desc',
        img: '/images/why-us/guest-01-whatsapp-invite.webp',
      },
      {
        titleKey: 'WhyUsGuestStep2Title',
        bodyKey: 'WhyUsGuestStep2Desc',
        img: '/images/why-us/guest-02-accept-decline.webp',
      },
      {
        titleKey: 'WhyUsGuestStep3Title',
        bodyKey: 'WhyUsGuestStep3Desc',
        img: '/images/why-us/guest-03-qr-code.webp',
      },
      {
        titleKey: 'WhyUsGuestStep4Title',
        bodyKey: 'WhyUsGuestStep4Desc',
        img: '/images/why-us/guest-04-arrival.webp',
      },
    ],
  },
  {
    id: 'gatekeeper',
    labelKey: 'WhyUsTabGatekeeper',
    steps: [
      {
        titleKey: 'WhyUsGkStep1Title',
        bodyKey: 'WhyUsGkStep1Desc',
        img: '/images/why-us/gatekeeper-01-login.webp',
      },
      {
        titleKey: 'WhyUsGkStep2Title',
        bodyKey: 'WhyUsGkStep2Desc',
        img: '/images/why-us/gatekeeper-02-event-details.webp',
      },
      {
        titleKey: 'WhyUsGkStep3Title',
        bodyKey: 'WhyUsGkStep3Desc',
        img: '/images/why-us/gatekeeper-03-scan-qr.webp',
      },
      {
        titleKey: 'WhyUsGkStep4Title',
        bodyKey: 'WhyUsGkStep4Desc',
        img: '/images/why-us/gatekeeper-04-confirm-guest.webp',
      },
    ],
  },
];
