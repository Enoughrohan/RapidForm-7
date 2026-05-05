-- ============================================================
-- RapidForm Bihar — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone         TEXT UNIQUE NOT NULL,
  name          TEXT,
  district      TEXT,
  aadhaar_last4 TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPLICATIONS TABLE
-- ============================================================
CREATE TYPE application_status AS ENUM (
  'submitted',
  'docs_pending',
  'under_review',
  'approved',
  'completed',
  'rejected'
);

CREATE TABLE IF NOT EXISTS public.applications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_id       TEXT UNIQUE NOT NULL,
  user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_id   INTEGER NOT NULL,
  service_name TEXT NOT NULL,
  status       application_status DEFAULT 'submitted',
  is_tatkal    BOOLEAN DEFAULT FALSE,
  fee_paid     BOOLEAN DEFAULT FALSE,
  notes        TEXT,
  agent_id     UUID,
  district     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPLICATION DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.application_documents (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  doc_name       TEXT NOT NULL,
  file_url       TEXT,
  verified       BOOLEAN DEFAULT FALSE,
  uploaded_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPLICATION TIMELINE TABLE (for tracking steps)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.application_timeline (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  status         application_status NOT NULL,
  note           TEXT,
  created_by     TEXT DEFAULT 'system',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AGENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agents (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  phone      TEXT UNIQUE NOT NULL,
  district   TEXT NOT NULL,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate ref_id like RF-2024-001234
CREATE OR REPLACE FUNCTION generate_ref_id()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  seq_num   INTEGER;
  ref       TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  SELECT COUNT(*) + 1 INTO seq_num FROM public.applications;
  ref := 'RF-' || year_part || '-' || LPAD(seq_num::TEXT, 6, '0');
  NEW.ref_id := ref;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ref_id
  BEFORE INSERT ON public.applications
  FOR EACH ROW
  WHEN (NEW.ref_id IS NULL OR NEW.ref_id = '')
  EXECUTE FUNCTION generate_ref_id();

-- Auto-insert timeline entry on status change
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.application_timeline (application_id, status, note)
    VALUES (NEW.id, NEW.status, NEW.notes);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_application_status
  AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_timeline ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "users_own_data" ON public.users
  FOR ALL USING (auth.uid()::TEXT = id::TEXT);

-- Applications: user sees only their own
CREATE POLICY "apps_own_data" ON public.applications
  FOR ALL USING (
    user_id = auth.uid()
    OR auth.role() = 'service_role'
  );

-- Documents: linked to user's applications
CREATE POLICY "docs_own_data" ON public.application_documents
  FOR ALL USING (
    application_id IN (
      SELECT id FROM public.applications WHERE user_id = auth.uid()
    )
    OR auth.role() = 'service_role'
  );

-- Timeline: read-only for users
CREATE POLICY "timeline_read" ON public.application_timeline
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM public.applications WHERE user_id = auth.uid()
    )
    OR auth.role() = 'service_role'
  );

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_applications_user_id  ON public.applications(user_id);
CREATE INDEX idx_applications_status   ON public.applications(status);
CREATE INDEX idx_applications_ref_id   ON public.applications(ref_id);
CREATE INDEX idx_applications_created  ON public.applications(created_at DESC);
CREATE INDEX idx_timeline_app_id       ON public.application_timeline(application_id);
CREATE INDEX idx_docs_app_id           ON public.application_documents(application_id);

-- ============================================================
-- SAMPLE DATA (for testing)
-- ============================================================
INSERT INTO public.agents (name, phone, district, active) VALUES
  ('Ravi Shankar', '+91-9876543201', 'Patna', TRUE),
  ('Pooja Devi',   '+91-9876543202', 'Gaya', TRUE),
  ('Amit Kumar',   '+91-9876543203', 'Muzaffarpur', TRUE),
  ('Sunita Singh', '+91-9876543204', 'Darbhanga', TRUE);

-- ============================================================
-- STORAGE BUCKETS (run in Supabase Dashboard > Storage)
-- ============================================================
-- Create bucket: application-documents (private)
-- Create bucket: completed-certificates (private)
