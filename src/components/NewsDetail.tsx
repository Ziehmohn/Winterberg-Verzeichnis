import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, ThemeConfig } from '../types';
import { ArrowLeft } from 'lucide-react';

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
          className="text-[#0F4C2E] hover:text-[#D97706] font-semibold underline decoration-[#ffc084] underline-offset-4 transition-colors"
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
          className="text-[#0F4C2E] hover:text-[#D97706] font-semibold underline decoration-[#ffc084] underline-offset-4 transition-colors"
        >
          {token.email}
        </a>
      );
    }
    return <React.Fragment key={idx}>{token.content}</React.Fragment>;
  });
}

interface ParsedCardItem {
  title?: string;
  description?: string;
  fullText: string;
}

// Parses raw string into structured title + description
function parseCardItem(rawText: string): ParsedCardItem {
  const cleaned = rawText.replace(/^(\s*[-*•]|\s*\d+\.)\s+/, '').trim();
  
  // Check if starts with **Title** or **Title:**
  const boldMatch = cleaned.match(/^\*\*([^*]+)\*\*[:\s]*([\s\S]*)$/);
  if (boldMatch) {
    return {
      title: boldMatch[1].trim(),
      description: boldMatch[2].trim(),
      fullText: cleaned
    };
  }

  // Check if first line can be title
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return {
      title: lines[0].replace(/^\*\*|\*\*$/g, ''),
      description: lines.slice(1).join(' '),
      fullText: cleaned
    };
  }

  return {
    fullText: cleaned
  };
}

