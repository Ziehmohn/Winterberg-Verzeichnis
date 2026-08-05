import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Business, Review } from '../types';
import { useTranslation } from '../i18n';

export default function ReviewForm({ business, onReviewSubmit }: { business: Business, onReviewSubmit: (businessId: string, review: Review) => void }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
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
      id: Math.random().toString(36).substring(2, 9),
      text,
      rating,
      status: 'pending',
      date: new Date().toISOString()
    };
    
    onReviewSubmit(business.id, newReview);
    setSubmitted(true);
  };

  return (
    <div className="border border-[#EDE8E0] rounded-[18px] p-[20px] bg-[#FAF8F5]">
      {submitted ? (
        <div className="bg-[#E8F1EB] rounded-[16px] p-[18px] text-[#0F4C2E] text-[15px]">
          Danke für die Bewertung! Sie wird nach Prüfung durch die Redaktion veröffentlicht.
        </div>
      ) : (
        <>
          <div className="font-semibold text-[15px] mb-[10px]">Eigene Bewertung schreiben</div>
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
            placeholder="Dein Name"
            className="w-full border border-[#E7E2DA] rounded-[12px] px-[13px] py-[11px] text-[15px] mb-[10px] bg-white outline-none focus:border-[#0F4C2E] transition-colors"
          />
          <textarea 
            rows={3} 
            placeholder="Wie waren deine Erfahrungen?"
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="w-full border border-[#E7E2DA] rounded-[12px] px-[13px] py-[11px] text-[15px] bg-white resize-y outline-none focus:border-[#0F4C2E] transition-colors"
          ></textarea>
          <button 
            type="button"
            onClick={handleSubmit} 
            className="mt-[10px] bg-[#0F4C2E] text-white border-none rounded-full px-[24px] py-[12px] text-[15px] font-semibold cursor-pointer hover:bg-[#06301C] transition-colors"
          >
            Bewertung absenden
          </button>
        </>
      )}
    </div>
  );
}
