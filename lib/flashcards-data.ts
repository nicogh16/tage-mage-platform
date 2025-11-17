export type FlashcardCategory = 'carres' | 'cubes' | 'nombres_premiers' | 'multiplications' | 'conversions' | 'formules';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: FlashcardCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const FLASHCARD_CATEGORIES = {
  carres: {
    id: 'carres',
    name: 'Carrés (1² à 20²)',
    description: 'Mémorisez les carrés parfaits',
    icon: '²',
  },
  cubes: {
    id: 'cubes',
    name: 'Cubes (1³ à 10³)',
    description: 'Mémorisez les cubes parfaits',
    icon: '³',
  },
  nombres_premiers: {
    id: 'nombres_premiers',
    name: 'Nombres Premiers (jusqu\'à 100)',
    description: 'Reconnaissez rapidement les nombres premiers',
    icon: '🔢',
  },
  multiplications: {
    id: 'multiplications',
    name: 'Tables de Multiplication',
    description: 'Multiplications courantes à connaître',
    icon: '✖️',
  },
  conversions: {
    id: 'conversions',
    name: 'Conversions Utiles',
    description: 'Conversions de mesures et pourcentages',
    icon: '🔄',
  },
  formules: {
    id: 'formules',
    name: 'Formules Mathématiques',
    description: 'Formules essentielles pour le Tage Mage',
    icon: '📐',
  },
} as const;

// Carrés de 1 à 20
export const CARRES: Flashcard[] = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  return {
    id: `carre-${n}`,
    front: `${n}² = ?`,
    back: `${n * n}`,
    category: 'carres',
    difficulty: n <= 10 ? 'easy' : n <= 15 ? 'medium' : 'hard',
  };
});

// Cubes de 1 à 10
export const CUBES: Flashcard[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return {
    id: `cube-${n}`,
    front: `${n}³ = ?`,
    back: `${n * n * n}`,
    category: 'cubes',
    difficulty: n <= 5 ? 'easy' : n <= 7 ? 'medium' : 'hard',
  };
});

// Nombres premiers jusqu'à 100
const NOMBRES_PREMIERS_LIST = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
];

export const NOMBRES_PREMIERS: Flashcard[] = NOMBRES_PREMIERS_LIST.map((n) => ({
  id: `premier-${n}`,
  front: `${n}`,
  back: 'Nombre premier',
  category: 'nombres_premiers',
  difficulty: n <= 20 ? 'easy' : n <= 50 ? 'medium' : 'hard',
}));

// Multiplications courantes
export const MULTIPLICATIONS: Flashcard[] = [
  // Multiplications par 11, 12, 15, 25, etc.
  { id: 'mult-11-11', front: '11 × 11 = ?', back: '121', category: 'multiplications', difficulty: 'easy' },
  { id: 'mult-11-12', front: '11 × 12 = ?', back: '132', category: 'multiplications', difficulty: 'easy' },
  { id: 'mult-12-12', front: '12 × 12 = ?', back: '144', category: 'multiplications', difficulty: 'easy' },
  { id: 'mult-13-13', front: '13 × 13 = ?', back: '169', category: 'multiplications', difficulty: 'medium' },
  { id: 'mult-14-14', front: '14 × 14 = ?', back: '196', category: 'multiplications', difficulty: 'medium' },
  { id: 'mult-15-15', front: '15 × 15 = ?', back: '225', category: 'multiplications', difficulty: 'easy' },
  { id: 'mult-16-16', front: '16 × 16 = ?', back: '256', category: 'multiplications', difficulty: 'medium' },
  { id: 'mult-17-17', front: '17 × 17 = ?', back: '289', category: 'multiplications', difficulty: 'hard' },
  { id: 'mult-18-18', front: '18 × 18 = ?', back: '324', category: 'multiplications', difficulty: 'hard' },
  { id: 'mult-19-19', front: '19 × 19 = ?', back: '361', category: 'multiplications', difficulty: 'hard' },
  { id: 'mult-20-20', front: '20 × 20 = ?', back: '400', category: 'multiplications', difficulty: 'easy' },
  { id: 'mult-25-25', front: '25 × 25 = ?', back: '625', category: 'multiplications', difficulty: 'medium' },
  { id: 'mult-30-30', front: '30 × 30 = ?', back: '900', category: 'multiplications', difficulty: 'easy' },
  { id: 'mult-50-50', front: '50 × 50 = ?', back: '2500', category: 'multiplications', difficulty: 'easy' },
  { id: 'mult-100-100', front: '100 × 100 = ?', back: '10000', category: 'multiplications', difficulty: 'easy' },
];

