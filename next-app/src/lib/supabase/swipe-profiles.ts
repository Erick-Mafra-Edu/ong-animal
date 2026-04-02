import type { SupabaseClient } from '@supabase/supabase-js'

export type SwipeProfileRecord = {
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

export type SwipeProfile = {
  id: string
  name: string
  age: number
  location: string
  image: string
  bio: string
  traits: string[]
}

const fallbackProfiles: SwipeProfile[] = [
  {
    id: 'yolo',
    name: 'Yolo',
    age: 2,
    location: 'São Paulo, SP',
    image:
      'https://firebasestorage.googleapis.com/v0/b/codeless-app.appspot.com/o/projects%2F0SObcceZFqcMj44PAXdK%2F2caeaa6e02fa3ae736d01407675af388d36db7dcRectangle.png?alt=media&token=d65ade4e-cfa2-493d-924f-9f6d4275a669',
    bio: 'Companheiro tranquilo, ótimo para quem está começando a rotina de adoção.',
    traits: ['Calmo', 'Vacinado', 'Sociável'],
  },
  {
    id: 'mila',
    name: 'Mila',
    age: 1,
    location: 'Campinas, SP',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    bio: 'Cheia de energia e carinhosa, adora brincadeiras e passeios longos.',
    traits: ['Ativa', 'Inteligente', 'Brincalhona'],
  },
  {
    id: 'pingo',
    name: 'Pingo',
    age: 4,
    location: 'Sorocaba, SP',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
    bio: 'Mais reservado no início, cria vínculo forte com adaptação gradual.',
    traits: ['Gentil', 'Observador', 'Carinhoso'],
  },
]

function mapRecordToProfile(record: SwipeProfileRecord): SwipeProfile {
  return {
    id: record.id,
    name: record.name,
    age: record.age,
    location: record.location,
    image: record.image_url,
    bio: record.bio,
    traits: record.traits,
  }
}

export function getFallbackSwipeProfiles() {
  return fallbackProfiles
}

function isSwipeProfilesTableMissing(message: string) {
  const normalized = message.toLowerCase()

  return (
    normalized.includes("could not find the table 'public.swipe_profiles'") ||
    normalized.includes('relation "public.swipe_profiles" does not exist') ||
    normalized.includes('relation "swipe_profiles" does not exist')
  )
}

function normalizeSwipeProfilesError(message: string) {
  if (isSwipeProfilesTableMissing(message)) {
    return 'A tabela public.swipe_profiles ainda não existe no Supabase. Execute o SQL de next-app/supabase/schema.sql para criar a tabela.'
  }

  return message
}

export async function fetchSwipeProfiles(client: SupabaseClient) {
  const { data, error } = await client
    .from('swipe_profiles')
    .select('id,name,age,location,image_url,bio,traits,is_active,sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw new Error(normalizeSwipeProfilesError(error.message))
  }

  return (data ?? []).map(mapRecordToProfile)
}