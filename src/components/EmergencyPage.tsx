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
  Navigation, 
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
  HOSPITALS_DATA, 
  WINTERBERG_PHARMACIES 
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#EDE8E0] mb-6">
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

          <a
            href="https://www.aponet.de/apotheke/notdienstsuche/59955"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0F4C2E] hover:bg-[#155D38] text-white py-2.5 px-4 rounded-xl text-sm font-bold transition-all no-underline shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>{lang === 'nl' ? 'Live Notdienst-Apotheek Zoeken' : 'Tagesaktuelle Notdienst-Apotheke auf aponet.de abrufen'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Info & Hotlines Card */}
        <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 border-2 border-red-200 rounded-2xl p-6 shadow-2xs mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                {lang === 'nl' ? 'Officiële 24/7 Nooddienst-Infolijnen' : 'Offizielle 24/7 Notdienst-Auskunft'}
              </div>
              <h3 className="font-display text-xl font-bold text-[#1B211D] mb-2">
                {lang === 'nl' ? 'Welke apotheek heeft vandaag dienst in Winterberg?' : 'Welche Apotheke hat heute in Winterberg Notdienst?'}
              </h3>
              <p className="text-xs text-[#4A544D] leading-relaxed mb-4">
                {lang === 'nl'
                  ? 'De spoeddienst rouleert dagelijks vanaf 09:00 uur (tot de volgende ochtend 09:00 uur) tussen de apotheken in Winterberg, Medebach, Hallenberg en Olsberg. Raadpleeg direct de actuele dagdienst via aponet.de of telefonisch:'
                  : 'Der Apotheken-Notdienst wechselt täglich um 09:00 Uhr morgens (24h bis zum Folgetag 09:00 Uhr) zwischen den Apotheken in Winterberg und den Nachbargemeinden. Rufen Sie die tagesaktuelle Einteilung direkt live ab:'}
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-[#5F6B63]">
                <span className="bg-white border border-[#EDE8E0] px-3 py-1.5 rounded-lg font-medium">
                  💡 Notdienstgebühr: 2,50 € außerhalb der Öffnungszeiten
                </span>
                <span className="bg-white border border-[#EDE8E0] px-3 py-1.5 rounded-lg font-medium">
                  🏥 Wechsel täglich um 09:00 Uhr
                </span>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-2.5">
              <a
                href="https://www.aponet.de/apotheke/notdienstsuche/59955"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition-all no-underline"
              >
                <Search className="w-4 h-4" />
                <span>{lang === 'nl' ? 'Apotheek-Notdienst Live bekijken' : 'Notdienstsuche Winterberg (PLZ 59955)'}</span>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>

              <a
                href="tel:08000022833"
                className="w-full inline-flex items-center justify-between bg-white hover:bg-emerald-50 border border-emerald-300 text-[#0F4C2E] py-2.5 px-4 rounded-xl font-bold text-xs shadow-2xs transition-colors no-underline"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#0F4C2E]" />
                  <span>Festnetz (kostenlos):</span>
                </div>
                <span className="font-mono text-sm font-black">0800 00 22 833</span>
              </a>

              <a
                href="tel:22833"
                className="w-full inline-flex items-center justify-between bg-white hover:bg-blue-50 border border-[#EDE8E0] text-[#1B211D] py-2.5 px-4 rounded-xl font-semibold text-xs shadow-2xs transition-colors no-underline"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Mobilfunk (69 ct/Min):</span>
                </div>
                <span className="font-mono text-sm font-black text-blue-700">22 8 33</span>
              </a>
            </div>
          </div>
        </div>

        {/* All rotating pharmacies list in region */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display font-bold text-sm text-[#1B211D] uppercase tracking-wider m-0">
            {lang === 'nl' ? 'Apotheken in Winterberg & Regio' : 'Apotheken in Winterberg & Region'}
          </h4>
          <span className="text-xs text-[#5F6B63]">
            {lang === 'nl' ? 'Direct contact & route' : 'Direkte Kontaktdaten & Route'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WINTERBERG_PHARMACIES.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="bg-[#FAF8F5] border border-[#EDE8E0] hover:border-[#0F4C2E]/40 p-4 rounded-xl transition-all"
            >
              <div className="flex justify-between items-start mb-1">
                <h5 className="font-bold text-sm text-[#1B211D] m-0">{pharmacy.name}</h5>
              </div>
              <p className="text-xs text-[#5F6B63] m-0">{pharmacy.street}, {pharmacy.postCode} {pharmacy.city}</p>
              <div className="mt-2.5 pt-2 border-t border-[#EDE8E0]/70 flex items-center justify-between">
                <a
                  href={`tel:${pharmacy.phone}`}
                  className="text-xs font-bold text-[#0F4C2E] hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>{pharmacy.phoneDisplay}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.name + ' ' + pharmacy.street + ' ' + pharmacy.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#8A928B] hover:text-[#1B211D] flex items-center gap-1"
                >
                  <span>Route</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Krankenhäuser & Notfallpraxis */}
      <section className="bg-white border border-[#EDE8E0] rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#EDE8E0]">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-[#1B211D]">
              {lang === 'nl' ? 'Ziekenhuizen & Centrale Huisartsenpost' : 'Krankenhäuser & Zentrale Notfallpraxis'}
            </h2>
            <span className="text-xs text-[#5F6B63]">
              {lang === 'nl' ? 'Medische spoedopname en eerste hulp in het Sauerland' : 'Stationäre Notfallversorgung und Bereitschaftspraxen'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {HOSPITALS_DATA.map((hospital, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-xl p-5 hover:border-[#0F4C2E]/40 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
                <div>
                  <span className="text-[11px] font-bold text-[#0F4C2E] uppercase tracking-wider block mb-0.5">
                    {lang === 'nl' ? hospital.typeNl : hospital.typeDe}
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#1B211D] m-0">
                    {hospital.name}
                  </h3>
                </div>
                <a
                  href={`tel:${hospital.phone}`}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-[#0F4C2E] hover:text-white border border-[#EDE8E0] text-[#0F4C2E] px-3.5 py-2 rounded-lg font-bold text-xs transition-colors shadow-2xs no-underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{hospital.phoneDisplay}</span>
                </a>
              </div>

              <p className="text-xs text-[#5F6B63] flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#8A928B] shrink-0" />
                <span>{hospital.address}</span>
              </p>

              <div className="bg-white border border-[#EDE8E0] rounded-lg p-3 text-xs text-[#4A544D] mt-3">
                <div className="font-bold text-[#1B211D] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0F4C2E]" />
                  <span>{lang === 'nl' ? hospital.emergencyRoomNl : hospital.emergencyRoomDe}</span>
                </div>
                <div className="text-[#5F6B63] leading-relaxed">
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
            <strong className="text-red-700 font-bold block text-sm mb-1">1. WO?</strong>
            <span className="text-[#5F6B63]">Ort, Straße, Hausnummer, Piste oder markanter Punkt.</span>
          </div>
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">2. WAS?</strong>
            <span className="text-[#5F6B63]">Was ist genau passiert? Verkehrsunfall, Sturz, Bewusstlosigkeit?</span>
          </div>
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">3. WIE VIELE?</strong>
            <span className="text-[#5F6B63]">Wie viele Personen sind verletzt oder betroffen?</span>
          </div>
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">4. WELCHE?</strong>
            <span className="text-[#5F6B63]">Welche Art von Verletzungen liegen vor? Atmet die Person?</span>
          </div>
          <div className="bg-white border border-[#EDE8E0] rounded-xl p-3.5 shadow-2xs">
            <strong className="text-red-700 font-bold block text-sm mb-1">5. WARTEN!</strong>
            <span className="text-[#5F6B63]">Nicht sofort auflegen! Auf Rückfragen der Leitstelle warten.</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EmergencyPage;
