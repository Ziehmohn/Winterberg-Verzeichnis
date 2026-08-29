import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Business, Review } from '../types';
import { useTranslation } from '../i18n';

export default function ReviewForm({ business, onReviewSubmit }: { business: Business, onReviewSubmit: (businessId: string, review: Review) => void }) {
  const { t, lang } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert(t("alertStarRating"));
      return;
    }
    if (text.trim() === '') {
      alert(t("alertReviewText"));
      return;
    }
    
    const newReview: Review = {
      id: 'rev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      authorName: authorName.trim() || (lang === 'nl' ? 'Bezoeker' : 'Besucher'),
      businessId: business.id,
      text: text.trim(),
      rating,
      status: 'pending',
      date: new Date().toISOString()
    };
    
    onReviewSubmit(business.id, newReview);
    setSubmitted(true);
  };

  return (
    <div className="border border-[#EDE8E0] rounded-md p-4 bg-[#FAF8F5]">
      {submitted ? (
        <div className="bg-[#E8F1EB] rounded-md p-4 text-[#0F4C2E] text-[15px]">
          {lang === 'nl' 
            ? 'Bedankt voor uw beoordeling! Deze wordt na controle door de redactie gepubliceerd.' 
            : 'Danke für die Bewertung! Sie wird nach Prüfung durch die Redaktion freigeschaltet.'}
        </div>
      ) : (
        <>
          <div className="font-semibold text-[15px] mb-[10px]">
            {lang === 'nl' ? 'Eigen beoordeling schrijven' : 'Eigene Bewertung schreiben'}
          </div>
          <div className="flex gap-[6px] mb-[12px]">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star}
                type="button"
                className="border-none bg-transparent cursor-pointer text-[26px] leading-none p-0"
                style={{ color: star <= (hoverRating || rating) ? '#F2761B' : '#E7E2DA' }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <input 
            placeholder={lang === 'nl' ? 'Uw naam' : 'Dein Name'}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-[15px] mb-[10px] bg-white outline-none focus:border-[#0F4C2E] transition-colors"
          />
          <textarea 
            rows={3} 
            placeholder={lang === 'nl' ? 'Hoe waren uw ervaringen?' : 'Wie waren deine Erfahrungen?'}
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="w-full border border-[#E7E2DA] rounded-md px-3 py-2 text-[15px] bg-white resize-y outline-none focus:border-[#0F4C2E] transition-colors"
          ></textarea>
          <button 
            type="button"
            onClick={handleSubmit} 
            className="mt-[10px] bg-[#0F4C2E] text-white border-none rounded-md px-5 py-2.5 text-[15px] font-semibold cursor-pointer hover:bg-[#06301C] transition-colors"
          >
            {lang === 'nl' ? 'Beoordeling verzenden' : 'Bewertung absenden'}
          </button>
        </>
      )}
    </div>
  );
}
