import Database from 'better-sqlite3';
import path from 'path';
import { Annonce } from '../types';

const DB_PATH = path.join(process.cwd(), 'appartfinder.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema();
  }
  return db;
}

function initSchema(): void {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS annonces (
      id TEXT PRIMARY KEY,
      titre TEXT NOT NULL,
      prix INTEGER NOT NULL,
      prix_hc INTEGER,
      surface INTEGER NOT NULL,
      nb_pieces INTEGER NOT NULL,
      quartier TEXT NOT NULL,
      arrondissement TEXT,
      adresse_approx TEXT,
      description TEXT,
      photos TEXT,          -- JSON array of URLs
      date_publication TEXT NOT NULL,
      type TEXT NOT NULL,
      lien_source TEXT NOT NULL,
      contact_email TEXT,
      contact_formulaire TEXT,
      lat REAL,
      lng REAL,
      source TEXT NOT NULL,
      id_source TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_annonces_source ON annonces(source);
    CREATE INDEX IF NOT EXISTS idx_annonces_type ON annonces(type);
    CREATE INDEX IF NOT EXISTS idx_annonces_prix ON annonces(prix);
    CREATE INDEX IF NOT EXISTS idx_annonces_date ON annonces(date_publication);
  `);
}

export function upsertAnnonce(annonce: Annonce): void {
  const stmt = getDb().prepare(`
    INSERT INTO annonces (
      id, titre, prix, prix_hc, surface, nb_pieces, quartier, arrondissement,
      adresse_approx, description, photos, date_publication, type, lien_source,
      contact_email, contact_formulaire, lat, lng, source, id_source, updated_at
    ) VALUES (
      @id, @titre, @prix, @prix_hc, @surface, @nb_pieces, @quartier, @arrondissement,
      @adresse_approx, @description, @photos, @date_publication, @type, @lien_source,
      @contact_email, @contact_formulaire, @lat, @lng, @source, @id_source, datetime('now')
    )
    ON CONFLICT(id) DO UPDATE SET
      prix = excluded.prix,
      photos = excluded.photos,
      updated_at = datetime('now')
  `);

  stmt.run({
    ...annonce,
    photos: JSON.stringify(annonce.photos),
  });
}

export function getAllAnnonces(): Annonce[] {
  const rows = getDb().prepare('SELECT * FROM annonces ORDER BY date_publication DESC').all() as any[];
  return rows.map(rowToAnnonce);
}

export function getAnnonceById(id: string): Annonce | null {
  const row = getDb().prepare('SELECT * FROM annonces WHERE id = ?').get(id) as any;
  return row ? rowToAnnonce(row) : null;
}

export function countAnnonces(): number {
  const result = getDb().prepare('SELECT COUNT(*) as count FROM annonces').get() as { count: number };
  return result.count;
}

export function getLastUpdate(): string | null {
  const result = getDb().prepare('SELECT MAX(updated_at) as last FROM annonces').get() as { last: string | null };
  return result.last;
}

function rowToAnnonce(row: any): Annonce {
  return {
    ...row,
    photos: JSON.parse(row.photos || '[]'),
  };
}
