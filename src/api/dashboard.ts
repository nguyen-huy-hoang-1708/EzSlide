type HealthStatus = {
  ok: boolean
  timestamp: string
}

export type DashboardUser = {
  id: string
  name: string
  avatarUrl: string
  isLoggedIn: boolean
}

export type DashboardSlide = {
  id: string
  title: string
  thumbnailUrl: string
  updatedAt: string
}

export type DashboardTemplate = {
  id: string
  title: string
  thumbnailUrl: string
  category: string
  updatedAt: string
}

export type ShortcutId = 'new-slide' | 'ai-slide' | 'template-browser'

const MOCK_USER: DashboardUser = {
  id: 'user_123',
  name: 'Ari Watanabe',
  avatarUrl:
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80',
  isLoggedIn: true,
}

const MOCK_SLIDES: DashboardSlide[] = [
  {
    id: 'slide_001',
    title: 'Growth review Q4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-11-20T10:00:00.000Z',
  },
  {
    id: 'slide_002',
    title: 'Product roadmap',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-11-19T15:32:00.000Z',
  },
  {
    id: 'slide_003',
    title: 'Brand guidelines',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-11-18T09:11:00.000Z',
  },
  {
    id: 'slide_004',
    title: 'Investor update',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-11-15T13:00:00.000Z',
  },
  {
    id: 'slide_005',
    title: 'Pricing experiment',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-11-12T08:45:00.000Z',
  },
  {
    id: 'slide_006',
    title: 'Campaign kickoff',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-11-08T21:00:00.000Z',
  },
]

const MOCK_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'template_pitch',
    title: 'Pitch hero',
    category: 'Pitch',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-11-01T00:00:00.000Z',
  },
  {
    id: 'template_report',
    title: 'Status report',
    category: 'Report',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-10-26T00:00:00.000Z',
  },
  {
    id: 'template_social',
    title: 'Social teaser',
    category: 'Social',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-10-20T00:00:00.000Z',
  },
  {
    id: 'template_launch',
    title: 'Launch highlight',
    category: 'Launch',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1475724017904-b712052c192a?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-10-10T00:00:00.000Z',
  },
  {
    id: 'template_ops',
    title: 'Ops cadence',
    category: 'Operations',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-09-28T00:00:00.000Z',
  },
  {
    id: 'template_edu',
    title: 'Learning summary',
    category: 'Education',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=60',
    updatedAt: '2025-09-14T00:00:00.000Z',
  },
]

const delay = (min = 120, max = 320) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min))

const maybeFail = (rate = 0.03) => {
  if (Math.random() < rate) {
    const error = new Error('Temporary network issue. Please retry.')
    ;(error as Error & { status?: number }).status = 503
    throw error
  }
}

const simulate = async <T>(factory: () => T, config?: { failRate?: number }) => {
  await delay()
  maybeFail(config?.failRate)
  return factory()
}

export const dashboardClient = {
  status: async (): Promise<HealthStatus> =>
    simulate(() => ({ ok: true, timestamp: new Date().toISOString() }), { failRate: 0.01 }),

  me: async (): Promise<DashboardUser> => simulate(() => MOCK_USER),

  recentSlides: async (limit = 6): Promise<DashboardSlide[]> =>
    simulate(() => MOCK_SLIDES.slice(0, limit)),

  templates: async (limit = 6): Promise<DashboardTemplate[]> =>
    simulate(() => MOCK_TEMPLATES.slice(0, limit)),

  launchShortcut: async (shortcut: ShortcutId) =>
    simulate(() => ({ shortcut, trackedAt: new Date().toISOString() })),
}

export type DashboardPayloads = {
  status: Awaited<ReturnType<typeof dashboardClient.status>>
  user: Awaited<ReturnType<typeof dashboardClient.me>>
  slides: Awaited<ReturnType<typeof dashboardClient.recentSlides>>
  templates: Awaited<ReturnType<typeof dashboardClient.templates>>
}

