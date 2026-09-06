-- =====================================================================
-- seed.sql
-- MERIDIAN LIFE SCIENCES PLATFORM
-- Seed Data: Taxonomy Tags, Verified Corporate Domains, Initial Editorial Articles
-- =====================================================================

-- 1. Populate Standardized Life Sciences Tags
INSERT INTO public.tags (name, category) VALUES
  ('Gene Therapy', 'Pharma'),
  ('AI Diagnostics', 'AI-Health'),
  ('Regulatory Affairs', 'Pharma'),
  ('Clinical Operations', 'Pharma'),
  ('Oncology BD', 'Pharma'),
  ('mRNA Platforms', 'Pharma'),
  ('Surgical Robotics', 'MedTech'),
  ('Health Economics', 'Pharma'),
  ('Digital Therapeutics', 'AI-Health'),
  ('Supply Chain', 'Pharma'),
  ('Medical Affairs', 'Pharma'),
  ('Companion Diagnostics', 'MedTech'),
  ('Neurology Pipeline', 'Pharma'),
  ('Rare Disease', 'Pharma'),
  ('Cell & Gene', 'Pharma'),
  ('Market Access', 'Pharma'),
  ('Pharmacovigilance', 'Pharma'),
  ('Wearables & Sensors', 'MedTech'),
  ('IP & Strategy', 'Pharma'),
  ('Manufacturing', 'Pharma')
ON CONFLICT (name) DO NOTHING;

-- 2. Populate Verified Life Sciences & MedTech Corporate Domains
INSERT INTO public.corporate_domains (domain, company_name, is_verified) VALUES
  ('pfizer.com', 'Pfizer', true),
  ('astrazeneca.com', 'AstraZeneca', true),
  ('medtronic.com', 'Medtronic', true),
  ('novonordisk.com', 'Novo Nordisk', true),
  ('roche.com', 'Roche Diagnostics', true),
  ('sunpharma.com', 'Sun Pharma', true),
  ('cipla.com', 'Cipla Ltd.', true),
  ('iqvia.com', 'IQVIA', true),
  ('biocon.com', 'Biocon Biologics', true),
  ('abbott.com', 'Abbott Healthcare', true),
  ('lupin.com', 'Lupin Pharmaceuticals', true),
  ('tataelxsi.com', 'Tata Elxsi Health', true),
  ('drreddys.com', 'Dr. Reddy''s Laboratories', true),
  ('sofinnova.com', 'Sofinnova Partners', true)
ON CONFLICT (domain) DO NOTHING;

-- 3. Populate Initial Articles
INSERT INTO public.articles (
  section, category, title, slug, byline, author_role, published_date,
  read_time, audio_time, audio_duration_sec, excerpt, body, pull_quote,
  hero, featured, is_free, c_suite_summary, key_metrics, issue_key, status
) VALUES 
(
  'Pharma',
  'Cover Story',
  'FDA''s Draft Guidance on AI-Enabled Diagnostics: What Every Regulatory Affairs Lead Needs to Know',
  'fdas-draft-guidance-ai-diagnostics-2026',
  'Dr. Priya Nair',
  'VP Regulatory Affairs, Pfizer',
  '2026-08-12',
  '8 min',
  '5 min 40s',
  340,
  'The agency''s proposed framework shifts from device-centric oversight to algorithm-centric governance, fundamentally changing how your team files 510(k) submissions for software-based diagnostic tools.',
  ARRAY[
    'The FDA''s draft guidance on AI-enabled diagnostics represents the most significant regulatory realignment in the diagnostics space since CLIA 1988. For regulatory affairs teams across pharma and medtech, the implications extend well beyond a simple compliance update.',
    'At the core of the guidance is a fundamental shift in how the agency evaluates software-based diagnostic tools. The traditional 510(k) pathway is being supplemented by a new algorithm-centric governance framework.',
    'Three specific provisions demand immediate attention from regulatory leads: Predetermined Change Control Plans (PCCPs), tiered risk classifications, and mandatory continuous real-world performance monitoring.'
  ],
  'The shift from device-centric to algorithm-centric oversight is the most significant regulatory realignment in diagnostics since CLIA 1988.',
  true,
  false,
  true,
  ARRAY[
    'FDA moves from device-centric to algorithm-centric 510(k) submissions.',
    'Mandatory Predetermined Change Control Plans (PCCPs) required for algorithm updates.',
    'Oct 15, 2026 deadline for public industry comments.'
  ],
  '[{"label": "PCCP Mandate", "value": "100% SaMD"}, {"label": "Comment Deadline", "value": "Oct 15, 2026"}, {"label": "Risk Tier", "value": "Tier 1 High-Risk"}]'::jsonb,
  '2026-08',
  'published'
),
(
  'Pharma',
  'IP & Strategy',
  'CRISPR Patent Landscape Q3 2026: Who Holds the Keys to the Next Wave',
  'crispr-patent-landscape-q3-2026',
  'Marcus Osei-Bonsu',
  'Senior Director BD, Medtronic',
  '2026-08-08',
  '5 min',
  '4 min 10s',
  250,
  'Three licensing pools are reshaping the competitive dynamics around base-editing IP. A structured breakdown of the Broad, UC Berkeley, and Intellia positions.',
  ARRAY[
    'The CRISPR patent landscape has entered a new phase of complexity. As of Q3 2026, three distinct licensing pools have emerged, each controlling different slices of the gene-editing IP stack.',
    'For BD teams evaluating licensing opportunities, the practical implication is that no single license provides freedom to operate across the full therapeutic pipeline.'
  ],
  'No single license provides freedom to operate across the full therapeutic pipeline. Base editing requires stacking licenses from at least two pools.',
  false,
  true,
  false,
  ARRAY[
    'No single license grants total freedom to operate (FTO) for base editing.',
    'Stacking licenses across Broad, UC Berkeley, and Intellia is now standard.',
    'Watch EPO opposition outcomes in Q4 for European market clearance.'
  ],
  '[{"label": "IP Pools", "value": "3 Primary"}, {"label": "Royalty Stack", "value": "4.5% - 8.2%"}, {"label": "Primary Vector", "value": "Base-Editing"}]'::jsonb,
  '2026-08',
  'published'
)
ON CONFLICT (slug) DO NOTHING;
