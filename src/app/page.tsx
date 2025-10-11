'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DISCTest from '@/components/DISCTest'
import DISCReport from '@/components/DISCReport'
import AuthForm from '@/components/AuthForm'
import { discQuestions, type DISCResponse, type DISCResult } from '@/lib/disc-algorithm'
import { useDISCTest } from '@/hooks/useDISCTest'
import { Brain, Users, Target, Star, Play, CheckCircle, Clock, BarChart3, Loader2 } from 'lucide-react'

type AppState = 'welcome' | 'auth' | 'testing' | 'report' | 'upgrade'

interface User {
  name: string
  email: string
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('welcome')
  const [testResult, setTestResult] = useState<DISCResult | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const { saveTestResponses, logActivity, loading, error } = useDISCTest()

  const handleStartTest = async () => {
    await logActivity('test_started')
    setAppState('auth')
  }

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user)
    setAppState('testing')
  }

  const handleAuthCancel = () => {
    setAppState('welcome')
  }

  const handleTestComplete = async (responses: DISCResponse[]) => {
    try {
      const result = await saveTestResponses(responses)
      setTestResult(result)
      setAppState('report')
      await logActivity('report_viewed', { profile: result.primary_profile })
    } catch (err) {
      console.error('Erro ao salvar teste:', err)
      // Fallback: calcular localmente se falhar no Supabase
      const { calculateDISC } = await import('@/lib/disc-algorithm')
      const result = calculateDISC(responses)
      setTestResult(result)
      setAppState('report')
    }
  }

  const handleRestart = () => {
    setTestResult(null)
    setCurrentUser(null)
    setAppState('welcome')
  }

  const handleUpgrade = async () => {
    await logActivity('upgrade_viewed')
    setAppState('upgrade')
  }

  if (appState === 'auth') {
    return (
      <AuthForm 
        onAuthSuccess={handleAuthSuccess}
        onCancel={handleAuthCancel}
      />
    )
  }

  if (appState === 'testing') {
    return (
      <DISCTest 
        questions={discQuestions} 
        onComplete={handleTestComplete}
      />
    )
  }

  if (appState === 'report' && testResult && currentUser) {
    return (
      <DISCReport 
        result={testResult}
        user={currentUser}
        onRestart={handleRestart}
        onUpgrade={handleUpgrade}
      />
    )
  }

  if (appState === 'upgrade') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Relatório DISC Completo
          </h1>
          <p className="text-xl text-gray-600">Desbloqueie todo o potencial da sua análise</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Relatório Gratuito */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Gratuito</Badge>
                Relatório Simples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Perfil primário identificado</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Gráfico da curva natural</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Pontos fortes e áreas a desenvolver</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Feedback comportamental personalizado</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Análise do perfil secundário</span>
                </div>
              </div>
              <Button 
                onClick={() => setAppState('report')}
                variant="outline" 
                className="w-full"
              >
                Voltar ao Relatório Gratuito
              </Button>
            </CardContent>
          </Card>

          {/* Relatório Completo */}
          <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-purple-600">Premium</Badge>
                Relatório Completo (30+ páginas)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-800">Tudo do Relatório Simples +</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-700">
                    <BarChart3 className="h-4 w-4" />
                    <span>Análise detalhada de liderança</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Target className="h-4 w-4" />
                    <span>Estratégias de comunicação específicas</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Users className="h-4 w-4" />
                    <span>Identificação de gatilhos de estresse</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Star className="h-4 w-4" />
                    <span>Guia de desenvolvimento profissional</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <Brain className="h-4 w-4" />
                    <span>Plano de ação personalizado</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Compatibilidade com outros perfis</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">R$ 47,90</div>
                  <div className="text-sm text-gray-600">Pagamento único</div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
                onClick={() => logActivity('purchase_clicked')}
              >
                Adquirir Relatório Completo
              </Button>

              <div className="text-center text-xs text-gray-500">
                💳 Pagamento seguro • 📧 Entrega imediata por email
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-blue-800">🎯 Por que investir no Relatório Completo?</h4>
              <p className="text-blue-700">
                O relatório completo oferece insights profundos para desenvolvimento pessoal e profissional, 
                com estratégias práticas baseadas no seu perfil único DISC.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Welcome Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            DISC Rápido
          </h1>
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full inline-block text-sm font-semibold">
            ⚡ Otnitec - Tecnologia em Avaliação Comportamental
          </div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Descubra seu perfil comportamental em apenas 10 minutos
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Teste científico baseado na metodologia DISC para identificar seus pontos fortes, 
            estilo de comunicação e áreas de desenvolvimento.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg">Dominância</h3>
              <p className="text-sm text-gray-600">
                Orientado a resultados, direto e focado em objetivos
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">Influência</h3>
              <p className="text-sm text-gray-600">
                Sociável, otimista e inspirador para outros
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Estabilidade</h3>
              <p className="text-sm text-gray-600">
                Confiável, paciente e valoriza relacionamentos
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Conformidade</h3>
              <p className="text-sm text-gray-600">
                Analítico, preciso e focado em qualidade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">1. Responda 25 Questões</h3>
                <p className="text-gray-600">
                  Para cada situação, escolha a opção (A, B, C ou D) que melhor descreve você
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">2. Análise Automática</h3>
                <p className="text-gray-600">
                  Nosso algoritmo calcula seu perfil comportamental natural baseado nas suas respostas
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">3. Receba seu Relatório</h3>
                <p className="text-gray-600">
                  Descubra seu perfil, pontos fortes e áreas a desenvolver com feedback personalizado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 text-center space-y-2">
              <Clock className="mx-auto h-8 w-8 text-blue-600" />
              <h4 className="font-semibold">Rápido</h4>
              <p className="text-sm text-gray-600">Apenas 10 minutos para completar</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6 text-center space-y-2">
              <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
              <h4 className="font-semibold">Científico</h4>
              <p className="text-sm text-gray-600">Baseado na metodologia DISC validada</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6 text-center space-y-2">
              <Star className="mx-auto h-8 w-8 text-purple-600" />
              <h4 className="font-semibold">Personalizado</h4>
              <p className="text-sm text-gray-600">Feedback específico baseado no seu perfil</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6">
          <Button 
            onClick={handleStartTest}
            disabled={loading}
            size="lg"
            className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Preparando...
              </>
            ) : (
              <>
                <Play className="mr-2 h-6 w-6" />
                Iniciar Teste Gratuito
              </>
            )}
          </Button>
          
          <p className="text-sm text-gray-500">
            ✨ Relatório básico gratuito • 🔓 Relatório completo disponível após o teste
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center max-w-md mx-auto">
              <p className="text-red-800 text-sm">
                ⚠️ {error}
              </p>
              <p className="text-red-600 text-xs mt-1">
                O teste funcionará mesmo sem conexão com o banco de dados.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p className="font-medium">🧠 Sobre o DISC</p>
              <p>
                O DISC é uma das ferramentas de avaliação comportamental mais utilizadas no mundo, 
                desenvolvida com base na teoria do psicólogo William Marston. É usado por milhões 
                de profissionais para desenvolvimento pessoal, liderança e trabalho em equipe.
              </p>
              <p className="text-xs text-gray-500 mt-4">
                © 2024 DISC Rápido Otnitec - Todos os direitos reservados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}