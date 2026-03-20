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

// Routes
app.use('/api/annonces', annoncesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialisation : charger les données de démo si la DB est vide
async function initData(): Promise<void> {
  getDb(); // initialise le schéma
  const count = countAnnonces();

  if (count === 0) {
    console.log('[Init] Base de données vide, chargement des 50 annonces de démonstration...');
    const annonces = generateMockAnnonces();
    for (const annonce of annonces) {
      upsertAnnonce(annonce);
    }
    console.log(`[Init] ${annonces.length} annonces chargées.`);
  } else {
    console.log(`[Init] ${count} annonces déjà en base.`);
  }
}

// Cron job : rafraîchissement toutes les 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('[Cron] Rafraîchissement automatique des annonces...');
  try {
    const { rafraichirAnnonces } = await import('./services/scraper');
    await rafraichirAnnonces();
    console.log('[Cron] Rafraîchissement terminé.');
  } catch (err) {
    console.error('[Cron] Erreur lors du rafraîchissement:', err);
  }
});

// Démarrage
initData().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🏠 Appartfinder Backend démarré sur http://localhost:${PORT}`);
    console.log(`   API : http://localhost:${PORT}/api/annonces`);
    console.log(`   Rafraîchissement auto : toutes les 30 minutes\n`);
  });
}).catch(console.error);
