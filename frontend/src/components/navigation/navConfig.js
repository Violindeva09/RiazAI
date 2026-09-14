export const NAV_ITEMS = [
  {
    key: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    section: 'primary',
    subtitle: 'Practice overview, metrics & recent activity',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Dashboard', to: '/dashboard' }],
    iconName: 'dashboard',
  },
  {
    key: 'analyse',
    path: '/analyse',
    label: 'Analyse',
    section: 'primary',
    subtitle: 'Audio practice analysis & signal consistency',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Analyse', to: '/analyse' }],
    iconName: 'analyse',
  },
  {
    key: 'sessions',
    path: '/sessions',
    label: 'Sessions',
    section: 'primary',
    subtitle: 'History of recorded practice runs and audio benchmarks',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Sessions', to: '/sessions' }],
    iconName: 'sessions',
  },
  {
    key: 'analytics',
    path: '/analytics',
    label: 'Analytics',
    section: 'primary',
    subtitle: 'Longitudinal practice consistency and performance trends',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Analytics', to: '/analytics' }],
    iconName: 'analytics',
  },
  {
    key: 'goals',
    path: '/goals',
    label: 'Goals',
    section: 'primary',
    subtitle: 'Practice routines, duration targets & milestones',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Goals', to: '/goals' }],
    iconName: 'goals',
  },
  {
    key: 'journal',
    path: '/journal',
    label: 'Journal',
    section: 'primary',
    subtitle: 'Musician notes, self-reflection & session observations',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Journal', to: '/journal' }],
    iconName: 'journal',
  },
  {
    key: 'coach',
    path: '/coach',
    label: 'Coach',
    section: 'primary',
    badge: 'Roadmap',
    subtitle: 'Guided practice advisory & intelligent feedback (Coming Soon)',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Coach', to: '/coach' }],
    iconName: 'coach',
  },
  {
    key: 'profile',
    path: '/profile',
    label: 'Profile',
    section: 'secondary',
    subtitle: 'Musician instrument settings & practice bio',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Profile', to: '/profile' }],
    iconName: 'profile',
  },
  {
    key: 'settings',
    path: '/settings',
    label: 'Settings',
    section: 'secondary',
    subtitle: 'Preferences, audio defaults & data controls',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }, { label: 'Settings', to: '/settings' }],
    iconName: 'settings',
  },
];

export const NAV_SECTIONS = {
  primary: {
    label: 'Practice & Analysis',
    items: NAV_ITEMS.filter((item) => item.section === 'primary'),
  },
  secondary: {
    label: 'Account',
    items: NAV_ITEMS.filter((item) => item.section === 'secondary'),
  },
};

export const getRouteMetadata = (pathname) => {
  const match = NAV_ITEMS.find((item) => item.path === pathname);
  if (match) {
    return {
      title: match.label,
      subtitle: match.subtitle,
      breadcrumbs: match.breadcrumbs,
      badge: match.badge,
    };
  }
  if (pathname === '/') {
    return {
      title: 'RiazAI — Personal Music Practice Intelligence',
      subtitle: 'Turn your practice sessions into measurable progress.',
      breadcrumbs: [{ label: 'RiazAI', to: '/' }],
    };
  }
  return {
    title: 'RiazAI',
    subtitle: 'Personal music practice and analysis platform',
    breadcrumbs: [{ label: 'RiazAI', to: '/' }],
  };
};