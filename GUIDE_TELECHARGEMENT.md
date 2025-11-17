# 📥 Guide Complet de Téléchargement des PDFs Tage Mage

## 🎯 Méthode Recommandée

Les PDFs officiels ne sont **pas disponibles en téléchargement direct gratuit**. Voici comment les obtenir :

### Option 1: Téléchargement Manuel (Recommandé)

1. **Visitez les forums** listés dans `FORUM_RESOURCES.md`
2. **Trouvez des liens** vers des PDFs (drives partagés, liens directs)
3. **Téléchargez manuellement** et placez-les dans `public/pdfs/tests-blancs/`

### Option 2: Utiliser le Script avec URLs

Si vous trouvez des URLs directes vers des PDFs :

1. **Créez un fichier** `scripts/urls.txt` (voir `scripts/urls.txt.example`)
2. **Ajoutez les URLs** (une par ligne)
3. **Exécutez** : `npm run download-from-urls`

Ou passez les URLs directement :
```bash
npm run download-from-urls "https://example.com/test1.pdf" "https://example.com/test2.pdf"
```

## 🔍 Où Trouver des URLs de PDFs

### 1. Forums d'Étudiants

#### Prepa-HEC.org
- **URL**: https://www.prepa-hec.org
- **Comment**: 
  - Inscrivez-vous (gratuit)
  - Cherchez dans la section "Tage Mage" ou "Admissions parallèles"
  - Les membres partagent souvent des liens Google Drive ou Dropbox
  - Copiez les URLs directes des PDFs

#### Forum de l'Étudiant
- **URL**: https://www.letudiant.fr/forums
- **Comment**: Même processus que Prepa-HEC

#### Reddit
- **Subreddits**: r/prepa, r/concours
- **Comment**: 
  - Cherchez "Tage Mage PDF" ou "Tage Mage drive"
  - Les posts contiennent souvent des liens vers des drives partagés

### 2. Google Drive Partagés

Quand vous trouvez un lien Google Drive :
1. Ouvrez le lien
2. Clic droit sur le PDF → "Obtenir le lien"
3. Modifiez l'URL pour forcer le téléchargement :
   ```
   https://drive.google.com/uc?export=download&id=FILE_ID
   ```
   (Remplacez FILE_ID par l'ID du fichier)

### 3. Dropbox Partagés

Pour les liens Dropbox :
1. Ouvrez le lien
2. Ajoutez `?dl=1` à la fin de l'URL pour forcer le téléchargement :
   ```
   https://www.dropbox.com/s/XXXXX/file.pdf?dl=1
   ```

### 4. Sites de Préparation

#### TageMajor
- **URL**: https://tagemajor.com/tage-mage/tage-mage-annales-pdf/
- **Comment**: 
  - Inscrivez-vous (gratuit)
  - Téléchargez les exercices PDF
  - Notez l'URL du PDF téléchargé

#### Ipesup
- **URL**: https://www.ipesup.fr/les-cahiers-ipesup-ast-tage-mage-blanc/
- **Comment**: Téléchargez les tests blancs disponibles

## 📝 Format du Fichier urls.txt

Créez `scripts/urls.txt` avec ce format :

```
# Commentaires commencent par #
# URLs des PDFs à télécharger

https://drive.google.com/uc?export=download&id=1ABC123...
https://www.dropbox.com/s/XXXXX/test-blanc.pdf?dl=1
https://example.com/path/to/annales.pdf
```

## ⚙️ Commandes Disponibles

```bash
# Tenter de télécharger depuis des URLs connues (généralement échoue)
npm run download-pdfs

# Télécharger depuis un fichier urls.txt ou des URLs en argument
npm run download-from-urls

# Créer des PDFs de démonstration pour tester
npm run create-demo-pdfs

# Générer un rapport des sources de forums
npm run find-forum-resources
```

## ✅ Vérification

Après téléchargement, vérifiez que les PDFs sont bien dans :
```
public/pdfs/tests-blancs/
```

Les fichiers doivent :
- Avoir l'extension `.pdf`
- Faire au moins 1 KB
- Commencer par `%PDF` (format PDF valide)

## 🚨 Problèmes Courants

### "HTTP 403" ou "HTTP 401"
- Le PDF nécessite une authentification
- Téléchargez-le manuellement depuis votre navigateur

### "Not a valid PDF"
- Le fichier téléchargé n'est pas un PDF
- Vérifiez l'URL (peut-être une page HTML au lieu d'un PDF)

### "Timeout"
- Le serveur est lent ou l'URL est invalide
- Essayez de télécharger manuellement

### "File too small"
- Le fichier téléchargé est probablement une page d'erreur
- Vérifiez l'URL

## 💡 Astuces

1. **Utilisez votre navigateur** : Ouvrez les liens dans votre navigateur pour vérifier qu'ils fonctionnent
2. **Vérifiez les droits** : Certains PDFs nécessitent une connexion ou une inscription
3. **Sauvegardez les URLs** : Gardez une copie des URLs qui fonctionnent
4. **Nommez correctement** : Renommez les PDFs selon la convention (voir `HOW_TO_ADD_PDFS.md`)

## 📚 Ressources Complémentaires

- `FORUM_RESOURCES.md` - Liste complète des forums et sites
- `public/pdfs/tests-blancs/HOW_TO_ADD_PDFS.md` - Guide d'ajout manuel
- `scripts/urls.txt.example` - Exemple de fichier URLs

---
*Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}*

