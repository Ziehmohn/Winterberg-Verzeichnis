import React from 'react';
import { ThemeConfig } from '../types';

export default function Impressum({ theme, activeThemeKey }: { theme: ThemeConfig, activeThemeKey: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto p-6 md:p-10 border my-10 ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'}`}>
      <h1 className="text-3xl font-display font-bold mb-8">Impressum</h1>
      
      <div className={`prose prose-sm md:prose-base max-w-none ${theme.textBase}`}>
        <p className="font-bold">Angaben gemäß § 5 TMG</p>
        <p>
          SICHTBAR SEO – Simon Kräling<br />
          Schanzenstraße 28<br />
          59955 Winterberg
        </p>

        <p>
          <strong>Telefon:</strong> +49 1520 654 29 96<br />
          <strong>E-Mail:</strong> info@sichtbar-online.com
        </p>

        <p className="font-bold mt-6">Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG</p>
        <p>DE336471774</p>

        <p className="font-bold mt-6">Inhaltlich verantwortlich i.S.v. § 18 Abs. 2 MStV</p>
        <p>Simon Kräling, Schanzenstraße 28, 59955 Winterberg</p>

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
  );
}
