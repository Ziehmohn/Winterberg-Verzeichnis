import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, ThemeConfig } from '../types';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useTranslation } from '../i18n';
import { getLocalizedNewsArticle } from '../utils/translator';

interface NewsDetailProps {
  newsId: string;
  theme: ThemeConfig;
  activeThemeKey: string;
  onBack: () => void;
}

// Logo-Style Wavy Underline Component
export function UnderlinedHeading({ 
  text, 
  as = 'h2', 
  className = '' 
}: { 
  text: string; 
  as?: 'h1' | 'h2' | 'h3'; 
  className?: string 
}) {
  const Tag = as;
  const textSize = as === 'h1' 
    ? 'text-[28px] sm:text-[36px] md:text-[44px]' 
    : as === 'h2' 
    ? 'text-[22px] sm:text-[26px] md:text-[30px]' 
    : 'text-[19px] sm:text-[21px] md:text-[23px]';

  return (
    <div className={`relative inline-block ${className}`}>
      <Tag className={`font-display ${textSize} font-bold leading-[1.25] text-[#1B211D] relative z-10 inline-block pb-2`}>
        {text}
      </Tag>
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
          strokeWidth={as === 'h1' ? "7" : "5"} 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
}

// Inline Formatter for **bold**, *italic*, links [text](url) and URLs
function renderInlineFormatted(text: string): React.ReactNode[] {
  const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  const tokens = [];
  let cursor = 0;
  let matchCombined;

  while ((matchCombined = combinedRegex.exec(text)) !== null) {
    if (matchCombined.index > cursor) {
      tokens.push({ type: 'text', content: text.substring(cursor, matchCombined.index) });
    }

    if (matchCombined[1]) {
      // Markdown link: [text](url)
      tokens.push({ type: 'link', text: matchCombined[2], url: matchCombined[3] });
    } else if (matchCombined[4]) {
      // Bold: **text**
      tokens.push({ type: 'bold', content: matchCombined[5] });
    } else if (matchCombined[6]) {
      // Italic: *text*
      tokens.push({ type: 'italic', content: matchCombined[7] });
    } else if (matchCombined[8]) {
      // Raw URL
      tokens.push({ type: 'link', text: matchCombined[8], url: matchCombined[8] });
    } else if (matchCombined[9]) {
      // Email
      tokens.push({ type: 'email', email: matchCombined[9] });
    }

    cursor = matchCombined.index + matchCombined[0].length;
  }

  if (cursor < text.length) {
    tokens.push({ type: 'text', content: text.substring(cursor) });
  }

  return tokens.map((token, idx) => {
    if (token.type === 'bold') {
      return <strong key={idx} className="font-bold text-[#1B211D]">{token.content}</strong>;
    }
    if (token.type === 'italic') {
      return <em key={idx} className="italic text-[#5F6B63]">{token.content}</em>;
    }
    if (token.type === 'link') {
      return (
        <a 
          key={idx} 
          href={token.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#0F4C2E] font-semibold underline underline-offset-4 decoration-[#0F4C2E]/40 hover:decoration-[#0F4C2E] hover:text-[#186841] transition-all"
        >
          {token.text}
        </a>
      );
    }
    if (token.type === 'email') {
      return (
        <a 
          key={idx} 
          href={`mailto:${token.email}`} 
          className="text-[#0F4C2E] font-semibold underline underline-offset-4 decoration-[#0F4C2E]/40 hover:decoration-[#0F4C2E] transition-all"
        >
          {token.email}
        </a>
      );
    }
    return <React.Fragment key={idx}>{token.content}</React.Fragment>;
  });
}

// Markdown and News Rich Text Renderer
export function NewsContentRenderer({ content }: { content: string }) {
  if (!content) return null;

  // Split content by paragraphs/blocks
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Heading 2 (## Title)
        if (trimmed.startsWith('## ')) {
          const headingText = trimmed.replace(/^##\s+/, '');
          return (
            <div key={index} className="pt-6 pb-2">
              <UnderlinedHeading text={headingText} as="h2" />
            </div>
          );
        }

        // 2. Heading 3 (### Title)
        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace(/^###\s+/, '');
          return (
            <div key={index} className="pt-4 pb-1">
              <UnderlinedHeading text={headingText} as="h3" />
            </div>
          );
        }

        // 3. Blockquotes (> Quote)
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed
            .split('\n')
            .map(l => l.replace(/^>\s?/, ''))
            .filter(Boolean);
          
          return (
            <blockquote 
              key={index} 
              className="my-6 border-l-4 border-[#0F4C2E] bg-[#F4F8F5] pl-6 pr-5 py-4 rounded-r-lg italic text-[#2D3A31] text-[16px] md:text-[17.5px] leading-relaxed shadow-sm font-serif"
            >
              <div className="space-y-2">
                {quoteLines.map((line, qIdx) => (
                  <p key={qIdx}>{renderInlineFormatted(line)}</p>
                ))}
              </div>
            </blockquote>
          );
        }

        // 4. Bullet lists (- Item or * Item or 1. Item)
        const isList = trimmed.split('\n').every(line => /^(\s*[-*•]|\s*\d+\.)\s+/.test(line.trim()));
        if (isList) {
          const items = trimmed.split('\n').map(line => line.replace(/^(\s*[-*•]|\s*\d+\.)\s+/, '').trim());
          return (
            <ul key={index} className="my-5 space-y-3 pl-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-[16px] md:text-[17px] text-[#3F4B42] leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-[#0F4C2E] mt-2.5 shrink-0" />
                  <span className="flex-1">{renderInlineFormatted(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // 5. Standard Paragraphs
        return (
          <p key={index} className="text-[16.5px] md:text-[18px] text-[#2F3A33] leading-[1.8] font-normal">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Standalone Contact Box
function StandaloneContactBox({ rawContact, heading }: { rawContact: string; heading?: string }) {
  if (!rawContact) return null;

  return (
    <div className="mt-12 bg-white border border-[#EDE8E0] rounded-lg p-6 sm:p-8 shadow-[0_10px_35px_rgba(27,33,29,0.04)]">
      <div className="mb-6">
        <UnderlinedHeading text={heading || "Ansprechpartner & Beratung"} as="h3" />
      </div>
      <div className="space-y-4 text-[15.5px] md:text-[16.5px] text-[#3F4B42] leading-relaxed">
        {rawContact.split(/\n{2,}/).map((sec, cIdx) => {
          const secLines = sec.trim().split('\n');
          return (
            <div key={cIdx} className="space-y-2.5">
              {secLines.map((line, lIdx) => {
                const isBullet = /^(\s*[-*•]|\s*\d+\.)\s+/.test(line.trim());
                const cleaned = isBullet ? line.replace(/^(\s*[-*•]|\s*\d+\.)\s+/, '').trim() : line.trim();
                
                if (cleaned.startsWith('### ')) {
                  return null; // Heading already displayed above
                }

                return (
                  <div key={lIdx} className={isBullet ? "flex items-start gap-3 pl-1" : ""}>
                    {isBullet && (
                      <span className="w-2 h-2 rounded-full bg-[#0F4C2E] mt-2 shrink-0" />
                    )}
                    <span className="flex-1">{renderInlineFormatted(cleaned)}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function stripMarkdownAndHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/:::contact[\s\S]*?:::/gi, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/>\s+/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatIsoDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch (e) {}
  return new Date().toISOString();
}

export default function NewsDetail({ newsId, theme, activeThemeKey, onBack }: NewsDetailProps) {
  const { t, lang } = useTranslation();
  const [rawArticle, setRawArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // 1. First attempt: direct doc ID lookup
        const docRef = doc(db, 'news', newsId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRawArticle({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
          return;
        }

        // 2. Second attempt: search by slug field
        const slugQuery = query(collection(db, 'news'), where('slug', '==', newsId));
        const slugSnap = await getDocs(slugQuery);
        if (!slugSnap.empty) {
          const matchedDoc = slugSnap.docs[0];
          setRawArticle({ id: matchedDoc.id, ...matchedDoc.data() } as NewsArticle);
          return;
        }

        // 3. Fallback: match by title-generated slug
        const allSnap = await getDocs(collection(db, 'news'));
        const found = allSnap.docs.find(d => {
          const data = d.data();
          const titleSlug = (data.title || '')
            .toLowerCase()
            .replace(/ä/g, 'ae')
            .replace(/ö/g, 'oe')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          return titleSlug === newsId || data.slug === newsId || d.id === newsId;
        });

        if (found) {
          setRawArticle({ id: found.id, ...found.data() } as NewsArticle);
        }
      } catch (e) {
        console.error("Error fetching news article:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [newsId]);

  const article = rawArticle ? getLocalizedNewsArticle(rawArticle, lang) : null;
  const plainText = article ? stripMarkdownAndHtml(article.content || '') : '';
  const summary = plainText.length > 200 ? plainText.substring(0, 197).trim() + '...' : plainText;
  const newsUrl = article && rawArticle ? `https://www.winterberg-verzeichnis.de/news/${article.slug || rawArticle.id}` : 'https://www.winterberg-verzeichnis.de/news';
  const isoDate = article ? formatIsoDate(article.date) : new Date().toISOString();

  const schemaOrg = article && rawArticle ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": newsUrl
    },
    "headline": article.title,
    "description": summary,
    "image": article.imageUrl ? [article.imageUrl] : ["https://www.winterberg-verzeichnis.de/winterberg-header.webp"],
    "datePublished": isoDate,
    "dateModified": isoDate,
    "author": [{
      "@type": article.businessName ? "Organization" : "Person",
      "name": article.businessName || article.author || "Redaktion Winterberg Verzeichnis",
      "url": article.businessSlug ? `https://www.winterberg-verzeichnis.de/${article.businessSlug}` : "https://www.winterberg-verzeichnis.de"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Das Winterberg Verzeichnis",
      "url": "https://www.winterberg-verzeichnis.de",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.winterberg-verzeichnis.de/favicon.svg"
      }
    },
    "articleBody": plainText,
    "inLanguage": lang === 'nl' ? 'nl-NL' : 'de-DE',
    "isAccessibleForFree": true
  } : null;

  // Sync schema and head metadata to document.head
  useEffect(() => {
    if (!article || !schemaOrg) return;

    const siteTitle = lang === 'nl' ? 'De Winterberg Bedrijvengids' : 'Das Winterberg Verzeichnis';
    document.title = `${article.title} | ${siteTitle}`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const previousDesc = metaDesc.getAttribute('content') || '';
    if (summary) {
      metaDesc.setAttribute('content', summary);
    }

    const scriptId = 'schema-news-article-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaOrg);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
      if (previousDesc) {
        metaDesc?.setAttribute('content', previousDesc);
      }
    };
  }, [article?.title, article?.date, article?.content, lang]);

  if (loading) {
    return (
      <div className="flex justify-center py-[100px]">
        <div className="w-8 h-8 border-4 border-[#0F4C2E]/20 border-t-[#0F4C2E] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!rawArticle || !article) {
    return (
      <div className="max-w-[850px] mx-auto py-[60px] px-[20px] text-center">
        <h1 className="text-[24px] font-bold mb-[16px]">{lang === 'nl' ? 'Nieuwsbericht niet gevonden' : 'News nicht gefunden'}</h1>
        <button onClick={onBack} className={`${theme.primaryBtn} px-5 py-2.5 rounded-md`}>
          {t('newsBack')}
        </button>
      </div>
    );
  }

  // Extract contact block if present
  let mainContent = article.content || '';
  let contactContent: string | null = null;

  const contactBlockMatch = mainContent.match(/:::contact\s*([\s\S]*?)\s*:::/i);
  if (contactBlockMatch) {
    mainContent = mainContent.replace(/:::contact\s*([\s\S]*?)\s*:::/i, '').trim();
    contactContent = contactBlockMatch[1].trim();
  }

  return (
    <article className="max-w-[850px] mx-auto py-[40px] px-[20px]">
      {schemaOrg && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      )}
      
      <button 
        onClick={onBack}
        className="flex items-center gap-[8px] text-[14px] font-semibold text-[#5F6B63] hover:text-[#1B211D] mb-[32px] transition-colors group"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        {t('newsBack')}
      </button>

      {article.imageUrl && (
        <div className="relative w-full h-[320px] md:h-[440px] rounded-lg overflow-hidden mb-[36px] shadow-md border border-[#EAE5DC]">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full object-cover" 
          />
          {(article.isAiGenerated || article.imageSource) && (
            <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md text-white/95 text-[11.5px] font-medium px-2.5 py-1 rounded tracking-wide pointer-events-none flex items-center gap-1.5 shadow-sm">
              {article.isAiGenerated && (
                <span>{t('newsAiBadge')}</span>
              )}
              {article.isAiGenerated && article.imageSource && (
                <span className="opacity-60">|</span>
              )}
              {article.imageSource && (
                <span>{t('newsSource')}: {article.imageSource}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Clean Meta Info */}
      <div className="flex items-center gap-[18px] text-[13.5px] font-medium text-[#7C8780] mb-[24px] flex-wrap pb-4 border-b border-[#EDE8E0]">
        <div>
          {new Date(article.date).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div className="w-1 h-1 rounded-full bg-[#C8C2B7]" />
        <div>
          {t('newsBy')} <span className="text-[#1B211D] font-bold">{article.author}</span>
        </div>
        {article.businessName && (
          <>
            <div className="w-1 h-1 rounded-full bg-[#C8C2B7]" />
            <div className="text-[#0F4C2E] font-semibold">
              {article.businessName}
            </div>
          </>
        )}
      </div>

      {/* Main Title with Winterberg-Logo underline styling */}
      <div className="mb-8">
        <UnderlinedHeading text={article.title} as="h1" />
      </div>

      {/* Main Article News Container */}
      <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 sm:p-8 md:p-10 shadow-[0_10px_35px_rgba(27,33,29,0.04)]">
        <NewsContentRenderer content={mainContent} />
      </div>

      {/* Dedicated Standalone Contact Box OUTSIDE & BELOW the News Container */}
      {contactContent && (
        <StandaloneContactBox rawContact={contactContent} heading={t('newsContactHeading')} />
      )}

      {/* Dedicated Business Publisher / Backlink Box */}
      {(article.businessName || (article as any).externalLink) && (
        <div className="mt-8 bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F4C2E] mb-1">
              {lang === 'nl' ? 'Gepubliceerd door' : 'Veröffentlicht durch'}
            </div>
            <div className="font-display font-bold text-lg text-[#1B211D]">
              {article.businessName || article.author}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {article.businessName && (
              <a
                href={`/unternehmen/${article.businessSlug || (article.businessName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="px-4 py-2 bg-[#0F4C2E] hover:bg-[#186841] text-white text-xs font-bold rounded-md transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {lang === 'nl' ? 'Bedrijfsprofiel bekijken' : 'Zum Unternehmensprofil'}
              </a>
            )}
            {(article as any).externalLink && (
              <a
                href={(article as any).externalLink.startsWith('http') ? (article as any).externalLink : `https://${(article as any).externalLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#E7E2DA] text-[#0F4C2E] text-xs font-bold rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                {lang === 'nl' ? 'Website bezoeken' : 'Website besuchen'} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
