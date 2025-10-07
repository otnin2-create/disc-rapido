import { createClient } from '@supabase/supabase-js'

// Usar valores padrão se as variáveis não estiverem definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Question {
  id: number
  question_text: string
  option_d: string
  option_i: string
  option_s: string
  option_c: string
  active: boolean
}

export interface UserResponse {
  id: string
  user_id: string
  question_id: number
  mais_choice: 'D' | 'I' | 'S' | 'C'
  menos_choice: 'D' | 'I' | 'S' | 'C'
  time_spent: number
  created_at: string
}

export interface UserReport {
  id: string
  user_id: string
  d_natural: number
  i_natural: number
  s_natural: number
  c_natural: number
  d_adapted: number
  i_adapted: number
  s_adapted: number
  c_adapted: number
  primary_profile: string
  created_at: string
}