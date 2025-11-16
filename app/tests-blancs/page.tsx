'use client';

import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Clock, Award } from 'lucide-react';

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
    link: 'https://www.tage-mage.com/test-blanc-officiel',
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
    link: 'https://www.tage-mage.com/test-blanc-officiel',
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
    link: 'https://www.tage-mage.com/annales',
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
    link: 'https://www.ecricome.org/preparation-tage-mage',
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
    link: 'https://www.concours-pass.fr/preparation-tage-mage',
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
    link: 'https://www.concours-sesame.net/preparation-tage-mage',
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
    link: 'https://www.concours-acces.com/preparation-tage-mage',
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
    link: 'https://www.concours-link.fr/preparation-tage-mage',
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
    link: 'https://www.ambitionsplus.fr/preparation-tage-mage',
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
    link: 'https://www.concours-team.fr/preparation-tage-mage',
    available: true,
  },
];

export default function TestsBlancsPage() {
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
                  <Button
                    asChild
                    className="w-full"
                    variant="default"
                  >
                    <a
                      href={test.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      Accéder au test
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
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

