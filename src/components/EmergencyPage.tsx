import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { 
  PhoneCall, 
  Siren, 
  ShieldAlert, 
  Pill, 
  Building2, 
  Clock, 
  MapPin, 
  ExternalLink, 
  HelpCircle, 
  AlertTriangle,
  Stethoscope,
  Phone,
  Search
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { 
  EMERGENCY_NUMBERS, 
  HOSPITALS_DATA 
} from '../utils/emergencyData';

interface EmergencyPageProps {
  theme?: ThemeConfig;
  onBack?: () => void;
  onSelectBusiness?: (pathOrSlug: string) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({
  theme,
  onBack,
  onSelectBusiness,
}) => {
  const { t, lang } = useTranslation();
  const [zipCity, setZipCity] = useState('59955 Winterberg');

  return (
    <main className="flex-1 w-full max-w-[1140px] mx-auto px-4 sm:px-6 py-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-6 text-xs text-[#5F6B63]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[#0F4C2E] underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs"
          >
            {lang === 'nl' ? 'Home' : 'Startseite'}
          </button>
          <span>/</span>
          <span className="font-semibold text-[#1B211D]">
            {lang === 'nl' ? 'Nooddiensten & Apotheken' : 'Notdienste & Notfallnummern'}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 rounded-2xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-10">
          <Siren className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-rose-100 mb-3 border border-white/25">
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-pulse" />
            {lang === 'nl' ? '24/7 Nooddienst Winterberg & HSK' : '24/7 Notdienst-Zentrale Winterberg & HSK'}
          </div>

          <h1 className="font-display text-[clamp(28px,4vw,42px)] font-extrabold leading-tight mb-3">
            {lang === 'nl'
              ? 'Nooddiensten & Alarmnummers in Winterberg'
              : 'Notdienste & Notfallnummern in Winterberg'}
          </h1>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed max-w-xl">
            {lang === 'nl'
              ? 'Overzicht van alle spoednummers, actuele apotheek-nooddienst (via aponet.de / ABDA), huisartsenpost bij het St. Franziskus-Hospital en eerste hulp in Winterberg.'
              : 'Wichtige Notrufnummern, tagesaktueller Apotheken-Notdienst (via aponet.de / ABDA), Notfallpraxis am St. Franziskus-Hospital und Bereitschaftsdienste für Winterberg und alle 14 Ortsteile.'}
          </p>
        </div>
      </div>

      {/* SECTION 1: Top 4 Quick Emergency Numbers (Direktwahl) */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 112 Notruf */}
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-red-500 transition-all">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-red-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {lang === 'nl' ? 'Levensgevaar' : 'Lebensgefahr'}
                </span>
                <Siren className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-base text-red-950 mt-1 mb-1">
                {lang === 'nl' ? 'Brandweer & Ambulance' : 'Notarzt & Feuerwehr'}
              </h3>
              <p className="text-xs text-red-900/80 leading-snug mb-3">
                {lang === 'nl'
                  ? 'Voor acute, levensbedreigende noodgevallen en ongevallen.'
                  : 'Für lebensbedrohliche Notfälle, schwere Unfälle und Brände.'}
              </p>
            </div>
            <a
              href="tel:112"
              className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl font-bold text-lg shadow-sm transition-colors no-underline"
            >
              <PhoneCall className="w-5 h-5" />
              <span>112</span>
            </a>
          </div>

          {/* 110 Polizei */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-500 transition-all">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {lang === 'nl' ? 'Politie' : 'Polizei'}
                </span>
                <ShieldAlert className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-display font-bold text-base text-blue-950 mt-1 mb-1">
                {lang === 'nl' ? 'Politie Noodnummer' : 'Polizei Notruf'}
              </h3>
              <p className="text-xs text-blue-900/80 leading-snug mb-3">
                {lang === 'nl'
                  ? 'Bij acute misdrijven, gevaar en verkeersongevallen.'
                  : 'Für akute Gefahrenlagen, Einbrüche und Unfälle.'}
              </p>
            </div>
            <a
              href="tel:110"
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-lg shadow-sm transition-colors no-underline"
            >
              <PhoneCall className="w-5 h-5" />
              <span>110</span>
            </a>
          </div>

          {/* 116 117 Ärztlicher Bereitschaftsdienst */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-[#0F4C2E] text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {lang === 'nl' ? 'Huisartsenpost' : 'Ärztlicher Dienst'}
                </span>
                <Stethoscope className="w-5 h-5 text-[#0F4C2E]" />
              </div>
              <h3 className="font-display font-bold text-base text-emerald-950 mt-1 mb-1">
                {lang === 'nl' ? 'Medische Hulpdienst' : 'Ärztlicher Bereitschaftsdienst'}
              </h3>
              <p className="text-xs text-emerald-900/80 leading-snug mb-3">
                {lang === 'nl'
                  ? 'Buiten kantooruren bij niet-levensbedreigende klachten.'
                  : 'Außerhalb der Praxiszeiten bei nicht lebensbedrohlichen Fällen.'}
              </p>
            </div>
            <a
              href="tel:116117"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0F4C2E] hover:bg-[#155D38] text-white py-2.5 px-4 rounded-xl font-bold text-lg shadow-sm transition-colors no-underline"
            >
              <PhoneCall className="w-5 h-5" />
              <span>116 117</span>
            </a>
          </div>

          {/* Giftnotruf 0228 19240 */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-500 transition-all">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-amber-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {lang === 'nl' ? 'Antigifcentrum' : 'Giftnotruf NRW'}
                </span>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-display font-bold text-base text-amber-950 mt-1 mb-1">
                {lang === 'nl' ? 'Giftnotrufzentrale (Bonn)' : 'Giftnotrufzentrale (Bonn)'}
              </h3>
              <p className="text-xs text-amber-900/80 leading-snug mb-3">
                {lang === 'nl'
                  ? 'Deskundig advies bij vermoeden van vergiftiging 24/7.'
                  : '24-Stunden-Beratung bei Vergiftungen mit Pflanzen, Pilzen etc.'}
              </p>
            </div>
            <a
              href="tel:022819240"
              className="w-full inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-3 rounded-xl font-bold text-sm shadow-sm transition-colors no-underline"
            >
              <PhoneCall className="w-4 h-4" />
              <span>0228 19 240</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: Apotheken-Notdienst (Offizielle Abfrage via aponet.de / ABDA) */}
      <section className="bg-white border-2 border-[#E7E2DA] rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EDE8E0] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Pill className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1B211D] flex items-center gap-2">
                {lang === 'nl' ? 'Apotheek-Spoeddienst Winterberg & Regio' : 'Apotheken-Notdienst Winterberg & Region'}
              </h2>
              <span className="text-xs text-[#5F6B63]">
                {lang === 'nl'
                  ? 'Officiële gegevens via aponet.de / ABDA (Bundesvereinigung Deutscher Apothekerverbände)'
                  : 'Offizielle Notdienstabfrage der Bundesvereinigung Deutscher Apothekerverbände (ABDA / aponet.de)'}
              </span>
            </div>
          </div>

          {/* Official Logo Attribution */}
          <div className="flex items-center gap-2 shrink-0 bg-[#FAF8F5] border border-[#EDE8E0] px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span className="text-[11px] text-[#8A928B] font-medium">Ein Service von:</span>
            <a 
              href="https://www.aponet.de" 
              target="_blank" 
              rel="noopener noreferrer"
              title="aponet.de - Das offizielle Gesundheitsportal der deutschen ApothekerInnen"
              className="hover:opacity-85 transition-opacity inline-flex items-center"
            >
              <img 
                decoding="async"
                src="https://www.aponet.de/fileadmin/public/widgets/logo_search_widget.svg" 
                alt="aponet.de - Offizielles Gesundheitsportal der deutschen ApothekerInnen" 
                className="h-6 w-auto"
              />
            </a>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            {lang === 'nl' ? 'Officiële Live Nooddienst-Zoekmodule (ABDA)' : 'Offizielle Notdienstabfrage der ABDA'}
          </div>
          <h3 className="font-display text-xl font-bold text-[#1B211D] m-0">
            {lang === 'nl' ? 'Vind direct de actuele dienstdoende apotheek' : 'Tagesaktuelle Notdienst-Apotheke jetzt live ermitteln'}
          </h3>
          <p className="text-xs text-[#5F6B63] mt-1 mb-5">
            {lang === 'nl'
              ? 'Typ een postcode of plaatsnaam in (standaard ingesteld op 59955 Winterberg).'
              : 'Geben Sie eine Postleitzahl oder einen Ort ein (voreingestellt auf 59955 Winterberg).'}
          </p>

          {/* Direct link to local regular pharmacies in directory */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-red-600" />
              <span>{lang === 'nl' ? '24/7 Nooddienst Live-Query (aponet.de)' : '24/7 Notdienst Live-Abfrage (aponet.de)'}</span>
            </span>

            <a
              href={lang === 'nl' ? '/nl/gezondheid-en-geneeskunde/apotheken' : '/gesundheit-und-medizin/apotheken'}
              onClick={(e) => {
                e.preventDefault();
                const targetPath = lang === 'nl' ? '/nl/gezondheid-en-geneeskunde/apotheken' : '/gesundheit-und-medizin/apotheken';
                if (onSelectBusiness) {
                  onSelectBusiness(targetPath);
                } else {
                  window.history.pushState(null, '', targetPath);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C2E] hover:text-[#155D38] hover:underline bg-[#E8F1EB] hover:bg-[#d8e7dc] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#0F4C2E]" />
              <span>{lang === 'nl' ? 'Reguliere openingstijden: Apotheken in Winterberg bekijken →' : 'Reguläre Öffnungszeiten: Apotheken in Winterberg anzeigen →'}</span>
            </a>
          </div>

          {/* Form directly opening exact PLZ/city on official aponet search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const clean = zipCity.trim();
              const plzMatch = clean.match(/\b\d{5}\b/);
              const query = plzMatch ? plzMatch[0] : (clean || '59955');
              const url = `https://www.aponet.de/apotheke/notdienstsuche/${encodeURIComponent(query)}`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            className="flex flex-col sm:flex-row gap-2.5 max-w-3xl"
          >
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-[#8A928B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="plzort"
                value={zipCity}
                onChange={(e) => setZipCity(e.target.value)}
                placeholder="PLZ oder Ort (z. B. 59955 Winterberg)"
                className="w-full bg-[#FAF8F5] border border-[#D8D2C8] focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-[#1B211D] font-semibold outline-none shadow-2xs transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap bg-red-600 hover:bg-red-700"
            >
              <Search className="w-4 h-4" />
              <span>{lang === 'nl' ? 'Nu live zoeken' : 'Jetzt Notdienst abrufen'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-85" />
            </button>
          </form>

          {/* 24/7 Telephone Hotlines & Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-5 border-t border-[#EDE8E0]">
            <a
              href="tel:08000022833"
              className="inline-flex items-center justify-between bg-[#FAF8F5] hover:bg-emerald-50/70 border border-emerald-300 text-[#0F4C2E] py-2.5 px-4 rounded-xl font-bold text-xs shadow-2xs transition-colors no-underline"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#0F4C2E]" />
                <span>Festnetz-Ansage (kostenlos):</span>
              </div>
              <span className="font-mono text-sm font-black">0800 00 22 833</span>
            </a>

            <a
              href="tel:22833"
              className="inline-flex items-center justify-between bg-[#FAF8F5] hover:bg-blue-50/70 border border-[#EDE8E0] text-[#1B211D] py-2.5 px-4 rounded-xl font-semibold text-xs shadow-2xs transition-colors no-underline"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Mobilfunk-Hotline (69 ct/Min):</span>
              </div>
              <span className="font-mono text-sm font-black text-blue-700">22 8 33</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#5F6B63] mt-3">
            <span>💡 <strong>Hinweis:</strong> Der Apotheken-Notdienst wechselt täglich um 09:00 Uhr morgens (24h bis zum Folgetag 09:00 Uhr).</span>
            <span>💶 Gesetzliche Notdienstgebühr: 2,50 € außerhalb der regulären Ladenöffnungszeiten.</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: Krankenhäuser & Notfallpraxis (Klinisches Blau zur klaren Unterscheidung) */}
      <section className="bg-gradient-to-br from-[#F0F6FA] via-[#F8FAFC] to-[#EFF6FB] border-2 border-[#BCD7E8] rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#D0E2EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005288] text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-bold text-[#0F2942] m-0">
                  {lang === 'nl' ? 'Ziekenhuizen & Centrale Huisartsenpost' : 'Krankenhäuser & Zentrale Notfallpraxis'}
                </h2>
                <span className="bg-[#DCEBF6] text-[#004777] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  24/7 Notaufnahmen
                </span>
              </div>
              <span className="text-xs text-[#526D82] mt-0.5 block">
                {lang === 'nl' ? 'Medische spoedopname en eerste hulp in het Sauerland' : 'Stationäre Notfallversorgung und Bereitschaftspraxen im Hochsauerland'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {HOSPITALS_DATA.map((hospital, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#D0E2EE] hover:border-[#005288]/60 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
                <div>
                  <span className="text-[11px] font-bold text-[#005288] uppercase tracking-wider block mb-0.5">
                    {lang === 'nl' ? hospital.typeNl : hospital.typeDe}
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#0F2942] m-0">
                    {hospital.name}
                  </h3>
                </div>
                <a
                  href={`tel:${hospital.phone}`}
                  className="inline-flex items-center gap-1.5 bg-[#F0F6FA] hover:bg-[#005288] hover:text-white border border-[#BCD7E8] text-[#005288] px-3.5 py-2 rounded-lg font-bold text-xs transition-all shadow-2xs no-underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{hospital.phoneDisplay}</span>
                </a>
              </div>

              <p className="text-xs text-[#526D82] flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#005288]/70 shrink-0" />
                <span>{hospital.address}</span>
              </p>

              <div className="bg-[#F8FAFC] border border-[#DCEBF6] rounded-lg p-3 text-xs text-[#334E68] mt-3">
                <div className="font-bold text-[#0F2942] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#005288]" />
                  <span>{lang === 'nl' ? hospital.emergencyRoomNl : hospital.emergencyRoomDe}</span>
                </div>
                <div className="text-[#526D82] leading-relaxed">
                  {lang === 'nl' ? hospital.hoursNl : hospital.hoursDe}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Notfall-Leitfaden (Die 5 W-Fragen) */}
      <section className="bg-gradient-to-br from-[#FAF8F5] to-white border-2 border-[#E7E2DA] rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="font-display text-lg font-bold text-[#1B211D] mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0F4C2E]" />
          {lang === 'nl' ? 'Wat te doen bij een noodoproep? (De 5 W-vragen)' : 'Verhalten beim Notruf (Die 5 W-Fragen)'}
        </h3>
        <p className="text-xs text-[#5F6B63] mb-5 leading-relaxed">
          {lang === 'nl'
            ? 'Blijf rustig en geef de medewerker van de alarmcentrale (112) de volgende informatie:'
            : 'Bleiben Sie ruhig und beantworten Sie der Rettungsleitstelle (112) die folgenden Fragen:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">{lang === 'nl' ? '1. WAAR?' : '1. WO?'}</strong>
            <span className="text-[#5F6B63]">{lang === 'nl' ? 'Plaats, straat, huisnummer, piste of herkenningspunt.' : 'Ort, Straße, Hausnummer, Piste oder markanter Punkt.'}</span>
          </div>
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">{lang === 'nl' ? '2. WIE?' : '2. WER?'}</strong>
            <span className="text-[#5F6B63]">{lang === 'nl' ? 'Wie meldt het noodgeval? (Uw naam en telefoonnummer voor vragen)' : 'Wer meldet den Notfall? Name und Rückrufnummer für Rückfragen.'}</span>
          </div>
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">{lang === 'nl' ? '3. HOEVEEL?' : '3. WIE VIELE?'}</strong>
            <span className="text-[#5F6B63]">{lang === 'nl' ? 'Hoeveel personen zijn gewond of hebben hulp nodig?' : 'Wie viele Personen sind verletzt oder betroffen?'}</span>
          </div>
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">{lang === 'nl' ? '4. WELKE?' : '4. WELCHE?'}</strong>
            <span className="text-[#5F6B63]">{lang === 'nl' ? 'Welke verwondingen of symptomen zijn er? Ademhaling?' : 'Welche Art von Verletzungen liegen vor? Atmet die Person?'}</span>
          </div>
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">{lang === 'nl' ? '5. WACHTEN!' : '5. WARTEN!'}</strong>
            <span className="text-[#5F6B63]">{lang === 'nl' ? 'Niet direct ophangen! Wacht op vragen van de meldkamer.' : 'Nicht sofort auflegen! Auf Rückfragen der Leitstelle warten.'}</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EmergencyPage;
