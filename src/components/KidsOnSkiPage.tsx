import React, { useEffect, useMemo } from 'react';
import {
  Snowflake,
  Calendar,
  CheckCircle2,
  Users,
  Building2,
  ArrowDown,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Info,
  ClipboardList,
  MapPin
} from 'lucide-react';
import { Business, ThemeConfig } from '../types';
import { getBusinessPath } from '../utils/routes';
import { useTranslation } from '../i18n';

interface KidsOnSkiPageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  onSelectBusiness?: (bus: Business) => void;
  onBack?: () => void;
  onNavigateSkiTheme?: () => void;
}

interface PartnerEntry {
  name: string;
  type: 'Unterkunft' | 'Skigebiet' | 'Skischule / Skiverleih';
  typeNl: 'Accommodatie' | 'Skigebied' | 'Skischool / Skiverhuur';
  matchNames: string[];
  note?: string;
  noteNl?: string;
}

const PARTNER_ENTRIES: PartnerEntry[] = [
  {
    name: 'Hapimag Resort Winterberg',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Hapimag Resort Winterberg', 'Hapimag']
  },
  {
    name: 'Landal Winterberg',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Landal Winterberg']
  },
  {
    name: 'Vakantiehotel Der Brabander',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Vakantiehotel Der Brabander', 'Der Brabander']
  },
  {
    name: 'Hotel Hessenhof',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Hotel Hessenhof', 'Hessenhof']
  },
  {
    name: 'Hotel Niedersfeld',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Hotel Niedersfeld']
  },
  {
    name: 'Hotel Nuhnetal',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Hotel Nuhnetal']
  },
  {
    name: 'Hotel Clemens',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Hotel Clemens']
  },
  {
    name: 'Hotel Schneider',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Hotel Schneider', 'Hotel Schneider Winterberg']
  },
  {
    name: 'Hotel Engemann Kurve',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Hotel Engemann Kurve', 'Engemann Kurve']
  },
  {
    name: 'Hostel Erlebnisberg Kappe',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['Hostel Erlebnisberg Kappe', 'Erlebnisberg Kappe']
  },
  {
    name: 'Pension De Gasterei',
    type: 'Unterkunft',
    typeNl: 'Accommodatie',
    matchNames: ['De Gasterei', 'Pension De Gasterei']
  },
  {
    name: 'Skiliftkarussell Winterberg',
    type: 'Skigebiet',
    typeNl: 'Skigebied',
    matchNames: ['Skiliftkarussell Winterberg']
  },
  {
    name: 'Skiverleih Schneider',
    type: 'Skischule / Skiverleih',
    typeNl: 'Skischool / Skiverhuur',
    matchNames: ['Skiverleih Schneider']
  },
  {
    name: 'Skihütte & Skischule Der Brabander',
    type: 'Skischule / Skiverleih',
    typeNl: 'Skischool / Skiverhuur',
    matchNames: ['Skihütte Der Brabander', 'Skischule Der Brabander']
  }
];

const ACTION_WEEKS = [
  { kw: 'KW 49', datesDe: '29. November – 04. Dezember 2026', datesNl: '29 november – 4 december 2026' },
  { kw: 'KW 50', datesDe: '06. – 11. Dezember 2026', datesNl: '6 – 11 december 2026' },
  { kw: 'KW 51', datesDe: '13. – 18. Dezember 2026', datesNl: '13 – 18 december 2026' },
  { kw: 'KW 03', datesDe: '17. – 22. Januar 2027', datesNl: '17 – 22 januari 2027' },
  { kw: 'KW 11', datesDe: '14. – 19. März 2027', datesNl: '14 – 19 maart 2027' },
  { kw: 'KW 14', datesDe: '04. – 09. April 2027', datesNl: '4 – 9 april 2027' },
  { kw: 'KW 15', datesDe: '11. – 16. April 2027', datesNl: '11 – 16 april 2027' }
];

