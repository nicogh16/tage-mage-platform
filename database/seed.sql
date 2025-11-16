-- Sample seed data for testing
-- Note: Replace 'YOUR_USER_ID' with an actual user ID from auth.users

-- Sample scores (uncomment and replace YOUR_USER_ID after creating a user)
-- Note: Each section is scored out of 15 points
/*
INSERT INTO scores (user_id, section, score, date) VALUES
  ('YOUR_USER_ID', 'calcul_mental', 12, NOW() - INTERVAL '30 days'),
  ('YOUR_USER_ID', 'calcul_mental', 13, NOW() - INTERVAL '25 days'),
  ('YOUR_USER_ID', 'calcul_mental', 14, NOW() - INTERVAL '20 days'),
  ('YOUR_USER_ID', 'calcul_mental', 13, NOW() - INTERVAL '15 days'),
  ('YOUR_USER_ID', 'raisonnement_logique', 11, NOW() - INTERVAL '30 days'),
  ('YOUR_USER_ID', 'raisonnement_logique', 12, NOW() - INTERVAL '25 days'),
  ('YOUR_USER_ID', 'raisonnement_logique', 13, NOW() - INTERVAL '20 days'),
  ('YOUR_USER_ID', 'expression', 12, NOW() - INTERVAL '30 days'),
  ('YOUR_USER_ID', 'expression', 13, NOW() - INTERVAL '25 days'),
  ('YOUR_USER_ID', 'comprehension_textes', 13, NOW() - INTERVAL '30 days'),
  ('YOUR_USER_ID', 'comprehension_textes', 14, NOW() - INTERVAL '25 days'),
  ('YOUR_USER_ID', 'conditions_minimales', 11, NOW() - INTERVAL '30 days'),
  ('YOUR_USER_ID', 'conditions_minimales', 12, NOW() - INTERVAL '25 days'),
  ('YOUR_USER_ID', 'resolution_problemes', 12, NOW() - INTERVAL '30 days'),
  ('YOUR_USER_ID', 'resolution_problemes', 13, NOW() - INTERVAL '25 days');

-- Sample notes
INSERT INTO notes (user_id, section, title, content, category, tags) VALUES
  ('YOUR_USER_ID', 'calcul_mental', 'Multiplication rapide par 11', 'Pour multiplier un nombre à deux chiffres par 11, additionner les deux chiffres et placer le résultat au milieu.', 'rules_to_memorize', ARRAY['multiplication', 'astuce']),
  ('YOUR_USER_ID', 'raisonnement_logique', 'Erreur fréquente: négation', 'Attention à ne pas confondre "tous" et "aucun" lors de la négation.', 'mistakes_to_remember', ARRAY['logique', 'négation']),
  ('YOUR_USER_ID', 'expression', 'Piège: homophones', 'Vérifier toujours les homophones: a/à, ou/où, ce/se, etc.', 'typical_traps', ARRAY['orthographe', 'homophones']);
*/

