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
import { SECTIONS, SECTION_IDS, COLOR_CLASSES, MAX_SCORE_PER_SECTION, SectionId } from '@/lib/constants';
import { ScoreLineChart } from '@/components/charts/line-chart';
import { formatDate } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { SECTION_COLOR_MAP } from '@/lib/color-map';

export default function ScoresPage() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');
  const selectedSection: SectionId = (SECTION_IDS.includes(sectionParam as SectionId) 
    ? sectionParam 
    : SECTION_IDS[0]) as SectionId;
  
  const { scores, loading, fetchScores, addScore, deleteScore, getScoresBySection } = useScoresStore();
  const { user } = useAuthStore();
  
  const [section, setSection] = useState(selectedSection);
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user, fetchScores]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || !section) return;

    setSubmitting(true);
    await addScore(section, parseInt(score), new Date(date));
    setScore('');
    setDate(new Date().toISOString().split('T')[0]);
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce score ?')) {
      await deleteScore(id);
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
          <p className="text-gray-600 dark:text-gray-400">
            Enregistrez et suivez vos scores par section
          </p>
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
                      const newSection = e.target.value as SectionId;
                      if (SECTION_IDS.includes(newSection)) {
                        setSection(newSection);
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
            <Card>
              <CardHeader>
                <CardTitle>{sectionData.name}</CardTitle>
                <CardDescription>Évolution de vos scores</CardDescription>
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
          </div>
        </div>
      </div>
    </div>
  );
}

