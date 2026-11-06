export type SolutionId = 'events' | 'campaigns' | 'stores';

export type SolutionItem = {
  id: SolutionId;
  titleKey: string;
  descKey: string;
  pointKeys: string[];
  /* a pill under the points, e.g. for an integration that isn't live yet */
  badgeKey?: string;
};

/* The three solution cards, in order */
export const SOLUTIONS: SolutionItem[] = [
  {
    id: 'events',
    titleKey: 'SolutionEventsTitle',
    descKey: 'SolutionEventsDesc',
    pointKeys: ['SolutionEventsPoint1', 'SolutionEventsPoint2', 'SolutionEventsPoint3', 'SolutionEventsPoint4'],
  },
  {
    id: 'campaigns',
    titleKey: 'SolutionCampaignsTitle',
    descKey: 'SolutionCampaignsDesc',
    pointKeys: ['SolutionCampaignsPoint1', 'SolutionCampaignsPoint2', 'SolutionCampaignsPoint3', 'SolutionCampaignsPoint4'],
  },
  {
    id: 'stores',
    titleKey: 'SolutionStoresTitle',
    descKey: 'SolutionStoresDesc',
    pointKeys: ['SolutionStoresPoint1', 'SolutionStoresPoint2', 'SolutionStoresPoint3'],
    badgeKey: 'SolutionStoresBadge',
  },
];
