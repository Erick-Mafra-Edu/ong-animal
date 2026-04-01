// Ensure Supabase env vars are available for integration tests.
// The real values are injected by CI secrets; these are empty defaults for local runs.
process.env.EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
process.env.EXPO_PUBLIC_SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || '';
