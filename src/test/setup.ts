import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount React trees and reset mocks between tests so state from one test
// can't leak into the next.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Provide deterministic env vars for any module that reads import.meta.env
// at import time. Real values are injected by Vite at build/runtime.
vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
vi.stubEnv('VITE_SUPABASE_FUNCTION_SLUG', 'make-server-test');
