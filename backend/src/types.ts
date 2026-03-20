export type TypeBien = 'location_vide' | 'meublee' | 'colocation';
export type SourceAnnonce = 'LeBonCoin' | 'SeLoger' | 'PAP' | 'LogicImmo' | 'BienIci' | 'ParuVendu' | 'Roomlala' | 'Demo';

export interface Annonce {
  id: string;
  titre: string;
  prix: number;
  prix_hc?: number;       // hors charges
  surface: number;
  nb_pieces: number;
  quartier: string;
  arrondissement?: string; // ex: "69003"
  adresse_approx: string;
  description: string;
  photos: string[];
  date_publication: string; // ISO 8601
  type: TypeBien;
  lien_source: string;
  contact_email?: string;
  contact_formulaire?: string;
  lat?: number;
  lng?: number;
  source: SourceAnnonce;
  id_source?: string;       // identifiant chez la source
}

export interface FiltresState {
  budget_max: number;
  surface_min: number;
  nb_pieces_min: number;
  types: TypeBien[];
  arrondissements: string[];
  sources: SourceAnnonce[];
  periode: 'aujourd_hui' | '3_jours' | 'semaine' | 'tout';
  tri: 'prix_asc' | 'prix_desc' | 'surface' | 'date';
  recherche: string;
  zone_carte_active: boolean;
}
