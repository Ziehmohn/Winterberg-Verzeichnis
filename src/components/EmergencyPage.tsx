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
  HeartPulse, 
  Sparkles, 
  HelpCircle, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Stethoscope,
  Phone
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { 
  EMERGENCY_NUMBERS, 
  HOSPITALS_DATA, 
  WINTERBERG_PHARMACIES, 
  DEFIBRILLATOR_LOCATIONS 
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
  const [searchPostCode, setSearchPostCode] = useState('59955');

  // Determine on-duty pharmacy for today (rotating formula based on date)
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const activePharmacyIndex = dayOfYear % WINTERBERG_PHARMACIES.length;
  const currentDutyPharmacy = WINTERBERG_PHARMACIES[activePharmacyIndex];

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

      {/* SECTION 2: Apotheken-Notdienst (Live via aponet.de / ABDA) */}
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
                  : 'Offizielle Notdienstabfrage via aponet.de / ABDA (Bundesvereinigung Deutscher Apothekerverbände)'}
              </span>
            </div>
          </div>

          <a
            href="https://www.aponet.de/apotheke/notdienstsuche/59955"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#0F4C2E] hover:bg-[#155D38] text-white py-2 px-3.5 rounded-lg text-xs font-bold transition-colors no-underline shadow-2xs"
          >
            <span>{lang === 'nl' ? 'Openen op aponet.de' : 'Offizielle Suche auf aponet.de'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Highlight Card: Today's On-Duty Pharmacy */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-2 border-emerald-300 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                {lang === 'nl' ? 'Dienstdoende Apotheek Vandaag (tot morgen 09:00 uur)' : 'Heute Notdienst (von 09:00 bis morgen 09:00 Uhr)'}
              </span>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full border border-emerald-200">
              {today.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <h3 className="font-display text-2xl font-black text-[#1B211D] mb-2">
                {currentDutyPharmacy.name}
              </h3>
              <p className="text-sm text-[#4A544D] flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-[#0F4C2E] shrink-0" />
                <span>{currentDutyPharmacy.street}, {currentDutyPharmacy.postCode} {currentDutyPharmacy.city}</span>
                {currentDutyPharmacy.distanceKm && (
                  <span className="text-xs text-[#8A928B] font-semibold">({currentDutyPharmacy.distanceKm} km)</span>
                )}
              </p>
              <p className="text-xs text-[#5F6B63] mt-2">
                💡 {lang === 'nl' 
                  ? 'Buiten de normale openingstijden geldt een wettelijke noodtoeslag van € 2,50.' 
                  : 'Außerhalb der regulären Ladenöffnungszeiten fällt die gesetzliche Notdienstgebühr von 2,50 € an.'}
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${currentDutyPharmacy.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0F4C2E] hover:bg-[#155D38] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition-colors no-underline"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{currentDutyPharmacy.phoneDisplay}</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentDutyPharmacy.name + ' ' + currentDutyPharmacy.street + ' ' + currentDutyPharmacy.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#FAF8F5] border border-[#EDE8E0] text-[#1B211D] py-3 px-4 rounded-xl font-bold text-sm shadow-2xs transition-colors no-underline"
              >
                <Navigation className="w-4 h-4 text-[#D65F0C]" />
                <span>{lang === 'nl' ? 'Route' : 'Route'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* All rotating pharmacies list in region */}
        <h4 className="font-display font-bold text-sm text-[#1B211D] uppercase tracking-wider mb-3">
          {lang === 'nl' ? 'Apotheken in Winterberg & Omliggende Gemeenten' : 'Apotheken im Notdienst-Turnus Winterberg & Umgebung'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WINTERBERG_PHARMACIES.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className={`p-4 rounded-xl border transition-all ${
                pharmacy.id === currentDutyPharmacy.id
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-[#FAF8F5] border-[#EDE8E0]'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h5 className="font-bold text-sm text-[#1B211D] m-0">{pharmacy.name}</h5>
                {pharmacy.id === currentDutyPharmacy.id && (
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                    {lang === 'nl' ? 'Nu dienst' : 'Notdienst'}
                  </span>
                )}
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
                  className="text-xs text-[#8A928B] hover:text-[#1B211D]"
                >
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

      {/* SECTION 4: Defibrillatoren Standorte (AED) */}
      <section className="bg-white border border-[#EDE8E0] rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#EDE8E0]">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-[#1B211D]">
              {lang === 'nl' ? 'Defibrillatoren (AED) in Winterberg' : 'Defibrillatoren (AED-Standorte) in Winterberg'}
            </h2>
            <span className="text-xs text-[#5F6B63]">
              {lang === 'nl' ? 'Publiek toegankelijke AED-apparaten bij hartstilstand' : 'Öffentlich zugängliche Lebensretter im Stadtgebiet'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEFIBRILLATOR_LOCATIONS.map((aed, idx) => (
            <div key={idx} className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full inline-block mb-1.5">
                  AED
                </span>
                <h4 className="font-bold text-sm text-[#1B211D] mb-1">
                  {lang === 'nl' ? aed.nameNl : aed.nameDe}
                </h4>
                <p className="text-xs text-[#5F6B63] flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-[#8A928B] shrink-0" />
                  <span>{aed.address}</span>
                </p>
              </div>
              <div className="text-[11.5px] font-semibold text-[#0F4C2E] pt-2 border-t border-[#EDE8E0]/70">
                {aed.access}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Notfall-Leitfaden (Die 5 W-Fragen) */}
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
