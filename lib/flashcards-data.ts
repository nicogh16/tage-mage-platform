export type FlashcardCategory = 
  | 'carres' 
  | 'cubes' 
  | 'nombres_premiers' 
  | 'formules' 
  | 'divisibilite'
  | 'calcul_mental'
  | 'raisonnement_logique'
  | 'expression'
  | 'comprehension_textes'
  | 'conditions_minimales'
  | 'resolution_problemes';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: FlashcardCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  examples?: string[]; // Exemples à afficher sous la réponse
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
    description: 'Reconnaissez et trouvez les nombres premiers',
    icon: '🔢',
  },
  formules: {
    id: 'formules',
    name: 'Formules Mathématiques',
    description: 'Formules essentielles pour le Tage Mage',
    icon: '📐',
  },
  divisibilite: {
    id: 'divisibilite',
    name: 'Critères de Divisibilité (1 à 15)',
    description: 'Règles pour déterminer si un nombre est divisible',
    icon: '➗',
  },
  calcul_mental: {
    id: 'calcul_mental',
    name: 'Calcul Mental',
    description: 'Astuces et techniques de calcul rapide',
    icon: '🧮',
  },
  raisonnement_logique: {
    id: 'raisonnement_logique',
    name: 'Raisonnement Logique',
    description: 'Règles de logique et déduction',
    icon: '🧩',
  },
  expression: {
    id: 'expression',
    name: 'Expression',
    description: 'Règles de grammaire et vocabulaire',
    icon: '📝',
  },
  comprehension_textes: {
    id: 'comprehension_textes',
    name: 'Compréhension de Textes',
    description: 'Techniques de lecture et analyse',
    icon: '📖',
  },
  conditions_minimales: {
    id: 'conditions_minimales',
    name: 'Conditions Minimales',
    description: 'Logique des conditions nécessaires et suffisantes',
    icon: '⚡',
  },
  resolution_problemes: {
    id: 'resolution_problemes',
    name: 'Résolution de Problèmes',
    description: 'Méthodes et stratégies de résolution',
    icon: '💡',
  },
} as const;

// Carrés de 1 à 20 - Cartes bidirectionnelles
export const CARRES: Flashcard[] = (() => {
  const cards: Flashcard[] = [];
  for (let n = 1; n <= 20; n++) {
    const square = n * n;
    // Carte 1: n² = ?
    cards.push({
      id: `carre-${n}-forward`,
      front: `${n}² = ?`,
      back: `${square}`,
      category: 'carres',
      difficulty: n <= 10 ? 'easy' : n <= 15 ? 'medium' : 'hard',
    });
    // Carte 2: ?² = square
    cards.push({
      id: `carre-${n}-reverse`,
      front: `?² = ${square}`,
      back: `${n}`,
      category: 'carres',
      difficulty: n <= 10 ? 'easy' : n <= 15 ? 'medium' : 'hard',
    });
  }
  return cards;
})();

// Cubes de 1 à 10 - Cartes bidirectionnelles
export const CUBES: Flashcard[] = (() => {
  const cards: Flashcard[] = [];
  for (let n = 1; n <= 10; n++) {
    const cube = n * n * n;
    // Carte 1: n³ = ?
    cards.push({
      id: `cube-${n}-forward`,
      front: `${n}³ = ?`,
      back: `${cube}`,
      category: 'cubes',
      difficulty: n <= 5 ? 'easy' : n <= 7 ? 'medium' : 'hard',
    });
    // Carte 2: ?³ = cube
    cards.push({
      id: `cube-${n}-reverse`,
      front: `?³ = ${cube}`,
      back: `${n}`,
      category: 'cubes',
      difficulty: n <= 5 ? 'easy' : n <= 7 ? 'medium' : 'hard',
    });
  }
  return cards;
})();

// Nombres premiers jusqu'à 100 - Cartes bidirectionnelles
const NOMBRES_PREMIERS_LIST = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
];

// Nombres non-premiers pour les exemples (tous les nombres de 1 à 100 qui ne sont pas premiers)
const NOMBRES_NON_PREMIERS = [1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 60, 62, 63, 64, 65, 66, 68, 69, 70, 72, 74, 75, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100];

// Fonction pour trouver les diviseurs d'un nombre
function findDivisors(n: number): number[] {
  const divisors = [];
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      divisors.push(i);
      if (divisors.length >= 3) break; // Limiter à 3 diviseurs pour la lisibilité
    }
  }
  return divisors;
}

// Fonction pour trouver le nombre premier précédent
function findPreviousPrime(n: number): number | null {
  for (let i = n - 1; i >= 2; i--) {
    if (NOMBRES_PREMIERS_LIST.includes(i)) {
      return i;
    }
  }
  return null;
}

// Fonction pour trouver le nombre premier suivant
function findNextPrime(n: number): number | null {
  for (let i = n + 1; i <= 100; i++) {
    if (NOMBRES_PREMIERS_LIST.includes(i)) {
      return i;
    }
  }
  return null;
}

