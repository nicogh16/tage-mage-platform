/**
 * Script pour télécharger des PDFs depuis des URLs spécifiques
 * Usage: node scripts/download-from-urls.js [url1] [url2] ...
 * Ou: créer un fichier urls.txt avec une URL par ligne
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'tests-blancs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function downloadFile(url, filepath, timeout = 30000) {
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
      
      response.pipe(file);
      
      response.on('data', (chunk) => {
        downloaded += chunk.length;
      });
      
      file.on('finish', () => {
        file.close();
        try {
          const buffer = Buffer.alloc(4);
          const fd = fs.openSync(filepath, 'r');
          fs.readSync(fd, buffer, 0, 4, 0);
          fs.closeSync(fd);
          
          const header = buffer.toString();
          if (header === '%PDF') {
            const stats = fs.statSync(filepath);
            if (stats.size > 1000) {
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

function extractFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = path.basename(pathname);
    if (filename && filename.endsWith('.pdf')) {
      return filename;
    }
    // Générer un nom basé sur le domaine et la date
    const domain = urlObj.hostname.replace('www.', '').split('.')[0];
    return `${domain}-${Date.now()}.pdf`;
  } catch {
    return `download-${Date.now()}.pdf`;
  }
}

async function downloadFromUrl(url, customFilename = null) {
  const filename = customFilename || extractFilenameFromUrl(url);
  const filepath = path.join(OUTPUT_DIR, filename);
  
  console.log(`\n📥 Téléchargement: ${filename}`);
  console.log(`   URL: ${url}`);
  
  try {
    const result = await downloadFile(url, filepath);
    console.log(`   ✅ Succès! (${(result.size / 1024).toFixed(1)} KB)`);
    return { success: true, filename, size: result.size };
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    return { success: false, filename, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  // Vérifier si un fichier urls.txt existe
  const urlsFile = path.join(__dirname, 'urls.txt');
  let urls = [];
  
  if (args.length > 0) {
    urls = args;
  } else if (fs.existsSync(urlsFile)) {
    console.log('📄 Lecture du fichier urls.txt...\n');
    const content = fs.readFileSync(urlsFile, 'utf-8');
    urls = content.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#') && line.startsWith('http'));
  } else {
    console.log('📝 Script de téléchargement de PDFs depuis des URLs\n');
    console.log('Usage:');
    console.log('  1. Passer des URLs en arguments:');
    console.log('     node scripts/download-from-urls.js <url1> <url2> ...\n');
    console.log('  2. Créer un fichier urls.txt avec une URL par ligne:');
    console.log('     node scripts/download-from-urls.js\n');
    console.log('Exemple urls.txt:');
    console.log('  # Commentaires commencent par #');
    console.log('  https://example.com/test1.pdf');
    console.log('  https://example.com/test2.pdf\n');
    console.log('💡 Astuce: Trouvez des URLs de PDFs sur:');
    console.log('   - Les forums (Prepa-HEC, Étudiant.com)');
    console.log('   - Les drives partagés (Google Drive, Dropbox)');
    console.log('   - Les sites de préparation (TageMajor, Ipesup)\n');
    return;
  }
  
  if (urls.length === 0) {
    console.log('❌ Aucune URL trouvée');
    return;
  }
  
  console.log(`🔍 ${urls.length} URL(s) à télécharger\n`);
  console.log('='.repeat(60));
  
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await downloadFromUrl(url);
    results.push(result);
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  const successCount = results.filter(r => r.success).length;
  console.log(`✅ Résultat: ${successCount}/${urls.length} PDFs téléchargés`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (successCount > 0) {
    console.log('PDFs téléchargés:');
    results.filter(r => r.success).forEach(r => {
      console.log(`   ✓ ${r.filename} (${(r.size / 1024).toFixed(1)} KB)`);
    });
  }
  
  if (successCount < urls.length) {
    console.log('\nÉchecs:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   ✗ ${r.filename}: ${r.error}`);
    });
  }
}

main().catch(console.error);

