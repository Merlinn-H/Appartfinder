import { Router, Request, Response } from 'express';
import { getAllAnnonces, getAnnonceById, countAnnonces, getLastUpdate, upsertAnnonce } from '../services/database';
import { generateMockAnnonces } from '../data/mockData';

const router = Router();

// GET /api/annonces — liste filtrée
router.get('/', (_req: Request, res: Response) => {
  try {
    const annonces = getAllAnnonces();
    const derniereMaj = getLastUpdate();
    res.json({
      annonces,
      total: annonces.length,
      derniere_maj: derniereMaj,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
});

// GET /api/annonces/:id — détail d'une annonce
router.get('/:id', (req: Request, res: Response) => {
  try {
    const annonce = getAnnonceById(req.params.id);
    if (!annonce) {
      res.status(404).json({ error: 'Annonce introuvable' });
      return;
    }
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'annonce' });
  }
});

// POST /api/annonces/refresh — déclenche un rafraîchissement manuel
router.post('/refresh', async (_req: Request, res: Response) => {
  try {
    const { rafraichirAnnonces } = await import('../services/scraper');
    const resultat = await rafraichirAnnonces();

    if (resultat.utiliseDemoData) {
      // Recharger les démos dans la DB
      const demoAnnonces = generateMockAnnonces();
      for (const a of demoAnnonces) {
        upsertAnnonce(a);
      }
    }

    res.json({
      message: 'Rafraîchissement terminé',
      ...resultat,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du rafraîchissement' });
  }
});

// GET /api/annonces/stats
router.get('/meta/stats', (_req: Request, res: Response) => {
  try {
    res.json({
      total: countAnnonces(),
      derniere_maj: getLastUpdate(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur stats' });
  }
});

export default router;
