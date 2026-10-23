import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { TenderProject, TenderTimeframe, Business } from '../types';
import { businesses as initialBusinesses } from '../data';

const TENDERS_COLLECTION = 'tenders';

// In der Startphase sind Leads für alle Winterberger Betriebe kostenfrei zur Aktivierung
export const IS_PILOT_PHASE = true;

// Realistische Demo-Ausschreibungen aus Winterberg & Ortsteilen (Fallback bei neuem/leerem System)
export const INITIAL_DEMO_TENDERS: TenderProject[] = [
  {
    id: 'demo-tender-1',
    title: 'Austausch Ölheizung gegen moderne Pellet- / Wärmepumpe',
    category: 'Handwerk',
    subcategory: 'Heizungstechnik',
    district: 'Züschen',
    timeframe: '1_month',
    description: 'Wir planen für unser Einfamilienhaus (ca. 165 qm, Baujahr 1994) den Austausch der alten Ölheizung gegen eine zukunftssichere Lösung (bevorzugt Hybrid oder Pelletheizung). Heizungsraum im Keller gut zugänglich. Wir suchen einen zuverlässigen Fachbetrieb aus dem Winterberger Raum für Beratung, Angebot und fachgerechte Installation.',
    budgetRange: 'Über 5.000 €',
    contactName: 'Familie Sauerland',
    contactEmail: 'f.sauerland.zueschen@beispiel.de',
    contactPhone: '0171 / 8245910',
    preferredContactMethod: 'phone',
    status: 'active',
    manageToken: 'demo-token-1',
    createdAt: Date.now() - 1000 * 60 * 60 * 26, // vor 1 Tag
    unlockedBy: [],
    viewsCount: 14
  },
  {
    id: 'demo-tender-2',
    title: 'Dachrinnenreinigung & Firstziegel-Reparatur nach Herbststurm',
    category: 'Handwerk',
    subcategory: 'Dachdecker',
    district: 'Altastenberg',
    timeframe: 'urgent',
    description: 'An unserem Ferienhaus in Hanglage haben sich am Dachfirst zwei Ziegel gelockert und die Dachrinne zur Westseite muss dringend gereinigt bzw. gerichtet werden, da Regenwasser überläuft. Schnelle Ausführung gewünscht.',
    budgetRange: 'Bis 1.000 €',
    contactName: 'Thomas Becker',
    contactEmail: 't.becker.fewo@beispiel.de',
    contactPhone: '0160 / 9481230',
    preferredContactMethod: 'any',
    status: 'active',
    manageToken: 'demo-token-2',
    createdAt: Date.now() - 1000 * 60 * 60 * 52, // vor 2 Tagen
    unlockedBy: [],
    viewsCount: 28
  },
  {
    id: 'demo-tender-3',
    title: 'Maßgefertigter Skikeller-Schrank & Garderobe für Ferienwohnung',
    category: 'Handwerk',
    subcategory: 'Schreinereien',
    district: 'Winterberg (Kernstadt)',
    timeframe: '3_months',
    description: 'Für unsere Gästewohnung im Zentrum von Winterberg suchen wir einen Schreiner für einen robusten, maßgefertigten Garderobenschrank im Eingangsbereich mit integrierter Skischuh-Halterung und Trocknungsbelüftung. Maße ca. 2,40m Breite x 2,30m Höhe. Holzart hell (Eiche oder Esche).',
    budgetRange: '1.000 - 5.000 €',
    contactName: 'Sabine Krämer',
    contactEmail: 's.kraemer-winterberg@beispiel.de',
    contactPhone: '02981 / 55432',
    preferredContactMethod: 'email',
    status: 'active',
    manageToken: 'demo-token-3',
    createdAt: Date.now() - 1000 * 60 * 60 * 96, // vor 4 Tagen
    unlockedBy: [],
    viewsCount: 39
  },
  {
    id: 'demo-tender-4',
    title: 'Installation Wallbox 11kW & Unterverteilung in Garage',
    category: 'Handwerk',
    subcategory: 'Elektriker',
    district: 'Niedersfeld',
    timeframe: '1_month',
    description: 'Wir benötigen für ein neues E-Auto eine 11 kW Wallbox-Installation in unserer freistehenden Garage. Leitungsweg vom Hausanschluss ca. 12 Meter. Leerrohr ist teilweise vorhanden. Anmeldung beim Netzbetreiber erwünscht.',
    budgetRange: '1.000 - 5.000 €',
    contactName: 'Klaus Vormann',
    contactEmail: 'klaus.vormann@beispiel.de',
    contactPhone: '0151 / 4429011',
    preferredContactMethod: 'phone',
    status: 'active',
    manageToken: 'demo-token-4',
    createdAt: Date.now() - 1000 * 60 * 60 * 140, // vor 5 Tagen
    unlockedBy: [],
    viewsCount: 42
  }
];

