import "server-only";

import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { demoCalls, demoFanmade, demoLetters, demoMemories, demoPending } from "@/lib/demo-data";
import { guidePeopleCatalog, seedArtistProfiles, seedEpisodes, seedGlossary } from "@/lib/guide-catalog";
import type { SubmissionInput } from "@/lib/validation";
import type {
  GuideContent,
  GuideEpisode,
  GuideGlossaryTerm,
  PublicSubmission,
  SubmissionStatusValue,
  SubmissionTypeValue,
} from "@/lib/types";
import { normalizeSubmissionMedia } from "@/lib/utils";
import { hashSubmissionTrackingToken } from "@/lib/submission-token";

export type LocalGuideMutation =
  | { action: "UPSERT_ARTIST"; slug: string; role?: string | null; content: string; imageUrl?: string | null }
  | { action: "DELETE_ARTIST"; slug: string }
  | { action: "CREATE_GLOSSARY"; term: string; definition: string }
  | { action: "UPDATE_GLOSSARY"; id: string; term: string; definition: string }
  | { action: "DELETE_GLOSSARY"; id: string }
  | { action: "CREATE_EPISODE"; episodeNumber: number; title: string; description?: string | null; imageUrl: string; youtubeUrl: string }
  | { action: "UPDATE_EPISODE"; id: string; episodeNumber: number; title: string; description?: string | null; imageUrl: string; youtubeUrl: string }
  | { action: "DELETE_EPISODE"; id: string };

type SubmissionRow = {
  id: string;
  type: SubmissionTypeValue;
  author_name: string;
  target_id: string | null;
  title: string | null;
  content: string;
  media_url: string | null;
  media_type: "IMAGE" | "VIDEO" | null;
  media_items: string | null;
  proof_url: string | null;
  proof_file_name: string | null;
  tracking_token_hash: string | null;
  status: SubmissionStatusValue;
  admin_note: string | null;
  likes_count: number;
  created_at: string;
};

type ArtistProfileRow = { artist_slug: string; role: string | null; image_url: string | null; content: string };
type GlossaryRow = { id: string; term: string; definition: string; sort_order: number };
type EpisodeRow = { id: string; episode_number: number; title: string; description: string | null; image_url: string; youtube_url: string };

const globalLocalDatabase = globalThis as unknown as { atvncgLocalDatabase?: DatabaseSync };

