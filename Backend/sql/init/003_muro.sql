-- Muro ciudadano: temas, reportes, apoyos y comentarios quedan publicados.

CREATE TABLE IF NOT EXISTS participation.wall_post (
    post_id UUID PRIMARY KEY,
    citizen_id UUID NOT NULL REFERENCES citizen.citizen (citizen_id),
    kind VARCHAR(20) NOT NULL,
    title VARCHAR(180),
    body TEXT NOT NULL,
    category_slug VARCHAR(40),
    barrio VARCHAR(120),
    parent_id UUID REFERENCES participation.wall_post (post_id),
    ref_type VARCHAR(30),
    ref_id UUID,
    reference VARCHAR(80),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT wall_post_kind CHECK (kind IN ('TEMA', 'REPORTE', 'APOYO', 'COMENTARIO'))
);

CREATE INDEX IF NOT EXISTS wall_post_created_idx ON participation.wall_post (created_at DESC);
CREATE INDEX IF NOT EXISTS wall_post_parent_idx ON participation.wall_post (parent_id);

CREATE UNIQUE INDEX IF NOT EXISTS wall_report_once
    ON participation.wall_post (ref_id)
    WHERE kind = 'REPORTE' AND ref_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS wall_support_once
    ON participation.wall_post (citizen_id, ref_type, ref_id)
    WHERE kind = 'APOYO' AND ref_id IS NOT NULL;

INSERT INTO participation.wall_post (
    post_id, citizen_id, kind, title, body, category_slug, barrio, ref_type, ref_id, reference, created_at
)
SELECT
    gen_random_uuid(),
    r.citizen_id,
    'REPORTE',
    LEFT(COALESCE(r.title, 'Reporte ciudadano'), 180),
    COALESCE(NULLIF(r.description, ''), 'Reporte publicado en el mapa de Montería.'),
    c.slug,
    n.name,
    'REPORT',
    r.report_id,
    r.case_number,
    r.created_at
FROM report.report r
JOIN catalog.category c ON c.category_id = r.category_id
LEFT JOIN geo.report_location l ON l.report_id = r.report_id
LEFT JOIN catalog.neighborhood n ON n.neighborhood_id = l.neighborhood_id
WHERE r.public_visibility = TRUE
  AND r.citizen_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM participation.wall_post existing
      WHERE existing.kind = 'REPORTE' AND existing.ref_id = r.report_id
  );
