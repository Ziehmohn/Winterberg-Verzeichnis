import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { ThemeConfig } from '../types';

export default function Datenschutz({ theme, onBack }: { theme: ThemeConfig, onBack: () => void }) {
  return (
    <main className="flex-1 w-full max-w-[820px] mx-auto px-6 py-[54px] pb-[80px]">
      <div className="bg-white border border-[#EDE8E0] rounded-[22px] p-6 md:p-10 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
        <h1 className="font-display text-[34px] font-bold mb-6">Datenschutzerklärung</h1>
        <div className="text-[16px] leading-[1.75] text-[#4A544D] prose prose-sm md:prose-base max-w-none">
        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-2">1. Datenschutz auf einen Blick</h2>
          <h3 className="font-bold mt-4 mb-2">Allgemeine Hinweise</h3>
          <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-2">2. Hosting und Content Delivery Networks (CDN)</h2>
          <h3 className="font-bold mt-4 mb-2">Vercel</h3>
          <p>Wir hosten unsere Website bei Vercel. Anbieter ist die Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Wenn Sie unsere Website besuchen, erfasst Vercel verschiedene Logfiles inklusive Ihrer IP-Adressen. Details finden Sie in der Datenschutzerklärung von Vercel: https://vercel.com/legal/privacy-policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-2">3. Datenerfassung auf dieser Website</h2>
          <h3 className="font-bold mt-4 mb-2">Cookies & Local Storage</h3>
          <p>Unsere Website nutzt "Cookies" und ähnliche Technologien (z.B. HTML5 Local Storage). Dabei handelt es sich um kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Wir nutzen diese, um Ihre Cookie-Einwilligungen (Consent-Management) für 6 Monate lokal zu speichern.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-2">4. Google & Firebase Dienste</h2>
          <p>Diese Seite nutzt Dienste der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.</p>
          <h3 className="font-bold mt-4 mb-2">Google Firebase (Hosting, Datenbank, Auth)</h3>
          <p>Wir nutzen Google Firebase zur Bereitstellung der Kernfunktionen unserer App (Datenbank, Bildspeicher, Nutzer-Authentifizierung). Firebase speichert unter anderem IP-Adressen und ggf. E-Mail-Adressen (beim Login) auf sicheren Servern. Wir haben einen Auftragsverarbeitungsvertrag (AVV) mit Google geschlossen.</p>
          
          <h3 className="font-bold mt-4 mb-2">Google Analytics</h3>
          <p>Soweit Sie Ihre Einwilligung erklärt haben (über unser Cookie-Banner), wird auf dieser Website Google Analytics 4 eingesetzt. Wir haben die IP-Anonymisierung auf dieser Website aktiviert. Die erfassten Daten werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 border-b pb-2">5. Zahlungsanbieter</h2>
          <h3 className="font-bold mt-4 mb-2">Stripe</h3>
          <p>Wir bieten die Möglichkeit an, kostenpflichtige Dienste auf unserer Website zu nutzen. Für die Zahlungsabwicklung nutzen wir Stripe. Anbieter ist die Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland.</p>
          <p>Wenn Sie sich für eine Zahlungsart von Stripe entscheiden, werden die von Ihnen eingegebenen Zahlungsdaten an Stripe übermittelt. Dies ist zur Erfüllung unseres Vertrags mit Ihnen erforderlich (Art. 6 Abs. 1 lit. b DSGVO).</p>
        </section>

        <div className="p-4 bg-gray-50 border rounded-lg text-sm italic text-gray-600 mt-8">
          <strong>Hinweis:</strong> Dies ist eine Vorlage zur Datenschutzerklärung. Um vollständige Rechtssicherheit zu erlangen, lassen Sie diese Erklärung idealerweise von einem Anwalt prüfen oder nutzen Sie Dienste wie eRecht24 zur Vervollständigung (z.B. Impressum, Kontaktdaten des Verantwortlichen, Betroffenenrechte).
        </div>
      </div>
    </div>
    </main>
  );
}
