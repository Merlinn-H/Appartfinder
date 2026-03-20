# 🏠 Appartfinder

Agrégateur d'annonces de location et colocation à Lyon et sa métropole. Affiche les annonces sur une carte interactive et génère des brouillons d'e-mail pré-remplis pour contacter les bailleurs.

## Stack

- **Frontend** : React 18 + Vite + TypeScript + Tailwind CSS
- **Carte** : Leaflet.js + react-leaflet (tuiles OpenStreetMap, 100 % gratuit)
- **Backend** : Node.js + Express + TypeScript
- **Base de données** : SQLite via better-sqlite3
- **State** : Zustand (filtres + annonces)
- **Scraping** : Playwright (structure prête, données de démo actives par défaut)

## Installation

### Prérequis

- Node.js >= 18
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur **http://localhost:3001**.
Au premier lancement, 50 annonces de démonstration sont automatiquement chargées en base.

### Frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur **http://localhost:5173**.

## Fonctionnalités

### Annonces
- 50 annonces fictives mais réalistes pour Lyon (prix, surfaces, quartiers cohérents avec le marché 2025)
- Filtrage en temps réel : budget, surface, pièces, type, arrondissement, source, date
- Tri : prix, surface, date de publication
- Recherche textuelle sur titre et description

### Carte interactive
- Carte Leaflet centrée sur Lyon (lat 45.764, lng 4.836, zoom 13)
- Marqueurs colorés par type (bleu = location, orange = meublée, vert = colocation)
- Synchronisation bidirectionnelle liste ↔ carte
- Popup au clic : photo, prix, surface, boutons Détails / Contacter
- Bouton "Me localiser" (géolocalisation navigateur)

### Contact
- Modal avec brouillon d'e-mail pré-rempli
- Objet et corps éditables avant envoi
- Bouton "Ouvrir dans mon client mail" (lien mailto:)
- Bouton "Copier le message" pour les formulaires web

### UX
- Vue double-panneau (liste + carte) sur desktop
- Onglets Liste / Carte / Favoris sur mobile
- Favoris persistés en localStorage
- Préférences utilisateur (nom pour les e-mails, budget habituel)
- Skeleton loaders pendant le chargement
- Mode sombre automatique (suit la préférence système)

## Structure du projet

```
appartfinder/
├── backend/
│   ├── src/
│   │   ├── data/mockData.ts          # 50 annonces de démonstration
│   │   ├── routes/annonces.ts        # API REST
│   │   ├── services/
│   │   │   ├── database.ts           # SQLite (better-sqlite3)
│   │   │   ├── geocoder.ts           # Nominatim (OpenStreetMap)
│   │   │   └── scraper.ts            # Structure scraping (Playwright)
│   │   ├── types.ts
│   │   └── index.ts                  # Serveur Express + cron
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CarteAnnonce.tsx       # Card d'une annonce
    │   │   ├── CarteAnnonces.tsx      # Carte Leaflet
    │   │   ├── Entete.tsx             # Header + onglets
    │   │   ├── FiltresPanel.tsx       # Panneau de filtres
    │   │   ├── ListeAnnonces.tsx      # Liste scrollable
    │   │   ├── ModalContact.tsx       # Brouillon e-mail
    │   │   └── ModalDetail.tsx        # Détail annonce
    │   ├── hooks/
    │   │   ├── useAnnonces.ts         # Chargement API
    │   │   ├── useFavoris.ts          # Favoris localStorage
    │   │   └── useFiltres.ts          # Filtrage + tri
    │   ├── services/
    │   │   └── emailTemplate.ts       # Génération mailto:
    │   ├── store/
    │   │   ├── annoncesStore.ts       # Zustand annonces
    │   │   └── filtresStore.ts        # Zustand filtres
    │   └── types/index.ts
    └── package.json
```

## Activer le scraping réel

Les méthodes dans `backend/src/services/scraper.ts` sont documentées et prêtes à recevoir du code Playwright. Le scraping direct de LeBonCoin/SeLoger/PAP nécessite un proxy résidentiel car ces sites utilisent des protections anti-bot avancées.

## Rafraîchissement automatique

Un cron job tourne toutes les 30 minutes (configurable dans `backend/src/index.ts`). Un bouton "Rafraîchir" manuel est disponible dans le header.
