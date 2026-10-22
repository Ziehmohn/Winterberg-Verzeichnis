import React, { useState } from 'react';
import { 
  X, 
  Hammer, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Check,
  Copy
} from 'lucide-react';
import { TenderProject, TenderTimeframe, ThemeConfig } from '../types';
import { createTender, formatTimeframe } from '../services/tenderService';
import { SITE } from '../config';

interface SubmitTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTenderCreated: (newTender: TenderProject) => void;
  theme?: ThemeConfig;
}

const HANDWERK_SUBCATEGORIES = [
  'Heizungstechnik',
  'Dachdecker',
  'Elektriker',
  'Schreinereien',
  'Maler & Lackierer',
  'Bauunternehmen',
  'Gartenbauer',
  'Bäderstudios',
  'Baumschulen',
  'Wäschereien',
  'Maschinenbau',
  'Sonstiges Handwerk'
];

export default function SubmitTenderModal({
  isOpen,
  onClose,
  onTenderCreated
}: SubmitTenderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'success'>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [subcategory, setSubcategory] = useState('Heizungstechnik');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('Winterberg (Kernstadt)');
  const [timeframe, setTimeframe] = useState<TenderTimeframe>('1_month');
  const [budgetRange, setBudgetRange] = useState('Keine Angabe');
  const [images, setImages] = useState<string[]>([]);
  
  // Contact Fields
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'phone' | 'email' | 'any'>('phone');
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  // Success state
  const [createdTenderResult, setCreatedTenderResult] = useState<{ id: string; manageToken: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // File Upload to compressed Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 4) {
      alert('Sie können maximal 4 Fotos hochladen.');
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > 4 * 1024 * 1024) {
        alert(`Das Bild ${file.name} ist zu groß (max. 4 MB).`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          setImages(prev => [...prev, base64].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validation
  const canGoToStep2 = title.trim().length >= 5 && description.trim().length >= 15;
  const canGoToStep3 = !!district && !!timeframe;
  const canSubmit = contactName.trim().length >= 2 && 
                    contactEmail.includes('@') && 
                    agreedPrivacy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMessage(null);

    const payload = {
      title: title.trim(),
      category: 'Handwerk',
      subcategory,
      district,
      timeframe,
      description: description.trim(),
      budgetRange: budgetRange !== 'Keine Angabe' ? budgetRange : undefined,
      images: images.length > 0 ? images : undefined,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim() || undefined,
      preferredContactMethod
    };

    const res = await createTender(payload);
    setLoading(false);

    if (res.success && res.id && res.manageToken) {
      const createdObj: TenderProject = {
        ...payload,
        id: res.id,
        createdAt: Date.now(),
        status: 'active',
        manageToken: res.manageToken,
        unlockedBy: [],
        viewsCount: 0
      };
      setCreatedTenderResult({ id: res.id, manageToken: res.manageToken });
      onTenderCreated(createdObj);
      setStep('success');
    } else {
      setErrorMessage(res.error || 'Es gab einen Fehler beim Veröffentlichen. Bitte versuchen Sie es erneut.');
    }
  };

  const copyManageLink = () => {
    if (!createdTenderResult) return;
    const url = `${window.location.origin}/auftragsboerse?manage=${createdTenderResult.id}&token=${createdTenderResult.manageToken}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#E7E2DA] flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0F4C2E] text-white p-5 sm:p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F2761B] text-white">
              <Sparkles className="w-3.5 h-3.5" /> Kostenlos & Unverbindlich
            </span>
            <span className="text-xs text-white/70">Winterberger Auftragsbörse</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Handwerker-Auftrag ausschreiben
          </h2>
          <p className="text-sm text-white/80 mt-1 max-w-[50ch]">
            Beschreiben Sie Ihr Projekt in 4 kurzen Schritten – geprüfte Winterberger Betriebe melden sich direkt bei Ihnen.
          </p>

          {/* Stepper Bar */}
          {step !== 'success' && (
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[
                { s: 1, label: 'Gewerk & Idee' },
                { s: 2, label: 'Ort & Zeit' },
                { s: 3, label: 'Bilder (opt.)' },
                { s: 4, label: 'Kontakt' }
              ].map(st => (
                <div key={st.s} className="flex flex-col gap-1">
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= st.s ? 'bg-[#F2761B]' : 'bg-white/20'
                  }`} />
                  <span className={`text-[10px] hidden sm:block ${
                    step === st.s ? 'text-white font-bold' : 'text-white/60'
                  }`}>
                    {st.s}. {st.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SCHRITT 1: Gewerk & Projekt */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                  1. Passendes Gewerk wählen *
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#CCD4CF] rounded-xl text-sm font-medium text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                >
                  {HANDWERK_SUBCATEGORIES.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                  2. Projekttitel / Kurzbeschreibung *
                </label>
                <input
                  type="text"
                  placeholder="z. B. Neue Wärmepumpe einbauen oder Dachrinnen-Reparatur"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#CCD4CF] rounded-xl text-sm text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                />
                <span className="text-[11px] text-[#5F6B63] mt-1 block">
                  Mindestens 5 Zeichen ({title.length}/100)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                  3. Was genau soll gemacht werden? *
                </label>
                <textarea
                  rows={4}
                  placeholder="Beschreiben Sie Ihr Anliegen: z. B. Art des Gebäudes, Baujahr, Besonderheiten, bisheriger Zustand oder konkrete Wünsche..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#CCD4CF] rounded-xl text-sm text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                />
                <span className="text-[11px] text-[#5F6B63] mt-1 block">
                  Je genauer die Angaben, desto passender können sich Betriebe vorbereiten. ({description.length} Zeichen)
                </span>
              </div>
            </div>
          )}

          {/* SCHRITT 2: Ort & Zeit */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                  In welchem Ortsteil befindet sich das Projekt? *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#0F4C2E] absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#CCD4CF] rounded-xl text-sm font-medium text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                  >
                    {SITE.districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                  Wann soll die Arbeit ausgeführt werden? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'urgent' as TenderTimeframe, label: 'Dringend / Schnellstmöglich', desc: 'z. B. Reparatur, Notfall' },
                    { id: '1_month' as TenderTimeframe, label: 'In den nächsten 4 Wochen', desc: 'Zeitnahe Umsetzung' },
                    { id: '3_months' as TenderTimeframe, label: 'In den nächsten 1–3 Monaten', desc: 'Mittelfristige Planung' },
                    { id: 'flexible' as TenderTimeframe, label: 'Flexibel / Nach Absprache', desc: 'Kein Zeitdruck' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTimeframe(item.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        timeframe === item.id 
                          ? 'border-[#0F4C2E] bg-[#0F4C2E]/5 ring-1 ring-[#0F4C2E]' 
                          : 'border-[#CCD4CF] hover:border-[#0F4C2E]/50'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#1B211D]">{item.label}</div>
                      <div className="text-[11px] text-[#5F6B63] mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                  Geschätzter Budgetrahmen (optional)
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#CCD4CF] rounded-xl text-sm text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                >
                  <option value="Keine Angabe">Keine Angabe / Auf Angebot warten</option>
                  <option value="Bis 500 €">Bis 500 € (Kleinreparatur)</option>
                  <option value="500 - 2.000 €">500 € – 2.000 €</option>
                  <option value="2.000 - 5.000 €">2.000 € – 5.000 €</option>
                  <option value="5.000 - 15.000 €">5.000 € – 15.000 €</option>
                  <option value="Über 15.000 €">Über 15.000 € (Größeres Vorhaben)</option>
                </select>
              </div>
            </div>
          )}

          {/* SCHRITT 3: Fotos (optional) */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1">
                  Fotos oder Pläne anhängen (optional)
                </label>
                <p className="text-xs text-[#5F6B63] mb-3">
                  Bilder helfen Handwerkern enorm, den Aufwand vorab einzuschätzen (max. 4 Bilder, je bis 4 MB).
                </p>

                {/* Upload Button */}
                {images.length < 4 && (
                  <label className="border-2 border-dashed border-[#CCD4CF] hover:border-[#0F4C2E] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F7F5F0]">
                    <Upload className="w-8 h-8 text-[#0F4C2E] mb-2" />
                    <span className="text-xs font-bold text-[#1B211D]">Fotos auswählen oder hier ablegen</span>
                    <span className="text-[11px] text-[#5F6B63] mt-0.5">JPG, PNG, WebP</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                )}

                {/* Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-[#E7E2DA] aspect-square group bg-gray-50">
                        <img src={img} alt={`Vorschau ${i+1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                          title="Löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Hinweis: Bitte laden Sie keine Bilder hoch, die sensible persönliche Daten (z. B. Kontoauszüge oder Adressschilder) zeigen.
                </span>
              </div>
            </div>
          )}

          {/* SCHRITT 4: Kontaktdaten */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>
                  <strong>Datenschutz:</strong> Ihre Kontaktdaten sind geschützt und werden nur an verifizierte Winterberger Premium-Handwerksbetriebe weitergegeben.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                  Ihr Name *
                </label>
                <input
                  type="text"
                  placeholder="z. B. Markus Schneider oder Familie Krämer"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#CCD4CF] rounded-xl text-sm text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                    E-Mail-Adresse *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5F6B63] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="name@beispiel.de"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#CCD4CF] rounded-xl text-sm text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                    />
                  </div>
                  <span className="text-[10px] text-[#5F6B63] mt-1 block">Für Status-Updates & Bestätigung</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                    Telefonnummer (empfohlen)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#5F6B63] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="0171 / ..."
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#CCD4CF] rounded-xl text-sm text-[#1B211D] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]"
                    />
                  </div>
                  <span className="text-[10px] text-[#5F6B63] mt-1 block">Für schnelle telefonische Rückfragen</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F6B63] mb-1.5">
                  Bevorzugter Erstkontakt
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'phone' as const, label: 'Telefon bevorzugt' },
                    { id: 'email' as const, label: 'E-Mail bevorzugt' },
                    { id: 'any' as const, label: 'Egal / Beides' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferredContactMethod(opt.id)}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        preferredContactMethod === opt.id
                          ? 'border-[#0F4C2E] bg-[#0F4C2E] text-white'
                          : 'border-[#CCD4CF] bg-white text-[#1B211D] hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedPrivacy}
                    onChange={(e) => setAgreedPrivacy(e.target.checked)}
                    className="mt-0.5 rounded border-[#CCD4CF] text-[#0F4C2E] focus:ring-[#0F4C2E] w-4 h-4"
                  />
                  <span className="text-xs text-[#5F6B63] leading-relaxed">
                    Ich stimme zu, dass verifizierte Winterberger Handwerksbetriebe zur Angebotserstellung und Abstimmung Kontakt mit mir aufnehmen dürfen. Ich kann den Auftrag jederzeit beenden.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ERFOLGS-SCREEN */}
          {step === 'success' && createdTenderResult && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#1B211D]">
                Ausschreibung erfolgreich veröffentlicht!
              </h3>
              <p className="text-sm text-[#5F6B63] max-w-[48ch] mx-auto">
                Ihr Auftrag ist jetzt in der Winterberger Auftragsbörse gelistet. Passende Handwerksbetriebe werden benachrichtigt.
              </p>

              <div className="bg-[#F7F5F0] border border-[#CCD4CF] rounded-xl p-4 text-left max-w-lg mx-auto space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C2E]">
                    Ihr persönlicher Verwaltungscode
                  </span>
                  <span className="text-[11px] text-[#5F6B63]">Auch per E-Mail gesendet</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-[#E7E2DA]">
                  <code className="text-sm font-mono font-bold text-[#1B211D] flex-1">
                    {createdTenderResult.manageToken}
                  </code>
                  <button
                    type="button"
                    onClick={copyManageLink}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#0F4C2E] text-white text-xs font-bold rounded-md hover:bg-[#0c3c24] transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'Kopiert!' : 'Link kopieren'}
                  </button>
                </div>
                <p className="text-[11px] text-[#5F6B63]">
                  Mit diesem Link oder Code können Sie den Auftrag jederzeit mit einem Klick schließen, sobald Sie einen Handwerker gefunden haben.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#0F4C2E] hover:bg-[#0c3c24] text-white font-bold text-sm rounded-xl shadow-md transition-colors"
                >
                  Zurück zur Auftragsbörse
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Next / Prev buttons) */}
        {step !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-[#E7E2DA] bg-[#F7F5F0] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#5F6B63] hover:text-[#1B211D] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Zurück
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                disabled={!canGoToStep2}
                onClick={() => setStep(2)}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  canGoToStep2 
                    ? 'bg-[#0F4C2E] text-white hover:bg-[#0c3c24] shadow' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Weiter: Ort & Zeit <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                disabled={!canGoToStep3}
                onClick={() => setStep(3)}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  canGoToStep3 
                    ? 'bg-[#0F4C2E] text-white hover:bg-[#0c3c24] shadow' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Weiter: Fotos (optional) <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold bg-[#0F4C2E] text-white hover:bg-[#0c3c24] rounded-xl shadow transition-all"
              >
                Weiter: Kontaktdaten <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                disabled={!canSubmit || loading}
                onClick={handleSubmit}
                className={`inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  canSubmit && !loading
                    ? 'bg-[#F2761B] text-white hover:bg-[#d65f0c] shadow-md' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Veröffentliche...' : 'Auftrag jetzt veröffentlichen'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
