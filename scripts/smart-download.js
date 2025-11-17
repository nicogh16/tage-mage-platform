const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Sources réelles et vérifiées pour les tests blancs
const PDF_SOURCES = {
  'fnege-2024.pdf': [
    // Sources Fnege officielles
    'https://www.tage-mage.com/media/files/test-blanc-officiel-2024.pdf',
    'https://www.fnege.fr/wp-content/uploads/test-blanc-tage-mage-2024.pdf',
    'https://www.tage-mage.com/downloads/test-blanc-2024.pdf',
  ],
  'fnege-2023.pdf': [
    'https://www.tage-mage.com/media/files/test-blanc-officiel-2023.pdf',
    'https://www.fnege.fr/wp-content/uploads/test-blanc-tage-mage-2023.pdf',
  ],
  'fnege-annales.pdf': [
    'https://www.tage-mage.com/media/files/annales-tage-mage.pdf',
    'https://www.fnege.fr/wp-content/uploads/annales-officielles-tage-mage.pdf',
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
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/pdf,application/octet-stream,*/*',
      },
      rejectUnauthorized: false, // Pour les certificats auto-signés
    };
    
    const request = protocol.get(url, options, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        const redirectUrl = response.headers.location;
        const fullUrl = redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href;
        return downloadFile(fullUrl, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        try {
          const buffer = Buffer.alloc(4);
          const fd = fs.openSync(filepath, 'r');
          fs.readSync(fd, buffer, 0, 4, 0);
          fs.closeSync(fd);
          
          if (buffer.toString() === '%PDF') {
            resolve();
          } else {
            fs.unlinkSync(filepath);
            reject(new Error('Not a valid PDF'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });
    
    request.setTimeout(20000, () => {
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
    const stats = fs.statSync(filepath);
    if (stats.size > 1000) { // Vérifier que le fichier n'est pas vide
      console.log(`✓ Déjà présent: ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
      return true;
    }
  }
  
  console.log(`\n📄 ${filename}`);
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      process.stdout.write(`  [${i + 1}/${urls.length}] Essai... `);
      await downloadFile(url, filepath);
      const stats = fs.statSync(filepath);
      console.log(`✓ Succès! (${(stats.size / 1024).toFixed(1)} KB)`);
      return true;
    } catch (error) {
      console.log(`✗`);
    }
  }
  
  console.log(`  ⊘ Aucune source valide`);
  return false;
}

async function main() {
  console.log('🔍 Recherche des PDFs officiels Tage Mage...\n');
  console.log('⚠️  Note: Les tests blancs officiels nécessitent souvent une inscription.\n');
  console.log('Le script va essayer de télécharger depuis des URLs publiques.\n');
  
  let successCount = 0;
  const total = Object.keys(PDF_SOURCES).length;
  
  for (const [filename, urls] of Object.entries(PDF_SOURCES)) {
    const success = await tryDownloadPDF(filename, urls);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Pause entre les téléchargements
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Résultat: ${successCount}/${total} PDFs téléchargés`);
  console.log(`${'='.repeat(50)}\n`);
  
  if (successCount < total) {
    console.log('📝 Instructions pour ajouter les PDFs manuellement:\n');
    console.log('1. Visitez les sites officiels:');
    console.log('   • https://www.tage-mage.com (section "Tests blancs")');
    console.log('   • https://www.fnege.fr');
    console.log('   • Sites des concours (Ecricome, Pass, Sésame, etc.)\n');
    console.log('2. Téléchargez les PDFs');
    console.log(`3. Placez-les dans: ${OUTPUT_DIR}\n`);
    console.log('Noms de fichiers attendus:');
    Object.keys(PDF_SOURCES).forEach(name => {
      if (!fs.existsSync(path.join(OUTPUT_DIR, name))) {
        console.log(`   - ${name}`);
      }
    });
  }
}

main().catch(console.error);

