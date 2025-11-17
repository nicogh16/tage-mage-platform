/**
 * Script pour créer des PDFs de démonstration
 * Ces PDFs servent uniquement à tester le système
 * Remplacez-les par les vrais PDFs officiels quand vous les aurez
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'tests-blancs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Créer un PDF minimal valide (juste pour tester)
function createMinimalPDF(filename, title) {
  // En-tête PDF minimal valide
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 100
>>
stream
BT
/F1 24 Tf
100 700 Td
(${title}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000306 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
406
%%EOF`;

  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, pdfContent);
  console.log(`✓ Créé: ${filename} (${(pdfContent.length / 1024).toFixed(1)} KB)`);
}

// Liste des PDFs de démonstration
const demoPDFs = [
  { filename: 'fnege-2024.pdf', title: 'Test Blanc Fnege 2024 (Demo)' },
  { filename: 'fnege-2023.pdf', title: 'Test Blanc Fnege 2023 (Demo)' },
  { filename: 'fnege-annales.pdf', title: 'Annales Fnege (Demo)' },
  { filename: 'ecricome.pdf', title: 'Test Blanc Ecricome (Demo)' },
  { filename: 'pass.pdf', title: 'Test Blanc Pass (Demo)' },
  { filename: 'sesame.pdf', title: 'Test Blanc Sesame (Demo)' },
  { filename: 'acces.pdf', title: 'Test Blanc Acces (Demo)' },
  { filename: 'link.pdf', title: 'Test Blanc Link (Demo)' },
  { filename: 'ambitions.pdf', title: 'Test Blanc Ambitions+ (Demo)' },
  { filename: 'team.pdf', title: 'Test Blanc Team (Demo)' },
];

console.log('📄 Création de PDFs de démonstration...\n');
console.log('⚠️  Ces PDFs sont uniquement pour tester le système.\n');
console.log('Remplacez-les par les vrais PDFs officiels quand vous les aurez.\n');

demoPDFs.forEach(({ filename, title }) => {
  // Ne pas écraser un vrai PDF s'il existe déjà
  const filepath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    if (stats.size > 5000) { // Si le fichier fait plus de 5KB, c'est probablement un vrai PDF
      console.log(`⊘ Ignoré (déjà présent): ${filename}`);
      return;
    }
  }
  createMinimalPDF(filename, title);
});

console.log('\n✅ PDFs de démonstration créés!');
console.log('\n📝 Pour ajouter les vrais PDFs:');
console.log('   1. Téléchargez-les depuis les sites officiels');
console.log('   2. Placez-les dans: ' + OUTPUT_DIR);
console.log('   3. Consultez: public/pdfs/tests-blancs/HOW_TO_ADD_PDFS.md');

