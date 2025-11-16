# Guide de Configuration Rapide

## Étapes d'installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer Supabase

1. **Créer un projet Supabase**
   - Allez sur https://supabase.com
   - Créez un nouveau projet
   - Notez votre URL et votre clé anonyme

2. **Créer les tables**
   - Dans Supabase, allez dans **SQL Editor**
   - Copiez le contenu de `database/schema.sql`
   - Exécutez le script

3. **Configurer l'authentification** (optionnel)
   - Dans **Authentication > Settings**
   - Désactivez "Enable email confirmations" pour le développement
   - Ou gardez-le activé et vérifiez vos emails

### 3. Variables d'environnement

Créez `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez http://localhost:3000

## Structure des fichiers

- `app/` - Pages Next.js (App Router)
- `components/` - Composants React réutilisables
- `lib/` - Utilitaires, stores, configuration
- `database/` - Schémas SQL pour Supabase

## Première utilisation

1. Créez un compte sur la page de connexion
2. Commencez à ajouter des scores dans la section "Scores"
3. Créez des notes dans "Notes"
4. Consultez les cheat sheets pour réviser

## Dépannage

**Erreur de connexion Supabase**
- Vérifiez que `.env.local` est bien créé
- Vérifiez que les variables commencent par `NEXT_PUBLIC_`
- Redémarrez le serveur de développement

**Erreur RLS (Row Level Security)**
- Vérifiez que le script `schema.sql` a été exécuté
- Vérifiez que les politiques RLS sont créées

**Erreur de build**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Fonctionnalités principales

✅ Authentification email/mot de passe
✅ Suivi des scores par section
✅ Graphiques de progression
✅ Système de notes avec catégories
✅ Cheat sheets par section
✅ Mode sombre
✅ Recherche dans les notes

Bon entraînement ! 🎓

