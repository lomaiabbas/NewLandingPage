export type WhyUsStep = {
  titleKey: string;
  bodyKey?: string;
  tagKeys?: string[];
  img: string;
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
        img: '/images/why-us/organizer-connect-account.png',
      },
      {
        titleKey: 'WhyUsOrgStep2Title',
        bodyKey: 'WhyUsOrgStep2Desc',
        img: '/images/why-us/organizer-create-invitation.png',
      },
      {
        titleKey: 'WhyUsOrgStep3Title',
        bodyKey: 'WhyUsOrgStep3Desc',
        img: '/images/why-us/organizer-upload-guests.png',
      },
      {
        titleKey: 'WhyUsOrgStep4Title',
        bodyKey: 'WhyUsOrgStep4Desc',
        img: '/images/why-us/organizer-pick-template.png',
      },
      {
        titleKey: 'WhyUsOrgStep5Title',
        tagKeys: ['WhyUsOrgStep5Tag1', 'WhyUsOrgStep5Tag2', 'WhyUsOrgStep5Tag3'],
        img: '/images/why-us/organizer-toggle-features.png',
      },
      {
        titleKey: 'WhyUsOrgStep6Title',
        bodyKey: 'WhyUsOrgStep6Desc',
        img: '/images/why-us/organizer-send.png',
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
        img: '/images/why-us/guest-whatsapp-invite.png',
      },
      {
        titleKey: 'WhyUsGuestStep2Title',
        bodyKey: 'WhyUsGuestStep2Desc',
        img: '/images/why-us/guest-accept-decline.png',
      },
      {
        titleKey: 'WhyUsGuestStep3Title',
        bodyKey: 'WhyUsGuestStep3Desc',
        img: '/images/why-us/guest-qr-code.png',
      },
      {
        titleKey: 'WhyUsGuestStep4Title',
        bodyKey: 'WhyUsGuestStep4Desc',
        img: '/images/why-us/guest-arrival.png',
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
        img: '/images/why-us/gatekeeper-scan-screen.png',
      },
      {
        titleKey: 'WhyUsGkStep2Title',
        bodyKey: 'WhyUsGkStep2Desc',
        img: '/images/why-us/gatekeeper-scan-qr.png',
      },
      {
        titleKey: 'WhyUsGkStep3Title',
        tagKeys: ['WhyUsGkStep3Tag1', 'WhyUsGkStep3Tag2', 'WhyUsGkStep3Tag3'],
        img: '/images/why-us/gatekeeper-instant-check.png',
      },
      {
        titleKey: 'WhyUsGkStep4Title',
        bodyKey: 'WhyUsGkStep4Desc',
        img: '/images/why-us/gatekeeper-live-attendance.png',
      },
    ],
  },
];
