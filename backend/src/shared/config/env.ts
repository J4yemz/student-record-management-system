import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  dataPersistence: process.env.DATA_PERSISTENCE === 'true',
  isDev: process.env.NODE_ENV !== 'production',
  // JWT Secret for authentication
  jwtSecret: process.env.JWT_SECRET || 'srms-enterprise-jwt-secret-key-2024',
  jwtExpiresIn: '7d',
  // Supabase Configuration
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  hasSupabase: Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY))
};
