import { Annonce, TypeBien } from '../types';

// 50 annonces fictives réalistes pour Lyon et sa métropole
// Prix et surfaces cohérents avec le marché lyonnais 2025

const quartiers: { nom: string; arr: string; lat: number; lng: number }[] = [
  { nom: 'Presqu\'île', arr: '69002', lat: 45.7576, lng: 4.8320 },
  { nom: 'Bellecour', arr: '69002', lat: 45.7578, lng: 4.8324 },
  { nom: 'Croix-Rousse', arr: '69004', lat: 45.7736, lng: 4.8301 },
  { nom: 'Cours Lafayette', arr: '69003', lat: 45.7602, lng: 4.8480 },
  { nom: 'Guillotière', arr: '69007', lat: 45.7468, lng: 4.8452 },
  { nom: 'Jean Macé', arr: '69007', lat: 45.7440, lng: 4.8380 },
  { nom: 'Vieux Lyon', arr: '69005', lat: 45.7620, lng: 4.8260 },
  { nom: 'Confluence', arr: '69002', lat: 45.7430, lng: 4.8180 },
  { nom: 'Montchat', arr: '69003', lat: 45.7550, lng: 4.8670 },
  { nom: 'Monplaisir', arr: '69008', lat: 45.7386, lng: 4.8602 },
  { nom: 'Gerland', arr: '69007', lat: 45.7267, lng: 4.8373 },
  { nom: 'Brotteaux', arr: '69006', lat: 45.7656, lng: 4.8511 },
  { nom: 'Saxe-Préfecture', arr: '69003', lat: 45.7508, lng: 4.8468 },
  { nom: 'Part-Dieu', arr: '69003', lat: 45.7609, lng: 4.8594 },
  { nom: 'Villeurbanne Gratte-Ciel', arr: 'Villeurbanne', lat: 45.7680, lng: 4.8822 },
  { nom: 'Vaise', arr: '69009', lat: 45.7782, lng: 4.8047 },
  { nom: 'La Duchère', arr: '69009', lat: 45.7873, lng: 4.8089 },
  { nom: 'Caluire-et-Cuire', arr: 'Caluire', lat: 45.7934, lng: 4.8541 },
  { nom: 'Villeurbanne Charpennes', arr: 'Villeurbanne', lat: 45.7708, lng: 4.8706 },
  { nom: 'Ainay', arr: '69002', lat: 45.7520, lng: 4.8293 },
];

const descriptions = [
  'Bel appartement lumineux avec parquet ancien, double vitrage, cuisine équipée. Proche de toutes commodités et transports en commun. Idéal pour jeune actif ou couple.',
  'Appartement rénové au 3ème étage avec ascenseur. Séjour lumineux, chambre calme sur cour, cuisine ouverte moderne. Pas de vis-à-vis.',
  'Charmant appartement en pierre avec poutres apparentes, très lumineux, exposé sud. Quartier animé et bien desservi. Cave et gardien.',
  'Studio cosy entièrement meublé et équipé, idéal pour étudiant ou jeune professionnel. Proche métro et commerces. Disponible de suite.',
  'Grand T3 familial avec balcon. Deux chambres spacieuses, grand séjour, cuisine séparée. Parking en sous-sol disponible en option.',
  'Appartement haussmannien avec moulures et cheminée decorative. Hauteur sous plafond 2m80. Gardien dans l\'immeuble, interphone.',
  'Colocation dans grand appartement T4. Chambre meublée disponible, accès cuisine équipée, salon commun. Colocataires travailleurs.',
  'Appartement neuf dans résidence récente avec digicodes. Cuisine américaine, salle de bain avec baignoire. DPE A - très économe.',
  'Bel appartement avec vue dégagée sur les toits. Dernier étage sans ascenseur. Très calme, lumineux, parquet massif.',
  'Appartement traversant clair et spacieux. Double séjour possible. Proche école et marché. Bail mobilité accepté.',
];

