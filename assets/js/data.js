/* ===== Mock data — ports React src/data/mock.ts =====
   i18n keys render translated labels; raw values (names, prices) live here. */
(function (global) {
  // Conjuntos Unsplash curados (IDs já verificados no monorepo).
  const IMG = {
    work: [
      '1497366216548-37526070297c',
      '1497366811353-6870744d04b2',
      '1542744173-8e7e53415bb0',
      '1568992687947-868a62a9f521',
      '1521737711867-e3b97375f902',
      '1504384308090-c894fdcc538d',
      '1560264280-88b68371db39',
      '1486312338219-ce68d2c6f44d',
      '1521791136064-7986c2920216',
      '1560472354-b33ff0c44a43',
      '1516321318423-f06f85e504b3',
      '1600880292203-757bb62b4baf',
    ],
    people: [
      '1500648767791-00dcc994a43e',
      '1494790108377-be9c29b29330',
      '1507003211169-0a1dd7228f2d',
      '1438761681033-6461ffad8d80',
      '1633332755192-727a05c4013d',
      '1573496359142-b8d87734a5a2',
    ],
    city: ['1477959858617-67f85cf4f1df', '1496568816309-51d7c20e3b21', '1480714378408-67cf0d13bc1b'],
  };

  function imgHash(s) {
    s = String(s);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  function imgCategory(seed) {
    const s = String(seed).toLowerCase();
    if (/author|avatar|client|member|people|person|profile|staff|team|testi|user/.test(s)) return 'people';
    if (/city|hero|location|neighbor|skyline|studio/.test(s)) return 'city';
    return 'work';
  }

  function unsplash(id, w, h) {
    return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=70&auto=format`;
  }

  /** URL determinística por seed — tema estúdio/agência. */
  function pfImage(seed, w, h) {
    w = w || 960;
    h = h || 640;
    const ids = IMG[imgCategory(seed)];
    return unsplash(ids[imgHash('pf-' + seed) % ids.length], w, h);
  }

  const av = (seed) => unsplash(IMG.people[imgHash('pf-av-' + seed) % IMG.people.length], 120, 120);

  // ---- Serviços -----------------------------------------------------------

  const SERVICES = [
    {
      id: 1,
      slug: 'identidade-visual',
      name: 'Identidade visual',
      category: 'branding',
      summary: 'Marca, sistema visual e manual de aplicação.',
      description:
        'Construção da marca do zero ou rebranding: pesquisa, território criativo, símbolo, tipografia, paleta, aplicações e manual de uso. Entregamos os arquivos abertos e um guia que o time consegue seguir sem depender da gente.',
      deliverables: [
        'Pesquisa e território criativo',
        'Símbolo e assinatura em todas as versões',
        'Paleta, tipografia e grid',
        'Manual de marca em PDF',
        'Arquivos abertos (AI, SVG, PNG)',
      ],
      priceFrom: 12000,
      weeks: 6,
      icon: 'sparkles',
      active: true,
    },
    {
      id: 2,
      slug: 'site-institucional',
      name: 'Site institucional',
      category: 'web',
      summary: 'Site rápido, responsivo e pronto para editar.',
      description:
        'Site institucional com arquitetura de informação, redação, design e implementação. Performance e acessibilidade entram no escopo desde o começo, não como ajuste final. O conteúdo fica editável por quem cuida do marketing.',
      deliverables: [
        'Arquitetura de informação',
        'Design de até 8 telas',
        'Implementação responsiva',
        'CMS para o time editar',
        'Medição de performance e SEO técnico',
      ],
      priceFrom: 18000,
      weeks: 8,
      icon: 'globe',
      active: true,
    },
    {
      id: 3,
      slug: 'design-de-produto',
      name: 'Design de produto',
      category: 'produto',
      summary: 'Descoberta, fluxos, protótipo e design system.',
      description:
        'Do problema ao produto navegável: entrevistas, mapeamento de fluxos, wireframes, protótipo testável e um design system que sustenta o crescimento. Trabalhamos junto do time de engenharia, em ciclos curtos.',
      deliverables: [
        'Entrevistas e síntese da descoberta',
        'Fluxos e wireframes',
        'Protótipo navegável',
        'Design system em Figma',
        'Handoff com o time de engenharia',
      ],
      priceFrom: 24000,
      weeks: 10,
      icon: 'layers',
      active: true,
    },
    {
      id: 4,
      slug: 'loja-virtual',
      name: 'Loja virtual',
      category: 'web',
      summary: 'E-commerce com checkout que converte.',
      description:
        'Loja completa: catálogo, busca, página de produto, carrinho e checkout. Cuidamos do fluxo de compra ponta a ponta, medimos onde as pessoas desistem e corrigimos antes do lançamento.',
      deliverables: [
        'Design do catálogo e da página de produto',
        'Fluxo de carrinho e checkout',
        'Integração com o meio de pagamento',
        'Painel de pedidos',
        'Testes de usabilidade antes do go-live',
      ],
      priceFrom: 32000,
      weeks: 12,
      icon: 'shopping-bag',
      active: true,
    },
    {
      id: 5,
      slug: 'campanha-digital',
      name: 'Campanha digital',
      category: 'marketing',
      summary: 'Conceito, peças e landing page da campanha.',
      description:
        'Campanha do conceito à veiculação: mensagem, peças para cada canal, landing page e plano de mensuração. Entregamos junto o painel de resultados, para a decisão de investimento não depender de achismo.',
      deliverables: [
        'Conceito e mensagem',
        'Kit de peças por canal',
        'Landing page dedicada',
        'Plano de mídia e mensuração',
        'Relatório de resultados',
      ],
      priceFrom: 15000,
      weeks: 5,
      icon: 'rocket',
      active: true,
    },
    {
      id: 6,
      slug: 'motion-e-video',
      name: 'Motion e vídeo',
      category: 'motion',
      summary: 'Animação de marca, vídeos curtos e social.',
      description:
        'Animação da marca, vídeos de produto e cortes para as redes. Entregamos nos formatos e proporções de cada canal, com legendas e versões sem trilha para uso interno.',
      deliverables: [
        'Roteiro e storyboard',
        'Animação da marca',
        'Vídeo principal com locução',
        'Cortes verticais para redes',
        'Legendas e versões alternativas',
      ],
      priceFrom: 9000,
      weeks: 4,
      icon: 'zap',
      active: true,
    },
  ];

  // ---- Cases --------------------------------------------------------------

  const CASES = [
    {
      id: 1,
      slug: 'norte-fintech-rebranding',
      title: 'Rebranding e app para a Norte',
      client: 'Norte Financeira',
      category: 'branding',
      year: 2026,
      cover: pfImage('case-norte'),
      gallery: [pfImage('case-norte-1'), pfImage('case-norte-2'), pfImage('case-norte-3')],
      summary:
        'Uma financeira de 18 anos precisava falar com quem abre a primeira conta sem perder a base que já tinha.',
      challenge:
        'A marca da Norte foi desenhada para agências físicas. Com 70% das aberturas de conta vindo do celular, o sistema visual não escalava para telas pequenas e o tom soava distante do público novo.',
      solution:
        'Reconstruímos a identidade a partir do uso digital: assinatura compacta, paleta com contraste verificado em modo escuro, tipografia variável e um kit de componentes que o time de produto aplica direto no app. O manual virou um site interno, sempre atualizado.',
      results: [
        { label: 'Abertura de conta concluída', value: '+34%' },
        { label: 'Tempo até a primeira transação', value: '-41%' },
        { label: 'Avaliação na loja', value: '4,7' },
      ],
      serviceIds: [1, 3],
      tags: ['Rebranding', 'Design system', 'Fintech'],
      featured: true,
      published: true,
    },
    {
      id: 2,
      slug: 'verde-campo-ecommerce',
      title: 'Loja virtual da Verde Campo',
      client: 'Verde Campo Alimentos',
      category: 'ecommerce',
      year: 2026,
      cover: pfImage('case-verde'),
      gallery: [pfImage('case-verde-1'), pfImage('case-verde-2')],
      summary: 'Migração de um catálogo com 1.200 itens para uma loja própria, sem perder tráfego orgânico.',
      challenge:
        'A Verde Campo vendia só por marketplaces. A margem apertava a cada ano e não havia relação direta com o cliente final, nem dado próprio para decidir sortimento.',
      solution:
        'Desenhamos a loja em torno da recompra: lista de favoritos, assinatura de itens recorrentes e frete calculado antes do checkout. Redirecionamos as URLs antigas item a item e acompanhamos o ranking por seis semanas depois do lançamento.',
      results: [
        { label: 'Receita direta no 1º trimestre', value: 'R$ 1,8M' },
        { label: 'Taxa de conversão', value: '3,4%' },
        { label: 'Tráfego orgânico preservado', value: '96%' },
      ],
      serviceIds: [4, 2],
      tags: ['E-commerce', 'SEO', 'Alimentos'],
      featured: true,
      published: true,
    },
    {
      id: 3,
      slug: 'atlas-app-logistica',
      title: 'App de campo para a Atlas',
      client: 'Atlas Logística',
      category: 'app',
      year: 2025,
      cover: pfImage('case-atlas'),
      gallery: [pfImage('case-atlas-1'), pfImage('case-atlas-2'), pfImage('case-atlas-3')],
      summary: 'Um app que funciona offline, para motoristas que passam o dia fora de área de cobertura.',
      challenge:
        'A operação registrava entregas em papel e digitava tudo à noite. Os erros de digitação viravam disputa com o cliente e a empresa só sabia de um problema no dia seguinte.',
      solution:
        'Fizemos a descoberta dentro do caminhão, acompanhando quatro rotas. O app guarda tudo localmente, sincroniza quando encontra sinal e resolve conflitos por carimbo de tempo. A tela de entrega cabe em uma mão, com luva.',
      results: [
        { label: 'Erros de registro', value: '-88%' },
        { label: 'Entregas por rota', value: '+12%' },
        { label: 'Adoção em 30 dias', value: '94%' },
      ],
      serviceIds: [3],
      tags: ['Produto', 'Offline first', 'Logística'],
      featured: true,
      published: true,
    },
    {
      id: 4,
      slug: 'clara-clinica-site',
      title: 'Site e agendamento da Clara',
      client: 'Clínica Clara',
      category: 'web',
      year: 2025,
      cover: pfImage('case-clara'),
      gallery: [pfImage('case-clara-1'), pfImage('case-clara-2')],
      summary: 'Um site que responde as dúvidas antes da consulta e agenda sem telefone.',
      challenge:
        'A recepção da Clara gastava quatro horas por dia no telefone respondendo as mesmas perguntas sobre preparo de exame e convênio.',
      solution:
        'Reorganizamos o conteúdo por dúvida, não por especialidade, e colocamos o agendamento em três passos. As instruções de preparo chegam por e-mail e WhatsApp no dia certo.',
      results: [
        { label: 'Agendamentos pelo site', value: '61%' },
        { label: 'Ligações na recepção', value: '-52%' },
        { label: 'Faltas na consulta', value: '-19%' },
      ],
      serviceIds: [2],
      tags: ['Site', 'Agendamento', 'Saúde'],
      featured: false,
      published: true,
    },
    {
      id: 5,
      slug: 'orbita-campanha-lancamento',
      title: 'Lançamento da Órbita',
      client: 'Órbita Software',
      category: 'campanha',
      year: 2025,
      cover: pfImage('case-orbita'),
      gallery: [pfImage('case-orbita-1'), pfImage('case-orbita-2')],
      summary: 'Campanha de lançamento com meta de 500 contas de teste em seis semanas.',
      challenge:
        'Produto novo, verba curta e nenhuma audiência própria. Precisávamos de um conceito que funcionasse igualmente em vídeo curto e em anúncio de busca.',
      solution:
        'Partimos de uma frase que a própria equipe de vendas já usava e construímos a campanha em volta dela. Landing page com uma única ação, peças por canal e leitura semanal dos números para redistribuir a verba.',
      results: [
        { label: 'Contas de teste', value: '742' },
        { label: 'Custo por conta', value: 'R$ 38' },
        { label: 'Conversão em pagante', value: '11%' },
      ],
      serviceIds: [5, 6],
      tags: ['Campanha', 'Lançamento', 'SaaS'],
      featured: false,
      published: true,
    },
    {
      id: 6,
      slug: 'mesa-restaurante-marca',
      title: 'Marca e cardápio do Mesa',
      client: 'Mesa Restaurante',
      category: 'branding',
      year: 2024,
      cover: pfImage('case-mesa'),
      gallery: [pfImage('case-mesa-1'), pfImage('case-mesa-2')],
      summary: 'Identidade, cardápio e sinalização de uma casa que abriu a segunda unidade.',
      challenge:
        'O Mesa cresceu por indicação e nunca teve marca formalizada. Ao abrir a segunda casa, cada material saía de um jeito.',
      solution:
        'Sistema visual simples o bastante para o próprio time aplicar: dois pesos de tipografia, uma paleta e um conjunto de gabaritos para cardápio, redes e sinalização.',
      results: [
        { label: 'Tempo de produção de material', value: '-60%' },
        { label: 'Ticket médio', value: '+14%' },
        { label: 'Menções nas redes', value: '2,3x' },
      ],
      serviceIds: [1, 6],
      tags: ['Marca', 'Impresso', 'Gastronomia'],
      featured: false,
      published: true,
    },
    {
      id: 7,
      slug: 'polo-educacao-plataforma',
      title: 'Plataforma de cursos do Polo',
      client: 'Polo Educação',
      category: 'app',
      year: 2024,
      cover: pfImage('case-polo'),
      gallery: [pfImage('case-polo-1'), pfImage('case-polo-2')],
      summary: 'Área do aluno redesenhada em torno de uma pergunta: o que eu faço agora?',
      challenge:
        'A plataforma tinha tudo, e por isso ninguém achava nada. A taxa de conclusão de curso estava em 22%.',
      solution:
        'Colocamos a próxima aula no centro da tela e escondemos o resto atrás de uma navegação previsível. Trilhas com progresso visível e retomada de onde parou, inclusive no celular.',
      results: [
        { label: 'Conclusão de curso', value: '48%' },
        { label: 'Aulas por semana', value: '+2,1' },
        { label: 'Suporte sobre navegação', value: '-73%' },
      ],
      serviceIds: [3, 2],
      tags: ['Produto', 'Educação', 'Design system'],
      featured: false,
      published: true,
    },
    {
      id: 8,
      slug: 'fonte-agua-identidade',
      title: 'Identidade da Fonte',
      client: 'Fonte Água Mineral',
      category: 'branding',
      year: 2024,
      cover: pfImage('case-fonte'),
      gallery: [pfImage('case-fonte-1')],
      summary: 'Rótulo e identidade para uma marca que disputa espaço na gôndola.',
      challenge:
        'Em uma gôndola de água mineral, todos os rótulos são azuis. A Fonte precisava ser reconhecida a três metros de distância.',
      solution:
        'Trabalhamos contraste e proporção antes de cor: uma silhueta de rótulo diferente e uma tipografia própria. A cor entrou por último, para diferenciar as linhas.',
      results: [
        { label: 'Reconhecimento em teste', value: '+2,8x' },
        { label: 'Giro na gôndola', value: '+22%' },
        { label: 'Novos pontos de venda', value: '340' },
      ],
      serviceIds: [1],
      tags: ['Embalagem', 'Marca', 'Varejo'],
      featured: false,
      published: false,
    },
  ];

  // ---- Time ---------------------------------------------------------------

  const TEAM = [
    {
      id: 1,
      name: 'Helena Prado',
      role: 'Diretora de criação',
      bio: 'Quinze anos entre agência e estúdio próprio. Conduz o território criativo dos projetos de marca.',
      photo: av('team-helena'),
      links: [
        { label: 'LinkedIn', url: '#' },
        { label: 'Behance', url: '#' },
      ],
    },
    {
      id: 2,
      name: 'Rafael Munhoz',
      role: 'Designer de produto',
      bio: 'Vem de engenharia e migrou para design. Cuida da descoberta e dos protótipos.',
      photo: av('team-rafael'),
      links: [{ label: 'LinkedIn', url: '#' }],
    },
    {
      id: 3,
      name: 'Bianca Rios',
      role: 'Desenvolvedora front-end',
      bio: 'Implementa o que o time desenha e cobra acessibilidade em toda revisão.',
      photo: av('team-bianca'),
      links: [
        { label: 'GitHub', url: '#' },
        { label: 'LinkedIn', url: '#' },
      ],
    },
    {
      id: 4,
      name: 'Caio Bastos',
      role: 'Estrategista',
      bio: 'Traduz objetivo de negócio em escopo de projeto e acompanha os números depois da entrega.',
      photo: av('team-caio'),
      links: [{ label: 'LinkedIn', url: '#' }],
    },
  ];

  // ---- Depoimentos --------------------------------------------------------

  const TESTIMONIALS = [
    {
      id: 1,
      author: 'Marina Coelho',
      role: 'Diretora de marketing',
      company: 'Norte Financeira',
      avatar: av('testi-marina'),
      quote:
        'A entrega veio com o manual e com o time treinado para usar. Seis meses depois ainda aplicamos a marca sem precisar consultar ninguém.',
      rating: 5,
      caseId: 1,
      approved: true,
    },
    {
      id: 2,
      author: 'Eduardo Lins',
      role: 'Sócio',
      company: 'Verde Campo Alimentos',
      avatar: av('testi-eduardo'),
      quote:
        'Foi o primeiro fornecedor que discutiu margem e recompra antes de falar de layout. A loja pagou o projeto no quarto mês.',
      rating: 5,
      caseId: 2,
      approved: true,
    },
    {
      id: 3,
      author: 'Patrícia Sena',
      role: 'Gerente de operações',
      company: 'Atlas Logística',
      avatar: av('testi-patricia'),
      quote:
        'Passaram três dias dentro do caminhão antes de desenhar qualquer tela. Isso apareceu no resultado.',
      rating: 5,
      caseId: 3,
      approved: true,
    },
    {
      id: 4,
      author: 'Dr. Anderson Kim',
      role: 'Diretor clínico',
      company: 'Clínica Clara',
      avatar: av('testi-anderson'),
      quote: 'A recepção voltou a atender quem está na frente dela. Era exatamente o que eu queria.',
      rating: 4,
      caseId: 4,
      approved: true,
    },
    {
      id: 5,
      author: 'Juliana Ferraz',
      role: 'Head de growth',
      company: 'Órbita Software',
      avatar: av('testi-juliana'),
      quote:
        'Reuniões semanais curtas, com número na mesa. A verba foi remanejada duas vezes durante a campanha e isso salvou o resultado.',
      rating: 5,
      caseId: 5,
      approved: false,
    },
  ];

  // ---- Leads --------------------------------------------------------------

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(9 + (n % 8), (n * 7) % 60, 0, 0);
    return d.toISOString();
  }

  function daysAhead(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  const LEADS = [
    {
      id: 1,
      name: 'Tatiana Rocha',
      email: 'tatiana@lumecosmeticos.com',
      company: 'Lume Cosméticos',
      phone: '(11) 98812-4477',
      budget: '30-60k',
      scope: ['identidade-visual', 'loja-virtual'],
      deadline: '3 meses',
      message: 'Vamos lançar uma linha nova em setembro e precisamos de marca e loja no ar antes disso.',
      source: 'briefing',
      stage: 'proposta',
      createdAt: daysAgo(3),
    },
    {
      id: 2,
      name: 'Gustavo Reis',
      email: 'gustavo@construtorapilar.com.br',
      company: 'Construtora Pilar',
      phone: '(41) 99604-2210',
      budget: '15-30k',
      scope: ['site-institucional'],
      deadline: '2 meses',
      message: 'Site atual é de 2017 e não abre direito no celular.',
      source: 'site',
      stage: 'contato',
      createdAt: daysAgo(5),
    },
    {
      id: 3,
      name: 'Renata Duarte',
      email: 'renata@clinicavertice.com',
      company: 'Clínica Vértice',
      phone: '(21) 98120-9931',
      budget: '15-30k',
      scope: ['site-institucional', 'campanha-digital'],
      deadline: 'Flexível',
      message: 'Indicação da Clínica Clara. Queremos algo parecido com o que fizeram lá.',
      source: 'indicacao',
      stage: 'ganho',
      createdAt: daysAgo(21),
    },
    {
      id: 4,
      name: 'Marcos Aurélio',
      email: 'marcos@vetorindustria.com',
      company: 'Vetor Indústria',
      phone: '(47) 99331-0088',
      budget: '60k+',
      scope: ['design-de-produto'],
      deadline: '6 meses',
      message: 'Portal do distribuidor. Temos time de engenharia interno.',
      source: 'site',
      stage: 'novo',
      createdAt: daysAgo(1),
    },
    {
      id: 5,
      name: 'Camila Prates',
      email: 'camila@estudiosalto.com',
      company: 'Estúdio Salto',
      phone: '(51) 98444-7712',
      budget: 'Até 15k',
      scope: ['motion-e-video'],
      deadline: '1 mês',
      message: 'Precisamos de três vídeos curtos para o Instagram.',
      source: 'social',
      stage: 'perdido',
      createdAt: daysAgo(30),
    },
    {
      id: 6,
      name: 'Fernando Tavares',
      email: 'fernando@grupomirante.com.br',
      company: 'Grupo Mirante',
      phone: '(85) 99777-3321',
      budget: '30-60k',
      scope: ['identidade-visual', 'site-institucional'],
      deadline: '4 meses',
      message: 'Fusão de duas empresas, marca nova para as duas.',
      source: 'briefing',
      stage: 'novo',
      createdAt: daysAgo(0),
    },
    {
      id: 7,
      name: 'Aline Barbosa',
      email: 'aline@pontoacademia.com',
      company: 'Ponto Academia',
      phone: '(31) 98266-1140',
      budget: '15-30k',
      scope: ['campanha-digital'],
      deadline: '2 meses',
      message: 'Campanha de matrícula de janeiro.',
      source: 'social',
      stage: 'contato',
      createdAt: daysAgo(8),
    },
    {
      id: 8,
      name: 'Sérgio Nakamura',
      email: 'sergio@rotalog.com.br',
      company: 'Rota Log',
      phone: '(11) 97001-5560',
      budget: '60k+',
      scope: ['design-de-produto', 'site-institucional'],
      deadline: '5 meses',
      message: 'Vimos o case da Atlas. Operação parecida, 120 motoristas.',
      source: 'indicacao',
      stage: 'proposta',
      createdAt: daysAgo(12),
    },
  ];

  // ---- Propostas ----------------------------------------------------------

  const PROPOSALS = [
    {
      id: 1,
      code: 'PRO-2026-014',
      leadId: 1,
      client: 'Lume Cosméticos',
      title: 'Identidade visual e loja virtual',
      items: [
        { description: 'Identidade visual completa', qty: 1, price: 12000 },
        { description: 'Loja virtual (catálogo + checkout)', qty: 1, price: 32000 },
        { description: 'Ensaio fotográfico de produto', qty: 1, price: 6000 },
      ],
      discount: 5,
      status: 'enviada',
      validUntil: daysAhead(12),
      createdAt: daysAgo(2),
    },
    {
      id: 2,
      code: 'PRO-2026-013',
      leadId: 8,
      client: 'Rota Log',
      title: 'Descoberta e app de campo',
      items: [
        { description: 'Descoberta com pesquisa em campo', qty: 1, price: 18000 },
        { description: 'Design de produto (app do motorista)', qty: 1, price: 24000 },
        { description: 'Design system e handoff', qty: 1, price: 9000 },
      ],
      discount: 0,
      status: 'enviada',
      validUntil: daysAhead(20),
      createdAt: daysAgo(9),
    },
    {
      id: 3,
      code: 'PRO-2026-011',
      leadId: 3,
      client: 'Clínica Vértice',
      title: 'Site institucional e campanha',
      items: [
        { description: 'Site institucional', qty: 1, price: 18000 },
        { description: 'Campanha digital de abertura', qty: 1, price: 15000 },
      ],
      discount: 10,
      status: 'aceita',
      validUntil: daysAhead(-4),
      createdAt: daysAgo(24),
    },
    {
      id: 4,
      code: 'PRO-2026-010',
      leadId: 5,
      client: 'Estúdio Salto',
      title: 'Pacote de vídeos curtos',
      items: [{ description: 'Motion e vídeo (3 peças)', qty: 3, price: 3000 }],
      discount: 0,
      status: 'recusada',
      validUntil: daysAhead(-15),
      createdAt: daysAgo(32),
    },
    {
      id: 5,
      code: 'PRO-2026-015',
      leadId: null,
      client: 'Grupo Mirante',
      title: 'Marca da fusão',
      items: [{ description: 'Identidade visual completa', qty: 1, price: 12000 }],
      discount: 0,
      status: 'rascunho',
      validUntil: daysAhead(30),
      createdAt: daysAgo(0),
    },
  ];

  // ---- Conteúdo estático --------------------------------------------------

  const PROCESS = [
    { step: 1, titleKey: 'process.s1.title', descKey: 'process.s1.desc', icon: 'search' },
    { step: 2, titleKey: 'process.s2.title', descKey: 'process.s2.desc', icon: 'layers' },
    { step: 3, titleKey: 'process.s3.title', descKey: 'process.s3.desc', icon: 'edit' },
    { step: 4, titleKey: 'process.s4.title', descKey: 'process.s4.desc', icon: 'rocket' },
    { step: 5, titleKey: 'process.s5.title', descKey: 'process.s5.desc', icon: 'chart' },
  ];

  const FAQS = [
    { id: 1, questionKey: 'faq.q1.q', answerKey: 'faq.q1.a' },
    { id: 2, questionKey: 'faq.q2.q', answerKey: 'faq.q2.a' },
    { id: 3, questionKey: 'faq.q3.q', answerKey: 'faq.q3.a' },
    { id: 4, questionKey: 'faq.q4.q', answerKey: 'faq.q4.a' },
    { id: 5, questionKey: 'faq.q5.q', answerKey: 'faq.q5.a' },
  ];

  const CLIENTS = ['Norte', 'Verde Campo', 'Atlas', 'Clara', 'Órbita', 'Mesa', 'Polo', 'Fonte'];

  const BUDGET_RANGES = ['Até 15k', '15-30k', '30-60k', '60k+'];
  const DEADLINE_OPTIONS = ['1 mês', '2 meses', '3 meses', '4 meses', '6 meses', 'Flexível'];

  /** Série de leads por mês usada no dashboard. */
  const LEADS_SERIES = [
    { label: 'Jan', value: 12 },
    { label: 'Fev', value: 15 },
    { label: 'Mar', value: 11 },
    { label: 'Abr', value: 18 },
    { label: 'Mai', value: 22 },
    { label: 'Jun', value: 19 },
    { label: 'Jul', value: 26 },
    { label: 'Ago', value: 24 },
  ];

  /** Receita fechada por mês (R$). */
  const REVENUE_SERIES = [
    { label: 'Jan', value: 48000 },
    { label: 'Fev', value: 62000 },
    { label: 'Mar', value: 41000 },
    { label: 'Abr', value: 75000 },
    { label: 'Mai', value: 89000 },
    { label: 'Jun', value: 68000 },
    { label: 'Jul', value: 104000 },
    { label: 'Ago', value: 92000 },
  ];

  global.Data = {
    pfImage,
    SERVICES,
    CASES,
    TEAM,
    TESTIMONIALS,
    LEADS,
    PROPOSALS,
    PROCESS,
    FAQS,
    CLIENTS,
    BUDGET_RANGES,
    DEADLINE_OPTIONS,
    LEADS_SERIES,
    REVENUE_SERIES,
  };
})(window);
