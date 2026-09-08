import React from 'react';
import { ThemeConfig } from '../types';
import { OPERATOR, SITE } from '../config';
import { useTranslation } from '../i18n';

export default function Impressum({ theme, activeThemeKey }: { theme: ThemeConfig, activeThemeKey: string }) {
  const { lang } = useTranslation();

  if (lang === 'nl') {
    return (
      <main className="flex-1 w-full max-w-[820px] mx-auto px-6 py-[54px] pb-[80px]">
        <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 md:p-10 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
          <h1 className="font-display text-[34px] font-bold mb-6">Colofon</h1>
          <div className="text-[16px] leading-[1.75] text-[#4A544D] prose prose-sm md:prose-base max-w-none">
            <p className="font-bold">Informatie conform § 5 TMG</p>
            <p>
              {OPERATOR.name}<br />
              {OPERATOR.street}<br />
              {OPERATOR.zip} {OPERATOR.city}
            </p>

            <p>
              <strong>Telefoon:</strong> {OPERATOR.phone}<br />
              <strong>E-mail:</strong> {OPERATOR.email}
            </p>

            <p className="font-bold mt-6">Btw-identificatienummer conform § 27a UStG</p>
            <p>{OPERATOR.vatId}</p>

            <p className="font-bold mt-6">Inhoudelijk verantwoordelijk volgens § 18 lid 2 MStV</p>
            <p>Simon Kräling, {OPERATOR.street}, {OPERATOR.zip} {OPERATOR.city}</p>

            <h3 className="text-xl font-bold mt-8 mb-4">Aansprakelijkheid voor inhoud</h3>
            <p>
              De inhoud van onze pagina's is met de grootste zorgvuldigheid samengesteld. Wij kunnen echter niet instaan voor de juistheid, volledigheid en actualiteit van de inhoud.
            </p>
            <p>
              Als dienstverlener zijn wij overeenkomstig § 7 lid 1 TMG volgens de algemene wetgeving verantwoordelijk voor onze eigen inhoud op deze pagina's. Volgens §§ 8 tot 10 TMG zijn wij als dienstverlener echter niet verplicht om doorgegeven of opgeslagen informatie van derden te monitoren of te zoeken naar omstandigheden die duiden op illegale activiteiten. Verplichtingen tot het verwijderen of blokkeren van het gebruik van informatie volgens de algemene wetgeving blijven onverlet. Aansprakelijkheid dienaangaande is echter pas mogelijk vanaf het moment dat kennis wordt genomen van een concrete inbreuk. Zodra wij op de hoogte zijn van dergelijke inbreuken, zullen wij deze inhoud onmiddellijk verwijderen.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Aansprakelijkheid voor links</h3>
            <p>
              Ons aanbod bevat links naar externe websites van derden, op de inhoud waarvan wij geen invloed hebben. Daarom kunnen wij voor deze externe inhoud ook geen aansprakelijkheid aanvaarden. Voor de inhoud van de gelinkte pagina's is altijd de betreffende aanbieder of exploitant van de pagina's verantwoordelijk. De gelinkte pagina's zijn op het moment van linken gecontroleerd op mogelijke wettelijke overtredingen. Onrechtmatige inhoud was op het moment van linken niet herkenbaar. Een permanente inhoudelijke controle van de gelinkte pagina's is echter niet redelijk zonder concrete aanwijzingen voor een wettelijke overtreding. Zodra wij op de hoogte zijn van inbreuken, zullen wij dergelijke links onmiddellijk verwijderen.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Auteursrecht</h3>
            <p>
              De door de beheerders van de website gemaakte inhoud en werken op deze pagina's vallen onder het Duitse auteursrecht. Bijdragen van derden zijn als zodanig aangeduid. Voor vermenigvuldiging, bewerking, verspreiding en elke vorm van exploitatie buiten de grenzen van het auteursrecht is schriftelijke toestemming van de betreffende auteur of maker vereist. Downloads en kopieën van deze pagina zijn uitsluitend voor privé, niet-commercieel gebruik toegestaan.
            </p>
            <p>
              De exploitanten van de pagina's streven ernaar om altijd de auteursrechten van anderen te respecteren of om zelf gecreëerde en royaltyvrije werken te gebruiken.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-[820px] mx-auto px-6 py-[54px] pb-[80px]">
      <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 md:p-10 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
        <h1 className="font-display text-[34px] font-bold mb-6">Impressum</h1>
        <div className="text-[16px] leading-[1.75] text-[#4A544D] prose prose-sm md:prose-base max-w-none">
        <p className="font-bold">Angaben gemäß § 5 TMG</p>
        <p>
          {OPERATOR.name}<br />
          {OPERATOR.street}<br />
          {OPERATOR.zip} {OPERATOR.city}
        </p>

        <p>
          <strong>Telefon:</strong> {OPERATOR.phone}<br />
          <strong>E-Mail:</strong> {OPERATOR.email}
        </p>

        <p className="font-bold mt-6">Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG</p>
        <p>{OPERATOR.vatId}</p>

        <p className="font-bold mt-6">Inhaltlich verantwortlich i.S.v. § 18 Abs. 2 MStV</p>
        <p>Simon Kräling, {OPERATOR.street}, {OPERATOR.zip} {OPERATOR.city}</p>

        <h3 className="text-xl font-bold mt-8 mb-4">Haftung für Inhalte</h3>
        <p>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        </p>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei bekannt werden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei bekannt werden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">Urheberrecht</h3>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
        <p>
          Die Betreiber der Seiten sind bemüht, stets die Urheberrechte anderer zu beachten bzw. auf selbst erstellte sowie lizenzfreie Werke zurückzugreifen.
        </p>
        </div>
      </div>
    </main>
  );
}
