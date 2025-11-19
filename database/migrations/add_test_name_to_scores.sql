-- Migration: Add test_name column to scores table
-- This allows grouping scores by test (test-1, test-2, etc.)

-- Add test_name column (nullable to support existing scores)
ALTER TABLE scores 
ADD COLUMN IF NOT EXISTS test_name TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_scores_test_name ON scores(test_name);

-- Add comment
COMMENT ON COLUMN scores.test_name IS 'Name of the test (e.g., test-1, test-2) for grouping scores by test';