/**
 * Send automated email notification via /api/send-mail
 */
async function sendNotificationEmail(payload: { to: string; subject: string; html: string; cc?: string; bcc?: string }) {
  try {
    const res = await fetch('/api/send-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.warn('Failed to send tender notification email', await res.text());
    }
  } catch (err) {
    console.error('Error dispatching notification email:', err);
  }
}

/**
 * Proaktive Benachrichtigung aller passenden Handwerksbetriebe bei einem neuen Auftrag
 */
export async function notifyMatchingCraftBusinesses(tender: TenderProject, tenderId: string) {
  try {
    const isTestTender = 
      tender.subcategory?.toLowerCase() === 'test' || 
      tender.category?.toLowerCase() === 'test';

    const matchingBusinesses = initialBusinesses.filter(b => {
      // Wenn Testkategorie gewählt ist: Betriebe mit Subkategorie 'Test' oder Admin-E-Mail benachrichtigen
      if (isTestTender) {
        return (
          b.subcategory?.toLowerCase() === 'test' || 
          b.category?.toLowerCase() === 'test' || 
          b.email?.toLowerCase() === 'simon.kraeling@sichtbar-online.com'
        );
      }

      const isCraft = b.category === 'Handwerk' || (b.additionalCategories && b.additionalCategories.some(ac => ac.category === 'Handwerk'));
      if (!isCraft) return false;
      if (!b.email || !b.email.includes('@')) return false;

      // Subcategory match
      if (tender.subcategory && b.subcategory) {
        if (b.subcategory.toLowerCase() === tender.subcategory.toLowerCase()) return true;
      }
      return false;
    });

    // Test-Modus Sicherheitsgarantie: Admin-E-Mail immer als Empfänger sicherstellen
    if (isTestTender && !matchingBusinesses.some(b => b.email?.toLowerCase() === 'simon.kraeling@sichtbar-online.com')) {
      matchingBusinesses.push({
        id: 'test-admin-betrieb',
        name: 'Admin Testbetrieb Handwerk',
        category: 'Handwerk',
        subcategory: 'Test',
        email: 'simon.kraeling@sichtbar-online.com',
        phone: '02981 00000',
        address: 'Am Waltenberg 1, 59955 Winterberg',
        district: 'Winterberg',
        isActive: true,
        isPremium: true
      } as Business);
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.winterberg-verzeichnis.de';

    for (const biz of matchingBusinesses) {
      if (!biz.email) continue;
      const tenderUrl = `${origin}/auftragsboerse?highlight=${tenderId}`;
      
      await sendNotificationEmail({
        to: biz.email,
        subject: `Neuer Handwerksauftrag in Winterberg: ${tender.title} (${tender.district})`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1B211D; max-width: 600px; margin: 0 auto; border: 1px solid #E7E2DA; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #0F4C2E; padding: 24px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 20px;">Neuer Handwerksauftrag in Winterberg</h1>
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Ein Kunde sucht einen Fachbetrieb wie Ihren!</p>
            </div>
            <div style="padding: 24px; background-color: #FFFFFF;">
              <p>Hallo Team von <strong>${biz.name}</strong>,</p>
              <p>in der Winterberger Auftragsbörse wurde soeben ein neuer Auftrag für Ihr Gewerk (<strong>${tender.subcategory}</strong>) im Ortsteil <strong>${tender.district}</strong> eingestellt:</p>
              
              <div style="background-color: #F7F5F0; border-left: 4px solid #F2761B; padding: 16px; margin: 20px 0; border-radius: 6px;">
                <h3 style="margin: 0 0 6px 0; color: #0F4C2E; font-size: 16px;">${tender.title}</h3>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Ortsteil:</strong> ${tender.district}</p>
                <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Zeitraum:</strong> ${formatTimeframe(tender.timeframe)}</p>
                ${tender.budgetRange ? `<p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Budgetrahmen:</strong> ${tender.budgetRange}</p>` : ''}
                <p style="margin: 8px 0 0; font-size: 13px; color: #5F6B63;">${tender.description.length > 220 ? tender.description.substring(0, 217) + '...' : tender.description}</p>
              </div>

              ${IS_PILOT_PHASE ? `
                <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 13px; color: #1E40AF;">
                  <strong>Kostenlose Kennenlern-Phase:</strong> Als lokaler Winterberger Betrieb können Sie diesen Auftrag und die Kontaktdaten aktuell kostenfrei einsehen und den Kunden direkt kontaktieren!
                </div>
              ` : ''}

              <div style="text-align: center; margin: 24px 0;">
                <a href="${tenderUrl}" style="background-color: #F2761B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                  Auftrag & Kontaktdaten jetzt ansehen
                </a>
              </div>

              <p style="font-size: 12px; color: #8F9E95; text-align: center; margin-top: 24px;">
                Diese Benachrichtigung wurde Ihnen gesendet, weil Ihr Betrieb im Winterberg-Verzeichnis gelistet ist.
              </p>
            </div>
          </div>
        `
      });
    }
  } catch (err) {
    console.warn('Error notifying matching businesses:', err);
  }
}

/**
 * Erstellt eine neue Ausschreibung in Firestore und benachrichtigt den Kunden
 */
export async function createTender(
  data: Omit<TenderProject, 'id' | 'createdAt' | 'status' | 'manageToken' | 'unlockedBy' | 'viewsCount'>
): Promise<{ success: boolean; id?: string; manageToken?: string; error?: string }> {
  try {
    const manageToken = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const newTender: Omit<TenderProject, 'id'> = {
      ...data,
      category: data.category || 'Handwerk',
      status: 'active',
      createdAt: Date.now(),
      manageToken,
      unlockedBy: [],
      viewsCount: 0
    };

    const docRef = await addDoc(collection(db, TENDERS_COLLECTION), newTender);
    const tenderId = docRef.id;

    // E-Mail-Bestätigung an den Auftraggeber senden
    const manageUrl = `${window.location.origin}/auftragsboerse?manage=${tenderId}&token=${manageToken}`;
    
    sendNotificationEmail({
      to: data.contactEmail,
      subject: `Ihre Ausschreibung auf Winterberg-Unternehmen: ${data.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1B211D; max-width: 600px; margin: 0 auto; border: 1px solid #E7E2DA; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0F4C2E; padding: 24px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 22px;">Winterberger Auftragsbörse</h1>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Ihre Handwerks-Ausschreibung wurde erfolgreich veröffentlicht!</p>
          </div>
          <div style="padding: 24px; background-color: #FFFFFF;">
            <p>Hallo <strong>${data.contactName}</strong>,</p>
            <p>vielen Dank für Ihren Auftrag. Wir haben Ihre Ausschreibung in das Portal eingestellt. Verifizierte Winterberger Handwerksbetriebe können nun Einsicht nehmen und direkt mit Ihnen Kontakt aufnehmen.</p>
            
            <div style="background-color: #F7F5F0; border-left: 4px solid #F2761B; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 8px 0; color: #0F4C2E; font-size: 16px;">${data.title}</h3>
              <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Gewerk:</strong> ${data.subcategory}</p>
              <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Ortsteil:</strong> ${data.district}</p>
              <p style="margin: 0; font-size: 13px;"><strong>Zeitraum:</strong> ${formatTimeframe(data.timeframe)}</p>
            </div>

            <p style="font-size: 14px; color: #5F6B63;">
              <strong>Wichtig:</strong> Wenn Sie einen passenden Handwerker gefunden haben oder das Gesuch beenden möchten, können Sie die Ausschreibung jederzeit mit einem Klick schließen:
            </p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${manageUrl}" style="background-color: #0F4C2E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                Auftrag als vergeben / beendet markieren
              </a>
            </div>

            <p style="font-size: 12px; color: #8F9E95; text-align: center;">
              Ihr persönlicher Verwaltungscode: <code style="background: #EFEFEF; padding: 2px 6px; border-radius: 4px;">${manageToken}</code>
            </p>
          </div>
        </div>
      `
    });

    // Benachrichtigung an Admin
    sendNotificationEmail({
      to: 'simon.kraeling@sichtbar-online.com',
      subject: `[Neue Ausschreibung] ${data.title} (${data.district})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Neuer Auftrag in der Winterberger Auftragsbörse!</h2>
          <p><strong>Titel:</strong> ${data.title}</p>
          <p><strong>Gewerk:</strong> ${data.subcategory}</p>
          <p><strong>Ortsteil:</strong> ${data.district}</p>
          <p><strong>Auftraggeber:</strong> ${data.contactName} (${data.contactEmail}, Tel: ${data.contactPhone || 'k.A.'})</p>
          <p><strong>Beschreibung:</strong> ${data.description}</p>
          <p><a href="${window.location.origin}/auftragsboerse">Jetzt in der Börse ansehen</a></p>
        </div>
      `
    });

    // Proaktiv alle passenden Handwerksbetriebe mit hinterlegter E-Mail benachrichtigen
    notifyMatchingCraftBusinesses({ ...newTender, id: tenderId }, tenderId);

    return { success: true, id: tenderId, manageToken };
  } catch (err: any) {
    console.error('Error creating tender:', err);
    return { success: false, error: err.message || 'Fehler beim Erstellen der Ausschreibung' };
  }
}

/**
 * Lädt alle aktiven Ausschreibungen aus Firestore
 */
export async function fetchActiveTenders(): Promise<TenderProject[]> {
  try {
    const q = query(
      collection(db, TENDERS_COLLECTION),
      where('status', '==', 'active'),
      limit(100)
    );
    const snap = await getDocs(q);
    const list: TenderProject[] = [];
    snap.forEach(docSnap => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as TenderProject);
    });

    // Nach Datum sortieren (neueste zuerst)
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Fallback falls Datenbank noch leer ist
    if (list.length === 0) {
      return INITIAL_DEMO_TENDERS;
    }

    return list;
  } catch (err) {
    console.warn('Firestore fetchActiveTenders error, using demo fallback:', err);
    return INITIAL_DEMO_TENDERS;
  }
}

/**
 * Lädt alle Ausschreibungen für das Admin-Panel
 */
export async function fetchAllTendersAdmin(): Promise<TenderProject[]> {
  try {
    const q = query(collection(db, TENDERS_COLLECTION), limit(150));
    const snap = await getDocs(q);
    const list: TenderProject[] = [];
    snap.forEach(docSnap => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as TenderProject);
    });
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    // Falls noch keine echten Daten existieren, Demo-Daten mit anzeigen
    if (list.length === 0) {
      return INITIAL_DEMO_TENDERS;
    }
    return list;
  } catch (err) {
    console.warn('Admin fetch tenders error:', err);
    return INITIAL_DEMO_TENDERS;
  }
}

/**
 * Status eines Auftrags ändern (z. B. auf 'completed' oder 'cancelled')
 */
export async function updateTenderStatus(
  tenderId: string, 
  newStatus: 'active' | 'completed' | 'cancelled', 
  manageToken?: string, 
  isAdmin: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    // Wenn Demo-ID, simulieren
    if (tenderId.startsWith('demo-tender-')) {
      return { success: true };
    }

    const docRef = doc(db, TENDERS_COLLECTION, tenderId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return { success: false, error: 'Ausschreibung nicht gefunden.' };
    }

    const tender = snap.data() as TenderProject;

    // Berechtigungsprüfung: Entweder Admin oder passender Manage-Token
    if (!isAdmin && tender.manageToken !== manageToken) {
      return { success: false, error: 'Ungültiger Verwaltungscode. Keine Berechtigung.' };
    }

    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: Date.now()
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error updating tender status:', err);
    return { success: false, error: err.message || 'Fehler beim Aktualisieren des Status.' };
  }
}

/**
 * Kontaktfreigabe für einen Premium-Betrieb vermerken
 */
export async function recordTenderContactUnlock(tenderId: string, identifier: string): Promise<void> {
  try {
    if (tenderId.startsWith('demo-tender-')) return;
    const docRef = doc(db, TENDERS_COLLECTION, tenderId);
    await updateDoc(docRef, {
      unlockedBy: arrayUnion(identifier),
      viewsCount: increment(1)
    });
  } catch (err) {
    console.warn('Could not record contact unlock:', err);
  }
}

/**
 * Ausschreibung löschen (Nur Admin)
 */
export async function deleteTender(tenderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (tenderId.startsWith('demo-tender-')) {
      return { success: true };
    }
    const docRef = doc(db, TENDERS_COLLECTION, tenderId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting tender:', err);
    return { success: false, error: err.message || 'Fehler beim Löschen.' };
  }
}

/**
 * Hilfsfunktion zur Formatierung des Zeitraums
 */
export function formatTimeframe(tf: TenderTimeframe): string {
  switch (tf) {
    case 'urgent': return 'Dringend / Schnellstmöglich';
    case '1_month': return 'In den nächsten 4 Wochen';
    case '3_months': return 'In den nächsten 1–3 Monaten';
    case 'flexible': return 'Flexibel / Nach Absprache';
    default: return 'Nach Absprache';
  }
}
