import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { requestLogger } from './shared/middleware/logger.middleware.js';
import { errorHandler, AppError } from './shared/middleware/error.middleware.js';
import { studentRoutes } from './features/students/index.js';
import { courseRoutes } from './features/courses/index.js';
import { enrollmentRoutes } from './features/enrollments/index.js';
import { gradeRoutes } from './features/grades/index.js';
import { dashboardRoutes } from './features/dashboard/index.js';
import { authRoutes } from './features/auth/index.js';
import { config } from './shared/config/env.js';
import { isSupabaseConnected } from './shared/db/supabase.js';

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }));
  app.use(express.json());
  app.use(requestLogger);

  // Health check & DB status
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Student Record Management System API',
      database: isSupabaseConnected() ? 'supabase' : 'local-memory',
      timestamp: new Date().toISOString()
    });
  });

  // Feature Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/grades', gradeRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Catch-all 404
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Resource not found: ${req.method} ${req.originalUrl}`, 404));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
