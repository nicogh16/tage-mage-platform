# Migrations de Base de Données

## Migration: Ajout du champ `test_name` à la table `scores`

### Fichier: `add_test_name_to_scores.sql`

Cette migration ajoute un champ `test_name` à la table `scores` pour permettre de regrouper les scores par test (test-1, test-2, etc.).

### Comment appliquer la migration

#### Option 1: Via Supabase Dashboard

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Copiez le contenu du fichier `add_test_name_to_scores.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run**

#### Option 2: Via Supabase CLI

```bash
supabase db push
```

Ou si vous utilisez directement psql:

```bash
psql -h [your-host] -U [your-user] -d [your-database] -f add_test_name_to_scores.sql
```

### Ce que fait cette migration

- Ajoute la colonne `test_name` (TEXT, nullable) à la table `scores`
- Crée un index sur `test_name` pour améliorer les performances des requêtes
- Les scores existants auront `test_name = NULL` (compatible avec l'existant)

### Compatibilité

Cette migration est **rétrocompatible** :
- Les scores existants continueront de fonctionner (test_name sera NULL)
- Les nouvelles fonctionnalités nécessitent simplement de spécifier un test_name lors de l'ajout d'un score

