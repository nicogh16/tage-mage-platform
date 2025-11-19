'use client';

import { useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useScoresStore } from '@/lib/store/scores-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { SECTIONS, SECTION_IDS, COLOR_CLASSES, MAX_SCORE_PER_SECTION, MAX_SCORE_TAGE_MAGE, GROUPS, MAX_SCORE_PER_GROUP } from '@/lib/constants';
import { ScoreLineChart } from '@/components/charts/line-chart';
import { StrengthsRadarChart } from '@/components/charts/radar-chart';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { 
    scores, 
    loading, 
    fetchScores, 
    getAverageBySection, 
    getGlobalAverage, 
    getBestSection, 
    getWorstSection, 
    getTageMageScore, 
    getAverageByGroup,
    getAverageTageMageFromCompleteTests,
    getMinMaxTageMageFromCompleteTests,
    getSectionStatsFromCompleteTests
  } = useScoresStore();
  const { user, loading: authLoading } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user, fetchScores]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  const globalAverage = getGlobalAverage();
  const bestSection = getBestSection();
  const worstSection = getWorstSection();
  // Use average from complete tests, fallback to general calculation
  const averageFromCompleteTests = getAverageTageMageFromCompleteTests();
  const tageMageScore = averageFromCompleteTests > 0 ? averageFromCompleteTests : getTageMageScore();
  const minMaxScores = getMinMaxTageMageFromCompleteTests();

  // Radar chart data with average, min, max from complete tests
  const radarData = SECTION_IDS.map((section) => {
    const stats = getSectionStatsFromCompleteTests(section);
    return {
      section,
      average: stats.average > 0 ? stats.average : getAverageBySection(section),
      min: stats.min,
      max: stats.max,
    };
  });

  const recentScores = scores.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenue, {user?.email}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Tage Mage</CardTitle>
              <Target className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tageMageScore.toFixed(0)}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">sur {MAX_SCORE_TAGE_MAGE}</p>
              {minMaxScores && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Min: <span className="text-red-600 dark:text-red-400">{minMaxScores.min}</span> | 
                    Max: <span className="text-green-600 dark:text-green-400">{minMaxScores.max}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Scores</CardTitle>
              <Award className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scores.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">scores enregistrés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meilleure Section</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bestSection ? SECTIONS[bestSection].name : 'N/A'}
              </div>
              {bestSection && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getAverageBySection(bestSection).toFixed(1)}/{MAX_SCORE_PER_SECTION}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Section à Améliorer</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {worstSection ? SECTIONS[worstSection].name : 'N/A'}
              </div>
              {worstSection && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getAverageBySection(worstSection).toFixed(1)}/{MAX_SCORE_PER_SECTION}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Forces et Faiblesses</CardTitle>
              <CardDescription>Moyennes par section</CardDescription>
            </CardHeader>
            <CardContent>
              <StrengthsRadarChart data={radarData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Derniers Scores</CardTitle>
              <CardDescription>Vos 5 derniers résultats</CardDescription>
            </CardHeader>
            <CardContent>
              {recentScores.length > 0 ? (
                <div className="space-y-3">
                  {recentScores.map((score) => {
                    const section = SECTIONS[score.section];
                    const colors = COLOR_CLASSES[section.color];
                    return (
                      <div
                        key={score.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <div>
                          <p className="font-medium">{section.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(score.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className={`text-2xl font-bold ${colors.text}`}>
                          {score.score}/{MAX_SCORE_PER_SECTION}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Aucun score enregistré
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Group Scores */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Scores par Groupe</CardTitle>
            <CardDescription>Moyennes des groupes (chaque groupe = 2 sections /30)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(GROUPS).map((group) => {
                const groupAvg = getAverageByGroup(group.id as keyof typeof GROUPS);
                const section1 = SECTIONS[group.sections[0]];
                const section2 = SECTIONS[group.sections[1]];
                
                return (
                  <div
                    key={group.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <h3 className="font-medium mb-2">{group.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {section1.name} + {section2.name}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">
                        {groupAvg > 0 ? groupAvg.toFixed(1) : '-'}/{MAX_SCORE_PER_GROUP}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(groupAvg / MAX_SCORE_PER_GROUP) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Section Averages */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Moyennes par Section</CardTitle>
            <CardDescription>Vue d&apos;ensemble de vos performances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECTION_IDS.map((sectionId) => {
                const section = SECTIONS[sectionId];
                const average = getAverageBySection(sectionId);
                const colors = COLOR_CLASSES[section.color];
                const sectionScores = scores.filter((s) => s.section === sectionId);
                
                return (
                  <Link
                    key={sectionId}
                    href={`/scores?section=${sectionId}`}
                    className="block"
                  >
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{section.name}</h3>
                        <span className={`text-lg font-bold ${colors.text}`}>
                          {average > 0 ? average.toFixed(1) : '-'}/{MAX_SCORE_PER_SECTION}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors.bg}`}
                          style={{ width: `${(average / MAX_SCORE_PER_SECTION) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {sectionScores.length} score{sectionScores.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link href="/scores">
            <Button>Ajouter un Score</Button>
          </Link>
          <Link href="/notes/calcul_mental">
            <Button variant="outline">Voir mes Notes</Button>
          </Link>
          <Link href="/cheatsheet/calcul_mental">
            <Button variant="outline">Cheat Sheets</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

