'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BookOpen, Clock, Award, AlertCircle, Target, Plus } from 'lucide-react';
import { useScoresStore } from '@/lib/store/scores-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { MAX_SCORE_TAGE_MAGE } from '@/lib/constants';

// Liste des PDFs disponibles dans le dossier tests-blancs
// Les fichiers sont détectés automatiquement
const AVAILABLE_PDFS = [
  'test-1.pdf',
  'test-2.pdf',
  'test-3.pdf',
  'test-4.pdf',
  'test-5.pdf',
  'test-6.pdf',
  'test-7.pdf',
  'test-8.pdf',
  'test-9.pdf',
  'test-10.pdf',
];

// Fonction pour générer les informations d'un test à partir du nom du fichier
const getTestInfo = (filename: string) => {
  const match = filename.match(/test-(\d+)\.pdf/i);
  const number = match ? match[1] : filename.replace('.pdf', '');
  
  return {
    id: filename.replace('.pdf', ''),
    name: `Test Blanc ${number}`,
    source: 'Tage Mage',
    description: `Test blanc numéro ${number} pour s'entraîner au Tage Mage`,
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: `/pdfs/tests-blancs/${filename}`,
    available: true,
  };
};

// Générer la liste des tests à partir des PDFs disponibles
const OFFICIAL_TESTS = AVAILABLE_PDFS.map(getTestInfo);

export default function TestsBlancsPage() {
  const router = useRouter();
  const [availableTests, setAvailableTests] = useState<typeof OFFICIAL_TESTS>([]);
  const { scores, fetchScores, getScoresByTest, getTestTotalScore } = useScoresStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user, fetchScores]);

  useEffect(() => {
    // Vérifier l'existence des PDFs et mettre à jour la liste
    const checkPDFs = async () => {
      const tests: typeof OFFICIAL_TESTS = [];
      
      for (const filename of AVAILABLE_PDFS) {
        const test = getTestInfo(filename);
        try {
          const response = await fetch(test.pdfPath, { method: 'HEAD' });
          if (response.ok) {
            tests.push(test);
          }
        } catch {
          // PDF non disponible, on ne l'ajoute pas à la liste
        }
      }
      
      setAvailableTests(tests);
    };
    checkPDFs();
  }, []);

  // Fonction pour calculer le score Tage Mage d'un test
  const getTestTageMageScore = (testId: string) => {
    const testScores = getScoresByTest(testId);
    if (testScores.length !== 6) return null; // Test incomplet
    
    const group1 = (testScores.find(s => s.section === 'conditions_minimales')?.score || 0) +
                 (testScores.find(s => s.section === 'calcul_mental')?.score || 0);
    const group2 = (testScores.find(s => s.section === 'expression')?.score || 0) +
                 (testScores.find(s => s.section === 'comprehension_textes')?.score || 0);
    const group3 = (testScores.find(s => s.section === 'resolution_problemes')?.score || 0) +
                 (testScores.find(s => s.section === 'raisonnement_logique')?.score || 0);
    const avgGroups = (group1 + group2 + group3) / 3;
    return Math.round(avgGroups * 10);
  };

  const handleAddScore = (testId: string) => {
    router.push(`/scores?test=${testId}`);
  };

  const handleOpenPDF = (pdfPath: string) => {
    window.open(pdfPath, '_blank');
  };

  const handleDownloadPDF = (pdfPath: string, filename: string) => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tests Blancs Officiels</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Accédez aux tests blancs officiels pour vous entraîner au Tage Mage
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Tests Officiels
            </CardTitle>
            <CardDescription>
              Ces tests sont proposés par les organisateurs officiels du Tage Mage et des concours.
              Ils sont les plus proches des conditions réelles d&apos;examen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="mb-2">
                <strong>💡 Comment obtenir les PDFs officiels ?</strong>
              </p>
              <p className="mb-3">
                Les tests blancs officiels sont généralement gratuits mais nécessitent une inscription sur les sites officiels.
                Consultez le guide complet pour savoir où les télécharger.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/pdfs/tests-blancs/HOW_TO_ADD_PDFS.md', '_blank')}
                className="text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Voir le guide d&apos;ajout des PDFs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tests List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.length > 0 ? (
            availableTests.map((test) => {
              const testScore = getTestTageMageScore(test.id);
              const testScores = getScoresByTest(test.id);
              const isComplete = testScores.length === 6;
              
              return (
                <Card key={test.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      {test.official && (
                        <Award className="h-5 w-5 text-yellow-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <CardDescription className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {test.source}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                      {test.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        Durée : {test.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {test.sections} sections
                      </div>
                      {testScore !== null && (
                        <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                          <Target className="h-4 w-4 mr-2" />
                          Score : {testScore}/{MAX_SCORE_TAGE_MAGE}
                        </div>
                      )}
                      {testScores.length > 0 && testScores.length < 6 && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                          Test en cours : {testScores.length}/6 sections complétées
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant="default"
                          onClick={() => handleOpenPDF(test.pdfPath)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Ouvrir
                        </Button>
                        <Button
                          className="flex-1"
                          variant="outline"
                          onClick={() => handleDownloadPDF(test.pdfPath, `${test.id}.pdf`)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                      <Button
                        className="w-full"
                        variant={isComplete ? "outline" : "default"}
                        onClick={() => handleAddScore(test.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {isComplete ? 'Modifier le score' : 'Ajouter un score'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Aucun PDF trouvé dans le dossier tests-blancs.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Placez vos fichiers PDF (test-1.pdf, test-2.pdf, etc.) dans le dossier{' '}
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    public/pdfs/tests-blancs/
                  </code>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Conseils pour les Tests Blancs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  <strong>Respectez le temps imparti :</strong> Les tests blancs durent 90 minutes.
                  Entraînez-vous à gérer votre temps efficacement.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  <strong>Simulez les conditions réelles :</strong> Installez-vous dans un endroit
                  calme, sans distractions, et chronométrez-vous.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  <strong>Analysez vos résultats :</strong> Après chaque test, enregistrez vos
                  scores dans la section &quot;Scores&quot; pour suivre votre progression.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  <strong>Révisez vos erreurs :</strong> Notez les questions où vous avez fait des
                  erreurs dans la section &quot;Notes&quot; pour ne plus les répéter.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  <strong>Variez les sources :</strong> Testez-vous avec différents organisateurs
                  pour vous habituer à différents styles de questions.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

