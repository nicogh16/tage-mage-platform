// Store pour gérer la progression des flashcards avec répétition espacée

export interface CardProgress {
  cardId: string;
  masteryLevel: number; // 0-5 (0 = nouveau, 5 = maîtrisé)
  lastReviewed: number; // timestamp
  nextReview: number; // timestamp (basé sur la répétition espacée)
  timesReviewed: number;
  timesCorrect: number;
  timesIncorrect: number;
  streak: number; // nombre de fois consécutives correctes
}

const STORAGE_KEY = 'flashcards_progress';

// Intervalles de révision (en millisecondes) basés sur le niveau de maîtrise
const REVIEW_INTERVALS: Record<number, number> = {
  0: 0, // Immédiat
  1: 1 * 60 * 1000, // 1 minute
  2: 5 * 60 * 1000, // 5 minutes
  3: 30 * 60 * 1000, // 30 minutes
  4: 24 * 60 * 60 * 1000, // 1 jour
  5: 7 * 24 * 60 * 60 * 1000, // 1 semaine
};

export function getCardProgress(cardId: string): CardProgress | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  const progress: Record<string, CardProgress> = JSON.parse(stored);
  return progress[cardId] || null;
}

export function getAllProgress(): Record<string, CardProgress> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  return JSON.parse(stored);
}

export function saveCardProgress(cardId: string, isCorrect: boolean): CardProgress {
  const stored = localStorage.getItem(STORAGE_KEY);
  const progress: Record<string, CardProgress> = stored ? JSON.parse(stored) : {};
  
  const existing = progress[cardId];
  const now = Date.now();
  
  let masteryLevel: number;
  let streak: number;
  let nextReview: number;
  
  if (existing) {
    if (isCorrect) {
      // Augmenter le niveau de maîtrise
      masteryLevel = Math.min(existing.masteryLevel + 1, 5);
      streak = existing.streak + 1;
    } else {
      // Réduire le niveau si erreur
      masteryLevel = Math.max(existing.masteryLevel - 1, 0);
      streak = 0;
    }
  } else {
    // Nouvelle carte
    masteryLevel = isCorrect ? 1 : 0;
    streak = isCorrect ? 1 : 0;
  }
  
  // Calculer la prochaine révision basée sur le niveau de maîtrise
  nextReview = now + REVIEW_INTERVALS[masteryLevel];
  
  const newProgress: CardProgress = {
    cardId,
    masteryLevel,
    lastReviewed: now,
    nextReview,
    timesReviewed: (existing?.timesReviewed || 0) + 1,
    timesCorrect: (existing?.timesCorrect || 0) + (isCorrect ? 1 : 0),
    timesIncorrect: (existing?.timesIncorrect || 0) + (isCorrect ? 0 : 1),
    streak,
  };
  
  progress[cardId] = newProgress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  
  return newProgress;
}

export function resetProgress(cardId?: string): void {
  if (cardId) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress: Record<string, CardProgress> = JSON.parse(stored);
      delete progress[cardId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getCardsToReview(cardIds: string[]): string[] {
  const progress = getAllProgress();
  const now = Date.now();
  
  return cardIds.filter((cardId) => {
    const cardProgress = progress[cardId];
    if (!cardProgress) return true; // Nouvelle carte, à réviser
    
    // Carte à réviser si :
    // 1. Le temps de révision est arrivé
    // 2. Le niveau de maîtrise est faible (< 3)
    return cardProgress.nextReview <= now || cardProgress.masteryLevel < 3;
  });
}

export function getCardPriority(cardId: string): number {
  const progress = getCardProgress(cardId);
  if (!progress) return 1000; // Priorité maximale pour nouvelles cartes
  
  const now = Date.now();
  const overdue = Math.max(0, now - progress.nextReview);
  const masteryWeight = (6 - progress.masteryLevel) * 100; // Plus faible = plus prioritaire
  
  // Priorité = temps de retard + poids de maîtrise
  return overdue + masteryWeight;
}

export function getMasteryStats(cardIds: string[]): {
  new: number;
  learning: number;
  mastered: number;
  total: number;
} {
  const progress = getAllProgress();
  let newCount = 0;
  let learningCount = 0;
  let masteredCount = 0;
  
  cardIds.forEach((cardId) => {
    const cardProgress = progress[cardId];
    if (!cardProgress) {
      newCount++;
    } else if (cardProgress.masteryLevel < 3) {
      learningCount++;
    } else {
      masteredCount++;
    }
  });
  
  return {
    new: newCount,
    learning: learningCount,
    mastered: masteredCount,
    total: cardIds.length,
  };
}