export const KidsOnSkiPage: React.FC<KidsOnSkiPageProps> = ({
  businesses,
  onSelectBusiness,
  onBack,
  onNavigateSkiTheme
}) => {
  const { lang } = useTranslation();
  const isNl = lang === 'nl';

  useEffect(() => {
    document.title = isNl
      ? 'Kids on Ski Winterberg: Gratis skivakantie voor kinderen (3–5 jaar)'
      : 'Kids on Ski Winterberg: Kostenloser Skiurlaub für Kinder (3–5 Jahre)';

    const desc = isNl
      ? 'Feitelijke informatie over Kids on Ski in Winterberg: voorwaarden, inbegrepen diensten, actieperiodes 2026/27, deelnemende bedrijven en aanmelding.'
      : 'Sachliche Übersicht zu Kids on Ski in Winterberg (Winterberg Touristik und Wirtschaft GmbH): Zielgruppe, Leistungen, Zeiträume 2026/27, Partnerbetriebe und Anmeldung.';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [isNl]);

  const resolvedPartners = useMemo(() => {
    return PARTNER_ENTRIES.map((entry) => {
      const matched = businesses.find((b) =>
        entry.matchNames.some((m) => b.name.toLowerCase() === m.toLowerCase())
      ) || businesses.find((b) =>
        entry.matchNames.some((m) => b.name.toLowerCase().includes(m.toLowerCase()))
      );
      return { ...entry, business: matched };
    });
  }, [businesses]);

  const accommodations = resolvedPartners.filter((p) => p.type === 'Unterkunft');
  const skiPartners = resolvedPartners.filter((p) => p.type !== 'Unterkunft');

  const handleBusinessClick = (e: React.MouseEvent, bus?: Business) => {
    if (!bus || !onSelectBusiness) return;
    e.preventDefault();
    onSelectBusiness(bus);
  };

  return (
    <main className="flex-1 w-full max-w-[1040px] mx-auto px-4 sm:px-6 py-6 pb-20 font-sans text-[#1B211D] dark:text-gray-100">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#5F6B63] mb-6 flex-wrap" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-[#0F4C2E] underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs"
        >
          {isNl ? 'Home' : 'Startseite'}
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={onNavigateSkiTheme}
          className="hover:text-[#0F4C2E] underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs"
        >
          {isNl ? 'Skiën in Winterberg' : 'Skifahren in Winterberg'}
        </button>
        <span>/</span>
        <span className="font-semibold text-[#1B211D] dark:text-white">Kids on Ski</span>
      </nav>

      {/* Header */}
      <header className="rounded-2xl bg-slate-900 text-white p-6 sm:p-10 mb-8 border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
            <Snowflake className="w-4 h-4" />
            <span>Winterberg Touristik und Wirtschaft GmbH</span>
          </div>

          <a
            href="#mitmachen"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>{isNl ? 'Direct naar: Hoe kan ik meedoen?' : 'Direkt zu: Wie kann ich mitmachen?'}</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
          {isNl
            ? 'Kids on Ski Winterberg – Gratis skivakantie voor kinderen (3–5 jaar)'
            : 'Kids on Ski Winterberg – Kostenloser Skiurlaub für Kinder (3–5 Jahre)'}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mb-6">
          {isNl
            ? 'Sachliche informatie over het programma „Kids on Ski“ in Winterberg, aangeboden door de Winterberg Touristik und Wirtschaft GmbH in samenwerking met lokale partnerbedrijven.'
            : 'Sachliche Übersicht über das Förderprogramm „Kids on Ski“ in Winterberg – ein Angebot der Winterberg Touristik und Wirtschaft GmbH in Zusammenarbeit mit teilnehmenden Partnerbetrieben.'}
        </p>

        {/* Anchor Navigation inside Header */}
        <nav className="flex flex-wrap gap-2 text-xs" aria-label={isNl ? 'Paginanavigatie' : 'Seitennavigation'}>
          <a href="#worum-gehts" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-100 transition-colors">
            {isNl ? '1. Waar gaat het over?' : '1. Worum geht’s?'}
          </a>
          <a href="#fuer-wen" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-100 transition-colors">
            {isNl ? '2. Voor wie?' : '2. Für wen?'}
          </a>
          <a href="#leistungen" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-100 transition-colors">
            {isNl ? '3. Inbegrepen diensten' : '3. Leistungen'}
          </a>
          <a href="#zeitraum" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-100 transition-colors">
            {isNl ? '4. Periode' : '4. Zeitraum'}
          </a>
          <a href="#partner" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-100 transition-colors">
            {isNl ? '5. Deelnemers' : '5. Wer macht mit?'}
          </a>
          <a href="#mitmachen" className="px-3 py-1.5 rounded-md bg-sky-600/80 hover:bg-sky-600 text-white font-semibold transition-colors">
            {isNl ? '6. Meedoen / Aanmelden' : '6. Wie kann ich mitmachen?'}
          </a>
        </nav>
      </header>

      <div className="space-y-8">
        {/* 1. Worum geht's? */}
        <section id="worum-gehts" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-3">
            <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <h2 className="text-xl font-bold">{isNl ? '1. Waar gaat het over?' : '1. Worum geht’s?'}</h2>
          </div>
          <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
            <p>
              {isNl
                ? '„Kids on Ski“ is een initiatief dat niet-leerplichtige kinderen zonder ski-ervaring een kosteloze kennismaking met de skisport biedt. Winterberg neemt als eerste bestemming in Duitsland deel aan dit programma.'
                : '„Kids on Ski“ ist ein Förderprogramm, das Kindern im Vorschulalter ohne Vorkenntnisse einen kostenlosen Einstieg in den Skisport ermöglicht. Winterberg beteiligt sich als erste Destination in Deutschland an dieser Initiative.'}
            </p>
            <p>
              {isNl
                ? 'Het aanbod in Winterberg wordt georganiseerd door de Winterberg Touristik und Wirtschaft GmbH in samenwerking met deelnemende hotels, vakantieparken, skischolen, skiverhuurders en het Skiliftkarussell Winterberg.'
                : 'Das Angebot wird vor Ort von der Winterberg Touristik und Wirtschaft GmbH in Kooperation mit teilnehmenden Unterkünften, Skischulen, Skiverleihen und den Bergbahnen umgesetzt.'}
            </p>
          </div>
        </section>

        {/* 2. Für wen ist das Angebot? */}
        <section id="fuer-wen" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-4">
            <Users className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <h2 className="text-xl font-bold">{isNl ? '2. Voor wie is het aanbod bedoeld?' : '2. Für wen ist das Angebot?'}</h2>
          </div>
          <ul className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>{isNl ? 'Leeftijd:' : 'Alter:'}</strong>{' '}
                {isNl ? 'Kinderen van 3 tot en met 5 jaar (nog niet leerplichtig).' : 'Kinder im Alter von 3 bis 5 Jahren (nicht schulpflichtig).'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>{isNl ? 'Ervaring:' : 'Vorkenntnisse:'}</strong>{' '}
                {isNl ? 'Uitsluitend voor beginners zonder eerdere ski-ervaring.' : 'Ausschließlich für Anfänger ohne Vorkenntnisse im Skifahren.'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>{isNl ? 'Voorwaarde:' : 'Voraussetzung:'}</strong>{' '}
                {isNl
                  ? 'Boeking van een verblijf (5 nachten) bij een officieel partnerbedrijf in Winterberg binnen de vastgestelde actieweken (doorgaans bij verblijf met minimaal twee volbetalende begeleiders).'
                  : 'Buchung eines Aufenthalts (5 Übernachtungen) in einem offiziellen Partnerbetrieb in Winterberg innerhalb der festgelegten Aktionswochen (in der Regel bei Anreise mit mindestens zwei vollzahlenden Begleitpersonen).'}
              </span>
            </li>
          </ul>
        </section>

        {/* 3. Welche Leistungen sind inbegriffen? */}
        <section id="leistungen" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-4">
            <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <h2 className="text-xl font-bold">{isNl ? '3. Welke diensten zijn inbegrepen?' : '3. Welche Leistungen sind inbegriffen?'}</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isNl
              ? 'Voor het deelnemende kind zijn de volgende onderdelen van het pakket kosteloos:'
              : 'Für das teilnehmende Kind sind im Rahmen des Pakets folgende Leistungen kostenlos enthalten:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-sm mb-1">{isNl ? 'Accommodatie (5 nachten)' : 'Unterkunft (5 Übernachtungen)'}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isNl
                  ? '5 overnachtingen (zondag t/m vrijdag) gratis op de kamer van de ouders/begeleiders inclusief de geboekte verzorging van het partnerbedrijf.'
                  : '5 Übernachtungen (Sonntag bis Freitag) kostenlos im Zimmer der Eltern bzw. Begleitpersonen inklusive der gebuchten Verpflegung des Partnerbetriebs.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-sm mb-1">{isNl ? 'Skiles (4 × halve dag)' : 'Skikurs (4 × Halbtagskurs)'}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isNl
                  ? '4 dagen halve-dag-skiles (maandag t/m donderdag, ca. 2 uur per dag) voor beginners. Uitbreiding naar hele dagen is afhankelijk van de skischool tegen bijbetaling mogelijk.'
                  : '4 × Halbtagesskikurs (Montag bis Donnerstag, jeweils ca. 2 Stunden) für Anfänger. Eine Aufzahlung auf Ganztagskurse ist je nach Skischule optional möglich.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-sm mb-1">{isNl ? 'Skiverhuur (4 dagen)' : 'Skiverleih (4 Tage)'}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isNl
                  ? 'Complete huuruitrusting (ski’s, skischoenen en helm) voor de duur van 4 dagen.'
                  : 'Komplette Leihausrüstung (Ski, Skischuhe und Helm) für die Dauer von 4 Tagen.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-sm mb-1">{isNl ? 'Skipas (4 dagen)' : 'Skipass (4 Tage)'}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isNl
                  ? 'Gratis 4-daagse skipas voor het kind voor de deelnemende liften in het skigebiet.'
                  : 'Kostenloser 4-Tages-Skipass für das Kind für die teilnehmenden Lifte im Skigebiet.'}
              </p>
            </div>
          </div>
        </section>

        {/* 4. In welchem Zeitraum ist das möglich? */}
        <section id="zeitraum" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-3">
            <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <h2 className="text-xl font-bold">{isNl ? '4. In welke periode is dit mogelijk?' : '4. In welchem Zeitraum ist das möglich?'}</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isNl
              ? 'Het aanbod geldt in de vastgestelde actieweken in het voor- en naseizoen (seizoen 2026/2027, telkens zondag t/m vrijdag / 5 nachten):'
              : 'Das Angebot gilt in festgelegten Aktionswochen in der Vor- und Nachsaison (Saison 2026/2027, jeweils Sonntag bis Freitag / 5 Übernachtungen):'}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs uppercase text-gray-500">
                  <th className="py-2.5 pr-4">{isNl ? 'Week' : 'Kalenderwoche'}</th>
                  <th className="py-2.5">{isNl ? 'Periode (5 nachten)' : 'Zeitraum (5 Übernachtungen)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {ACTION_WEEKS.map((w) => (
                  <tr key={w.kw}>
                    <td className="py-2.5 pr-4 font-semibold text-gray-900 dark:text-gray-100">{w.kw}</td>
                    <td className="py-2.5 text-gray-700 dark:text-gray-300">{isNl ? w.datesNl : w.datesDe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            {isNl
              ? 'Maatgevend is de beschikbaarheid van de betreffende partneraccommodatie in de gekozen actieweek.'
              : 'Maßgeblich ist die Verfügbarkeit der jeweiligen Partnerunterkunft in der gewählten Aktionswoche.'}
          </p>
        </section>

        {/* 5. Wer macht mit? */}
        <section id="partner" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-3">
            <Building2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <h2 className="text-xl font-bold">{isNl ? '5. Wie doen er mee?' : '5. Wer macht mit?'}</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            {isNl
              ? 'Aan het programma nemen geselecteerde accommodaties, liften, skischolen en skiverhuurders in Winterberg deel. Bedrijven die in ons overzicht staan, zijn direct gekoppeld aan hun bedrijfsprofiel:'
              : 'Am Programm beteiligen sich ausgewählte Unterkünfte, Liftbetreiber, Skischulen und Skiverleihe in Winterberg. Einträge, die in unserem Verzeichnis geführt werden, verlinken direkt auf das jeweilige Unternehmensprofil:'}
          </p>

          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            {isNl ? 'Deelnemende partneraccommodaties' : 'Teilnehmende Partnerunterkünfte'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {accommodations.map((partner) => {
              const bus = partner.business;
              if (bus) {
                return (
                  <a
                    key={partner.name}
                    href={getBusinessPath(bus, lang)}
                    onClick={(e) => handleBusinessClick(e, bus)}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-500 bg-gray-50/70 dark:bg-gray-800/50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate">
                        {bus.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{bus.location || 'Winterberg'}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-sky-600 dark:text-sky-400 inline-flex items-center gap-1 shrink-0">
                      {isNl ? 'Profiel' : 'Profil'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                );
              }
              return (
                <div
                  key={partner.name}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/30"
                >
                  <div>
                    <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">{partner.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Winterberg</div>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            {isNl ? 'Skigebied, skischolen & skiverhuur (selectie)' : 'Skigebiet, Skischulen & Skiverleih (Auswahl)'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skiPartners.map((partner) => {
              const bus = partner.business;
              if (bus) {
                return (
                  <a
                    key={partner.name}
                    href={getBusinessPath(bus, lang)}
                    onClick={(e) => handleBusinessClick(e, bus)}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-500 bg-gray-50/70 dark:bg-gray-800/50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate">
                        {bus.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {isNl ? partner.typeNl : partner.type}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-sky-600 dark:text-sky-400 inline-flex items-center gap-1 shrink-0">
                      {isNl ? 'Profiel' : 'Profil'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                );
              }
              return (
                <div
                  key={partner.name}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/30"
                >
                  <div>
                    <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">{partner.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{isNl ? partner.typeNl : partner.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Wie kann ich mitmachen? */}
        <section id="mitmachen" className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-sky-500/40 dark:border-sky-500/40 p-6 sm:p-8 scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-4">
            <ClipboardList className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <h2 className="text-xl font-bold">
              {isNl
                ? '6. Hoe kan ik meedoen en het aanbod gebruiken?'
                : '6. Wie kann ich mitmachen bzw. das Angebot in Anspruch nehmen?'}
            </h2>
          </div>

          <ol className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong>{isNl ? 'Actieperiode en partneraccommodatie kiezen:' : 'Aktionszeitraum und Partnerunterkunft auswählen:'}</strong>{' '}
                {isNl
                  ? 'Kies een van de bovengenoemde actieweken (zondag t/m vrijdag, 5 nachten) en boek uw verblijf rechtstreeks bij een van de deelnemende partnerbedrijven in Winterberg (vermeld bij boeking „Kids on Ski“).'
                  : 'Einen der genannten Aktionszeiträume (Sonntag bis Freitag, 5 Übernachtungen) auswählen und den Aufenthalt direkt bei einem der teilnehmenden Partnerbetriebe in Winterberg buchen (bei der Buchung auf „Kids on Ski“ hinweisen).'}
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong>{isNl ? 'Kind registreren via het officiële portaal:' : 'Kind über das offizielle Portal registrieren:'}</strong>{' '}
                {isNl
                  ? 'Na bevestiging van de accommodatie het kind met de boekingsgegevens aanmelden via het officiële aanmeldingsformulier van Winterberg Touristik / Kids on Ski.'
                  : 'Nach Bestätigung der Unterkunftsbuchung das Kind mit den Buchungsdaten über das offizielle Registrierungsformular von Winterberg bzw. Kids on Ski anmelden.'}
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong>{isNl ? 'Bevestiging / voucher ontvangen:' : 'Bestätigung bzw. Gutschein erhalten:'}</strong>{' '}
                {isNl
                  ? 'Na controle van de deelnamevoorwaarden ontvangt u per e-mail de bevestiging of voucher voor de gratis skiles, skiverhuur en skipas.'
                  : 'Nach Prüfung der Teilnahmebedingungen wird die Bestätigung bzw. der Gutschein für Skikurs, Skiverleih und Skipass per E-Mail zugesandt.'}
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
              <div>
                <strong>{isNl ? 'Ter plaatse inwisselen:' : 'Vor Ort einlösen:'}</strong>{' '}
                {isNl
                  ? 'Bij aankomst in Winterberg de bevestiging/voucher tonen bij de toegewezen skischool, de skiverhuur en de liftkassa.'
                  : 'Bei Anreise in Winterberg die Bestätigung bzw. den Gutschein in der zugewiesenen Partnerskischule, im Skiverleih und an der Liftkasse vorlegen.'}
              </div>
            </li>
          </ol>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <a
              href="https://www.winterberg.de/aktivitaeten-erlebnisse/winter/kids-on-ski/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors"
            >
              <span>{isNl ? 'Officiële informatie & aanmelding (winterberg.de)' : 'Offizielle Infos & Anmeldung (winterberg.de)'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://kids-on-ski.com/de/skigebiet/winterberg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-semibold transition-colors"
            >
              <span>{isNl ? 'Projectportaal (kids-on-ski.com)' : 'Projektportal (kids-on-ski.com)'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Back to Ski Theme Page */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNavigateSkiTheme}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isNl ? 'Terug naar het overzicht: Skiën in Winterberg' : 'Zurück zur Übersicht: Skifahren in Winterberg'}</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default KidsOnSkiPage;
