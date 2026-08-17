CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Officer',
  badge TEXT,
  department TEXT,
  phone TEXT,
  cases INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Seed data for initially hardcoded officers
-- Passwords are set to a simple SHA-256 hash for 'password123' 
-- (Hash: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f)
INSERT INTO users (email, password_hash, name, role, badge, department, phone, cases, status) VALUES
('rajesh.kumar@police.gov.in', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Inspector Rajesh Kumar', 'Senior Inspector', 'INS-2451', 'Criminal Investigation', '+91 98765 43210', 12, 'Active'),
('priya.sharma@police.gov.in', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Sub-Inspector Priya Sharma', 'Sub-Inspector', 'SI-3892', 'Cyber Crime', '+91 98765 43211', 8, 'Active'),
('amit.patel@police.gov.in', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Head Constable Amit Patel', 'Head Constable', 'HC-5623', 'Special Branch', '+91 98765 43212', 5, 'On Leave'),
('kavita.singh@police.gov.in', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Inspector Kavita Singh', 'Inspector', 'INS-1847', 'Women''s Cell', '+91 98765 43213', 15, 'Active'),
('vikram.desai@police.gov.in', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Sub-Inspector Vikram Desai', 'Sub-Inspector', 'SI-4201', 'Traffic Division', '+91 98765 43214', 3, 'Active');