export const NOMBRES_PREMIERS: Flashcard[] = (() => {
  const cards: Flashcard[] = [];
  
  // Cartes interactives : "Quel est le nombre premier après X ?" (seulement les plus importants)
  const importantPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89];
  
  importantPrimes.forEach((prime) => {
    const next = findNextPrime(prime);
    if (next !== null) {
      cards.push({
        id: `premier-after-${prime}`,
        front: `Quel est le nombre premier après ${prime} ?`,
        back: `${next}`,
        category: 'nombres_premiers',
        difficulty: prime <= 20 ? 'easy' : prime <= 50 ? 'medium' : 'hard',
        examples: [
          `Le nombre premier suivant ${prime} est ${next}`,
          `Séquence : ... ${prime} → ${next} ...`,
        ],
      });
    }
  });
  
  // Quelques cartes "nombre premier avant" pour les plus importants
  const importantPrimesForBefore = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  
  importantPrimesForBefore.forEach((prime) => {
    const previous = findPreviousPrime(prime);
    if (previous !== null) {
      cards.push({
        id: `premier-before-${prime}`,
        front: `Quel est le nombre premier avant ${prime} ?`,
        back: `${previous}`,
        category: 'nombres_premiers',
        difficulty: prime <= 20 ? 'easy' : prime <= 50 ? 'medium' : 'hard',
        examples: [
          `Le nombre premier précédent ${prime} est ${previous}`,
          `Séquence : ... ${previous} → ${prime} ...`,
        ],
      });
    }
  });
  
  // TECHNIQUES DE MÉMORISATION - Cartes d'aide à l'apprentissage
  
  // 1. Les 4 premiers (à retenir par cœur)
  cards.push({
    id: 'premier-memo-4-premiers',
    front: 'Quels sont les 4 premiers nombres premiers ?',
    back: '2, 3, 5, 7',
    category: 'nombres_premiers',
    difficulty: 'easy',
    examples: [
      'Astuce : "2, 3, 5, 7" - facile à retenir !',
      'Ce sont les seuls nombres premiers à un chiffre',
      'Mémorisez-les par cœur : 2, 3, 5, 7',
    ],
  });
  
  // 2. Pattern : Les nombres premiers se terminent par 1, 3, 7 ou 9 (sauf 2 et 5)
  cards.push({
    id: 'premier-memo-pattern-unites',
    front: 'Par quels chiffres se terminent les nombres premiers (sauf 2 et 5) ?',
    back: '1, 3, 7 ou 9',
    category: 'nombres_premiers',
    difficulty: 'easy',
    examples: [
      'Les nombres premiers > 5 se terminent toujours par 1, 3, 7 ou 9',
      'Exemples : 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...',
      'Astuce : "1, 3, 7, 9" - les impairs sauf 5',
    ],
  });
  
  // 3. Par dizaines (10-19)
  cards.push({
    id: 'premier-memo-10-19',
    front: 'Quels sont les nombres premiers entre 10 et 19 ?',
    back: '11, 13, 17, 19',
    category: 'nombres_premiers',
    difficulty: 'easy',
    examples: [
      'Astuce : "11, 13, 17, 19" - tous se terminent par 1, 3, 7, 9',
      'Ce sont les 4 nombres premiers de la dizaine 10-19',
      'Mémorisez : 11, 13, 17, 19 (4 nombres)',
    ],
  });
  
  // 4. Par dizaines (20-29)
  cards.push({
    id: 'premier-memo-20-29',
    front: 'Quels sont les nombres premiers entre 20 et 29 ?',
    back: '23, 29',
    category: 'nombres_premiers',
    difficulty: 'easy',
    examples: [
      'Astuce : "23, 29" - seulement 2 nombres premiers',
      '21, 25, 27 ne sont pas premiers (divisibles par 3, 5, 3)',
      'Mémorisez : 23, 29 (2 nombres)',
    ],
  });
  
  // 5. Par dizaines (30-39)
  cards.push({
    id: 'premier-memo-30-39',
    front: 'Quels sont les nombres premiers entre 30 et 39 ?',
    back: '31, 37',
    category: 'nombres_premiers',
    difficulty: 'easy',
    examples: [
      'Astuce : "31, 37" - seulement 2 nombres premiers',
      '33, 35, 39 ne sont pas premiers (divisibles par 3, 5, 3)',
      'Mémorisez : 31, 37 (2 nombres)',
    ],
  });
  
  // 6. Par dizaines (40-49)
  cards.push({
    id: 'premier-memo-40-49',
    front: 'Quels sont les nombres premiers entre 40 et 49 ?',
    back: '41, 43, 47',
    category: 'nombres_premiers',
    difficulty: 'medium',
    examples: [
      'Astuce : "41, 43, 47" - 3 nombres premiers consécutifs',
      'Tous se terminent par 1, 3, 7',
      'Mémorisez : 41, 43, 47 (3 nombres)',
    ],
  });
  
  // 7. Par dizaines (50-59)
  cards.push({
    id: 'premier-memo-50-59',
    front: 'Quels sont les nombres premiers entre 50 et 59 ?',
    back: '53, 59',
    category: 'nombres_premiers',
    difficulty: 'medium',
    examples: [
      'Astuce : "53, 59" - seulement 2 nombres premiers',
      '51, 55, 57 ne sont pas premiers (divisibles par 3, 5, 3)',
      'Mémorisez : 53, 59 (2 nombres)',
    ],
  });
  
  // 8. Par dizaines (60-69)
  cards.push({
    id: 'premier-memo-60-69',
    front: 'Quels sont les nombres premiers entre 60 et 69 ?',
    back: '61, 67',
    category: 'nombres_premiers',
    difficulty: 'medium',
    examples: [
      'Astuce : "61, 67" - seulement 2 nombres premiers',
      '63, 65, 69 ne sont pas premiers (divisibles par 3, 5, 3)',
      'Mémorisez : 61, 67 (2 nombres)',
    ],
  });
  
  // 9. Par dizaines (70-79)
  cards.push({
    id: 'premier-memo-70-79',
    front: 'Quels sont les nombres premiers entre 70 et 79 ?',
    back: '71, 73, 79',
    category: 'nombres_premiers',
    difficulty: 'medium',
    examples: [
      'Astuce : "71, 73, 79" - 3 nombres premiers',
      'Tous se terminent par 1, 3, 9',
      'Mémorisez : 71, 73, 79 (3 nombres)',
    ],
  });
  
  // 10. Par dizaines (80-89)
  cards.push({
    id: 'premier-memo-80-89',
    front: 'Quels sont les nombres premiers entre 80 et 89 ?',
    back: '83, 89',
    category: 'nombres_premiers',
    difficulty: 'medium',
    examples: [
      'Astuce : "83, 89" - seulement 2 nombres premiers',
      '81, 85, 87 ne sont pas premiers (divisibles par 3, 5, 3)',
      'Mémorisez : 83, 89 (2 nombres)',
    ],
  });
  
  // 11. Par dizaines (90-100)
  cards.push({
    id: 'premier-memo-90-100',
    front: 'Quels sont les nombres premiers entre 90 et 100 ?',
    back: '97',
    category: 'nombres_premiers',
    difficulty: 'medium',
    examples: [
      'Astuce : "97" - seulement 1 nombre premier',
      '91, 93, 95, 99 ne sont pas premiers (divisibles par 7, 3, 5, 3)',
      'Mémorisez : 97 (1 seul nombre)',
    ],
  });
  
  // 12. Technique : Compter par groupes
  cards.push({
    id: 'premier-memo-comptage',
    front: 'Combien y a-t-il de nombres premiers jusqu\'à 100 ?',
    back: '25 nombres premiers',
    category: 'nombres_premiers',
    difficulty: 'easy',
    examples: [
      'Répartition : 1-10: 4 | 11-20: 4 | 21-30: 2 | 31-40: 2 | 41-50: 3',
      '51-60: 2 | 61-70: 2 | 71-80: 3 | 81-90: 2 | 91-100: 1',
      'Total : 4+4+2+2+3+2+2+3+2+1 = 25',
    ],
  });
  
  // 13. Technique : Les jumeaux (nombres premiers qui diffèrent de 2)
  cards.push({
    id: 'premier-memo-jumeaux',
    front: 'Quels sont les paires de nombres premiers jumeaux jusqu\'à 100 ?',
    back: '(3,5), (5,7), (11,13), (17,19), (29,31), (41,43), (59,61), (71,73)',
    category: 'nombres_premiers',
    difficulty: 'hard',
    examples: [
      'Nombres premiers jumeaux : différence de 2',
      'Exemples : 3 et 5, 11 et 13, 17 et 19...',
      'Astuce : Les jumeaux aident à mémoriser par paires',
    ],
  });
  
  // 14. Technique : Les nombres premiers seuls (sans jumeau proche)
  cards.push({
    id: 'premier-memo-seuls',
    front: 'Quels nombres premiers n\'ont pas de jumeau proche (différence > 2) ?',
    back: '2, 23, 37, 47, 53, 67, 79, 83, 89, 97',
    category: 'nombres_premiers',
    difficulty: 'hard',
    examples: [
      'Ces nombres premiers sont "isolés"',
      'Ils aident à structurer la liste',
      'Mémorisez-les séparément',
    ],
  });
  
  // 15. Technique : Récapitulatif par dizaines
  cards.push({
    id: 'premier-memo-recap',
    front: 'Récapitulatif : Combien de nombres premiers par dizaine ?',
    back: '0-9: 4 | 10-19: 4 | 20-29: 2 | 30-39: 2 | 40-49: 3 | 50-59: 2 | 60-69: 2 | 70-79: 3 | 80-89: 2 | 90-99: 1',
    category: 'nombres_premiers',
    difficulty: 'medium',
    examples: [
      'Pattern : 4, 4, 2, 2, 3, 2, 2, 3, 2, 1',
      'Les dizaines avec 4 : 0-9, 10-19',
      'Les dizaines avec 3 : 40-49, 70-79',
    ],
  });
  
  return cards;
})();


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

