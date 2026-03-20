import { create } from 'zustand';
import { Annonce } from '../types';

interface AnnoncesStore {
  annonces: Annonce[];
  loading: boolean;
  error: string | null;
  derniereMaj: string | null;
  annonceSelectionnee: string | null;
  // Actions
  setAnnonces: (annonces: Annonce[], derniereMaj?: string) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  selectionnerAnnonce: (id: string | null) => void;
}

export const useAnnoncesStore = create<AnnoncesStore>((set) => ({
  annonces: [],
  loading: false,
  error: null,
  derniereMaj: null,
  annonceSelectionnee: null,

  setAnnonces: (annonces, derniereMaj) =>
    set({ annonces, derniereMaj: derniereMaj ?? null }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
  selectionnerAnnonce: (id) => set({ annonceSelectionnee: id }),
}));
