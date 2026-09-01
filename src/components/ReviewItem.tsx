import React, { useState, useEffect, useMemo } from 'react';
import { Globe, Languages, RotateCcw } from 'lucide-react';
import { Review } from '../types';
import { detectReviewLanguage, translateReviewToDutch, translateReviewToGerman } from '../utils/reviewTranslations';

interface ReviewItemProps {
  review: Review;
  lang: 'de' | 'nl';
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, lang }) => {
  const author = review.authorName || (review as any).author || (review as any).name || (lang === 'nl' ? 'Bezoeker' : 'Besucher');
  const reviewText = review.text || (review as any).comment || '';
  const replyText = review.ownerReply || '';

  // Detect original language of review & reply
  const origLang = useMemo(() => detectReviewLanguage(reviewText), [reviewText]);
  const isDifferentLang = origLang !== lang;

  const origReplyLang = useMemo(() => detectReviewLanguage(replyText), [replyText]);
  const isDifferentReplyLang = replyText ? origReplyLang !== lang : false;

  // Pre-calculate translations
  const dutchReviewTranslation = useMemo(() => translateReviewToDutch(reviewText), [reviewText]);
  const germanReviewTranslation = useMemo(() => translateReviewToGerman(reviewText), [reviewText]);

  const dutchReplyTranslation = useMemo(() => translateReviewToDutch(replyText), [replyText]);
  const germanReplyTranslation = useMemo(() => translateReviewToGerman(replyText), [replyText]);

  // Toggle state: 'auto' means show translated if different, 'toggled' inverts that state
  const [isToggled, setIsToggled] = useState(false);
  const [isReplyToggled, setIsReplyToggled] = useState(false);

  // Reset toggle when language or review text changes
  useEffect(() => {
    setIsToggled(false);
    setIsReplyToggled(false);
  }, [lang, review.id, reviewText, replyText]);

  // Determine current active text
  let displayedText = reviewText;
  let isShowingTranslation = false;

  if (isDifferentLang) {
    // If review is in foreign language, show translated by default unless toggled
    if (!isToggled) {
      displayedText = lang === 'nl' ? dutchReviewTranslation : germanReviewTranslation;
      isShowingTranslation = true;
    } else {
      displayedText = reviewText;
      isShowingTranslation = false;
    }
  } else {
    // If review is already in current language, show original by default unless user toggled translation
    if (!isToggled) {
      displayedText = reviewText;
      isShowingTranslation = false;
    } else {
      displayedText = lang === 'nl' ? germanReviewTranslation : dutchReviewTranslation;
      isShowingTranslation = true;
    }
  }

  // Determine current active owner reply
  let displayedReply = replyText;
  let isShowingReplyTranslation = false;

  if (replyText) {
    if (isDifferentReplyLang) {
      if (!isReplyToggled) {
        displayedReply = lang === 'nl' ? dutchReplyTranslation : germanReplyTranslation;
        isShowingReplyTranslation = true;
      } else {
        displayedReply = replyText;
        isShowingReplyTranslation = false;
      }
    } else {
      if (!isReplyToggled) {
        displayedReply = replyText;
        isShowingReplyTranslation = false;
      } else {
        displayedReply = lang === 'nl' ? germanReplyTranslation : dutchReplyTranslation;
        isShowingReplyTranslation = true;
      }
    }
  }

  return (
    <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-md p-4 transition-all">
      {/* Header: Author & Rating */}
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

      {/* Review Text Body */}
      <p className="mt-2 text-[14.5px] text-[#4A544D] leading-[1.6] whitespace-pre-line">
        {displayedText}
      </p>

      {/* Interactive Translation Bar */}
      {reviewText && (
        <div className="mt-2.5 flex items-center gap-3 flex-wrap text-xs text-[#5F6B63] pt-1 border-t border-[#EDE8E0]/60">
          {isDifferentLang ? (
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11.5px] text-[#0F4C2E] font-medium bg-[#E8F1EB] px-2 py-0.5 rounded">
                <Globe className="w-3 h-3 text-[#0F4C2E]" />
                {isShowingTranslation
                  ? (lang === 'nl' ? 'Vertaald uit het Duits' : 'Aus dem Niederländischen übersetzt')
                  : (lang === 'nl' ? 'Origineel in het Duits' : 'Original auf Niederländisch')}
              </span>
              <button
                type="button"
                onClick={() => setIsToggled(!isToggled)}
                className="inline-flex items-center gap-1 text-[#0F4C2E] hover:text-[#F2761B] font-semibold underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>
                  {isShowingTranslation
                    ? (lang === 'nl' ? 'Origineel bekijken (Duits)' : 'Original ansehen (Niederländisch)')
                    : (lang === 'nl' ? 'Vertaling weergeven (Nederlands)' : 'Übersetzung anzeigen (Deutsch)')}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {isShowingTranslation && (
                <span className="inline-flex items-center gap-1 text-[11.5px] text-[#0F4C2E] font-medium bg-[#E8F1EB] px-2 py-0.5 rounded">
                  <Globe className="w-3 h-3 text-[#0F4C2E]" />
                  {lang === 'nl' ? 'Vertaald naar het Duits' : 'Auf Niederländisch übersetzt'}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsToggled(!isToggled)}
                className="inline-flex items-center gap-1 text-[#5F6B63] hover:text-[#0F4C2E] text-[11.5px] font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                <Languages className="w-3 h-3 text-[#0F4C2E]" />
                <span>
                  {!isShowingTranslation
                    ? (lang === 'nl' ? 'In het Duits vertalen' : 'Auf Niederländisch übersetzen')
                    : (lang === 'nl' ? 'Origineel (Nederlands) tonen' : 'Original (Deutsch) anzeigen')}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Owner Reply */}
      {replyText && (
        <div className="mt-3.5 ml-2 sm:ml-4 pl-3.5 border-l-2 border-[#0F4C2E] bg-white rounded p-3 text-xs text-[#5F6B63] shadow-2xs">
          <div className="font-bold text-[#0F4C2E] mb-1 flex items-center justify-between gap-2 flex-wrap">
            <span>{lang === 'nl' ? 'Reactie van de eigenaar:' : 'Antwort des Inhabers:'}</span>
            {isShowingReplyTranslation && (
              <span className="text-[10.5px] font-normal text-[#8A928B] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EDE8E0]">
                {lang === 'nl' ? 'Vertaald' : 'Übersetzt'}
              </span>
            )}
          </div>
          <p className="m-0 leading-relaxed text-[13.5px] text-[#4A544D] whitespace-pre-line">
            {displayedReply}
          </p>
          
          <div className="mt-2 pt-1">
            <button
              type="button"
              onClick={() => setIsReplyToggled(!isReplyToggled)}
              className="inline-flex items-center gap-1 text-[#0F4C2E] hover:text-[#F2761B] text-[11px] font-semibold underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>
                {isShowingReplyTranslation
                  ? (lang === 'nl' ? 'Origineel bekijken' : 'Original ansehen')
                  : (lang === 'nl' ? 'Vertaling weergeven' : 'Übersetzung anzeigen')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
