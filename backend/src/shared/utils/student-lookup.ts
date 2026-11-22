import { AuthTokenPayload } from '../../features/auth/auth.types.js';
import { supabase, isSupabaseConnected } from '../db/supabase.js';
import { db } from '../db/memory-db.js';

/**
 * Resolves the unique student ID ('std-xxx') associated with a given authenticated user.
 * Searches:
 * 1. user.studentId (if already on token payload)
 * 2. Supabase 'students' table where email matches user.email
 * 3. In-memory local fallback where email matches user.email
 */
export async function resolveStudentIdForUser(user: AuthTokenPayload): Promise<string | undefined> {
  if (user.studentId) {
    return user.studentId;
  }

  if (user.role !== 'student') {
    return undefined;
  }

  const email = user.email.toLowerCase().trim();

  // Try Supabase lookup
  if (isSupabaseConnected() && supabase) {
    try {
      const { data } = await supabase
        .from('students')
        .select('id, student_id')
        .ilike('email', email)
        .maybeSingle();

      if (data?.id) {
        return data.id;
      }
    } catch (err) {
      console.warn('Error resolving student ID in Supabase:', err);
    }
  }

  // Fallback in-memory db lookup
  const local = db.students.find((s) => s.email.toLowerCase() === email);
  return local?.id;
}
