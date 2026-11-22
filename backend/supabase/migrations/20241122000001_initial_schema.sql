-- ==============================================================================
-- Migration: 20241122000001_initial_schema.sql
-- Description: Core schema for Student Record Management System (SRMS)
-- Target DB: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if recreating (order matters for foreign keys)
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 3. Users Table (Application accounts & roles)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'faculty', 'student')),
    department TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Students Table
CREATE TABLE public.students (
    id TEXT PRIMARY KEY DEFAULT ('std-' || substr(md5(random()::text), 1, 8)),
    student_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    department TEXT NOT NULL,
    program TEXT NOT NULL,
    year_level TEXT NOT NULL CHECK (year_level IN ('1st Year', '2nd Year', '3rd Year', '4th Year')),
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Graduated', 'Inactive', 'Suspended')),
    gpa NUMERIC(4, 2) DEFAULT 0.00,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Courses Table
CREATE TABLE public.courses (
    id TEXT PRIMARY KEY DEFAULT ('crs-' || substr(md5(random()::text), 1, 8)),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    instructor TEXT NOT NULL,
    schedule TEXT NOT NULL,
    room TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 40,
    semester TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enrollments Table
CREATE TABLE public.enrollments (
    id TEXT PRIMARY KEY DEFAULT ('enr-' || substr(md5(random()::text), 1, 8)),
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL DEFAULT '2024-2025',
    semester TEXT NOT NULL DEFAULT 'Fall 2024',
    enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Enrolled' CHECK (status IN ('Enrolled', 'Completed', 'Dropped')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_course_term UNIQUE (student_id, course_id, academic_year, semester)
);

-- 7. Grades Table
CREATE TABLE public.grades (
    id TEXT PRIMARY KEY DEFAULT ('grd-' || substr(md5(random()::text), 1, 8)),
    enrollment_id TEXT UNIQUE NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    prelim_grade NUMERIC(5, 2),
    midterm_grade NUMERIC(5, 2),
    final_grade NUMERIC(5, 2),
    total_grade NUMERIC(5, 2),
    letter_grade TEXT,
    grade_point NUMERIC(3, 2),
    remarks TEXT NOT NULL DEFAULT 'Incomplete' CHECK (remarks IN ('Passed', 'Failed', 'Incomplete')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Performance Query Indexes
CREATE INDEX idx_students_dept ON public.students(department);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_students_email ON public.students(email);
CREATE INDEX idx_courses_code ON public.courses(code);
CREATE INDEX idx_courses_dept ON public.courses(department);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_grades_student ON public.grades(student_id);
CREATE INDEX idx_grades_course ON public.grades(course_id);

-- 9. Trigger for updating updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_modtime
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_courses_modtime
BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_grades_modtime
BEFORE UPDATE ON public.grades
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- 11. Security Policies (Allows authorized anon/service role API operations)
CREATE POLICY "Enable all access for application API" ON public.users FOR ALL USING (true);
CREATE POLICY "Enable all access for application API" ON public.students FOR ALL USING (true);
CREATE POLICY "Enable all access for application API" ON public.courses FOR ALL USING (true);
CREATE POLICY "Enable all access for application API" ON public.enrollments FOR ALL USING (true);
CREATE POLICY "Enable all access for application API" ON public.grades FOR ALL USING (true);