function seedLocalDatabase(database: DatabaseSync) {
  const now = new Date().toISOString();
  const submissionCount = database.prepare("SELECT COUNT(*) AS total FROM submission").get() as { total: number };
  if (submissionCount.total === 0) {
    const insert = database.prepare(`
      INSERT INTO submission (id, type, author_name, target_id, title, content, media_url, media_type, status, admin_note, likes_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const publicSeeds = [...demoLetters, ...demoMemories, ...demoFanmade, ...demoCalls];
    for (const item of publicSeeds) {
      insert.run(item.id, item.type, item.authorName, item.targetId, item.title, item.content, item.mediaUrl, item.mediaType, "APPROVED", null, item.likesCount, item.createdAt, now);
    }
    for (const item of demoPending) {
      insert.run(item.id, item.type, item.authorName, item.targetId, item.title, item.content, item.mediaUrl, item.mediaType, item.status || "PENDING", item.adminNote || null, item.likesCount, item.createdAt, now);
    }
  }

  const insertProfile = database.prepare(`
    INSERT OR IGNORE INTO artist_guide (id, artist_slug, role, image_url, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const [slug, profile] of Object.entries(seedArtistProfiles)) {
    insertProfile.run(`seed-guide-${slug}`, slug, profile.role, profile.imageUrl, profile.content, now, now);
  }

  const insertGlossary = database.prepare(`
    INSERT OR IGNORE INTO glossary_term (id, term, definition, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const item of seedGlossary) insertGlossary.run(item.id, item.term, item.definition, item.sortOrder, now, now);

  const insertEpisode = database.prepare(`
    INSERT OR IGNORE INTO episode_guide (id, episode_number, title, description, image_url, youtube_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const item of seedEpisodes) {
    insertEpisode.run(item.id, item.episodeNumber, item.title, item.description, item.imageUrl, item.youtubeUrl, now, now);
  }
}

function getLocalDatabase() {
  if (globalLocalDatabase.atvncgLocalDatabase) return globalLocalDatabase.atvncgLocalDatabase;

  const dataDirectory = path.join(process.cwd(), "data");
  mkdirSync(dataDirectory, { recursive: true });
  const created = new DatabaseSync(path.join(dataDirectory, "atvncg-local.sqlite"));
  created.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS submission (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      author_name TEXT NOT NULL,
      target_id TEXT,
      title TEXT,
      content TEXT NOT NULL,
      media_url TEXT,
      media_type TEXT,
      media_items TEXT,
      proof_url TEXT,
      proof_file_name TEXT,
      tracking_token_hash TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      admin_note TEXT,
      likes_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS submission_status_type_created_idx ON submission(status, type, created_at);
    CREATE INDEX IF NOT EXISTS submission_target_idx ON submission(target_id);

    CREATE TABLE IF NOT EXISTS artist_guide (
      id TEXT PRIMARY KEY,
      artist_slug TEXT NOT NULL UNIQUE,
      role TEXT,
      image_url TEXT,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS glossary_term (
      id TEXT PRIMARY KEY,
      term TEXT NOT NULL UNIQUE,
      definition TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS episode_guide (
      id TEXT PRIMARY KEY,
      episode_number INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      youtube_url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  const submissionColumns = created.prepare("PRAGMA table_info(submission)").all() as unknown as { name: string }[];
  if (!submissionColumns.some((column) => column.name === "proof_url")) {
    created.exec("ALTER TABLE submission ADD COLUMN proof_url TEXT");
  }
  if (!submissionColumns.some((column) => column.name === "proof_file_name")) {
    created.exec("ALTER TABLE submission ADD COLUMN proof_file_name TEXT");
  }
  if (!submissionColumns.some((column) => column.name === "media_items")) {
    created.exec("ALTER TABLE submission ADD COLUMN media_items TEXT");
  }
  if (!submissionColumns.some((column) => column.name === "tracking_token_hash")) {
    created.exec("ALTER TABLE submission ADD COLUMN tracking_token_hash TEXT");
  }
  created.exec("CREATE UNIQUE INDEX IF NOT EXISTS submission_tracking_token_hash_idx ON submission(tracking_token_hash)");
  seedLocalDatabase(created);
  globalLocalDatabase.atvncgLocalDatabase = created;
  return created;
}

const database = new Proxy({} as DatabaseSync, {
  get(_target, property) {
    const instance = getLocalDatabase();
    const value = Reflect.get(instance, property);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

function mapSubmission(row: SubmissionRow, includePrivate = true): PublicSubmission {
  let storedMedia: unknown = null;
  try {
    storedMedia = row.media_items ? JSON.parse(row.media_items) : null;
  } catch {
    storedMedia = null;
  }
  return {
    id: row.id,
    type: row.type,
    authorName: row.author_name,
    targetId: row.target_id,
    title: row.title,
    content: row.content,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    mediaItems: normalizeSubmissionMedia(storedMedia, row.media_url, row.media_type),
    ...(includePrivate ? {
      proofUrl: row.proof_url,
      proofFileName: row.proof_file_name,
      status: row.status,
      adminNote: row.admin_note,
    } : {}),
    likesCount: row.likes_count,
    createdAt: row.created_at,
  };
}

export function localListPublicSubmissions(type?: SubmissionTypeValue, target?: string) {
  const conditions = ["status = 'APPROVED'"];
  const values: string[] = [];
  if (type) { conditions.push("type = ?"); values.push(type); }
  if (target && target !== "ALL") { conditions.push("target_id = ?"); values.push(target); }
  const rows = database.prepare(`SELECT * FROM submission WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC LIMIT 100`).all(...values) as unknown as SubmissionRow[];
  return rows.map((row) => mapSubmission(row, false));
}

export function localListAdminSubmissions() {
  const rows = database.prepare("SELECT * FROM submission ORDER BY status ASC, created_at DESC LIMIT 200").all() as unknown as SubmissionRow[];
  return rows.map((row) => mapSubmission(row));
}

export function localCreateSubmission(input: SubmissionInput, trackingToken: string) {
  const id = randomUUID();
  const now = new Date().toISOString();
  const trackingTokenHash = hashSubmissionTrackingToken(trackingToken);
  const mediaItems = input.mediaItems.length > 0
    ? input.mediaItems
    : input.mediaUrl && input.mediaType
      ? [{ url: input.mediaUrl, type: input.mediaType }]
      : [];
  const firstMedia = mediaItems[0];
  database.prepare(`
    INSERT INTO submission (id, type, author_name, target_id, title, content, media_url, media_type, media_items, proof_url, proof_file_name, tracking_token_hash, status, admin_note, likes_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NULL, 0, ?, ?)
  `).run(id, input.type, input.authorName, input.targetId || null, input.title || null, input.content, firstMedia?.url || null, firstMedia?.type || null, JSON.stringify(mediaItems), input.proofUrl || null, input.proofFileName || null, trackingTokenHash, now, now);
  return mapSubmission(database.prepare("SELECT * FROM submission WHERE id = ?").get(id) as unknown as SubmissionRow);
}

export function localGetSubmissionStatus(trackingTokenHash: string) {
  const row = database.prepare(`
    SELECT id, type, title, status, admin_note, created_at, updated_at
    FROM submission
    WHERE tracking_token_hash = ?
  `).get(trackingTokenHash) as { id: string; type: SubmissionTypeValue; title: string | null; status: SubmissionStatusValue; admin_note: string | null; created_at: string; updated_at: string } | undefined;
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    status: row.status,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function localModerateSubmission(id: string, status: "APPROVED" | "REJECTED", adminNote: string | null) {
  const result = database.prepare("UPDATE submission SET status = ?, admin_note = ?, updated_at = ? WHERE id = ?").run(status, adminNote, new Date().toISOString(), id);
  if (!result.changes) return null;
  return mapSubmission(database.prepare("SELECT * FROM submission WHERE id = ?").get(id) as unknown as SubmissionRow);
}

export function localDeleteSubmission(id: string) {
  return database.prepare("DELETE FROM submission WHERE id = ?").run(id).changes > 0;
}

export function localFireSubmission(id: string) {
  const result = database.prepare("UPDATE submission SET likes_count = likes_count + 1, updated_at = ? WHERE id = ? AND status = 'APPROVED'").run(new Date().toISOString(), id);
  if (!result.changes) return null;
  return database.prepare("SELECT likes_count AS likesCount FROM submission WHERE id = ?").get(id) as { likesCount: number };
}

export function localGetGuideContent(): GuideContent {
  const profileRows = database.prepare("SELECT artist_slug, role, image_url, content FROM artist_guide").all() as unknown as ArtistProfileRow[];
  const profiles = new Map(profileRows.map((item) => [item.artist_slug, item]));
  const glossaryRows = database.prepare("SELECT id, term, definition, sort_order FROM glossary_term ORDER BY sort_order ASC, term ASC").all() as unknown as GlossaryRow[];
  const episodeRows = database.prepare("SELECT id, episode_number, title, description, image_url, youtube_url FROM episode_guide ORDER BY episode_number ASC").all() as unknown as EpisodeRow[];
  return {
    artists: guidePeopleCatalog.map((artist) => {
      const profile = profiles.get(artist.slug);
      return {
        ...artist,
        imageUrl: profile?.image_url || artist.imageUrl,
        role: profile?.role || artist.defaultRole || null,
        content: profile?.content || null,
        hasProfile: Boolean(profile?.content),
      };
    }),
    glossary: glossaryRows.map((item): GuideGlossaryTerm => ({ id: item.id, term: item.term, definition: item.definition, sortOrder: item.sort_order })),
    episodes: episodeRows.map((item): GuideEpisode => ({ id: item.id, episodeNumber: item.episode_number, title: item.title, description: item.description, imageUrl: item.image_url, youtubeUrl: item.youtube_url })),
    storage: "sqlite",
  };
}

export function localMutateGuideContent(input: LocalGuideMutation) {
  const now = new Date().toISOString();
  if (input.action === "UPSERT_ARTIST") {
    database.prepare(`
      INSERT INTO artist_guide (id, artist_slug, role, image_url, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(artist_slug) DO UPDATE SET role = excluded.role, image_url = excluded.image_url, content = excluded.content, updated_at = excluded.updated_at
    `).run(randomUUID(), input.slug, input.role || null, input.imageUrl || null, input.content, now, now);
  }
  if (input.action === "DELETE_ARTIST") database.prepare("DELETE FROM artist_guide WHERE artist_slug = ?").run(input.slug);
  if (input.action === "CREATE_GLOSSARY") {
    const row = database.prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM glossary_term").get() as { next_order: number };
    database.prepare("INSERT INTO glossary_term (id, term, definition, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").run(randomUUID(), input.term, input.definition, row.next_order, now, now);
  }
  if (input.action === "UPDATE_GLOSSARY") database.prepare("UPDATE glossary_term SET term = ?, definition = ?, updated_at = ? WHERE id = ?").run(input.term, input.definition, now, input.id);
  if (input.action === "DELETE_GLOSSARY") database.prepare("DELETE FROM glossary_term WHERE id = ?").run(input.id);
  if (input.action === "CREATE_EPISODE") database.prepare("INSERT INTO episode_guide (id, episode_number, title, description, image_url, youtube_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(randomUUID(), input.episodeNumber, input.title, input.description || null, input.imageUrl, input.youtubeUrl, now, now);
  if (input.action === "UPDATE_EPISODE") database.prepare("UPDATE episode_guide SET episode_number = ?, title = ?, description = ?, image_url = ?, youtube_url = ?, updated_at = ? WHERE id = ?").run(input.episodeNumber, input.title, input.description || null, input.imageUrl, input.youtubeUrl, now, input.id);
  if (input.action === "DELETE_EPISODE") database.prepare("DELETE FROM episode_guide WHERE id = ?").run(input.id);
  return localGetGuideContent();
}
