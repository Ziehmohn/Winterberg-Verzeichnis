import React, { useState } from 'react';
import { Globe, Languages, RotateCcw } from 'lucide-react';
import { Review } from '../types';
import { getReviewTranslationData } from '../utils/reviewTranslations';

interface ReviewItemProps {
  review: Review;
  lang: 'de' | 'nl';
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, lang }) => {
  const author = review.authorName || (review as any).author || (review as any).name || (lang === 'nl' ? 'Bezoeker' : 'Besucher');
  const reviewText = review.text || (review as any).comment || '';
  
  const textData = getReviewTranslationData(reviewText, lang);
  const [showOriginal, setShowOriginal] = useState(!textData.needsTranslation);

  // Owner reply translation data
  const replyData = review.ownerReply ? getReviewTranslationData(review.ownerReply, lang) : null;
  const [showOriginalReply, setShowOriginalReply] = useState(replyData ? !replyData.needsTranslation : true);

  const displayedText = showOriginal ? textData.originalText : textData.translatedText;
  const displayedReply = replyData ? (showOriginalReply ? replyData.originalText : replyData.translatedText) : null;

  return (
    <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-md p-4 transition-all">
      <div className="flex justify-between gap-2.5 items-center mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0F4C2E]/10 text-[#0F4C2E] flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-2xs">
            {author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-[15px] text-[#1B211D]">{author}</div>
            {review.date && (
              <div className="text-[11.5px] text-[#8A928B]">
                {new Date(review.date).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'de-DE', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>
        <div className="text-[#F2761B] text-[15px] tracking-[2px] shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <p className="mt-2 text-[14.5px] text-[#4A544D] leading-[1.6] whitespace-pre-line">
        {displayedText}
      </p>

      {/* Translation indicator & toggle button */}
      <div className="mt-2.5 flex items-center gap-3 flex-wrap text-xs text-[#5F6B63] pt-1">
        {textData.needsTranslation ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11.5px] text-[#0F4C2E] font-medium bg-[#E8F1EB]/80 px-2 py-0.5 rounded">
              <Globe className="w-3 h-3 text-[#0F4C2E]" />
              {!showOriginal ? textData.badgeLabel : (lang === 'nl' ? 'Originele tekst' : 'Originaltext')}
            </span>
            <button
              type="button"
              onClick={() => setShowOriginal(!showOriginal)}
              className="inline-flex items-center gap-1 text-[#0F4C2E] hover:text-[#F2761B] font-semibold underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{!showOriginal ? textData.viewOriginalLabel : textData.viewTranslationLabel}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className="inline-flex items-center gap-1 text-[#8A928B] hover:text-[#0F4C2E] text-[11.5px] font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <Languages className="w-3 h-3" />
            <span>
              {showOriginal
                ? (lang === 'nl' ? 'Vertaal naar het Duits' : 'Auf Niederländisch übersetzen')
                : (lang === 'nl' ? 'Origineel (Nederlands) tonen' : 'Original (Deutsch) anzeigen')}
            </span>
          </button>
        )}
      </div>

      {/* Owner Reply */}
      {review.ownerReply && replyData && (
        <div className="mt-3.5 ml-2 sm:ml-4 pl-3.5 border-l-2 border-[#0F4C2E] bg-white rounded p-3 text-xs text-[#5F6B63] shadow-2xs">
          <div className="font-bold text-[#0F4C2E] mb-1 flex items-center justify-between gap-2">
            <span>{lang === 'nl' ? 'Reactie van de eigenaar:' : 'Antwort des Inhabers:'}</span>
            {replyData.needsTranslation && !showOriginalReply && (
              <span className="text-[10.5px] font-normal text-[#8A928B]">{replyData.badgeLabel}</span>
            )}
          </div>
          <p className="m-0 leading-relaxed text-[13.5px] text-[#4A544D] whitespace-pre-line">
            {displayedReply}
          </p>
          
          {replyData.needsTranslation && (
            <div className="mt-2 pt-1">
              <button
                type="button"
                onClick={() => setShowOriginalReply(!showOriginalReply)}
                className="inline-flex items-center gap-1 text-[#0F4C2E] hover:text-[#F2761B] text-[11.5px] font-semibold underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>{!showOriginalReply ? replyData.viewOriginalLabel : replyData.viewTranslationLabel}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
