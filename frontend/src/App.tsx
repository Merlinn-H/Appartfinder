import React, { useState, useEffect } from 'react';
import { FiltresPanel } from './components/FiltresPanel';
import { ListeAnnonces } from './components/ListeAnnonces';
import { CarteAnnonces } from './components/CarteAnnonces';
import { ModalContact } from './components/ModalContact';
import { ModalDetail } from './components/ModalDetail';
import { Entete } from './components/Entete';
import { useAnnonces } from './hooks/useAnnonces';
import { useAnnoncesFiltrees } from './hooks/useFiltres';
import { useFavoris } from './hooks/useFavoris';
import { useAnnoncesStore } from './store/annoncesStore';
import { Annonce, PreferencesUtilisateur } from './types';

const PREFS_KEY = 'appartfinder-prefs';

function chargerPrefs(): PreferencesUtilisateur {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) ?? 'null') ?? {
      nom: '',
      arrondissements_favoris: [],
      budget_habituel: 1000,
    };
  } catch {
    return { nom: '', arrondissements_favoris: [], budget_habituel: 1000 };
  }
}

export default function App() {
  const [onglet, setOnglet] = useState<'liste' | 'carte' | 'favoris'>('liste');
  const [annonceContact, setAnnonceContact] = useState<Annonce | null>(null);
  const [annonceDetail, setAnnonceDetail] = useState<Annonce | null>(null);
  const [preferences, setPreferences] = useState<PreferencesUtilisateur>(chargerPrefs);

  const { loading, error } = useAnnoncesStore();
  const { annonces: toutesAnnonces } = useAnnoncesStore();

  useAnnonces(); // charge les données au montage

  const annoncesFiltrees = useAnnoncesFiltrees();
  const { favoris } = useFavoris();
  const annoncesFavoris = toutesAnnonces.filter((a) => favoris.includes(a.id));

  function sauvegarderPreferences(p: PreferencesUtilisateur) {
    setPreferences(p);
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  }

  // Fermer les modals avec Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setAnnonceContact(null);
        setAnnonceDetail(null);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const listePourOnglet = onglet === 'favoris' ? annoncesFavoris : annoncesFiltrees;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Entete
        onglet={onglet}
        onOnglet={setOnglet}
        nbFavoris={favoris.length}
        preferences={preferences}
        onPreferences={sauvegarderPreferences}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Panneau de filtres — masqué en vue favoris */}
        {onglet !== 'favoris' && (
          <FiltresPanel nbResultats={annoncesFiltrees.length} />
        )}

        {/* Vue liste */}
        {(onglet === 'liste' || onglet === 'favoris') && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {onglet === 'favoris' && (
              <div className="px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                {favoris.length === 0
                  ? 'Aucun favori sauvegardé.'
                  : `${favoris.length} annonce${favoris.length > 1 ? 's' : ''} en favori`}
              </div>
            )}
            <ListeAnnonces
              annonces={listePourOnglet}
              onDetail={setAnnonceDetail}
              onContact={setAnnonceContact}
              loading={loading && onglet !== 'favoris'}
              error={error}
            />
          </div>
        )}

        {/* Vue carte (desktop : toujours visible à droite ; mobile : onglet dédié) */}
        {onglet === 'carte' && (
          <div className="flex-1 overflow-hidden">
            <CarteAnnonces
              annonces={annoncesFiltrees}
              onContact={setAnnonceContact}
              onDetail={setAnnonceDetail}
            />
          </div>
        )}

        {/* Sur desktop : carte à droite de la liste */}
        {onglet === 'liste' && (
          <div className="hidden lg:flex flex-1 overflow-hidden">
            <CarteAnnonces
              annonces={annoncesFiltrees}
              onContact={setAnnonceContact}
              onDetail={setAnnonceDetail}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <ModalContact
        annonce={annonceContact}
        onFermer={() => setAnnonceContact(null)}
        nomUtilisateur={preferences.nom}
      />
      <ModalDetail
        annonce={annonceDetail}
        onFermer={() => setAnnonceDetail(null)}
        onContact={(a) => { setAnnonceDetail(null); setAnnonceContact(a); }}
      />
    </div>
  );
}
