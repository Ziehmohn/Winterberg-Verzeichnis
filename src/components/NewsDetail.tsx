import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, ThemeConfig } from '../types';
import { Calendar, User, Building, ArrowLeft } from 'lucide-react';

interface NewsDetailProps {
  newsId: string;
  theme: ThemeConfig;
  activeThemeKey: string;
  onBack: () => void;
}

export default function NewsDetail({ newsId, theme, activeThemeKey, onBack }: NewsDetailProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'news', newsId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [newsId]);

  if (loading) {
    return (
      <div className="flex justify-center py-[100px]">
        <div className="w-8 h-8 border-4 border-[#0F4C2E]/20 border-t-[#0F4C2E] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-[800px] mx-auto py-[60px] px-[20px] text-center">
        <h1 className="text-[24px] font-bold mb-[16px]">News nicht gefunden</h1>
        <button onClick={onBack} className={`${theme.primaryBtn} px-[24px] py-[10px] rounded-full`}>Zurück zur Übersicht</button>
      </div>
    );
  }

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": article.imageUrl ? [article.imageUrl] : [],
    "datePublished": article.date,
    "dateModified": article.date,
    "author": [{
        "@type": "Person",
        "name": article.author
    }]
  };

  return (
    <article className="max-w-[800px] mx-auto py-[40px] px-[20px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      
      <button 
        onClick={onBack}
        className="flex items-center gap-[8px] text-[14px] font-medium text-[#5F6B63] hover:text-[#1B211D] mb-[32px] transition-colors"
      >
        <ArrowLeft size={16} />
        Zurück zur Übersicht
      </button>

      {article.imageUrl && (
        <div className="w-full h-[300px] md:h-[400px] rounded-[24px] overflow-hidden mb-[32px] shadow-sm">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-[16px] text-[13.5px] text-[#8A928B] mb-[20px] flex-wrap">
        <div className="flex items-center gap-[6px]">
          <Calendar size={16} />
          {new Date(article.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-[6px]">
          <User size={16} />
          {article.author}
        </div>
        {article.businessName && (
          <div className="flex items-center gap-[6px] text-[#0F4C2E] font-medium">
            <Building size={16} />
            {article.businessName}
          </div>
        )}
      </div>

      <h1 className="font-display text-[32px] md:text-[46px] font-bold leading-[1.1] text-[#1B211D] mb-[32px]">
        {article.title}
      </h1>

      <div className="bg-white border border-[#EDE8E0] rounded-[24px] p-[32px] md:p-[48px] shadow-[0_10px_40px_rgba(27,33,29,0.04)]">
        <div className="text-[17px] leading-[1.8] text-[#4A544D] whitespace-pre-wrap">
          {article.content}
        </div>
      </div>
    </article>
  );
}
