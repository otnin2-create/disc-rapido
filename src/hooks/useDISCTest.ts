'use client'

import { useState, useEffect } from 'react'
import { DISCResponse, DISCResult, calculateDISC } from '@/lib/disc-algorithm'

export function useDISCTest() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simular usuário anônimo para funcionamento offline
    setUser({ id: 'offline-user-' + Date.now() })
  }, [])

  const signInAnonymously = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular login anônimo offline
      const offlineUser = { id: 'offline-user-' + Date.now() }
      setUser(offlineUser)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveTestResponses = async (responses: DISCResponse[]): Promise<DISCResult> => {
    if (!user) {
      await signInAnonymously()
    }

    setLoading(true)
    setError(null)

    try {
      // Tentar salvar no Supabase se disponível
      try {
        const { supabase } = await import('@/lib/supabase')
        
        // Verificar se as variáveis de ambiente estão configuradas
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          // Salvar respostas brutas (formato simplificado)
          const responseData = responses.map(response => ({
            user_id: user?.id,
            question_id: response.qID,
            selected_choice: response.choice,
            selected_trait: response.trait,
            time_spent: response.tempo_gasto
          }))

          const { error: responsesError } = await supabase
            .from('user_responses_simple')
            .insert(responseData)

          if (responsesError) throw responsesError

          // Calcular resultado DISC (apenas curva natural)
          const result = calculateDISC(responses)

          // Salvar relatório final simplificado
          const { error: reportError } = await supabase
            .from('user_reports_simple')
            .insert({
              user_id: user?.id,
              d_natural: result.D_nat,
              i_natural: result.I_nat,
              s_natural: result.S_nat,
              c_natural: result.C_nat,
              primary_profile: result.primary_profile,
              secondary_profile: result.secondary_profile,
              pontos_fortes: result.pontos_fortes,
              areas_desenvolver: result.areas_desenvolver,
              feedback_comportamental: result.feedback_comportamental
            })

          if (reportError) throw reportError

          // Log atividade
          await supabase
            .from('user_activity')
            .insert({
              user_id: user?.id,
              action: 'test_completed_simple',
              metadata: { total_questions: responses.length }
            })

          return result
        } else {
          throw new Error('Supabase não configurado')
        }
      } catch (supabaseError) {
        // Fallback: calcular localmente
        console.log('Funcionando offline - dados não serão salvos')
        const result = calculateDISC(responses)
        
        // Salvar localmente no localStorage para persistência básica
        const localData = {
          responses,
          result,
          timestamp: Date.now()
        }
        localStorage.setItem('disc-test-result', JSON.stringify(localData))
        
        return result
      }
    } catch (err: any) {
      setError('Funcionando offline - dados não serão salvos')
      // Sempre retornar resultado mesmo com erro
      const result = calculateDISC(responses)
      return result
    } finally {
      setLoading(false)
    }
  }

  const getUserReports = async () => {
    if (!user) return []

    setLoading(true)
    setError(null)

    try {
      // Tentar buscar do Supabase se disponível
      try {
        const { supabase } = await import('@/lib/supabase')
        
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const { data, error } = await supabase
            .from('user_reports_simple')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) throw error
          return data || []
        } else {
          throw new Error('Supabase não configurado')
        }
      } catch (supabaseError) {
        // Fallback: buscar do localStorage
        const localData = localStorage.getItem('disc-test-result')
        if (localData) {
          const parsed = JSON.parse(localData)
          return [parsed.result]
        }
        return []
      }
    } catch (err: any) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const logActivity = async (action: string, metadata?: any) => {
    if (!user) return

    try {
      // Tentar logar no Supabase se disponível
      const { supabase } = await import('@/lib/supabase')
      
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        await supabase
          .from('user_activity')
          .insert({
            user_id: user.id,
            action,
            metadata
          })
      }
    } catch (err) {
      // Silenciosamente falhar se não conseguir logar
      console.log('Atividade não registrada - funcionando offline')
    }
  }

  return {
    user,
    loading,
    error,
    signInAnonymously,
    saveTestResponses,
    getUserReports,
    logActivity
  }
}