/*
  # Journal App Schema

  1. New Tables
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `mood` (integer, 1-5 scale)
      - `prompt` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
  2. Security
    - Enable RLS on journal_entries table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  mood integer CHECK (mood >= 1 AND mood <= 5),
  prompt text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own entries"
  ON journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own entries"
  ON journal_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON journal_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON journal_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);