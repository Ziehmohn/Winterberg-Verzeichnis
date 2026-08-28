import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, ThemeConfig } from '../types';
import { Calendar, User, Building } from 'lucide-react';

interface NewsBoardProps {
  theme: ThemeConfig;
  activeThemeKey: string;
  onNewsClick: (newsId: string) => void;
}

export default function NewsBoard({ theme, activeThemeKey, onNewsClick }: NewsBoardProps) {
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

  return (
    <div className="max-w-[1000px] mx-auto py-[40px] px-[20px] min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[40px] gap-[20px]">
        <div>
          <h1 className="font-display text-[36px] md:text-[42px] font-bold tracking-tight mb-[8px]">
            News & Aktuelles
          </h1>
          <p className={`text-[16px] ${theme.textMuted}`}>
            Die neuesten Nachrichten, Angebote und Ankündigungen aus Winterberg.
          </p>
        </div>
        <button 
          onClick={() => {
            window.history.pushState(null, '', '/news/einreichen');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className={`px-[24px] py-[12px] rounded-full font-semibold whitespace-nowrap transition-all ${theme.primaryBtn}`}
        >
          News einreichen
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-[40px]">
          <div className="w-8 h-8 border-4 border-[#0F4C2E]/20 border-t-[#0F4C2E] rounded-full animate-spin"></div>
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {news.map(item => (
            <div 
              key={item.id}
              onClick={() => onNewsClick(item.id)}
              className={`bg-white border border-[#EDE8E0] rounded-[20px] overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#0F4C2E] flex flex-col`}
            >
              {item.imageUrl ? (
                <div className="h-[200px] overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              ) : (
                <div className="h-[200px] bg-[#FAF8F5] flex items-center justify-center">
                  <span className="text-[#8A928B] font-display font-bold text-[24px] opacity-30">NEWS</span>
                </div>
              )}
              <div className="p-[24px] flex-1 flex flex-col">
                <div className="flex items-center gap-[12px] text-[12.5px] text-[#8A928B] mb-[12px] flex-wrap">
                  <div className="flex items-center gap-[4px]">
                    <Calendar size={14} />
                    {new Date(item.date).toLocaleDateString('de-DE')}
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <User size={14} />
                    {item.author}
                  </div>
                </div>
                
                <h3 className="font-display text-[20px] font-bold text-[#1B211D] leading-tight mb-[12px] line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-[14.5px] text-[#5F6B63] line-clamp-3 mb-[20px] flex-1">
                  {item.content}
                </p>
                
                {item.businessName && (
                  <div className="inline-flex items-center gap-[6px] text-[12.5px] font-semibold text-[#0F4C2E] bg-[#E8F1EB] px-[10px] py-[4px] rounded-md self-start mt-auto">
                    <Building size={14} />
                    {item.businessName}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-[#D8D2C8] rounded-[20px] py-[60px] text-center">
          <p className="text-[17px] text-[#5F6B63] font-medium mb-[8px]">Aktuell gibt es keine neuen Einträge.</p>
          <p className="text-[14.5px] text-[#8A928B]">Seien Sie der Erste, der eine News einreicht!</p>
        </div>
      )}
    </div>
  );
}
