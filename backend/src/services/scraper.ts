/**
 * Service de scraping des annonces immobilières.
 *
 * NOTE : Le scraping direct de ces sites est complexe (protections anti-bot,
 * Cloudflare, JS rendering). Ce module fournit une structure prête à l'emploi
 * avec fallback gracieux sur les données de démonstration.
 *
 * Pour activer un scraper réel : implémenter la fonction correspondante avec
 * Playwright et configurer un proxy résidentiel si nécessaire.
 *
 * Sources supportées :
 *   - LeBonCoin  (location + colocation)
 *   - SeLoger    (location, agences + particuliers)
 *   - PAP        (particulier à particulier — flux RSS disponible)
 *   - LogicImmo  (portail agences)
 *   - BienIci    (portail multi-sources)
 *   - ParuVendu  (particuliers)
 *   - Roomlala   (spécialisé colocation / chambre chez l'habitant)
 */

import { Annonce } from '../types';
import { generateMockAnnonces } from '../data/mockData';

export interface ScrapingResult {
  annonces: Annonce[];
  source: string;
  success: boolean;
  error?: string;
}

function nonConfigured(source: string): ScrapingResult {
  console.log(`[Scraper] ${source} : scraping non configuré, données de démo utilisées`);
  return { annonces: [], source, success: false, error: 'Scraping non configuré' };
}

// ─── LeBonCoin ────────────────────────────────────────────────────────────────
// URL cible : https://www.leboncoin.fr/recherche?category=10&locations=Lyon_69000__69009
// Protection : Cloudflare + fingerprint JS → nécessite proxy résidentiel + Playwright stealth

export async function scraperLeBonCoin(): Promise<ScrapingResult> {
  // TODO :
  // const browser = await chromium.launch({ headless: true });
  // const page = await browser.newPage();
  // await page.goto('https://www.leboncoin.fr/recherche?...');
  // const items = await page.$$eval('[data-test-id="ad"]', els => els.map(...));
  return nonConfigured('LeBonCoin');
}

// ─── SeLoger ──────────────────────────────────────────────────────────────────
// URL cible : https://www.seloger.com/list.htm?types=1,2&projects=1&places=[{cp:69001}]
// Protection : token CSRF + requêtes GraphQL internes

export async function scraperSeLoger(): Promise<ScrapingResult> {
  // TODO :
  // const response = await axios.get('https://www.seloger.com/list.htm?...');
  // Parser le HTML avec node-html-parser
  return nonConfigured('SeLoger');
}

// ─── PAP ──────────────────────────────────────────────────────────────────────
// PAP expose un flux RSS public (le plus simple à implémenter) :
// https://www.pap.fr/rss/annonces-immobilieres/location/rhone-alpes
// Pas de protection anti-bot sur le flux RSS.

export async function scraperPAP(): Promise<ScrapingResult> {
  // TODO :
  // const response = await axios.get('https://www.pap.fr/rss/annonces-immobilieres/location/rhone-alpes');
  // Parser le XML RSS avec une lib comme fast-xml-parser
  return nonConfigured('PAP');
}

// ─── Logic-Immo ───────────────────────────────────────────────────────────────
// URL cible : https://www.logic-immo.com/location-immobilier-lyon-69,1_0/
// Agrégateur d'agences immobilières. HTML classique, relativement accessible.

export async function scraperLogicImmo(): Promise<ScrapingResult> {
  // TODO :
  // const response = await axios.get('https://www.logic-immo.com/location-immobilier-lyon-69,1_0/');
  // const root = parse(response.data);
  // const annonces = root.querySelectorAll('.offer-card').map(card => ({ ... }));
  return nonConfigured('LogicImmo');
}

// ─── Bien'ici ─────────────────────────────────────────────────────────────────
// URL cible : https://www.bienici.com/recherche/location/lyon-69000?
// Utilise une API JSON interne non documentée (requêtes XHR) — inspectable dans DevTools.

export async function scraperBienIci(): Promise<ScrapingResult> {
  // TODO :
  // const response = await axios.get('https://www.bienici.com/realEstateAds.json?filters=...', { headers: { Referer: '...' } });
  // const annonces = response.data.realEstateAds.map(ad => ({ ... }));
  return nonConfigured('BienIci');
}

// ─── ParuVendu ────────────────────────────────────────────────────────────────
// URL cible : https://www.paruvendu.fr/immobilier/location/appartement/lyon+69/
// Site HTML classique, particuliers uniquement, peu de protection.

export async function scraperParuVendu(): Promise<ScrapingResult> {
  // TODO :
  // const response = await axios.get('https://www.paruvendu.fr/immobilier/location/appartement/lyon+69/');
  // Parser avec node-html-parser
  return nonConfigured('ParuVendu');
}

// ─── Roomlala ─────────────────────────────────────────────────────────────────
// Spécialisé colocation et chambre chez l'habitant.
// URL cible : https://www.roomlala.com/fr/recherche?city=Lyon&type=colocation
// API JSON partiellement publique.

export async function scraperRoomlala(): Promise<ScrapingResult> {
  // TODO :
  // const response = await axios.get('https://www.roomlala.com/api/rooms?city=Lyon&...');
  // const annonces = response.data.rooms.map(r => ({ type: 'colocation', ... }));
  return nonConfigured('Roomlala');
}

// ─── Registre des scrapers ────────────────────────────────────────────────────

const SCRAPERS: Record<string, () => Promise<ScrapingResult>> = {
  LeBonCoin:  scraperLeBonCoin,
  SeLoger:    scraperSeLoger,
  PAP:        scraperPAP,
  LogicImmo:  scraperLogicImmo,
  BienIci:    scraperBienIci,
  ParuVendu:  scraperParuVendu,
  Roomlala:   scraperRoomlala,
};

export const SOURCES_SUPPORTEES = Object.keys(SCRAPERS);

// ─── Orchestrateur principal ──────────────────────────────────────────────────

export async function rafraichirAnnonces(sourcesActives?: string[]): Promise<{
  total: number;
  sources: ScrapingResult[];
  utiliseDemoData: boolean;
}> {
  const actives = (sourcesActives ?? SOURCES_SUPPORTEES).filter(s => s in SCRAPERS);
  console.log(`[Scraper] Rafraîchissement — sources : ${actives.join(', ')}`);

  const taches = actives.map(s => SCRAPERS[s]());
  const resultats = await Promise.allSettled(taches);

  const sources: ScrapingResult[] = resultats.map(r =>
    r.status === 'fulfilled' ? r.value : { annonces: [], source: 'Inconnu', success: false, error: String(r.reason) }
  );

  const toutesAnnonces = sources.flatMap(s => s.annonces);
  const toutEchoue = sources.every(s => !s.success);

  if (toutEchoue || toutesAnnonces.length === 0) {
    console.log('[Scraper] Aucune source réelle disponible → données de démonstration');
    const demoAnnonces = generateMockAnnonces();
    return { total: demoAnnonces.length, sources, utiliseDemoData: true };
  }

  return { total: toutesAnnonces.length, sources, utiliseDemoData: false };
}
