-- ==============================================================================
-- Seed: seed-accounts.sql
-- Description: Dedicated Seed File for User Authentication Accounts (Admin, Faculty, Student)
-- Target DB: Supabase (PostgreSQL)
-- ==============================================================================

-- Clean up any previous demo account emails to prevent any ID or email conflict
DELETE FROM public.users WHERE email IN (
    'admin@university.edu',
    'faculty@university.edu',
    'student@university.edu',
    'a.wright@university.edu'
);

-- Insert Real Role-Based Accounts (UUID generated automatically by PostgreSQL)
-- Passwords:
--   1. Administrator: admin@university.edu    | Password: adminPassword123
--   2. Faculty:       faculty@university.edu  | Password: facultyPassword123
--   3. Student:       student@university.edu  | Password: studentPassword123
INSERT INTO public.users (
    email,
    password_hash,
    name,
    role,
    department,
    avatar_url
) VALUES
(
    'admin@university.edu',
    crypt('adminPassword123', gen_salt('bf', 10)),
    'Dr. Eleanor Vance (Dean & Registrar)',
    'admin',
    'Office of the Registrar',
    'https://api.dicebear.com/7.x/initials/svg?seed=Admin'
),
(
    'faculty@university.edu',
    crypt('facultyPassword123', gen_salt('bf', 10)),
    'Prof. Kenneth Clark',
    'faculty',
    'Computer Science',
    'https://api.dicebear.com/7.x/initials/svg?seed=Kenneth'
),
(
    'student@university.edu',
    crypt('studentPassword123', gen_salt('bf', 10)),
    'Alexander Wright',
    'student',
    'Computer Science',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
);
