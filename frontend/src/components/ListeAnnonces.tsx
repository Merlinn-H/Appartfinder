import React, { useRef, useEffect } from 'react';
import { Annonce } from '../types';
import { CarteAnnonce } from './CarteAnnonce';
import { useAnnoncesStore } from '../store/annoncesStore';

interface Props {
  annonces: Annonce[];
  onDetail: (annonce: Annonce) => void;
  onContact: (annonce: Annonce) => void;
  loading: boolean;
  error: string | null;
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200 dark:bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="flex justify-end gap-2">
          <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ListeAnnonces({ annonces, onDetail, onContact, loading, error }: Props) {
  const { annonceSelectionnee, selectionnerAnnonce } = useAnnoncesStore();
  const carteRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll automatique vers l'annonce sélectionnée
  useEffect(() => {
    if (annonceSelectionnee) {
      const el = carteRefs.current.get(annonceSelectionnee);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [annonceSelectionnee]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Vérifiez que le serveur backend est démarré sur le port 3001.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        : annonces.length === 0
          ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p>Aucune annonce ne correspond à vos critères.</p>
                <p className="text-sm mt-1">Essayez d'élargir vos filtres.</p>
              </div>
            </div>
          )
          : annonces.map((annonce) => (
            <div
              key={annonce.id}
              ref={(el) => {
                if (el) carteRefs.current.set(annonce.id, el);
                else carteRefs.current.delete(annonce.id);
              }}
            >
              <CarteAnnonce
                annonce={annonce}
                selectionnee={annonceSelectionnee === annonce.id}
                onSelect={selectionnerAnnonce}
                onDetail={onDetail}
                onContact={onContact}
              />
            </div>
          ))
      }
    </div>
  );
}
