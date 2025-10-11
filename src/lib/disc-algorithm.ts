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
  analise_perfil_secundario: string
  combinacao_perfis: string
  influencia_comportamental: string[]
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

  // Gerar análise do perfil secundário
  const secondaryAnalysis = generateSecondaryProfileAnalysis(primaryProfile, secondaryProfile, naturalNormalized)

  return {
    D_nat: naturalNormalized.D,
    I_nat: naturalNormalized.I,
    S_nat: naturalNormalized.S,
    C_nat: naturalNormalized.C,
    primary_profile: profileNames[primaryProfile],
    secondary_profile: profileNames[secondaryProfile],
    pontos_fortes: feedbackData.pontos_fortes,
    areas_desenvolver: feedbackData.areas_desenvolver,
    feedback_comportamental: feedbackData.feedback_comportamental,
    analise_perfil_secundario: secondaryAnalysis.analise_secundario,
    combinacao_perfis: secondaryAnalysis.combinacao_perfis,
    influencia_comportamental: secondaryAnalysis.influencia_comportamental
  }
}

function generateSecondaryProfileAnalysis(primary: 'D' | 'I' | 'S' | 'C', secondary: 'D' | 'I' | 'S' | 'C', scores: any) {
  const profileDescriptions = {
    D: 'Dominância - orientado a resultados, direto e assertivo',
    I: 'Influência - sociável, otimista e persuasivo',
    S: 'Estabilidade - paciente, leal e colaborativo',
    C: 'Conformidade - analítico, preciso e sistemático'
  }

  const combinationAnalysis = {
    'D-I': {
      analise: 'Seu perfil secundário de Influência suaviza sua natureza dominante, tornando-o mais carismático e persuasivo. Você mantém o foco em resultados, mas com uma abordagem mais inspiradora.',
      combinacao: 'Líder Carismático - Combina determinação com carisma',
      influencias: [
        'Liderança inspiradora que motiva equipes através do exemplo',
        'Capacidade de tomar decisões rápidas mantendo o moral alto',
        'Comunicação direta mas envolvente em relacionamentos',
        'Tendência a ser mais sociável em ambientes profissionais'
      ]
    },
    'D-S': {
      analise: 'Seu perfil secundário de Estabilidade equilibra sua assertividade com paciência e consideração pelos outros. Você é um líder mais acessível e confiável.',
      combinacao: 'Líder Estável - Combina determinação com confiabilidade',
      influencias: [
        'Liderança firme mas respeitosa com os membros da equipe',
        'Maior paciência em processos e relacionamentos de longo prazo',
        'Capacidade de manter estabilidade mesmo sob pressão',
        'Tendência a construir relacionamentos duradouros baseados em confiança'
      ]
    },
    'D-C': {
      analise: 'Seu perfil secundário de Conformidade adiciona precisão e análise à sua natureza orientada a resultados. Você é um líder que combina ação com planejamento cuidadoso.',
      combinacao: 'Líder Estratégico - Combina determinação com análise',
      influencias: [
        'Decisões rápidas baseadas em análise sólida de dados',
        'Liderança que valoriza tanto resultados quanto qualidade',
        'Comunicação direta mas bem fundamentada',
        'Tendência a estabelecer sistemas e processos eficientes'
      ]
    },
    'I-D': {
      analise: 'Seu perfil secundário de Dominância adiciona foco e determinação ao seu carisma natural. Você é influente e ao mesmo tempo orientado a resultados.',
      combinacao: 'Influenciador Determinado - Combina carisma com foco em resultados',
      influencias: [
        'Capacidade de inspirar outros enquanto mantém foco nos objetivos',
        'Comunicação persuasiva com direcionamento claro',
        'Liderança energética que não perde de vista os resultados',
        'Relacionamentos calorosos mas com expectativas claras'
      ]
    },
    'I-S': {
      analise: 'Seu perfil secundário de Estabilidade torna sua influência mais consistente e confiável. Você constrói relacionamentos duradouros através do seu carisma.',
      combinacao: 'Influenciador Estável - Combina carisma com lealdade',
      influencias: [
        'Relacionamentos calorosos e duradouros baseados em confiança',
        'Capacidade de manter otimismo mesmo em situações difíceis',
        'Influência positiva que promove harmonia em grupos',
        'Comunicação entusiástica mas sensível às necessidades dos outros'
      ]
    },
    'I-C': {
      analise: 'Seu perfil secundário de Conformidade adiciona profundidade e precisão ao seu carisma. Você é influente de forma mais estruturada e fundamentada.',
      combinacao: 'Influenciador Analítico - Combina carisma com precisão',
      influencias: [
        'Persuasão baseada em fatos e análise cuidadosa',
        'Comunicação entusiástica mas bem estruturada',
        'Capacidade de influenciar através de argumentos sólidos',
        'Relacionamentos baseados tanto em conexão emocional quanto intelectual'
      ]
    },
    'S-D': {
      analise: 'Seu perfil secundário de Dominância adiciona assertividade à sua natureza estável. Você é confiável mas também capaz de tomar decisões firmes quando necessário.',
      combinacao: 'Estabilizador Assertivo - Combina lealdade com determinação',
      influencias: [
        'Liderança calma mas decisiva em momentos críticos',
        'Capacidade de manter harmonia enquanto direciona resultados',
        'Relacionamentos baseados em confiança e respeito mútuo',
        'Tendência a ser o "porto seguro" que também toma iniciativas'
      ]
    },
    'S-I': {
      analise: 'Seu perfil secundário de Influência adiciona carisma e otimismo à sua natureza estável. Você é uma pessoa confiável que também inspira e motiva outros.',
      combinacao: 'Estabilizador Inspirador - Combina lealdade com otimismo',
      influencias: [
        'Capacidade de manter moral alto da equipe através de apoio constante',
        'Relacionamentos calorosos baseados em confiança e positividade',
        'Comunicação gentil mas motivadora',
        'Tendência a ser o mediador que também eleva o ânimo do grupo'
      ]
    },
    'S-C': {
      analise: 'Seu perfil secundário de Conformidade adiciona precisão e organização à sua natureza estável. Você é confiável e também meticuloso em suas responsabilidades.',
      combinacao: 'Estabilizador Sistemático - Combina lealdade com precisão',
      influencias: [
        'Confiabilidade excepcional em cumprir compromissos e prazos',
        'Capacidade de manter estabilidade através de organização',
        'Relacionamentos baseados em consistência e atenção aos detalhes',
        'Tendência a ser o "alicerce" que também garante qualidade'
      ]
    },
    'C-D': {
      analise: 'Seu perfil secundário de Dominância adiciona assertividade e foco em resultados à sua natureza analítica. Você é preciso mas também orientado à ação.',
      combinacao: 'Analista Determinado - Combina precisão com foco em resultados',
      influencias: [
        'Decisões bem fundamentadas tomadas com velocidade adequada',
        'Liderança baseada em competência técnica e visão clara',
        'Comunicação precisa mas direcionada a objetivos',
        'Tendência a ser o especialista que também executa'
      ]
    },
    'C-I': {
      analise: 'Seu perfil secundário de Influência adiciona carisma e habilidades sociais à sua natureza analítica. Você é preciso mas também capaz de comunicar ideias complexas de forma envolvente.',
      combinacao: 'Analista Comunicativo - Combina precisão com carisma',
      influencias: [
        'Capacidade de explicar conceitos complexos de forma acessível',
        'Análise cuidadosa combinada com apresentação persuasiva',
        'Relacionamentos baseados em competência e conexão pessoal',
        'Tendência a ser o especialista que também inspira confiança'
      ]
    },
    'C-S': {
      analise: 'Seu perfil secundário de Estabilidade adiciona paciência e colaboração à sua natureza analítica. Você é preciso e também um excelente membro de equipe.',
      combinacao: 'Analista Colaborativo - Combina precisão com lealdade',
      influencias: [
        'Análise cuidadosa realizada com consideração pelo impacto na equipe',
        'Capacidade de manter altos padrões sem criar conflitos',
        'Relacionamentos baseados em competência e confiabilidade',
        'Tendência a ser o especialista que também apoia o desenvolvimento dos outros'
      ]
    }
  }

  const combinationKey = `${primary}-${secondary}` as keyof typeof combinationAnalysis
  const analysis = combinationAnalysis[combinationKey]

  if (!analysis) {
    return {
      analise_secundario: `Seu perfil secundário de ${profileDescriptions[secondary]} complementa suas características principais.`,
      combinacao_perfis: 'Perfil Único',
      influencia_comportamental: ['Combinação única de características que influencia seu comportamento de forma particular.']
    }
  }

  return {
    analise_secundario: analysis.analise,
    combinacao_perfis: analysis.combinacao,
    influencia_comportamental: analysis.influencias
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
        'Eficiência em situações de pressão',
        'Assertividade em relacionamentos profissionais',
        'Capacidade de estabelecer limites claros'
      ],
      areas_desenvolver: [
        'Desenvolver mais paciência com processos longos',
        'Melhorar a escuta ativa e consideração de outras opiniões',
        'Trabalhar a diplomacia na comunicação',
        'Aprender a delegar com mais confiança',
        'Desenvolver maior sensibilidade emocional',
        'Melhorar habilidades de relacionamento interpessoal',
        'Praticar mais empatia em relacionamentos pessoais'
      ],
      feedback: 'Você é uma pessoa orientada a resultados, com forte capacidade de liderança. Sua energia e determinação são contagiantes, mas lembre-se de equilibrar sua assertividade com empatia nos relacionamentos.'
    },
    I: {
      pontos_fortes: [
        'Excelente habilidade de comunicação e persuasão',
        'Capacidade natural de inspirar e motivar equipes',
        'Otimismo contagiante e energia positiva',
        'Facilidade para networking e construção de relacionamentos',
        'Criatividade e pensamento inovador',
        'Carisma natural em relacionamentos sociais',
        'Habilidade de conectar pessoas e criar vínculos'
      ],
      areas_desenvolver: [
        'Melhorar o foco em detalhes e follow-up',
        'Desenvolver maior disciplina com prazos',
        'Aprender a ouvir mais e falar menos em algumas situações',
        'Trabalhar a organização e planejamento',
        'Desenvolver maior profundidade analítica',
        'Melhorar a consistência em relacionamentos de longo prazo',
        'Desenvolver maior profundidade emocional'
      ],
      feedback: 'Você é uma pessoa carismática e inspiradora, com grande capacidade de influenciar positivamente outros. Sua energia e entusiasmo são seus maiores ativos nos relacionamentos, mas atenção aos detalhes pode potencializar ainda mais seus resultados.'
    },
    S: {
      pontos_fortes: [
        'Confiabilidade e lealdade excepcionais',
        'Excelente capacidade de trabalho em equipe',
        'Paciência e persistência em projetos longos',
        'Habilidade natural para mediar conflitos',
        'Estabilidade emocional e calma sob pressão',
        'Capacidade de criar relacionamentos duradouros',
        'Empatia natural e sensibilidade às necessidades dos outros'
      ],
      areas_desenvolver: [
        'Desenvolver maior assertividade e autoconfiança',
        'Aprender a expressar opiniões com mais frequência',
        'Trabalhar a adaptabilidade a mudanças rápidas',
        'Desenvolver maior iniciativa proativa',
        'Melhorar habilidades de autopromoção',
        'Aprender a estabelecer limites em relacionamentos',
        'Desenvolver maior coragem para confrontar conflitos'
      ],
      feedback: 'Você é uma pessoa confiável e estável, que traz harmonia aos relacionamentos e ambientes. Sua lealdade e capacidade de apoiar outros são admiráveis. Desenvolver mais assertividade pode ampliar ainda mais seu impacto.'
    },
    C: {
      pontos_fortes: [
        'Atenção excepcional aos detalhes e precisão',
        'Capacidade analítica e pensamento sistemático',
        'Alto padrão de qualidade e excelência',
        'Planejamento cuidadoso e organização',
        'Capacidade de identificar riscos e problemas',
        'Confiabilidade e consistência em relacionamentos',
        'Capacidade de oferecer conselhos bem fundamentados'
      ],
      areas_desenvolver: [
        'Desenvolver maior flexibilidade e adaptabilidade',
        'Aprender a tomar decisões com informações incompletas',
        'Melhorar habilidades de comunicação interpessoal',
        'Trabalhar a tolerância a ambiguidade',
        'Desenvolver maior velocidade na execução',
        'Melhorar expressão emocional em relacionamentos',
        'Desenvolver maior espontaneidade social'
      ],
      feedback: 'Você é uma pessoa meticulosa e analítica, com alto padrão de qualidade. Sua capacidade de análise e atenção aos detalhes são excepcionais nos relacionamentos. Equilibrar precisão com flexibilidade emocional pode maximizar sua efetividade.'
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

// Dados das questões DISC (25 questões) - incluindo relacionamentos
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
    question_text: "Em relacionamentos amorosos, você tende a:",
    option_d: "Ser direto sobre suas necessidades e expectativas",
    option_i: "Expressar afeto de forma calorosa e espontânea",
    option_s: "Ser leal e buscar estabilidade emocional",
    option_c: "Analisar a compatibilidade antes de se comprometer"
  },
  {
    id: 7,
    question_text: "Ao trabalhar em projetos, você prefere:",
    option_d: "Liderar e definir a direção",
    option_i: "Colaborar e gerar ideias",
    option_s: "Apoiar e manter harmonia",
    option_c: "Planejar e organizar detalhes"
  },
  {
    id: 8,
    question_text: "Em conflitos com amigos ou familiares:",
    option_d: "Confronto diretamente para resolver rapidamente",
    option_i: "Uso humor e charme para amenizar a situação",
    option_s: "Evito conflitos e busco harmonia",
    option_c: "Analiso os fatos antes de tomar posição"
  },
  {
    id: 9,
    question_text: "No ambiente de trabalho, você é conhecido por:",
    option_d: "Ser determinado e focado em resultados",
    option_i: "Ser sociável e inspirador",
    option_s: "Ser confiável e leal",
    option_c: "Ser meticuloso e preciso"
  },
  {
    id: 10,
    question_text: "Ao fazer novos amigos, você:",
    option_d: "É seletivo e busca pessoas que compartilham seus objetivos",
    option_i: "Se conecta facilmente e gosta de conhecer muitas pessoas",
    option_s: "Prefere amizades profundas e duradouras",
    option_c: "Observa primeiro antes de se abrir"
  },
  {
    id: 11,
    question_text: "Ao tomar decisões importantes:",
    option_d: "Confio na minha intuição e ajo",
    option_i: "Consulto outros e busco consenso",
    option_s: "Considero o impacto em todos",
    option_c: "Analiso dados e evidências"
  },
  {
    id: 12,
    question_text: "Em relacionamentos familiares, você:",
    option_d: "Assume responsabilidades e toma decisões",
    option_i: "Traz alegria e mantém o clima positivo",
    option_s: "É o mediador e mantém a união",
    option_c: "Oferece conselhos práticos e bem pensados"
  },
  {
    id: 13,
    question_text: "Seu ritmo de trabalho é:",
    option_d: "Rápido e intenso",
    option_i: "Variável e energético",
    option_s: "Constante e estável",
    option_c: "Cuidadoso e metódico"
  },
  {
    id: 14,
    question_text: "Quando alguém precisa de apoio emocional:",
    option_d: "Ofereço soluções práticas e diretas",
    option_i: "Uso otimismo e encorajamento",
    option_s: "Escuto pacientemente e ofereço conforto",
    option_c: "Analiso a situação e dou conselhos fundamentados"
  },
  {
    id: 15,
    question_text: "Em conflitos, você tende a:",
    option_d: "Confrontar diretamente o problema",
    option_i: "Buscar soluções criativas e positivas",
    option_s: "Mediar e buscar harmonia",
    option_c: "Analisar fatos e buscar justiça"
  },
  {
    id: 16,
    question_text: "Sua motivação principal é:",
    option_d: "Alcançar objetivos e vencer desafios",
    option_i: "Reconhecimento e interação social",
    option_s: "Segurança e relacionamentos estáveis",
    option_c: "Qualidade e precisão no trabalho"
  },
  {
    id: 17,
    question_text: "Em relacionamentos de trabalho, você:",
    option_d: "Foca nos resultados e mantém profissionalismo",
    option_i: "Cria conexões pessoais e ambiente positivo",
    option_s: "Constrói confiança e colaboração",
    option_c: "Mantém padrões altos e comunicação clara"
  },
  {
    id: 18,
    question_text: "Ao liderar uma equipe:",
    option_d: "Estabeleço metas claras e exijo resultados",
    option_i: "Inspiro e motivo com entusiasmo",
    option_s: "Apoio e desenvolvo cada membro",
    option_c: "Organizo processos e sistemas"
  },
  {
    id: 19,
    question_text: "Sua maior força é:",
    option_d: "Determinação e foco em resultados",
    option_i: "Carisma e habilidade social",
    option_s: "Paciência e lealdade",
    option_c: "Análise e atenção aos detalhes"
  },
  {
    id: 20,
    question_text: "Em relacionamentos íntimos, você valoriza:",
    option_d: "Honestidade direta e objetivos compartilhados",
    option_i: "Diversão, romance e conexão emocional",
    option_s: "Estabilidade, confiança e compromisso",
    option_c: "Compatibilidade intelectual e respeito mútuo"
  },
  {
    id: 21,
    question_text: "Em apresentações, você:",
    option_d: "Foco nos pontos principais e resultados",
    option_i: "Uso histórias e exemplos envolventes",
    option_s: "Apresento de forma calma e organizada",
    option_c: "Incluo dados detalhados e evidências"
  },
  {
    id: 22,
    question_text: "Ao receber críticas de pessoas próximas:",
    option_d: "Aceito se for construtiva e direta",
    option_i: "Prefiro feedback positivo e encorajador",
    option_s: "Valorizo críticas gentis e privadas",
    option_c: "Quero críticas específicas e baseadas em fatos"
  },
  {
    id: 23,
    question_text: "Seu ambiente de trabalho ideal é:",
    option_d: "Desafiador e orientado a resultados",
    option_i: "Dinâmico e socialmente ativo",
    option_s: "Estável e harmonioso",
    option_c: "Organizado e estruturado"
  },
  {
    id: 24,
    question_text: "Em situações sociais, você:",
    option_d: "Prefere grupos pequenos com conversas objetivas",
    option_i: "Gosta de ser o centro das atenções",
    option_s: "Prefere observar e participar quando confortável",
    option_c: "Gosta de conversas profundas e significativas"
  },
  {
    id: 25,
    question_text: "Ao expressar amor ou carinho:",
    option_d: "Demonstro através de ações e conquistas",
    option_i: "Expresso verbalmente e com gestos carinhosos",
    option_s: "Mostro através de cuidado e presença constante",
    option_c: "Demonstro através de atos de serviço e atenção aos detalhes"
  }
]