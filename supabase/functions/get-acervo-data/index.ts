
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Mock data for reviews with proper Portuguese medical content
const mockReviews = [
  {
    review_id: 1,
    title: "Análise Crítica: Novas Diretrizes de Hipertensão",
    description: "Uma revisão abrangente das últimas diretrizes da AHA/ESC para o manejo da hipertensão arterial sistêmica.",
    cover_image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    published_at: "2024-12-15T10:00:00Z",
    tags_json: { 
      "Cardiologia": ["Hipertensão", "Diretrizes"], 
      "Medicina Preventiva": ["Fatores de Risco"] 
    }
  },
  {
    review_id: 2,
    title: "Síndrome de Burnout em Profissionais da Saúde: Prevenção e Manejo",
    description: "Um olhar aprofundado sobre as causas da síndrome de burnout e estratégias eficazes para sua prevenção e tratamento.",
    cover_image_url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop",
    published_at: "2024-12-10T14:30:00Z",
    tags_json: { 
      "Saúde Mental": ["Burnout", "Bem-estar"], 
      "Gestão": ["Recursos Humanos"] 
    }
  },
  {
    review_id: 3,
    title: "Novas Terapias no Tratamento do Diabetes Mellitus Tipo 2",
    description: "Análise comparativa dos novos fármacos para o controle glicêmico e redução de risco cardiovascular em diabéticos.",
    cover_image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    published_at: "2024-12-08T09:15:00Z",
    tags_json: { 
      "Endocrinologia": ["Diabetes", "Farmacologia"], 
      "Cardiologia": ["Risco Cardiovascular"] 
    }
  },
  {
    review_id: 4,
    title: "Medicina Baseada em Evidências: Antibióticos e Resistência",
    description: "Análise sistemática do uso racional de antibióticos em unidades de terapia intensiva.",
    cover_image_url: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&h=600&fit=crop",
    published_at: "2024-12-05T16:45:00Z",
    tags_json: { 
      "Infectologia": ["Antibióticos", "Resistência"], 
      "UTI": ["Terapia Intensiva"] 
    }
  },
  {
    review_id: 5,
    title: "O Eixo Intestino-Cérebro: Como o Microbioma Influencia a Saúde Mental",
    description: "Revisão das evidências científicas que conecta a saúde do microbioma intestinal com transtornos mentais.",
    cover_image_url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
    published_at: "2024-12-03T11:20:00Z",
    tags_json: { 
      "Gastroenterologia": ["Microbioma", "Eixo Intestino-Cérebro"], 
      "Saúde Mental": ["Neuropsiquiatria"] 
    }
  },
  {
    review_id: 6,
    title: "Telemedicina na Atenção Primária: Desafios e Oportunidades",
    description: "Avaliação do impacto da telemedicina na qualidade do atendimento e acessibilidade dos cuidados primários.",
    cover_image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
    published_at: "2024-11-28T13:10:00Z",
    tags_json: { 
      "Atenção Primária": ["Telemedicina", "Acessibilidade"], 
      "Tecnologia": ["Saúde Digital"] 
    }
  },
  {
    review_id: 7,
    title: "Edição Genética com CRISPR-Cas9: Implicações Éticas e Clínicas",
    description: "Discussão sobre os avanços, limitações e considerações éticas da edição genética na prática médica.",
    cover_image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    published_at: "2024-11-25T08:45:00Z",
    tags_json: { 
      "Genética": ["CRISPR", "Edição Genética"], 
      "Bioética": ["Ética Médica"] 
    }
  },
  {
    review_id: 8,
    title: "Oncologia Personalizada: Biomarcadores e Terapias Dirigidas",
    description: "Como os biomarcadores estão revolucionando o tratamento oncológico com terapias mais precisas.",
    cover_image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
    published_at: "2024-11-22T15:30:00Z",
    tags_json: { 
      "Oncologia": ["Biomarcadores", "Terapia Dirigida"], 
      "Medicina Personalizada": ["Precisão"] 
    }
  },
  {
    review_id: 9,
    title: "Imunização em Adultos: Atualizações do Calendário Vacinal",
    description: "Revisão das recomendações atuais para vacinação em adultos, incluindo grupos especiais.",
    cover_image_url: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&h=600&fit=crop",
    published_at: "2024-11-18T12:00:00Z",
    tags_json: { 
      "Imunização": ["Vacinas", "Adultos"], 
      "Medicina Preventiva": ["Calendário Vacinal"] 
    }
  },
  {
    review_id: 10,
    title: "Inteligência Artificial no Diagnóstico por Imagem",
    description: "Análise do potencial e limitações da IA na interpretação de exames radiológicos.",
    cover_image_url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
    published_at: "2024-11-15T10:15:00Z",
    tags_json: { 
      "Radiologia": ["Inteligência Artificial", "Diagnóstico"], 
      "Tecnologia": ["Machine Learning"] 
    }
  }
];

