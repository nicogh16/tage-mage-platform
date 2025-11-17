const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Toutes les sources possibles pour télécharger les PDFs
const PDF_SOURCES = {
  'fnege-2024.pdf': [
    // Sources Fnege officielles
    'https://www.tage-mage.com/media/files/test-blanc-officiel-2024.pdf',
    'https://www.fnege.fr/wp-content/uploads/test-blanc-tage-mage-2024.pdf',
    'https://www.tage-mage.com/downloads/test-blanc-2024.pdf',
    'https://www.tagemage.fr/media/files/test-blanc-2024.pdf',
  ],
  'fnege-2023.pdf': [
    'https://www.tage-mage.com/media/files/test-blanc-officiel-2023.pdf',
    'https://www.fnege.fr/wp-content/uploads/test-blanc-tage-mage-2023.pdf',
    'https://www.tagemage.fr/media/files/test-blanc-2023.pdf',
  ],
  'fnege-annales.pdf': [
    'https://www.tage-mage.com/media/files/annales-tage-mage.pdf',
    'https://www.fnege.fr/wp-content/uploads/annales-officielles-tage-mage.pdf',
    'https://www.tagemage.fr/media/files/annales.pdf',
  ],
  'ecricome.pdf': [
    'https://www.ecricome.org/wp-content/uploads/test-blanc-tage-mage.pdf',
    'https://www.ecricome.org/media/files/tage-mage-blanc.pdf',
    'https://www.ecricome.org/preparation/tage-mage/test-blanc.pdf',
  ],
  'pass.pdf': [
    'https://www.concours-pass.fr/wp-content/uploads/test-blanc-tage-mage.pdf',
    'https://www.concours-pass.fr/media/tage-mage-blanc.pdf',
  ],
  'sesame.pdf': [
    'https://www.concours-sesame.net/wp-content/uploads/test-blanc-tage-mage.pdf',
    'https://www.concours-sesame.net/media/tage-mage.pdf',
  ],
  'acces.pdf': [
    'https://www.concours-acces.com/wp-content/uploads/test-blanc-tage-mage.pdf',
    'https://www.concours-acces.com/media/tage-mage.pdf',
  ],
  'link.pdf': [
    'https://www.concours-link.fr/wp-content/uploads/test-blanc-tage-mage.pdf',
  ],
  'ambitions.pdf': [
    'https://www.concours-ambitionsplus.fr/wp-content/uploads/test-blanc-tage-mage.pdf',
  ],
  'team.pdf': [
    'https://www.concours-team.fr/wp-content/uploads/test-blanc-tage-mage.pdf',
  ],
};

