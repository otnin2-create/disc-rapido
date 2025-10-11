'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Download, Share2, Star, TrendingUp, Users, Target, Brain, CheckCircle, AlertCircle, Layers } from 'lucide-react'

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
  analise_perfil_secundario: string
  combinacao_perfis: string
  influencia_comportamental: string[]
}

interface User {
  name: string
  email: string
}

interface DISCReportProps {
  result: DISCResult
  user: User
  onRestart: () => void
  onUpgrade: () => void
}

export default function DISCReport({ result, user, onRestart, onUpgrade }: DISCReportProps) {
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
  const secondaryProfile = profileDescriptions[result.secondary_profile as keyof typeof profileDescriptions]
  const ProfileIcon = currentProfile?.icon || Target
  const SecondaryIcon = secondaryProfile?.icon || Target

  // Função para gerar PDF com cores compatíveis
  const generatePDF = async () => {
    try {
      // Importar bibliotecas dinamicamente
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      // Criar um elemento temporário com o conteúdo do relatório
      const reportElement = document.createElement('div')
      reportElement.style.width = '210mm' // A4 width
      reportElement.style.padding = '20mm'
      reportElement.style.fontFamily = 'Arial, sans-serif'
      reportElement.style.backgroundColor = '#ffffff'
      reportElement.style.color = '#333333'
      
      reportElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 10px;">RELATÓRIO DISC PERSONALIZADO</h1>
          <div style="background: #f59e0b; color: #ffffff; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: bold;">
            ⚡ Otnitec - Tecnologia em Avaliação Comportamental
          </div>
          <p style="margin-top: 15px; font-size: 16px; color: #666666;">Análise comportamental personalizada para <strong>${user.name}</strong></p>
          <p style="font-size: 14px; color: #888888;">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div style="border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; margin-bottom: 25px; background: #f8fafc;">
          <h2 style="color: #3b82f6; font-size: 22px; margin-bottom: 15px;">🎯 SEU PERFIL PRIMÁRIO: ${result.primary_profile.toUpperCase()}</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">${currentProfile?.description}</p>
          
          <div style="background: #ffffff; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">💬 Feedback Comportamental Personalizado:</h3>
            <p style="font-style: italic; line-height: 1.6;">${result.feedback_comportamental}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
            <div style="background: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="color: #059669; font-size: 16px; margin-bottom: 10px;">✅ Seus Pontos Fortes:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${result.pontos_fortes.map(strength => `<li style="margin-bottom: 5px; line-height: 1.4;">${strength}</li>`).join('')}
              </ul>
            </div>
            
            <div style="background: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #d97706; font-size: 16px; margin-bottom: 10px;">🎯 Áreas a Desenvolver:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${result.areas_desenvolver.map(area => `<li style="margin-bottom: 5px; line-height: 1.4;">${area}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="background: #ffffff; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #8b5cf6;">
            <h3 style="color: #7c3aed; font-size: 16px; margin-bottom: 10px;">💬 Estilo de Comunicação:</h3>
            <p style="line-height: 1.6;">${currentProfile?.communication}</p>
          </div>
        </div>

        <div style="border: 2px solid #8b5cf6; border-radius: 10px; padding: 20px; margin-bottom: 25px; background: #f3e8ff;">
          <h2 style="color: #7c3aed; font-size: 22px; margin-bottom: 15px;">🔍 ANÁLISE DO PERFIL SECUNDÁRIO: ${result.secondary_profile.toUpperCase()}</h2>
          
          <div style="background: #ffffff; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #7c3aed; font-size: 18px; margin-bottom: 10px;">${result.combinacao_perfis}</h3>
            <p style="line-height: 1.6; margin-bottom: 15px;">${result.analise_perfil_secundario}</p>
          </div>

          <div style="background: #ffffff; padding: 15px; border-radius: 8px;">
            <h3 style="color: #6366f1; font-size: 16px; margin-bottom: 15px;">🧠 Como a Combinação dos Perfis Influencia Seu Comportamento:</h3>
            <ol style="margin: 0; padding-left: 20px;">
              ${result.influencia_comportamental.map(influencia => `<li style="margin-bottom: 8px; line-height: 1.5;">${influencia}</li>`).join('')}
            </ol>
          </div>

          <div style="background: #a855f7; color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <h4 style="margin-bottom: 10px; font-size: 16px;">🎯 Insight Comportamental:</h4>
            <p style="font-size: 14px; line-height: 1.5;">
              A combinação do seu perfil primário <strong>${result.primary_profile}</strong> com o secundário <strong>${result.secondary_profile}</strong> 
              cria um padrão comportamental único que influencia como você se relaciona, toma decisões e se comunica em diferentes situações.
            </p>
          </div>
        </div>

        <div style="border: 2px solid #10b981; border-radius: 10px; padding: 20px; margin-bottom: 25px; background: #f0fdf4;">
          <h2 style="color: #059669; font-size: 22px; margin-bottom: 15px;">📊 PONTUAÇÕES DO SEU PERFIL COMPORTAMENTAL</h2>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="text-align: center; background: #ffffff; padding: 15px; border-radius: 8px; border: 2px solid #ef4444;">
              <div style="font-size: 24px; font-weight: bold; color: #ef4444; margin-bottom: 5px;">${result.D_nat}%</div>
              <div style="font-size: 14px; color: #666666;">Dominância</div>
            </div>
            <div style="text-align: center; background: #ffffff; padding: 15px; border-radius: 8px; border: 2px solid #f59e0b;">
              <div style="font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 5px;">${result.I_nat}%</div>
              <div style="font-size: 14px; color: #666666;">Influência</div>
            </div>
            <div style="text-align: center; background: #ffffff; padding: 15px; border-radius: 8px; border: 2px solid #10b981;">
              <div style="font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 5px;">${result.S_nat}%</div>
              <div style="font-size: 14px; color: #666666;">Estabilidade</div>
            </div>
            <div style="text-align: center; background: #ffffff; padding: 15px; border-radius: 8px; border: 2px solid #3b82f6;">
              <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 5px;">${result.C_nat}%</div>
              <div style="font-size: 14px; color: #666666;">Conformidade</div>
            </div>
          </div>

          <div style="background: #ffffff; padding: 15px; border-radius: 8px;">
            <h3 style="color: #059669; font-size: 16px; margin-bottom: 10px;">📈 Interpretação das Pontuações:</h3>
            <p style="line-height: 1.6; font-size: 14px;">
              Suas pontuações mostram a intensidade de cada traço comportamental. Pontuações mais altas (acima de 50%) indicam 
              características mais dominantes em seu perfil natural, enquanto pontuações menores representam traços menos evidentes 
              em seu comportamento cotidiano.
            </p>
          </div>
        </div>

        <div style="border: 2px solid #6b7280; border-radius: 10px; padding: 20px; background: #f9fafb;">
          <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">📚 SOBRE O TESTE DISC</h2>
          <p style="line-height: 1.6; font-size: 14px; margin-bottom: 10px;">
            O DISC é uma ferramenta de avaliação comportamental baseada na teoria do psicólogo William Marston. 
            Ele mede quatro dimensões principais do comportamento humano em ambientes de trabalho e relacionamentos.
          </p>
          <p style="line-height: 1.6; font-size: 12px; color: #6b7280;">
            Este relatório é baseado em suas respostas e oferece insights para desenvolvimento pessoal e profissional.
            Relatório personalizado fornecido pela Otnitec para ${user.name} (${user.email}).
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af;">
            © 2024 DISC Rápido Otnitec - Todos os direitos reservados<br>
            Relatório gerado em ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `

      // Adicionar ao DOM temporariamente
      document.body.appendChild(reportElement)

      // Capturar como canvas com configurações otimizadas
      const canvas = await html2canvas(reportElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        logging: false,
        ignoreElements: (element) => {
          // Ignorar elementos que podem causar problemas
          return element.tagName === 'SCRIPT' || element.tagName === 'STYLE'
        }
      })

      // Remover elemento temporário
      document.body.removeChild(reportElement)

      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Se a imagem for muito alta, dividir em páginas
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297 // A4 height

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= 297
      }

      // Salvar PDF
      const fileName = `relatorio-disc-${user.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`
      pdf.save(fileName)

    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      // Fallback para download de texto
      generateTextReport()
    }
  }

  // Função fallback para gerar relatório em texto
  const generateTextReport = () => {
    const textContent = `
RELATÓRIO DISC PERSONALIZADO - OTNITEC
=====================================

USUÁRIO: ${user.name} (${user.email})
DATA: ${new Date().toLocaleDateString('pt-BR')}

PERFIL PRIMÁRIO: ${result.primary_profile}
PERFIL SECUNDÁRIO: ${result.secondary_profile}

PONTUAÇÕES NATURAIS:
- Dominância: ${result.D_nat}%
- Influência: ${result.I_nat}%
- Estabilidade: ${result.S_nat}%
- Conformidade: ${result.C_nat}%

FEEDBACK COMPORTAMENTAL:
${result.feedback_comportamental}

ANÁLISE DO PERFIL SECUNDÁRIO:
${result.analise_perfil_secundario}

COMBINAÇÃO DE PERFIS:
${result.combinacao_perfis}

INFLUÊNCIA COMPORTAMENTAL:
${result.influencia_comportamental.map((influencia, index) => `${index + 1}. ${influencia}`).join('\n')}

PONTOS FORTES:
${result.pontos_fortes.map((ponto, index) => `${index + 1}. ${ponto}`).join('\n')}

ÁREAS A DESENVOLVER:
${result.areas_desenvolver.map((area, index) => `${index + 1}. ${area}`).join('\n')}

COMUNICAÇÃO:
${currentProfile?.communication}

=====================================
Relatório gerado pela Otnitec
    `

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-disc-${user.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`
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
        <p className="text-xl text-gray-600">Análise personalizada para {user.name}</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block">
          <p className="text-blue-800 text-sm">
            📧 Relatório personalizado para: <strong>{user.email}</strong>
          </p>
        </div>
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

      {/* Análise do Perfil Secundário */}
      {secondaryProfile && (
        <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Layers className="h-8 w-8 text-purple-600" />
              Análise do Perfil Secundário
              <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
                {result.secondary_profile}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <SecondaryIcon className={`h-6 w-6 ${secondaryProfile.color}`} />
                <h4 className="font-semibold text-lg text-purple-800">
                  {result.combinacao_perfis}
                </h4>
              </div>
              <p className="text-gray-700 mb-4">{result.analise_perfil_secundario}</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-indigo-200">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-indigo-700">
                <Brain className="h-5 w-5" />
                Como a Combinação dos Perfis Influencia Seu Comportamento:
              </h4>
              <ul className="space-y-3">
                {result.influencia_comportamental.map((influencia, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-indigo-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{influencia}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border border-purple-300">
              <h5 className="font-semibold text-purple-800 mb-2">
                🎯 Insight Comportamental:
              </h5>
              <p className="text-purple-700 text-sm">
                A combinação do seu perfil primário <strong>{result.primary_profile}</strong> com o secundário <strong>{result.secondary_profile}</strong> 
                cria um padrão comportamental único que influencia como você se relaciona, toma decisões e se comunica em diferentes situações.
              </p>
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
          onClick={generatePDF}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Download className="mr-2 h-5 w-5" />
          Baixar Relatório em PDF
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
              Relatório personalizado fornecido pela Otnitec para {user.name}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}