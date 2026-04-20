import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authedFetch, supabase } from '/utils/supabase/info';

// These tests ensure the Authorization header is always attached to API
// calls — the whole point of authedFetch. Using the anon key as a fallback
// keeps the unauthenticated /health route working for public checks.

describe('authedFetch', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn(
      async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('falls back to the anon key when no session is present', async () => {
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValueOnce({
      // @ts-expect-error — minimal session shape for the test
      data: { session: null },
      error: null,
    });

    await authedFetch('/health');

    const [, init] = (globalThis.fetch as unknown as vi.Mock).mock.calls[0];
    const headers = new Headers(init.headers);
    expect(headers.get('Authorization')).toBe('Bearer test-anon-key');
  });

  it('uses the session access token when logged in', async () => {
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValueOnce({
      // @ts-expect-error — minimal session shape for the test
      data: { session: { access_token: 'user-jwt-123' } },
      error: null,
    });

    await authedFetch('/profile');

    const [url, init] = (globalThis.fetch as unknown as vi.Mock).mock.calls[0];
    expect(url).toBe('https://example.supabase.co/functions/v1/make-server-test/profile');
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer user-jwt-123');
  });

  it('sets Content-Type: application/json when a body is present', async () => {
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValueOnce({
      // @ts-expect-error — minimal session shape for the test
      data: { session: { access_token: 't' } },
      error: null,
    });

    await authedFetch('/profile', {
      method: 'POST',
      body: JSON.stringify({ name: 'Anu' }),
    });

    const [, init] = (globalThis.fetch as unknown as vi.Mock).mock.calls[0];
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
  });
});
