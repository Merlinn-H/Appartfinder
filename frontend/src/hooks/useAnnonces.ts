import { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAnnoncesStore } from '../store/annoncesStore';
import { Annonce } from '../types';

const API_URL = '/api/annonces';

export function useAnnonces() {
  const { setAnnonces, setLoading, setError } = useAnnoncesStore();

  const charger = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ annonces: Annonce[]; derniere_maj: string }>(API_URL);
      setAnnonces(response.data.annonces, response.data.derniere_maj);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? `Impossible de contacter le serveur : ${err.message}`
        : 'Erreur inconnue';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setAnnonces, setLoading, setError]);

  const rafraichir = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/refresh`);
      await charger();
    } catch (err) {
      setError('Erreur lors du rafraîchissement');
      setLoading(false);
    }
  }, [charger, setLoading, setError]);

  useEffect(() => {
    charger();
  }, [charger]);

  return { charger, rafraichir };
}
