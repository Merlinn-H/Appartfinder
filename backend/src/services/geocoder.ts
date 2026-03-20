import axios from 'axios';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

// Cache simple en mémoire pour éviter les requêtes répétées
const cache = new Map<string, { lat: number; lng: number }>();

export async function geocodeAdresse(adresse: string): Promise<{ lat: number; lng: number } | null> {
  const cacheKey = adresse.toLowerCase().trim();
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const response = await axios.get<NominatimResult[]>(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: adresse,
          format: 'json',
          limit: 1,
          countrycodes: 'fr',
        },
        headers: {
          'User-Agent': 'Appartfinder/1.0 (recherche-logement-lyon)',
        },
        timeout: 5000,
      }
    );

    if (response.data.length > 0) {
      const result = {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
      };
      cache.set(cacheKey, result);
      // Respecter le rate limit Nominatim : 1 requête/seconde
      await new Promise(r => setTimeout(r, 1100));
      return result;
    }
  } catch (err) {
    console.error(`[Geocoder] Erreur pour "${adresse}":`, (err as Error).message);
  }

  return null;
}
