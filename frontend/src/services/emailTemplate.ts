import { Annonce, TYPE_LABELS } from '../types';

export interface BrouillonEmail {
  destinataire: string;
  objet: string;
  corps: string;
}

export function genererBrouillon(annonce: Annonce, nomUtilisateur: string): BrouillonEmail {
  const type = TYPE_LABELS[annonce.type];
  const objet = `Demande de renseignements – ${annonce.titre}`;

  const corps =
`Bonjour,

Je vous contacte suite à votre annonce intitulée « ${annonce.titre} » publiée sur ${annonce.source}${annonce.id_source ? ` (référence : ${annonce.id_source})` : ''}.

Je suis très intéressé(e) par votre ${type.toLowerCase()} de ${annonce.surface}m² proposé à ${annonce.prix}€/mois.

Seriez-vous disponible pour organiser une visite ? Je suis disponible en semaine et le week-end selon vos disponibilités.

Dans l'attente de votre retour, je reste à votre disposition pour tout renseignement complémentaire.

Cordialement,
${nomUtilisateur || '[Votre nom]'}`;

  return {
    destinataire: annonce.contact_email ?? '',
    objet,
    corps,
  };
}

export function genererLienMailto(brouillon: BrouillonEmail): string {
  const params = new URLSearchParams();
  if (brouillon.destinataire) params.set('to', brouillon.destinataire);
  params.set('subject', brouillon.objet);
  params.set('body', brouillon.corps);

  // mailto: n'utilise pas URLSearchParams standard
  const query = `subject=${encodeURIComponent(brouillon.objet)}&body=${encodeURIComponent(brouillon.corps)}`;
  return `mailto:${encodeURIComponent(brouillon.destinataire)}?${query}`;
}