// Mock tags hierarchy
const mockTags = [
  // Parent tags (categorias)
  { id: 1, tag_name: "Cardiologia", parent_id: null },
  { id: 2, tag_name: "Endocrinologia", parent_id: null },
  { id: 3, tag_name: "Saúde Mental", parent_id: null },
  { id: 4, tag_name: "Infectologia", parent_id: null },
  { id: 5, tag_name: "Gastroenterologia", parent_id: null },
  { id: 6, tag_name: "Atenção Primária", parent_id: null },
  { id: 7, tag_name: "Genética", parent_id: null },
  { id: 8, tag_name: "Oncologia", parent_id: null },
  { id: 9, tag_name: "Imunização", parent_id: null },
  { id: 10, tag_name: "Radiologia", parent_id: null },
  { id: 11, tag_name: "Medicina Preventiva", parent_id: null },
  { id: 12, tag_name: "Tecnologia", parent_id: null },
  { id: 13, tag_name: "Bioética", parent_id: null },
  { id: 14, tag_name: "UTI", parent_id: null },
  { id: 15, tag_name: "Gestão", parent_id: null },
  { id: 16, tag_name: "Medicina Personalizada", parent_id: null },
  
  // Child tags (subtags)
  { id: 17, tag_name: "Hipertensão", parent_id: 1 },
  { id: 18, tag_name: "Diretrizes", parent_id: 1 },
  { id: 19, tag_name: "Risco Cardiovascular", parent_id: 1 },
  { id: 20, tag_name: "Diabetes", parent_id: 2 },
  { id: 21, tag_name: "Farmacologia", parent_id: 2 },
  { id: 22, tag_name: "Burnout", parent_id: 3 },
  { id: 23, tag_name: "Bem-estar", parent_id: 3 },
  { id: 24, tag_name: "Neuropsiquiatria", parent_id: 3 },
  { id: 25, tag_name: "Antibióticos", parent_id: 4 },
  { id: 26, tag_name: "Resistência", parent_id: 4 },
  { id: 27, tag_name: "Microbioma", parent_id: 5 },
  { id: 28, tag_name: "Eixo Intestino-Cérebro", parent_id: 5 },
  { id: 29, tag_name: "Telemedicina", parent_id: 6 },
  { id: 30, tag_name: "Acessibilidade", parent_id: 6 },
  { id: 31, tag_name: "CRISPR", parent_id: 7 },
  { id: 32, tag_name: "Edição Genética", parent_id: 7 },
  { id: 33, tag_name: "Biomarcadores", parent_id: 8 },
  { id: 34, tag_name: "Terapia Dirigida", parent_id: 8 },
  { id: 35, tag_name: "Vacinas", parent_id: 9 },
  { id: 36, tag_name: "Adultos", parent_id: 9 },
  { id: 37, tag_name: "Inteligência Artificial", parent_id: 10 },
  { id: 38, tag_name: "Diagnóstico", parent_id: 10 },
  { id: 39, tag_name: "Fatores de Risco", parent_id: 11 },
  { id: 40, tag_name: "Calendário Vacinal", parent_id: 11 },
  { id: 41, tag_name: "Saúde Digital", parent_id: 12 },
  { id: 42, tag_name: "Machine Learning", parent_id: 12 },
  { id: 43, tag_name: "Ética Médica", parent_id: 13 },
  { id: 44, tag_name: "Terapia Intensiva", parent_id: 14 },
  { id: 45, tag_name: "Recursos Humanos", parent_id: 15 },
  { id: 46, tag_name: "Precisão", parent_id: 16 }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user ID from JWT for rate limiting
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('Authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(supabaseClient, 'get-acervo-data', user.id)
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          resetTime: rateLimitResult.resetTime 
        }),
        {
          headers: { 
            ...corsHeaders, 
            ...rateLimitHeaders(rateLimitResult),
            'Content-Type': 'application/json' 
          },
          status: 429,
        },
      )
    }

    console.log('Fetching acervo data...')

    // For now, return mock data. In production, this would query the database:
    // const [reviewsResult, tagsResult] = await Promise.all([...])
    
    const response = {
      reviews: mockReviews,
      tags: mockTags
    }

    console.log(`Successfully provided ${mockReviews.length} reviews and ${mockTags.length} tags`)

    return new Response(
      JSON.stringify(response),
      {
        headers: { 
          ...corsHeaders, 
          ...rateLimitHeaders(rateLimitResult),
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in get-acervo-data function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
