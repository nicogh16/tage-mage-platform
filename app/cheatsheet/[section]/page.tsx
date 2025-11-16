'use client';

import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { SECTIONS, SECTION_IDS } from '@/lib/constants';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Cheat sheet content for each section
const CHEATSHEETS: Record<string, { title: string; content: string[] }> = {
  calcul_mental: {
    title: 'Calcul Mental',
    content: [
      'MULTIPLICATION RAPIDE',
      '• Par 11: Additionner les chiffres et placer au milieu (ex: 23 × 11 = 253)',
      '• Par 5: Multiplier par 10 puis diviser par 2',
      '• Par 25: Multiplier par 100 puis diviser par 4',
      '• Carrés: (a+b)² = a² + 2ab + b²',
      '',
      'DIVISION RAPIDE',
      '• Diviser par 5: Multiplier par 2 puis diviser par 10',
      '• Diviser par 25: Multiplier par 4 puis diviser par 100',
      '',
      'POURCENTAGES',
      '• 10% = diviser par 10',
      '• 20% = diviser par 5',
      '• 25% = diviser par 4',
      '• 50% = diviser par 2',
      '• Augmentation de x%: multiplier par (1 + x/100)',
      '• Diminution de x%: multiplier par (1 - x/100)',
      '',
      'ASTUCES',
      '• Arrondir pour simplifier les calculs',
      '• Utiliser les propriétés commutatives et associatives',
      '• Factoriser quand possible',
    ],
  },
  raisonnement_logique: {
    title: 'Raisonnement Logique',
    content: [
      'LOGIQUE PROPOSITIONNELLE',
      '• Si P alors Q (P → Q): Faux seulement si P vrai et Q faux',
      '• P si et seulement si Q (P ↔ Q): Vrai si P et Q ont même valeur',
      '• Négation de "tous": "au moins un ne"',
      '• Négation de "aucun": "au moins un"',
      '',
      'SYLLOGISMES',
      '• Tous les A sont B, tous les B sont C → Tous les A sont C',
      '• Aucun A n\'est B, tous les B sont C → Aucun A n\'est C',
      '',
      'DIAGRAMMES DE VENN',
      '• Utiliser des cercles pour représenter les ensembles',
      '• Zone d\'intersection = éléments communs',
      '',
      'PIÈGES FRÉQUENTS',
      '• Ne pas confondre "si" et "seulement si"',
      '• Attention aux quantificateurs (tous, certains, aucun)',
      '• Vérifier la réciproque d\'une implication',
    ],
  },
  expression: {
    title: 'Expression',
    content: [
      'ORTHOGRAPHE',
      '• a/à: "a" = verbe avoir, "à" = préposition',
      '• ou/où: "ou" = conjonction, "où" = pronom relatif',
      '• ce/se: "ce" = déterminant, "se" = pronom réfléchi',
      '• leur/leurs: accord avec le nom qui suit',
      '',
      'GRAMMAIRE',
      '• Accord du participe passé avec être: toujours accordé',
      '• Accord du participe passé avec avoir: accordé si COD avant',
      '• Subjonctif après: vouloir que, il faut que, avant que',
      '',
      'SYNTAXE',
      '• Éviter les répétitions',
      '• Respecter la concordance des temps',
      '• Placer correctement les pronoms compléments',
      '',
      'VOCABULAIRE',
      '• Distinguer les paronymes (affecter/effacer, etc.)',
      '• Connaître les nuances de sens',
    ],
  },
  comprehension_textes: {
    title: 'Compréhension de Textes',
    content: [
      'MÉTHODE DE LECTURE',
      '1. Lire une première fois pour comprendre le sens général',
      '2. Identifier la thèse principale',
      '3. Repérer les arguments et exemples',
      '4. Noter les mots-clés et concepts importants',
      '',
      'TYPES DE QUESTIONS',
      '• Idée principale: chercher la thèse de l\'auteur',
      '• Détails: repérer les informations précises',
      '• Inférence: déduire ce qui n\'est pas explicitement dit',
      '• Vocabulaire: comprendre le sens en contexte',
      '',
      'STRATÉGIES',
      '• Lire d\'abord les questions pour orienter la lecture',
      '• Surligner les passages importants',
      '• Attention aux mots de liaison (mais, cependant, donc)',
      '• Distinguer l\'opinion de l\'auteur des faits',
      '',
      'PIÈGES',
      '• Ne pas confondre l\'opinion de l\'auteur avec la vôtre',
      '• Éviter les interprétations trop personnelles',
      '• Vérifier que la réponse est bien dans le texte',
    ],
  },
  conditions_minimales: {
    title: 'Conditions Minimales',
    content: [
      'PRINCIPE',
      '• Trouver le nombre minimum de conditions nécessaires',
      '• Éliminer les conditions redondantes',
      '• Identifier les conditions essentielles',
      '',
      'MÉTHODE',
      '1. Lister toutes les conditions données',
      '2. Identifier les dépendances entre conditions',
      '3. Tester en retirant chaque condition',
      '4. Garder seulement celles qui sont indispensables',
      '',
      'TYPES DE CONDITIONS',
      '• Nécessaires: sans elles, le résultat est impossible',
      '• Suffisantes: elles garantissent le résultat',
      '• Redondantes: déjà couvertes par d\'autres',
      '',
      'STRATÉGIES',
      '• Utiliser des tableaux de vérité',
      '• Tester des cas limites',
      '• Vérifier les implications logiques',
      '',
      'PIÈGES',
      '• Ne pas confondre nécessaire et suffisant',
      '• Attention aux conditions implicites',
    ],
  },
  resolution_problemes: {
    title: 'Résolution de Problèmes',
    content: [
      'MÉTHODE GÉNÉRALE',
      '1. Lire attentivement l\'énoncé',
      '2. Identifier les données et l\'inconnue',
      '3. Choisir la méthode de résolution',
      '4. Mettre en équation si nécessaire',
      '5. Résoudre et vérifier',
      '',
      'TYPES DE PROBLÈMES',
      '• Proportions et pourcentages',
      '• Problèmes de vitesse, distance, temps',
      '• Problèmes de partage',
      '• Problèmes de mélange',
      '',
      'FORMULES UTILES',
      '• Vitesse = Distance / Temps',
      '• Pourcentage = (Partie / Total) × 100',
      '• Moyenne = Somme / Nombre',
      '• Probabilité = Cas favorables / Cas possibles',
      '',
      'STRATÉGIES',
      '• Faire un schéma si utile',
      '• Traduire en équations',
      '• Vérifier la cohérence du résultat',
      '• Utiliser des valeurs numériques simples pour tester',
      '',
      'PIÈGES',
      '• Attention aux unités',
      '• Vérifier que la réponse répond bien à la question',
      '• Ne pas oublier les cas particuliers',
    ],
  },
};

