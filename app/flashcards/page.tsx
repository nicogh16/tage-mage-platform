'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  ALL_FLASHCARDS,
  FLASHCARD_CATEGORIES,
  getFlashcardsByCategory,
  shuffleArray,
  type FlashcardCategory,
  type Flashcard,
} from '@/lib/flashcards-data';
import { RotateCcw, Check, X, Shuffle, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export default function FlashcardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<FlashcardCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [showStats, setShowStats] = useState(false);
  const [reviewMode, setReviewMode] = useState(false); // Mode révision : seulement les non connues

  // Initialiser les flashcards
  useEffect(() => {
    let cards: Flashcard[] = [];
    if (selectedCategory === 'all') {
      cards = [...ALL_FLASHCARDS];
    } else {
      cards = getFlashcardsByCategory(selectedCategory);
    }
    
    // En mode révision, filtrer les cartes connues
    if (reviewMode) {
      cards = cards.filter(card => !knownCards.has(card.id));
    }
    
    setFlashcards(shuffleArray(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, reviewMode, knownCards]);

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;
  
  // Calculer les stats basées sur toutes les cartes de la catégorie, pas seulement celles affichées
  const allCardsInCategory = selectedCategory === 'all' 
    ? ALL_FLASHCARDS 
    : getFlashcardsByCategory(selectedCategory);
  const knownInCategory = allCardsInCategory.filter(card => knownCards.has(card.id));
  const knownCount = knownInCategory.length;
  const knownPercentage = allCardsInCategory.length > 0 
    ? (knownCount / allCardsInCategory.length) * 100 
    : 0;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnown = () => {
    if (currentCard) {
      setKnownCards(new Set([...knownCards, currentCard.id]));
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleUnknown = () => {
    if (currentCard) {
      const newKnown = new Set(knownCards);
      newKnown.delete(currentCard.id);
      setKnownCards(newKnown);
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleShuffle = () => {
    setFlashcards(shuffleArray(flashcards));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setKnownCards(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Ignorer si on est dans un input
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsFlipped(!isFlipped);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
          }
          break;
        case 'k':
        case 'K':
          e.preventDefault();
          if (currentCard) {
            setKnownCards(new Set([...knownCards, currentCard.id]));
            if (currentIndex < flashcards.length - 1) {
              setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
              }, 300);
            }
          }
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          if (currentCard) {
            const newKnown = new Set(knownCards);
            newKnown.delete(currentCard.id);
            setKnownCards(newKnown);
            if (currentIndex < flashcards.length - 1) {
              setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
              }, 300);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isFlipped, flashcards, knownCards, currentCard]);

  const isKnown = currentCard ? knownCards.has(currentCard.id) : false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flashcards de Mémorisation</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Mémorisez rapidement les éléments essentiels pour le Tage Mage
          </p>
        </div>

        {/* Sélection de catégorie */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Catégorie</CardTitle>
            <CardDescription>Sélectionnez une catégorie à réviser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  size="sm"
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
                    >
                      {category.icon} {category.name} ({count})
                    </Button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={reviewMode ? 'default' : 'outline'}
                  onClick={() => setReviewMode(!reviewMode)}
                  size="sm"
                >
                  {reviewMode ? '✓' : ''} Mode Révision (cartes non connues uniquement)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        {flashcards.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Progression</p>
                  <p className="text-2xl font-bold">
                    {currentIndex + 1} / {flashcards.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connues</p>
                  <p className="text-2xl font-bold text-green-600">
                    {knownCount} ({knownPercentage.toFixed(0)}%)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Restantes</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {allCardsInCategory.length - knownCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Catégorie</p>
                  <p className="text-lg font-semibold">
                    {selectedCategory === 'all'
                      ? 'Toutes'
                      : FLASHCARD_CATEGORIES[selectedCategory].name}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flashcard principale */}
        {currentCard ? (
          <div className="max-w-2xl mx-auto mb-6">
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={handleFlip}
            >
              <CardContent className="p-12 min-h-[400px] flex items-center justify-center">
                <div className="text-center w-full">
                  <div
                    className={`text-4xl md:text-6xl font-bold mb-4 transition-opacity duration-300 ${
                      isFlipped ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                    }`}
                  >
                    {currentCard.front}
                  </div>
                  <div
                    className={`text-4xl md:text-6xl font-bold mb-4 transition-opacity duration-300 ${
                      isFlipped ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                    }`}
                  >
                    {currentCard.back}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Cliquez pour retourner
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Indicateur de difficulté */}
            {currentCard.difficulty && (
              <div className="text-center mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    currentCard.difficulty === 'easy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : currentCard.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {currentCard.difficulty === 'easy'
                    ? 'Facile'
                    : currentCard.difficulty === 'medium'
                      ? 'Moyen'
                      : 'Difficile'}
                </span>
                {isKnown && (
                  <span className="ml-2 text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    ✓ Connue
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto mb-6">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Aucune flashcard disponible pour cette catégorie
              </p>
            </CardContent>
          </Card>
        )}

        {/* Contrôles */}
        {currentCard && (
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              <Button variant="outline" onClick={handleFlip} size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retourner
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                size="lg"
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={handleShuffle} size="lg">
                <Shuffle className="h-4 w-4 mr-2" />
                Mélanger
              </Button>
              <Button variant="outline" onClick={handleReset} size="lg">
                Réinitialiser
              </Button>
            </div>

            {/* Boutons de mémorisation */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleUnknown}
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                size="lg"
              >
                <X className="h-4 w-4 mr-2" />
                À revoir
              </Button>
              <Button
                variant="default"
                onClick={handleKnown}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Je connais
              </Button>
            </div>
          </div>
        )}

        {/* Raccourcis clavier */}
        <Card className="mt-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">N</kbd> - À revoir
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

