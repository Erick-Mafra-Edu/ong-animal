import type { SupabaseClient } from '@supabase/supabase-js'

export type MatchStatus = 'pending' | 'approved' | 'rejected'

export type ChatMatch = {
  id: string
  profile_id: string
  user_id: string
  status: MatchStatus
  created_at: string
  profile_name: string
  profile_image: string
}

export type ChatMatchRecord = {
  id: string
  profile_id: string
  user_id: string
  status: MatchStatus
  created_at: string
  swipe_profiles: {
    name: string
    image_url: string
  } | null
}

export async function fetchApprovedMatches(client: SupabaseClient, userId: string): Promise<ChatMatch[]> {
  const { data, error } = await client
    .from('chat_matches')
    .select('id, profile_id, user_id, status, created_at, swipe_profiles(name, image_url)')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return ((data ?? []) as ChatMatchRecord[]).map((row) => ({
    id: row.id,
    profile_id: row.profile_id,
    user_id: row.user_id,
    status: row.status,
    created_at: row.created_at,
    profile_name: row.swipe_profiles?.name ?? 'Perfil',
    profile_image: row.swipe_profiles?.image_url ?? '',
  }))
}

const fallbackMatches: ChatMatch[] = [
  {
    id: 'demo-match-yolo',
    profile_id: 'yolo',
    user_id: 'demo-user',
    status: 'approved',
    created_at: new Date().toISOString(),
    profile_name: 'Yolo',
    profile_image:
      'https://firebasestorage.googleapis.com/v0/b/codeless-app.appspot.com/o/projects%2F0SObcceZFqcMj44PAXdK%2F2caeaa6e02fa3ae736d01407675af388d36db7dcRectangle.png?alt=media&token=d65ade4e-cfa2-493d-924f-9f6d4275a669',
  },
  {
    id: 'demo-match-mila',
    profile_id: 'mila',
    user_id: 'demo-user',
    status: 'approved',
    created_at: new Date().toISOString(),
    profile_name: 'Mila',
    profile_image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  },
]

export function getFallbackMatches(): ChatMatch[] {
  return fallbackMatches
}
