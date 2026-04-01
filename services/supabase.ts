import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type TipoUsuario = 'adotante' | 'ong';
export type StatusAnimal = 'disponivel' | 'adotado';
export type StatusMatch = 'aguardando' | 'aprovado' | 'recusado';

export interface UserProfile {
  id: string;
  nome: string;
  cidade: string;
  tipo_usuario: TipoUsuario;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  tipo_moradia: string;
  tem_criancas: boolean;
  tempo_para_brincar: string;
  nivel_atividade: string;
  experiencia_animais: string;
  prefere_tipo: string;
  prefere_porte: string;
  prefere_idade: string;
}

export interface Animal {
  id: string;
  ong_id: string;
  nome: string;
  tipo: string;
  idade: string;
  porte: string;
  nivel_energia: string;
  descricao: string;
  status: StatusAnimal;
  foto_url: string;
  created_at: string;
}

export interface Swipe {
  id: string;
  user_id: string;
  animal_id: string;
  interesse: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  user_id: string;
  animal_id: string;
  status: StatusMatch;
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  conteudo: string;
  created_at: string;
}
