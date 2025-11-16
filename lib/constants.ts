// Tage Mage sections
export const SECTIONS = {
  calcul_mental: {
    id: 'calcul_mental',
    name: 'Calcul Mental',
    color: 'blue',
  },
  raisonnement_logique: {
    id: 'raisonnement_logique',
    name: 'Raisonnement Logique',
    color: 'purple',
  },
  expression: {
    id: 'expression',
    name: 'Expression',
    color: 'green',
  },
  comprehension_textes: {
    id: 'comprehension_textes',
    name: 'Compréhension de Textes',
    color: 'orange',
  },
  conditions_minimales: {
    id: 'conditions_minimales',
    name: 'Conditions Minimales',
    color: 'red',
  },
  resolution_problemes: {
    id: 'resolution_problemes',
    name: 'Résolution de Problèmes',
    color: 'indigo',
  },
} as const;

export type SectionId = keyof typeof SECTIONS;

export const SECTION_IDS = Object.keys(SECTIONS) as SectionId[];

// Tage Mage Groups (3 groups of 2 sections each)
// Each section is /15, each group is /30, final score is average of 3 groups × 2 = /600
export const GROUPS = {
  groupe1: {
    id: 'groupe1',
    name: 'Groupe 1',
    sections: ['conditions_minimales', 'calcul_mental'] as SectionId[],
  },
  groupe2: {
    id: 'groupe2',
    name: 'Groupe 2',
    sections: ['expression', 'comprehension_textes'] as SectionId[],
  },
  groupe3: {
    id: 'groupe3',
    name: 'Groupe 3',
    sections: ['resolution_problemes', 'raisonnement_logique'] as SectionId[],
  },
} as const;

export const MAX_SCORE_PER_SECTION = 15;
export const MAX_SCORE_PER_GROUP = 30; // 2 sections × 15
export const MAX_SCORE_TAGE_MAGE = 600; // Average of 3 groups × 10

// Note categories
export const NOTE_CATEGORIES = {
  things_i_didnt_know: {
    id: 'things_i_didnt_know',
    name: "Choses que je ne savais pas",
    icon: '💡',
  },
  mistakes_to_remember: {
    id: 'mistakes_to_remember',
    name: 'Erreurs à retenir',
    icon: '⚠️',
  },
  rules_to_memorize: {
    id: 'rules_to_memorize',
    name: 'Règles à mémoriser par cœur',
    icon: '📚',
  },
  typical_traps: {
    id: 'typical_traps',
    name: 'Pièges typiques',
    icon: '🪤',
  },
  personal_notes: {
    id: 'personal_notes',
    name: 'Notes personnelles',
    icon: '📝',
  },
} as const;

export type NoteCategoryId = keyof typeof NOTE_CATEGORIES;

// Color classes for Tailwind
export const COLOR_CLASSES = {
  blue: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500',
  },
  purple: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500',
  },
  green: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500',
  },
  orange: {
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500',
  },
  red: {
    bg: 'bg-red-500',
    bgLight: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500',
  },
  indigo: {
    bg: 'bg-indigo-500',
    bgLight: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500',
  },
} as const;

