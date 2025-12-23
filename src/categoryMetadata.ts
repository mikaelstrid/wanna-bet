import type { QuestionCategory, CategoryInfo } from './types';

export const categoryMetadata: Record<QuestionCategory, CategoryInfo> = {
  'geography': {
    name: 'Geografi & Världen',
    emoji: '🌍',
    description: 'Länder, huvudstäder, kartor, naturfenomen, kulturgeografi.'
  },
  'history-and-society': {
    name: 'Historia & Samhälle',
    emoji: '🕰️',
    description: 'Epoker, revolutioner, viktiga personer, samhällsutveckling, arkeologi.'
  },
  'popculture': {
    name: 'Popkultur & Underhållning',
    emoji: '🎬',
    description: 'Film, musik, tv-serier, kändisar, spel, internetkultur.'
  },
  'nature-science': {
    name: 'Naturvetenskap',
    emoji: '🔬',
    description: 'Biologi, fysik, kemi, medicin, rymden.'
  },
  'technology-and-innovation': {
    name: 'Teknik & Innovation',
    emoji: '💡',
    description: 'Datorer, AI, uppfinningar, ingenjörskonst, modern teknik.'
  },
  'trivia': {
    name: 'Allmänbildning & Trivia',
    emoji: '🧠',
    description: 'Språk, ordkunskap, kuriosa, märkliga fakta, rekord.'
  },
  'sports-and-leisure': {
    name: 'Sport & Fritid',
    emoji: '⚽',
    description: 'Sportgrenar, OS, idrottsprofiler, hobbyer, friluftsliv.'
  },
  'food-drinks-culture': {
    name: 'Mat, Dryck & Kultur',
    emoji: '🍽️',
    description: 'Kökskunskap, matkulturer, drycker, traditioner.'
  },
  'nature': {
    name: 'Djur & Natur',
    emoji: '🐾',
    description: 'Ekologi, arter, naturreservat, klimat, växter.'
  },
  'logic-and-puzzles': {
    name: 'Logik, Pussel & Hjärngympa',
    emoji: '🧩',
    description: 'Gåtor, mönster, problemlösning, matematiska klurigheter.'
  }
};