const sources: Array<'LeBonCoin' | 'SeLoger' | 'PAP'> = ['LeBonCoin', 'SeLoger', 'PAP'];
const types: TypeBien[] = ['location_vide', 'meublee', 'colocation'];

// Photos libres de droits (Unsplash - appartements génériques)
const photos = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
}

function jitter(coord: number, range = 0.003): number {
  return coord + (Math.random() - 0.5) * range * 2;
}

export function generateMockAnnonces(): Annonce[] {
  const annonces: Annonce[] = [];

  const specs: Array<{ pieces: number; surfMin: number; surfMax: number; prixMin: number; prixMax: number; label: string }> = [
    { pieces: 1, surfMin: 18, surfMax: 35, prixMin: 450, prixMax: 750, label: 'Studio' },
    { pieces: 1, surfMin: 25, surfMax: 45, prixMin: 550, prixMax: 850, label: 'T1' },
    { pieces: 2, surfMin: 35, surfMax: 60, prixMin: 700, prixMax: 1100, label: 'T2' },
    { pieces: 3, surfMin: 55, surfMax: 85, prixMin: 950, prixMax: 1500, label: 'T3' },
    { pieces: 4, surfMin: 75, surfMax: 120, prixMin: 1200, prixMax: 2000, label: 'T4' },
    { pieces: 5, surfMin: 100, surfMax: 150, prixMin: 1600, prixMax: 2800, label: 'T5' },
  ];

  // Répartition : 10 studios, 12 T2, 12 T3, 8 T4, 5 T5, 3 T1
  const distribution = [
    ...Array(10).fill(specs[0]),
    ...Array(3).fill(specs[1]),
    ...Array(12).fill(specs[2]),
    ...Array(12).fill(specs[3]),
    ...Array(8).fill(specs[4]),
    ...Array(5).fill(specs[5]),
  ];

  distribution.forEach((spec, i) => {
    const quartier = randomItem(quartiers);
    const source = randomItem(sources);
    const type: TypeBien = spec.pieces === 1
      ? randomItem(['location_vide', 'meublee', 'colocation'] as TypeBien[])
      : spec.pieces >= 4
        ? randomItem(['location_vide', 'colocation'] as TypeBien[])
        : randomItem(types);

    const surface = randomBetween(spec.surfMin, spec.surfMax);
    const prix = randomBetween(spec.prixMin, spec.prixMax);
    const prix_hc = Math.round(prix * 0.85);

    const titre = `${type === 'colocation' ? 'Colocation ' : ''}${spec.label} ${surface}m² – ${quartier.nom}`;

    const sourceId = `${source.toLowerCase().replace(' ', '')}-${Date.now()}-${i}`;
    const lienSource = source === 'LeBonCoin'
      ? `https://www.leboncoin.fr/locations/${sourceId}`
      : source === 'SeLoger'
        ? `https://www.seloger.com/annonces/locations/${sourceId}.htm`
        : `https://www.pap.fr/annonce/locations-appartement-lyon-${sourceId}`;

    const photoCount = randomBetween(1, 4);
    const annonce: Annonce = {
      id: `demo-${i + 1}`,
      titre,
      prix,
      prix_hc,
      surface,
      nb_pieces: spec.pieces,
      quartier: quartier.nom,
      arrondissement: quartier.arr,
      adresse_approx: `${quartier.nom}, Lyon ${quartier.arr.startsWith('69') ? quartier.arr : ''}`,
      description: randomItem(descriptions) + ` Surface : ${surface}m². Loyer CC : ${prix}€/mois (HC : ${prix_hc}€). Disponible immédiatement.`,
      photos: Array.from({ length: photoCount }, () => randomItem(photos)),
      date_publication: randomDate(7),
      type,
      lien_source: lienSource,
      contact_email: Math.random() > 0.4 ? `proprietaire${i + 1}@example.com` : undefined,
      contact_formulaire: Math.random() > 0.6 ? lienSource : undefined,
      lat: jitter(quartier.lat),
      lng: jitter(quartier.lng),
      source,
      id_source: sourceId,
    };

    annonces.push(annonce);
  });

  return annonces;
}
