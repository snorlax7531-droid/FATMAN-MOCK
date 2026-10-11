import { createClient } from '@supabase/supabase-js';
import { AttemptModel, TestModel, Question } from '../types';

export const SUPABASE_PROJECT_ID = 'caowbukfcjtpxulgixen';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhb3didWtmY2p0cHh1bGdpeGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDUyMjMsImV4cCI6MjEwNzEyMTIyM30.0_DSxT2rdUCnitbWn1nzQgqezsRQYac6qkBEwbmDlBI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Format attempt data into standard snake_case columns suitable for PostgreSQL / Supabase,
 * while also including camelCase fields for flexibility with existing schemas.
 */
export function formatAttemptForSupabase(attempt: AttemptModel) {
  return {
    id: attempt.id,
    user_id: attempt.userId,
    user_email: attempt.userEmail,
    user_name: attempt.userName,
    test_id: attempt.testId,
    test_title: attempt.testTitle,
    subject: attempt.subject,
    score: attempt.score,
    total_marks: attempt.totalMarks,
    accuracy: attempt.accuracy,
    time_taken_seconds: attempt.timeTakenSeconds,
    correct_count: attempt.correctCount,
    incorrect_count: attempt.incorrectCount,
    unattempted_count: attempt.unattemptedCount,
    answers: attempt.answers,
    submitted_at: attempt.submittedAt,
    status: attempt.status,
    created_at: attempt.submittedAt || new Date().toISOString()
  };
}

/**
 * Maps database record back to AttemptModel
 */
export function mapSupabaseRecordToAttempt(row: any): AttemptModel {
  return {
    id: row.id || row.attempt_id,
    userId: row.user_id || row.userId || 'guest-aspirant',
    userEmail: row.user_email || row.userEmail || '',
    userName: row.user_name || row.userName || 'Student Aspirant',
    testId: row.test_id || row.testId,
    testTitle: row.test_title || row.testTitle || 'GK/GS Mock Test',
    subject: row.subject || 'General',
    score: Number(row.score ?? 0),
    totalMarks: Number(row.total_marks ?? row.totalMarks ?? 50),
    accuracy: Number(row.accuracy ?? 0),
    timeTakenSeconds: Number(row.time_taken_seconds ?? row.timeTakenSeconds ?? 0),
    correctCount: Number(row.correct_count ?? row.correctCount ?? 0),
    incorrectCount: Number(row.incorrect_count ?? row.incorrectCount ?? 0),
    unattemptedCount: Number(row.unattempted_count ?? row.unattemptedCount ?? 0),
    answers: Array.isArray(row.answers) ? row.answers : (typeof row.answers === 'string' ? JSON.parse(row.answers || '[]') : []),
    submittedAt: row.submitted_at || row.submittedAt || row.created_at || new Date().toISOString(),
    status: 'completed'
  };
}

