import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { Annonce } from '../types';

const DB_PATH = path.join(process.cwd(), 'appartfinder.db');

let db: Database | null = null;
let SQL: SqlJsStatic | null = null;

// Sauvegarde la DB sur disque (sql.js travaille en mémoire)
function sauvegarder(): void {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export async function getDb(): Promise<Database> {
  if (db) return db;

  SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  initSchema();
  return db;
}

function initSchema(): void {
  db!.run(`
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
      photos TEXT,
      date_publication TEXT NOT NULL,
      type TEXT NOT NULL,
      lien_source TEXT NOT NULL,
      contact_email TEXT,
      contact_formulaire TEXT,
      lat REAL,
      lng REAL,
      source TEXT NOT NULL,
      id_source TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_prix ON annonces(prix);
    CREATE INDEX IF NOT EXISTS idx_date ON annonces(date_publication);
    CREATE INDEX IF NOT EXISTS idx_source ON annonces(source);
  `);
  sauvegarder();
}

export async function upsertAnnonce(annonce: Annonce): Promise<void> {
  const d = await getDb();
  d.run(
    `INSERT INTO annonces (
      id, titre, prix, prix_hc, surface, nb_pieces, quartier, arrondissement,
      adresse_approx, description, photos, date_publication, type, lien_source,
      contact_email, contact_formulaire, lat, lng, source, id_source, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
    ON CONFLICT(id) DO UPDATE SET prix=excluded.prix, photos=excluded.photos, updated_at=datetime('now')`,
    [
      annonce.id, annonce.titre, annonce.prix, annonce.prix_hc ?? null,
      annonce.surface, annonce.nb_pieces, annonce.quartier, annonce.arrondissement ?? null,
      annonce.adresse_approx, annonce.description, JSON.stringify(annonce.photos),
      annonce.date_publication, annonce.type, annonce.lien_source,
      annonce.contact_email ?? null, annonce.contact_formulaire ?? null,
      annonce.lat ?? null, annonce.lng ?? null, annonce.source, annonce.id_source ?? null,
    ]
  );
  sauvegarder();
}

export async function getAllAnnonces(): Promise<Annonce[]> {
  const d = await getDb();
  const result = d.exec('SELECT * FROM annonces ORDER BY date_publication DESC');
  if (!result.length) return [];
  return rowsToAnnonces(result[0]);
}

export async function getAnnonceById(id: string): Promise<Annonce | null> {
  const d = await getDb();
  const result = d.exec('SELECT * FROM annonces WHERE id = ?', [id]);
  if (!result.length || !result[0].values.length) return null;
  return rowsToAnnonces(result[0])[0];
}

export async function countAnnonces(): Promise<number> {
  const d = await getDb();
  const result = d.exec('SELECT COUNT(*) FROM annonces');
  return result[0]?.values[0][0] as number ?? 0;
}

export async function getLastUpdate(): Promise<string | null> {
  const d = await getDb();
  const result = d.exec('SELECT MAX(updated_at) FROM annonces');
  return result[0]?.values[0][0] as string ?? null;
}

function rowsToAnnonces(result: { columns: string[]; values: any[][] }): Annonce[] {
  return result.values.map((row) => {
    const obj: any = {};
    result.columns.forEach((col, i) => { obj[col] = row[i]; });
    obj.photos = JSON.parse(obj.photos || '[]');
    return obj as Annonce;
  });
}
