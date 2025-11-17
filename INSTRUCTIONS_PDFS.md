# Instructions pour ajouter les PDFs des Tests Blancs

## Méthode 1 : Téléchargement manuel

1. **Téléchargez les PDFs** depuis les sites officiels :
   - **Fnege** : https://www.tage-mage.com (section tests blancs)
   - **Ecricome** : https://www.ecricome.org
   - **Concours Pass** : https://www.concours-pass.fr
   - **Concours Sésame** : https://www.concours-sesame.net
   - **Concours Accès** : https://www.concours-acces.com
   - **Concours Link** : https://www.concours-link.fr
   - **Ambitions+** : https://www.ambitionsplus.fr
   - **Concours Team** : https://www.concours-team.fr

2. **Renommez les fichiers** selon cette structure :
   - `fnege-2024.pdf`
   - `fnege-2023.pdf`
   - `fnege-annales.pdf`
   - `ecricome.pdf`
   - `pass.pdf`
   - `sesame.pdf`
   - `acces.pdf`
   - `link.pdf`
   - `ambitions.pdf`
   - `team.pdf`

3. **Placez-les** dans le dossier : `public/pdfs/tests-blancs/`

## Méthode 2 : Script automatique (si les URLs sont disponibles)

Exécutez :
```bash
npm run download-pdfs
```

**Note** : Les tests blancs officiels nécessitent souvent une inscription sur les sites des organisateurs. Le script essaiera de télécharger depuis des URLs publiques, mais vous devrez peut-être les télécharger manuellement.

## Vérification

Une fois les PDFs ajoutés, ils seront automatiquement détectés et les boutons "Ouvrir" et "Télécharger" seront actifs sur la page Tests Blancs.

