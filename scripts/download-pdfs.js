const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// URLs potentielles des PDFs officiels (à tester)
const PDF_SOURCES = [
  {
    filename: 'fnege-2024.pdf',
    urls: [
      'https://www.tage-mage.com/pdf/test-blanc-2024.pdf',
      'https://www.fnege.fr/pdf/test-blanc-tage-mage-2024.pdf',
      'https://www.tage-mage.com/downloads/test-blanc-officiel-2024.pdf',
    ],
  },
  {
    filename: 'fnege-2023.pdf',
    urls: [
      'https://www.tage-mage.com/pdf/test-blanc-2023.pdf',
      'https://www.fnege.fr/pdf/test-blanc-tage-mage-2023.pdf',
    ],
  },
  {
    filename: 'fnege-annales.pdf',
    urls: [
      'https://www.tage-mage.com/pdf/annales.pdf',
      'https://www.fnege.fr/pdf/annales-tage-mage.pdf',
    ],
  },
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'tests-blancs');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        return downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        reject(new Error('Not a PDF file'));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(new Error('Timeout'));
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

async function tryDownloadPDF(source) {
  const filepath = path.join(OUTPUT_DIR, source.filename);
  
  // Skip si le fichier existe déjà
  if (fs.existsSync(filepath)) {
    console.log(`✓ Déjà présent: ${source.filename}`);
    return true;
  }
  
  console.log(`\nTentative de téléchargement: ${source.filename}`);
  
  for (const url of source.urls) {
    try {
      console.log(`  Essai: ${url}`);
      await downloadFile(url, filepath);
      console.log(`  ✓ Succès!`);
      return true;
    } catch (error) {
      console.log(`  ✗ Échec: ${error.message}`);
    }
  }
  
  console.log(`  ⊘ Aucune URL valide trouvée pour ${source.filename}`);
  return false;
}

async function downloadAllPDFs() {
  console.log('Recherche et téléchargement des PDFs officiels...\n');
  console.log('Note: Les PDFs officiels peuvent nécessiter une inscription sur les sites des organisateurs.\n');
  
  let successCount = 0;
  
  for (const source of PDF_SOURCES) {
    const success = await tryDownloadPDF(source);
    if (success) successCount++;
  }
  
  console.log(`\n${successCount}/${PDF_SOURCES.length} PDFs téléchargés.`);
  console.log('\nPour les autres PDFs, vous devrez les télécharger manuellement depuis:');
  console.log('- https://www.tage-mage.com');
  console.log('- https://www.ecricome.org');
  console.log('- Sites des concours (Pass, Sésame, Accès, etc.)');
  console.log('\nPlacez-les dans: public/pdfs/tests-blancs/');
}

downloadAllPDFs().catch(console.error);
