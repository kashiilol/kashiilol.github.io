export interface Service {
  id: string;
  name: string;
  price: string;
  summary: string;
  includes: readonly string[];
}

export const services: readonly Service[] = [
  {
    id: 'beat-licence',
    name: 'Existing beat licence',
    price: '$40',
    summary: 'Licence one of my available beats for your own release.',
    includes: ['WAV instrumental', 'Non-exclusive licence', 'Clear credit and usage terms'],
  },
  {
    id: 'custom-beat',
    name: 'Custom beat',
    price: '$120',
    summary: 'A new EDM or pop instrumental made around your references and direction.',
    includes: ['Arrangement and sound design', 'One revision', 'WAV + stems'],
  },
  {
    id: 'mixing',
    name: 'Mixing',
    price: '$80',
    summary: 'Send me your stems and I’ll turn them into a cleaner, more balanced mix.',
    includes: ['Levels, EQ and compression', 'Basic stereo master', 'One revision'],
  },
  {
    id: 'full-production',
    name: 'Full song production',
    price: '$250',
    summary: 'Turn a voice memo, demo or vocal recording into a complete EDM or pop track.',
    includes: ['Production and arrangement', 'Mixing + basic master', 'Two revisions + WAV and stems'],
  },
];
