import React from 'react';
import { Annonce, TYPE_LABELS, TYPE_COLORS } from '../types';
import { useFavoris } from '../hooks/useFavoris';

interface Props {
  annonce: Annonce;
  selectionnee?: boolean;
  onSelect: (id: string) => void;
  onDetail: (annonce: Annonce) => void;
  onContact: (annonce: Annonce) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Hier';
  if (diff < 7) return `Il y a ${diff} jours`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function CarteAnnonce({ annonce, selectionnee, onSelect, onDetail, onContact }: Props) {
  const { estFavori, toggleFavori } = useFavoris();
  const favori = estFavori(annonce.id);

  return (
    <article
      onClick={() => onSelect(annonce.id)}
      className={`bg-white dark:bg-gray-800 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
        selectionnee
          ? 'border-lyon-500 shadow-md ring-2 ring-lyon-300'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Photo */}
      <div className="relative h-40 rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        {annonce.photos.length > 0 ? (
          <img
            src={annonce.photos[0]}
            alt={annonce.titre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}
        {/* Badge type */}
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[annonce.type]}`}>
          {TYPE_LABELS[annonce.type]}
        </span>
        {/* Source */}
        <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs">
          {annonce.source}
        </span>
        {/* Favori */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavori(annonce.id); }}
          className="absolute bottom-2 right-2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 hover:scale-110 transition-transform"
          title={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <svg
            className={`w-4 h-4 ${favori ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>

      {/* Contenu */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1">
          {annonce.titre}
        </h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{annonce.prix} €</span>
          <span className="text-sm text-gray-500">/mois CC</span>
          {annonce.prix_hc && (
            <span className="text-xs text-gray-400">({annonce.prix_hc} € HC)</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {annonce.surface} m²
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {annonce.nb_pieces} p.
          </span>
          <span className="text-gray-500 truncate">{annonce.quartier}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{formatDate(annonce.date_publication)}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onDetail(annonce); }}
              className="px-2.5 py-1 text-xs font-medium text-lyon-700 dark:text-lyon-400 border border-lyon-300 dark:border-lyon-700 rounded hover:bg-lyon-50 dark:hover:bg-lyon-900/20 transition-colors"
            >
              Détails
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onContact(annonce); }}
              className="px-2.5 py-1 text-xs font-medium bg-lyon-800 text-white rounded hover:bg-lyon-900 transition-colors"
            >
              Contacter
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
