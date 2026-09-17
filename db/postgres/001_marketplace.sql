CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text NOT NULL,
  name text NOT NULL,
  created_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  role text NOT NULL CHECK (role IN ('client', 'talent')),
  dob text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  complete boolean NOT NULL DEFAULT false,
  updated_at bigint NOT NULL,
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  profile_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS auth_challenges (
  token_hash text PRIMARY KEY,
  expires_at bigint NOT NULL
);
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id text PRIMARY KEY,
  count integer NOT NULL,
  resets_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY,
  client_profile_id text NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  budget_paise bigint NOT NULL CHECK (budget_paise > 0),
  deadline date NOT NULL,
  deliverables text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'open', 'paused', 'closed', 'hired', 'completed')),
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_profile_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_open ON projects(status, updated_at DESC);

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  talent_profile_id text NOT NULL REFERENCES profiles(id),
  cover_letter text NOT NULL,
  quote_paise bigint NOT NULL CHECK (quote_paise > 0),
  delivery_days integer NOT NULL CHECK (delivery_days > 0),
  status text NOT NULL CHECK (status IN ('submitted', 'shortlisted', 'rejected', 'withdrawn', 'accepted')),
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  UNIQUE(project_id, talent_profile_id)
);
CREATE INDEX IF NOT EXISTS idx_proposals_project ON proposals(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_talent ON proposals(talent_profile_id, created_at DESC);

CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY,
  project_id uuid NOT NULL UNIQUE REFERENCES projects(id),
  proposal_id uuid NOT NULL UNIQUE REFERENCES proposals(id),
  client_profile_id text NOT NULL REFERENCES profiles(id),
  talent_profile_id text NOT NULL REFERENCES profiles(id),
  quote_paise bigint NOT NULL,
  fee_paise bigint NOT NULL,
  status text NOT NULL CHECK (status IN ('awaiting_funding', 'active', 'completed', 'cancelled', 'disputed')),
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contracts_client ON contracts(client_profile_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_talent ON contracts(talent_profile_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY,
  contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount_paise bigint NOT NULL CHECK (amount_paise > 0),
  status text NOT NULL CHECK (status IN ('awaiting_funding', 'funded', 'submitted', 'revision_requested', 'approved')),
  submission_note text NOT NULL DEFAULT '',
  review_note text NOT NULL DEFAULT '',
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_milestones_contract ON milestones(contract_id, created_at);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY,
  contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  sender_profile_id text NOT NULL REFERENCES profiles(id),
  body text NOT NULL,
  created_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_contract ON messages(contract_id, created_at);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY,
  profile_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  link text NOT NULL DEFAULT '',
  read_at bigint,
  created_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_profile ON notifications(profile_id, created_at DESC);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY,
  contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  author_profile_id text NOT NULL REFERENCES profiles(id),
  subject_profile_id text NOT NULL REFERENCES profiles(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL,
  created_at bigint NOT NULL,
  UNIQUE(contract_id, author_profile_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY,
  reporter_profile_id text NOT NULL REFERENCES profiles(id),
  project_id uuid REFERENCES projects(id),
  reason text NOT NULL,
  details text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved')),
  created_at bigint NOT NULL
);
