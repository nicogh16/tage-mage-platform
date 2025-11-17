'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BookOpen, Clock, Award, AlertCircle } from 'lucide-react';

// Tests blancs officiels Tage Mage
const OFFICIAL_TESTS = [
  {
    id: 'fnege-officiel-2024',
    name: 'Test Blanc Officiel Fnege 2024',
    source: 'Fnege (Fondation Nationale pour l\'Enseignement de la Gestion des Entreprises)',
    description: 'Test blanc officiel proposé par la Fnege, organisateur du Tage Mage',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/fnege-2024.pdf',
    available: true,
  },
  {
    id: 'fnege-officiel-2023',
    name: 'Test Blanc Officiel Fnege 2023',
    source: 'Fnege',
    description: 'Test blanc officiel de l\'année précédente',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/fnege-2023.pdf',
    available: true,
  },
  {
    id: 'fnege-annales',
    name: 'Annales Officielles Fnege',
    source: 'Fnege',
    description: 'Annales des sessions précédentes du Tage Mage',
    duration: 'Variable',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/fnege-annales.pdf',
    available: true,
  },
  {
    id: 'concours-ecricome',
    name: 'Tests Blancs Ecricome',
    source: 'Ecricome',
    description: 'Tests blancs proposés par Ecricome pour la préparation au Tage Mage',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/ecricome.pdf',
    available: true,
  },
  {
    id: 'concours-pass',
    name: 'Tests Blancs Pass',
    source: 'Pass',
    description: 'Tests blancs officiels du concours Pass',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/pass.pdf',
    available: true,
  },
  {
    id: 'concours-sesame',
    name: 'Tests Blancs Sésame',
    source: 'Sésame',
    description: 'Tests blancs officiels du concours Sésame',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/sesame.pdf',
    available: true,
  },
  {
    id: 'concours-acces',
    name: 'Tests Blancs Accès',
    source: 'Accès',
    description: 'Tests blancs officiels du concours Accès',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/acces.pdf',
    available: true,
  },
  {
    id: 'concours-link',
    name: 'Tests Blancs Link',
    source: 'Link',
    description: 'Tests blancs officiels du concours Link',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/link.pdf',
    available: true,
  },
  {
    id: 'concours-ambitions',
    name: 'Tests Blancs Ambitions+',
    source: 'Ambitions+',
    description: 'Tests blancs officiels du concours Ambitions+',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/ambitions.pdf',
    available: true,
  },
  {
    id: 'concours-team',
    name: 'Tests Blancs Team',
    source: 'Team',
    description: 'Tests blancs officiels du concours Team',
    duration: '90 minutes',
    sections: 6,
    official: true,
    pdfPath: '/pdfs/tests-blancs/team.pdf',
    available: true,
  },
];

export default function TestsBlancsPage() {
  const [pdfStatus, setPdfStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Vérifier l'existence des PDFs
    const checkPDFs = async () => {
      const status: Record<string, boolean> = {};
      for (const test of OFFICIAL_TESTS) {
        try {
          const response = await fetch(test.pdfPath, { method: 'HEAD' });
          status[test.id] = response.ok;
        } catch {
          status[test.id] = false;
        }
      }
      setPdfStatus(status);
    };
    checkPDFs();
  }, []);

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
          {OFFICIAL_TESTS.map((test) => (
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
                </div>
                {test.available ? (
                  pdfStatus[test.id] === false ? (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-yellow-800 dark:text-yellow-300">
                          <p className="font-medium mb-1">PDF non disponible</p>
                          <p className="mb-2">Placez le fichier <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">{test.pdfPath.replace('/pdfs/tests-blancs/', '')}</code> dans le dossier <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">public/pdfs/tests-blancs/</code></p>
                          <p className="text-yellow-700 dark:text-yellow-400">
                            📖 Consultez le guide pour savoir où télécharger les PDFs officiels
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )
                ) : (
                  <Button disabled className="w-full" variant="outline">
                    Bientôt disponible
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
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

