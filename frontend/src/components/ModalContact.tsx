import React, { useState, useEffect } from 'react';
import { Annonce } from '../types';
import { genererBrouillon, genererLienMailto } from '../services/emailTemplate';

interface Props {
  annonce: Annonce | null;
  onFermer: () => void;
  nomUtilisateur: string;
}

export function ModalContact({ annonce, onFermer, nomUtilisateur }: Props) {
  const [objet, setObjet] = useState('');
  const [corps, setCorps] = useState('');
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    if (!annonce) return;
    const brouillon = genererBrouillon(annonce, nomUtilisateur);
    setObjet(brouillon.objet);
    setCorps(brouillon.corps);
    setCopie(false);
  }, [annonce, nomUtilisateur]);

  if (!annonce) return null;

  const lienMailto = genererLienMailto({ destinataire: annonce.contact_email ?? '', objet, corps });

  async function copierMessage() {
    await navigator.clipboard.writeText(`Objet : ${objet}\n\n${corps}`);
    setCopie(true);
    setTimeout(() => setCopie(false), 2500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onFermer}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Contacter le bailleur</h2>
          <button onClick={onFermer} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Annonce résumée */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm">
            <div className="font-medium text-gray-900 dark:text-white">{annonce.titre}</div>
            <div className="text-gray-500 mt-0.5">{annonce.source} · {annonce.prix} €/mois · {annonce.surface} m²</div>
          </div>

          {/* Email destinataire */}
          {annonce.contact_email ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destinataire
              </label>
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2">
                {annonce.contact_email}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-300">
              Pas d'adresse e-mail directe.{' '}
              {annonce.contact_formulaire && (
                <a href={annonce.contact_formulaire} target="_blank" rel="noopener noreferrer" className="underline">
                  Utiliser le formulaire de contact →
                </a>
              )}
            </div>
          )}

          {/* Objet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objet
            </label>
            <input
              type="text"
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lyon-500"
            />
          </div>

          {/* Corps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              value={corps}
              onChange={(e) => setCorps(e.target.value)}
              rows={10}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lyon-500 resize-none font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {annonce.contact_email && (
              <a
                href={lienMailto}
                className="flex-1 text-center py-2.5 bg-lyon-800 text-white rounded-lg text-sm font-medium hover:bg-lyon-900 transition-colors"
              >
                Ouvrir dans mon client mail
              </a>
            )}
            <button
              onClick={copierMessage}
              className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copie ? '✓ Copié !' : 'Copier le message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