// Critères de divisibilité de 1 à 15
export const DIVISIBILITE: Flashcard[] = [
  { 
    id: 'div-1', 
    front: 'Divisible par 1', 
    back: 'Tous les nombres sont divisibles par 1', 
    category: 'divisibilite', 
    difficulty: 'easy',
    examples: ['123 est divisible par 1', '456 est divisible par 1', 'Tout nombre est divisible par 1']
  },
  { 
    id: 'div-2', 
    front: 'Divisible par 2', 
    back: 'Le chiffre des unités est pair (0, 2, 4, 6, 8)', 
    category: 'divisibilite', 
    difficulty: 'easy',
    examples: ['24 → unités = 4 (pair) ✓', '135 → unités = 5 (impair) ✗', '108 → unités = 8 (pair) ✓']
  },
  { 
    id: 'div-3', 
    front: 'Divisible par 3', 
    back: 'La somme des chiffres est divisible par 3', 
    category: 'divisibilite', 
    difficulty: 'medium',
    examples: ['123 → 1+2+3 = 6 (divisible par 3) ✓', '145 → 1+4+5 = 10 (non divisible par 3) ✗', '789 → 7+8+9 = 24 (divisible par 3) ✓']
  },
  { 
    id: 'div-4', 
    front: 'Divisible par 4', 
    back: 'Les deux derniers chiffres forment un nombre divisible par 4', 
    category: 'divisibilite', 
    difficulty: 'medium',
    examples: ['124 → 24 est divisible par 4 ✓', '135 → 35 n\'est pas divisible par 4 ✗', '108 → 08 = 8, divisible par 4 ✓']
  },
  { 
    id: 'div-5', 
    front: 'Divisible par 5', 
    back: 'Le chiffre des unités est 0 ou 5', 
    category: 'divisibilite', 
    difficulty: 'easy',
    examples: ['125 → unités = 5 ✓', '130 → unités = 0 ✓', '123 → unités = 3 ✗']
  },
  { 
    id: 'div-6', 
    front: 'Divisible par 6', 
    back: 'Divisible par 2 ET par 3', 
    category: 'divisibilite', 
    difficulty: 'medium',
    examples: ['24 → pair (2) ✓ et 2+4=6 (3) ✓ → divisible par 6', '135 → impair ✗', '126 → pair (2) ✓ et 1+2+6=9 (3) ✓ → divisible par 6']
  },
  { 
    id: 'div-7', 
    front: 'Divisible par 7', 
    back: 'Prendre le dernier chiffre, le multiplier par 2, soustraire du nombre formé par les autres chiffres. Si le résultat est divisible par 7, alors le nombre initial aussi', 
    category: 'divisibilite', 
    difficulty: 'hard',
    examples: ['91 → 9 - (1×2) = 7 (divisible par 7) ✓', '84 → 8 - (4×2) = 0 (divisible par 7) ✓', '85 → 8 - (5×2) = -2 (non divisible par 7) ✗']
  },
  { 
    id: 'div-8', 
    front: 'Divisible par 8', 
    back: 'Les trois derniers chiffres forment un nombre divisible par 8', 
    category: 'divisibilite', 
    difficulty: 'hard',
    examples: ['1240 → 240 est divisible par 8 ✓', '1352 → 352 est divisible par 8 ✓', '1234 → 234 n\'est pas divisible par 8 ✗']
  },
  { 
    id: 'div-9', 
    front: 'Divisible par 9', 
    back: 'La somme des chiffres est divisible par 9', 
    category: 'divisibilite', 
    difficulty: 'medium',
    examples: ['126 → 1+2+6 = 9 (divisible par 9) ✓', '135 → 1+3+5 = 9 (divisible par 9) ✓', '145 → 1+4+5 = 10 (non divisible par 9) ✗']
  },
  { 
    id: 'div-10', 
    front: 'Divisible par 10', 
    back: 'Le chiffre des unités est 0', 
    category: 'divisibilite', 
    difficulty: 'easy',
    examples: ['120 → unités = 0 ✓', '135 → unités = 5 ✗', '1000 → unités = 0 ✓']
  },
  { 
    id: 'div-11', 
    front: 'Divisible par 11', 
    back: 'La différence entre la somme des chiffres en position impaire et la somme des chiffres en position paire est divisible par 11', 
    category: 'divisibilite', 
    difficulty: 'hard',
    examples: ['121 → (1+1) - 2 = 0 (divisible par 11) ✓', '132 → (1+2) - 3 = 0 (divisible par 11) ✓', '123 → (1+3) - 2 = 2 (non divisible par 11) ✗']
  },
  { 
    id: 'div-12', 
    front: 'Divisible par 12', 
    back: 'Divisible par 3 ET par 4', 
    category: 'divisibilite', 
    difficulty: 'medium',
    examples: ['144 → 1+4+4=9 (3) ✓ et 44 divisible par 4 ✓ → divisible par 12', '135 → 1+3+5=9 (3) ✓ mais 35 non divisible par 4 ✗', '156 → 1+5+6=12 (3) ✓ et 56 divisible par 4 ✓ → divisible par 12']
  },
  { 
    id: 'div-13', 
    front: 'Divisible par 13', 
    back: 'Prendre le dernier chiffre, le multiplier par 4, ajouter au nombre formé par les autres chiffres. Si le résultat est divisible par 13, alors le nombre initial aussi', 
    category: 'divisibilite', 
    difficulty: 'hard',
    examples: ['91 → 9 + (1×4) = 13 (divisible par 13) ✓', '104 → 10 + (4×4) = 26 (divisible par 13) ✓', '105 → 10 + (5×4) = 30 (non divisible par 13) ✗']
  },
  { 
    id: 'div-14', 
    front: 'Divisible par 14', 
    back: 'Divisible par 2 ET par 7', 
    category: 'divisibilite', 
    difficulty: 'hard',
    examples: ['28 → pair (2) ✓ et 2 - (8×2) = -14 (divisible par 7) ✓ → divisible par 14', '35 → impair ✗', '42 → pair (2) ✓ et 4 - (2×2) = 0 (divisible par 7) ✓ → divisible par 14']
  },
  { 
    id: 'div-15', 
    front: 'Divisible par 15', 
    back: 'Divisible par 3 ET par 5', 
    category: 'divisibilite', 
    difficulty: 'medium',
    examples: ['135 → 1+3+5=9 (3) ✓ et unités=5 (5) ✓ → divisible par 15', '120 → 1+2+0=3 (3) ✓ et unités=0 (5) ✓ → divisible par 15', '125 → unités=5 (5) ✓ mais 1+2+5=8 (non divisible par 3) ✗']
  },
];