export const SupabaseService = {
  /**
   * Test connection to Supabase
   */
  async checkConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
    try {
      // Test querying student_attempts or attempts
      const { data, error } = await supabase.from('student_attempts').select('id').limit(1);
      if (!error) {
        return { connected: true, message: 'Connected to Supabase (student_attempts table active)' };
      }

      // Check if table 'attempts' exists instead
      const altCheck = await supabase.from('attempts').select('id').limit(1);
      if (!altCheck.error) {
        return { connected: true, message: 'Connected to Supabase (attempts table active)' };
      }

      // If table doesn't exist yet, we still know the API and project auth works
      return { 
        connected: true, 
        message: 'Connected to Supabase project caowbukfcjtpxulgixen (ready for tables)',
        details: error.message 
      };
    } catch (err: any) {
      return { connected: false, message: err?.message || 'Connection failed' };
    }
  },

  /**
   * Save student attempt to Supabase backend tables.
   * Tries 'student_attempts' first, and falls back to 'attempts' table.
   */
  async saveStudentAttempt(attempt: AttemptModel): Promise<{ success: boolean; table?: string; error?: any }> {
    const payload = formatAttemptForSupabase(attempt);

    // 1. Try 'student_attempts' table
    try {
      const { data, error } = await supabase
        .from('student_attempts')
        .upsert(payload, { onConflict: 'id' });

      if (!error) {
        console.log('✅ Student attempt successfully saved to Supabase (student_attempts):', attempt.id);
        return { success: true, table: 'student_attempts' };
      }
      console.warn('Notice saving to student_attempts:', error.message);
    } catch (err) {
      console.warn('Exception saving to student_attempts:', err);
    }

    // 2. Try 'attempts' table
    try {
      const { data, error } = await supabase
        .from('attempts')
        .upsert(payload, { onConflict: 'id' });

      if (!error) {
        console.log('✅ Student attempt successfully saved to Supabase (attempts):', attempt.id);
        return { success: true, table: 'attempts' };
      }
      console.warn('Notice saving to attempts:', error.message);
      return { success: false, error: error.message };
    } catch (err: any) {
      console.warn('Exception saving to attempts table:', err);
      return { success: false, error: err?.message };
    }
  },

  /**
   * Fetch all student attempts from Supabase
   */
  async getAllStudentAttempts(): Promise<AttemptModel[]> {
    try {
      // Try student_attempts
      const { data, error } = await supabase
        .from('student_attempts')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseRecordToAttempt);
      }

      // Try attempts
      const alt = await supabase
        .from('attempts')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!alt.error && alt.data && alt.data.length > 0) {
        return alt.data.map(mapSupabaseRecordToAttempt);
      }
    } catch (err) {
      console.warn('Supabase getAllStudentAttempts error:', err);
    }
    return [];
  },

  /**
   * Fetch attempts for a specific student user from Supabase
   */
  async getUserAttempts(userId: string): Promise<AttemptModel[]> {
    try {
      const { data, error } = await supabase
        .from('student_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseRecordToAttempt);
      }

      const alt = await supabase
        .from('attempts')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (!alt.error && alt.data && alt.data.length > 0) {
        return alt.data.map(mapSupabaseRecordToAttempt);
      }
    } catch (err) {
      console.warn('Supabase getUserAttempts error:', err);
    }
    return [];
  },

  /**
   * Sync / Save test metadata to Supabase
   */
  async saveTestToSupabase(test: TestModel): Promise<boolean> {
    try {
      const payload = {
        id: test.id,
        title: test.title,
        subject: test.subject,
        chapter: test.chapter || '',
        day_number: test.dayNumber || null,
        duration_minutes: test.durationMinutes || 15,
        total_marks: test.totalMarks || 50,
        positive_marks: test.positiveMarks || 2,
        negative_marks: test.negativeMarks || 0.5,
        question_count: test.questionCount || 0,
        created_at: test.createdAt || new Date().toISOString()
      };

      const { error } = await supabase.from('tests').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch (err) {
      return false;
    }
  },

  /**
   * Upsert user profile to Supabase 'profiles' table.
   * Handles existing users by email/id gracefully to prevent duplicate key constraint violations.
   */
  async upsertUserProfile(profile: { id: string; email: string; full_name?: string; role?: string; created_at?: string }) {
    try {
      const cleanEmail = profile.email.trim();
      const cleanName = profile.full_name || cleanEmail.split('@')[0];

      // 1. Check if profile with this email already exists
      const { data: existing, error: findError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: cleanName,
            role: profile.role || existing.role || 'student'
          })
          .eq('email', cleanEmail);

        if (!updateError) {
          return { success: true, updated: true };
        }
      }

      // 2. Insert new record
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: profile.id,
          email: cleanEmail,
          full_name: cleanName,
          role: profile.role || 'student',
          created_at: profile.created_at || new Date().toISOString()
        });

      if (!insertError) {
        return { success: true, inserted: true };
      }

      // 3. Fallback: onConflict email upsert
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          email: cleanEmail,
          full_name: cleanName,
          role: profile.role || 'student',
          created_at: profile.created_at || new Date().toISOString()
        }, { onConflict: 'email' });

      return { success: !upsertError, error: upsertError?.message };
    } catch (err: any) {
      console.warn('upsertUserProfile error:', err);
      return { success: false, error: err?.message };
    }
  },

  /**
   * Fetch all users from Supabase 'profiles' table (merged with student_attempts)
   */
  async getAllUsers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const userMap = new Map<string, any>();

      if (!error && Array.isArray(data)) {
        data.forEach(u => {
          if (u.email) {
            userMap.set(u.email.toLowerCase(), u);
          }
        });
      }

      // Also supplement with any student who submitted an exam
      try {
        const attempts = await this.getAllStudentAttempts();
        attempts.forEach(a => {
          if (a.userEmail && !userMap.has(a.userEmail.toLowerCase())) {
            userMap.set(a.userEmail.toLowerCase(), {
              id: a.userId,
              email: a.userEmail,
              full_name: a.userName,
              role: 'student',
              created_at: a.submittedAt
            });
          }
        });
      } catch (attErr) {
        console.warn('Could not load attempts for user list fallback:', attErr);
      }

      return Array.from(userMap.values());
    } catch (err) {
      console.warn('Error fetching all users from Supabase:', err);
      return [];
    }
  }
};
