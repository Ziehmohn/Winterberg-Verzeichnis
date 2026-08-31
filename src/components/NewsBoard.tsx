import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, ThemeConfig } from '../types';
import { useTranslation } from '../i18n';
import { getLocalizedNewsArticle } from '../utils/translator';

interface NewsBoardProps {
  theme: ThemeConfig;
  activeThemeKey: string;
  onNewsClick: (newsId: string) => void;
}

function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/:::contact[\s\S]*?:::/gi, '')
    .replace(/##+\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[-*•]\s+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export function generateSlug(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewsBoard({ theme, activeThemeKey, onNewsClick }: NewsBoardProps) {
  const { t, lang } = useTranslation();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, 'news'), where('status', '==', 'approved'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle));
        // Sort by date descending
        fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNews(fetched);
      } catch (e) {
        console.error("Error fetching news", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const submitPath = lang === 'nl' ? '/nl/nieuws/indienen' : '/news/einreichen';

  return (
    <div className="max-w-[1100px] mx-auto py-[40px] px-[20px] min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[40px] gap-[20px]">
        <div>
          <div className="relative inline-block mb-2">
            <h1 className="font-display text-[34px] md:text-[44px] font-bold tracking-tight text-[#1B211D] relative z-10 inline-block pb-2">
              {t('newsTitle')}
            </h1>
            <svg 
              className="absolute -bottom-1 left-0 w-full h-3 md:h-4 overflow-visible pointer-events-none z-0" 
              viewBox="0 0 300 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path 
                d="M 5 15 Q 100 0 200 12 T 295 8" 
                stroke="#ffc084" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
          <p className={`text-[16px] md:text-[17px] ${theme.textMuted}`}>
            {t('newsSubtitle')}
          </p>
        </div>
        <button 
          onClick={() => {
            window.history.pushState(null, '', submitPath);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className={`px-5 py-2.5 rounded-md font-semibold whitespace-nowrap transition-all ${theme.primaryBtn}`}
        >
          {t('newsSubmit')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="w-8 h-8 border-4 border-[#0F4C2E]/20 border-t-[#0F4C2E] rounded-full animate-spin"></div>
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px]">
          {news.map(rawItem => {
            const item = getLocalizedNewsArticle(rawItem, lang);
            return (
              <div 
                key={rawItem.id}
                onClick={() => onNewsClick(rawItem.slug || generateSlug(rawItem.title) || rawItem.id)}
                className={`bg-white border border-[#EDE8E0] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0F4C2E]/50 flex flex-col group`}
              >
                {item.imageUrl ? (
                  <div className="h-[210px] overflow-hidden bg-[#FAF8F5] relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      onError={(e) => {
                        // Fallback image if remote url fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    {item.isAiGenerated && (
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white/95 text-[10px] font-medium px-2 py-0.5 rounded pointer-events-none tracking-wide">
                        {t('newsAiCardBadge')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[210px] bg-[#FAF8F5] flex items-center justify-center">
                    <span className="text-[#8A928B] font-display font-bold text-[24px] opacity-30">NEWS</span>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-[10px] text-[12.5px] text-[#7C8780] mb-[12px] flex-wrap">
                    <span className="font-medium">
                      {new Date(item.date).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#C8C2B7]" />
                    <span>
                      {t('newsBy')} <strong className="font-semibold text-[#1B211D]">{item.author}</strong>
                    </span>
                  </div>
                  
                  <h3 className="font-display text-[20px] font-bold text-[#1B211D] leading-snug mb-[12px] line-clamp-2 group-hover:text-[#0F4C2E] transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-[14.5px] text-[#5F6B63] line-clamp-3 mb-[20px] leading-relaxed flex-1">
                    {stripMarkdown(item.content)}
                  </p>
                  
                  {item.businessName && (
                    <div className="inline-block text-[12px] font-bold text-[#0F4C2E] bg-[#E8F1EB] px-2.5 py-1 rounded self-start mt-auto">
                      {item.businessName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-[#D8D2C8] rounded-lg py-[60px] text-center">
          <p className="text-[17px] text-[#5F6B63] font-medium mb-[8px]">{t('newsNoArticles')}</p>
          <p className="text-[14.5px] text-[#8A928B]">
            {lang === 'nl' ? 'Wees de eerste die een nieuwsbericht indient!' : 'Seien Sie der Erste, der eine News einreicht!'}
          </p>
        </div>
      )}
    </div>
  );
}