// CALCUL MENTAL - Astuces et techniques
export const CALCUL_MENTAL: Flashcard[] = [
  {
    id: 'calc-mult-11',
    front: 'Comment multiplier rapidement par 11 ?',
    back: 'Ajouter les chiffres adjacents (ex: 23×11 = 2|(2+3)|3 = 253)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['23×11 : 2|(2+3)|3 = 253', '45×11 : 4|(4+5)|5 = 495', 'Si somme > 9, reporter la retenue'],
  },
  {
    id: 'calc-mult-5',
    front: 'Comment multiplier rapidement par 5 ?',
    back: 'Diviser par 2 puis multiplier par 10 (ou ajouter un 0 et diviser par 2)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['24×5 = 24÷2×10 = 120', '37×5 = 37÷2×10 = 185', 'Astuce : ×5 = ×10÷2'],
  },
  {
    id: 'calc-mult-25',
    front: 'Comment multiplier rapidement par 25 ?',
    back: 'Diviser par 4 puis multiplier par 100',
    category: 'calcul_mental',
    difficulty: 'medium',
    examples: ['28×25 = 28÷4×100 = 700', '44×25 = 44÷4×100 = 1100', 'Astuce : ×25 = ×100÷4'],
  },
  {
    id: 'calc-mult-9',
    front: 'Comment multiplier rapidement par 9 ?',
    back: 'Multiplier par 10 puis soustraire le nombre (n×9 = n×10 - n)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['7×9 = 7×10 - 7 = 63', '13×9 = 13×10 - 13 = 117', 'Astuce : ×9 = ×10 - nombre'],
  },
  {
    id: 'calc-pourcentage-10',
    front: 'Comment calculer 10% d\'un nombre ?',
    back: 'Déplacer la virgule d\'un rang vers la gauche (ou diviser par 10)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['10% de 250 = 25', '10% de 48 = 4.8', '10% de 1200 = 120'],
  },
  {
    id: 'calc-pourcentage-50',
    front: 'Comment calculer 50% d\'un nombre ?',
    back: 'Diviser par 2',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['50% de 240 = 120', '50% de 75 = 37.5', '50% = la moitié'],
  },
  {
    id: 'calc-pourcentage-25',
    front: 'Comment calculer 25% d\'un nombre ?',
    back: 'Diviser par 4 (ou prendre la moitié de la moitié)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['25% de 200 = 50', '25% de 120 = 30', '25% = un quart'],
  },
  {
    id: 'calc-pourcentage-75',
    front: 'Comment calculer 75% d\'un nombre ?',
    back: 'Multiplier par 3 puis diviser par 4 (ou 50% + 25%)',
    category: 'calcul_mental',
    difficulty: 'medium',
    examples: ['75% de 200 = 150', '75% de 80 = 60', '75% = trois quarts'],
  },
  {
    id: 'calc-pourcentage-20',
    front: 'Comment calculer 20% d\'un nombre ?',
    back: 'Diviser par 5 (ou prendre 10% puis multiplier par 2)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['20% de 150 = 30', '20% de 75 = 15', '20% = un cinquième'],
  },
  {
    id: 'calc-addition-astuce',
    front: 'Astuce pour additionner rapidement ?',
    back: 'Arrondir puis ajuster (ex: 48+37 = 50+35 = 85)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['48+37 = (48+2)+(37-2) = 50+35 = 85', 'Utiliser les compléments à 10', 'Grouper les nombres faciles'],
  },
  {
    id: 'calc-soustraction-astuce',
    front: 'Astuce pour soustraire rapidement ?',
    back: 'Arrondir le nombre à soustraire (ex: 73-28 = 73-30+2 = 45)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['73-28 = 73-30+2 = 45', 'Utiliser les compléments', 'Soustraire par parties'],
  },
  {
    id: 'calc-division-astuce',
    front: 'Comment diviser rapidement par 4 ?',
    back: 'Diviser par 2 deux fois',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['84÷4 = 84÷2÷2 = 42÷2 = 21', '120÷4 = 120÷2÷2 = 60÷2 = 30', '÷4 = ÷2÷2'],
  },
  {
    id: 'calc-division-8',
    front: 'Comment diviser rapidement par 8 ?',
    back: 'Diviser par 2 trois fois',
    category: 'calcul_mental',
    difficulty: 'medium',
    examples: ['64÷8 = 64÷2÷2÷2 = 32÷2÷2 = 16÷2 = 8', '÷8 = ÷2÷2÷2'],
  },
  {
    id: 'calc-racine-carree-approche',
    front: 'Comment estimer rapidement une racine carrée ?',
    back: 'Trouver le carré parfait le plus proche (ex: √50 ≈ 7 car 7²=49)',
    category: 'calcul_mental',
    difficulty: 'hard',
    examples: ['√50 ≈ 7 (car 7²=49)', '√80 ≈ 9 (car 9²=81)', 'Utiliser les carrés connus'],
  },
  {
    id: 'calc-mult-15',
    front: 'Comment multiplier rapidement par 15 ?',
    back: 'Multiplier par 10 puis ajouter la moitié (n×15 = n×10 + n×5)',
    category: 'calcul_mental',
    difficulty: 'medium',
    examples: ['24×15 = 24×10 + 24×5 = 240 + 120 = 360', 'Astuce : ×15 = ×10 + ×5'],
  },
  {
    id: 'calc-fraction-pourcentage',
    front: 'Fractions courantes en pourcentage ?',
    back: '1/2=50% | 1/3≈33% | 1/4=25% | 1/5=20% | 1/10=10% | 3/4=75% | 2/3≈67%',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['1/2 = 50%', '1/4 = 25%', '3/4 = 75%'],
  },
];

// RAISONNEMENT LOGIQUE - Règles et techniques
export const RAISONNEMENT_LOGIQUE: Flashcard[] = [
  {
    id: 'logique-si-alors',
    front: 'Si A alors B. Si B est faux, que peut-on conclure sur A ?',
    back: 'A est faux (contraposée : si non-B alors non-A)',
    category: 'raisonnement_logique',
    difficulty: 'medium',
    examples: ['Si "il pleut" alors "sol mouillé"', 'Si "sol sec" alors "il ne pleut pas"', 'C\'est la contraposée'],
  },
  {
    id: 'logique-si-alors-erreur',
    front: 'Si A alors B. Si B est vrai, que peut-on conclure sur A ?',
    back: 'Rien ! C\'est une erreur classique (affirmation du conséquent)',
    category: 'raisonnement_logique',
    difficulty: 'hard',
    examples: ['Si "il pleut" alors "sol mouillé"', 'Si "sol mouillé", on ne peut pas conclure qu\'il pleut', 'Le sol peut être mouillé pour d\'autres raisons'],
  },
  {
    id: 'logique-et-ou',
    front: 'Différence entre "ET" et "OU" en logique ?',
    back: 'ET = les deux conditions | OU = au moins une condition (inclusif)',
    category: 'raisonnement_logique',
    difficulty: 'easy',
    examples: ['A ET B : les deux doivent être vrais', 'A OU B : au moins un doit être vrai', 'Attention : OU est inclusif (pas exclusif)'],
  },
  {
    id: 'logique-negation-et',
    front: 'La négation de "A ET B" est ?',
    back: 'non-A OU non-B (loi de De Morgan)',
    category: 'raisonnement_logique',
    difficulty: 'hard',
    examples: ['non(A ET B) = non-A OU non-B', 'Exemple : "pas (riche ET célèbre)" = "pauvre OU inconnu"'],
  },
  {
    id: 'logique-negation-ou',
    front: 'La négation de "A OU B" est ?',
    back: 'non-A ET non-B (loi de De Morgan)',
    category: 'raisonnement_logique',
    difficulty: 'hard',
    examples: ['non(A OU B) = non-A ET non-B', 'Exemple : "pas (riche OU célèbre)" = "pauvre ET inconnu"'],
  },
  {
    id: 'logique-necessaire-suffisant',
    front: 'Différence entre condition nécessaire et suffisante ?',
    back: 'Nécessaire : sans elle, impossible | Suffisante : avec elle, garanti',
    category: 'raisonnement_logique',
    difficulty: 'medium',
    examples: ['"Avoir 18 ans" est nécessaire pour voter', '"Être président" est suffisant pour avoir le pouvoir', 'Une condition peut être les deux'],
  },
  {
    id: 'logique-syllogisme',
    front: 'Qu\'est-ce qu\'un syllogisme valide ?',
    back: 'Si A→B et B→C, alors A→C (transitivité)',
    category: 'raisonnement_logique',
    difficulty: 'medium',
    examples: ['Si "tous les chats sont des animaux" et "tous les animaux respirent"', 'Alors "tous les chats respirent"', 'C\'est la transitivité'],
  },
  {
    id: 'logique-contradiction',
    front: 'Si on a "A ET non-A", que peut-on conclure ?',
    back: 'C\'est une contradiction, donc l\'hypothèse de départ est fausse',
    category: 'raisonnement_logique',
    difficulty: 'hard',
    examples: ['Si on arrive à "X est vrai ET X est faux"', 'Alors l\'hypothèse initiale est fausse', 'C\'est la preuve par l\'absurde'],
  },
  {
    id: 'logique-tous-quelques',
    front: 'Différence entre "tous" et "quelques" ?',
    back: '"Tous" = 100% | "Quelques" = au moins un (peut être tous)',
    category: 'raisonnement_logique',
    difficulty: 'easy',
    examples: ['"Tous les X sont Y" = 100%', '"Quelques X sont Y" = au moins 1', '"Quelques" n\'exclut pas "tous"'],
  },
  {
    id: 'logique-aucun',
    front: 'Logique de "aucun" ?',
    back: '"Aucun X n\'est Y" = 0% = tous les X ne sont pas Y',
    category: 'raisonnement_logique',
    difficulty: 'easy',
    examples: ['"Aucun chat n\'est chien" = 0 chat est chien', 'Opposé de "tous"', 'Négation totale'],
  },
];

