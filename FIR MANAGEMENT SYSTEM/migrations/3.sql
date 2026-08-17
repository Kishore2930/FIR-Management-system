-- Migration 3: Add applicable_sections column to fir_cases
ALTER TABLE fir_cases ADD COLUMN applicable_sections TEXT DEFAULT '';
