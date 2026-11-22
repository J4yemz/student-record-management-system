-- ==============================================================================
-- Seed: seed.sql
-- Description: Realistic initial academic dataset for Supabase
-- For User Accounts, run: supabase/seed-accounts.sql
-- ==============================================================================

-- 1. Seed Students
INSERT INTO public.students (id, student_id, first_name, last_name, email, phone, date_of_birth, gender, department, program, year_level, enrollment_date, status, gpa, avatar_url) VALUES
('std-001', 'STU-2023-0101', 'Alexander', 'Wright', 'student@university.edu', '+1 (555) 234-5678', '2003-04-12', 'Male', 'Computer Science', 'BS in Computer Science', '3rd Year', '2023-08-15', 'Active', 3.85, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('std-002', 'STU-2023-0102', 'Sophia', 'Chen', 'sophia.chen@university.edu', '+1 (555) 345-6789', '2004-01-25', 'Female', 'Information Technology', 'BS in Information Technology', '2nd Year', '2023-08-15', 'Active', 3.92, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
('std-003', 'STU-2022-0045', 'Marcus', 'Vance', 'marcus.vance@university.edu', '+1 (555) 456-7890', '2002-09-18', 'Male', 'Engineering', 'BS in Electrical Engineering', '4th Year', '2022-08-20', 'Active', 3.48, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('std-004', 'STU-2024-0204', 'Elena', 'Rostova', 'elena.r@university.edu', '+1 (555) 567-8901', '2005-06-30', 'Female', 'Computer Science', 'BS in Software Engineering', '1st Year', '2024-08-12', 'Active', 3.75, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('std-005', 'STU-2022-0089', 'David', 'Kim', 'david.kim@university.edu', '+1 (555) 678-9012', '2001-11-05', 'Male', 'Business Administration', 'BS in Business Analytics', '4th Year', '2022-08-20', 'Graduated', 3.65, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('std-006', 'STU-2023-0178', 'Amara', 'Patel', 'amara.patel@university.edu', '+1 (555) 789-0123', '2003-08-14', 'Female', 'Engineering', 'BS in Mechanical Engineering', '3rd Year', '2023-08-15', 'Active', 3.22, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
ON CONFLICT (id) DO UPDATE SET
  student_id = EXCLUDED.student_id,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  department = EXCLUDED.department,
  program = EXCLUDED.program,
  year_level = EXCLUDED.year_level,
  status = EXCLUDED.status,
  gpa = EXCLUDED.gpa;

-- 2. Seed Courses
INSERT INTO public.courses (id, code, name, department, credits, instructor, schedule, room, capacity, semester, description) VALUES
('crs-001', 'CS-101', 'Data Structures & Algorithms', 'Computer Science', 4, 'Dr. Evelyn Reed', 'Mon/Wed 09:00 - 11:00 AM', 'Science Hall 302', 45, 'Fall 2024', 'Core algorithms, trees, graphs, sorting, searching, and algorithmic complexity analysis.'),
('crs-002', 'CS-204', 'Database Systems & Design', 'Computer Science', 3, 'Prof. Kenneth Clark', 'Tue/Thu 01:00 - 02:30 PM', 'Tech Lab 105', 40, 'Fall 2024', 'Relational database modeling, SQL, normalization, transactions, and indexing.'),
('crs-003', 'ENG-301', 'Control Systems Engineering', 'Engineering', 4, 'Dr. Harold Martinez', 'Mon/Wed 02:00 - 04:00 PM', 'Engineering Complex B-12', 35, 'Fall 2024', 'Feedback systems, state-space representations, stability criteria, and controller tuning.'),
('crs-004', 'IT-150', 'Web Application Architecture', 'Information Technology', 3, 'Prof. Sarah Jenkins', 'Fri 09:00 AM - 12:00 PM', 'Computer Lab 4', 35, 'Fall 2024', 'Modern full-stack client-server paradigms, RESTful APIs, and frontend component architecture.'),
('crs-005', 'BA-210', 'Applied Data Analytics', 'Business Administration', 3, 'Dr. Gregory House', 'Tue/Thu 10:00 - 11:30 AM', 'Business Hall 201', 50, 'Fall 2024', 'Business intelligence tools, descriptive and predictive statistical models for organizational decision-making.')
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  department = EXCLUDED.department,
  credits = EXCLUDED.credits,
  instructor = EXCLUDED.instructor,
  capacity = EXCLUDED.capacity;

-- 3. Seed Enrollments
INSERT INTO public.enrollments (id, student_id, course_id, academic_year, semester, enrolled_date, status) VALUES
('enr-001', 'std-001', 'crs-001', '2024-2025', 'Fall 2024', '2024-08-25', 'Enrolled'),
('enr-002', 'std-001', 'crs-002', '2024-2025', 'Fall 2024', '2024-08-25', 'Enrolled'),
('enr-003', 'std-002', 'crs-004', '2024-2025', 'Fall 2024', '2024-08-26', 'Enrolled'),
('enr-004', 'std-003', 'crs-003', '2024-2025', 'Fall 2024', '2024-08-24', 'Enrolled'),
('enr-005', 'std-004', 'crs-001', '2024-2025', 'Fall 2024', '2024-08-28', 'Enrolled'),
('enr-006', 'std-006', 'crs-003', '2024-2025', 'Fall 2024', '2024-08-27', 'Enrolled')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status;

-- 4. Seed Grades
INSERT INTO public.grades (id, enrollment_id, student_id, course_id, prelim_grade, midterm_grade, final_grade, total_grade, letter_grade, grade_point, remarks, updated_at) VALUES
('grd-001', 'enr-001', 'std-001', 'crs-001', 94.00, 92.00, 95.00, 93.80, 'A', 4.00, 'Passed', NOW()),
('grd-002', 'enr-002', 'std-001', 'crs-002', 88.00, 90.00, 91.00, 89.80, 'B+', 3.30, 'Passed', NOW()),
('grd-003', 'enr-003', 'std-002', 'crs-004', 96.00, 95.00, 98.00, 96.50, 'A', 4.00, 'Passed', NOW()),
('grd-004', 'enr-004', 'std-003', 'crs-003', 82.00, 85.00, 86.00, 84.50, 'B', 3.00, 'Passed', NOW()),
('grd-005', 'enr-005', 'std-004', 'crs-001', 89.00, 91.00, 90.00, 90.00, 'A-', 3.70, 'Passed', NOW()),
('grd-006', 'enr-006', 'std-006', 'crs-003', 78.00, 80.00, 79.00, 79.00, 'C+', 2.30, 'Passed', NOW())
ON CONFLICT (id) DO UPDATE SET
  prelim_grade = EXCLUDED.prelim_grade,
  midterm_grade = EXCLUDED.midterm_grade,
  final_grade = EXCLUDED.final_grade,
  total_grade = EXCLUDED.total_grade,
  letter_grade = EXCLUDED.letter_grade,
  grade_point = EXCLUDED.grade_point,
  remarks = EXCLUDED.remarks;
