import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Plus,
  Maximize2,
  X,
  Navigation,
  Download,
  Share2,
  Flame,
  Users,
  Phone,
  Mail,
  PartyPopper,
  Check,
  Wine,
  Utensils,
  Headphones,
  Music,
  Ticket,
  HelpCircle,
  Info,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';
import { Business, ThemeConfig, DesignSettings } from '../types';
import HeaderShapeDivider, { getEffectiveDivider } from './HeaderShapeDivider';
import { 
  SILVESTER_PARTY_DATA, 
  SilvesterPartyItem, 
  generateSilvesterPartyIcs 
} from '../utils/silvesterParty';

interface SilvesterThemePageProps {
  businesses: Business[];
  theme?: ThemeConfig;
  designSettings?: DesignSettings;
  onSelectBusiness?: (bus: Business) => void;
  onBack?: () => void;
  onNavigateContact?: () => void;
}

export const SilvesterThemePage: React.FC<SilvesterThemePageProps> = ({
  businesses,
  theme,
  designSettings,
  onSelectBusiness,
  onBack,
  onNavigateContact
}) => {
  const { lang } = useTranslation();
  const isNl = lang === 'nl';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartyType, setSelectedPartyType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [selectedItemForInquiry, setSelectedItemForInquiry] = useState<SilvesterPartyItem | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Inquiry form fields
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryGuests, setInquiryGuests] = useState('2 Personen');
  const [inquiryOption, setInquiryOption] = useState('Silvester-Essen & Party');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // SEO setup
  useEffect(() => {
    const pageTitle = isNl
      ? 'Silvester feiern in Winterberg 2026 | Sylvester Party, Gala & Berghutten'
      : 'Silvester feiern in Winterberg 2026 | Partys, Gala-Buffets & Hüttenzauber';
    document.title = pageTitle;

    const pageDesc = isNl
      ? 'Vier Oud en Nieuw 2026 / 2027 in Winterberg: De beste oudejaarsfeesten, galabuffetten in luxe resorts, gezellige berghutten aan de piste en de openlucht Sylvesterparty op het marktplein.'
      : 'Silvester feiern in Winterberg 2026 / 2027: Die besten Silvesterpartys, Gourmet-Galabuffets, urige Hüttenabende am Skihang, Clubnächte in der Tenne und Open-Air-Silvester auf dem Marktplatz.';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // Schema.org structured data
    let scriptTag = document.getElementById('silvester-theme-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'silvester-theme-schema';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': pageTitle,
      'description': pageDesc,
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': isNl ? 'Home' : 'Startseite', 'item': 'https://www.winterberg-verzeichnis.de' },
          { '@type': 'ListItem', 'position': 2, 'name': isNl ? 'Thema\'s' : 'Themen', 'item': 'https://www.winterberg-verzeichnis.de/themen' },
          { '@type': 'ListItem', 'position': 3, 'name': isNl ? 'Oud en Nieuw 2026' : 'Silvester feiern in Winterberg 2026', 'item': 'https://www.winterberg-verzeichnis.de/themen/silvester-feiern-in-winterberg-2026' }
        ]
      }
    });

    return () => {
      const tag = document.getElementById('silvester-theme-schema');
      if (tag) tag.remove();
    };
  }, [isNl]);

  // Map businesses by id
  const businessMap = useMemo(() => {
    return new Map(businesses.map(b => [b.id, b]));
  }, [businesses]);

  // Available districts
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    SILVESTER_PARTY_DATA.forEach(item => {
      if (item.district) set.add(item.district);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered list
  const filteredItems = useMemo(() => {
    return SILVESTER_PARTY_DATA.filter(item => {
      if (selectedDistrict !== 'all' && item.district !== selectedDistrict) {
        return false;
      }
      if (selectedPartyType !== 'all' && item.partyType !== selectedPartyType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.businessName} ${item.titleDe} ${item.titleNl} ${item.subtitleDe} ${item.subtitleNl} ${item.district} ${item.highlightsDe.join(' ')} ${item.shortDescriptionDe} ${item.packageTypeDe} ${item.priceInfoDe}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedDistrict, selectedPartyType]);

  const handleDownloadIcs = (item: SilvesterPartyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const icsData = generateSilvesterPartyIcs(item);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `silvester-winterberg-${item.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForInquiry) return;

    const subject = encodeURIComponent(`Silvester 2026 Reservierungsanfrage - ${inquiryName} (${inquiryGuests})`);
    const body = encodeURIComponent(
      `Hallo Team von ${selectedItemForInquiry.businessName},\n\n` +
      `wir interessieren uns für Ihr Silvester-Angebot 2026/2027 in Winterberg:\n\n` +
      `• Veranstaltung: ${selectedItemForInquiry.titleDe}\n` +
      `• Gewünschtes Angebot / Option: ${inquiryOption}\n` +
      `• Name: ${inquiryName}\n` +
      `• E-Mail: ${inquiryEmail}\n` +
      `• Telefon: ${inquiryPhone || '-'}\n` +
      `• Personenanzahl: ${inquiryGuests}\n\n` +
      `Nachricht / Wünsche:\n${inquiryMessage || 'Bitte teilen Sie uns die aktuellen Verfügbarkeiten und Reservierungsdetails mit.'}\n\n` +
      `Mit freundlichen Grüßen,\n${inquiryName}\n\n(Gesendet über das Winterberg Verzeichnis - Themenseite Silvester feiern in Winterberg 2026)`
    );

    window.open(`mailto:${selectedItemForInquiry.contactEmail}?subject=${subject}&body=${body}`, '_blank');
    setInquirySuccess(true);
  };

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'utensils': return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'wine': return <Wine className="w-4 h-4 text-rose-500" />;
      case 'headphones': return <Headphones className="w-4 h-4 text-cyan-500" />;
      case 'music': return <Music className="w-4 h-4 text-purple-500" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'flame': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'ticket': return <Ticket className="w-4 h-4 text-emerald-500" />;
      case 'clock': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  // Frequently Asked Questions
  const faqs = [
    {
      qDe: 'Müssen Tickets und Tische für Silvester in Winterberg vorab reserviert werden?',
      qNl: 'Moeten tickets en tafels voor Oud en Nieuw in Winterberg vooraf gereserveerd worden?',
      aDe: 'Ja, dringend empfohlen! Silvester ist die beliebteste Reisewoche des gesamten Winters im Sauerland. Beliebte Restaurants und Hütten wie die Dorf Alm oder Skihütte Brabander sind oft Wochen im Voraus ausgebucht. Auch Club-Tickets für die Tenne sollten vorab online gesichert werden.',
      aNl: 'Ja, dat wordt met klem aangeraden! Oud en Nieuw is de drukste vakantieweek van het winterseizoen in Winterberg. Populaire horecagelegenheden en berghutten zijn vaak weken van tevoren volgeboekt. Ook voor clubs zoals Die Tenne is online voorverkoop aan te raden.'
    },
    {
      qDe: 'Ist der Eintritt zur Open-Air Silvesterparty im Winterberger Winterdorf kostenlos?',
      qNl: 'Is de toegang tot het openlucht oudejaarsfeest in het Winterdorf gratis?',
      aDe: 'Ja! Das Winterberger Winterdorf auf dem Marktplatz an der Unteren Pforte lädt ohne Eintritt zum Feiern unter freiem Himmel ein. Am 31. Dezember ist bis 01:00 Uhr nachts geöffnet, inklusive DJ Marlon, Winzerglühwein und Hüttenschmankerln.',
      aNl: 'Ja! Het Winterberger Winterdorf op het plein Untere Pforte is gratis toegankelijk voor iedereen. Op 31 december geopend tot 01:00 uur \'s nachts met DJ Marlon, glühwein en gezellige berghutten.'
    },
    {
      qDe: 'Gibt es in Winterberg ein großes Silvesterfeuerwerk?',
      qNl: 'Is er in Winterberg een groot vuurwerk met de jaarwisseling?',
      aDe: 'Ein offizielles, weithin sichtbares Großfeuerwerk findet traditionell an der Skipiste am Herrloh (direkt beim Hotel Der Brabander) statt. Auch an den Aussichtspunkten rund um Winterberg hat man um Mitternacht einen traumhaften Blick über die Täler.',
      aNl: 'Een van de mooiste en bekendste vuurwerkshows vindt traditioneel plaats op de skipiste van de Herrloh (bij Hotel Der Brabander). Vanaf verschillende uitzichtpunten rond de stad heeft u een magisch uitzicht.'
    },
    {
      qDe: 'Fahren in der Silvesternacht Taxis und Busse in Winterberg?',
      qNl: 'Rijden er taxi\'s en bussen tijdens de oudejaarsnacht in Winterberg?',
      aDe: 'Örtliche Taxiunternehmen sind in der Silvesternacht im Dauereinsatz. Aufgrund der extrem hohen Nachfrage kann es jedoch zu Wartezeiten kommen. Es empfiehlt sich, Fahrten frühzeitig vorzubestellen oder Unterkünfte in fußläufiger Entfernung zum Ortszentrum zu wählen.',
      aNl: 'Lokale taxibedrijven rijden de hele nacht. Vanwege de grote drukte kunnen wachttijden oplopen. Het is verstandig ritten tijdig vooraf af te stemmen of te verblijven op loopafstand van het centrum.'
    },
    {
      qDe: 'Haben Skigebiete und Gastronomie am Neujahrstag (1. Januar) geöffnet?',
      qNl: 'Zijn de skigebieden en horeca op Nieuwjaarsdag (1 januari) geopend?',
      aDe: 'Ja! Das Skiliftkarussell Winterberg und die Skigebiete sind am 1. Januar regulär in Betrieb (meist ab ca. 09:00 oder 10:00 Uhr). Auch die Restaurants, Berghütten und das Winterdorf heißen Gäste am Neujahrstag herzlich willkommen.',
      aNl: 'Ja! De Skiliftkarussell Winterberg en pistes zijn op 1 januari gewoon geopend (meestal vanaf 09:00 of 10:00 uur). Ook berghutten en het Winterdorf zijn op Nieuwjaarsdag geopend voor een ontspannen start van het jaar.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0D1210] text-[#1B211D] dark:text-[#EAE6DF]">
      
      {/* Festive Midnight Hero Header */}
      <section className="w-full bg-gradient-to-br from-[#0A1128] via-[#101C38] to-[#1C2A4A] text-white relative overflow-hidden border-b border-amber-500/20 shadow-xl">
        
        {/* Festive Sparkle & Radial Glow Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(245,158,11,0.18),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(147,51,234,0.22),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
        
        {/* Real Unsplash Fireworks Banner Image */}
        <figure className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] h-64 sm:h-80 md:h-96 lg:h-full m-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/silvester-winterberg-header.jpg"
            alt={isNl ? 'Silvester feiern in Winterberg 2026' : 'Silvester feiern in Winterberg 2026: Partys, Gala-Buffets, Hütten & Open Air'}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover hero-party-mask brightness-105 contrast-110"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="absolute top-3 right-3 lg:top-4 lg:right-6 flex items-center gap-1.5 z-10 pointer-events-none flex-wrap justify-end">
            <span className="text-[10.5px] leading-none font-semibold text-white/95 bg-black/65 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{isNl ? 'Foto: Unsplash • Reële feestimpressie' : 'Foto: Unsplash • Echte Foto, keine KI'}</span>
            </span>
          </div>
        </figure>

        {/* Hero Content Container */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-5 sm:pt-10 lg:pt-16 pb-16 sm:pb-20 lg:pb-28 relative z-10">
          <div className="max-w-2xl xl:max-w-3xl">
            
            {/* Breadcrumb Navigation */}
            <nav className="text-[12px] sm:text-[13px] text-white/75 mb-3 sm:mb-4 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
              <button
                type="button"
                onClick={onBack}
                className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer text-[12px] sm:text-[13px] text-white/75"
              >
                {isNl ? 'Startpagina' : 'Startseite'}
              </button>
              <span>/</span>
              <span className="text-white/60">{isNl ? 'Thema\'s' : 'Themen'}</span>
              <span>/</span>
              <span className="font-semibold text-amber-300">
                {isNl ? 'Oud en Nieuw 2026' : 'Silvester feiern 2026'}
              </span>
            </nav>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 drop-shadow-xs">
              <PartyPopper className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{isNl ? 'Winterberg & Sauerland • Jaarwisseling 2026 / 2027' : 'Winterberg & Sauerland • Jahreswechsel 2026 / 2027'}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[28px] sm:text-[42px] md:text-[50px] font-extrabold m-0 mb-3 sm:mb-4 leading-[1.1] tracking-tight text-white drop-shadow-lg">
              {isNl ? 'Silvester feiern in Winterberg 2026' : 'Silvester feiern in Winterberg 2026'}
            </h1>

            {/* Intro Text */}
            <p className="text-sm sm:text-base md:text-[17px] text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl font-normal">
              {isNl
                ? 'Luid het nieuwe jaar 2027 in stijl in te midden van het betoverende berglandschap van Winterberg! Ontdek exclusieve oudejaarsgala\'s met livemuziek, gezellige berghutten met all-inclusive buffet en dj, de legendarische clubnacht in Die Tenne en het gratis openlucht Sylvesterfeest in het Winterdorf.'
                : 'Begrüße das neue Jahr 2027 im winterlichen Winterberg! Entdecke erstklassige Silvestergalas mit Gourmetbuffet und Live-Band, urige Hüttenpartys mit DJ, ausgelassenes Clubbing in der legendären Tenne bis zum Morgengrauen oder die traditionelle Open-Air-Silvesterparty im Winterberger Winterdorf. Jetzt Plätze & Tickets sichern!'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#partys"
                className="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all no-underline"
              >
                <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>{isNl ? 'Silvester-Partys entdecken' : 'Silvester-Partys & Events entdecken'}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 border border-white/25 backdrop-blur-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isNl ? 'Eigen Silvester-Event melden' : 'Silvester-Event eintragen'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-white/85">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>{isNl ? 'Geverifieerde feestprogramma\'s' : 'Geprüfte Silvesterprogramme 2026'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>{isNl ? 'Van gala tot berghut & open air' : 'Von Gala über Hütte bis Club & Open-Air'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>{isNl ? 'Directe tafelreservering & tickets' : 'Direkte Tischreservierung & Tickets'}</span>
              </span>
            </div>

          </div>
        </div>

        {/* Dynamic Shape Divider at Header Bottom */}
        <HeaderShapeDivider
          style={getEffectiveDivider('category', designSettings)}
          color="transparent"
          customDividers={designSettings?.customDividers}
        />
      </section>

      {/* Main Content Area */}
      <main id="partys" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#161C19] border border-[#E7E0D3] dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isNl ? 'Zoeken op locatie, DJ, gala, berghut...' : 'Dorf Alm, Gala, DJ, Tenne, Winterdorf oder Preis suchen...'}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#111613] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Party Type Filter */}
            <div className="sm:w-56">
              <select
                value={selectedPartyType}
                onChange={(e) => setSelectedPartyType(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#111613] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
              >
                <option value="all">{isNl ? 'Alle party-stijlen' : 'Alle Silvester-Kategorien'}</option>
                <option value="huette">{isNl ? 'Berghut & Alm-party' : 'Skihütte & Alm-Party'}</option>
                <option value="gala">{isNl ? 'Galabuffet & Luxe Resort' : 'Silvestergala & Buffet'}</option>
                <option value="openair">{isNl ? 'Open-Air & Winterdorf' : 'Open-Air & Winterdorf'}</option>
                <option value="club">{isNl ? 'Club & Nightlife' : 'Club & Tanzlokal'}</option>
                <option value="hotel">{isNl ? 'Hotel & Familie' : 'Resort & Familien-Silvester'}</option>
              </select>
            </div>

            {/* Ortsteil Filter */}
            <div className="sm:w-44">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-[#F9F7F2] dark:bg-[#111613] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
              >
                <option value="all">{isNl ? 'Alle wijken' : 'Alle Ortsteile'}</option>
                {availableDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isNl ? 'Event aanmelden' : 'Event melden'}</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1B211D] dark:text-white m-0 flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-amber-500" />
              <span>{filteredItems.length} {isNl ? 'Silvester-evenementen voor 2026 / 2027 in Winterberg' : 'Silvester-Partys & Gala-Angebote 2026 / 2027 in Winterberg'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">
              {isNl 
                ? 'Klik op een flyer om details te vergroten of reserveer uw tafel / tickets rechtstreeks bij de locatie.' 
                : 'Klicke auf den Flyer oder das Bild zum Vergrößern oder sichere Dir Tischreservierung und Tickets direkt beim Veranstalter.'}
            </p>
          </div>
        </div>

        {/* Full-width Cards List */}
        {filteredItems.length > 0 ? (
          <div className="space-y-8">
            {filteredItems.map((item) => {
              const bus = item.businessId ? businessMap.get(item.businessId) : undefined;

              return (
                <article
                  key={item.id}
                  className="w-full bg-white dark:bg-[#161C19] border border-[#E7E0D3] dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col lg:flex-row group"
                >
                  {/* Left Column: Image / Flyer Preview */}
                  <div className="lg:w-[380px] xl:w-[420px] shrink-0 bg-gradient-to-br from-[#101726] to-[#1E293B] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E7E0D3] dark:border-white/10">
                    
                    {/* Flyer / Visual Container */}
                    <div 
                      onClick={() => setPreviewImage({ src: item.flyerImage || item.image, title: item.titleDe })}
                      className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-full rounded-xl overflow-hidden shadow-lg group/flyer cursor-pointer border border-white/15 transition-transform duration-300 group-hover:scale-[1.01]"
                    >
                      <img
                        src={item.flyerImage || item.image}
                        alt={`${item.businessName} - Silvester 2026`}
                        className="w-full h-auto max-h-[360px] object-cover block"
                        loading="lazy"
                      />

                      {/* Top Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
                        <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md border border-amber-300">
                          <Sparkles className="w-3 h-3 text-slate-950" />
                          <span>{isNl ? item.badgeNl : item.badgeDe}</span>
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/flyer:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-2xs">
                        <Maximize2 className="w-4 h-4 text-amber-300" />
                        <span>{isNl ? 'Afbeelding / Flyer vergroten' : 'Flyer / Bild vergrößern'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Full Details */}
                  <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
                    <div>
                      
                      {/* Top Meta Line: Category, Location & Time */}
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                            <PartyPopper className="w-3 h-3" />
                            <span>{item.category} • {item.subcategory}</span>
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{item.address}</span>
                          </span>
                        </div>

                        {/* Date Tag */}
                        <div className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>{isNl ? item.dateNl : item.dateDe}</span>
                        </div>
                      </div>

                      {/* Business Name */}
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                        {item.businessName}
                      </div>

                      {/* Main Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-[#1B211D] dark:text-white m-0 mb-1 leading-snug">
                        {isNl ? item.titleNl : item.titleDe}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 m-0 mb-3">
                        {isNl ? item.subtitleNl : item.subtitleDe}
                      </p>

                      {/* Schedule & Price Highlight Banner */}
                      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-500/20 rounded-xl p-3 sm:p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start sm:items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                          <div>
                            <div className="text-[11px] uppercase tracking-wider font-bold text-amber-900 dark:text-amber-300">
                              {isNl ? 'Openingstijden & Programma' : 'Ablauf & Uhrzeiten'}
                            </div>
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                              {isNl ? item.timeNl : item.timeDe}
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-200 dark:border-amber-500/20">
                          <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">
                            {isNl ? 'Prijzen & Tickets' : 'Kosten & Eintritt'}
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-[#1E3A8A] dark:text-blue-400">
                            {isNl ? item.priceInfoNl : item.priceInfoDe}
                          </div>
                        </div>
                      </div>

                      {/* Features 3-Col Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                        {item.features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="bg-[#FBF9F4] dark:bg-[#121614] border border-[#EDE7DB] dark:border-white/5 rounded-xl p-2.5 flex flex-col justify-between"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {getFeatureIcon(feat.icon)}
                              <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                                {isNl ? feat.titleNl : feat.titleDe}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug m-0">
                              {isNl ? feat.descNl : feat.descDe}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Highlights Bullet List */}
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{isNl ? 'Belangrijkste hoogtepunten van dit event:' : 'Die wichtigsten Highlights auf einen Blick:'}</span>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 m-0 p-0 list-none">
                          {(isNl ? item.highlightsNl : item.highlightsDe).map((hl, hIdx) => (
                            <li key={hIdx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold leading-none mt-0.5">•</span>
                              <span className="leading-snug">{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Info Description */}
                      <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed m-0 mb-4 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                        {isNl ? item.infoTextNl : item.infoTextDe}
                      </p>

                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-[#E7E0D3] dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Primary CTA: Ticket / Booking link */}
                        <a
                          href={item.bookingUrl || item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1.5 no-underline"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>
                            {item.bookingUrl?.includes('ticket') || item.id.includes('tenne') || item.id.includes('brabander')
                              ? (isNl ? 'Tickets reserveren' : 'Tickets sichern')
                              : (isNl ? 'Tafel reserveren / Website' : 'Tisch reservieren / Details')}
                          </span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                        </a>

                        {/* Inquiry Modal Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedItemForInquiry(item);
                            setInquirySuccess(false);
                          }}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isNl ? 'Vrijblijvende aanvraag' : 'Veranstalter anfragen'}</span>
                        </button>

                        {/* ICS Calendar Download */}
                        <button
                          type="button"
                          onClick={(e) => handleDownloadIcs(item, e)}
                          title={isNl ? 'Opslaan in agenda (.ics)' : 'Termin in Kalender eintragen (.ics)'}
                          className="p-2 border border-gray-200 dark:border-white/15 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors inline-flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span className="hidden sm:inline">.ICS</span>
                        </button>
                      </div>

                      {/* Right Link: View Business Profile if exists */}
                      {bus && onSelectBusiness && (
                        <button
                          type="button"
                          onClick={() => onSelectBusiness(bus)}
                          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 justify-end cursor-pointer bg-transparent border-none p-0"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{isNl ? 'Profiel bekijken' : 'Betriebsprofil ansehen'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}

                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#161C19] border border-[#E7E0D3] dark:border-white/10 rounded-2xl p-8">
            <PartyPopper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              {isNl ? 'Geen evenementen gevonden' : 'Keine passenden Silvester-Partys gefunden'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {isNl 
                ? 'Probeer de zoekterm of de filters aan te passen.' 
                : 'Passe Deine Suchkriterien oder Filter an, um mehr Ergebnisse anzuzeigen.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedPartyType('all');
                setSelectedDistrict('all');
              }}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
            >
              {isNl ? 'Alle filters wissen' : 'Filter zurücksetzen'}
            </button>
          </div>
        )}

        {/* Silvester Tips & FAQ Section */}
        <section className="mt-16 bg-gradient-to-br from-[#F8F5EE] to-[#EFE9DD] dark:from-[#151B18] dark:to-[#101412] border border-[#E0D7C5] dark:border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              <Info className="w-4 h-4" />
              <span>{isNl ? 'Tips voor de jaarwisseling in Winterberg' : 'Gut zu wissen • Silvester in Winterberg'}</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#1B211D] dark:text-white m-0 mb-6">
              {isNl ? 'Veelgestelde vragen over Oud & Nieuw in Winterberg' : 'Häufige Fragen & Insider-Tipps zum Jahreswechsel in Winterberg'}
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-[#1A221E] border border-[#E5DECF] dark:border-white/10 rounded-2xl overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer bg-transparent border-none"
                    >
                      <span className="font-bold text-xs sm:text-sm text-[#1B211D] dark:text-white leading-snug">
                        {isNl ? faq.qNl : faq.qDe}
                      </span>
                      <span className="shrink-0 text-gray-500">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5">
                        {isNl ? faq.aNl : faq.aDe}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* Lightbox Preview Modal for Flyers / Images */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] bg-white dark:bg-[#18201B] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-2 flex items-center justify-center bg-black/5 dark:bg-black/30">
              <img
                src={previewImage.src}
                alt={previewImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Drawer / Modal */}
      {selectedItemForInquiry && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedItemForInquiry(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white dark:bg-[#18201B] border border-[#E7E0D3] dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#0A1128] to-[#1C2A4A] text-white p-5 sm:p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedItemForInquiry(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1">
                <PartyPopper className="w-3.5 h-3.5" />
                <span>{selectedItemForInquiry.businessName}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold m-0 leading-tight">
                {isNl ? 'Vrijblijvende aanvraag Silvester 2026' : 'Anfrage für Silvester 2026'}
              </h3>
              <p className="text-xs text-white/80 m-0 mt-1">
                {isNl 
                  ? 'Stuur uw aanvraag direct door naar de organisator.' 
                  : 'Senden Sie Ihre Tisch- oder Reservierungsanfrage direkt an den Gastgeber.'}
              </p>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6 flex-1">
              {inquirySuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    {isNl ? 'E-mailprogramma geopend!' : 'E-Mail erfolgreich vorbereitet!'}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
                    {isNl 
                      ? 'Uw e-mailclient is geopend met de vooringevulde gegevens. Verstuur het bericht eenvoudig om uw aanvraag af te ronden.'
                      : 'Ihr Standard-E-Mailprogramm hat sich mit allen vorausgefüllten Reservierungsdaten geöffnet. Senden Sie die Nachricht einfach ab.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedItemForInquiry(null)}
                    className="px-5 py-2 bg-[#1E3A8A] text-white text-xs font-semibold rounded-xl"
                  >
                    {isNl ? 'Sluiten' : 'Schließen'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Gewenste optie / arrangement' : 'Gewünschte Option / Arrangement'}
                    </label>
                    <input
                      type="text"
                      value={inquiryOption}
                      onChange={(e) => setInquiryOption(e.target.value)}
                      placeholder="z. B. Silvester-Essen (ab 19:30 Uhr inkl. Party) oder Gala-Buffet"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-[#121614] text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        {isNl ? 'Uw naam' : 'Ihr Name'} *
                      </label>
                      <input
                        type="text"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Vor- und Nachname"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-[#121614] text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        {isNl ? 'Aantal personen' : 'Personenanzahl'} *
                      </label>
                      <select
                        value={inquiryGuests}
                        onChange={(e) => setInquiryGuests(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-[#121614] text-gray-900 dark:text-white"
                      >
                        <option value="2 Personen">2 Personen</option>
                        <option value="3-4 Personen">3 - 4 Personen</option>
                        <option value="5-8 Personen">5 - 8 Personen</option>
                        <option value="9-15 Personen (Gruppe)">9 - 15 Personen (Gruppe)</option>
                        <option value="Mehr als 15 Personen">Mehr als 15 Personen</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        {isNl ? 'E-mailadres' : 'E-Mail-Adresse'} *
                      </label>
                      <input
                        type="email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="ihre@email.de"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-[#121614] text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        {isNl ? 'Telefoonnummer' : 'Telefonnummer'}
                      </label>
                      <input
                        type="tel"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="Für Rückfragen"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-[#121614] text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isNl ? 'Bijzondere wensen / Vragen' : 'Besondere Wünsche oder Fragen'}
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="z. B. vegetarisches Essen, Kinderstuhl, Uhrzeit..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-[#121614] text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItemForInquiry(null)}
                      className="px-4 py-2 border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-medium"
                    >
                      {isNl ? 'Annuleren' : 'Abbrechen'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all"
                    >
                      {isNl ? 'Aanvraag verzenden' : 'Anfrage vorbereiten & senden'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit / Add Event Modal */}
      {isSubmitModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white dark:bg-[#18201B] border border-[#E7E0D3] dark:border-white/15 rounded-3xl shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <PartyPopper className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              {isNl ? 'Eigen Silvester-party aanmelden' : 'Eigene Silvester-Veranstaltung melden'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              {isNl
                ? 'Bent u organisator of horecaondernemer in Winterberg en wilt u uw oudejaarsevenement opnemen op deze themapagina? Neem contact op met de redactie van het Winterberg Verzeichnis!'
                : 'Sie sind Gastronom, Clubbetreiber oder Eventveranstalter in Winterberg und möchten Ihr Silvester-Angebot 2026 auf dieser Themenseite listen lassen? Schreiben Sie uns kurz Ihre Programmdaten und Flyer.'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-medium"
              >
                {isNl ? 'Sluiten' : 'Schließen'}
              </button>
              <a
                href="mailto:info@sichtbar-online.de?subject=Silvester%202026%20in%20Winterberg%20Event-Eintrag"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md no-underline inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isNl ? 'Contact opnemen' : 'Redaktion kontaktieren'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SilvesterThemePage;
