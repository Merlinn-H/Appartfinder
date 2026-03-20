import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet';
import { Annonce, TypeBien } from '../types';
import { useAnnoncesStore } from '../store/annoncesStore';

// Couleurs des marqueurs par type
const MARKER_COLORS: Record<TypeBien, string> = {
  location_vide: '#1d4ed8', // bleu Lyon
  meublee: '#ea580c',       // orange
  colocation: '#16a34a',    // vert
};

function createIcon(type: TypeBien, selected = false): L.DivIcon {
  const color = MARKER_COLORS[type];
  const size = selected ? 36 : 28;
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:3px solid white;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
        transition:all 0.2s;
      "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

interface Props {
  annonces: Annonce[];
  onContact: (annonce: Annonce) => void;
  onDetail: (annonce: Annonce) => void;
}

export function CarteAnnonces({ annonces, onContact, onDetail }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const { annonceSelectionnee, selectionnerAnnonce } = useAnnoncesStore();

  // Initialisation de la carte
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [45.764, 4.8357],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Bouton "Me localiser"
    const localiserCtrl = L.control({ position: 'topleft' });
    localiserCtrl.onAdd = () => {
      const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
      btn.title = 'Me localiser';
      btn.style.cssText = 'width:34px;height:34px;background:white;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;border:none;';
      btn.innerHTML = '📍';
      L.DomEvent.on(btn, 'click', () => {
        map.locate({ setView: true, maxZoom: 15 });
      });
      return btn;
    };
    localiserCtrl.addTo(map);

    map.on('locationfound', (e) => {
      L.circleMarker(e.latlng, { radius: 8, color: '#1d4ed8', fillOpacity: 0.8 })
        .addTo(map)
        .bindPopup('Vous êtes ici')
        .openPopup();
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Mise à jour des marqueurs
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const bounds: [number, number][] = [];

    annonces.forEach((annonce) => {
      if (!annonce.lat || !annonce.lng) return;

      const marker = L.marker([annonce.lat, annonce.lng], {
        icon: createIcon(annonce.type, annonceSelectionnee === annonce.id),
      }).addTo(map);

      bounds.push([annonce.lat, annonce.lng]);

      // Popup
      const popupContent = `
        <div style="min-width:200px;max-width:240px;font-family:Inter,sans-serif">
          ${annonce.photos[0] ? `<img src="${annonce.photos[0]}" style="width:100%;height:120px;object-fit:cover;border-radius:4px;margin-bottom:8px" />` : ''}
          <div style="font-size:11px;color:#6b7280;margin-bottom:2px">${annonce.source}</div>
          <div style="font-weight:600;font-size:13px;margin-bottom:4px;line-height:1.3">${annonce.titre}</div>
          <div style="font-size:18px;font-weight:700;color:#1e3a8a;margin-bottom:4px">${annonce.prix} €<span style="font-size:12px;font-weight:400;color:#6b7280">/mois</span></div>
          <div style="font-size:12px;color:#4b5563;margin-bottom:8px">${annonce.surface} m² · ${annonce.nb_pieces} pièce${annonce.nb_pieces > 1 ? 's' : ''}</div>
          <div style="display:flex;gap:6px">
            <button
              onclick="window.__appartfinderDetail('${annonce.id}')"
              style="flex:1;padding:5px 8px;font-size:11px;border:1px solid #1d4ed8;color:#1d4ed8;border-radius:4px;cursor:pointer;background:white"
            >Détails</button>
            <button
              onclick="window.__appartfinderContact('${annonce.id}')"
              style="flex:1;padding:5px 8px;font-size:11px;background:#1e40af;color:white;border-radius:4px;cursor:pointer;border:none"
            >Contacter</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260 });

      marker.on('click', () => {
        selectionnerAnnonce(annonce.id);
      });

      markersRef.current.set(annonce.id, marker);
    });

    // Adapter la vue si des annonces ont des coordonnées
    if (bounds.length > 0 && bounds.length < 100) {
      try {
        map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [20, 20], maxZoom: 15 });
      } catch (_) { /* ignore */ }
    }
  }, [annonces, selectionnerAnnonce]);

  // Handlers globaux pour les boutons dans les popups Leaflet
  useEffect(() => {
    (window as any).__appartfinderDetail = (id: string) => {
      const annonce = annonces.find((a) => a.id === id);
      if (annonce) onDetail(annonce);
    };
    (window as any).__appartfinderContact = (id: string) => {
      const annonce = annonces.find((a) => a.id === id);
      if (annonce) onContact(annonce);
    };
  }, [annonces, onDetail, onContact]);

  // Centrer et ouvrir le popup quand une annonce est sélectionnée
  useEffect(() => {
    if (!annonceSelectionnee || !mapRef.current) return;
    const marker = markersRef.current.get(annonceSelectionnee);
    if (marker) {
      const latlng = marker.getLatLng();
      mapRef.current.setView(latlng, Math.max(mapRef.current.getZoom(), 15), { animate: true });
      marker.openPopup();
    }
  }, [annonceSelectionnee]);

  return (
    <div className="relative flex-1 h-full">
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
      {/* Légende */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000] text-xs space-y-1.5">
        <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Légende</div>
        {[
          { label: 'Location vide', color: '#1d4ed8' },
          { label: 'Meublée', color: '#ea580c' },
          { label: 'Colocation', color: '#16a34a' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-white shadow" style={{ background: item.color }} />
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
