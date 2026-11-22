import fs from 'fs';
import path from 'path';
import {
  StudentRecord,
  CourseRecord,
  EnrollmentRecord,
  GradeRecord
} from './seed-data.js';
import { config } from '../config/env.js';

interface DatabaseSchema {
  students: StudentRecord[];
  courses: CourseRecord[];
  enrollments: EnrollmentRecord[];
  grades: GradeRecord[];
}

class MemoryDatabase {
  private static instance: MemoryDatabase;
  private data: DatabaseSchema;
  private storageFile: string;

  private constructor() {
    this.storageFile = path.resolve(process.cwd(), 'data', 'db.json');
    this.data = this.loadOrInit();
  }

  public static getInstance(): MemoryDatabase {
    if (!MemoryDatabase.instance) {
      MemoryDatabase.instance = new MemoryDatabase();
    }
    return MemoryDatabase.instance;
  }

  private loadOrInit(): DatabaseSchema {
    if (config.dataPersistence && fs.existsSync(this.storageFile)) {
      try {
        const raw = fs.readFileSync(this.storageFile, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.warn('Could not read existing db.json:', err);
      }
    }

    // Zero static data default
    return {
      students: [],
      courses: [],
      enrollments: [],
      grades: []
    };
  }

  private persist(): void {
    if (!config.dataPersistence) return;
    try {
      const dir = path.dirname(this.storageFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storageFile, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist db.json:', err);
    }
  }

  get students(): StudentRecord[] {
    return this.data.students;
  }

  setStudents(records: StudentRecord[]): void {
    this.data.students = records;
    this.persist();
  }

  get courses(): CourseRecord[] {
    return this.data.courses;
  }

  setCourses(records: CourseRecord[]): void {
    this.data.courses = records;
    this.persist();
  }

  get enrollments(): EnrollmentRecord[] {
    return this.data.enrollments;
  }

  setEnrollments(records: EnrollmentRecord[]): void {
    this.data.enrollments = records;
    this.persist();
  }

  get grades(): GradeRecord[] {
    return this.data.grades;
  }

  setGrades(records: GradeRecord[]): void {
    this.data.grades = records;
    this.persist();
  }

  clear(): void {
    this.data = {
      students: [],
      courses: [],
      enrollments: [],
      grades: []
    };
    this.persist();
  }
}

export const db = MemoryDatabase.getInstance();