// EXPRESSION - Grammaire et vocabulaire
export const EXPRESSION: Flashcard[] = [
  {
    id: 'expr-accord-participe',
    front: 'Règle d\'accord du participe passé avec "avoir" ?',
    back: 'S\'accorde avec le COD si placé avant le verbe, sinon invariable',
    category: 'expression',
    difficulty: 'medium',
    examples: ['"Les fleurs que j\'ai cueillies" (COD avant)', '"J\'ai cueilli des fleurs" (COD après)', 'Avec "être" : toujours accordé'],
  },
  {
    id: 'expr-accord-etre',
    front: 'Règle d\'accord du participe passé avec "être" ?',
    back: 'Toujours accordé avec le sujet',
    category: 'expression',
    difficulty: 'easy',
    examples: ['"Elle est partie" (accord avec "elle")', '"Ils sont arrivés" (accord avec "ils")', 'Toujours accordé avec le sujet'],
  },
  {
    id: 'expr-subjonctif',
    front: 'Quand utiliser le subjonctif ?',
    back: 'Après "il faut que", "bien que", "pour que", "avant que", expressions de doute/volonté',
    category: 'expression',
    difficulty: 'hard',
    examples: ['"Il faut que tu viennes" (subjonctif)', '"Bien qu\'il pleuve" (subjonctif)', '"Je doute qu\'il vienne" (subjonctif)'],
  },
  {
    id: 'expr-ces-ses',
    front: 'Différence entre "ces" et "ses" ?',
    back: '"ces" = démonstratif (ces livres) | "ses" = possessif (ses livres)',
    category: 'expression',
    difficulty: 'easy',
    examples: ['"Ces livres" = ces livres-là (démonstratif)', '"Ses livres" = les livres à lui (possessif)', 'Test : remplacer par "les siens"'],
  },
  {
    id: 'expr-a-accents',
    front: 'Quand utiliser "à" vs "a" ?',
    back: '"à" = préposition | "a" = verbe avoir (3e personne)',
    category: 'expression',
    difficulty: 'easy',
    examples: ['"Il va à Paris" (préposition)', '"Il a faim" (verbe avoir)', 'Test : remplacer par "avait"'],
  },
  {
    id: 'expr-ou-ou',
    front: 'Différence entre "ou" et "où" ?',
    back: '"ou" = conjonction (ou bien) | "où" = pronom/adverbe de lieu',
    category: 'expression',
    difficulty: 'easy',
    examples: ['"Tu veux du thé ou du café ?" (conjonction)', '"Où vas-tu ?" (lieu)', 'Test : remplacer par "ou bien"'],
  },
  {
    id: 'expr-accord-nombre',
    front: 'Règle d\'accord avec "la plupart" ?',
    back: 'Accord avec le complément : "la plupart des gens sont" (pluriel)',
    category: 'expression',
    difficulty: 'hard',
    examples: ['"La plupart des gens sont" (accord avec "gens")', '"La plupart du temps est" (accord avec "temps")', 'Accord avec le complément'],
  },
  {
    id: 'expr-accord-collectif',
    front: 'Règle d\'accord avec "une foule de" ?',
    back: 'Accord avec le complément : "une foule de gens sont"',
    category: 'expression',
    difficulty: 'hard',
    examples: ['"Une foule de gens sont" (accord avec "gens")', '"Une foule de spectateurs applaudissent"', 'Accord avec le complément'],
  },
  {
    id: 'expr-accord-tout',
    front: 'Accord de "tout" ?',
    back: '"tout" = invariable sauf devant un nom féminin singulier : "toute la journée"',
    category: 'expression',
    difficulty: 'medium',
    examples: ['"Tout le monde" (masculin, invariable)', '"Toute la journée" (féminin, accordé)', '"Tous les jours" (pluriel, accordé)'],
  },
  {
    id: 'expr-accord-meme',
    front: 'Accord de "même" ?',
    back: '"même" = adjectif (accordé) | "même" = adverbe (invariable)',
    category: 'expression',
    difficulty: 'hard',
    examples: ['"Les mêmes personnes" (adjectif, accordé)', '"Même les enfants" (adverbe, invariable)', 'Test : peut-on le supprimer ?'],
  },
  {
    id: 'expr-accord-avec',
    front: 'Règle d\'accord avec "avec" ?',
    back: 'Avec "avec", l\'accord se fait généralement avec le sujet (pas avec le complément)',
    category: 'expression',
    difficulty: 'hard',
    examples: ['"L\'équipe avec ses supporters est venue" (accord avec "équipe")', 'Exception : si "avec" = "et", accord au pluriel'],
  },
  {
    id: 'expr-accord-demi',
    front: 'Accord de "demi" ?',
    back: '"demi" = invariable avant le nom, accordé après : "une demi-heure" mais "une heure et demie"',
    category: 'expression',
    difficulty: 'medium',
    examples: ['"Une demi-heure" (avant, invariable)', '"Une heure et demie" (après, accordé)', 'Règle : avant = invariable, après = accordé'],
  },
  {
    id: 'expr-accord-quelque',
    front: 'Accord de "quelque" ?',
    back: '"quelque" = invariable devant un nombre | "quelques" = pluriel devant un nom',
    category: 'expression',
    difficulty: 'hard',
    examples: ['"Quelque 200 personnes" (devant nombre, invariable)', '"Quelques personnes" (devant nom, pluriel)'],
  },
];