// Sources de sites de préparation gratuits
const FREE_RESOURCES = [
  {
    name: 'TageMajor',
    url: 'https://tagemajor.com/tage-mage/tage-mage-annales-pdf/',
    files: ['tagemajor-exercices.pdf', 'tagemajor-test-blanc.pdf'],
  },
  {
    name: 'Ipesup',
    url: 'https://www.ipesup.fr/les-cahiers-ipesup-ast-tage-mage-blanc/',
    files: ['ipesup-test-blanc.pdf'],
  },
  {
    name: 'PGE-PGO',
    url: 'https://pge-pgo.fr',
    files: ['pge-pgo-livret.pdf'],
  },
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'tests-blancs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadFile(url, filepath, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    let downloaded = 0;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/pdf,application/octet-stream,*/*',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Referer': 'https://www.google.com/',
      },
      rejectUnauthorized: false,
      timeout: timeout,
    };
    
    const request = protocol.get(url, options, (response) => {
      // Gérer les redirections
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          reject(new Error('No redirect location'));
          return;
        }
        const fullUrl = redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href;
        return downloadFile(fullUrl, filepath, timeout).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('pdf') && !contentType.includes('octet-stream') && !contentType.includes('application')) {
        // On continue quand même, certains serveurs ne renvoient pas le bon content-type
      }
      
      response.pipe(file);
      
      response.on('data', (chunk) => {
        downloaded += chunk.length;
      });
      
      file.on('finish', () => {
        file.close();
        try {
          // Vérifier que c'est un PDF valide
          const buffer = Buffer.alloc(4);
          const fd = fs.openSync(filepath, 'r');
          fs.readSync(fd, buffer, 0, 4, 0);
          fs.closeSync(fd);
          
          const header = buffer.toString();
          if (header === '%PDF') {
            const stats = fs.statSync(filepath);
            if (stats.size > 1000) { // Au moins 1KB
              resolve({ size: stats.size, downloaded });
            } else {
              fs.unlinkSync(filepath);
              reject(new Error('File too small'));
            }
          } else {
            fs.unlinkSync(filepath);
            reject(new Error('Not a valid PDF'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });
    
    request.setTimeout(timeout, () => {
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
  
  // Vérifier si le fichier existe déjà et est valide
  if (fs.existsSync(filepath)) {
    try {
      const stats = fs.statSync(filepath);
      if (stats.size > 5000) { // Si > 5KB, c'est probablement un vrai PDF
        const buffer = Buffer.alloc(4);
        const fd = fs.openSync(filepath, 'r');
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);
        if (buffer.toString() === '%PDF') {
          console.log(`✓ Déjà présent: ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
          return true;
        }
      }
    } catch (err) {
      // Fichier corrompu, on continue
    }
  }
  
  console.log(`\n📄 ${filename}`);
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      process.stdout.write(`  [${i + 1}/${urls.length}] ${new URL(url).hostname}... `);
      const result = await downloadFile(url, filepath);
      console.log(`✓ Succès! (${(result.size / 1024).toFixed(1)} KB)`);
      return true;
    } catch (error) {
      process.stdout.write(`✗\n`);
    }
  }
  
  console.log(`  ⊘ Aucune source valide`);
  return false;
}

async function scrapePageForPDFs(url, baseUrl) {
  // Cette fonction pourrait être améliorée pour scraper les pages HTML
  // et trouver les liens PDF, mais c'est complexe et peut violer les ToS
  // Pour l'instant, on retourne un tableau vide
  return [];
}

async function main() {
  console.log('🔍 Recherche et téléchargement des PDFs Tage Mage...\n');
  console.log('⚠️  Note: Les PDFs officiels nécessitent souvent une inscription.\n');
  console.log('Le script va essayer de télécharger depuis toutes les sources connues.\n');
  console.log('='.repeat(60));
  
  let successCount = 0;
  const total = Object.keys(PDF_SOURCES).length;
  
  // Télécharger depuis les sources principales
  for (const [filename, urls] of Object.entries(PDF_SOURCES)) {
    const success = await tryDownloadPDF(filename, urls);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pause entre les téléchargements
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Résultat: ${successCount}/${total} PDFs téléchargés`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (successCount < total) {
    console.log('📝 Instructions pour ajouter les PDFs manuellement:\n');
    console.log('1. Visitez les sites officiels et forums:');
    console.log('   • https://www.tage-mage.com');
    console.log('   • https://www.prepa-hec.org (forum)');
    console.log('   • https://www.letudiant.fr/forums');
    console.log('   • https://tagemajor.com/tage-mage/tage-mage-annales-pdf/\n');
    console.log('2. Téléchargez les PDFs');
    console.log(`3. Placez-les dans: ${OUTPUT_DIR}\n`);
    console.log('📖 Consultez FORUM_RESOURCES.md pour plus de sources\n');
    
    console.log('PDFs manquants:');
    for (const filename of Object.keys(PDF_SOURCES)) {
      const filepath = path.join(OUTPUT_DIR, filename);
      if (!fs.existsSync(filepath) || fs.statSync(filepath).size < 5000) {
        console.log(`   - ${filename}`);
      }
    }
  } else {
    console.log('🎉 Tous les PDFs ont été téléchargés avec succès!');
  }
}

main().catch(console.error);

