import React from 'react';
import { ThemeConfig } from '../types';
import { ArrowLeft } from 'lucide-react';

interface AGBProps {
  theme: ThemeConfig;
  activeThemeKey: string;
}

export default function AGB({ theme, activeThemeKey }: AGBProps) {
  return (
    <main className="flex-1 w-full max-w-[820px] mx-auto px-6 py-[54px] pb-[80px]">
      <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 md:p-10 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
        <button 
          onClick={() => {
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="flex items-center gap-2 text-sm font-medium hover:underline mb-6 text-[#4A544D]"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </button>
        <h1 className="font-display text-[34px] font-bold mb-6">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="text-sm opacity-70 mb-8">Stand: {new Date().toLocaleDateString('de-DE')}</p>
        
        <div className="text-[16px] leading-[1.75] text-[#4A544D] prose prose-sm md:prose-base max-w-none">
        <section>
          <h2 className="text-xl font-bold mb-3">1. Geltungsbereich</h2>
          <p>
            1.1. Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über die Nutzung des Portals "Winterberg Wirtschaft" (nachfolgend "Portal"), die zwischen SICHTBAR SEO Simon Kräling (nachfolgend "Anbieter") und dem jeweiligen Kunden (nachfolgend "Kunde") geschlossen werden.
          </p>
          <p className="mt-2">
            1.2. Das Angebot des Portals richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB, juristische Personen des öffentlichen Rechts oder öffentlich-rechtliche Sondervermögen (B2B). Ein Vertragsschluss mit Verbrauchern (§ 13 BGB) ist ausgeschlossen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Vertragsschluss und Laufzeit</h2>
          <p>
            2.1. Der Vertrag über einen Premium-Eintrag kommt durch die Bestellung des Kunden und die Freischaltung oder Auftragsbestätigung durch den Anbieter zustande.
          </p>
          <p className="mt-2">
            2.2. Der Kunde kann zwischen einer monatlichen und einer jährlichen Zahlungsweise wählen.
          </p>
          <p className="mt-2">
            2.3. Abonnements verlängern sich automatisch. Die Kündigungsfrist beträgt 14 Tage zum Ende der jeweiligen Vertragslaufzeit.
          </p>
          <p className="mt-2">
            2.4. <strong>Besonderheit bei Jahresabonnements:</strong> Wird ein Jahresabonnement nicht fristgerecht gekündigt, verlängert es sich nicht um ein weiteres Jahr, sondern geht automatisch in ein monatlich kündbares Abonnement zum regulären Monatspreis über. Die Zahlungsweise stellt sich entsprechend auf monatliche Abrechnung um.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Leistungserbringung</h2>
          <p>
            3.1. Der Anbieter stellt ein Online-Verzeichnis zur Verfügung, in dem sich lokale Unternehmen, Handwerker und Dienstleister aus Winterberg und Umgebung präsentieren können.
          </p>
          <p className="mt-2">
            3.2. Die Leistung gilt als erbracht, sobald der Firmeneintrag des Kunden mit den gebuchten Funktionen (Basis oder Premium) auf dem Portal online abrufbar ist.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Preise und Zahlungsbedingungen</h2>
          <p>
            4.1. Alle auf dem Portal angegebenen Preise verstehen sich in Euro zuzüglich der jeweils gültigen gesetzlichen Mehrwertsteuer.
          </p>
          <p className="mt-2">
            4.2. Die Zahlung erfolgt ausschließlich über den Zahlungsdienstleister Stripe. Dem Kunden stehen die von Stripe zur Verfügung gestellten Zahlungsmittel (z. B. Kreditkarte, SEPA-Lastschrift, PayPal, Giropay) zur Auswahl.
          </p>
          <p className="mt-2">
            4.3. Die Abrechnung erfolgt im Voraus für den jeweiligen Abrechnungszeitraum (monatlich oder jährlich).
          </p>
          <p className="mt-2">
            4.4. Der Kunde erhält für jeden Abrechnungszeitraum eine elektronische Rechnung. Diese wird automatisch generiert und im Kundenkonto zum Download bereitgestellt oder per E-Mail versendet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Bannerwerbung und Skyscraper-Anzeigen</h2>
          <p>
            5.1. Der Anbieter bietet Kunden die Möglichkeit, Skyscraper-Werbebanner in ausgewählten Branchenkategorien (sowohl Oberkategorien als auch spezifische Unterkategorien) oder verzeichnisweit auf dem Portal zu schalten.
          </p>
          <p className="mt-2">
            5.2. <strong>Preise &amp; Mengenstaffel für Bannerwerbung (gilt für Ober- und Unterkategorien):</strong>
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
            <li>1 bis 2 Kategorien / Unterkategorien: <strong>24,95 €</strong> pro Kategorie / Monat (netto zzgl. MwSt.)</li>
            <li>Ab 3 Kategorien / Unterkategorien: <strong>19,95 €</strong> pro Kategorie / Monat (netto zzgl. MwSt.)</li>
            <li>Ab 5 Kategorien / Unterkategorien: <strong>14,95 €</strong> pro Kategorie / Monat (netto zzgl. MwSt.)</li>
          </ul>
          <p className="mt-2">
            5.3. <strong>Laufzeit und Kündigung:</strong> Verträge über Bannerwerbung verlängern sich automatisch um jeweils einen weiteren Monat. Die Kündigungsfrist beträgt wie beim Premium-Account <strong>14 Tage zum Ende des jeweiligen monatlichen Abrechnungszeitraums</strong>.
          </p>
          <p className="mt-2">
            5.4. Der Kunde ist für die Rechtmäßigkeit der von ihm bereitgestellten Werbegrafiken und Links allein verantwortlich. Der Anbieter behält sich vor, Banner abzulehnen oder zu sperren, die gegen gesetzliche Vorgaben oder die guten Sitten verstoßen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Pflichten des Kunden</h2>
          <p>
            5.1. Der Kunde ist allein für die von ihm eingestellten Inhalte (Texte, Bilder, Links, Stellenanzeigen etc.) verantwortlich. Er garantiert, dass er über alle erforderlichen Rechte verfügt und diese keine Rechte Dritter verletzen.
          </p>
          <p className="mt-2">
            5.2. Der Kunde stellt den Anbieter von sämtlichen Ansprüchen Dritter frei, die wegen einer Rechtsverletzung durch die eingestellten Inhalte geltend gemacht werden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Haftung</h2>
          <p>
            6.1. Der Anbieter übernimmt keine Gewähr für die ständige und ununterbrochene Verfügbarkeit des Portals sowie für technische Ausfälle.
          </p>
          <p className="mt-2">
            6.2. Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Für einfache Fahrlässigkeit haftet der Anbieter nur bei Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht). Die Haftung ist in diesem Fall auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
          </p>
          <p className="mt-2">
            6.3. Eine Haftung für entgangenen Gewinn, ausgebliebene Einsparungen oder sonstige mittelbare und Folgeschäden ist ausgeschlossen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Hinweise zum Datenschutz</h2>
          <p>
            7.1. Der Anbieter verarbeitet personenbezogene Daten des Kunden (z.B. Name, E-Mail, Zahlungsdaten) zur Vertragserfüllung und Abrechnung gemäß Art. 6 Abs. 1 lit. b DSGVO.
          </p>
          <p className="mt-2">
            7.2. Für die Zahlungsabwicklung werden notwendige Daten an den Zahlungsdienstleister Stripe übermittelt.
          </p>
          <p className="mt-2">
            7.3. Weitere Informationen zur Verarbeitung und Speicherung von Daten entnehmen Sie bitte unserer Datenschutzerklärung.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. Widerrufsrecht (Ausschluss)</h2>
          <p>
            Da sich das Angebot des Portals ausschließlich an Unternehmer (B2B) im Sinne des § 14 BGB richtet, besteht <strong>kein gesetzliches Widerrufsrecht</strong> für Verbraucher gemäß § 312g BGB.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">9. Schlussbestimmungen</h2>
          <p>
            9.1. Es gilt das Recht der Bundesrepublik Deutschland.
          </p>
          <p className="mt-2">
            9.2. Ausschließlicher Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist der Sitz des Anbieters (Winterberg), da der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
          </p>
          <p className="mt-2">
            9.3. Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
          </p>
        </section>
      </div>
    </div>
    </main>
  );
}
