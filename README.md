# Student Record Management System (SRMS)

A full-stack, enterprise-grade Student Record Management System designed with **Feature-Based Architecture** using **React 19, TypeScript, Tailwind CSS, Vite** on the frontend and **Node.js, Express, TypeScript, and Supabase PostgreSQL** on the backend.

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

The system enforces strict role-based access control across **Administrator**, **Faculty**, and **Student** roles:

| Capability | Administrator (`admin`) | Faculty Instructor (`faculty`) | Student (`student`) |
|---|:---:|:---:|:---:|
| **Student Directory** | View, Create, Edit, Delete | View Directory (Read-only) | View Personal Profile Only |
| **Courses Management** | View, Create, Edit, Delete | View Courses & Class Rosters | View Course Offerings |
| **Course Enrollments** | Full Management (Enroll, Drop, Complete) | View Class Enrollments | View Personal Registrations |
| **Academic Grading & GPA** | View All Grades & Transcripts | Input & Update Term Grades (Prelim/Midterm/Final) | View Personal Grades & 4.0 GPA |
| **System Dashboard** | Full Institutional Overview & Analytics | Class Overview & Performance | Personal Overview & Standing |

---

## 🔑 Seeded Role Accounts

The database and application are pre-seeded with authentic bcrypt-hashed accounts for each role:

| Role | Email Address | Password | Permissions & Scope |
|---|---|---|---|
| 🎓 **Administrator** | `admin@university.edu` | `adminPassword123` | Full administrative control: student admissions, course catalog, enrollments, reports. |
| 👨‍🏫 **Faculty** | `faculty@university.edu` | `facultyPassword123` | View assigned courses, inspect class rosters, submit Prelim (30%), Midterm (30%), Final (40%) grades. |
| 🧑‍🎓 **Student** | `student@university.edu` | `studentPassword123` | View personal student profile, enrolled courses, term grades, and cumulative 4.0 GPA. |

---

## 🏛️ Architecture Overview

The codebase is organized around domain **features** with **zero static hardcoded mock data** in the application source. All persistent records live directly in your **Supabase PostgreSQL** database.

```text
student-record-system/
├── backend/
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 20241122000001_initial_schema.sql  # Pure DDL Migration: tables, RLS, triggers, indexes
│   │   └── seed.sql                               # Pure DML Seed: realistic academic dataset with bcrypt passwords
│   ├── src/
│   │   ├── app.ts                                 # Express app setup & feature route assembly
│   │   ├── index.ts                               # HTTP server entry point
│   │   ├── shared/                                # Cross-cutting concerns
│   │   │   ├── config/ (env.ts)                   # Typed runtime environment configuration
│   │   │   ├── db/
│   │   │   │   ├── supabase.ts                    # Supabase Client connection & status
│   │   │   │   ├── seed.ts                        # Programmatic Supabase seed script
│   │   │   │   └── memory-db.ts                   # In-memory store (initialized empty)
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts             # JWT authentication & authorize('admin', 'faculty', 'student')
│   │   │   │   ├── error.middleware.ts            # Centralized AppError handling
│   │   │   │   └── logger.middleware.ts           # HTTP request logging
│   │   │   └── utils/
│   │   │       ├── token.ts                       # JWT sign/verify & bcrypt password hashing
│   │   │       └── gpa-calculator.ts              # 4.0 Weighted GPA calculation engine
│   │   └── features/                              # Domain Features (Protected by RBAC)
│   │       ├── auth/                              # Authentication & role-based sessions
│   │       ├── students/                          # Student CRUD (Admin only for mutations)
│   │       ├── courses/                           # Course catalog & rosters (Admin only for mutations)
│   │       ├── enrollments/                       # Course registrations & joins (Admin only for mutations)
│   │       ├── grades/                            # Evaluations & cumulative GPA (Admin + Faculty for grading)
│   │       └── dashboard/                         # Academic KPIs, Dean's List & department metrics
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                                # Feature router (Landing, Login, Portal)
│   │   ├── main.tsx                               # React DOM entry
│   │   ├── index.css                              # Tailwind base styles (Solid Colors, Zero Gradients)
│   │   ├── shared/                                # Shared UI
│   │   │   ├── api/ (client.ts)                   # Typed Fetch client attaching Bearer token
│   │   │   ├── components/layout/                 # Navbar (Role badge & Sign out), Sidebar (Role-filtered)
│   │   │   └── components/ui/                     # Button, Input, Select, Modal, Badge, Card, Spinner
│   │   └── features/
│   │       ├── landing/                           # High-impact solid-color University Landing Page
│   │       ├── auth/                              # Login Page with 1-Click Role Switcher & AuthContext
│   │       ├── dashboard/                         # Real-time metrics, Dean's list, department stats
│   │       ├── students/                          # Directory, filter toolbar, student profile modal
│   │       ├── courses/                           # Course catalog cards & live class roster modal
│   │       ├── enrollments/                       # Registration manager, completion & drop workflows
│   │       └── grades/                            # Grading sheet, prelim/midterm/final entry & GPA calculation
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── package.json                                   # Root orchestrator with concurrently
```

---

## ⚡ Database Migration & Seeding with Supabase

### Step 1: Run the Migration File (DDL)
1. In your **Supabase Dashboard**, open the **SQL Editor**.
2. Open [`backend/supabase/migrations/20241122000001_initial_schema.sql`](file:///backend/supabase/migrations/20241122000001_initial_schema.sql) and paste its contents into the editor.
3. Click **Run**. This provisions all tables, constraints, indexes, triggers, and Row-Level Security policies.

### Step 2: Seed Role Accounts and Academic Records (DML)
- **Option A (SQL Editor)**: Open [`backend/supabase/seed.sql`](file:///backend/supabase/seed.sql), paste into your Supabase SQL Editor, and click **Run**.
- **Option B (Node Script)**: Set your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `backend/.env` and execute:
  ```bash
  npm run seed
  ```

---

## 🚀 Running the Project

From the root directory:
```bash
npm run dev
```

- **Frontend Application (Landing, Login & Portal):** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check & DB status:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
