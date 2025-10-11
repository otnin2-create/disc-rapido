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
    analise_perfil_secundario: secondaryAnalysis.analise,
    combinacao_perfis: secondaryAnalysis.combinacao,
    influencia_comportamental: secondaryAnalysis.influencia_comportamental
  }
}

function generateSecondaryProfileAnalysis(primary: 'D' | 'I' | 'S' | 'C', secondary: 'D' | 'I' | 'S' | 'C', scores: any) {
  const profileNames = {
    D: 'Dominância',
    I: 'Influência', 
    S: 'Estabilidade',
    C: 'Conformidade'
  }

  const combinationAnalysis = {
    'D-I': {
      combinacao: 'Líder Inspirador - Dominância com Influência',
      analise: 'Você combina a determinação e foco em resultados da Dominância com o carisma e habilidades sociais da Influência. Isso cria um perfil de liderança natural que consegue tanto dirigir quanto inspirar equipes. Você tem a capacidade única de tomar decisões rápidas enquanto mantém as pessoas engajadas e motivadas.',
      influencia: [
        'Sua liderança é mais carismática e inspiradora do que puramente autoritária',
        'Você consegue vender suas ideias e visões de forma convincente',
        'Tende a ser mais sociável e acessível como líder do que outros perfis D',
        'Sua comunicação combina assertividade com entusiasmo',
        'Pode alternar entre ser direto (D) e persuasivo (I) conforme a situação'
      ]
    },
    'D-S': {
      combinacao: 'Líder Estável - Dominância com Estabilidade',
      analise: 'Você equilibra a assertividade e foco em resultados da Dominância com a paciência e consideração da Estabilidade. Isso resulta em uma liderança mais ponderada e sustentável. Você consegue ser firme em suas decisões, mas também considera o impacto nas pessoas e relacionamentos.',
      influencia: [
        'Sua liderança é mais paciente e considerada com as pessoas',
        'Você constrói relacionamentos duradouros baseados em confiança',
        'Tende a ser mais consistente e previsível em seu comportamento',
        'Sua abordagem combina determinação com diplomacia',
        'Consegue manter a calma mesmo em situações de alta pressão'
      ]
    },
    'D-C': {
      combinacao: 'Líder Analítico - Dominância com Conformidade',
      analise: 'Você combina a determinação e foco em resultados da Dominância com a precisão e análise da Conformidade. Isso cria um perfil de liderança baseado em dados e fatos, mas com a coragem de tomar decisões difíceis. Você é tanto estratégico quanto executivo.',
      influencia: [
        'Suas decisões são baseadas em análise cuidadosa, mas executadas rapidamente',
        'Você estabelece padrões altos tanto para si quanto para outros',
        'Tende a ser mais sistemático e organizado em sua abordagem',
        'Sua liderança combina visão estratégica com execução precisa',
        'Consegue equilibrar velocidade de decisão com qualidade dos resultados'
      ]
    },
    'I-D': {
      combinacao: 'Influenciador Determinado - Influência com Dominância',
      analise: 'Você combina o carisma e habilidades sociais da Influência com a determinação e foco em resultados da Dominância. Isso cria um perfil altamente persuasivo que consegue tanto inspirar quanto dirigir. Você tem energia contagiante e consegue mobilizar pessoas para ação.',
      influencia: [
        'Sua influência é mais direcionada e focada em resultados concretos',
        'Você consegue ser tanto carismático quanto assertivo quando necessário',
        'Tende a ser mais proativo e orientado à ação do que outros perfis I',
        'Sua comunicação combina entusiasmo com determinação',
        'Consegue transformar ideias em ação de forma eficaz'
      ]
    },
    'I-S': {
      combinacao: 'Influenciador Harmonioso - Influência com Estabilidade',
      analise: 'Você equilibra o entusiasmo e sociabilidade da Influência com a paciência e consideração da Estabilidade. Isso resulta em um perfil que consegue inspirar e motivar de forma sustentável, criando relacionamentos duradouros e ambientes harmoniosos.',
      influencia: [
        'Sua influência é mais calorosa e baseada em relacionamentos genuínos',
        'Você cria conexões profundas e duradouras com as pessoas',
        'Tende a ser mais paciente e compreensivo em suas interações',
        'Sua abordagem combina entusiasmo com sensibilidade emocional',
        'Consegue manter relacionamentos positivos mesmo em situações difíceis'
      ]
    },
    'I-C': {
      combinacao: 'Influenciador Preciso - Influência com Conformidade',
      analise: 'Você combina o carisma e habilidades sociais da Influência com a precisão e análise da Conformidade. Isso cria um perfil que consegue comunicar ideias complexas de forma envolvente e precisa. Você é tanto inspirador quanto confiável.',
      influencia: [
        'Sua comunicação é mais estruturada e baseada em fatos do que outros perfis I',
        'Você consegue ser tanto carismático quanto preciso em suas apresentações',
        'Tende a ser mais organizado e sistemático em suas abordagens sociais',
        'Sua influência combina entusiasmo com credibilidade',
        'Consegue equilibrar criatividade com qualidade e precisão'
      ]
    },
    'S-D': {
      combinacao: 'Estabilizador Determinado - Estabilidade com Dominância',
      analise: 'Você equilibra a paciência e lealdade da Estabilidade com a determinação e foco em resultados da Dominância. Isso resulta em um perfil que consegue ser tanto apoiador quanto direcionado, criando estabilidade enquanto busca progresso.',
      influencia: [
        'Sua abordagem é mais assertiva e direcionada do que outros perfis S',
        'Você consegue ser tanto paciente quanto determinado quando necessário',
        'Tende a ser mais proativo em buscar soluções para problemas',
        'Sua estabilidade é combinada com capacidade de liderança situacional',
        'Consegue equilibrar harmonia com necessidade de resultados'
      ]
    },
    'S-I': {
      combinacao: 'Estabilizador Social - Estabilidade com Influência',
      analise: 'Você combina a confiabilidade e paciência da Estabilidade com o carisma e sociabilidade da Influência. Isso cria um perfil que consegue construir relacionamentos sólidos e duradouros, sendo tanto apoiador quanto inspirador.',
      influencia: [
        'Seus relacionamentos são mais calorosos e expressivos do que outros perfis S',
        'Você consegue ser tanto estável quanto entusiástico conforme a situação',
        'Tende a ser mais sociável e aberto em suas interações',
        'Sua estabilidade é combinada com capacidade de motivar outros',
        'Consegue criar ambientes tanto harmoniosos quanto energizantes'
      ]
    },
    'S-C': {
      combinacao: 'Estabilizador Sistemático - Estabilidade com Conformidade',
      analise: 'Você equilibra a paciência e lealdade da Estabilidade com a precisão e organização da Conformidade. Isso resulta em um perfil extremamente confiável que consegue manter tanto relacionamentos quanto padrões de qualidade.',
      influencia: [
        'Sua abordagem é mais sistemática e organizada do que outros perfis S',
        'Você consegue ser tanto paciente quanto preciso em suas ações',
        'Tende a ser mais detalhista e cuidadoso em seus relacionamentos',
        'Sua estabilidade é combinada com alta qualidade e consistência',
        'Consegue equilibrar harmonia com excelência operacional'
      ]
    },
    'C-D': {
      combinacao: 'Analista Executivo - Conformidade com Dominância',
      analise: 'Você combina a precisão e análise da Conformidade com a determinação e foco em resultados da Dominância. Isso cria um perfil que consegue tanto analisar quanto executar, tomando decisões baseadas em dados mas com coragem para agir.',
      influencia: [
        'Suas análises são mais direcionadas à ação do que outros perfis C',
        'Você consegue ser tanto preciso quanto decisivo quando necessário',
        'Tende a ser mais proativo em implementar suas recomendações',
        'Sua precisão é combinada com capacidade de liderança técnica',
        'Consegue equilibrar qualidade com velocidade de execução'
      ]
    },
    'C-I': {
      combinacao: 'Analista Comunicativo - Conformidade com Influência',
      analise: 'Você equilibra a precisão e análise da Conformidade com o carisma e habilidades de comunicação da Influência. Isso resulta em um perfil que consegue comunicar informações complexas de forma clara e envolvente.',
      influencia: [
        'Sua comunicação é mais envolvente e acessível do que outros perfis C',
        'Você consegue ser tanto preciso quanto carismático em apresentações',
        'Tende a ser mais sociável e aberto em suas interações profissionais',
        'Sua precisão é combinada com capacidade de influenciar e persuadir',
        'Consegue equilibrar dados técnicos com storytelling eficaz'
      ]
    },
    'C-S': {
      combinacao: 'Analista Colaborativo - Conformidade com Estabilidade',
      analise: 'Você combina a precisão e organização da Conformidade com a paciência e colaboração da Estabilidade. Isso cria um perfil extremamente confiável que consegue manter tanto qualidade quanto relacionamentos harmoniosos.',
      influencia: [
        'Sua abordagem é mais colaborativa e paciente do que outros perfis C',
        'Você consegue ser tanto preciso quanto considerado com as pessoas',
        'Tende a ser mais diplomático em suas correções e sugestões',
        'Sua precisão é combinada com sensibilidade interpessoal',
        'Consegue equilibrar padrões altos com harmonia no ambiente de trabalho'
      ]
    }
  }

  const key = `${primary}-${secondary}` as keyof typeof combinationAnalysis
  const analysis = combinationAnalysis[key]

  if (analysis) {
    return {
      combinacao: analysis.combinacao,
      analise: analysis.analise,
      influencia_comportamental: analysis.influencia
    }
  }

  // Fallback caso não encontre a combinação específica
  return {
    combinacao: `${profileNames[primary]} com ${profileNames[secondary]}`,
    analise: `Seu perfil combina características de ${profileNames[primary]} como traço dominante com elementos de ${profileNames[secondary]}. Esta combinação cria um padrão comportamental único que influencia como você se relaciona e toma decisões.`,
    influencia_comportamental: [
      `Você demonstra principalmente características de ${profileNames[primary]}`,
      `Mas também incorpora elementos de ${profileNames[secondary]} em seu comportamento`,
      'Esta combinação torna seu perfil mais equilibrado e adaptável',
      'Você pode alternar entre os dois estilos conforme a situação',
      'Sua abordagem é influenciada por ambos os perfis de forma complementar'
    ]
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