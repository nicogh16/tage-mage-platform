/**
 * Script pour lister les sources de forums et ressources gratuites
 * Ce script génère un rapport des endroits où chercher des annales Tage Mage
 */

const fs = require('fs');
const path = require('path');

const REPORT_PATH = path.join(__dirname, '..', 'FORUM_RESOURCES.md');

const resources = {
  forums: [
    {
      name: 'Prepa-HEC.org',
      url: 'https://www.prepa-hec.org',
      description: 'Forum principal de préparation aux concours. Section Tage Mage très active.',
      searchTerms: ['Tage Mage', 'annales', 'test blanc', 'corrigé'],
      access: 'Inscription gratuite requise',
    },
    {
      name: 'Forum de l\'Étudiant',
      url: 'https://www.letudiant.fr/forums',
      description: 'Forum généraliste avec section concours écoles de commerce.',
      searchTerms: ['Tage Mage', 'admissions parallèles', 'annales'],
      access: 'Inscription gratuite',
    },
    {
      name: 'Admissions Parallèles Forum',
      url: 'https://www.admissionsparalleles.com',
      description: 'Forum spécialisé dans les admissions parallèles et le Tage Mage.',
      searchTerms: ['Tage Mage', 'test blanc', 'ressources'],
      access: 'Inscription gratuite',
    },
    {
      name: 'Reddit',
      url: 'https://www.reddit.com',
      subreddits: ['r/prepa', 'r/concours', 'r/ecolecommerce'],
      description: 'Communautés Reddit où les étudiants partagent des ressources.',
      searchTerms: ['Tage Mage annales', 'Tage Mage PDF', 'Tage Mage drive'],
      access: 'Gratuit, pas d\'inscription requise pour lire',
    },
  ],
  sitesGratuits: [
    {
      name: 'TageMajor',
      url: 'https://tagemajor.com/tage-mage/tage-mage-annales-pdf/',
      description: 'Exercices téléchargeables en PDF, vidéos de résolution.',
      type: 'Exercices et tests',
    },
    {
      name: 'Ipesup',
      url: 'https://www.ipesup.fr/les-cahiers-ipesup-ast-tage-mage-blanc/',
      description: 'Tests blancs inédits, entièrement corrigés.',
      type: 'Tests blancs',
    },
    {
      name: 'PGE-PGO',
      url: 'https://pge-pgo.fr',
      description: 'Livrets méthodologiques, exemples de tests.',
      type: 'Ressources méthodologiques',
    },
    {
      name: 'Admissions Parallèles',
      url: 'https://www.admissionsparalleles.com/le-test-tage-mage',
      description: 'Conseils, méthodes, exemples de questions.',
      type: 'Conseils et méthodes',
    },
  ],
  strategies: [
    'Rejoignez les forums et participez activement pour gagner en crédibilité',
    'Cherchez les posts épinglés ou "mégathreads" qui contiennent des collections de ressources',
    'Utilisez la fonction recherche avec des termes comme "Tage Mage PDF", "annales", "test blanc"',
    'Demandez poliment dans les forums - les membres partagent souvent volontiers',
    'Vérifiez les dates des posts - les liens de drives peuvent expirer',
    'Rejoignez des groupes Facebook/Discord dédiés au Tage Mage',
    'Cherchez "drive partagé Tage Mage" ou "mega.nz Tage Mage" sur Google',
  ],
};

function generateReport() {
  let report = `# 📚 Banques d'annales Tage Mage - Sources Forums et Gratuites

Ce document liste les endroits où trouver des annales et tests blancs Tage Mage gratuitement.

**⚠️ Important**: Les annales officielles de la FNEGE ne sont pas disponibles gratuitement en ligne. Les ressources trouvées sur les forums sont généralement des tests blancs, exercices, ou préparations créées par des organismes privés.

## 🗣️ Forums et Communautés

`;

  resources.forums.forEach((forum, index) => {
    report += `### ${index + 1}. ${forum.name}\n\n`;
    report += `- **URL**: ${forum.url}\n`;
    if (forum.subreddits) {
      report += `- **Subreddits**: ${forum.subreddits.join(', ')}\n`;
    }
    report += `- **Description**: ${forum.description}\n`;
    report += `- **Accès**: ${forum.access}\n`;
    report += `- **Termes de recherche**: ${forum.searchTerms.join(', ')}\n\n`;
  });

  report += `## 🌐 Sites avec Ressources Gratuites

`;

  resources.sitesGratuits.forEach((site, index) => {
    report += `### ${index + 1}. ${site.name}\n\n`;
    report += `- **URL**: ${site.url}\n`;
    report += `- **Type**: ${site.type}\n`;
    report += `- **Description**: ${site.description}\n\n`;
  });

  report += `## 💡 Stratégies de Recherche

`;

  resources.strategies.forEach((strategy, index) => {
    report += `${index + 1}. ${strategy}\n`;
  });

  report += `

## 📥 Comment utiliser ces ressources

1. **Visitez les forums** et créez un compte si nécessaire
2. **Utilisez la fonction recherche** avec les termes suggérés
3. **Consultez les posts épinglés** qui contiennent souvent des collections
4. **Téléchargez les PDFs** trouvés
5. **Renommez-les** selon la convention (voir HOW_TO_ADD_PDFS.md)
6. **Placez-les** dans \`public/pdfs/tests-blancs/\`

## ⚠️ Avertissements

- Les liens de drives partagés peuvent expirer
- Vérifiez toujours la qualité et la source des PDFs
- Respectez les droits d'auteur
- Les ressources officielles de la FNEGE sont payantes et protégées
- Privilégiez les ressources légales et officielles quand possible

## 🔄 Mise à jour

Ce document a été généré automatiquement. Les liens et ressources peuvent changer.
Consultez régulièrement les forums pour trouver les ressources les plus récentes.

---
*Généré le ${new Date().toLocaleDateString('fr-FR')}*
`;

  fs.writeFileSync(REPORT_PATH, report, 'utf-8');
  console.log('✅ Rapport généré: FORUM_RESOURCES.md');
  console.log(`\n📄 Contenu:`);
  console.log(`   - ${resources.forums.length} forums listés`);
  console.log(`   - ${resources.sitesGratuits.length} sites gratuits`);
  console.log(`   - ${resources.strategies.length} stratégies de recherche`);
}

generateReport();

