import { describe, expect, it } from 'vitest';
import {
  apiBase,
  projectId,
  publicAnonKey,
  supabase,
  supabaseAnonKey,
  supabaseUrl,
} from '/utils/supabase/info';

// Smoke tests that verify the Supabase module wires environment variables
// through correctly and keeps the deprecated legacy exports in sync during
// the Phase 0 auth migration.

describe('supabase info module', () => {
  it('exposes the expected URL + anon key from env', () => {
    expect(supabaseUrl).toBe('https://example.supabase.co');
    expect(supabaseAnonKey).toBe('test-anon-key');
  });

  it('builds apiBase from the function slug', () => {
    expect(apiBase).toBe('https://example.supabase.co/functions/v1/make-server-test');
  });

  it('keeps legacy `projectId` and `publicAnonKey` exports in sync', () => {
    // Legacy callers used these names; they should still resolve to sensible
    // values for the migration window.
    expect(projectId).toBe('example');
    expect(publicAnonKey).toBe('test-anon-key');
  });

  it('creates a single shared Supabase client', () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.auth.getSession).toBe('function');
  });
});
