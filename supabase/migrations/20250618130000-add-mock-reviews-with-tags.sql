
-- Add mock reviews with proper tag associations for testing the Acervo page
-- First, insert some mock reviews
INSERT INTO public."Reviews" (
  title, 
  description, 
  cover_image_url, 
  status, 
  access_level, 
  structured_content,
  published_at,
  created_at
) VALUES 
(
  'Novas Diretrizes para Tratamento de Fibrilação Atrial',
  'Análise das mais recentes recomendações para manejo de FA em pacientes com comorbidades cardiovasculares.',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
  'published',
  'public',
  '{"version": "2.0", "nodes": [], "layouts": {"desktop": [], "mobile": []}, "canvasState": {}}',
  NOW(),
  NOW()
),
(
  'Diagnóstico Diferencial de AVC Isquêmico vs Hemorrágico',
  'Protocolo atualizado para diagnóstico rápido e preciso em unidades de emergência.',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
  'published', 
  'public',
  '{"version": "2.0", "nodes": [], "layouts": {"desktop": [], "mobile": []}, "canvasState": {}}',
  NOW(),
  NOW()
),
(
  'Vacinação em Pediatria: Calendário 2025',
  'Atualizações no calendário vacinal pediátrico e considerações especiais para prematuros.',
  'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=400&h=300&fit=crop',
  'published',
  'public', 
  '{"version": "2.0", "nodes": [], "layouts": {"desktop": [], "mobile": []}, "canvasState": {}}',
  NOW(),
  NOW()
),
(
  'Farmacologia Clínica de Anticoagulantes',
  'Mecanismos de ação, indicações e monitoramento dos novos anticoagulantes orais.',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
  'published',
  'public',
  '{"version": "2.0", "nodes": [], "layouts": {"desktop": [], "mobile": []}, "canvasState": {}}',
  NOW(),
  NOW()
),
(
  'Técnicas Avançadas em Cirurgia Minimamente Invasiva',
  'Evolução das técnicas laparoscópicas e robóticas em cirurgias abdominais complexas.',
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop',
  'published',
  'public',
  '{"version": "2.0", "nodes": [], "layouts": {"desktop": [], "mobile": []}, "canvasState": {}}',
  NOW(),
  NOW()
),
(
  'Dermatologia Pediátrica: Lesões Comuns',
  'Identificação e manejo das principais dermatoses na infância e adolescência.',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
  'published',
  'public',
  '{"version": "2.0", "nodes": [], "layouts": {"desktop": [], "mobile": []}, "canvasState": {}}',
  NOW(),
  NOW()
);

-- Now create tag associations for these reviews
-- Get the review IDs and tag IDs we just created
WITH review_tags AS (
  SELECT 
    r.id as review_id,
    r.title,
    CASE 
      WHEN r.title ILIKE '%fibrilação%' OR r.title ILIKE '%atrial%' THEN 'Cardiologia'
      WHEN r.title ILIKE '%avc%' OR r.title ILIKE '%isquêmico%' THEN 'Neurologia' 
      WHEN r.title ILIKE '%vacinação%' OR r.title ILIKE '%pediatria%' THEN 'Pediatria'
      WHEN r.title ILIKE '%farmacologia%' OR r.title ILIKE '%anticoagulantes%' THEN 'Farmacologia'
      WHEN r.title ILIKE '%cirurgia%' OR r.title ILIKE '%laparoscópicas%' THEN 'Cirurgia'
      WHEN r.title ILIKE '%dermatologia%' THEN 'Dermatologia'
      ELSE 'Medicina Interna'
    END as category
  FROM public."Reviews" r 
  WHERE r.title IN (
    'Novas Diretrizes para Tratamento de Fibrilação Atrial',
    'Diagnóstico Diferencial de AVC Isquêmico vs Hemorrágico', 
    'Vacinação em Pediatria: Calendário 2025',
    'Farmacologia Clínica de Anticoagulantes',
    'Técnicas Avançadas em Cirurgia Minimamente Invasiva',
    'Dermatologia Pediátrica: Lesões Comuns'
  )
)
INSERT INTO public."ReviewTags" (review_id, tag_id, created_at)
SELECT 
  rt.review_id,
  t.id as tag_id,
  NOW()
FROM review_tags rt
JOIN public."Tags" t ON t.tag_name = rt.category
WHERE t.parent_id IS NULL;

-- Add some child tag associations as well
WITH specific_associations AS (
  SELECT r.id as review_id, 'Eletrofisiologia' as tag_name
  FROM public."Reviews" r 
  WHERE r.title = 'Novas Diretrizes para Tratamento de Fibrilação Atrial'
  
  UNION ALL
  
  SELECT r.id as review_id, 'AVC' as tag_name  
  FROM public."Reviews" r
  WHERE r.title = 'Diagnóstico Diferencial de AVC Isquêmico vs Hemorrágico'
  
  UNION ALL
  
  SELECT r.id as review_id, 'Neonatologia' as tag_name
  FROM public."Reviews" r 
  WHERE r.title = 'Vacinação em Pediatria: Calendário 2025'
)
INSERT INTO public."ReviewTags" (review_id, tag_id, created_at)
SELECT 
  sa.review_id,
  t.id as tag_id,
  NOW()
FROM specific_associations sa
JOIN public."Tags" t ON t.tag_name = sa.tag_name
WHERE NOT EXISTS (
  SELECT 1 FROM public."ReviewTags" rt 
  WHERE rt.review_id = sa.review_id AND rt.tag_id = t.id
);
