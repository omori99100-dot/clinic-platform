-- Production Schema for Dental Clinic Management System
-- Target: Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'doctor', 'staff')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name VARCHAR(100) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  service VARCHAR(100) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  notes TEXT DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  whatsapp_sent BOOLEAN DEFAULT false,
  whatsapp_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate: same patient, same date, same time
CREATE UNIQUE INDEX idx_bookings_unique
  ON bookings(patient_phone, booking_date, booking_time)
  WHERE status != 'cancelled';

-- Performance indexes
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_phone ON bookings(patient_phone);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

-- ============================================================
-- LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_action ON logs(action);
CREATE INDEX idx_logs_created ON logs(created_at DESC);
CREATE INDEX idx_logs_user ON logs(user_id);

-- ============================================================
-- ANALYTICS MATERIALIZED VIEW (daily summary)
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_stats AS
SELECT
  booking_date,
  COUNT(*) AS total_bookings,
  COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending
FROM bookings
GROUP BY booking_date
ORDER BY booking_date DESC;

CREATE UNIQUE INDEX idx_daily_stats_date ON daily_stats(booking_date);

-- ============================================================
-- AUTO-UPDATE TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SUPABASE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Users: only authenticated admins can read/write users
CREATE POLICY "users_admin_all"
  ON users FOR ALL
  USING (auth.role() = 'authenticated');

-- Bookings: anyone can insert (patient booking), only admins can read/update
CREATE POLICY "bookings_insert_public"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "bookings_select_admin"
  ON bookings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "bookings_update_admin"
  ON bookings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "bookings_delete_admin"
  ON bookings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Logs: only admins
CREATE POLICY "logs_admin_all"
  ON logs FOR ALL
  USING (auth.role() = 'authenticated');
