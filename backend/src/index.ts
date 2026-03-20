import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { getDb, upsertAnnonce, countAnnonces } from './services/database';
import { generateMockAnnonces } from './data/mockData';
import annoncesRouter from './routes/annonces';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/annonces', annoncesRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

async function initData(): Promise<void> {
  await getDb(); // initialise le schéma
  const count = await countAnnonces();

  if (count === 0) {
    console.log('[Init] Base vide, chargement des 50 annonces de démonstration...');
    const annonces = generateMockAnnonces();
    for (const annonce of annonces) await upsertAnnonce(annonce);
    console.log(`[Init] ${annonces.length} annonces chargées.`);
  } else {
    console.log(`[Init] ${count} annonces déjà en base.`);
  }
}

// Cron : rafraîchissement toutes les 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('[Cron] Rafraîchissement automatique...');
  try {
    const { rafraichirAnnonces } = await import('./services/scraper');
    await rafraichirAnnonces();
  } catch (err) {
    console.error('[Cron] Erreur:', err);
  }
});

initData().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🏠 Appartfinder Backend → http://localhost:${PORT}`);
    console.log(`   API : http://localhost:${PORT}/api/annonces\n`);
  });
}).catch(console.error);
