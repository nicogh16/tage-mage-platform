# Plateforme d'entraînement Tage Mage

Une application web complète pour suivre votre progression et améliorer vos scores au Tage Mage.

## 🎯 Fonctionnalités

- **Suivi des scores** : Enregistrez vos scores pour chaque section du Tage Mage
- **Tableaux de bord** : Visualisez votre progression avec des graphiques interactifs
- **Notes de révision** : Créez et organisez vos notes par section et catégorie
- **Cheat Sheets** : Accédez rapidement aux méthodes et formules essentielles
- **Mode sombre** : Interface adaptée à vos préférences
- **Recherche** : Trouvez rapidement vos notes avec la recherche par mots-clés

## 🛠️ Technologies

- **Frontend** : Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend** : Supabase (Auth + Database)
- **State Management** : Zustand
- **Charts** : Recharts
- **Icons** : Lucide React

## 📋 Prérequis

- Node.js 18+ et npm/yarn
- Un compte Supabase (gratuit)

## 🚀 Installation

### 1. Cloner et installer les dépendances

```bash
cd "C:\Users\nicol\TAGE MAGE"
npm install
```

### 2. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Allez dans **SQL Editor** et exécutez le script `database/schema.sql`
3. Récupérez votre URL et votre clé anonyme dans **Settings > API**

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
```

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
TAGE MAGE/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Page d'accueil avec statistiques
│   ├── scores/            # Gestion des scores
│   ├── notes/[section]/   # Notes par section
│   ├── cheatsheet/[section]/ # Cheat sheets
│   └── login/             # Authentification
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── charts/           # Composants de graphiques
│   └── layout/           # Composants de layout
├── lib/                  # Utilitaires et configuration
│   ├── supabase/         # Clients Supabase
│   ├── store/            # Stores Zustand
│   └── constants.ts      # Constantes de l'application
├── database/             # Schémas SQL
│   ├── schema.sql        # Schéma de base de données
│   └── seed.sql          # Données d'exemple
└── middleware.ts         # Middleware Next.js pour l'auth
```

## 🗄️ Base de données

### Tables

- **scores** : Stocke les scores des utilisateurs par section
- **notes** : Stocke les notes de révision des utilisateurs

### Sécurité

- Row Level Security (RLS) activé
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Authentification via Supabase Auth

## 📊 Sections Tage Mage

1. **Calcul Mental**
2. **Raisonnement Logique**
3. **Expression**
4. **Compréhension de Textes**
5. **Conditions Minimales**
6. **Résolution de Problèmes**

## 🎨 Fonctionnalités principales

### Dashboard
- Vue d'ensemble des performances
- Graphique radar des forces/faiblesses
- Statistiques globales
- Derniers scores

### Scores
- Ajout de nouveaux scores
- Historique par section
- Graphiques de progression
- Suppression de scores

### Notes
- Création de notes par catégorie :
  - 💡 Choses que je ne savais pas
  - ⚠️ Erreurs à retenir
  - 📚 Règles à mémoriser par cœur
  - 🪤 Pièges typiques
  - 📝 Notes personnelles
- Recherche et filtrage
- Tags personnalisés
- Édition et suppression

### Cheat Sheets
- Résumés par section
- Méthodes et formules essentielles
- Impression optimisée

## 🔒 Authentification

L'application utilise Supabase Auth avec :
- Inscription par email/mot de passe
- Connexion sécurisée
- Sessions persistantes
- Protection des routes

## 🎯 Prochaines améliorations possibles

- Mode timer pour les entraînements
- Examens blancs complets
- Export PDF des notes et cheat sheets
- Statistiques avancées
- Objectifs personnalisés
- Rappels de révision

## 📝 Notes de développement

- Le code est modulaire et facilement extensible
- Les composants sont réutilisables
- Le dark mode est géré via localStorage
- Les graphiques utilisent Recharts pour la performance

## 🐛 Dépannage

### Erreur de connexion Supabase
- Vérifiez vos variables d'environnement
- Assurez-vous que RLS est correctement configuré

### Problèmes d'authentification
- Vérifiez que l'email de confirmation n'est pas requis dans Supabase
- Ou activez l'email de confirmation dans les paramètres Supabase

### Erreurs de build
- Supprimez `.next` et `node_modules`, puis réinstallez
- Vérifiez que vous utilisez Node.js 18+

## 📄 Licence

Ce projet est un projet personnel d'entraînement.

## 👤 Auteur

Développé pour l'entraînement au Tage Mage.

---

Bon entraînement ! 🎓

