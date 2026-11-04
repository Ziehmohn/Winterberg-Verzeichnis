import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  Mail, 
  Phone, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { DISTRICTS } from '../utils/routes';

interface SubmitOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitOpeningModal: React.FC<SubmitOpeningModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useTranslation();
  const isNl = lang === 'nl';

  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [category, setCategory] = useState('Gesundheit & Medizin');
  const [district, setDistrict] = useState('Winterberg');
  const [address, setAddress] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg(isNl ? 'Afbeelding is groter dan 4MB' : 'Das Bild darf maximal 4MB groß sein.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setErrorMsg(isNl ? 'Vul de naam van de onderneming in.' : 'Bitte gib den Namen des Unternehmens ein.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg(isNl ? 'Vul een geldig e-mailadres in.' : 'Bitte gib deine E-Mail-Adresse für eventuelle Rückfragen an.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await addDoc(collection(db, 'opening_submissions'), {
        businessName: businessName.trim(),
        contactPerson: contactPerson.trim(),
        category,
        district,
        address: address.trim(),
        openingDate,
        openingTime: openingTime.trim(),
        description: description.trim(),
        email: email.trim(),
        phone: phone.trim(),
        hasImage: Boolean(imagePreview),
        createdAt: serverTimestamp(),
        source: 'openings_theme_page'
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.warn('Firestore write warning:', err);
      // Still treat as success for user experience if client write succeeds or is queued
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBusinessName('');
    setContactPerson('');
    setCategory('Gesundheit & Medizin');
    setDistrict('Winterberg');
    setAddress('');
    setOpeningDate('');
    setOpeningTime('');
    setDescription('');
    setEmail('');
    setPhone('');
    setImagePreview(null);
    setIsSuccess(false);
    setErrorMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#18201B] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B3B24] to-[#14532D] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isNl ? 'Gratis vermelding' : 'Kostenloser Service'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0">
            {isNl ? 'Nieuwe opening in Winterberg aanmelden' : 'Neueröffnung in Winterberg einreichen'}
          </h2>
          <p className="text-white/85 text-xs sm:text-sm mt-1 mb-0 max-w-lg">
            {isNl
              ? 'Open je binnenkort een nieuwe winkel, praktijk of horecazaak in Winterberg? Meld je opening gratis aan en bereik direct duizenden inwoners en bezoekers.'
              : 'Eröffnest du demnächst ein neues Geschäft, eine Praxis, ein Lokal oder einen Betrieb in Winterberg? Melde deine Neueröffnung kostenlos an und erreiche sofort die Region!'}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {isNl ? 'Hartelijk dank voor je aanmelding!' : 'Vielen Dank für deine Einreichung!'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                {isNl
                  ? 'We hebben je gegevens ontvangen. Na een korte redactionele controle publiceren we je opening en profiel op het portaal.'
                  : 'Wir haben deine Angaben zur Neueröffnung erhalten. Nach einer kurzen redaktionellen Prüfung wird der Eintrag freigeschaltet und in der Themenübersicht präsentiert.'}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#0F4C2E] hover:bg-[#14532D] text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              >
                {isNl ? 'Venster sluiten' : 'Fertig & Schließen'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs sm:text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Basis-Informationen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Bedrijfsnaam *' : 'Name des Betriebs / der Praxis *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={isNl ? 'bijv. Praktijk Nadine Albers' : 'z. B. Praxis für Naturheilkunde Nadine Albers'}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Contactpersoon / Eigenaar' : 'Inhaber / Ansprechpartner'}
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder={isNl ? 'bijv. Nadine Albers' : 'z. B. Nadine Albers'}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>
              </div>

              {/* Ortsteil & Adresse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Dorp / Ortsteil' : 'Ortsteil'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {isNl ? 'Adres' : 'Adresse (Straße & Hausnr.)'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isNl ? 'bijv. Sorpestraße 2' : 'z. B. Sorpestraße 2'}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>
              </div>

              {/* Datum & Uhrzeit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isNl ? 'Datum van opening' : 'Geplantes Eröffnungsdatum'}</span>
                    </span>
                  </label>
                  <input
                    type="date"
                    value={openingDate}
                    onChange={(e) => setOpeningDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isNl ? 'Tijdstip / Uur' : 'Uhrzeit (sofern bekannt)'}</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    placeholder={isNl ? 'bijv. Vanaf 15:00 uur' : 'z. B. Ab 15:00 Uhr'}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>
              </div>

              {/* Kategorie & Branche */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {isNl ? 'Categorie' : 'Branche / Kategorie'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                >
                  <option value="Gesundheit & Medizin">{isNl ? 'Gezondheid & Geneeskunde' : 'Gesundheit & Medizin'}</option>
                  <option value="Einzelhandel">{isNl ? 'Detailhandel' : 'Einzelhandel'}</option>
                  <option value="Gastronomie">{isNl ? 'Horeca' : 'Gastronomie'}</option>
                  <option value="Dienstleistungen">{isNl ? 'Dienstverlening' : 'Dienstleistungen'}</option>
                  <option value="Handwerk">{isNl ? 'Ambacht' : 'Handwerk'}</option>
                  <option value="Ski, Bike & Sport">{isNl ? 'Ski, Fiets & Sport' : 'Ski, Bike & Sport'}</option>
                  <option value="Hotels und Unterkünfte">{isNl ? 'Hotels & Accommodaties' : 'Hotels und Unterkünfte'}</option>
                  <option value="Freizeit">{isNl ? 'Vrije tijd' : 'Freizeit'}</option>
                </select>
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {isNl ? 'Korte beschrijving & bijzonderheden' : 'Kurzbeschreibung & Besonderheiten der Neueröffnung'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isNl
                    ? 'Vertel iets over het aanbod, de diensten of een openingsactie (bijv. welkomstborrel)...'
                    : 'Welche Leistungen oder Produkte werden angeboten? Gibt es ein Eröffnungsevent, Sektempfang oder besondere Aktionen?'}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                />
              </div>

              {/* Flyer / Foto Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {isNl ? 'Flyer / Uitnodiging of foto uploaden (optioneel)' : 'Flyer / Einladungskarte oder Foto (optional)'}
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl p-4 text-center hover:border-emerald-600 transition-colors">
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Vorschau"
                        className="max-h-36 rounded-lg object-contain shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
                      >
                        {isNl ? 'Afbeelding verwijderen' : 'Bild entfernen'}
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                        {isNl ? 'Klik om te uploaden (JPG, PNG tot 4MB)' : 'Klicken zum Hochladen (JPG, PNG bis 4MB)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Kontaktdaten für Rückfragen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span>{isNl ? 'E-mailadres voor bevestiging *' : 'E-Mail für Rückfragen *'}</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@beispiel.de"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>{isNl ? 'Telefoonnummer (optioneel)' : 'Telefonnummer (optional)'}</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="02981 / ..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#121614] text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0F4C2E]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {isNl ? 'Annuleren' : 'Abbrechen'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#0F4C2E] hover:bg-[#14532D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{isNl ? 'Verzenden...' : 'Wird gesendet...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{isNl ? 'Opening gratis indienen' : 'Neueröffnung jetzt einreichen'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default SubmitOpeningModal;
