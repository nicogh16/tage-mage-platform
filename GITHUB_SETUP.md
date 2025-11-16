# Instructions pour pousser sur GitHub

## 1. Créer le dépôt sur GitHub

1. Allez sur https://github.com/new
2. Nom du dépôt : `tage-mage-platform` (ou un autre nom de votre choix)
3. Description : "Plateforme d'entraînement Tage Mage - Suivi des scores et notes de révision"
4. Choisissez **Public** ou **Private**
5. **NE COCHEZ PAS** "Initialize this repository with a README" (on a déjà un README)
6. Cliquez sur **Create repository**

## 2. Connecter le dépôt local à GitHub

Après avoir créé le dépôt, GitHub vous donnera des commandes. Utilisez celles-ci :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/tage-mage-platform.git
git branch -M main
git push -u origin main
```

**Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub.**

## 3. Alternative : Si vous préférez utiliser SSH

Si vous avez configuré SSH avec GitHub :

```bash
git remote add origin git@github.com:VOTRE_USERNAME/tage-mage-platform.git
git branch -M main
git push -u origin main
```

## 4. Vérification

Après le push, allez sur votre dépôt GitHub pour vérifier que tous les fichiers sont bien présents.

## ⚠️ Important

Le fichier `.env.local` est dans `.gitignore` et ne sera **PAS** poussé sur GitHub (c'est normal pour la sécurité).

Si vous voulez que d'autres personnes puissent utiliser le projet, créez un fichier `.env.example` avec :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
```

