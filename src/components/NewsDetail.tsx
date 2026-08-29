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
    ? 'text-[30px] sm:text-[38px] md:text-[46px]' 
    : as === 'h2' 
    ? 'text-[24px] sm:text-[28px] md:text-[32px]' 
    : 'text-[20px] sm:text-[22px] md:text-[24px]';

  return (
    <div className={`relative inline-block ${className}`}>
      <Tag className={`font-display ${textSize} font-bold leading-[1.2] text-[#1B211D] relative z-10 inline-block pb-2`}>
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
  // Regex pattern to tokenize bold, links, mailto, urls
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const boldRegex = /\*\*([^*]+)\*\*/g;
  
  // Split by links first
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  // Simple parser combining tokens
  const tokens = [];
  const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  let matchCombined;
  let cursor = 0;

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

// Rich News Content Renderer
function NewsContentRenderer({ content }: { content: string }) {
  if (!content) return null;

  // Check for contact section block (either :::contact ... ::: or detected Contact heading)
  let mainBody = content;
  let contactBody: string | null = null;

  const contactBlockMatch = content.match(/:::contact\s*([\s\S]*?)\s*:::/i);
  if (contactBlockMatch) {
    mainBody = content.replace(/:::contact\s*([\s\S]*?)\s*:::/i, '').trim();
    contactBody = contactBlockMatch[1].trim();
  }

  // Split into structural blocks by double newlines or headers
  const rawSections = mainBody.split(/\n{2,}/);

  return (
    <div className="space-y-6">
      {rawSections.map((section, sIdx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Level 2 Heading: ## Heading
        if (trimmed.startsWith('## ')) {
          const headingText = trimmed.replace(/^##\s+/, '').trim();
          return (
            <div key={sIdx} className="pt-6 pb-2">
              <UnderlinedHeading text={headingText} as="h2" />
            </div>
          );
        }

        // Level 3 Heading: ### Heading
        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace(/^###\s+/, '').trim();
          return (
            <div key={sIdx} className="pt-4 pb-1">
              <UnderlinedHeading text={headingText} as="h3" />
            </div>
          );
        }

        // Bullet List Block (starts with * or - or •)
        const lines = trimmed.split('\n');
        const isList = lines.every(l => /^(\s*[-*•]|\s*\d+\.)\s+/.test(l.trim()) || l.trim().length === 0);

        if (isList) {
          const listItems = lines.filter(l => l.trim().length > 0);
          return (
            <div key={sIdx} className="my-6 grid grid-cols-1 gap-3.5">
              {listItems.map((itemStr, lIdx) => {
                const cleaned = itemStr.replace(/^(\s*[-*•]|\s*\d+\.)\s+/, '').trim();
                return (
                  <div 
                    key={lIdx} 
                    className="bg-[#FAF8F5] border border-[#EBE6DE] rounded-[14px] p-4 md:p-5 transition-all duration-200 hover:border-[#D0C7B7] hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                  >
                    <div className="text-[16px] text-[#37413A] leading-[1.65]">
                      {renderInlineFormatted(cleaned)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Mixed list block (e.g. intro text followed by bullet lines or multiple paragraphs with bullets)
        if (lines.some(l => /^(\s*[-*•]|\s*\d+\.)\s+/.test(l.trim()))) {
          const blocks: { type: 'p' | 'list'; content: string[] }[] = [];
          let currentType: 'p' | 'list' = 'p';
          let currentLines: string[] = [];

          for (const line of lines) {
            const isBullet = /^(\s*[-*•]|\s*\d+\.)\s+/.test(line.trim());
            if (isBullet) {
              if (currentType === 'p' && currentLines.length > 0) {
                blocks.push({ type: 'p', content: [...currentLines] });
                currentLines = [];
              }
              currentType = 'list';
              currentLines.push(line);
            } else {
              if (currentType === 'list' && currentLines.length > 0) {
                blocks.push({ type: 'list', content: [...currentLines] });
                currentLines = [];
              }
              currentType = 'p';
              currentLines.push(line);
            }
          }
          if (currentLines.length > 0) {
            blocks.push({ type: currentType, content: [...currentLines] });
          }

          return (
            <div key={sIdx} className="space-y-4">
              {blocks.map((b, bIdx) => {
                if (b.type === 'list') {
                  return (
                    <div key={bIdx} className="my-5 grid grid-cols-1 gap-3.5">
                      {b.content.map((itemStr, lIdx) => {
                        const cleaned = itemStr.replace(/^(\s*[-*•]|\s*\d+\.)\s+/, '').trim();
                        return (
                          <div 
                            key={lIdx} 
                            className="bg-[#FAF8F5] border border-[#EBE6DE] rounded-[14px] p-4 md:p-5 transition-all duration-200 hover:border-[#D0C7B7] hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                          >
                            <div className="text-[16px] text-[#37413A] leading-[1.65]">
                              {renderInlineFormatted(cleaned)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return (
                  <p key={bIdx} className="text-[16.5px] md:text-[17.5px] leading-[1.75] text-[#4A544D]">
                    {renderInlineFormatted(b.content.join(' '))}
                  </p>
                );
              })}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={sIdx} className="text-[16.5px] md:text-[17.5px] leading-[1.75] text-[#4A544D]">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}

      {/* Dedicated Professional Contact Box */}
      {contactBody && (
        <div className="mt-12 bg-gradient-to-br from-[#F5F8F6] via-[#FAF8F5] to-[#F1F6F3] border-2 border-[#D2E2D6] rounded-[22px] p-6 md:p-8 shadow-sm">
          <div className="mb-4">
            <UnderlinedHeading text="Ansprechpartner & Beratung" as="h3" />
          </div>
          <div className="space-y-4 text-[15.5px] md:text-[16.5px] text-[#3F4B42] leading-relaxed">
            {contactBody.split(/\n{2,}/).map((sec, cIdx) => {
              const lines = sec.trim().split('\n');
              return (
                <div key={cIdx} className="space-y-2">
                  {lines.map((line, lIdx) => {
                    const isBullet = /^(\s*[-*•]|\s*\d+\.)\s+/.test(line.trim());
                    const cleaned = isBullet ? line.replace(/^(\s*[-*•]|\s*\d+\.)\s+/, '').trim() : line.trim();
                    
                    if (cleaned.startsWith('### ')) {
                      return null; // Heading handled above
                    }

                    return (
                      <div key={lIdx} className={isBullet ? "flex items-start gap-2.5 pl-2" : ""}>
                        {isBullet && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C2E] mt-2.5 shrink-0" />
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
      )}
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
        <button onClick={onBack} className={`${theme.primaryBtn} px-[24px] py-[10px] rounded-full`}>
          Zurück zur Übersicht
        </button>
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
        <div className="w-full h-[320px] md:h-[440px] rounded-[24px] overflow-hidden mb-[36px] shadow-md border border-[#EAE5DC]">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Clean Meta Info without unnecessary decorative emojis */}
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

      {/* Article Content Container */}
      <div className="bg-white border border-[#EDE8E0] rounded-[26px] p-[28px] sm:p-[38px] md:p-[50px] shadow-[0_10px_35px_rgba(27,33,29,0.04)]">
        <NewsContentRenderer content={article.content} />
      </div>
    </article>
  );
}
