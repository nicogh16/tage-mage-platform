'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ALL_FLASHCARDS,
  FLASHCARD_CATEGORIES,
  getFlashcardsByCategory,
  shuffleArray,
  type FlashcardCategory,
  type Flashcard,
} from '@/lib/flashcards-data';
import {
  saveCardProgress,
  getCardProgress,
  getAllProgress,
  resetProgress,
  getCardsToReview,
  getCardPriority,
  getMasteryStats,
} from '@/lib/flashcards-store';
import { RotateCcw, Check, X, Shuffle, ArrowLeft, ArrowRight, BookOpen, Brain, Target, TrendingUp, Zap } from 'lucide-react';

type StudyMode = 'normal' | 'smart' | 'review';

export default function FlashcardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<FlashcardCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('smart');
  const [cardProgress, setCardProgress] = useState<Record<string, ReturnType<typeof getCardProgress>>>({});

  // Charger la progression au démarrage
  useEffect(() => {
    const progress = getAllProgress();
    const progressMap: Record<string, ReturnType<typeof getCardProgress>> = {};
    Object.values(progress).forEach((p) => {
      progressMap[p.cardId] = p;
    });
    setCardProgress(progressMap);
  }, []);

  // Initialiser les flashcards selon le mode d'étude
  useEffect(() => {
    let cards: Flashcard[] = [];
    if (selectedCategory === 'all') {
      cards = [...ALL_FLASHCARDS];
    } else {
      cards = getFlashcardsByCategory(selectedCategory);
    }

    // Mode intelligent : prioriser les cartes à réviser
    if (studyMode === 'smart') {
      const cardIds = cards.map((c) => c.id);
      const toReview = getCardsToReview(cardIds);
      
      // Trier par priorité (cartes à réviser en premier)
      cards.sort((a, b) => {
        const priorityA = getCardPriority(a.id);
        const priorityB = getCardPriority(b.id);
        return priorityB - priorityA; // Plus haute priorité en premier
      });
    } else if (studyMode === 'review') {
      // Mode révision : seulement les cartes à réviser
      const cardIds = cards.map((c) => c.id);
      const toReview = getCardsToReview(cardIds);
      cards = cards.filter((c) => toReview.includes(c.id));
    } else {
      // Mode normal : mélanger aléatoirement
      cards = shuffleArray(cards);
    }

    setFlashcards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, studyMode]);

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;
  const currentCardProgress = currentCard ? cardProgress[currentCard.id] : null;

  // Calculer les stats de maîtrise
  const allCardsInCategory =
    selectedCategory === 'all' ? ALL_FLASHCARDS : getFlashcardsByCategory(selectedCategory);
  const masteryStats = getMasteryStats(allCardsInCategory.map((c) => c.id));

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < flashcards.length - 1) {
        setIsFlipped(false);
        return prevIndex + 1;
      }
      return prevIndex;
    });
  }, [flashcards.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        setIsFlipped(false);
        return prevIndex - 1;
      }
      return prevIndex;
    });
  }, []);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (!currentCard) return;

      // Sauvegarder la progression
      const newProgress = saveCardProgress(currentCard.id, isCorrect);
      setCardProgress((prev) => ({
        ...prev,
        [currentCard.id]: newProgress,
      }));

      // Passer à la carte suivante après un court délai
      setTimeout(() => {
        handleNext();
      }, 300);
    },
    [currentCard, handleNext]
  );

  const handleShuffle = () => {
    setFlashcards(shuffleArray(flashcards));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleResetProgress = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ?')) {
      resetProgress();
      setCardProgress({});
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsFlipped((prev) => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'k':
        case 'K':
          e.preventDefault();
          handleAnswer(true);
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          handleAnswer(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNext, handlePrevious, handleAnswer]);

  const getMasteryLevelLabel = (level: number | null): string => {
    if (level === null) return 'Nouvelle';
    if (level === 0) return 'À apprendre';
    if (level <= 2) return 'En cours';
    if (level <= 4) return 'Bien connue';
    return 'Maîtrisée';
  };

  const getMasteryColor = (level: number | null): string => {
    if (level === null) return 'bg-gray-500';
    if (level === 0) return 'bg-red-500';
    if (level <= 2) return 'bg-yellow-500';
    if (level <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-8">
      <Navbar />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Flashcards de Mémorisation</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Système d&apos;apprentissage avec répétition espacée pour une mémorisation optimale
          </p>
        </div>

        {/* Mode d'étude */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Mode d&apos;Étude</CardTitle>
            <CardDescription className="text-xs md:text-sm">Choisissez comment vous voulez apprendre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3">
              <Button
                variant={studyMode === 'smart' ? 'default' : 'outline'}
                onClick={() => setStudyMode('smart')}
                className="flex items-center justify-center gap-2 text-sm md:text-base py-2.5 md:py-2 min-h-[44px]"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Apprentissage Intelligent</span>
                <span className="sm:hidden">Intelligent</span>
              </Button>
              <Button
                variant={studyMode === 'review' ? 'default' : 'outline'}
                onClick={() => setStudyMode('review')}
                className="flex items-center justify-center gap-2 text-sm md:text-base py-2.5 md:py-2 min-h-[44px]"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Révision (cartes à revoir)</span>
                <span className="sm:hidden">Révision</span>
              </Button>
              <Button
                variant={studyMode === 'normal' ? 'default' : 'outline'}
                onClick={() => setStudyMode('normal')}
                className="flex items-center justify-center gap-2 text-sm md:text-base py-2.5 md:py-2 min-h-[44px]"
              >
                <Shuffle className="h-4 w-4" />
                Mode Normal
              </Button>
            </div>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              {studyMode === 'smart' && (
                <p>
                  🧠 <strong>Apprentissage Intelligent</strong> : Priorise automatiquement les cartes difficiles et celles
                  à réviser selon la répétition espacée.
                </p>
              )}
              {studyMode === 'review' && (
                <p>
                  🎯 <strong>Révision</strong> : Affiche uniquement les cartes qui nécessitent une révision (basé sur
                  votre progression).
                </p>
              )}
              {studyMode === 'normal' && (
                <p>
                  🔀 <strong>Mode Normal</strong> : Toutes les cartes mélangées aléatoirement.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sélection de catégorie */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Catégorie</CardTitle>
            <CardDescription className="text-xs md:text-sm">Sélectionnez une catégorie à réviser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
                className="text-xs md:text-sm min-h-[36px] px-3"
              >
                Toutes ({ALL_FLASHCARDS.length})
              </Button>
              {Object.values(FLASHCARD_CATEGORIES).map((category) => {
                const count = getFlashcardsByCategory(category.id as FlashcardCategory).length;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id as FlashcardCategory)}
                    size="sm"
                    className="text-xs md:text-sm min-h-[36px] px-2 md:px-3"
                  >
                    {category.icon} <span className="hidden sm:inline">{category.name}</span> ({count})
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques de maîtrise */}
        <Card className="mb-4 md:mb-6">
          <CardContent className="pt-4 md:pt-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Nouvelles</p>
                <p className="text-xl md:text-2xl font-bold text-gray-600">{masteryStats.new}</p>
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">En cours</p>
                <p className="text-xl md:text-2xl font-bold text-yellow-600">{masteryStats.learning}</p>
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Maîtrisées</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{masteryStats.mastered}</p>
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Progression</p>
                <p className="text-xl md:text-2xl font-bold">
                  {currentIndex + 1} / {flashcards.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Taux de réussite</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">
                  {currentCardProgress
                    ? currentCardProgress.timesReviewed > 0
                      ? Math.round(
                          (currentCardProgress.timesCorrect / currentCardProgress.timesReviewed) * 100
                        )
                      : 0
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(masteryStats.mastered / masteryStats.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                {Math.round((masteryStats.mastered / masteryStats.total) * 100)}% de maîtrise globale
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Flashcard principale */}
        {currentCard ? (
          <div className="max-w-2xl mx-auto mb-4 md:mb-6">
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg border-2 touch-none select-none"
              onClick={handleFlip}
            >
              <CardContent className="p-6 md:p-12 min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center">
                {/* Barre de progression de maîtrise */}
                {currentCardProgress && (
                  <div className="w-full mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Niveau: {currentCardProgress.masteryLevel}/5
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {currentCardProgress.streak > 0 && `🔥 ${currentCardProgress.streak} de suite`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${getMasteryColor(currentCardProgress.masteryLevel)} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${(currentCardProgress.masteryLevel / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-center w-full">
                  <div
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 transition-opacity duration-300 leading-tight ${
                      isFlipped ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                    }`}
                  >
                    {currentCard.front}
                  </div>
                  <div
                    className={`transition-opacity duration-300 ${
                      isFlipped ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
                      {currentCard.back}
                    </div>
                    {/* Exemples pour les critères de divisibilité */}
                    {isFlipped && currentCard.examples && currentCard.examples.length > 0 && (
                      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700 w-full">
                        <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                          Exemples :
                        </p>
                        <div className="space-y-1.5 md:space-y-2 text-left max-w-md mx-auto">
                          {currentCard.examples.map((example, idx) => (
                            <div
                              key={idx}
                              className="text-xs md:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2 md:px-3 py-1.5 md:py-2 rounded"
                            >
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-3 md:mt-4">
                    {isFlipped ? 'Appuyez pour voir la question' : 'Appuyez pour voir la réponse'}
                  </p>
                </div>

                {/* Indicateur de maîtrise */}
                <div className="mt-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getMasteryColor(
                      currentCardProgress?.masteryLevel ?? null
                    )} text-white`}
                  >
                    {getMasteryLevelLabel(currentCardProgress?.masteryLevel ?? null)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto mb-6">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {studyMode === 'review'
                  ? '🎉 Toutes les cartes sont à jour ! Aucune révision nécessaire.'
                  : 'Aucune flashcard disponible pour cette catégorie'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Contrôles */}
        {currentCard && (
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-3 md:mb-4">
              <Button 
                variant="outline" 
                onClick={handlePrevious} 
                disabled={currentIndex === 0} 
                className="min-h-[48px] md:min-h-[44px] text-sm md:text-base flex-1 sm:flex-initial"
              >
                <ArrowLeft className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Précédent</span>
                <span className="sm:hidden">Préc.</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleFlip} 
                className="min-h-[48px] md:min-h-[44px] text-sm md:text-base flex-1 sm:flex-initial"
              >
                <RotateCcw className="h-4 w-4 mr-1 md:mr-2" />
                Retourner
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="min-h-[48px] md:min-h-[44px] text-sm md:text-base flex-1 sm:flex-initial"
              >
                <span className="hidden sm:inline">Suivant</span>
                <span className="sm:hidden">Suiv.</span>
                <ArrowRight className="h-4 w-4 ml-1 md:ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleShuffle} 
                className="min-h-[48px] md:min-h-[44px] text-sm md:text-base flex-1 sm:flex-initial"
              >
                <Shuffle className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Mélanger</span>
                <span className="sm:hidden">Mix</span>
              </Button>
            </div>

            {/* Boutons de réponse - seulement si la carte est retournée */}
            {isFlipped && (
              <div className="flex gap-3 md:gap-4 justify-center mb-3 md:mb-4">
                <Button
                  variant="outline"
                  onClick={() => handleAnswer(false)}
                  className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 min-h-[56px] md:min-h-[48px] text-base md:text-base flex-1 sm:flex-initial px-4 md:px-6"
                >
                  <X className="h-5 w-5 md:h-4 md:w-4 mr-2" />
                  <span className="hidden sm:inline">Je ne connais pas</span>
                  <span className="sm:hidden">Non</span>
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleAnswer(true)}
                  className="bg-green-600 hover:bg-green-700 text-white min-h-[56px] md:min-h-[48px] text-base md:text-base flex-1 sm:flex-initial px-4 md:px-6"
                >
                  <Check className="h-5 w-5 md:h-4 md:w-4 mr-2" />
                  <span className="hidden sm:inline">Je connais</span>
                  <span className="sm:hidden">Oui</span>
                </Button>
              </div>
            )}

            <div className="text-center">
              <Button variant="ghost" onClick={handleResetProgress} size="sm" className="text-red-600">
                Réinitialiser la progression
              </Button>
            </div>
          </div>
        )}

        {/* Raccourcis clavier - masqué sur mobile */}
        <Card className="mt-6 md:mt-8 max-w-2xl mx-auto hidden md:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BookOpen className="h-5 w-5" />
              Raccourcis Clavier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Espace</kbd> - Retourner
              </div>
              <div>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">→</kbd> - Suivant
              </div>
              <div>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">←</kbd> - Précédent
              </div>
              <div>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">K</kbd> - Je connais
              </div>
              <div>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">N</kbd> - Je ne connais pas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
