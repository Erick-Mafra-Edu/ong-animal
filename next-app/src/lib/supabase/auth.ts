import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

export type AuthCredentials = {
  email: string
  password: string
}

export async function signInWithEmailAndPassword(
  client: SupabaseClient,
  credentials: AuthCredentials,
) {
  const { data, error } = await client.auth.signInWithPassword(credentials)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOut(client: SupabaseClient) {
  const { error } = await client.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

export type AuthSnapshot = {
  session: Session | null
  user: User | null
}