// Rich News Content Renderer
function NewsContentRenderer({ content }: { content: string }) {
  if (!content) return null;

  // Split into raw sections by double newlines
  const rawParagraphs = content.split(/\n{2,}/);

  return (
    <div className="space-y-6">
      {rawParagraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Level 2 Heading: ## Heading
        if (trimmed.startsWith('## ')) {
          const headingText = trimmed.replace(/^##\s+/, '').trim();
          return (
            <div key={pIdx} className="pt-6 pb-2">
              <UnderlinedHeading text={headingText} as="h2" />
            </div>
          );
        }

        // Level 3 Heading: ### Heading
        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace(/^###\s+/, '').trim();
          return (
            <div key={pIdx} className="pt-4 pb-1">
              <UnderlinedHeading text={headingText} as="h3" />
            </div>
          );
        }

        // Check if this paragraph contains bullet list items
        const rawLines = trimmed.split('\n');
        const hasBullets = rawLines.some(l => /^(\s*[-*•]|\s*\d+\.)\s+/.test(l.trim()));

        if (hasBullets) {
          // Group lines into items: a new item begins when line starts with bullet
          const items: string[] = [];
          const introLines: string[] = [];
          let currentItemLines: string[] = [];

          for (const line of rawLines) {
            const isBullet = /^(\s*[-*•]|\s*\d+\.)\s+/.test(line.trim());
            if (isBullet) {
              if (currentItemLines.length > 0) {
                items.push(currentItemLines.join('\n'));
                currentItemLines = [];
              }
              currentItemLines.push(line);
            } else if (currentItemLines.length > 0) {
              // Continuation line of the current bullet item!
              currentItemLines.push(line);
            } else {
              // Pre-bullet intro line in the same paragraph
              introLines.push(line);
            }
          }
          if (currentItemLines.length > 0) {
            items.push(currentItemLines.join('\n'));
          }

          const parsedCards = items.map(parseCardItem);

          return (
            <div key={pIdx} className="space-y-4">
              {introLines.length > 0 && (
                <p className="text-[16.5px] md:text-[17.5px] leading-[1.75] text-[#4A544D]">
                  {renderInlineFormatted(introLines.join(' '))}
                </p>
              )}
              <div className="my-5 grid grid-cols-1 gap-4">
                {parsedCards.map((card, cIdx) => (
                  <div 
                    key={cIdx} 
                    className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-md p-5 md:p-6 transition-all duration-200 hover:border-[#0F4C2E]/50 hover:bg-white hover:shadow-md space-y-2.5"
                  >
                    {card.title ? (
                      <>
                        <h4 className="font-display text-[18px] md:text-[20px] font-bold text-[#1B211D] leading-snug">
                          {renderInlineFormatted(card.title)}
                        </h4>
                        {card.description && (
                          <p className="text-[15px] md:text-[16px] text-[#4A544D] leading-relaxed">
                            {renderInlineFormatted(card.description)}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-[15.5px] md:text-[16px] text-[#37413A] leading-relaxed">
                        {renderInlineFormatted(card.fullText)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={pIdx} className="text-[16.5px] md:text-[17.5px] leading-[1.75] text-[#4A544D]">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Standalone Contact Box Renderer
function StandaloneContactBox({ rawContact }: { rawContact: string }) {
  const lines = rawContact.split('\n').map(l => l.trim()).filter(Boolean);
  
  return (
    <div className="mt-8 bg-gradient-to-br from-[#F6F9F6] via-[#FAF8F5] to-[#F1F6F3] border-2 border-[#D2E2D6] rounded-lg p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(27,33,29,0.03)]">
      <div className="mb-5">
        <UnderlinedHeading text="Ansprechpartner & Beratung" as="h3" />
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

export default function NewsDetail({ newsId, theme, activeThemeKey, onBack }: NewsDetailProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // 1. First attempt: direct doc ID lookup
        const docRef = doc(db, 'news', newsId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
          return;
        }

        // 2. Second attempt: search by slug field
        const slugQuery = query(collection(db, 'news'), where('slug', '==', newsId));
        const slugSnap = await getDocs(slugQuery);
        if (!slugSnap.empty) {
          const matchedDoc = slugSnap.docs[0];
          setArticle({ id: matchedDoc.id, ...matchedDoc.data() } as NewsArticle);
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
          setArticle({ id: found.id, ...found.data() } as NewsArticle);
        }
      } catch (e) {
        console.error("Error fetching news article:", e);
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
      <div className="max-w-[850px] mx-auto py-[60px] px-[20px] text-center">
        <h1 className="text-[24px] font-bold mb-[16px]">News nicht gefunden</h1>
        <button onClick={onBack} className={`${theme.primaryBtn} px-5 py-2.5 rounded-md`}>
          Zurück zur Übersicht
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
    <article className="max-w-[850px] mx-auto py-[40px] px-[20px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      
      <button 
        onClick={onBack}
        className="flex items-center gap-[8px] text-[14px] font-semibold text-[#5F6B63] hover:text-[#1B211D] mb-[32px] transition-colors group"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        Zurück zur Übersicht
      </button>

      {article.imageUrl && (
        <div className="relative w-full h-[320px] md:h-[440px] rounded-lg overflow-hidden mb-[36px] shadow-md border border-[#EAE5DC]">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          {(article.isAiGenerated || article.imageSource) && (
            <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md text-white/95 text-[11.5px] font-medium px-2.5 py-1 rounded tracking-wide pointer-events-none flex items-center gap-1.5 shadow-sm">
              {article.isAiGenerated && (
                <span>Symbolbild · KI-generiert</span>
              )}
              {article.isAiGenerated && article.imageSource && (
                <span className="opacity-60">|</span>
              )}
              {article.imageSource && (
                <span>Quelle: {article.imageSource}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Clean Meta Info */}
      <div className="flex items-center gap-[18px] text-[13.5px] font-medium text-[#7C8780] mb-[24px] flex-wrap pb-4 border-b border-[#EDE8E0]">
        <div>
          {new Date(article.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div className="w-1 h-1 rounded-full bg-[#C8C2B7]" />
        <div>
          Von <span className="text-[#1B211D] font-bold">{article.author}</span>
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
        <StandaloneContactBox rawContact={contactContent} />
      )}
    </article>
  );
}
