import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) are required in .env to run the seed script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log(`\n🌱 Starting Supabase database seed to: ${supabaseUrl}`);

  // 1. Seed Role-Based Accounts
  console.log('👤 Seeding role accounts (Admin, Faculty, Student)...');
  const adminHash = bcrypt.hashSync('adminPassword123', 10);
  const facultyHash = bcrypt.hashSync('facultyPassword123', 10);
  const studentHash = bcrypt.hashSync('studentPassword123', 10);

  const users = [
    {
      email: 'admin@university.edu',
      password_hash: adminHash,
      name: 'Dr. Eleanor Vance (Dean & Registrar)',
      role: 'admin',
      department: 'Office of the Registrar',
      avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin'
    },
    {
      email: 'faculty@university.edu',
      password_hash: facultyHash,
      name: 'Prof. Kenneth Clark',
      role: 'faculty',
      department: 'Computer Science',
      avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Kenneth'
    },
    {
      email: 'student@university.edu',
      password_hash: studentHash,
      name: 'Alexander Wright',
      role: 'student',
      department: 'Computer Science',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  ];

  const { error: usersError } = await supabase.from('users').upsert(users, { onConflict: 'email' });
  if (usersError) console.warn('Warning seeding users:', usersError.message);
  else console.log('✅ Role-based accounts (Admin, Faculty, Student) seeded successfully.');

  // 2. Seed Students
  console.log('🎓 Seeding student profiles...');
  const students = [
    {
      id: 'std-001',
      student_id: 'STU-2023-0101',
      first_name: 'Alexander',
      last_name: 'Wright',
      email: 'student@university.edu',
      phone: '+1 (555) 234-5678',
      date_of_birth: '2003-04-12',
      gender: 'Male',
      department: 'Computer Science',
      program: 'BS in Computer Science',
      year_level: '3rd Year',
      enrollment_date: '2023-08-15',
      status: 'Active',
      gpa: 3.85,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 'std-002',
      student_id: 'STU-2023-0102',
      first_name: 'Sophia',
      last_name: 'Chen',
      email: 'sophia.chen@university.edu',
      phone: '+1 (555) 345-6789',
      date_of_birth: '2004-01-25',
      gender: 'Female',
      department: 'Information Technology',
      program: 'BS in Information Technology',
      year_level: '2nd Year',
      enrollment_date: '2023-08-15',
      status: 'Active',
      gpa: 3.92,
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    },
    {
      id: 'std-003',
      student_id: 'STU-2022-0045',
      first_name: 'Marcus',
      last_name: 'Vance',
      email: 'marcus.vance@university.edu',
      phone: '+1 (555) 456-7890',
      date_of_birth: '2002-09-18',
      gender: 'Male',
      department: 'Engineering',
      program: 'BS in Electrical Engineering',
      year_level: '4th Year',
      enrollment_date: '2022-08-20',
      status: 'Active',
      gpa: 3.48,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 'std-004',
      student_id: 'STU-2024-0204',
      first_name: 'Elena',
      last_name: 'Rostova',
      email: 'elena.r@university.edu',
      phone: '+1 (555) 567-8901',
      date_of_birth: '2005-06-30',
      gender: 'Female',
      department: 'Computer Science',
      program: 'BS in Software Engineering',
      year_level: '1st Year',
      enrollment_date: '2024-08-12',
      status: 'Active',
      gpa: 3.75,
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      id: 'std-005',
      student_id: 'STU-2022-0089',
      first_name: 'David',
      last_name: 'Kim',
      email: 'david.kim@university.edu',
      phone: '+1 (555) 678-9012',
      date_of_birth: '2001-11-05',
      gender: 'Male',
      department: 'Business Administration',
      program: 'BS in Business Analytics',
      year_level: '4th Year',
      enrollment_date: '2022-08-20',
      status: 'Graduated',
      gpa: 3.65,
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    {
      id: 'std-006',
      student_id: 'STU-2023-0178',
      first_name: 'Amara',
      last_name: 'Patel',
      email: 'amara.patel@university.edu',
      phone: '+1 (555) 789-0123',
      date_of_birth: '2003-08-14',
      gender: 'Female',
      department: 'Engineering',
      program: 'BS in Mechanical Engineering',
      year_level: '3rd Year',
      enrollment_date: '2023-08-15',
      status: 'Active',
      gpa: 3.22,
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    }
  ];

  const { error: stdError } = await supabase.from('students').upsert(students, { onConflict: 'id' });
  if (stdError) console.warn('Warning seeding students:', stdError.message);
  else console.log('✅ Students seeded successfully.');

  // 3. Seed Courses
  console.log('📚 Seeding courses...');
  const courses = [
    {
      id: 'crs-001',
      code: 'CS-101',
      name: 'Data Structures & Algorithms',
      department: 'Computer Science',
      credits: 4,
      instructor: 'Dr. Evelyn Reed',
      schedule: 'Mon/Wed 09:00 - 11:00 AM',
      room: 'Science Hall 302',
      capacity: 45,
      semester: 'Fall 2024',
      description: 'Core algorithms, trees, graphs, sorting, searching, and algorithmic complexity analysis.'
    },
    {
      id: 'crs-002',
      code: 'CS-204',
      name: 'Database Systems & Design',
      department: 'Computer Science',
      credits: 3,
      instructor: 'Prof. Kenneth Clark',
      schedule: 'Tue/Thu 01:00 - 02:30 PM',
      room: 'Tech Lab 105',
      capacity: 40,
      semester: 'Fall 2024',
      description: 'Relational database modeling, SQL, normalization, transactions, and indexing.'
    },
    {
      id: 'crs-003',
      code: 'ENG-301',
      name: 'Control Systems Engineering',
      department: 'Engineering',
      credits: 4,
      instructor: 'Dr. Harold Martinez',
      schedule: 'Mon/Wed 02:00 - 04:00 PM',
      room: 'Engineering Complex B-12',
      capacity: 35,
      semester: 'Fall 2024',
      description: 'Feedback systems, state-space representations, stability criteria, and controller tuning.'
    },
    {
      id: 'crs-004',
      code: 'IT-150',
      name: 'Web Application Architecture',
      department: 'Information Technology',
      credits: 3,
      instructor: 'Prof. Sarah Jenkins',
      schedule: 'Fri 09:00 AM - 12:00 PM',
      room: 'Computer Lab 4',
      capacity: 35,
      semester: 'Fall 2024',
      description: 'Modern full-stack client-server paradigms, RESTful APIs, and frontend component architecture.'
    },
    {
      id: 'crs-005',
      code: 'BA-210',
      name: 'Applied Data Analytics',
      department: 'Business Administration',
      credits: 3,
      instructor: 'Dr. Gregory House',
      schedule: 'Tue/Thu 10:00 - 11:30 AM',
      room: 'Business Hall 201',
      capacity: 50,
      semester: 'Fall 2024',
      description: 'Business intelligence tools, descriptive and predictive statistical models for organizational decision-making.'
    }
  ];

  const { error: crsError } = await supabase.from('courses').upsert(courses, { onConflict: 'id' });
  if (crsError) console.warn('Warning seeding courses:', crsError.message);
  else console.log('✅ Courses seeded successfully.');

  // 4. Seed Enrollments
  console.log('📝 Seeding enrollments...');
  const enrollments = [
    {
      id: 'enr-001',
      student_id: 'std-001',
      course_id: 'crs-001',
      academic_year: '2024-2025',
      semester: 'Fall 2024',
      enrolled_date: '2024-08-25',
      status: 'Enrolled'
    },
    {
      id: 'enr-002',
      student_id: 'std-001',
      course_id: 'crs-002',
      academic_year: '2024-2025',
      semester: 'Fall 2024',
      enrolled_date: '2024-08-25',
      status: 'Enrolled'
    },
    {
      id: 'enr-003',
      student_id: 'std-002',
      course_id: 'crs-004',
      academic_year: '2024-2025',
      semester: 'Fall 2024',
      enrolled_date: '2024-08-26',
      status: 'Enrolled'
    },
    {
      id: 'enr-004',
      student_id: 'std-003',
      course_id: 'crs-003',
      academic_year: '2024-2025',
      semester: 'Fall 2024',
      enrolled_date: '2024-08-24',
      status: 'Enrolled'
    },
    {
      id: 'enr-005',
      student_id: 'std-004',
      course_id: 'crs-001',
      academic_year: '2024-2025',
      semester: 'Fall 2024',
      enrolled_date: '2024-08-28',
      status: 'Enrolled'
    },
    {
      id: 'enr-006',
      student_id: 'std-006',
      course_id: 'crs-003',
      academic_year: '2024-2025',
      semester: 'Fall 2024',
      enrolled_date: '2024-08-27',
      status: 'Enrolled'
    }
  ];

  const { error: enrError } = await supabase.from('enrollments').upsert(enrollments, { onConflict: 'id' });
  if (enrError) console.warn('Warning seeding enrollments:', enrError.message);
  else console.log('✅ Enrollments seeded successfully.');

  // 5. Seed Grades
  console.log('🏆 Seeding grades...');
  const grades = [
    {
      id: 'grd-001',
      enrollment_id: 'enr-001',
      student_id: 'std-001',
      course_id: 'crs-001',
      prelim_grade: 94.0,
      midterm_grade: 92.0,
      final_grade: 95.0,
      total_grade: 93.8,
      letter_grade: 'A',
      grade_point: 4.0,
      remarks: 'Passed'
    },
    {
      id: 'grd-002',
      enrollment_id: 'enr-002',
      student_id: 'std-001',
      course_id: 'crs-002',
      prelim_grade: 88.0,
      midterm_grade: 90.0,
      final_grade: 91.0,
      total_grade: 89.8,
      letter_grade: 'B+',
      grade_point: 3.3,
      remarks: 'Passed'
    },
    {
      id: 'grd-003',
      enrollment_id: 'enr-003',
      student_id: 'std-002',
      course_id: 'crs-004',
      prelim_grade: 96.0,
      midterm_grade: 95.0,
      final_grade: 98.0,
      total_grade: 96.5,
      letter_grade: 'A',
      grade_point: 4.0,
      remarks: 'Passed'
    },
    {
      id: 'grd-004',
      enrollment_id: 'enr-004',
      student_id: 'std-003',
      course_id: 'crs-003',
      prelim_grade: 82.0,
      midterm_grade: 85.0,
      final_grade: 86.0,
      total_grade: 84.5,
      letter_grade: 'B',
      grade_point: 3.0,
      remarks: 'Passed'
    },
    {
      id: 'grd-005',
      enrollment_id: 'enr-005',
      student_id: 'std-004',
      course_id: 'crs-001',
      prelim_grade: 89.0,
      midterm_grade: 91.0,
      final_grade: 90.0,
      total_grade: 90.0,
      letter_grade: 'A-',
      grade_point: 3.7,
      remarks: 'Passed'
    },
    {
      id: 'grd-006',
      enrollment_id: 'enr-006',
      student_id: 'std-006',
      course_id: 'crs-003',
      prelim_grade: 78.0,
      midterm_grade: 80.0,
      final_grade: 79.0,
      total_grade: 79.0,
      letter_grade: 'C+',
      grade_point: 2.3,
      remarks: 'Passed'
    }
  ];

  const { error: grdError } = await supabase.from('grades').upsert(grades, { onConflict: 'id' });
  if (grdError) console.warn('Warning seeding grades:', grdError.message);
  else console.log('✅ Grades seeded successfully.');

  console.log('\n✨ Database seed finished successfully!\n');
}

runSeed().catch((err) => {
  console.error('Fatal seed failure:', err);
  process.exit(1);
});
