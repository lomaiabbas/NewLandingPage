export type SolutionId = 'invitations' | 'events' | 'campaigns' | 'stores' | 'ai';

export type SolutionItem = {
  id: SolutionId;
  titleKey: string;
  descKey: string;
  pointKeys: string[];
  /* a pill under the points, e.g. for an integration that isn't live yet */
  badgeKey?: string;
};

/* The five solution cards, in order */
export const SOLUTIONS: SolutionItem[] = [
  {
    id: 'invitations',
    titleKey: 'SolutionInvitesTitle',
    descKey: 'SolutionInvitesDesc',
    pointKeys: ['SolutionInvitesPoint1', 'SolutionInvitesPoint2', 'SolutionInvitesPoint3', 'SolutionInvitesPoint4'],
  },
  {
    id: 'events',
    titleKey: 'SolutionEventsTitle',
    descKey: 'SolutionEventsDesc',
    pointKeys: ['SolutionEventsPoint1', 'SolutionEventsPoint2', 'SolutionEventsPoint3'],
  },
  {
    id: 'campaigns',
    titleKey: 'SolutionCampaignsTitle',
    descKey: 'SolutionCampaignsDesc',
    pointKeys: ['SolutionCampaignsPoint1', 'SolutionCampaignsPoint2', 'SolutionCampaignsPoint3'],
  },
  {
    id: 'stores',
    titleKey: 'SolutionStoresTitle',
    descKey: 'SolutionStoresDesc',
    pointKeys: ['SolutionStoresPoint1', 'SolutionStoresPoint2', 'SolutionStoresPoint3'],
    badgeKey: 'SolutionStoresBadge',
  },
  {
    id: 'ai',
    titleKey: 'SolutionAiTitle',
    descKey: 'SolutionAiDesc',
    pointKeys: ['SolutionAiPoint1', 'SolutionAiPoint2', 'SolutionAiPoint3'],
  },
];
