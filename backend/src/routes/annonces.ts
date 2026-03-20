import { Router, Request, Response } from 'express';
import { getAllAnnonces, getAnnonceById, countAnnonces, getLastUpdate, upsertAnnonce } from '../services/database';
import { generateMockAnnonces } from '../data/mockData';

const router = Router();

// GET /api/annonces
router.get('/', async (_req: Request, res: Response) => {
  try {
    const annonces = await getAllAnnonces();
    const derniereMaj = await getLastUpdate();
    res.json({ annonces, total: annonces.length, derniere_maj: derniereMaj });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
});

// GET /api/annonces/meta/stats
router.get('/meta/stats', async (_req: Request, res: Response) => {
  try {
    res.json({ total: await countAnnonces(), derniere_maj: await getLastUpdate() });
  } catch (err) {
    res.status(500).json({ error: 'Erreur stats' });
  }
});

// POST /api/annonces/refresh
// Body optionnel : { sources: ['LeBonCoin', 'SeLoger', 'PAP'] }
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const sources: string[] | undefined = req.body?.sources;
    const { rafraichirAnnonces } = await import('../services/scraper');
    const resultat = await rafraichirAnnonces(sources);
    if (resultat.utiliseDemoData) {
      const demoAnnonces = generateMockAnnonces();
      for (const a of demoAnnonces) await upsertAnnonce(a);
    }
    res.json({ message: 'Rafraîchissement terminé', ...resultat });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du rafraîchissement' });
  }
});

// GET /api/annonces/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const annonce = await getAnnonceById(req.params.id);
    if (!annonce) { res.status(404).json({ error: 'Annonce introuvable' }); return; }
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'annonce' });
  }
});

export default router;
