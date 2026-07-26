export interface Track {
  title: string;
  url: string;
  artwork: string;
  releaseDate: string;
  year: string;
  genre: string;
  format: string;
  note?: string;
  featured?: boolean;
}

export const soundCloudProfile = 'https://soundcloud.com/kashii-981036167';

export const tracks: readonly Track[] = [
  {
    title: 'Time Collapse',
    url: 'https://soundcloud.com/kashii-981036167/time-collapse',
    artwork: 'https://i1.sndcdn.com/artworks-vW9bnV0WBfxK495g-jmpIzg-t500x500.png',
    releaseDate: '07 Jan 2026',
    year: '2026',
    genre: 'Dance & EDM',
    format: 'Original',
    note: 'My latest original electronic release.',
    featured: true,
  },
  {
    title: 'star****',
    url: 'https://soundcloud.com/kashii-981036167/star',
    artwork: 'https://i1.sndcdn.com/artworks-sVJJ2mEUzk0YuG5N-b59UcA-t500x500.png',
    releaseDate: '22 Dec 2025',
    year: '2025',
    genre: 'Dance & EDM',
    format: 'Original',
    note: 'An original dance track released in December 2025.',
    featured: true,
  },
  {
    title: 'i used to know you so well',
    url: 'https://soundcloud.com/kashii-981036167/unknownsourcexddddddd',
    artwork: 'https://i1.sndcdn.com/artworks-i2W8cEYX906SQrDZ-KkvQvw-t500x500.jpg',
    releaseDate: '21 Dec 2025',
    year: '2025',
    genre: 'Dance & EDM',
    format: 'Sample flip',
    note: 'Uses a sample from “Decode” by Paramore.',
    featured: true,
  },
  {
    title: 'i_need_u',
    url: 'https://soundcloud.com/kashii-981036167/i-need-uuuuuuuuuuuuuuuuuu',
    artwork: 'https://i1.sndcdn.com/artworks-WzIdzgS5A1AlSqtA-7gFbjw-t500x500.png',
    releaseDate: '14 Dec 2025',
    year: '2025',
    genre: 'Dance & EDM',
    format: 'Original',
    note: 'A Frums-inspired track.',
  },
  {
    title: 'leave me hanging',
    url: 'https://soundcloud.com/kashii-981036167/in-the-snow',
    artwork: 'https://i1.sndcdn.com/artworks-cyPp2ISaQWkFQXEi-hvLWXg-t500x500.jpg',
    releaseDate: '08 Oct 2025',
    year: '2025',
    genre: 'Pop',
    format: 'Original',
    note: 'Cover art credited to fin.',
  },
];
