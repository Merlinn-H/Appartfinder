/**
 * Service de scraping des annonces immobilières.
 *
 * NOTE : Le scraping direct de LeBonCoin, SeLoger et PAP est techniquement
 * complexe car ces sites utilisent des protections anti-bot avancées (Cloudflare,
 * captcha, JS rendering). Ce module fournit une structure prête à l'emploi avec
 * des fallbacks gracieux sur les données de démonstration.
 *
 * Pour activer le scraping réel : configurer un proxy résidentiel et
 * décommenter les méthodes Playwright ci-dessous.
 */

import { Annonce } from '../types';
import { generateMockAnnonces } from '../data/mockData';

export interface ScrapingResult {
  annonces: Annonce[];
  source: string;
  success: boolean;
  error?: string;
}

// ─── LeBonCoin ────────────────────────────────────────────────────────────────

export async function scraperLeBonCoin(): Promise<ScrapingResult> {
  // TODO : implémentation réelle avec Playwright
  // const browser = await chromium.launch({ headless: true });
  // const page = await browser.newPage();
  // await page.goto('https://www.leboncoin.fr/recherche?category=10&locations=Lyon_69000...');
  // ...

  console.log('[Scraper] LeBonCoin : utilisation des données de démo');
  return {
    annonces: [],
    source: 'LeBonCoin',
    success: false,
    error: 'Scraping réel non configuré — utilisation des données de démonstration',
  };
}

// ─── SeLoger ──────────────────────────────────────────────────────────────────

export async function scraperSeLoger(): Promise<ScrapingResult> {
  console.log('[Scraper] SeLoger : utilisation des données de démo');
  return {
    annonces: [],
    source: 'SeLoger',
    success: false,
    error: 'Scraping réel non configuré — utilisation des données de démonstration',
  };
}

// ─── PAP ──────────────────────────────────────────────────────────────────────

export async function scraperPAP(): Promise<ScrapingResult> {
  // PAP expose un flux RSS public, plus facile à parser
  // https://www.pap.fr/rss/annonces-immobilieres/location/ile-de-france
  // Pour Lyon : https://www.pap.fr/rss/annonces-immobilieres/location/rhone-alpes
  console.log('[Scraper] PAP : utilisation des données de démo');
  return {
    annonces: [],
    source: 'PAP',
    success: false,
    error: 'Scraping réel non configuré — utilisation des données de démonstration',
  };
}

// ─── Orchestrateur principal ──────────────────────────────────────────────────

export async function rafraichirAnnonces(): Promise<{
  total: number;
  sources: ScrapingResult[];
  utiliseDemoData: boolean;
}> {
  console.log('[Scraper] Démarrage du rafraîchissement des annonces...');

  const resultats = await Promise.allSettled([
    scraperLeBonCoin(),
    scraperSeLoger(),
    scraperPAP(),
  ]);

  const sources: ScrapingResult[] = resultats.map(r =>
    r.status === 'fulfilled' ? r.value : { annonces: [], source: 'Inconnu', success: false, error: String(r.reason) }
  );

  const toutesAnnonces = sources.flatMap(s => s.annonces);
  const toutEchoue = sources.every(s => !s.success);

  // Si toutes les sources échouent, utiliser les données de démo
  if (toutEchoue || toutesAnnonces.length === 0) {
    console.log('[Scraper] Aucune source réelle disponible, chargement des données de démonstration');
    const demoAnnonces = generateMockAnnonces();
    return {
      total: demoAnnonces.length,
      sources,
      utiliseDemoData: true,
    };
  }

  return {
    total: toutesAnnonces.length,
    sources,
    utiliseDemoData: false,
  };
}
