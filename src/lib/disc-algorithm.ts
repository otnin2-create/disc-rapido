// Algoritmo de cálculo DISC simplificado - apenas curva natural
export interface DISCResponse {
  qID: number
  choice: string
  trait: 'D' | 'I' | 'S' | 'C'
  tempo_gasto: number
}

export interface DISCResult {
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

export function calculateDISC(responses: DISCResponse[]): DISCResult {
  // Inicializar contadores para cada traço
  const traitScores = { D: 0, I: 0, S: 0, C: 0 }

  // Contar as escolhas por traço
  responses.forEach(response => {
    if (response.trait) {
      traitScores[response.trait]++
    }
  })

  // Normalização para base de 100%
  const totalResponses = responses.length
  const naturalNormalized = {
    D: Math.round((traitScores.D / totalResponses) * 100),
    I: Math.round((traitScores.I / totalResponses) * 100),
    S: Math.round((traitScores.S / totalResponses) * 100),
    C: Math.round((traitScores.C / totalResponses) * 100)
  }

  // Determinar perfil primário e secundário
  const profiles = ['D', 'I', 'S', 'C'] as const
  const sortedProfiles = profiles.sort((a, b) => naturalNormalized[b] - naturalNormalized[a])
  
  const primaryProfile = sortedProfiles[0]
  const secondaryProfile = sortedProfiles[1]

  const profileNames = {
    D: 'Dominância',
    I: 'Influência', 
    S: 'Estabilidade',
    C: 'Conformidade'
  }

  // Gerar feedback personalizado baseado no perfil
  const feedbackData = generatePersonalizedFeedback(primaryProfile, secondaryProfile, naturalNormalized)

  return {
    D_nat: naturalNormalized.D,
    I_nat: naturalNormalized.I,
    S_nat: naturalNormalized.S,
    C_nat: naturalNormalized.C,
    primary_profile: profileNames[primaryProfile],
    secondary_profile: profileNames[secondaryProfile],
    pontos_fortes: feedbackData.pontos_fortes,
    areas_desenvolver: feedbackData.areas_desenvolver,
    feedback_comportamental: feedbackData.feedback_comportamental
  }
}

function generatePersonalizedFeedback(primary: 'D' | 'I' | 'S' | 'C', secondary: 'D' | 'I' | 'S' | 'C', scores: any) {
  const feedbackDatabase = {
    D: {
      pontos_fortes: [
        'Liderança natural e capacidade de tomar decisões rápidas',
        'Foco intenso em resultados e objetivos',
        'Coragem para enfrentar desafios e assumir riscos',
        'Capacidade de motivar outros através do exemplo',
        'Eficiência em situações de pressão'
      ],
      areas_desenvolver: [
        'Desenvolver mais paciência com processos longos',
        'Melhorar a escuta ativa e consideração de outras opiniões',
        'Trabalhar a diplomacia na comunicação',
        'Aprender a delegar com mais confiança',
        'Desenvolver maior sensibilidade emocional'
      ],
      feedback: 'Você é uma pessoa orientada a resultados, com forte capacidade de liderança. Sua energia e determinação são contagiantes, mas lembre-se de equilibrar sua assertividade com empatia.'
    },
    I: {
      pontos_fortes: [
        'Excelente habilidade de comunicação e persuasão',
        'Capacidade natural de inspirar e motivar equipes',
        'Otimismo contagiante e energia positiva',
        'Facilidade para networking e construção de relacionamentos',
        'Criatividade e pensamento inovador'
      ],
      areas_desenvolver: [
        'Melhorar o foco em detalhes e follow-up',
        'Desenvolver maior disciplina com prazos',
        'Aprender a ouvir mais e falar menos em algumas situações',
        'Trabalhar a organização e planejamento',
        'Desenvolver maior profundidade analítica'
      ],
      feedback: 'Você é uma pessoa carismática e inspiradora, com grande capacidade de influenciar positivamente outros. Sua energia e entusiasmo são seus maiores ativos, mas atenção aos detalhes pode potencializar ainda mais seus resultados.'
    },
    S: {
      pontos_fortes: [
        'Confiabilidade e lealdade excepcionais',
        'Excelente capacidade de trabalho em equipe',
        'Paciência e persistência em projetos longos',
        'Habilidade natural para mediar conflitos',
        'Estabilidade emocional e calma sob pressão'
      ],
      areas_desenvolver: [
        'Desenvolver maior assertividade e autoconfiança',
        'Aprender a expressar opiniões com mais frequência',
        'Trabalhar a adaptabilidade a mudanças rápidas',
        'Desenvolver maior iniciativa proativa',
        'Melhorar habilidades de autopromoção'
      ],
      feedback: 'Você é uma pessoa confiável e estável, que traz harmonia aos ambientes. Sua lealdade e capacidade de apoiar outros são admiráveis. Desenvolver mais assertividade pode ampliar ainda mais seu impacto.'
    },
    C: {
      pontos_fortes: [
        'Atenção excepcional aos detalhes e precisão',
        'Capacidade analítica e pensamento sistemático',
        'Alto padrão de qualidade e excelência',
        'Planejamento cuidadoso e organização',
        'Capacidade de identificar riscos e problemas'
      ],
      areas_desenvolver: [
        'Desenvolver maior flexibilidade e adaptabilidade',
        'Aprender a tomar decisões com informações incompletas',
        'Melhorar habilidades de comunicação interpessoal',
        'Trabalhar a tolerância a ambiguidade',
        'Desenvolver maior velocidade na execução'
      ],
      feedback: 'Você é uma pessoa meticulosa e analítica, com alto padrão de qualidade. Sua capacidade de análise e atenção aos detalhes são excepcionais. Equilibrar precisão com agilidade pode maximizar sua efetividade.'
    }
  }

  const primaryFeedback = feedbackDatabase[primary]
  const secondaryFeedback = feedbackDatabase[secondary]

  // Combinar pontos fortes do perfil primário com alguns do secundário
  const pontos_fortes = [
    ...primaryFeedback.pontos_fortes.slice(0, 3),
    ...secondaryFeedback.pontos_fortes.slice(0, 2)
  ]

  // Combinar áreas de desenvolvimento
  const areas_desenvolver = [
    ...primaryFeedback.areas_desenvolver.slice(0, 3),
    ...secondaryFeedback.areas_desenvolver.slice(0, 2)
  ]

  return {
    pontos_fortes,
    areas_desenvolver,
    feedback_comportamental: primaryFeedback.feedback
  }
}

// Dados das questões DISC (25 questões)
export const discQuestions = [
  {
    id: 1,
    question_text: "Como você se comporta em situações de trabalho?",
    option_d: "Tomo decisões rapidamente e assumo o controle",
    option_i: "Procuro envolver e motivar as pessoas",
    option_s: "Mantenho a calma e busco estabilidade",
    option_c: "Analiso cuidadosamente antes de agir"
  },
  {
    id: 2,
    question_text: "Em reuniões de equipe, você geralmente:",
    option_d: "Lidero as discussões e defino objetivos",
    option_i: "Contribuo com ideias criativas e energia",
    option_s: "Escuto atentamente e apoio o grupo",
    option_c: "Faço perguntas detalhadas e analiso dados"
  },
  {
    id: 3,
    question_text: "Quando enfrenta um problema complexo:",
    option_d: "Ajo rapidamente para resolver",
    option_i: "Busco ajuda e colaboração de outros",
    option_s: "Procedo com cautela e paciência",
    option_c: "Pesquiso e analiso todas as opções"
  },
  {
    id: 4,
    question_text: "Seu estilo de comunicação é:",
    option_d: "Direto e objetivo",
    option_i: "Entusiástico e expressivo",
    option_s: "Calmo e paciente",
    option_c: "Preciso e detalhado"
  },
  {
    id: 5,
    question_text: "Em situações de pressão, você:",
    option_d: "Toma controle e age decisivamente",
    option_i: "Mantém o otimismo e motiva outros",
    option_s: "Permanece calmo e estável",
    option_c: "Analisa cuidadosamente as opções"
  },
  {
    id: 6,
    question_text: "Ao trabalhar em projetos, você prefere:",
    option_d: "Liderar e definir a direção",
    option_i: "Colaborar e gerar ideias",
    option_s: "Apoiar e manter harmonia",
    option_c: "Planejar e organizar detalhes"
  },
  {
    id: 7,
    question_text: "Sua abordagem para mudanças é:",
    option_d: "Abraço mudanças como oportunidades",
    option_i: "Vejo mudanças como aventuras",
    option_s: "Prefiro mudanças graduais",
    option_c: "Analiso riscos antes de mudar"
  },
  {
    id: 8,
    question_text: "No ambiente de trabalho, você é conhecido por:",
    option_d: "Ser determinado e focado em resultados",
    option_i: "Ser sociável e inspirador",
    option_s: "Ser confiável e leal",
    option_c: "Ser meticuloso e preciso"
  },
  {
    id: 9,
    question_text: "Ao tomar decisões importantes:",
    option_d: "Confio na minha intuição e ajo",
    option_i: "Consulto outros e busco consenso",
    option_s: "Considero o impacto em todos",
    option_c: "Analiso dados e evidências"
  },
  {
    id: 10,
    question_text: "Seu ritmo de trabalho é:",
    option_d: "Rápido e intenso",
    option_i: "Variável e energético",
    option_s: "Constante e estável",
    option_c: "Cuidadoso e metódico"
  },
  {
    id: 11,
    question_text: "Em conflitos, você tende a:",
    option_d: "Confrontar diretamente o problema",
    option_i: "Buscar soluções criativas e positivas",
    option_s: "Mediar e buscar harmonia",
    option_c: "Analisar fatos e buscar justiça"
  },
  {
    id: 12,
    question_text: "Sua motivação principal é:",
    option_d: "Alcançar objetivos e vencer desafios",
    option_i: "Reconhecimento e interação social",
    option_s: "Segurança e relacionamentos estáveis",
    option_c: "Qualidade e precisão no trabalho"
  },
  {
    id: 13,
    question_text: "Ao liderar uma equipe:",
    option_d: "Estabeleço metas claras e exijo resultados",
    option_i: "Inspiro e motivo com entusiasmo",
    option_s: "Apoio e desenvolvo cada membro",
    option_c: "Organizo processos e sistemas"
  },
  {
    id: 14,
    question_text: "Sua maior força é:",
    option_d: "Determinação e foco em resultados",
    option_i: "Carisma e habilidade social",
    option_s: "Paciência e lealdade",
    option_c: "Análise e atenção aos detalhes"
  },
  {
    id: 15,
    question_text: "Em apresentações, você:",
    option_d: "Foco nos pontos principais e resultados",
    option_i: "Uso histórias e exemplos envolventes",
    option_s: "Apresento de forma calma e organizada",
    option_c: "Incluo dados detalhados e evidências"
  },
  {
    id: 16,
    question_text: "Ao receber feedback:",
    option_d: "Aceito se for construtivo e direto",
    option_i: "Prefiro feedback positivo e encorajador",
    option_s: "Valorizo feedback gentil e privado",
    option_c: "Quero feedback específico e baseado em fatos"
  },
  {
    id: 17,
    question_text: "Seu ambiente de trabalho ideal é:",
    option_d: "Desafiador e orientado a resultados",
    option_i: "Dinâmico e socialmente ativo",
    option_s: "Estável e harmonioso",
    option_c: "Organizado e estruturado"
  },
  {
    id: 18,
    question_text: "Ao aprender algo novo:",
    option_d: "Quero aplicar imediatamente",
    option_i: "Gosto de compartilhar com outros",
    option_s: "Prefiro aprender gradualmente",
    option_c: "Estudo profundamente antes de aplicar"
  },
  {
    id: 19,
    question_text: "Sua abordagem para prazos é:",
    option_d: "Trabalho intensamente para cumprir",
    option_i: "Mantenho energia e otimismo",
    option_s: "Planejo para evitar pressão",
    option_c: "Organizo tudo com antecedência"
  },
  {
    id: 20,
    question_text: "Em networking, você:",
    option_d: "Foco em contatos que podem ajudar objetivos",
    option_i: "Gosto de conhecer muitas pessoas",
    option_s: "Prefiro relacionamentos profundos",
    option_c: "Sou seletivo e profissional"
  },
  {
    id: 21,
    question_text: "Ao delegar tarefas:",
    option_d: "Dou autonomia mas exijo resultados",
    option_i: "Motivo e inspiro a equipe",
    option_s: "Ofereço suporte constante",
    option_c: "Dou instruções claras e detalhadas"
  },
  {
    id: 22,
    question_text: "Sua reação ao estresse é:",
    option_d: "Torno-me mais focado e determinado",
    option_i: "Busco apoio social e otimismo",
    option_s: "Mantenho calma e busco estabilidade",
    option_c: "Analiso a situação sistematicamente"
  },
  {
    id: 23,
    question_text: "Em brainstorming, você:",
    option_d: "Foco em ideias práticas e viáveis",
    option_i: "Contribuo com muitas ideias criativas",
    option_s: "Apoio e desenvolvo ideias dos outros",
    option_c: "Avalio prós e contras de cada ideia"
  },
  {
    id: 24,
    question_text: "Seu estilo de planejamento é:",
    option_d: "Planos flexíveis focados em resultados",
    option_i: "Planos inspiradores com visão ampla",
    option_s: "Planos estáveis e bem estruturados",
    option_c: "Planos detalhados com contingências"
  },
  {
    id: 25,
    question_text: "Ao finalizar projetos, você:",
    option_d: "Celebro rapidamente e parto para o próximo",
    option_i: "Compartilho sucessos com a equipe",
    option_s: "Garanto que tudo está bem finalizado",
    option_c: "Analiso lições aprendidas e melhorias"
  }
]