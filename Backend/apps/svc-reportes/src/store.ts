import { AppError, createPool, readToken, statusToDb, statusToUi, type UiStatus } from "@mpm/shared";

const pool = createPool("report");

type ReportRow = {
  report_id: string;
  case_number: string;
  title: string | null;
  description: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
  citizen_id: string | null;
  category: string | null;
  barrio: string | null;
  comuna: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  supports: string;
};

const TIMELINE: { status: UiStatus; update: string; responsible: string }[] = [
  { status: "recibido", responsible: "Equipo de atención ciudadana", update: "Tu reporte entró a la plataforma y quedó ubicado en el mapa de Montería." },
  { status: "validado", responsible: "Montería Puede Más", update: "Se verificará la información y el punto exacto del reporte." },
  { status: "en-revision", responsible: "Entidad responsable", update: "El caso se analizará con la entidad responsable del tema reportado." },
  { status: "asignado", responsible: "Equipo de obra", update: "Se asignará el caso a un equipo de trabajo." },
  { status: "en-ejecucion", responsible: "Equipo de obra", update: "La solución estará en marcha con seguimiento de la comunidad." },
  { status: "resuelto", responsible: "Comunidad y aliados", update: "La situación será atendida y verificada." },
];

const SELECT_REPORTS = `
  SELECT
    r.report_id,
    r.case_number,
    r.title,
    r.description,
    r.status,
    r.created_at,
    r.updated_at,
    r.citizen_id,
    c.slug AS category,
    n.name AS barrio,
    COALESCE(n.commune, 'Por asignar') AS comuna,
    l.address,
    l.latitude::text,
    l.longitude::text,
    (SELECT count(*) FROM participation.participation p
      WHERE p.target_id = r.report_id AND p.participation_type = 'APOYO')::text AS supports
  FROM report.report r
  JOIN catalog.category c ON c.category_id = r.category_id
  LEFT JOIN geo.report_location l ON l.report_id = r.report_id
  LEFT JOIN catalog.neighborhood n ON n.neighborhood_id = l.neighborhood_id
`;

function db() {
  if (!pool) throw new AppError(503, "DB_UNAVAILABLE", "La base de datos no está configurada.");
  return pool;
}

export function toReport(row: ReportRow, viewerId?: string | null) {
  const status = statusToUi(row.status);
  const currentIndex = TIMELINE.findIndex((item) => item.status === status);
  const createdAt = row.created_at.toISOString();
  return {
    id: row.case_number,
    caseNumber: row.case_number,
    title: row.title ?? "",
    description: row.description ?? "",
    category: row.category ?? "otro",
    barrio: row.barrio ?? "Sin barrio",
    comuna: row.comuna ?? "Por asignar",
    address: row.address ?? "",
    coords: {
      lat: Number(row.latitude ?? 8.75),
      lng: Number(row.longitude ?? -75.88),
    },
    status,
    createdAt,
    updatedAt: row.updated_at.toISOString(),
    photos: [] as string[],
    supports: Number(row.supports),
    comments: 0,
    isMine: Boolean(viewerId && row.citizen_id === viewerId),
    timeline: TIMELINE.map((item, index) => ({
      status: item.status,
      date: createdAt,
      responsible: item.responsible,
      update: item.update,
      done: index <= currentIndex,
    })),
  };
}

export async function listReports(filters: {
  categories?: string[];
  status?: string[];
  barrio?: string;
  query?: string;
  citizenId?: string;
  limit?: number;
}) {
  const where: string[] = ["r.public_visibility = TRUE"];
  const values: unknown[] = [];

  if (filters.citizenId) {
    where.length = 0;
    values.push(filters.citizenId);
    where.push(`r.citizen_id = $${values.length}`);
  }
  if (filters.categories?.length) {
    values.push(filters.categories);
    where.push(`c.slug = ANY($${values.length}::text[])`);
  }
  if (filters.status?.length) {
    const dbStatuses = filters.status.map(statusToDb).filter((item): item is string => Boolean(item));
    if (dbStatuses.length) {
      values.push(dbStatuses);
      where.push(`r.status = ANY($${values.length}::text[])`);
    }
  }
  if (filters.barrio) {
    values.push(filters.barrio);
    where.push(`n.name = $${values.length}`);
  }
  if (filters.query) {
    values.push(`%${filters.query}%`);
    where.push(`(r.title ILIKE $${values.length} OR r.description ILIKE $${values.length} OR r.case_number ILIKE $${values.length} OR n.name ILIKE $${values.length})`);
  }

  const limit = filters.limit && filters.limit > 0 ? filters.limit : 200;
  values.push(limit);
  const result = await db().query<ReportRow>(
    `${SELECT_REPORTS}
     WHERE ${where.join(" AND ")}
     ORDER BY r.created_at DESC
     LIMIT $${values.length}`,
    values,
  );
  return result.rows;
}

