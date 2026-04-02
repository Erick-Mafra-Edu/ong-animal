/**
 * Supabase Integration Tests
 * ===========================
 * These tests call the real Supabase API.
 * They are skipped automatically when credentials are not set.
 *
 * Requirements:
 *   EXPO_PUBLIC_SUPABASE_URL  – Supabase project URL
 *   EXPO_PUBLIC_SUPABASE_KEY  – Supabase anon public key
 *
 * Run with:
 *   npx jest --config jest.integration.config.js
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '';

const hasCredentials =
  SUPABASE_URL.startsWith('https://') && SUPABASE_KEY.length > 20;

const describeIfCreds = hasCredentials ? describe : describe.skip;

let client: SupabaseClient;

beforeAll(() => {
  if (hasCredentials) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Connectivity
// ─────────────────────────────────────────────────────────────────────────────
describeIfCreds('Supabase – Connectivity', () => {
  it('connects to the project and health endpoint responds', async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { apikey: SUPABASE_KEY },
    });
    // 200 = open, 401 = requires JWT but reachable – both mean the project is up
    expect([200, 401]).toContain(res.status);
  });

  it('creates supabase client without throwing', () => {
    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
    expect(typeof client.auth.signInWithPassword).toBe('function');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Animals table – read public data
// ─────────────────────────────────────────────────────────────────────────────
describeIfCreds('Supabase – Animals table', () => {
  it('fetches available animals without error', async () => {
    const { data, error } = await client
      .from('animals')
      .select('id, nome, tipo, status')
      .eq('status', 'disponivel')
      .limit(5);

    // RLS may return empty array – that's fine; we just need no network error
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('returns correct shape for each animal row', async () => {
    const { data } = await client
      .from('animals')
      .select('id, nome, tipo, porte, nivel_energia, status')
      .limit(3);

    (data ?? []).forEach((animal) => {
      expect(typeof animal.id).toBe('string');
      expect(typeof animal.nome).toBe('string');
      expect(['cachorro', 'gato']).toContain(animal.tipo);
      expect(['disponivel', 'adotado']).toContain(animal.status);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Auth – sign-up / sign-in / sign-out
// ─────────────────────────────────────────────────────────────────────────────
describeIfCreds('Supabase – Auth flow', () => {
  const TEST_EMAIL = `test_${Date.now()}_${process.pid}@ong-animal-ci.dev`;
  const TEST_PASSWORD = 'Test@1234567';
  let userId: string | undefined;

  afterAll(async () => {
    // Clean up: sign out regardless
    await client.auth.signOut();
  });

  it('signs up a new user', async () => {
    const { data, error } = await client.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    // Some projects have email-confirm enabled; in that case user is created
    // but session may be null – we still expect no hard error
    expect(error).toBeNull();
    expect(data.user).not.toBeNull();
    userId = data.user?.id;
  });

  it('signs in with the same credentials', async () => {
    // Skip if project requires email confirmation
    if (!userId) return;

    const { data, error } = await client.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (error?.message?.toLowerCase().includes('email not confirmed')) {
      // Email confirmation required – expected in some Supabase configs
      return;
    }

    expect(error).toBeNull();
    expect(data.session).not.toBeNull();
    expect(data.user?.email).toBe(TEST_EMAIL);
  });

  it('rejects invalid credentials', async () => {
    const { error } = await client.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: 'wrong-password-abc',
    });
    expect(error).not.toBeNull();
  });

  it('signs out successfully', async () => {
    const { error } = await client.auth.signOut();
    expect(error).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Users table – RLS check
// ─────────────────────────────────────────────────────────────────────────────
describeIfCreds('Supabase – Users table RLS', () => {
  it('returns empty result for unauthenticated user (RLS enforced)', async () => {
    // Sign out first to ensure anonymous access
    await client.auth.signOut();

    const { data, error } = await client
      .from('users')
      .select('id')
      .limit(1);

    // RLS should either return empty array or an RLS error
    const rlsActive =
      (data !== null && data.length === 0) ||
      error?.code === 'PGRST116' ||
      error?.message?.includes('permission') ||
      error?.message?.includes('policy');

    expect(rlsActive).toBe(true);
  });
});
