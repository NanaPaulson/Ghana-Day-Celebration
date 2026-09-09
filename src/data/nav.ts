/** Shared navigation for the blended site layout. */
export const mainNav = [
  { href: '/', label: 'Home', sectionId: 'hero' },
  { href: '#culture', label: 'Culture', sectionId: 'culture' },
  { href: '#music', label: 'Music', sectionId: 'music' },
  { href: '#videos', label: 'Videos', sectionId: 'videos' },
  { href: '#fashion', label: 'Fashion', sectionId: 'fashion' },
  { href: '#history', label: 'History', sectionId: 'history' },
  { href: '#marketplace', label: 'Marketplace', sectionId: 'marketplace' },
  { href: '#schedule', label: 'Schedule', sectionId: 'schedule' },
] as const;

export const footerNav = [
  { href: '#welcome', label: 'Welcome' },
  { href: '#culture', label: 'Culture & Food' },
  { href: '#music', label: 'Music' },
  { href: '#videos', label: 'Videos' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#vendors', label: 'Become a Vendor' },
  { href: '#sponsors', label: 'Partner With Us' },
  { href: '#getting-there', label: 'Contact' },
] as const;
