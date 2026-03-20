export type TypeBien = 'location_vide' | 'meublee' | 'colocation';
export type SourceAnnonce = 'LeBonCoin' | 'SeLoger' | 'PAP' | 'LogicImmo' | 'BienIci' | 'ParuVendu' | 'Roomlala' | 'Demo';
export type TriAnnonce = 'prix_asc' | 'prix_desc' | 'surface' | 'date';
export type PeriodeAnnonce = 'aujourd_hui' | '3_jours' | 'semaine' | 'tout';

export interface Annonce {
  id: string;
  titre: string;
  prix: number;
  prix_hc?: number;
  surface: number;
  nb_pieces: number;
  quartier: string;
  arrondissement?: string;
  adresse_approx: string;
  description: string;
  photos: string[];
  date_publication: string;
  type: TypeBien;
  lien_source: string;
  contact_email?: string;
  contact_formulaire?: string;
  lat?: number;
  lng?: number;
  source: SourceAnnonce;
  id_source?: string;
}

export interface Filtres {
  budget_max: number;
  surface_min: number;
  nb_pieces_min: number;
  types: TypeBien[];
  arrondissements: string[];
  sources: SourceAnnonce[];
  periode: PeriodeAnnonce;
  tri: TriAnnonce;
  recherche: string;
  zone_carte_active: boolean;
}

export interface PreferencesUtilisateur {
  nom: string;
  arrondissements_favoris: string[];
  budget_habituel: number;
}

export const ARRONDISSEMENTS = [
  { code: '69001', label: 'Lyon 1er' },
  { code: '69002', label: 'Lyon 2ème' },
  { code: '69003', label: 'Lyon 3ème' },
  { code: '69004', label: 'Lyon 4ème' },
  { code: '69005', label: 'Lyon 5ème' },
  { code: '69006', label: 'Lyon 6ème' },
  { code: '69007', label: 'Lyon 7ème' },
  { code: '69008', label: 'Lyon 8ème' },
  { code: '69009', label: 'Lyon 9ème' },
  { code: 'Villeurbanne', label: 'Villeurbanne' },
  { code: 'Caluire', label: 'Caluire-et-Cuire' },
  { code: 'Bron', label: 'Bron' },
  { code: 'Vénissieux', label: 'Vénissieux' },
  { code: 'Saint-Fons', label: 'Saint-Fons' },
];

export const TYPE_LABELS: Record<TypeBien, string> = {
  location_vide: 'Location vide',
  meublee: 'Meublée',
  colocation: 'Colocation',
};

export const TYPE_COLORS: Record<TypeBien, string> = {
  location_vide: 'bg-lyon-100 text-lyon-800 dark:bg-lyon-900 dark:text-lyon-200',
  meublee: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  colocation: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};
