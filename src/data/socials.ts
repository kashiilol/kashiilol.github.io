import type { SocialLink } from '@brainage04/astro-shell/config';
import { soundCloudProfile } from './tracks';

export const discordProfileUrl = 'https://discord.com/users/576348645742608387';

export const socials = [
  {
    name: 'SoundCloud',
    href: soundCloudProfile,
    icon: '/icons/soundcloud.svg',
    iconWidth: 24,
    iconHeight: 24,
    external: true,
  },
  {
    name: 'Discord',
    href: discordProfileUrl,
    icon: '/icons/discord.svg',
    iconWidth: 64,
    iconHeight: 48,
    external: true,
  },
] as const satisfies readonly SocialLink[];
