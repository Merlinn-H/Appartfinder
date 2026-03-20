import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Filtres, TypeBien, SourceAnnonce } from '../types';

const FILTRES_DEFAUT: Filtres = {
  budget_max: 3000,
  surface_min: 10,
  nb_pieces_min: 1,
  types: ['location_vide', 'meublee', 'colocation'],
  arrondissements: [],
  sources: ['LeBonCoin', 'SeLoger', 'PAP', 'LogicImmo', 'BienIci', 'ParuVendu', 'Roomlala', 'Demo'],
  periode: 'tout',
  tri: 'date',
  recherche: '',
  zone_carte_active: false,
};

interface FiltresStore extends Filtres {
  setBudgetMax: (v: number) => void;
  setSurfaceMin: (v: number) => void;
  setNbPiecesMin: (v: number) => void;
  toggleType: (t: TypeBien) => void;
  toggleArrondissement: (a: string) => void;
  toggleSource: (s: SourceAnnonce) => void;
  setPeriode: (p: Filtres['periode']) => void;
  setTri: (t: Filtres['tri']) => void;
  setRecherche: (r: string) => void;
  setZoneCarteActive: (v: boolean) => void;
  reinitialiser: () => void;
}

export const useFiltresStore = create<FiltresStore>()(
  persist(
    (set) => ({
      ...FILTRES_DEFAUT,

      setBudgetMax: (v) => set({ budget_max: v }),
      setSurfaceMin: (v) => set({ surface_min: v }),
      setNbPiecesMin: (v) => set({ nb_pieces_min: v }),

      toggleType: (t) =>
        set((s) => ({
          types: s.types.includes(t)
            ? s.types.filter((x) => x !== t)
            : [...s.types, t],
        })),

      toggleArrondissement: (a) =>
        set((s) => ({
          arrondissements: s.arrondissements.includes(a)
            ? s.arrondissements.filter((x) => x !== a)
            : [...s.arrondissements, a],
        })),

      toggleSource: (src) =>
        set((s) => ({
          sources: s.sources.includes(src)
            ? s.sources.filter((x) => x !== src)
            : [...s.sources, src],
        })),

      setPeriode: (p) => set({ periode: p }),
      setTri: (t) => set({ tri: t }),
      setRecherche: (r) => set({ recherche: r }),
      setZoneCarteActive: (v) => set({ zone_carte_active: v }),
      reinitialiser: () => set(FILTRES_DEFAUT),
    }),
    { name: 'appartfinder-filtres' }
  )
);
