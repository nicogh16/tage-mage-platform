'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useScoresStore } from '@/lib/store/scores-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { SECTIONS, SECTION_IDS, COLOR_CLASSES, MAX_SCORE_PER_SECTION, SectionId, MAX_SCORE_TAGE_MAGE } from '@/lib/constants';
import { ScoreLineChart } from '@/components/charts/line-chart';
import { formatDate } from '@/lib/utils';
import { Trash2, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';
import { SECTION_COLOR_MAP } from '@/lib/color-map';

// Type guard function
function isValidSectionId(value: string): value is SectionId {
  return SECTION_IDS.includes(value as SectionId);
}

export default function ScoresPage() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');
  const testParam = searchParams.get('test');
  const selectedSection: SectionId = (SECTION_IDS.includes(sectionParam as SectionId) 
    ? sectionParam 
    : SECTION_IDS[0]) as SectionId;
  
  const { 
    scores, 
    loading, 
    fetchScores, 
    addScore, 
    deleteScore,
    deleteAllScoresByTest,
    deleteAllScoresBySection,
    getScoresBySection,
    getScoresByTest,
    getTestsList,
    getTestTotalScore
  } = useScoresStore();
  const { user } = useAuthStore();
  
  const [viewMode, setViewMode] = useState<'by-section' | 'by-test'>('by-test');
  const [section, setSection] = useState(selectedSection);
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [testName, setTestName] = useState(testParam || '');
  const [submitting, setSubmitting] = useState(false);
  
  // Generate test names (test-1 to test-10)
  const availableTests = Array.from({ length: 10 }, (_, i) => `test-${i + 1}`);
  const testsList = getTestsList();
  
  // Si un test est passé en paramètre, passer en mode par test et sélectionner ce test
  useEffect(() => {
    if (testParam && availableTests.includes(testParam)) {
      setTestName(testParam);
      setViewMode('by-test');
    }
  }, [testParam, availableTests]);

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user, fetchScores]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || !section) return;

    setSubmitting(true);
    await addScore(section, parseInt(score), new Date(date), testName || undefined);
    setScore('');
    setDate(new Date().toISOString().split('T')[0]);
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce score ?')) {
      await deleteScore(id);
    }
  };

  const handleDeleteTest = async (testName: string) => {
    const testScores = getScoresByTest(testName);
    if (confirm(`Êtes-vous sûr de vouloir supprimer tous les scores du ${testName.replace('test-', 'Test ')} ?\n\n${testScores.length} score(s) seront supprimé(s).`)) {
      await deleteAllScoresByTest(testName);
    }
  };

  const handleDeleteSection = async (sectionId: SectionId) => {
    const sectionScores = getScoresBySection(sectionId);
    if (confirm(`Êtes-vous sûr de vouloir supprimer tous les scores de la section "${SECTIONS[sectionId].name}" ?\n\n${sectionScores.length} score(s) seront supprimé(s).`)) {
      await deleteAllScoresBySection(sectionId);
    }
  };

  const sectionScores = getScoresBySection(section);
  const sectionData = SECTIONS[section];
  const colors = COLOR_CLASSES[sectionData.color];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scores</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enregistrez et suivez vos scores par test ou par section
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'by-test' ? 'default' : 'outline'}
              onClick={() => setViewMode('by-test')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Par Test
            </Button>
            <Button
              variant={viewMode === 'by-section' ? 'default' : 'outline'}
              onClick={() => setViewMode('by-section')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Par Section
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Score Form */}
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un Score</CardTitle>
              <CardDescription>Enregistrez un nouveau résultat</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="section" className="block text-sm font-medium mb-1">
                    Section
                  </label>
                  <Select
                    id="section"
                    value={section}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isValidSectionId(value)) {
                        setSection(value);
                      }
                    }}
                    required
                  >
                    {SECTION_IDS.map((sectionId) => (
                      <option key={sectionId} value={sectionId}>
                        {SECTIONS[sectionId].name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label htmlFor="score" className="block text-sm font-medium mb-1">
                    Score (0-{MAX_SCORE_PER_SECTION})
                  </label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max={MAX_SCORE_PER_SECTION}
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    required
                    placeholder="12"
                  />
                </div>
                <div>
                  <label htmlFor="test" className="block text-sm font-medium mb-1">
                    Test (optionnel)
                  </label>
                  <Select
                    id="test"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  >
                    <option value="">Aucun test spécifique</option>
                    {availableTests.map((test) => (
                      <option key={test} value={test}>
                        {test.replace('test-', 'Test ')}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Date
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Scores List and Chart */}
          <div className="lg:col-span-2 space-y-6">
            {viewMode === 'by-test' ? (
              <>
                {/* Tests Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scores par Test</CardTitle>
                    <CardDescription>Vue d'ensemble de tous vos tests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {testsList.length > 0 ? (
                      <div className="space-y-4">
                        {testsList.map((test) => {
                          const testScores = getScoresByTest(test);
                          const totalScore = getTestTotalScore(test);
                          // Calculate Tage Mage score: average of 3 groups × 2 × 10 = × 20
                          // Groupe 1: calcul_mental + conditions_minimales /30
                          // Groupe 2: comprehension_textes + expression /30
                          // Groupe 3: raisonnement_logique + resolution_problemes /30
                          let tageMageScore = 0;
                          if (testScores.length === 6) {
                            // Get unique scores (most recent per section)
                            const uniqueScores = new Map();
                            testScores.forEach(s => {
                              const existing = uniqueScores.get(s.section);
                              if (!existing || new Date(s.date) > new Date(existing.date)) {
                                uniqueScores.set(s.section, s);
                              }
                            });
                            const scores = Array.from(uniqueScores.values());
                            
                            const group1 = (scores.find(s => s.section === 'calcul_mental')?.score || 0) +
                                         (scores.find(s => s.section === 'conditions_minimales')?.score || 0);
                            const group2 = (scores.find(s => s.section === 'comprehension_textes')?.score || 0) +
                                         (scores.find(s => s.section === 'expression')?.score || 0);
                            const group3 = (scores.find(s => s.section === 'raisonnement_logique')?.score || 0) +
                                         (scores.find(s => s.section === 'resolution_problemes')?.score || 0);
                            const avgGroups = (group1 + group2 + group3) / 3;
                            // Formula: average × 2 × 10 = average × 20
                            tageMageScore = Math.round(avgGroups * 2 * 10 * 10) / 10;
                          } else {
                            // Fallback: simple calculation if not all sections
                            tageMageScore = Math.round((totalScore / 90) * 600);
                          }
                          
                          return (
                            <Card key={test} className="border-2">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">
                                    {test.replace('test-', 'Test ')}
                                  </CardTitle>
                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {tageMageScore}/{MAX_SCORE_TAGE_MAGE}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {totalScore}/90 (total)
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteTest(test)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      title="Supprimer tous les scores de ce test"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {SECTION_IDS.map((sectionId) => {
                                    const sectionScore = testScores.find(s => s.section === sectionId);
                                    const sectionData = SECTIONS[sectionId];
                                    return (
                                      <div
                                        key={sectionId}
                                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                                      >
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                          {sectionData.name}
                                        </div>
                                        <div className="text-lg font-bold">
                                          {sectionScore ? `${sectionScore.score}/${MAX_SCORE_PER_SECTION}` : '-'}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Date: {testScores[0] ? formatDate(testScores[0].date) : '-'}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Aucun score de test enregistré. Sélectionnez un test lors de l'ajout d'un score.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{sectionData.name}</CardTitle>
                    <CardDescription>Évolution de vos scores</CardDescription>
                  </div>
                  {sectionScores.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(section)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Supprimer tous les scores de cette section"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer tous
                    </Button>
                  )}
                </div>
              </CardHeader>
                  <CardContent>
                    {sectionScores.length > 0 ? (
                      <ScoreLineChart
                        data={sectionScores.map((s) => ({ date: s.date, score: s.score }))}
                        color={SECTION_COLOR_MAP[sectionData.color] || '#3b82f6'}
                      />
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Aucun score enregistré pour cette section
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historique des Scores</CardTitle>
                    <CardDescription>Tous vos scores pour {sectionData.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sectionScores.length > 0 ? (
                      <div className="space-y-2">
                        {sectionScores.map((scoreItem) => (
                          <div
                            key={scoreItem.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div>
                              <p className="font-medium">
                                {formatDate(scoreItem.date)}
                                {scoreItem.test_name && (
                                  <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                                    ({scoreItem.test_name.replace('test-', 'Test ')})
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(scoreItem.date).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`text-xl font-bold ${colors.text}`}>
                                {scoreItem.score}/{MAX_SCORE_PER_SECTION}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(scoreItem.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Aucun score enregistré
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

