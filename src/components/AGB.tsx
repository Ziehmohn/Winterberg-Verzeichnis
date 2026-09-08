import React from 'react';
import { ThemeConfig } from '../types';
import { ArrowLeft } from 'lucide-react';
import { OPERATOR, SITE, PRICING } from '../config';
import { useTranslation } from '../i18n';

interface AGBProps {
  theme: ThemeConfig;
  activeThemeKey: string;
}

export default function AGB({ theme, activeThemeKey }: AGBProps) {
  const { lang } = useTranslation();

  if (lang === 'nl') {
    return (
      <main className="flex-1 w-full max-w-[820px] mx-auto px-6 py-[54px] pb-[80px]">
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 md:p-10 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
          <button 
            onClick={() => {
              window.history.pushState(null, '', '/nl');
              window.dispatchEvent(new Event('popstate'));
            }}
            className="flex items-center gap-2 text-sm font-medium hover:underline mb-6 text-[#4A544D]"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar startpagina
          </button>
          <h1 className="font-display text-[34px] font-bold mb-6">Algemene Voorwaarden (AV)</h1>
          <p className="text-sm opacity-70 mb-8">Stand: {new Date().toLocaleDateString('nl-NL')}</p>
          
          <div className="text-[16px] leading-[1.75] text-[#4A544D] prose prose-sm md:prose-base max-w-none">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Toepassingsbereik</h2>
            <p>
              1.1. Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten betreffende het gebruik van het portaal „{SITE.shortName}" (hierna „Portaal"), die worden gesloten tussen {OPERATOR.shortName} (hierna „Aanbieder") en de desbetreffende klant (hierna „Klant").
            </p>
            <p className="mt-2">
              1.2. Het aanbod van het portaal richt zich uitsluitend op ondernemers in de zin van § 14 BGB, publiekrechtelijke rechtspersonen of publiekrechtelijke bijzondere fondsen (B2B). Een overeenkomst met consumenten (§ 13 BGB) is uitgesloten.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Totstandkoming van de overeenkomst en looptijd</h2>
            <p>
              2.1. De overeenkomst over een Premium-vermelding komt tot stand door de bestelling van de klant en de activering of orderbevestiging door de aanbieder.
            </p>
            <p className="mt-2">
              2.2. De klant kan kiezen tussen een maandelijkse en een jaarlijkse betalingswijze.
            </p>
            <p className="mt-2">
              2.3. Abonnementen worden automatisch verlengd. De opzegtermijn bedraagt {PRICING.cancellationPeriod} tegen het einde van de respectievelijke contractperiode.
            </p>
            <p className="mt-2">
              2.4. <strong>Bijzonderheid bij jaarabonnementen:</strong> Wordt een jaarabonnement niet tijdig opgezegd, dan wordt dit niet met nog een jaar verlengd, maar gaat het automatisch over in een maandelijks opzegbaar abonnement tegen de reguliere maandprijs. De betalingswijze wordt dienovereenkomstig omgezet naar maandelijkse facturatie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Dienstverlening</h2>
            <p>
              3.1. De aanbieder stelt een online bedrijvengids ter beschikking waarin lokale ondernemingen, ambachtslieden en dienstverleners uit {SITE.city} en omgeving zich kunnen presenteren.
            </p>
            <p className="mt-2">
              3.2. De dienst geldt als geleverd zodra de bedrijfsvermelding van de klant met de geboekte functies (Basis of Premium) online beschikbaar is op het portaal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Prijzen en betalingsvoorwaarden</h2>
            <p>
              4.1. Alle op het portaal vermelde prijzen zijn in euro's exclusief de toepasselijke wettelijke btw.
            </p>
            <p className="mt-2">
              4.2. Betaling geschiedt uitsluitend via de betalingsdienstaanbieder {PRICING.paymentProvider}. De klant heeft de keuze uit de door {PRICING.paymentProvider} aangeboden betaalmethoden (bijv. creditcard, SEPA-incasso, iDEAL, PayPal).
            </p>
            <p className="mt-2">
              4.3. Facturatie geschiedt vooraf voor de respectievelijke facturatieperiode (maandelijks of jaarlijks).
            </p>
            <p className="mt-2">
              4.4. De klant ontvangt voor elke facturatieperiode een elektronische factuur. Deze wordt automatisch gegenereerd en ter download aangeboden in het klantaccount of per e-mail verzonden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Banneradvertenties en Skyscraper-reclame</h2>
            <p>
              5.1. De aanbieder biedt klanten de mogelijkheid om skyscraper-reclamebanners in geselecteerde branchecategorieën of in de hele gids te plaatsen.
            </p>
            <p className="mt-2">
              5.2. <strong>Prijzen &amp; staffel voor banneradvertenties:</strong>
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
              <li>1 tot 2 categorieën / subcategorieën: <strong>{PRICING.bannerTier1}</strong> per categorie / maand (excl. btw)</li>
              <li>Vanaf 3 categorieën / subcategorieën: <strong>{PRICING.bannerTier2}</strong> per categorie / maand (excl. btw)</li>
              <li>Vanaf 5 categorieën / subcategorieën: <strong>{PRICING.bannerTier3}</strong> per categorie / maand (excl. btw)</li>
            </ul>
            <p className="mt-2">
              5.3. <strong>Looptijd en opzegging:</strong> Overeenkomsten over banneradvertenties worden automatisch telkens met nog een maand verlengd. De opzegtermijn bedraagt zoals bij het Premium-account <strong>{PRICING.cancellationPeriod} tegen het einde van de respectievelijke maandelijkse facturatieperiode</strong>.
            </p>
            <p className="mt-2">
              5.4. De klant is als enige verantwoordelijk voor de rechtmatigheid van het door hem aangeleverde advertentiemateriaal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Verplichtingen van de klant</h2>
            <p>
              6.1. De klant is als enige verantwoordelijk voor de door hem geplaatste inhoud (teksten, afbeeldingen, links, vacatures etc.). Hij garandeert over alle nodige rechten te beschikken en geen rechten van derden te schenden.
            </p>
            <p className="mt-2">
              6.2. De klant vrijwaart de aanbieder van alle aanspraken van derden die worden ingediend wegens inbreuk op rechten door de geplaatste inhoud.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Aansprakelijkheid</h2>
            <p>
              7.1. De aanbieder biedt geen garantie voor ononderbroken beschikbaarheid van het portaal evenals voor technische storingen.
            </p>
            <p className="mt-2">
              7.2. De aanbieder is onbeperkt aansprakelijk voor opzet en grove nalatigheid. Bij gewone nalatigheid is de aansprakelijkheid beperkt tot de voorzienbare, contracttypische schade.
            </p>
            <p className="mt-2">
              7.3. Aansprakelijkheid voor gederfde winst of gevolgschade is uitgesloten.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Privacy</h2>
            <p>
              8.1. De aanbieder verwerkt persoonsgegevens ter uitvoering van de overeenkomst conform art. 6 lid 1 sub b AVG.
            </p>
            <p className="mt-2">
              8.2. Voor verdere details verwijzen wij naar onze Privacyverklaring.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">9. Herroepingsrecht (uitsluiting)</h2>
            <p>
              Aangezien het aanbod zich uitsluitend richt op ondernemers (B2B) in de zin van § 14 BGB, bestaat er <strong>geen wettelijk herroepingsrecht</strong> voor consumenten conform § 312g BGB.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">10. Slotbepalingen</h2>
            <p>
              10.1. Het recht van de Bondsrepubliek Duitsland is van toepassing.
            </p>
            <p className="mt-2">
              10.2. De bevoegde rechtbank is die van de vestigingsplaats van de aanbieder ({OPERATOR.city}).
            </p>
            <p className="mt-2">
              10.3. Indien individuele bepalingen ongeldig blijken, blijft de geldigheid van de overige bepalingen onaangetast.
            </p>
          </section>
        </div>
      </div>
    </main>
    );
  }

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
            1.1. Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über die Nutzung des Portals „{SITE.shortName}" (nachfolgend „Portal"), die zwischen {OPERATOR.shortName} (nachfolgend „Anbieter") und dem jeweiligen Kunden (nachfolgend „Kunde") geschlossen werden.
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
            2.3. Abonnements verlängern sich automatisch. Die Kündigungsfrist beträgt {PRICING.cancellationPeriod} zum Ende der jeweiligen Vertragslaufzeit.
          </p>
          <p className="mt-2">
            2.4. <strong>Besonderheit bei Jahresabonnements:</strong> Wird ein Jahresabonnement nicht fristgerecht gekündigt, verlängert es sich nicht um ein weiteres Jahr, sondern geht automatisch in ein monatlich kündbares Abonnement zum regulären Monatspreis über. Die Zahlungsweise stellt sich entsprechend auf monatliche Abrechnung um.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Leistungserbringung</h2>
          <p>
            3.1. Der Anbieter stellt ein Online-Verzeichnis zur Verfügung, in dem sich lokale Unternehmen, Handwerker und Dienstleister aus {SITE.city} und Umgebung präsentieren können.
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
            4.2. Die Zahlung erfolgt ausschließlich über den Zahlungsdienstleister {PRICING.paymentProvider}. Dem Kunden stehen die von {PRICING.paymentProvider} zur Verfügung gestellten Zahlungsmittel (z. B. Kreditkarte, SEPA-Lastschrift, PayPal, Giropay) zur Auswahl.
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
            <li>1 bis 2 Kategorien / Unterkategorien: <strong>{PRICING.bannerTier1}</strong> pro Kategorie / Monat (netto zzgl. MwSt.)</li>
            <li>Ab 3 Kategorien / Unterkategorien: <strong>{PRICING.bannerTier2}</strong> pro Kategorie / Monat (netto zzgl. MwSt.)</li>
            <li>Ab 5 Kategorien / Unterkategorien: <strong>{PRICING.bannerTier3}</strong> pro Kategorie / Monat (netto zzgl. MwSt.)</li>
          </ul>
          <p className="mt-2">
            5.3. <strong>Laufzeit und Kündigung:</strong> Verträge über Bannerwerbung verlängern sich automatisch um jeweils einen weiteren Monat. Die Kündigungsfrist beträgt wie beim Premium-Account <strong>{PRICING.cancellationPeriod} zum Ende des jeweiligen monatlichen Abrechnungszeitraums</strong>.
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
            7.2. Für die Zahlungsabwicklung werden notwendige Daten an den Zahlungsdienstleister {PRICING.paymentProvider} übermittelt.
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
            9.2. Ausschließlicher Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist der Sitz des Anbieters ({OPERATOR.city}), da der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
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