export default function CheatsheetPage() {
  const params = useParams();
  const router = useRouter();
  const section = (params.section as any) || SECTION_IDS[0];
  
  const sectionData = SECTIONS[section];
  const cheatsheet = CHEATSHEETS[section] || CHEATSHEETS.calcul_mental;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cheat Sheet - {sectionData.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Résumé des méthodes et formules essentielles
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={section}
              onChange={(e) => router.push(`/cheatsheet/${e.target.value}`)}
              className="w-auto"
            >
              {SECTION_IDS.map((sectionId) => (
                <option key={sectionId} value={sectionId}>
                  {SECTIONS[sectionId].name}
                </option>
              ))}
            </Select>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </div>

        <Card className="print:shadow-none print:border-0">
          <CardHeader>
            <CardTitle className="text-2xl">{cheatsheet.title}</CardTitle>
            <CardDescription>Méthodes, formules et astuces essentielles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <div className="space-y-2 font-mono text-sm">
                {cheatsheet.content.map((line, idx) => {
                  if (line === '') {
                    return <div key={idx} className="h-2" />;
                  }
                  if (line.startsWith('•')) {
                    return (
                      <div key={idx} className="ml-4 text-gray-700 dark:text-gray-300">
                        {line}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={idx}
                      className="font-bold text-lg mt-4 mb-2 text-gray-900 dark:text-gray-100"
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Conseils Généraux</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Entraînez-vous régulièrement pour automatiser les méthodes</li>
              <li>• Mémorisez les formules les plus fréquentes</li>
              <li>• Gérez votre temps: ne passez pas trop de temps sur une question</li>
              <li>• Vérifiez toujours vos réponses si le temps le permet</li>
              <li>• Restez calme et méthodique</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

