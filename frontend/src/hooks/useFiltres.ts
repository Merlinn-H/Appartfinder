import { useMemo } from 'react';
import { useAnnoncesStore } from '../store/annoncesStore';
import { useFiltresStore } from '../store/filtresStore';
import { Annonce } from '../types';

function isRecente(dateIso: string, periode: string): boolean {
  const date = new Date(dateIso);
  const maintenant = new Date();
  const diffMs = maintenant.getTime() - date.getTime();
  const diffJours = diffMs / (1000 * 60 * 60 * 24);

  switch (periode) {
    case 'aujourd_hui': return diffJours < 1;
    case '3_jours':    return diffJours <= 3;
    case 'semaine':    return diffJours <= 7;
    default:           return true;
  }
}

export function useAnnoncesFiltrees(): Annonce[] {
  const annonces = useAnnoncesStore((s) => s.annonces);
  const filtres = useFiltresStore();

  return useMemo(() => {
    let liste = annonces.filter((a) => {
      if (a.prix > filtres.budget_max) return false;
      if (a.surface < filtres.surface_min) return false;
      if (a.nb_pieces < filtres.nb_pieces_min) return false;
      if (!filtres.types.includes(a.type)) return false;
      if (filtres.arrondissements.length > 0 && !filtres.arrondissements.includes(a.arrondissement ?? '')) return false;
      if (!filtres.sources.includes(a.source)) return false;
      if (!isRecente(a.date_publication, filtres.periode)) return false;

      if (filtres.recherche.trim()) {
        const q = filtres.recherche.toLowerCase();
        if (!a.titre.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
      }

      return true;
    });

    // Tri
    liste = [...liste].sort((a, b) => {
      switch (filtres.tri) {
        case 'prix_asc':  return a.prix - b.prix;
        case 'prix_desc': return b.prix - a.prix;
        case 'surface':   return b.surface - a.surface;
        case 'date':
        default:          return new Date(b.date_publication).getTime() - new Date(a.date_publication).getTime();
      }
    });

    return liste;
  }, [annonces, filtres]);
}