// COMPRÉHENSION DE TEXTES - Techniques
export const COMPREHENSION_TEXTES: Flashcard[] = [
  {
    id: 'comp-lecture-rapide',
    front: 'Technique de lecture efficace pour le Tage Mage ?',
    back: 'Lire d\'abord les questions, puis le texte en cherchant les réponses',
    category: 'comprehension_textes',
    difficulty: 'easy',
    examples: ['Lire les questions en premier', 'Survoler le texte pour repérer les idées principales', 'Chercher les mots-clés des questions'],
  },
  {
    id: 'comp-idee-principale',
    front: 'Comment identifier l\'idée principale d\'un texte ?',
    back: 'Chercher la thèse centrale, souvent dans l\'introduction ou la conclusion',
    category: 'comprehension_textes',
    difficulty: 'medium',
    examples: ['Lire le premier et dernier paragraphe', 'Identifier le message central', 'Éviter les détails secondaires'],
  },
  {
    id: 'comp-mots-cles',
    front: 'Pourquoi repérer les mots-clés est important ?',
    back: 'Ils indiquent les concepts importants et les relations logiques',
    category: 'comprehension_textes',
    difficulty: 'easy',
    examples: ['Mots de liaison : "mais", "donc", "cependant"', 'Mots de cause : "car", "parce que", "en effet"', 'Mots de conséquence : "ainsi", "donc", "par conséquent"'],
  },
  {
    id: 'comp-ton-auteur',
    front: 'Comment identifier le ton de l\'auteur ?',
    back: 'Analyser les adjectifs, les verbes, et les figures de style utilisées',
    category: 'comprehension_textes',
    difficulty: 'hard',
    examples: ['Ton critique : "prétend", "affirme sans preuve"', 'Ton neutre : faits objectifs', 'Ton élogieux : "remarquable", "exceptionnel"'],
  },
  {
    id: 'comp-inference',
    front: 'Qu\'est-ce qu\'une inférence ?',
    back: 'Conclusion logique déduite du texte sans être explicitement écrite',
    category: 'comprehension_textes',
    difficulty: 'hard',
    examples: ['Si le texte dit "il pleuvait", on infère "le sol était mouillé"', 'Déduire à partir des indices du texte', 'Ne pas inventer, rester fidèle au texte'],
  },
  {
    id: 'comp-contradiction',
    front: 'Comment repérer une contradiction dans un texte ?',
    back: 'Identifier deux affirmations qui s\'excluent mutuellement',
    category: 'comprehension_textes',
    difficulty: 'medium',
    examples: ['"Tous" vs "aucun"', '"Toujours" vs "jamais"', 'Chercher les oppositions logiques'],
  },
  {
    id: 'comp-synonyme-antonyme',
    front: 'Comment identifier synonymes et antonymes dans un texte ?',
    back: 'Synonyme = même sens | Antonyme = sens opposé',
    category: 'comprehension_textes',
    difficulty: 'easy',
    examples: ['Synonymes : "rapide" et "vite"', 'Antonymes : "rapide" et "lent"', 'Aide à comprendre le sens'],
  },
  {
    id: 'comp-structure-texte',
    front: 'Structure classique d\'un texte argumentatif ?',
    back: 'Introduction (thèse) → Développement (arguments) → Conclusion (synthèse)',
    category: 'comprehension_textes',
    difficulty: 'medium',
    examples: ['Introduction : présente la thèse', 'Développement : arguments pour/contre', 'Conclusion : synthèse et ouverture'],
  },
];

// CONDITIONS MINIMALES - Logique
export const CONDITIONS_MINIMALES: Flashcard[] = [
  {
    id: 'cond-necessaire',
    front: 'Qu\'est-ce qu\'une condition nécessaire ?',
    back: 'Condition sans laquelle quelque chose ne peut pas se produire',
    category: 'conditions_minimales',
    difficulty: 'medium',
    examples: ['"Avoir 18 ans" est nécessaire pour voter', 'Sans cette condition, c\'est impossible', 'Mais elle ne garantit pas le résultat'],
  },
  {
    id: 'cond-suffisante',
    front: 'Qu\'est-ce qu\'une condition suffisante ?',
    back: 'Condition qui garantit qu\'un événement se produise',
    category: 'conditions_minimales',
    difficulty: 'medium',
    examples: ['"Être président" est suffisant pour avoir le pouvoir', 'Cette condition garantit le résultat', 'Mais d\'autres conditions peuvent aussi suffire'],
  },
  {
    id: 'cond-necessaire-suffisante',
    front: 'Qu\'est-ce qu\'une condition nécessaire ET suffisante ?',
    back: 'Condition qui est à la fois nécessaire et suffisante (équivalence)',
    category: 'conditions_minimales',
    difficulty: 'hard',
    examples: ['"Être un triangle équilatéral" est nécessaire et suffisant pour "avoir 3 côtés égaux"', 'Si et seulement si', 'Équivalence logique'],
  },
  {
    id: 'cond-erreur-necessaire',
    front: 'Erreur classique : confondre nécessaire et suffisant',
    back: 'Ne pas conclure qu\'une condition suffisante est nécessaire',
    category: 'conditions_minimales',
    difficulty: 'hard',
    examples: ['Si "A suffit pour B", on ne peut pas dire "A est nécessaire"', 'Plusieurs conditions peuvent suffire', 'Attention aux confusions'],
  },
  {
    id: 'cond-tous-sauf',
    front: 'Logique de "tous... sauf" ?',
    back: 'Tous les X sont Y, sauf Z signifie : tous les X sauf Z sont Y',
    category: 'conditions_minimales',
    difficulty: 'medium',
    examples: ['"Tous les jours sauf dimanche" = lundi à samedi', 'Identifier l\'exception', 'Le reste suit la règle générale'],
  },
  {
    id: 'cond-au-moins',
    front: 'Logique de "au moins" ?',
    back: '"Au moins N" signifie "N ou plus" (minimum inclus)',
    category: 'conditions_minimales',
    difficulty: 'easy',
    examples: ['"Au moins 3" = 3, 4, 5, 6...', '"Au moins un" = 1 ou plus', 'Minimum inclus'],
  },
  {
    id: 'cond-au-plus',
    front: 'Logique de "au plus" ?',
    back: '"Au plus N" signifie "N ou moins" (maximum inclus)',
    category: 'conditions_minimales',
    difficulty: 'easy',
    examples: ['"Au plus 5" = 0, 1, 2, 3, 4, 5', '"Au plus un" = 0 ou 1', 'Maximum inclus'],
  },
  {
    id: 'cond-seulement-si',
    front: 'Logique de "seulement si" ?',
    back: '"A seulement si B" = B est nécessaire pour A (équivalent à "si A alors B")',
    category: 'conditions_minimales',
    difficulty: 'hard',
    examples: ['"Tu réussis seulement si tu travailles" = si tu réussis, alors tu travailles', '"Seulement si" = condition nécessaire'],
  },
  {
    id: 'cond-si-et-seulement-si',
    front: 'Logique de "si et seulement si" ?',
    back: '"A si et seulement si B" = A et B sont équivalents (nécessaire ET suffisant)',
    category: 'conditions_minimales',
    difficulty: 'hard',
    examples: ['"X est pair si et seulement si X est divisible par 2"', 'Équivalence logique', 'Les deux conditions sont équivalentes'],
  },
];

