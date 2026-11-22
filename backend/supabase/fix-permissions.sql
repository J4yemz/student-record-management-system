-- ==============================================================================
-- Fix Permissions & RLS for Supabase Student Record Management System (SRMS)
-- Run this script in your Supabase Project -> SQL Editor -> Run
-- ==============================================================================

-- 1. Ensure Schema Usage is granted to Supabase API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Grant full table, sequence, and routine privileges to Supabase roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 3. Configure Default Privileges so any future tables automatically inherit full access
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 4. Re-configure Row Level Security (RLS) Policies with both USING and WITH CHECK
DROP POLICY IF EXISTS "Enable all access for application API" ON public.users;
DROP POLICY IF EXISTS "Enable all access for application API" ON public.students;
DROP POLICY IF EXISTS "Enable all access for application API" ON public.courses;
DROP POLICY IF EXISTS "Enable all access for application API" ON public.enrollments;
DROP POLICY IF EXISTS "Enable all access for application API" ON public.grades;

CREATE POLICY "Enable all access for application API" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for application API" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for application API" ON public.courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for application API" ON public.enrollments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for application API" ON public.grades FOR ALL USING (true) WITH CHECK (true);
