import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'appartfinder-favoris';

export function useFavoris() {
  const [favoris, setFavoris] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoris));
  }, [favoris]);

  const toggleFavori = useCallback((id: string) => {
    setFavoris((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const estFavori = useCallback((id: string) => favoris.includes(id), [favoris]);

  return { favoris, toggleFavori, estFavori };
}
