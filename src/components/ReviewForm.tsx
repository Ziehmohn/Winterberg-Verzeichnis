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

  const approvedReviews = business.reviews?.filter(r => r.status === 'approved') || [];
  const avgRating = approvedReviews.length > 0 
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
    : 0;

  return (
    <div className="mt-6 pt-4 border-t border-black/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{t("customerReviews")}</span>
        {approvedReviews.length > 0 ? (
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold">{avgRating.toFixed(1)}</span>
             <div className="flex text-yellow-500">
               {[1, 2, 3, 4, 5].map(star => (
                 <Star key={star} className={`w-3 h-3 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-black/20 fill-current'}`} />
               ))}
             </div>
             <span className="text-xs text-black/50">({approvedReviews.length})</span>
          </div>
        ) : (
          <div className="flex text-black/20">
            <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
          </div>
        )}
      </div>

      <div className="mb-4">
        {approvedReviews.map(r => (
          <div key={r.id} className="mb-2 p-2 bg-black/5 rounded-md text-xs">
            <div className="flex items-center gap-1 mb-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`w-3 h-3 ${star <= r.rating ? 'fill-current' : 'text-black/20 fill-current'}`} />
              ))}
            </div>
            <p className="text-black/80">{r.text}</p>
            {r.ownerReply && (
              <div className="mt-2 p-2 bg-white/50 border-l-2 border-black/20 rounded-sm">
                <span className="font-bold">{t("ownerReply")}:</span>
                <p className="mt-1">{r.ownerReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative group/review">
        {submitted ? (
           <div className="flex flex-col items-center justify-center p-4 bg-green-50 text-green-700 rounded-md text-center">
             <CheckCircle className="w-6 h-6 mb-2" />
             <p className="text-xs font-medium">{t("thanksForReview")}</p>
             <p className="text-[10px] mt-1 opacity-80">{t("reviewPendingApproval")}</p>
           </div>
        ) : (
          <div>
            <div className="flex items-center gap-1 mb-2">
               {[1, 2, 3, 4, 5].map(star => (
                 <Star 
                   key={star} 
                   className={`w-4 h-4 cursor-pointer transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-500 fill-current' : 'text-black/20 fill-current'}`} 
                   onMouseEnter={() => setHoverRating(star)}
                   onMouseLeave={() => setHoverRating(0)}
                   onClick={() => setRating(star)}
                 />
               ))}
            </div>
            <textarea 
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={t("writeReviewPlaceholder")} 
              className="w-full h-16 p-2 text-xs bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 resize-none text-black"
            ></textarea>
            <button 
              onClick={handleSubmit}
              className={`mt-2 w-full py-2 text-xs font-medium text-white bg-black hover:bg-black/80 rounded-md transition-colors`}
            >
              Bewertung absenden
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
