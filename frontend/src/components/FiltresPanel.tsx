import React from 'react';
import { useFiltresStore } from '../store/filtresStore';
import { ARRONDISSEMENTS, TYPE_LABELS, TypeBien, SourceAnnonce } from '../types';

const SOURCES: SourceAnnonce[] = ['LeBonCoin', 'SeLoger', 'PAP', 'LogicImmo', 'BienIci', 'ParuVendu', 'Roomlala', 'Demo'];

interface Props {
  nbResultats: number;
}

export function FiltresPanel({ nbResultats }: Props) {
  const f = useFiltresStore();

  return (
    <aside className="w-72 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
        <h2 className="font-semibold text-gray-900 dark:text-white">Filtres</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{nbResultats} annonce{nbResultats > 1 ? 's' : ''}</span>
          <button
            onClick={f.reinitialiser}
            className="text-xs text-lyon-600 hover:text-lyon-800 underline"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Recherche textuelle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recherche
          </label>
          <input
            type="text"
            value={f.recherche}
            onChange={(e) => f.setRecherche(e.target.value)}
            placeholder="Mot-clé dans le titre ou la description…"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lyon-500"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Budget max : <span className="text-lyon-700 dark:text-lyon-400 font-semibold">{f.budget_max} €/mois</span>
          </label>
          <input
            type="range"
            min={300}
            max={3000}
            step={50}
            value={f.budget_max}
            onChange={(e) => f.setBudgetMax(Number(e.target.value))}
            className="w-full accent-lyon-700"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>300 €</span>
            <span>3 000 €</span>
          </div>
        </div>

        {/* Surface */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Surface min : <span className="text-lyon-700 dark:text-lyon-400 font-semibold">{f.surface_min} m²</span>
          </label>
          <input
            type="range"
            min={10}
            max={150}
            step={5}
            value={f.surface_min}
            onChange={(e) => f.setSurfaceMin(Number(e.target.value))}
            className="w-full accent-lyon-700"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10 m²</span>
            <span>150 m²</span>
          </div>
        </div>

        {/* Nombre de pièces */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pièces min
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => f.setNbPiecesMin(n)}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                  f.nb_pieces_min === n
                    ? 'bg-lyon-800 text-white border-lyon-800'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-lyon-400'
                }`}
              >
                {n === 5 ? '5+' : n}
              </button>
            ))}
          </div>
        </div>

        {/* Type de bien */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type de bien
          </label>
          <div className="space-y-2">
            {(Object.entries(TYPE_LABELS) as [TypeBien, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.types.includes(key)}
                  onChange={() => f.toggleType(key)}
                  className="rounded accent-lyon-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Arrondissements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Secteurs {f.arrondissements.length > 0 && <span className="text-lyon-600">({f.arrondissements.length})</span>}
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            {ARRONDISSEMENTS.map((a) => (
              <button
                key={a.code}
                onClick={() => f.toggleArrondissement(a.code)}
                className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                  f.arrondissements.includes(a.code)
                    ? 'bg-lyon-800 text-white border-lyon-800'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-lyon-400'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Source
          </label>
          <div className="space-y-2">
            {SOURCES.map((src) => (
              <label key={src} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.sources.includes(src)}
                  onChange={() => f.toggleSource(src)}
                  className="rounded accent-lyon-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{src}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Période */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date de publication
          </label>
          <select
            value={f.periode}
            onChange={(e) => f.setPeriode(e.target.value as any)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lyon-500"
          >
            <option value="aujourd_hui">Aujourd'hui</option>
            <option value="3_jours">3 derniers jours</option>
            <option value="semaine">Cette semaine</option>
            <option value="tout">Tout</option>
          </select>
        </div>

        {/* Tri */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Trier par
          </label>
          <select
            value={f.tri}
            onChange={(e) => f.setTri(e.target.value as any)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lyon-500"
          >
            <option value="date">Date (plus récent)</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="surface">Surface</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
