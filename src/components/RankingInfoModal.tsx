import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Scale, HelpCircle, CheckCircle2, Star, Sparkles, Award } from 'lucide-react';
import { useTranslation } from '../i18n';

interface RankingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: 'score' | 'verified';
}

export const RankingInfoModal: React.FC<RankingInfoModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'score',
}) => {
  const { t, lang } = useTranslation();
  const isNl = lang === 'nl';
  const [activeTopic, setActiveTopic] = useState<'score' | 'verified'>(initialTopic);

  useEffect(() => {
    if (initialTopic) setActiveTopic(initialTopic);
  }, [initialTopic, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#EDE8E0] overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#EDE8E0] bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0F4C2E] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#1B211D]">
                    {isNl ? 'Transparantie & Kwaliteitsstandaarden' : 'Transparenz & Qualitätsstandards'}
                  </h3>
                  <p className="text-xs text-[#5F6B63]">
                    {isNl ? 'Het Winterberg Overzicht Kwaliteitsgarantie' : 'Das Winterberg Verzeichnis Qualitätsgarantie'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-[#EDE8E0] hover:bg-gray-100 text-[#5F6B63] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Topic Switcher Tabs */}
            <div className="flex border-b border-[#EDE8E0] bg-[#FAF8F5] p-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTopic('score')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTopic === 'score'
                    ? 'bg-white text-[#0F4C2E] shadow-xs border border-[#EDE8E0]'
                    : 'text-[#5F6B63] hover:text-[#1B211D] hover:bg-black/5'
                }`}
              >
                <Scale className="w-4 h-4 text-[#F2761B]" />
                <span>{isNl ? 'Gewogen Kwaliteitsscore' : 'Gewichteter Score'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTopic('verified')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTopic === 'verified'
                    ? 'bg-white text-[#0F4C2E] shadow-xs border border-[#EDE8E0]'
                    : 'text-[#5F6B63] hover:text-[#1B211D] hover:bg-black/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isNl ? 'Wat betekent Verifieerd?' : 'Was bedeutet Verifiziert?'}</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto text-sm text-[#4A544D] space-y-5 leading-relaxed">
              {activeTopic === 'score' ? (
                <>
                  <div>
                    <h4 className="font-display font-bold text-base text-[#1B211D] mb-2 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#F2761B]" />
                      {isNl ? 'Waarom is de ranglijst-score gewogen?' : 'Warum ist der Ranking-Score gewichtet?'}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5F6B63]">
                      {isNl
                        ? 'Ons algoritme voorkomt het bekende „5-sterren probleem”. Het beloont zowel uitstekende beoordelingen als betrouwbaarheid over een langere periode.'
                        : 'Unser Algorithmus verhindert den klassischen „5-Sterne-Fehlschluss”. Er belohnt sowohl exzellente Noten als auch dauerhafte Beständigkeit und Beliebtheit.'}
                    </p>
                  </div>

                  {/* Practical Example Box */}
                  <div className="bg-[#FFF8F1] border border-orange-200/80 rounded-xl p-4 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D65F0C] block">
                      {isNl ? 'Praktijkvoorbeeld van de berekening:' : 'Praxisbeispiel der Berechnung:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-orange-100 shadow-2xs">
                        <span className="font-bold text-[#1B211D] block mb-1">
                          {isNl ? 'Bedrijf A (Nieuw):' : 'Betrieb A (Neu):'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          {'★'.repeat(5)} <span className="font-bold text-[#1B211D]">5,0</span>
                        </div>
                        <p className="text-[#8A928B]">
                          {isNl ? '1 enkele recensie' : '1 Einzelbewertung'}
                        </p>
                        <div className="mt-2 text-[11px] font-semibold text-[#5F6B63] pt-2 border-t border-gray-100">
                          {isNl ? 'Nog te weinig data voor top 1' : 'Braucht noch Bestätigung'}
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-orange-100 shadow-2xs">
                        <span className="font-bold text-[#1B211D] block mb-1">
                          {isNl ? 'Betrijf B (Favoriet):' : 'Betrieb B (Publikumsliebling):'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          {'★'.repeat(5)} <span className="font-bold text-[#1B211D]">4,9</span>
                        </div>
                        <p className="text-[#8A928B]">
                          {isNl ? '85 echte beoordelingen' : '85 echte Kundenbewertungen'}
                        </p>
                        <div className="mt-2 text-[11px] font-bold text-emerald-700 pt-2 border-t border-gray-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isNl ? 'Staat verdiend op nummer 1' : 'Verdienter Platz 1'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advantages list */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1B211D] block">
                      {isNl ? 'Uw voordelen als bezoeker:' : 'Ihre Vorteile als Besucher:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#5F6B63]">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>{isNl ? 'Eerlijke vergelijking:' : 'Faire Verlässlichkeit:'}</strong> {isNl ? 'Geen manipulatie door 1 enkele neprecensie.' : 'Keine Verzerrung durch einzelne Gefälligkeitsbewertungen.'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>{isNl ? 'Kans voor nieuwkomers:' : 'Chance für Newcomer:'}</strong> {isNl ? 'Nieuwe bedrijven stijgen organisch met elke tevreden klant.' : 'Neue Betriebe steigen mit jeder zufriedenen Kundenstimme sauber auf.'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>{isNl ? 'Volledig transparant:' : 'Vollständig neutral:'}</strong> {isNl ? 'Zelfde regels voor alle deelnemende bedrijven.' : 'Gleiche mathematische Spielregeln für alle Betriebe.'}</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-display font-bold text-base text-[#1B211D] mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {isNl ? 'Wat betekent het label „Geverifieerd”?' : 'Was garantiert das Siegel „Verifiziert” & Spam-Schutz?'}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5F6B63]">
                      {isNl
                        ? 'Kwaliteit en betrouwbaarheid staan voorop. Wij nemen concrete maatregelen conform de Europese Omnibus-richtlijn om uitsluitend echte ervaringen te tonen.'
                        : 'Vertrauen und Qualität stehen an erster Stelle. Gemäß der EU-Omnibus-Richtlinie (§ 5b UWG) stellen wir durch mehrstufige Prüfungen sicher, dass Bewertungen und Unternehmensdaten authentisch sind.'}
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] flex items-start gap-3">
                      <div className="w-7 h-7 rounded-md bg-emerald-100 text-[#0F4C2E] flex items-center justify-center shrink-0 text-xs font-bold">
                        1
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#1B211D] block mb-0.5">
                          {isNl ? 'Geverifieerde recensies (Spambeveiliging)' : 'Geprüfte Bewertungen & Spamschutz'}
                        </span>
                        <p className="text-xs text-[#5F6B63]">
                          {isNl
                            ? 'Elke recensie ondergaat een plausibiliteitscontrole. Automatische bots en neprecensies worden geweerd.'
                            : 'Jede Bewertung durchläuft eine Plausibilitätsprüfung und Spam-Filterung, bevor sie freigeschaltet wird.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] flex items-start gap-3">
                      <div className="w-7 h-7 rounded-md bg-emerald-100 text-[#0F4C2E] flex items-center justify-center shrink-0 text-xs font-bold">
                        2
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#1B211D] block mb-0.5">
                          {isNl ? 'Geverifieerde bedrijfsgegevens' : 'Geprüfte Unternehmensdaten'}
                        </span>
                        <p className="text-xs text-[#5F6B63]">
                          {isNl
                            ? 'Het bedrijf is een reëel bestaande onderneming met fysiek adres in Winterberg of de dorpen.'
                            : 'Das Unternehmen ist ein real existierender Gewerbebetrieb mit Sitz oder Einsatzgebiet in Winterberg und den Ortsteilen.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] flex items-start gap-3">
                      <div className="w-7 h-7 rounded-md bg-emerald-100 text-[#0F4C2E] flex items-center justify-center shrink-0 text-xs font-bold">
                        3
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#1B211D] block mb-0.5">
                          {isNl ? 'Recht op wederhoor voor ondernemers' : 'Recht auf Stellungnahme'}
                        </span>
                        <p className="text-xs text-[#5F6B63]">
                          {isNl
                            ? 'Ondernemers kunnen reageren op feedback om een transparante dialoog te waarborgen.'
                            : 'Inhaber können auf Kundenbewertungen öffentlich antworten, um Sachverhalte transparent aufzuklären.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#EDE8E0] bg-[#FAF8F5] flex items-center justify-between">
              <span className="text-[11px] text-[#8A928B] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F2761B]" />
                {isNl ? 'Conform EU-Omnibus Richtlijn' : 'Gemäß EU-Omnibus Richtlinie (UWG)'}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#0F4C2E] hover:bg-[#06301C] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {isNl ? 'Begrepen' : 'Verstanden'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default RankingInfoModal;