// Conversions utiles
export const CONVERSIONS: Flashcard[] = [
  { id: 'conv-1km', front: '1 km = ? m', back: '1000 m', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1m', front: '1 m = ? cm', back: '100 cm', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1cm', front: '1 cm = ? mm', back: '10 mm', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1kg', front: '1 kg = ? g', back: '1000 g', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1L', front: '1 L = ? mL', back: '1000 mL', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1h', front: '1 h = ? min', back: '60 min', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1min', front: '1 min = ? s', back: '60 s', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1jour', front: '1 jour = ? h', back: '24 h', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1semaine', front: '1 semaine = ? jours', back: '7 jours', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1mois', front: '1 mois ≈ ? jours', back: '30 jours', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-1an', front: '1 an = ? jours', back: '365 jours', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-pourcent-1/2', front: '1/2 = ? %', back: '50%', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-pourcent-1/3', front: '1/3 ≈ ? %', back: '33.33%', category: 'conversions', difficulty: 'medium' },
  { id: 'conv-pourcent-1/4', front: '1/4 = ? %', back: '25%', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-pourcent-1/5', front: '1/5 = ? %', back: '20%', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-pourcent-1/10', front: '1/10 = ? %', back: '10%', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-pourcent-3/4', front: '3/4 = ? %', back: '75%', category: 'conversions', difficulty: 'easy' },
  { id: 'conv-pourcent-2/3', front: '2/3 ≈ ? %', back: '66.67%', category: 'conversions', difficulty: 'medium' },
];

// Formules mathématiques essentielles
export const FORMULES: Flashcard[] = [
  { id: 'formule-aire-carre', front: 'Aire d\'un carré', back: 'côté²', category: 'formules', difficulty: 'easy' },
  { id: 'formule-aire-rectangle', front: 'Aire d\'un rectangle', back: 'longueur × largeur', category: 'formules', difficulty: 'easy' },
  { id: 'formule-aire-triangle', front: 'Aire d\'un triangle', back: '(base × hauteur) / 2', category: 'formules', difficulty: 'easy' },
  { id: 'formule-aire-cercle', front: 'Aire d\'un cercle', back: 'π × r²', category: 'formules', difficulty: 'medium' },
  { id: 'formule-perimetre-carre', front: 'Périmètre d\'un carré', back: '4 × côté', category: 'formules', difficulty: 'easy' },
  { id: 'formule-perimetre-rectangle', front: 'Périmètre d\'un rectangle', back: '2 × (L + l)', category: 'formules', difficulty: 'easy' },
  { id: 'formule-perimetre-cercle', front: 'Périmètre d\'un cercle', back: '2 × π × r', category: 'formules', difficulty: 'medium' },
  { id: 'formule-volume-cube', front: 'Volume d\'un cube', back: 'côté³', category: 'formules', difficulty: 'easy' },
  { id: 'formule-volume-pave', front: 'Volume d\'un pavé', back: 'L × l × h', category: 'formules', difficulty: 'easy' },
  { id: 'formule-volume-cylindre', front: 'Volume d\'un cylindre', back: 'π × r² × h', category: 'formules', difficulty: 'medium' },
  { id: 'formule-vitesse', front: 'Vitesse moyenne', back: 'distance / temps', category: 'formules', difficulty: 'easy' },
  { id: 'formule-pourcentage', front: 'Pourcentage', back: '(partie / total) × 100', category: 'formules', difficulty: 'easy' },
  { id: 'formule-pythagore', front: 'Théorème de Pythagore', back: 'a² + b² = c²', category: 'formules', difficulty: 'medium' },
  { id: 'formule-pi', front: 'Valeur de π', back: '≈ 3.14159', category: 'formules', difficulty: 'easy' },
];

// Toutes les flashcards regroupées
export const ALL_FLASHCARDS: Flashcard[] = [
  ...CARRES,
  ...CUBES,
  ...NOMBRES_PREMIERS,
  ...MULTIPLICATIONS,
  ...CONVERSIONS,
  ...FORMULES,
];

// Obtenir les flashcards par catégorie
export function getFlashcardsByCategory(category: FlashcardCategory): Flashcard[] {
  return ALL_FLASHCARDS.filter((card) => card.category === category);
}

// Mélanger un tableau (algorithme Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

