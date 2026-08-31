import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { ThemeConfig } from '../types';
import { ImagePlus, X, Check } from 'lucide-react';
import { useTranslation } from '../i18n';

interface SubmitNewsProps {
  theme: ThemeConfig;
  activeThemeKey: string;
}

export default function SubmitNews({ theme, activeThemeKey }: SubmitNewsProps) {
  const { lang } = useTranslation();
  const isNl = lang === 'nl';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    businessName: '',
    imageUrl: '',
    imageSource: '',
    isAiGenerated: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(isNl ? "De afbeelding is te groot (max 2MB)" : "Das Bild ist zu groß (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      let finalImageUrl = '';
      if (formData.imageUrl) {
        const imageRef = ref(storage, `news/${Date.now()}`);
        await uploadString(imageRef, formData.imageUrl, 'data_url');
        finalImageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'news'), {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        businessName: formData.businessName || '',
        imageUrl: finalImageUrl,
        imageSource: formData.imageSource.trim() || '',
        isAiGenerated: !!formData.isAiGenerated,
        status: 'pending',
        date: new Date().toISOString()
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(isNl 
        ? 'Er is een fout opgetreden. Probeer het later opnieuw.' 
        : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full border border-[#E7E2DA] rounded-md px-3.5 py-3 text-[15.5px] bg-[#FAF8F5] focus:outline-none focus:border-[#0F4C2E] transition-colors ${theme.textBase}`;
  const labelClass = `block text-[14px] font-semibold mb-[8px] ${theme.textBase}`;

  if (isSuccess) {
    return (
      <div className="max-w-[700px] mx-auto py-[40px] px-[20px] min-h-[50vh] flex flex-col items-center justify-center text-center">
        <div className="w-[64px] h-[64px] bg-[#E8F1EB] rounded-full flex items-center justify-center text-[#0F4C2E] mb-[24px]">
          <Check size={32} />
        </div>
        <h1 className="font-display text-[32px] font-bold mb-[12px]">
          {isNl ? 'Nieuwsbericht ingediend!' : 'News eingereicht!'}
        </h1>
        <p className={`text-[17px] ${theme.textMuted} mb-[32px] max-w-[500px]`}>
          {isNl 
            ? 'Hartelijk dank! Uw nieuwsbericht is succesvol verzonden en wordt nu door ons gecontroleerd. Zodra het is goedgekeurd, verschijnt het op de website.' 
            : 'Vielen Dank! Ihre News wurde erfolgreich übermittelt und befindet sich nun in der Prüfung. Sobald sie freigegeben wurde, erscheint sie auf der Seite.'}
        </p>
        <button 
          onClick={() => {
            setIsSuccess(false);
            setFormData({ title: '', content: '', author: '', businessName: '', imageUrl: '', imageSource: '', isAiGenerated: false });
          }}
          className={`px-5 py-2.5 rounded-md font-semibold ${theme.primaryBtn}`}
        >
          {isNl ? 'Nog een nieuwsbericht indienen' : 'Weitere News einreichen'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto py-[40px] px-[20px]">
      <h1 className="font-display text-[36px] md:text-[42px] font-bold tracking-tight mb-[16px]">
        {isNl ? 'Nieuwsbericht indienen' : 'News einreichen'}
      </h1>
      <p className={`text-[17px] ${theme.textMuted} mb-[40px] max-w-[600px]`}>
        {isNl 
          ? 'Deel nieuwtjes, aanbiedingen of aankondigingen met de gemeenschap. Elk bericht wordt voor publicatie kort door ons gecontroleerd.' 
          : 'Teilen Sie Neuigkeiten, Angebote oder Ankündigungen mit der Community. Jeder Beitrag wird vor der Veröffentlichung kurz von uns geprüft.'}
      </p>

      <div className={`bg-white border border-[#EDE8E0] rounded-lg p-6 md:p-10 shadow-[0_10px_30px_rgba(27,33,29,0.06)]`}>
        {error && (
          <div className="bg-[#FBEAE7] text-[#C0392B] p-4 rounded-md mb-6 text-[14.5px] font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-[24px]">
          <div>
            <label className={labelClass}>
              {isNl ? 'Kop / Titel *' : 'Überschrift *'}
            </label>
            <input 
              required 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className={inputClass} 
              placeholder={isNl ? 'bijv. Grote heropening in het weekend' : 'z.B. Große Neueröffnung am Wochenende'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            <div>
              <label className={labelClass}>
                {isNl ? 'Auteur *' : 'Autor *'}
              </label>
              <input 
                required 
                type="text" 
                value={formData.author} 
                onChange={e => setFormData({...formData, author: e.target.value})} 
                className={inputClass} 
                placeholder={isNl ? 'Uw naam' : 'Ihr Name'}
              />
            </div>
            <div>
              <label className={labelClass}>
                {isNl ? 'Betreft bedrijf (optioneel)' : 'Bezug zum Unternehmen (Optional)'}
              </label>
              <input 
                type="text" 
                value={formData.businessName} 
                onChange={e => setFormData({...formData, businessName: e.target.value})} 
                className={inputClass} 
                placeholder={isNl ? 'Om welk bedrijf gaat het?' : 'Welches Unternehmen betrifft das?'}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {isNl ? 'Tekst van het bericht *' : 'Text der Meldung *'}
            </label>
            <textarea 
              required 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              className={`${inputClass} min-h-[200px] resize-y`} 
              placeholder={isNl ? 'Beschrijf uitgebreid waar het over gaat...' : 'Beschreiben Sie ausführlich, worum es geht...'}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                {isNl ? 'Uitgelichte afbeelding (optioneel)' : 'Titelbild (Optional)'}
              </label>
              <div className="mt-[8px]">
                {formData.imageUrl ? (
                  <div className="relative inline-block">
                    <img src={formData.imageUrl} alt="Preview" className="w-full max-w-[400px] h-auto rounded-md border border-[#E7E2DA]" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, imageUrl: ''})}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-[#E7E2DA] rounded-full flex items-center justify-center text-[#C0392B] hover:bg-[#FBEAE7] shadow-sm transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-[400px] h-[160px] border-2 border-dashed border-[#D8D2C8] rounded-md cursor-pointer hover:border-[#0F4C2E] hover:bg-[#FAF8F5] transition-colors">
                    <ImagePlus className="w-8 h-8 text-[#8A928B] mb-2" />
                    <span className="text-[14px] text-[#5F6B63] font-medium">
                      {isNl ? 'Afbeelding selecteren (max. 2MB)' : 'Bild auswählen (max. 2MB)'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {formData.imageUrl && (
              <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-md p-4 space-y-3 max-w-[500px]">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1B211D] mb-1">
                    {isNl ? 'Bronvermelding / Fotocredits (optioneel)' : 'Bildquelle / Bildnachweis (Optional)'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.imageSource} 
                    onChange={e => setFormData({...formData, imageSource: e.target.value})} 
                    className="w-full border border-[#E7E2DA] rounded px-3 py-2 text-[14px] bg-white focus:outline-none focus:border-[#0F4C2E]" 
                    placeholder={isNl ? 'bijv. Foto: Jan Jansen / Winterberg Toerisme' : 'z. B. Foto: Max Mustermann / Brauhaus'}
                  />
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                  <input 
                    type="checkbox"
                    checked={formData.isAiGenerated}
                    onChange={e => setFormData({...formData, isAiGenerated: e.target.checked})}
                    className="w-4 h-4 rounded text-[#0F4C2E] focus:ring-[#0F4C2E] accent-[#0F4C2E]"
                  />
                  <span className="text-[13.5px] font-medium text-[#1B211D]">
                    {isNl ? 'Deze afbeelding is AI-gegenereerd (symboolafbeelding)' : 'Dieses Bild ist KI-generiert (Symbolbild)'}
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="pt-[16px] border-t border-[#F3F0EA]">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-md text-[16px] font-bold text-center transition-all ${isSubmitting ? 'bg-[#E7E2DA] text-[#8A928B] cursor-not-allowed' : theme.primaryBtn}`}
            >
              {isSubmitting 
                ? (isNl ? 'Wordt verzonden...' : 'Wird eingereicht...') 
                : (isNl ? 'Nieuwsbericht nu indienen' : 'News jetzt einreichen')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
