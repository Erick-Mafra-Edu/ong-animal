import type { SupabaseClient } from '@supabase/supabase-js'

export type OngAnimal = {
  id: string
  name: string
  age: number
  location: string
  image_url: string
  bio: string
  traits: string[]
  is_active: boolean
  sort_order: number
}

export type NewOngAnimal = Omit<OngAnimal, 'id' | 'sort_order'>

export type OngDashboardStats = {
  total: number
  active: number
  inactive: number
}

export async function fetchOngAnimals(client: SupabaseClient): Promise<OngAnimal[]> {
  const { data, error } = await client
    .from('swipe_profiles')
    .select('id,name,age,location,image_url,bio,traits,is_active,sort_order')
    .order('sort_order', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function fetchOngDashboardStats(client: SupabaseClient): Promise<OngDashboardStats> {
  const { data, error } = await client
    .from('swipe_profiles')
    .select('id,is_active')

  if (error) {
    throw new Error(error.message)
  }

  const rows = data ?? []
  const total = rows.length
  const active = rows.filter((r) => r.is_active).length
  const inactive = total - active

  return { total, active, inactive }
}

export async function insertOngAnimal(
  client: SupabaseClient,
  animal: NewOngAnimal,
): Promise<void> {
  const { error } = await client.from('swipe_profiles').insert({
    ...animal,
    // New animals are appended at the end; the consumer can reorder via the sort_order column later.
    sort_order: 0,
  })

  if (error) {
    throw new Error(error.message)
  }
}