// RÉSOLUTION DE PROBLÈMES - Méthodes
export const RESOLUTION_PROBLEMES: Flashcard[] = [
  {
    id: 'resol-etape-1',
    front: 'Première étape pour résoudre un problème ?',
    back: 'Lire attentivement l\'énoncé et identifier les données',
    category: 'resolution_problemes',
    difficulty: 'easy',
    examples: ['Lire plusieurs fois si nécessaire', 'Surligner les informations importantes', 'Identifier ce qui est demandé'],
  },
  {
    id: 'resol-inconnues',
    front: 'Comment identifier les inconnues dans un problème ?',
    back: 'Repérer ce qui est demandé et définir les variables',
    category: 'resolution_problemes',
    difficulty: 'easy',
    examples: ['"Combien coûte..." → inconnue = prix', '"Quel est l\'âge..." → inconnue = âge', 'Définir clairement les variables'],
  },
  {
    id: 'resol-equation',
    front: 'Comment traduire un problème en équation ?',
    back: 'Identifier les relations entre les données et les inconnues',
    category: 'resolution_problemes',
    difficulty: 'medium',
    examples: ['"Le double de X" = 2X', '"X de plus que Y" = X = Y + ...', '"X fois plus que Y" = X = Y × ...'],
  },
  {
    id: 'resol-verification',
    front: 'Pourquoi vérifier la solution est important ?',
    back: 'S\'assurer que la solution répond à toutes les conditions du problème',
    category: 'resolution_problemes',
    difficulty: 'easy',
    examples: ['Vérifier que la solution est logique', 'Replacer dans l\'énoncé', 'Vérifier les contraintes'],
  },
  {
    id: 'resol-proportion',
    front: 'Comment résoudre un problème de proportionnalité ?',
    back: 'Utiliser le produit en croix ou le coefficient de proportionnalité',
    category: 'resolution_problemes',
    difficulty: 'medium',
    examples: ['Si A/B = C/D, alors A×D = B×C', 'Coefficient = résultat / donnée', 'Tableau de proportionnalité'],
  },
  {
    id: 'resol-pourcentage',
    front: 'Comment calculer un pourcentage d\'augmentation ?',
    back: '((Valeur finale - Valeur initiale) / Valeur initiale) × 100',
    category: 'resolution_problemes',
    difficulty: 'medium',
    examples: ['De 100 à 120 : ((120-100)/100)×100 = 20%', 'Augmentation de 20%', 'Formule : (ΔV / V_initial) × 100'],
  },
  {
    id: 'resol-vitesse',
    front: 'Formule de la vitesse moyenne ?',
    back: 'Vitesse = Distance / Temps',
    category: 'resolution_problemes',
    difficulty: 'easy',
    examples: ['V = D / T', 'Distance = Vitesse × Temps', 'Temps = Distance / Vitesse'],
  },
  {
    id: 'resol-pourcentage-inverse',
    front: 'Si un prix augmente de 20%, puis baisse de 20%, retrouve-t-on le prix initial ?',
    back: 'Non ! Le prix final est inférieur (effet de la variation sur une base différente)',
    category: 'resolution_problemes',
    difficulty: 'hard',
    examples: ['100€ + 20% = 120€', '120€ - 20% = 96€ (pas 100€)', 'Les pourcentages ne s\'annulent pas'],
  },
  {
    id: 'resol-partage',
    front: 'Comment partager proportionnellement ?',
    back: 'Calculer le total des parts, puis chaque part = (sa valeur / total) × montant total',
    category: 'resolution_problemes',
    difficulty: 'hard',
    examples: ['Partager 100€ selon 2:3:5', 'Total parts = 2+3+5 = 10', 'Premier : (2/10)×100 = 20€'],
  },
  {
    id: 'resol-pourcentage-variation',
    front: 'Comment calculer une valeur après variation de pourcentage ?',
    back: 'Valeur finale = Valeur initiale × (1 ± pourcentage/100)',
    category: 'resolution_problemes',
    difficulty: 'medium',
    examples: ['100€ + 20% = 100 × 1.20 = 120€', '100€ - 15% = 100 × 0.85 = 85€', 'Formule : V_final = V_initial × (1 ± %)'],
  },
  {
    id: 'resol-moyenne',
    front: 'Comment calculer une moyenne ?',
    back: 'Moyenne = (somme des valeurs) / (nombre de valeurs)',
    category: 'resolution_problemes',
    difficulty: 'easy',
    examples: ['Moyenne de 10, 15, 20 = (10+15+20)/3 = 15', 'Formule : Σ valeurs / n'],
  },
  {
    id: 'resol-pourcentage-retour',
    front: 'Si un prix baisse de X%, de quel % doit-il remonter pour revenir au prix initial ?',
    back: 'Il doit remonter de plus de X% (car la base a changé)',
    category: 'resolution_problemes',
    difficulty: 'hard',
    examples: ['100€ - 20% = 80€', 'Pour revenir à 100€ : (100-80)/80 = 25% (pas 20%)', 'Les pourcentages ne sont pas symétriques'],
  },
];

// FLASHCARDS SUPPLÉMENTAIRES - Exemples concrets de test
export const EXEMPLES_TEST: Flashcard[] = [
  // Calcul Mental - Exemples pratiques
  {
    id: 'test-calc-1',
    front: '47 × 11 = ?',
    back: '517 (4|(4+7)|7 = 4|11|7, retenue → 517)',
    category: 'calcul_mental',
    difficulty: 'medium',
    examples: ['Méthode: Additionner chiffres adjacents', '4+7 = 11, donc retenue', 'Résultat: 517'],
  },
  {
    id: 'test-calc-2',
    front: '15% de 240 = ?',
    back: '36 (10% = 24, 5% = 12, donc 15% = 36)',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['10% de 240 = 24', '5% de 240 = 12', '15% = 10% + 5% = 36'],
  },
  {
    id: 'test-calc-3',
    front: 'Un prix passe de 80€ à 100€. Augmentation en % ?',
    back: '25% ((100-80)/80 × 100 = 20/80 × 100 = 25%)',
    category: 'calcul_mental',
    difficulty: 'medium',
    examples: ['Formule: ((Final - Initial) / Initial) × 100', '((100-80)/80) × 100', '= 20/80 × 100 = 25%'],
  },
  // Raisonnement Logique - Exemples pratiques
  {
    id: 'test-logique-1',
    front: 'Si "A→B" est vrai et B est faux, que peut-on dire de A ?',
    back: 'A est faux (contraposée: si non-B alors non-A)',
    category: 'raisonnement_logique',
    difficulty: 'medium',
    examples: ['Si "il pleut → sol mouillé" et "sol sec"', 'Alors "il ne pleut pas"', 'C\'est la contraposée'],
  },
  {
    id: 'test-logique-2',
    front: 'La négation de "Tous les X sont Y" est ?',
    back: '"Au moins un X n\'est pas Y"',
    category: 'raisonnement_logique',
    difficulty: 'hard',
    examples: ['non(∀x P(x)) = ∃x non-P(x)', 'Exemple: "Tous chats sont noirs" → "Au moins un chat n\'est pas noir"'],
  },
  // Expression - Exemples pratiques
  {
    id: 'test-expr-1',
    front: '"Les fleurs que j\'ai (cueilli/cueillies)" ?',
    back: 'cueillies (COD "que" placé avant → accordé)',
    category: 'expression',
    difficulty: 'medium',
    examples: ['Test: "J\'ai cueilli quoi ?" → "que" (COD avant)', 'Donc accordé avec "fleurs"', 'Règle: COD avant = accordé'],
  },
  {
    id: 'test-expr-2',
    front: '"Il (a/à) besoin d\'aide" ?',
    back: 'a (verbe avoir: "Il avait besoin" ✓)',
    category: 'expression',
    difficulty: 'easy',
    examples: ['Test: Remplacer par "avait"', '"Il avait besoin" ✓ donc "a"', '"Il va à Paris" → "Il va avait Paris" ✗ donc "à"'],
  },
  // Résolution de Problèmes - Exemples pratiques
  {
    id: 'test-resol-1',
    front: 'Partager 120€ selon 1:2:3',
    back: '20€, 40€, 60€ (Total parts = 6, donc 1/6, 2/6, 3/6)',
    category: 'resolution_problemes',
    difficulty: 'medium',
    examples: ['Total parts = 1+2+3 = 6', '1ère: (1/6) × 120 = 20€', '2ème: (2/6) × 120 = 40€', '3ème: (3/6) × 120 = 60€'],
  },
  {
    id: 'test-resol-2',
    front: 'Un train fait 240 km en 2h. Vitesse ?',
    back: '120 km/h (V = D/T = 240/2 = 120)',
    category: 'resolution_problemes',
    difficulty: 'easy',
    examples: ['Formule: Vitesse = Distance / Temps', 'V = 240 / 2', 'V = 120 km/h'],
  },
  {
    id: 'test-resol-3',
    front: 'Si un prix augmente de 10% puis baisse de 10%, retrouve-t-on le prix initial ?',
    back: 'NON (100€ → 110€ → 99€)',
    category: 'resolution_problemes',
    difficulty: 'hard',
    examples: ['100€ + 10% = 110€', '110€ - 10% = 99€', 'Les pourcentages ne s\'annulent pas car la base change'],
  },
];

