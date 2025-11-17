const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Sources connues pour les tests blancs officiels
const PDF_SOURCES = {
  'fnege-2024.pdf': [
    'https://www.tage-mage.com/pdf/test-blanc-2024.pdf',
    'https://www.fnege.fr/medias/files/test-blanc-tage-mage-2024.pdf',
    'https://www.tage-mage.com/downloads/test-blanc-officiel-2024.pdf',
  ],
  'fnege-2023.pdf': [
    'https://www.tage-mage.com/pdf/test-blanc-2023.pdf',
    'https://www.fnege.fr/medias/files/test-blanc-tage-mage-2023.pdf',
  ],
  'fnege-annales.pdf': [
    'https://www.tage-mage.com/pdf/annales.pdf',
    'https://www.fnege.fr/medias/files/annales-tage-mage.pdf',
  ],
  'ecricome.pdf': [
    'https://www.ecricome.org/pdf/test-blanc-tage-mage.pdf',
    'https://www.ecricome.org/medias/test-blanc.pdf',
  ],
  'pass.pdf': [
    'https://www.concours-pass.fr/pdf/test-blanc-tage-mage.pdf',
  ],
  'sesame.pdf': [
    'https://www.concours-sesame.net/pdf/test-blanc-tage-mage.pdf',
  ],
  'acces.pdf': [
    'https://www.concours-acces.com/pdf/test-blanc-tage-mage.pdf',
  ],
  'link.pdf': [
    'https://www.concours-link.fr/pdf/test-blanc-tage-mage.pdf',
  ],
  'ambitions.pdf': [
    'https://www.ambitionsplus.fr/pdf/test-blanc-tage-mage.pdf',
  ],
  'team.pdf': [
    'https://www.concours-team.fr/pdf/test-blanc-tage-mage.pdf',
  ],
};

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'tests-blancs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    }, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const contentType = response.headers['content-type'] || '';
      const isPDF = contentType.includes('application/pdf') || 
                    contentType.includes('application/octet-stream') ||
                    url.toLowerCase().endsWith('.pdf');
      
      if (!isPDF && response.headers['content-length'] && parseInt(response.headers['content-length']) > 1000000) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error('Not a PDF'));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        // Vérifier que le fichier est bien un PDF
        const buffer = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r', start: 0, end: 4 });
        if (buffer.startsWith('%PDF')) {
          resolve();
        } else {
          fs.unlinkSync(filepath);
          reject(new Error('Not a valid PDF file'));
        }
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(new Error('Timeout'));
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function tryDownloadPDF(filename, urls) {
  const filepath = path.join(OUTPUT_DIR, filename);
  
  if (fs.existsSync(filepath)) {
    console.log(`✓ Déjà présent: ${filename}`);
    return true;
  }
  
  console.log(`\n📄 ${filename}`);
  
  for (const url of urls) {
    try {
      process.stdout.write(`  Essai: ${url.substring(0, 60)}... `);
      await downloadFile(url, filepath);
      console.log('✓ Succès!');
      return true;
    } catch (error) {
      console.log(`✗ (${error.message})`);
    }
  }
  
  console.log(`  ⊘ Aucune source valide trouvée`);
  return false;
}

async function main() {
  console.log('🔍 Recherche et téléchargement des PDFs officiels...\n');
  console.log('Note: Les PDFs peuvent nécessiter une inscription sur les sites officiels.\n');
  
  let successCount = 0;
  const total = Object.keys(PDF_SOURCES).length;
  
  for (const [filename, urls] of Object.entries(PDF_SOURCES)) {
    const success = await tryDownloadPDF(filename, urls);
    if (success) successCount++;
  }
  
  console.log(`\n✅ ${successCount}/${total} PDFs téléchargés avec succès.`);
  
  if (successCount < total) {
    console.log('\n📝 Pour les PDFs manquants:');
    console.log('1. Visitez les sites officiels:');
    console.log('   - https://www.tage-mage.com');
    console.log('   - https://www.ecricome.org');
    console.log('   - Sites des concours (Pass, Sésame, Accès, etc.)');
    console.log('2. Téléchargez les PDFs manuellement');
    console.log(`3. Placez-les dans: ${OUTPUT_DIR}`);
  }
}

main().catch(console.error);

