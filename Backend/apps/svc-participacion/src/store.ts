import { AppError, CATEGORY_SLUGS, createPool } from "@mpm/shared";

const pool = createPool("participation");

export type WallKind = "tema" | "reporte" | "apoyo" | "comentario";

export type WallPost = {
  id: string;
  kind: WallKind;
  title: string;
  body: string;
  category: string | null;
  barrio: string | null;
  author: string;
  createdAt: string;
  supports: number;
  comments: number;
  supportedByMe: boolean;
  mine: boolean;
  reference: string | null;
};

type WallRow = {
  post_id: string;
  kind: string;
  title: string | null;
  body: string;
  category_slug: string | null;
  barrio: string | null;
  author: string;
  created_at: Date;
  citizen_id: string;
  supports: string;
  comments: string;
  supported_by_me: boolean;
  reference: string | null;
};

const SELECT_POST = `
  SELECT
    p.post_id,
    p.kind,
    p.title,
    p.body,
    p.category_slug,
    p.barrio,
    p.citizen_id,
    p.reference,
    p.created_at,
    COALESCE(NULLIF(c.first_name, ''), 'Vecino') AS author,
    (
      SELECT count(*) FROM participation.participation s
      WHERE s.target_type = 'MURO' AND s.target_id = p.post_id AND s.participation_type = 'APOYO'
    )::text AS supports,
    (
      SELECT count(*) FROM participation.wall_post child
      WHERE child.parent_id = p.post_id AND child.kind = 'COMENTARIO'
    )::text AS comments,
    EXISTS (
      SELECT 1 FROM participation.participation mine
      WHERE mine.target_type = 'MURO'
        AND mine.target_id = p.post_id
        AND mine.participation_type = 'APOYO'
        AND mine.citizen_id = $VIEWER
    ) AS supported_by_me
`;

function db() {
  if (!pool) throw new AppError(503, "DB_UNAVAILABLE", "La base de datos no está configurada.");
  return pool;
}

function toPost(row: WallRow, viewerId?: string | null): WallPost {
  return {
    id: row.post_id,
    kind: row.kind.toLowerCase() as WallKind,
    title: row.title ?? "",
    body: row.body,
    category: row.category_slug,
    barrio: row.barrio,
    author: row.author,
    createdAt: row.created_at.toISOString(),
    supports: Number(row.supports),
    comments: Number(row.comments),
    supportedByMe: row.supported_by_me,
    mine: Boolean(viewerId && viewerId === row.citizen_id),
    reference: row.reference,
  };
}

function viewerSql(viewerId?: string | null) {
  return SELECT_POST.replace("$VIEWER", viewerId ? "$1" : "NULL");
}

export async function listWall(viewerId?: string | null, kind?: string) {
  const values: unknown[] = [];
  const where = ["p.parent_id IS NULL"];
  if (viewerId) values.push(viewerId);
  if (kind) {
    values.push(kind.toUpperCase());
    where.push(`p.kind = $${values.length}`);
  }
  const result = await db().query<WallRow>(
    `${viewerSql(viewerId)}
     FROM participation.wall_post p
     JOIN citizen.citizen c ON c.citizen_id = p.citizen_id
     WHERE ${where.join(" AND ")}
     ORDER BY p.created_at DESC
     LIMIT 80`,
    values,
  );
  return result.rows.map((row) => toPost(row, viewerId));
}

export async function listComments(postId: string, viewerId?: string | null) {
  const values: unknown[] = viewerId ? [viewerId, postId] : [postId];
  const result = await db().query<WallRow>(
    `${viewerSql(viewerId)}
     FROM participation.wall_post p
     JOIN citizen.citizen c ON c.citizen_id = p.citizen_id
     WHERE p.parent_id = $${values.length} AND p.kind = 'COMENTARIO'
     ORDER BY p.created_at ASC
     LIMIT 40`,
    values,
  );
  return result.rows.map((row) => toPost(row, viewerId));
}

async function readPost(postId: string, viewerId?: string | null) {
  const values: unknown[] = viewerId ? [viewerId, postId] : [postId];
  const result = await db().query<WallRow>(
    `${viewerSql(viewerId)}
     FROM participation.wall_post p
     JOIN citizen.citizen c ON c.citizen_id = p.citizen_id
     WHERE p.post_id = $${values.length}`,
    values,
  );
  const row = result.rows[0];
  return row ? toPost(row, viewerId) : null;
}

