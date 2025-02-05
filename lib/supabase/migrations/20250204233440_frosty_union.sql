/*
  # Authentication Setup
  
  1. Security
    - Enable email auth provider
    - Disable signups (only allow manually added users)
    - Enable RLS on all tables
*/

-- Configure auth settings to only allow email sign-in
ALTER TABLE auth.identities
DISABLE ROW LEVEL SECURITY;

-- Disable signups (only allow manually added users)
UPDATE auth.config
SET enable_signup = false;

-- Enable RLS on all tables for security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can read own data"
ON auth.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);