export async function getReport(id: string) {
  const result = await db().query<ReportRow>(
    `${SELECT_REPORTS} WHERE r.case_number = $1 OR r.report_id::text = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function createReport(
  citizenId: string,
  input: {
    title: string;
    description: string;
    category: string;
    barrio: string;
    address: string;
    lat: number;
    lng: number;
    consent: boolean;
  },
) {
  if (!input.consent) {
    throw new AppError(422, "CONSENT_REQUIRED", "Autoriza el tratamiento de datos para enviar el reporte.");
  }
  if (!input.title.trim() || !input.description.trim()) {
    throw new AppError(422, "INVALID_REPORT", "El título y la descripción son obligatorios.");
  }

  const client = await db().connect();
  try {
    await client.query("BEGIN");
    const category = await client.query<{ category_id: string }>(
      "SELECT category_id FROM catalog.category WHERE slug = $1 AND active = TRUE",
      [input.category],
    );
    const categoryId = category.rows[0]?.category_id;
    if (!categoryId) throw new AppError(422, "INVALID_CATEGORY", "Esa categoría no está disponible.");

    const barrio = input.barrio.trim() || "Sin barrio";
    const neighborhood = await client.query<{ neighborhood_id: string }>(
      `INSERT INTO catalog.neighborhood (neighborhood_id, name, commune)
       VALUES (gen_random_uuid(), $1, 'Por asignar')
       ON CONFLICT (name, commune) DO UPDATE SET name = EXCLUDED.name
       RETURNING neighborhood_id`,
      [barrio],
    );
    const neighborhoodId = neighborhood.rows[0]?.neighborhood_id;

    const sequence = await client.query<{ next: string }>(
      "SELECT (count(*) + 1)::text AS next FROM report.report",
    );
    const year = new Date().getFullYear();
    const caseNumber = `MPM-${year}-${String(sequence.rows[0]?.next ?? "1").padStart(6, "0")}`;

    const report = await client.query<{ report_id: string }>(
      `INSERT INTO report.report (
         report_id, case_number, citizen_id, category_id, title, description, status, priority, source, public_visibility
       ) VALUES (
         gen_random_uuid(), $1, $2, $3, $4, $5, 'RECIBIDO', 'MEDIUM', 'WEB', TRUE
       ) RETURNING report_id`,
      [caseNumber, citizenId, categoryId, input.title.trim(), input.description.trim()],
    );
    const reportId = report.rows[0]?.report_id;
    if (!reportId) throw new AppError(500, "INTERNAL", "No se pudo guardar el reporte.");

    await client.query(
      `INSERT INTO geo.report_location (
         location_id, report_id, latitude, longitude, address, neighborhood_id, locality
       ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'Montería')`,
      [reportId, input.lat, input.lng, input.address.trim(), neighborhoodId],
    );

    const caseRow = await client.query<{ case_id: string }>(
      `INSERT INTO case_mgmt.case_management (case_id, report_id, current_status)
       VALUES (gen_random_uuid(), $1, 'RECIBIDO')
       RETURNING case_id`,
      [reportId],
    );
    await client.query(
      `INSERT INTO case_mgmt.case_history (history_id, case_id, previous_status, new_status, description, changed_by)
       VALUES (gen_random_uuid(), $1, NULL, 'RECIBIDO', 'Caso recibido', 'sistema')`,
      [caseRow.rows[0]?.case_id],
    );

    await client.query(
      `INSERT INTO citizen.citizen_consent (consent_id, citizen_id, consent_type, accepted, policy_version, source)
       SELECT gen_random_uuid(), $1, 'PUBLICACION_REPORTE', TRUE, '2026-09', 'WEB'
       WHERE NOT EXISTS (
         SELECT 1 FROM citizen.citizen_consent
         WHERE citizen_id = $1 AND consent_type = 'PUBLICACION_REPORTE' AND accepted = TRUE
       )`,
      [citizenId],
    );

    await client.query(
      `INSERT INTO participation.wall_post (
         post_id, citizen_id, kind, title, body, category_slug, barrio, ref_type, ref_id, reference
       ) VALUES (
         gen_random_uuid(), $1, 'REPORTE', $2, $3, $4, NULLIF($5, ''), 'REPORT', $6, $7
       )
       ON CONFLICT (ref_id) WHERE kind = 'REPORTE' AND ref_id IS NOT NULL DO NOTHING`,
      [
        citizenId,
        input.title.trim().slice(0, 180),
        input.description.trim().slice(0, 2000),
        input.category,
        barrio,
        reportId,
        caseNumber,
      ],
    );

    await client.query("COMMIT");
    return caseNumber;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function supportReport(caseNumber: string, citizenId: string) {
  const report = await getReport(caseNumber);
  if (!report) return null;
  await db().query(
    `INSERT INTO participation.participation (participation_id, citizen_id, target_type, target_id, participation_type)
     VALUES (gen_random_uuid(), $1, 'REPORT', $2, 'APOYO')
     ON CONFLICT (citizen_id, target_type, target_id, participation_type) DO NOTHING`,
    [citizenId, report.report_id],
  );
  await db().query(
    `INSERT INTO participation.wall_post (
       post_id, citizen_id, kind, title, body, category_slug, barrio, ref_type, ref_id, reference
     ) VALUES (
       gen_random_uuid(), $1, 'APOYO', $2, $3, $4, $5, 'REPORT', $6, $7
     )
     ON CONFLICT (citizen_id, ref_type, ref_id) WHERE kind = 'APOYO' AND ref_id IS NOT NULL DO NOTHING`,
    [
      citizenId,
      (report.title ?? "Reporte ciudadano").slice(0, 180),
      `Apoyó el reporte ${report.case_number}.`,
      report.category,
      report.barrio,
      report.report_id,
      report.case_number,
    ],
  );
  return getReport(caseNumber);
}

export function viewerFrom(requestToken: ReturnType<typeof readToken>) {
  return requestToken?.sub ?? null;
}
