import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { Client as PostgresClient } from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const schemaPath = path.join(projectRoot, 'supabase', 'schema.sql')

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const content = fs.readFileSync(filePath, 'utf8')
  return content.split(/\r?\n/).reduce((accumulator, line) => {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      return accumulator
    }

    const [key, ...valueParts] = trimmed.split('=')
    accumulator[key] = valueParts.join('=')
    return accumulator
  }, {})
}

function isDirectSupabaseDbHost(connectionString) {
  try {
    const url = new URL(connectionString)
    return url.hostname.startsWith('db.') && url.hostname.endsWith('.supabase.co') && (url.port === '5432' || url.port === '')
  } catch {
    return false
  }
}

function formatConnectionHint(errorMessage) {
  const normalized = String(errorMessage ?? '').toLowerCase()

  if (
    normalized.includes('enetunreach') ||
    normalized.includes('ehostunreach') ||
    normalized.includes('timeout') ||
    normalized.includes('connect etimedout')
  ) {
    if (env.SUPABASE_DB_URL && isDirectSupabaseDbHost(env.SUPABASE_DB_URL)) {
      return 'Conexão Postgres direta (host db.*:5432) indisponível neste ambiente. Use a URI do Supabase Pooler (porta 6543) com sslmode=require em SUPABASE_DB_URL.'
    }
  }

  return null
}

const localEnv = parseEnvFile(path.join(projectRoot, '.env.local'))
const env = {
  SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? localEnv.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? localEnv.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_DB_URL:
    process.env.SUPABASE_DB_URL ??
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    localEnv.SUPABASE_DB_URL ??
    localEnv.POSTGRES_URL ??
    localEnv.DATABASE_URL,
}

const hasSupabaseClientCreds = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)
const hasDatabaseConnection = Boolean(env.SUPABASE_DB_URL)

if (!hasSupabaseClientCreds && !hasDatabaseConnection) {
  console.error(
    'Defina SUPABASE_DB_URL para executar o seed via Postgres, ou SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY para executar via Supabase client.',
  )
  process.exit(1)
}

if (!fs.existsSync(schemaPath)) {
  console.error(`Schema não encontrado em ${schemaPath}.`)
  process.exit(1)
}

const supabase = hasSupabaseClientCreds
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

const swipeProfiles = [
  {
    id: 'yolo',
    name: 'Yolo',
    age: 2,
    location: 'São Paulo, SP',
    image_url:
      'https://firebasestorage.googleapis.com/v0/b/codeless-app.appspot.com/o/projects%2F0SObcceZFqcMj44PAXdK%2F2caeaa6e02fa3ae736d01407675af388d36db7dcRectangle.png?alt=media&token=d65ade4e-cfa2-493d-924f-9f6d4275a669',
    bio: 'Companheiro tranquilo, ótimo para quem está começando a rotina de adoção.',
    traits: ['Calmo', 'Vacinado', 'Sociável'],
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'mila',
    name: 'Mila',
    age: 1,
    location: 'Campinas, SP',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    bio: 'Cheia de energia e carinhosa, adora brincadeiras e passeios longos.',
    traits: ['Ativa', 'Inteligente', 'Brincalhona'],
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'pingo',
    name: 'Pingo',
    age: 4,
    location: 'Sorocaba, SP',
    image_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
    bio: 'Mais reservado no início, cria vínculo forte com adaptação gradual.',
    traits: ['Gentil', 'Observador', 'Carinhoso'],
    is_active: true,
    sort_order: 3,
  },
]

async function ensureSwipeProfilesSchema() {
  if (!env.SUPABASE_DB_URL) {
    return {
      applied: false,
      message:
        'SUPABASE_DB_URL não definido. O seed só consegue criar/alterar tabela automaticamente com acesso Postgres direto.',
    }
  }

  const sql = fs.readFileSync(schemaPath, 'utf8').trim()

  if (!sql) {
    throw new Error(`Arquivo de schema vazio: ${schemaPath}`)
  }

  const postgres = new PostgresClient({
    connectionString: env.SUPABASE_DB_URL,
    ssl: env.SUPABASE_DB_URL.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
  })

  await postgres.connect()

  try {
    await postgres.query(sql)
  } finally {
    await postgres.end()
  }

  return {
    applied: true,
    message: 'Schema swipe_profiles criado/atualizado com sucesso antes do seed.',
  }
}

async function seedWithPostgres(profiles) {
  if (!env.SUPABASE_DB_URL) {
    throw new Error('SUPABASE_DB_URL não definido para seed via Postgres.')
  }

  const postgres = new PostgresClient({
    connectionString: env.SUPABASE_DB_URL,
    ssl: env.SUPABASE_DB_URL.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
  })

  await postgres.connect()

  try {
    for (const profile of profiles) {
      await postgres.query(
        `
        insert into public.swipe_profiles (id, name, age, location, image_url, bio, traits, is_active, sort_order)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        on conflict (id) do update set
          name = excluded.name,
          age = excluded.age,
          location = excluded.location,
          image_url = excluded.image_url,
          bio = excluded.bio,
          traits = excluded.traits,
          is_active = excluded.is_active,
          sort_order = excluded.sort_order,
          updated_at = now();
        `,
        [
          profile.id,
          profile.name,
          profile.age,
          profile.location,
          profile.image_url,
          profile.bio,
          profile.traits,
          profile.is_active,
          profile.sort_order,
        ],
      )
    }
  } finally {
    await postgres.end()
  }
}

let schemaApplied = false

try {
  const schemaResult = await ensureSwipeProfilesSchema()
  schemaApplied = schemaResult.applied
  console.log(schemaResult.message)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error('Falha ao criar/alterar tabela swipe_profiles:', message)
  const hint = formatConnectionHint(message)
  if (hint) {
    console.error(hint)
  }
  process.exit(1)
}

let error = null

if (supabase) {
  const result = await supabase.from('swipe_profiles').upsert(swipeProfiles, { onConflict: 'id' })
  error = result.error
} else {
  try {
    await seedWithPostgres(swipeProfiles)
  } catch (seedError) {
    error = {
      message: seedError instanceof Error ? seedError.message : 'Falha ao popular swipe_profiles via Postgres.',
    }
  }
}

if (error) {
  const normalizedMessage = String(error.message ?? '').toLowerCase()
  const missingTable =
    normalizedMessage.includes("could not find the table 'public.swipe_profiles'") ||
    normalizedMessage.includes('relation "public.swipe_profiles" does not exist') ||
    normalizedMessage.includes('relation "swipe_profiles" does not exist')

  console.error('Falha ao popular swipe_profiles:', error.message)

  if (missingTable) {
    if (!schemaApplied) {
      console.error('Para auto criação da tabela, defina SUPABASE_DB_URL (ou POSTGRES_URL / DATABASE_URL) e rode o seed novamente.')
    } else {
      console.error('A tabela ainda não foi encontrada mesmo após aplicar schema. Verifique permissões do usuário de banco e projeto Supabase ativo.')
    }
  }

  const hint = formatConnectionHint(error.message)
  if (hint) {
    console.error(hint)
  }

  process.exit(1)
}

console.log(`Seed concluído com ${swipeProfiles.length} perfis em swipe_profiles.`)