export async function publishTopic(
  citizenId: string,
  input: { title: string; body: string; category?: string; barrio?: string },
) {
  const title = input.title.trim();
  const body = input.body.trim();
  if (title.length < 8) {
    throw new AppError(422, "INVALID_POST", "El tema necesita un título de al menos 8 caracteres.");
  }
  if (body.length < 10) {
    throw new AppError(422, "INVALID_POST", "Cuéntanos un poco más en el mensaje.");
  }
  const category = input.category?.trim() || null;
  if (category && !(category in CATEGORY_SLUGS)) {
    throw new AppError(422, "INVALID_CATEGORY", "Esa temática no está disponible.");
  }
  const inserted = await db().query<{ post_id: string }>(
    `INSERT INTO participation.wall_post (
       post_id, citizen_id, kind, title, body, category_slug, barrio
     ) VALUES (
       gen_random_uuid(), $1, 'TEMA', $2, $3, $4, NULLIF($5, '')
     ) RETURNING post_id`,
    [citizenId, title.slice(0, 180), body.slice(0, 2000), category, input.barrio?.trim() ?? ""],
  );
  const id = inserted.rows[0]?.post_id;
  if (!id) throw new AppError(500, "INTERNAL", "No se pudo publicar en el muro.");
  const post = await readPost(id, citizenId);
  if (!post) throw new AppError(500, "INTERNAL", "La publicación se guardó, pero no se pudo leer.");
  return post;
}

export async function supportPost(postId: string, citizenId: string) {
  const current = await db().query<{
    post_id: string;
    kind: string;
    title: string | null;
    category_slug: string | null;
    barrio: string | null;
    reference: string | null;
  }>(
    `SELECT post_id, kind, title, category_slug, barrio, reference
     FROM participation.wall_post WHERE post_id = $1 AND parent_id IS NULL`,
    [postId],
  );
  const post = current.rows[0];
  if (!post) throw new AppError(404, "NOT_FOUND", "No encontramos esa publicación.");
  if (post.kind === "COMENTARIO") {
    throw new AppError(422, "INVALID_SUPPORT", "Los comentarios se responden, no se apoyan.");
  }

  await db().query(
    `INSERT INTO participation.participation (participation_id, citizen_id, target_type, target_id, participation_type)
     VALUES (gen_random_uuid(), $1, 'MURO', $2, 'APOYO')
     ON CONFLICT (citizen_id, target_type, target_id, participation_type) DO NOTHING`,
    [citizenId, postId],
  );

  if (post.kind === "TEMA" || post.kind === "REPORTE") {
    await db().query(
      `INSERT INTO participation.wall_post (
         post_id, citizen_id, kind, title, body, category_slug, barrio, ref_type, ref_id, reference
       ) VALUES (
         gen_random_uuid(), $1, 'APOYO', $2, $3, $4, $5, 'MURO', $6, $7
       )
       ON CONFLICT (citizen_id, ref_type, ref_id) WHERE kind = 'APOYO' AND ref_id IS NOT NULL DO NOTHING`,
      [
        citizenId,
        post.title ?? "Publicación del muro",
        post.kind === "REPORTE" ? "Apoyó este reporte en el muro." : "Apoyó este tema en el muro.",
        post.category_slug,
        post.barrio,
        postId,
        post.reference,
      ],
    );
  }

  const updated = await readPost(postId, citizenId);
  if (!updated) throw new AppError(404, "NOT_FOUND", "No encontramos esa publicación.");
  return updated;
}

export async function commentPost(postId: string, citizenId: string, message: string) {
  const body = message.trim();
  if (body.length < 2) {
    throw new AppError(422, "INVALID_COMMENT", "Escribe un comentario para publicarlo.");
  }
  const parent = await db().query(`SELECT post_id FROM participation.wall_post WHERE post_id = $1 AND parent_id IS NULL`, [postId]);
  if (!parent.rows[0]) throw new AppError(404, "NOT_FOUND", "No encontramos esa publicación.");

  const inserted = await db().query<{ post_id: string }>(
    `INSERT INTO participation.wall_post (post_id, citizen_id, kind, body, parent_id)
     VALUES (gen_random_uuid(), $1, 'COMENTARIO', $2, $3)
     RETURNING post_id`,
    [citizenId, body.slice(0, 800), postId],
  );
  const id = inserted.rows[0]?.post_id;
  if (!id) throw new AppError(500, "INTERNAL", "No se pudo publicar el comentario.");
  const comment = await readPost(id, citizenId);
  if (!comment) throw new AppError(500, "INTERNAL", "El comentario se guardó, pero no se pudo leer.");
  return comment;
}
