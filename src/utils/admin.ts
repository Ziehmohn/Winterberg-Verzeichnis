/**
 * Zentrale Admin-Definition.
 *
 * WICHTIG: Admin-Rechte werden AUSSCHLIESSLICH über diese E-Mail-Adresse vergeben.
 * Eine `role: 'admin'` im Firestore-Nutzerdokument wird bewusst NICHT vertraut,
 * damit sich niemand selbst zum Admin machen kann.
 * Die gleiche Adresse ist in `firestore.rules` (isAdmin()) hinterlegt.
 */
export const ADMIN_EMAIL = 'simon.kraeling@sichtbar-online.com';

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL;
}
