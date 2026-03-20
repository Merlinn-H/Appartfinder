import React, { useState } from 'react';
import { Annonce, TYPE_LABELS, TYPE_COLORS } from '../types';
import { useFavoris } from '../hooks/useFavoris';

interface Props {
  annonce: Annonce | null;
  onFermer: () => void;
  onContact: (annonce: Annonce) => void;
}

export function ModalDetail({ annonce, onFermer, onContact }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const { estFavori, toggleFavori } = useFavoris();

  if (!annonce) return null;
  const favori = estFavori(annonce.id);

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onFermer}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Galerie photos */}
        <div className="relative bg-gray-900">
          {annonce.photos.length > 0 ? (
            <>
              <img
                src={annonce.photos[photoIndex]}
                alt={`Photo ${photoIndex + 1}`}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              {annonce.photos.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {annonce.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === photoIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
              {photoIndex > 0 && (
                <button
                  onClick={() => setPhotoIndex(i => i - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >‹</button>
              )}
              {photoIndex < annonce.photos.length - 1 && (
                <button
                  onClick={() => setPhotoIndex(i => i + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >›</button>
              )}
            </>
          ) : (
            <div className="w-full h-48 flex items-center justify-center text-gray-500 rounded-t-xl">
              Pas de photo
            </div>
          )}
          {/* Fermer */}
          <button
            onClick={onFermer}
            className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-5 space-y-4">
          {/* Titre + badges */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[annonce.type]}`}>
                  {TYPE_LABELS[annonce.type]}
                </span>
                <span className="text-xs text-gray-500">{annonce.source}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{annonce.titre}</h2>
            </div>
            <button
              onClick={() => toggleFavori(annonce.id)}
              className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className={`w-6 h-6 ${favori ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>

          {/* Prix + infos clés */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-0.5">Loyer CC</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{annonce.prix} €<span className="text-sm font-normal text-gray-500">/mois</span></div>
              {annonce.prix_hc && (
                <div className="text-sm text-gray-500">{annonce.prix_hc} € HC</div>
              )}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Surface</span>
                <span className="font-medium">{annonce.surface} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pièces</span>
                <span className="font-medium">{annonce.nb_pieces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quartier</span>
                <span className="font-medium">{annonce.quartier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Publié le</span>
                <span className="font-medium">{formatDate(annonce.date_publication)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {annonce.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <a
              href={annonce.lien_source}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Voir l'annonce source →
            </a>
            <button
              onClick={() => onContact(annonce)}
              className="flex-1 py-2.5 bg-lyon-800 text-white rounded-lg text-sm font-medium hover:bg-lyon-900 transition-colors"
            >
              Contacter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
