import type { SiteConfig } from '@brainage04/astro-shell/config';

export const siteConfig = {
  siteName: 'kashii',
  homeTitle: "kashii's website",
  description: 'I’m kashii, a music producer based in Brisbane, Queensland, Australia who makes EDM and pop music.',
  navItems: [
    { name: 'Home', href: '/', match: '/', activeMode: 'exact' },
    { name: 'Music', href: '/projects/', match: '/projects/', activeMode: 'prefix' },
    { name: 'Commissions', href: '/commissions/', match: '/commissions/', activeMode: 'prefix' },
  ],
  sourceHref: 'https://github.com/kashiilol/kashiilol.github.io',
  faviconHref: '/pfp.webp',
  faviconType: 'image/webp',
  image: '/pfp.webp',
  themeColor: '#111310',
  preconnectHrefs: ['https://i1.sndcdn.com', 'https://w.soundcloud.com'],
  ownerHref: 'https://soundcloud.com/kashii-981036167',
  ownerName: 'kashii',
  creatorHref: 'https://github.com/brainage04',
  creatorName: 'brainage04',
} as const satisfies SiteConfig;
