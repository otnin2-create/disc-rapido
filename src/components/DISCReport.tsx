'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Download, Share2, Star, TrendingUp, Users, Target, Brain, CheckCircle, AlertCircle } from 'lucide-react'

interface DISCResult {
  D_nat: number
  I_nat: number
  S_nat: number
  C_nat: number
  primary_profile: string
  secondary_profile: string
  pontos_fortes: string[]
  areas_desenvolver: string[]
  feedback_comportamental: string
}

interface DISCReportProps {
  result: DISCResult
  onRestart: () => void
  onUpgrade: () => void
}

export default function DISCReport({ result, onRestart, onUpgrade }: DISCReportProps) {
  // Dados para o gráfico de barras (Curva Natural)
  const naturalData = [
    { name: 'Dominância', value: result.D_nat, color: '#ef4444' },
    { name: 'Influência', value: result.I_nat, color: '#f59e0b' },
    { name: 'Estabilidade', value: result.S_nat, color: '#10b981' },
    { name: 'Conformidade', value: result.C_nat, color: '#3b82f6' }
  ]

  // Descrições dos perfis
  const profileDescriptions = {
    'Dominância': {
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Você é orientado a resultados, direto e gosta de assumir o controle.',
      communication: 'Prefere comunicação direta, objetiva e focada em soluções.'
    },
    'Influência': {
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Você é sociável, otimista e gosta de inspirar e motivar outros.',
      communication: 'Prefere comunicação entusiástica, expressiva e colaborativa.'
    },
    'Estabilidade': {
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Você é confiável, paciente e valoriza relacionamentos estáveis.',
      communication: 'Prefere comunicação calma, respeitosa e harmoniosa.'
    },
    'Conformidade': {
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Você é analítico, preciso e valoriza qualidade e excelência.',
      communication: 'Prefere comunicação precisa, baseada em dados e bem estruturada.'
    }
  }

  const currentProfile = profileDescriptions[result.primary_profile as keyof typeof profileDescriptions]
  const ProfileIcon = currentProfile?.icon || Target

  // Função para gerar PDF gratuito
  const generateFreePDF = () => {
    const pdfContent = `
RELATÓRIO DISC GRATUITO - OTNITEC
=====================================

PERFIL PRIMÁRIO: ${result.primary_profile}
PERFIL SECUNDÁRIO: ${result.secondary_profile}

PONTUAÇÕES NATURAIS:
- Dominância: ${result.D_nat}%
- Influência: ${result.I_nat}%
- Estabilidade: ${result.S_nat}%
- Conformidade: ${result.C_nat}%

FEEDBACK COMPORTAMENTAL:
${result.feedback_comportamental}

PONTOS FORTES:
${result.pontos_fortes.map((ponto, index) => `${index + 1}. ${ponto}`).join('\n')}

ÁREAS A DESENVOLVER:
${result.areas_desenvolver.map((area, index) => `${index + 1}. ${area}`).join('\n')}

COMUNICAÇÃO:
${currentProfile?.communication}

=====================================
Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}
Otnitec - Desenvolvimento Humano
    `

    // Criar e baixar arquivo de texto (simulando PDF gratuito)
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-disc-${result.primary_profile.toLowerCase()}-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Seu Relatório DISC
        </h1>
        <p className="text-xl text-gray-600">Análise do seu perfil comportamental natural</p>
      </div>

      {/* Perfil Primário */}
      {currentProfile && (
        <Card className={`${currentProfile.bgColor} ${currentProfile.borderColor} border-2 shadow-lg`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ProfileIcon className={`h-8 w-8 ${currentProfile.color}`} />
              Seu Perfil Primário: {result.primary_profile}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-700">{currentProfile.description}</p>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-lg mb-3 text-blue-800">
                💬 Feedback Comportamental Personalizado:
              </h4>
              <p className="text-gray-700 italic">{result.feedback_comportamental}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Seus Pontos Fortes:
                </h4>
                <ul className="space-y-2">
                  {result.pontos_fortes.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-700">
                  <AlertCircle className="h-5 w-5" />
                  Áreas a Desenvolver:
                </h4>
                <ul className="space-y-2">
                  {result.areas_desenvolver.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-700">
                <Users className="h-5 w-5" />
                Estilo de Comunicação:
              </h4>
              <p className="text-gray-700">{currentProfile.communication}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico da Curva Natural */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Seu Perfil Comportamental Natural
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={naturalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Pontuação']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {naturalData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.value}%
                </div>
                <div className="text-sm text-gray-600">{item.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Oferta Premium */}
      <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Quer uma Análise Ainda Mais Completa?
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-purple-200">
            <h4 className="font-semibold text-lg mb-4 text-purple-800">
              🚀 Desbloqueie o Relatório Premium
            </h4>
            <div className="grid md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h5 className="font-medium mb-2">No Relatório Premium você terá:</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Análise detalhada de liderança personalizada</li>
                  <li>• Estratégias de comunicação específicas</li>
                  <li>• Identificação de gatilhos de estresse</li>
                  <li>• Guia de desenvolvimento profissional</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Conteúdo Exclusivo (30+ páginas):</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Plano de ação personalizado</li>
                  <li>• Compatibilidade com outros perfis</li>
                  <li>• Dicas de carreira baseadas no seu perfil</li>
                  <li>• Relatório profissional em PDF</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button 
          onClick={generateFreePDF}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Download className="mr-2 h-5 w-5" />
          Baixar Relatório Gratuito
        </Button>

        <Button 
          onClick={onUpgrade}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Star className="mr-2 h-5 w-5" />
          Obter Relatório Premium
        </Button>
        
        <Button 
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="px-8 py-3"
        >
          Fazer Novo Teste
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          className="px-8 py-3"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Compartilhar
        </Button>
      </div>

      {/* Footer informativo */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p className="font-medium">📊 Sobre o Teste DISC</p>
            <p>
              O DISC é uma ferramenta de avaliação comportamental baseada na teoria do psicólogo William Marston. 
              Ele mede quatro dimensões principais do comportamento humano em ambientes de trabalho e relacionamentos.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Este relatório é baseado em suas respostas e oferece insights para desenvolvimento pessoal e profissional.
              Relatório gratuito fornecido pela Otnitec.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}