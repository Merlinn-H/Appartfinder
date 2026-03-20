import React, { useState, useRef, useEffect } from 'react';
import { useAnnoncesStore } from '../store/annoncesStore';
import { PreferencesUtilisateur } from '../types';
import { useAnnonces } from '../hooks/useAnnonces';

interface Props {
  onglet: 'liste' | 'carte' | 'favoris';
  onOnglet: (o: 'liste' | 'carte' | 'favoris') => void;
  nbFavoris: number;
  preferences: PreferencesUtilisateur;
  onPreferences: (p: PreferencesUtilisateur) => void;
}

const SOURCES_DISPONIBLES = [
  { id: 'LeBonCoin', label: 'LeBonCoin',  icon: '🟠', desc: 'Location + colocation' },
  { id: 'SeLoger',   label: 'SeLoger',    icon: '🔵', desc: 'Agences + particuliers' },
  { id: 'PAP',       label: 'PAP',        icon: '🟢', desc: 'Particulier à particulier' },
  { id: 'LogicImmo', label: 'Logic-Immo', icon: '🟣', desc: 'Portail agences' },
  { id: 'BienIci',   label: "Bien'ici",   icon: '🔴', desc: 'Multi-sources' },
  { id: 'ParuVendu', label: 'ParuVendu',  icon: '🟡', desc: 'Particuliers' },
  { id: 'Roomlala',  label: 'Roomlala',   icon: '🏠', desc: 'Colocation / chambre' },
];

export function Entete({ onglet, onOnglet, nbFavoris, preferences, onPreferences }: Props) {
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefsTemp, setPrefsTemp] = useState(preferences);
  const [showScraper, setShowScraper] = useState(false);
  const [sourcesSelectionnees, setSourcesSelectionnees] = useState<string[]>(
    SOURCES_DISPONIBLES.map(s => s.id)
  );
  const scraperRef = useRef<HTMLDivElement>(null);

  const { loading, derniereMaj } = useAnnoncesStore();
  const { rafraichir } = useAnnonces();

  // Fermer le popover scraper si clic en dehors
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (scraperRef.current && !scraperRef.current.contains(e.target as Node)) {
        setShowScraper(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggleSource(id: string) {
    setSourcesSelectionnees(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  function lancerScraping() {
    setShowScraper(false);
    rafraichir(sourcesSelectionnees.length > 0 ? sourcesSelectionnees : undefined);
  }

  function formatMaj(iso: string | null): string {
    if (!iso) return 'Jamais';
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  function sauvegarderPrefs() {
    onPreferences(prefsTemp);
    setShowPrefs(false);
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-xl text-lyon-800 dark:text-lyon-300">Appartfinder</span>
          <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400 ml-1">– Lyon</span>
        </div>

        {/* Onglets */}
        <nav className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
          {[
            { id: 'liste',   label: 'Liste' },
            { id: 'carte',   label: 'Carte' },
            { id: 'favoris', label: `Favoris${nbFavoris > 0 ? ` (${nbFavoris})` : ''}` },
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => onOnglet(o.id as any)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                onglet === o.id
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {o.label}
            </button>
          ))}
        </nav>

        {/* Contrôles droite */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
            <span>Màj : {formatMaj(derniereMaj)}</span>
          </div>

          {/* Bouton Rafraîchir + popover sélecteur de sources */}
          <div className="relative" ref={scraperRef}>
            <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Bouton principal : lance le scraping */}
              <button
                onClick={lancerScraping}
                disabled={loading || sourcesSelectionnees.length === 0}
                title="Rafraîchir les annonces"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors border-r border-gray-200 dark:border-gray-700"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">
                  {loading ? 'Scraping…' : 'Rafraîchir'}
                </span>
              </button>

              {/* Flèche pour ouvrir le sélecteur */}
              <button
                onClick={() => setShowScraper(v => !v)}
                title="Choisir les sources à scraper"
                className="px-2 py-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className={`w-3.5 h-3.5 transition-transform ${showScraper ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Popover sélecteur de sources */}
            {showScraper && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-3">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Sites à scraper
                </div>
                <div className="space-y-0.5 mb-3">
                  {SOURCES_DISPONIBLES.map((src) => (
                    <label
                      key={src.id}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={sourcesSelectionnees.includes(src.id)}
                        onChange={() => toggleSource(src.id)}
                        className="rounded accent-lyon-700 flex-shrink-0"
                      />
                      <span className="text-sm flex-shrink-0">{src.icon}</span>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight">{src.label}</div>
                        <div className="text-xs text-gray-400 leading-tight">{src.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                  <button
                    onClick={() => setSourcesSelectionnees(SOURCES_DISPONIBLES.map(s => s.id))}
                    className="flex-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Tout
                  </button>
                  <button
                    onClick={() => setSourcesSelectionnees([])}
                    className="flex-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Aucun
                  </button>
                  <button
                    onClick={lancerScraping}
                    disabled={sourcesSelectionnees.length === 0 || loading}
                    className="flex-1 px-2 py-1 text-xs bg-lyon-800 text-white rounded-md hover:bg-lyon-900 disabled:opacity-50 transition-colors"
                  >
                    Lancer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Préférences */}
          <button
            onClick={() => { setPrefsTemp(preferences); setShowPrefs(true); }}
            title="Préférences"
            className="p-2 rounded-lg text-gray-500 hover:text-lyon-700 hover:bg-lyon-50 dark:hover:bg-lyon-900/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Modal préférences */}
      {showPrefs && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowPrefs(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Préférences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Votre nom (pour les e-mails)
                </label>
                <input
                  type="text"
                  value={prefsTemp.nom}
                  onChange={(e) => setPrefsTemp({ ...prefsTemp, nom: e.target.value })}
                  placeholder="Prénom Nom"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lyon-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget habituel (€/mois)
                </label>
                <input
                  type="number"
                  value={prefsTemp.budget_habituel}
                  onChange={(e) => setPrefsTemp({ ...prefsTemp, budget_habituel: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lyon-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPrefs(false)}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={sauvegarderPrefs}
                className="flex-1 py-2 bg-lyon-800 text-white rounded-lg text-sm font-medium hover:bg-lyon-900 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
