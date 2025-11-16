# Guide d'authentification GitHub

## Méthode 1 : Token d'accès personnel (Recommandé)

### Étape 1 : Créer un token sur GitHub

1. Allez sur https://github.com/settings/tokens
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom : `tage-mage-platform`
4. Sélectionnez les permissions :
   - ✅ **repo** (toutes les cases cochées)
5. Cliquez sur **"Generate token"** en bas
6. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après !)

### Étape 2 : Utiliser le token pour pousser

Quand vous faites `git push`, GitHub vous demandera :
- **Username** : votre nom d'utilisateur GitHub
- **Password** : collez le token (pas votre mot de passe GitHub)

### Étape 3 : Pousser le code

```bash
git push -u origin main
```

Quand demandé :
- Username : `VOTRE_USERNAME`
- Password : `VOTRE_TOKEN` (celui que vous avez copié)

---

## Méthode 2 : Installer GitHub CLI (Alternative)

### Installer GitHub CLI

1. Téléchargez depuis : https://cli.github.com/
2. Installez l'application
3. Redémarrez le terminal

### Se connecter

```bash
gh auth login
```

Suivez les instructions à l'écran.

---

## Méthode 3 : Configuration Git Credential Manager

Windows devrait avoir Git Credential Manager installé. Quand vous faites `git push` :

1. Une fenêtre de navigateur s'ouvrira
2. Connectez-vous à GitHub
3. Autorisez l'accès
4. Le push se fera automatiquement

---

## Vérifier votre configuration

```bash
git remote -v
```

Devrait afficher :
```
origin  https://github.com/VOTRE_USERNAME/tage-mage-platform.git (fetch)
origin  https://github.com/VOTRE_USERNAME/tage-mage-platform.git (push)
```

## Si vous devez changer l'URL du remote

```bash
git remote set-url origin https://github.com/VOTRE_USERNAME/tage-mage-platform.git
```

Remplacez `VOTRE_USERNAME` par votre vrai nom d'utilisateur GitHub.

