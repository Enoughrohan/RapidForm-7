-- ============================================================
-- RapidForm Bihar – Supabase Database Schema
-- Run this in Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- USERS / PROFILES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone         TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  district      TEXT,
  village       TEXT,
  aadhaar_last4 TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- APPLICATIONS
-- ─────────────────────────────────────────
CREATE TYPE application_status AS ENUM (
  'submitted',
  'docs_pending',
  'under_review',
  'approved',
  'completed',
  'rejected'
);

CREATE TABLE IF NOT EXISTS applications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_id        TEXT UNIQUE NOT NULL,            -- e.g. RF-2024-001234
  user_id       UUID REFERENCES profiles(id),
  service_id    INTEGER NOT NULL,                -- matches services.ts id
  service_name  TEXT NOT NULL,
  service_cat   TEXT NOT NULL,
  is_tatkal     BOOLEAN DEFAULT FALSE,
  status        application_status DEFAULT 'submitted',
  district      TEXT NOT NULL,
  notes         TEXT,
  agent_id      UUID,                            -- assigned agent
  fee_paid      BOOLEAN DEFAULT FALSE,
  fee_amount    INTEGER,                         -- in paise
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Auto-generate ref_id trigger
CREATE OR REPLACE FUNCTION generate_ref_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ref_id := 'RF-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ref_id
BEFORE INSERT ON applications
FOR EACH ROW
WHEN (NEW.ref_id IS NULL OR NEW.ref_id = '')
EXECUTE FUNCTION generate_ref_id();

-- ─────────────────────────────────────────
-- APPLICATION STATUS HISTORY
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS status_history (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  status         application_status NOT NULL,
  note           TEXT,
  changed_by     UUID,                           -- agent or system
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- DOCUMENTS UPLOADED
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  doc_name       TEXT NOT NULL,                  -- e.g. 'Aadhaar Card'
  storage_path   TEXT NOT NULL,                  -- Supabase Storage path
  uploaded_at    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- AGENTS (RapidForm field staff)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  phone       TEXT UNIQUE NOT NULL,
  district    TEXT NOT NULL,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own profile
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Users can read/create their own applications
CREATE POLICY "users_own_applications_select" ON applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "users_own_applications_insert" ON applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can view their own documents
CREATE POLICY "users_own_documents" ON documents
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- Users can view status history for their applications
CREATE POLICY "users_own_status_history" ON status_history
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- REALTIME (enable for live tracking)
-- ─────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE status_history;

-- ─────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────
CREATE INDEX idx_applications_user_id   ON applications(user_id);
CREATE INDEX idx_applications_status    ON applications(status);
CREATE INDEX idx_applications_district  ON applications(district);
CREATE INDEX idx_status_history_app_id  ON status_history(application_id);

-- ─────────────────────────────────────────
-- SEED: Sample data for testing
-- ─────────────────────────────────────────
-- (Uncomment to insert demo data)
/*
INSERT INTO profiles (id, phone, full_name, district)
VALUES ('00000000-0000-0000-0000-000000000001', '+919876543210', 'Rahul Kumar', 'Patna');

INSERT INTO applications (user_id, service_id, service_name, service_cat, district, status, ref_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', 1, 'Caste Certificate',   'personal', 'Patna', 'under_review', 'RF-2024-001234'),
  ('00000000-0000-0000-0000-000000000001', 2, 'Income Certificate',  'personal', 'Patna', 'docs_pending',  'RF-2024-001198'),
  ('00000000-0000-0000-0000-000000000001', 3, 'Residence Certificate', 'personal', 'Patna', 'completed', 'RF-2024-000889');
*/