// FLASHCARDS SUPPLÉMENTAIRES - Concepts essentiels des cheat sheets
export const CONCEPTS_ESSENTIELS: Flashcard[] = [
  // Calcul Mental - Astuces supplémentaires
  {
    id: 'calc-verif-parite',
    front: 'Comment vérifier rapidement un calcul ?',
    back: 'Vérifier la parité (pair/impair) et l\'ordre de grandeur',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['Pair × Pair = Pair', 'Impair × Impair = Impair', 'Vérifier si résultat ≈ 100, 1000, etc.'],
  },
  {
    id: 'calc-eliminer-zeros',
    front: 'Astuce pour simplifier les calculs ?',
    back: 'Éliminer les zéros en fin de calcul',
    category: 'calcul_mental',
    difficulty: 'easy',
    examples: ['1200 × 50 = 12 × 5 × 1000 = 60000', 'Simplifier avant de calculer'],
  },
  // Raisonnement Logique - Concepts avancés
  {
    id: 'logique-table-verite',
    front: 'Table de vérité de "Si P alors Q" (P→Q) ?',
    back: 'V→V=V, V→F=F, F→V=V, F→F=V (Faux seulement si P vrai ET Q faux)',
    category: 'raisonnement_logique',
    difficulty: 'hard',
    examples: ['Si P vrai et Q vrai → Vrai', 'Si P vrai et Q faux → Faux', 'Si P faux → Toujours Vrai'],
  },
  {
    id: 'logique-diagramme-venn',
    front: 'Comment utiliser un diagramme de Venn ?',
    back: 'Dessiner des cercles pour représenter les ensembles, intersection = éléments communs',
    category: 'raisonnement_logique',
    difficulty: 'medium',
    examples: ['Cercle A = étudiants', 'Cercle B = sportifs', 'Intersection = étudiants sportifs'],
  },
  // Expression - Tests pratiques
  {
    id: 'expr-test-a-à',
    front: 'Test pour distinguer "a" et "à" ?',
    back: 'Remplacer par "avait" - si ça marche = "a" (verbe), sinon = "à" (préposition)',
    category: 'expression',
    difficulty: 'easy',
    examples: ['"Il a faim" → "Il avait faim" ✓ = "a"', '"Il va à Paris" → "Il va avait Paris" ✗ = "à"'],
  },
  {
    id: 'expr-test-ou-où',
    front: 'Test pour distinguer "ou" et "où" ?',
    back: 'Remplacer par "ou bien" - si ça marche = "ou" (conjonction), sinon = "où" (lieu)',
    category: 'expression',
    difficulty: 'easy',
    examples: ['"Thé ou café" → "Thé ou bien café" ✓ = "ou"', '"Où vas-tu ?" → "Ou bien vas-tu ?" ✗ = "où"'],
  },
  {
    id: 'expr-test-ces-ses',
    front: 'Test pour distinguer "ces" et "ses" ?',
    back: 'Remplacer par "les siens" - si ça marche = "ses" (possessif), sinon = "ces" (démonstratif)',
    category: 'expression',
    difficulty: 'easy',
    examples: ['"Ses livres" → "les siens" ✓ = "ses"', '"Ces livres" → "les siens" ✗ = "ces"'],
  },
  {
    id: 'expr-cod-avant-apres',
    front: 'Comment savoir si le COD est avant ou après le verbe ?',
    back: 'Poser la question "J\'ai fait QUOI ?" - si la réponse est avant le verbe, accordé',
    category: 'expression',
    difficulty: 'medium',
    examples: ['"J\'ai cueilli des fleurs" → QUOI ? "des fleurs" (après) = invariable', '"Les fleurs que j\'ai cueillies" → QUOI ? "que" (avant) = accordé'],
  },
  // Compréhension de Textes - Méthode
  {
    id: 'comp-methode-lecture',
    front: 'Méthode efficace pour la compréhension de textes ?',
    back: '1. Lire les questions d\'abord (30 sec) 2. Lire le texte 3. Chercher les réponses',
    category: 'comprehension_textes',
    difficulty: 'easy',
    examples: ['Lire les questions en premier oriente la lecture', 'Gain de temps énorme'],
  },
  {
    id: 'comp-idee-principale-ou',
    front: 'Où trouver l\'idée principale d\'un texte ?',
    back: 'Dans l\'introduction (1er paragraphe) OU la conclusion (dernier paragraphe)',
    category: 'comprehension_textes',
    difficulty: 'easy',
    examples: ['Souvent dans le 1er paragraphe', 'Ou dans le dernier paragraphe', 'Éviter les détails du milieu'],
  },
  // Conditions Minimales - Tests
  {
    id: 'cond-test-necessaire',
    front: 'Comment tester si une condition est nécessaire ?',
    back: 'Retirer la condition - si le résultat devient impossible, elle est nécessaire',
    category: 'conditions_minimales',
    difficulty: 'medium',
    examples: ['Retirer "avoir 18 ans" → vote impossible → nécessaire', 'Retirer "être français" → vote impossible → nécessaire'],
  },
  {
    id: 'cond-seulement-si',
    front: '"A seulement si B" signifie ?',
    back: 'B est nécessaire pour A (équivalent à "si A alors B")',
    category: 'conditions_minimales',
    difficulty: 'hard',
    examples: ['"Tu réussis seulement si tu travailles" = si tu réussis alors tu travailles', '"Seulement si" = condition nécessaire'],
  },
  // Résolution de Problèmes - Méthode
  {
    id: 'resol-methode-generale',
    front: 'Méthode générale pour résoudre un problème ?',
    back: '1. Lire 2 fois 2. Identifier données/inconnue 3. Choisir méthode 4. Résoudre 5. Vérifier',
    category: 'resolution_problemes',
    difficulty: 'easy',
    examples: ['Lire 2 fois évite les erreurs', 'Vérifier en replaçant dans l\'énoncé'],
  },
  {
    id: 'resol-pourcentage-piege',
    front: 'Piège classique avec les pourcentages successifs ?',
    back: '100€ + 20% puis -20% ≠ 100€ (120€ - 20% = 96€) - les pourcentages ne s\'annulent pas',
    category: 'resolution_problemes',
    difficulty: 'hard',
    examples: ['100€ + 20% = 120€', '120€ - 20% = 96€ (pas 100€)', 'La base change à chaque fois'],
  },
  {
    id: 'resol-vitesse-moyenne-piege',
    front: 'Piège avec la vitesse moyenne ?',
    back: 'Vitesse moyenne ≠ moyenne des vitesses (Distance totale / Temps total)',
    category: 'resolution_problemes',
    difficulty: 'hard',
    examples: ['60 km en 2h (30 km/h) puis 40 km en 1h (40 km/h)', 'Moyenne des vitesses = 35 km/h ✗', 'Vitesse moyenne = 100 km / 3h = 33.3 km/h ✓'],
  },
];

// Toutes les flashcards regroupées
export const ALL_FLASHCARDS: Flashcard[] = [
  ...CARRES,
  ...CUBES,
  ...NOMBRES_PREMIERS,
  ...FORMULES,
  ...DIVISIBILITE,
  ...CALCUL_MENTAL,
  ...RAISONNEMENT_LOGIQUE,
  ...EXPRESSION,
  ...COMPREHENSION_TEXTES,
  ...CONDITIONS_MINIMALES,
  ...RESOLUTION_PROBLEMES,
  ...EXEMPLES_TEST,
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

