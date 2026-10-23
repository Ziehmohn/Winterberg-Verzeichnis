import React, { useState } from 'react';
import { 
  Hammer, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Mail, 
  HelpCircle, 
  ChevronDown, 
  Plus, 
  Building2, 
  Home, 
  Wrench, 
  Zap, 
  Flame, 
  Paintbrush, 
  TreePine, 
  Layers, 
  Check, 
  ArrowLeft 
} from 'lucide-react';
import { Business, ThemeConfig, TenderProject } from '../types';
import SubmitTenderModal from './SubmitTenderModal';

interface HandwerkerLandingPageProps {
  businesses: Business[];
  theme: ThemeConfig;
  activeThemeKey: string;
  onNavigateAuftragsboerse: () => void;
  onBack: () => void;
}

export default function HandwerkerLandingPage({
  businesses,
  theme,
  activeThemeKey,
  onNavigateAuftragsboerse,
  onBack
}: HandwerkerLandingPageProps) {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const handleTenderCreated = (newTender: TenderProject) => {
    // Navigate to Auftragsbörse
    onNavigateAuftragsboerse();
  };

  const popularTrades = [
    {
      name: 'Heizung & Sanitär',
      desc: 'Wärmepumpen, Heizungstausch, Badsanierung, Wartung',
      icon: Flame,
      color: 'bg-orange-50 text-[#F2761B] border-orange-200'
    },
    {
      name: 'Dachdecker & Klempner',
      desc: 'Dachrinnen, Firstreparaturen, Sturmschäden, Dämmung',
      icon: Home,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      name: 'Elektriker & PV',
      desc: 'Wallboxen, Hausinstallation, Zählerschränke, Beleuchtung',
      icon: Zap,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      name: 'Schreinerei & Holzbau',
      desc: 'Maßmöbel, Türen & Fenster, Skikeller- und FeWo-Ausbau',
      icon: Hammer,
      color: 'bg-emerald-50 text-[#0F4C2E] border-emerald-200'
    },
    {
      name: 'Maler & Lackierer',
      desc: 'Fassadenanstriche, Innenräume, Tapezieren, Spachtelarbeiten',
      icon: Paintbrush,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      name: 'Garten- & Landschaftsbau',
      desc: 'Pflasterarbeiten, Außenanlagen, Terrassen, Baumschnitt',
      icon: TreePine,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      name: 'Bauunternehmen & Maurer',
      desc: 'Sanierung, Durchbrüche, Mauerarbeiten, Kellerabdichtung',
      icon: Layers,
      color: 'bg-stone-50 text-stone-700 border-stone-200'
    },
    {
      name: 'FeWo-Service & Instandhaltung',
      desc: 'Hausmeisterservice, Reparaturen, Bodenverlegung, Pflege',
      icon: Wrench,
      color: 'bg-sky-50 text-sky-700 border-sky-200'
    }
  ];

  const faqs = [
    {
      q: 'Kostet das Ausschreiben eines Auftrags für mich etwas?',
      a: 'Nein, das Einstellen von Ausschreibungen ist für Sie als Auftraggeber zu 100 % kostenlos und unverbindlich. Sie gehen keinerlei Verpflichtung ein.'
    },
    {
      q: 'Wer sieht meine Telefonnummer und Kontaktdaten?',
      a: 'Ihre persönlichen Kontaktdaten (Telefonnummer & E-Mail) sind geschützt. Sie werden niemals öffentlich im Internet gezeigt, sondern nur verifizierten Handwerksbetrieben aus Winterberg und den 14 Ortsteilen zur Verfügung gestellt, damit diese Ihnen ein Angebot unterbreiten können.'
    },
    {
      q: 'Welche Betriebe können sich bei mir melden?',
      a: 'Ausschließlich lokale Fachbetriebe und Handwerker, die in Winterberg und den zugehörigen Ortsteilen ansässig und im Winterberg-Verzeichnis eingetragen sind. Keine anonymen Vermittlungsportale oder Betriebe mit stundenlangen Anfahrtswegen.'
    },
    {
      q: 'Wie schnell melden sich Handwerker bei mir?',
      a: 'Sobald Sie Ihren Auftrag absenden, werden passende Betriebe des jeweiligen Gewerks direkt informiert. Bei dringenden Reparaturen melden sich Betriebe in der Regel innerhalb von 24 bis 48 Stunden.'
    },
    {
      q: 'Was passiert, wenn ich einen Handwerker gefunden habe?',
      a: 'Sie erhalten nach dem Absenden einen persönlichen Verwaltungscode per E-Mail. Mit einem Klick auf Ihren persönlichen Link können Sie den Auftrag jederzeit als „vergeben“ markieren. Damit wird die Ausschreibung sofort geschlossen und Sie erhalten keine weiteren Anfragen.'
    },
    {
      q: 'Kann ich die Ausschreibung auch für Ferienwohnungen oder Zweitwohnsitze nutzen?',
      a: 'Ja, absolut! Viele Eigentümer von Ferienhäusern und Ferienwohnungen in Winterberg wohnen nicht dauerhaft vor Ort. Die Auftragsbörse ist der einfachste Weg, verlässliche Handwerker vor Ort zu finden, ohne aus der Ferne etliche Betriebe abtelefonieren zu müssen.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1B211D]">
      
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5F6B63] hover:text-[#0F4C2E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
          </button>
          
          <button
            onClick={onNavigateAuftragsboerse}
            className="text-xs font-semibold text-[#0F4C2E] hover:underline flex items-center gap-1"
          >
            Direkt zur Auftragsbörse <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="bg-[#0F4C2E] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F2761B]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F2761B] text-white shadow-sm">
            <Hammer className="w-3.5 h-3.5" /> Winterberger Auftragsbörse • 100% Kostenlos für Auftraggeber
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Handwerker in Winterberg finden – <br className="hidden sm:block" />
            <span className="text-[#F2761B]">ohne Telefon-Marathon.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Ob neue Heizung, Dachreparatur, Malerarbeiten oder Badsanierung: Schreiben Sie Ihr Vorhaben in 2 Minuten kostenlos aus. Geprüfte Fachbetriebe aus Winterberg und den 14 Ortsteilen melden sich direkt bei Ihnen mit konkreten Angeboten.
          </p>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#F2761B] hover:bg-[#d65f0c] text-white font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Auftrag jetzt kostenlos aufgeben
            </button>
            <button
              onClick={onNavigateAuftragsboerse}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            >
              Aktuelle Ausschreibungen ansehen <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Chips */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-white/80">
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Über 70 lokale Fachbetriebe</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-[#F2761B]" />
              <span>Winterberg & alle 14 Ortsteile</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Unverbindlich & DSGVO-konform</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM VS. SOLUTION SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C2E] bg-[#0F4C2E]/10 px-3 py-1 rounded-full">
            Schluss mit Frust
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B211D] mt-3">
            Handwerkersuche im Sauerland: Früher vs. Heute
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Früher */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-200/80 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800">
              ❌ Bisher: Mühsam & zeitraubend
            </div>
            <h3 className="text-lg font-bold text-red-900">10 Betriebe anrufen & vergeblich warten</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[#5F6B63]">
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Niemand erreichbar: Mailboxen, besetzte Leitungen oder Baustellen-Einsätze.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Keine Kapazitäten: Erst nach langem Erklären erfährt man, dass der Betrieb monatelang ausgebucht ist.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Teure Anfahrt von auswärts: Bundesweite Portale vermitteln Firmen aus 60 km Entfernung.</span>
              </li>
            </ul>
          </div>

          {/* Heute mit der Auftragsbörse */}
          <div className="bg-emerald-50/60 rounded-2xl p-6 sm:p-8 border border-emerald-300 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-[#0F4C2E] text-white">
              ✓ Neu: Die Winterberger Auftragsbörse
            </div>
            <h3 className="text-lg font-bold text-[#0F4C2E]">1x ausschreiben – Betriebe melden sich bei Ihnen</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[#1B211D]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Nur verfügbare Betriebe:</strong> Es melden sich ausschließlich Handwerker, die gerade Zeit haben.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Echte Sauerländer Betriebe:</strong> Kurze Wege, faire Preise und persönliche Ansprechpartner vor Ort.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Beenden mit einem Klick:</strong> Sobald Ihr Projekt vergeben ist, schließen Sie das Gesuch sofort.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SO FUNKTIONIERT'S SECTION */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F2761B] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              In 3 Schritten zum passenden Handwerker
            </span>
            <h2 className="text-3xl font-extrabold text-[#1B211D] mt-3">
              So einfach vergeben Sie Ihren Auftrag
            </h2>
            <p className="text-sm text-[#5F6B63] mt-2">
              Kein Fachchinesisch, kein langes Registrieren. Einfach und direkt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-7 border border-[#EDE8E0] space-y-3 relative">
              <div className="w-12 h-12 bg-[#0F4C2E] text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-[#1B211D]">Projekt beschreiben</h3>
              <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
                Wählen Sie das passende Gewerk (z. B. Heizung, Dach, Elektro), Ihren Winterberger Ortsteil und beschreiben Sie kurz das Anliegen. Fotos können direkt mit hochgeladen werden.
              </p>
              <div className="pt-2 text-xs font-bold text-[#0F4C2E]">
                ⏱ Dauert nur ca. 2 Minuten
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-7 border border-[#EDE8E0] space-y-3 relative">
              <div className="w-12 h-12 bg-[#F2761B] text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-[#1B211D]">Betriebe werden informiert</h3>
              <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
                Lokale Handwerksbetriebe aus Ihrer Sparte in Winterberg erhalten die Information zu Ihrem Projekt und können die Details sofort einsehen.
              </p>
              <div className="pt-2 text-xs font-bold text-[#F2761B]">
                📍 100% regional aus dem Sauerland
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-7 border border-[#EDE8E0] space-y-3 relative">
              <div className="w-12 h-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-[#1B211D]">Angebote erhalten & beauftragen</h3>
              <p className="text-xs sm:text-sm text-[#5F6B63] leading-relaxed">
                Interessierte Handwerker nehmen telefonisch oder per E-Mail Kontakt mit Ihnen auf. Sie vergleichen Angebote in Ruhe und entscheiden völlig frei.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-800">
                🤝 Ohne Bindung oder Provision
              </div>
            </div>
          </div>

          {/* CTA Box under steps */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F4C2E] hover:bg-[#0c3c24] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Jetzt kostenlos eigenes Projekt ausschreiben
            </button>
          </div>
        </div>
      </section>

      {/* BELIEBTE GEWERKE SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C2E] bg-[#0F4C2E]/10 px-3 py-1 rounded-full">
            Breites Netzwerk
          </span>
          <h2 className="text-3xl font-extrabold text-[#1B211D] mt-3">
            Für jedes Vorhaben der passende Fachbetrieb
          </h2>
          <p className="text-sm text-[#5F6B63] mt-2">
            Ob dringende Reparatur oder Großprojekt – in der Winterberger Auftragsbörse finden Sie Spezialisten für alle Gewerke.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTrades.map((trade, i) => {
            const Icon = trade.icon;
            return (
              <div 
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#E7E2DA] hover:border-[#0F4C2E]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${trade.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1B211D]">{trade.name}</h3>
                  <p className="text-xs text-[#5F6B63] mt-1 leading-relaxed">{trade.desc}</p>
                </div>
                
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="mt-4 text-[11px] font-bold text-[#0F4C2E] hover:text-[#F2761B] inline-flex items-center gap-1 transition-colors"
                >
                  Projekt ausschreiben <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* VORTEILE FÜR FEWO-EIGENTÜMER & ZWEITWOHNSITZLER */}
      <section className="bg-[#FAF8F5] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#E7E2DA]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F2761B] bg-orange-100/70 px-3 py-1 rounded-full">
              Spezial-Tipp für Vermieter & Zweitwohnsitz
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B211D]">
              Ferienhaus oder Zweitwohnsitz in Winterberg?
            </h2>
            <p className="text-sm text-[#5F6B63] leading-relaxed">
              Sie wohnen nicht dauerhaft im Sauerland und brauchen dringend einen verlässlichen Handwerker für Ihre Gäste-Unterkunft? Die Auftragsbörse ist ideal für Sie:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#1B211D]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fotos vom Schaden direkt anhängen für präzise Ferneinschätzung.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Handwerker aus dem genauen Ortsteil (z. B. Altastenberg, Neuastenberg, Züschen).</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reibungslose Abstimmung per Telefon oder E-Mail nach Wunsch.</span>
              </li>
            </ul>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E2DA] shadow-md space-y-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-[#0F4C2E] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Home className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#1B211D]">Handwerker für Ihr Ferienobjekt gesucht?</h3>
              <p className="text-xs text-[#5F6B63] max-w-sm mx-auto">
                Starten Sie jetzt kostenlos Ihre Ausschreibung und finden Sie Partner für Sanitär, Malerarbeiten, Instandhaltung oder Reparaturen.
              </p>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-3 bg-[#F2761B] hover:bg-[#d65f0c] text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
              >
                Jetzt Auftrag für FeWo / Haus ausschreiben
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C2E] bg-[#0F4C2E]/10 px-3 py-1 rounded-full">
            Häufige Fragen
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B211D] mt-3">
            Fragen & Antworten zur Auftragsbörse
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl border border-[#E7E2DA] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1B211D] hover:text-[#0F4C2E]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#5F6B63] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#F2761B]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-0 text-xs sm:text-sm text-[#5F6B63] leading-relaxed border-t border-gray-100 mt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="bg-[#0F4C2E] text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            Bereit für Ihr nächstes Projekt?
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Geben Sie jetzt kostenlos Ihre Ausschreibung auf und lassen Sie sich Angebote von Winterberger Handwerkern direkt zuschicken.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F2761B] hover:bg-[#d65f0c] text-white font-bold text-sm rounded-xl shadow-xl transition-all cursor-pointer transform active:scale-95"
            >
              <Plus className="w-5 h-5" /> Kostenlos Auftrag ausschreiben
            </button>
          </div>
        </div>
      </section>

      {/* CREATE TENDER MODAL */}
      <SubmitTenderModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onTenderCreated={handleTenderCreated}
        theme={theme}
      />

    </div>
  );
}
