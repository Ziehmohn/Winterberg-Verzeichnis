import React, { useState, useEffect, useRef } from 'react';
import { Share2, Copy, Check, X, Mail, MessageCircle } from 'lucide-react';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  lang?: 'de' | 'nl';
  variant?: 'header-desktop' | 'header-mobile' | 'badge-light' | 'badge-dark' | 'button-subtle' | 'drawer-button';
  className?: string;
}

export default function ShareButton({
  title,
  text,
  url,
  lang = 'de',
  variant = 'header-desktop',
  className = ''
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const getShareUrl = () => {
    if (url) {
      return url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return typeof window !== 'undefined' ? window.location.href : 'https://www.winterberg-verzeichnis.de';
  };

  const getShareTitle = () => {
    if (title) return title;
    return typeof document !== 'undefined' ? document.title : (lang === 'nl' ? 'Het Winterberg Overzicht' : 'Das Winterberg Verzeichnis');
  };

  const getShareText = () => {
    if (text) return text;
    return lang === 'nl'
      ? 'Bekijk dit op Het Winterberg Overzicht:'
      : 'Schau dir das im Winterberg Verzeichnis an:';
  };

  // Close on click outside or escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = getShareUrl();
    const shareTitle = getShareTitle();
    const shareText = getShareText();

    // Prefer native share API on mobile touch devices
    const isMobile = typeof window !== 'undefined' && (
      window.matchMedia('(max-width: 768px)').matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );

    if (isMobile && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err: any) {
        // User cancelled or share failed, fallback to dropdown if not just user cancel
        if (err?.name === 'AbortError') return;
      }
    }

    setIsOpen(prev => !prev);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback prompt
      window.prompt(lang === 'nl' ? 'Kopieer deze link:' : 'Link kopieren:', shareUrl);
    }
  };

  const shareUrl = getShareUrl();
  const shareTitle = getShareTitle();
  const shareText = getShareText();

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareTitle} - ${shareText}`);
  const encodedTitle = encodeURIComponent(shareTitle);

  const socialChannels = [
    {
      name: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#25D366]">
          <path d="M17.507 14.307l-.009.075c-.338.455-1.127.872-1.748.872-.255 0-.498-.073-.771-.168-1.792-.625-3.328-1.773-4.48-3.355-.386-.528-.686-1.116-.764-1.638-.051-.341.04-.666.248-.916.27-.323.633-.611.832-.821.16-.168.272-.224.376-.224.08 0 .175.016.264.041.287.08.672.966.76 1.173.088.207.032.392-.072.544l-.328.472c-.08.12-.136.248-.064.408.384.848 1.056 1.584 1.888 2.064.168.096.296.064.408-.032l.488-.504c.144-.152.336-.184.52-.112.216.088 1.376.656 1.488.752.128.112.168.224.168.328-.008.232-.208.736-.208.936zM12 2C6.486 2 2 6.486 2 12c0 1.846.505 3.578 1.382 5.066L2.146 21.43c-.157.545.334 1.036.879.879l4.364-1.236A9.94 9.94 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      color: 'hover:bg-emerald-50 text-[#128C7E]'
    },
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#1877F2]">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-50 text-[#1877F2]'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0A66C2]">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-sky-50 text-[#0A66C2]'
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-[#000000]">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: 'hover:bg-gray-100 text-black'
    },
    {
      name: 'E-Mail',
      icon: <Mail className="w-4 h-4 text-[#D65F0C]" />,
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      color: 'hover:bg-orange-50 text-[#D65F0C]'
    }
  ];

  const isDrawer = variant === 'drawer-button';

  return (
    <div className={`relative ${isDrawer ? 'w-full block' : 'inline-block'} ${className}`} ref={popoverRef}>
      {/* Trigger Button Variant 1: Header Desktop */}
      {variant === 'header-desktop' && (
        <button
          type="button"
          onClick={handleShareClick}
          className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FAF8F5] border border-[#E7E2DA] text-[#0F4C2E] hover:text-[#F2761B] transition-colors cursor-pointer select-none"
          title={lang === 'nl' ? 'Pagina delen' : 'Seite teilen'}
          aria-label={lang === 'nl' ? 'Pagina delen' : 'Seite teilen'}
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Trigger Button Variant 2: Header Mobile */}
      {variant === 'header-mobile' && (
        <button
          type="button"
          onClick={handleShareClick}
          className="relative w-7 h-7 rounded-full flex items-center justify-center bg-[#FAF8F5] border border-[#EDE8E0] active:bg-[#E8F1EB] text-[#717E75] active:text-[#0F4C2E] transition-colors cursor-pointer select-none"
          title={lang === 'nl' ? 'Delen' : 'Teilen'}
          aria-label="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Trigger Button Variant 3: Detail Badge Dark (for green/dark hero headers) */}
      {variant === 'badge-dark' && (
        <button
          type="button"
          onClick={handleShareClick}
          className="rounded-md px-3 py-1.5 text-[13.5px] cursor-pointer inline-flex items-center gap-1.5 transition-all bg-white/10 border border-white/20 text-white hover:bg-white/20 select-none shadow-2xs"
          title={lang === 'nl' ? 'Profiel delen' : 'Eintrag teilen'}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{lang === 'nl' ? 'Delen' : 'Teilen'}</span>
        </button>
      )}

      {/* Trigger Button Variant 4: Detail Badge Light (for news, cards, white backgrounds) */}
      {variant === 'badge-light' && (
        <button
          type="button"
          onClick={handleShareClick}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#5F6B63] hover:text-[#0F4C2E] px-2.5 py-1 rounded-md bg-[#FAF8F5] hover:bg-[#E8F1EB] border border-[#EDE8E0] hover:border-[#0F4C2E]/40 transition-colors cursor-pointer select-none shadow-2xs"
          title={lang === 'nl' ? 'Artikel delen' : 'Artikel teilen'}
        >
          <Share2 className="w-3.5 h-3.5 text-[#0F4C2E]" />
          <span>{lang === 'nl' ? 'Delen' : 'Teilen'}</span>
        </button>
      )}

      {/* Trigger Button Variant 5: Subtle inline button */}
      {variant === 'button-subtle' && (
        <button
          type="button"
          onClick={handleShareClick}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#5F6B63] hover:text-[#0F4C2E] transition-colors cursor-pointer select-none py-1 px-2 rounded hover:bg-[#FAF8F5]"
        >
          <Share2 className="w-3 h-3" />
          <span>{lang === 'nl' ? 'Delen' : 'Teilen'}</span>
        </button>
      )}

      {/* Trigger Button Variant 6: Drawer button in mobile menu */}
      {variant === 'drawer-button' && (
        <button
          type="button"
          onClick={handleShareClick}
          className="w-full py-3 px-4 font-bold text-sm text-center flex items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-[#E8F1EB] text-[#0F4C2E] border border-[#EDE8E0] hover:border-[#0F4C2E] rounded-md transition-colors cursor-pointer select-none"
        >
          <Share2 className="w-4 h-4 text-[#F2761B]" />
          <span>{lang === 'nl' ? 'Pagina / App delen' : 'Seite / Verzeichnis teilen'}</span>
        </button>
      )}

      {/* Floating Share Popover Modal */}
      {isOpen && (
        <div 
          className={`absolute ${isDrawer ? 'bottom-full mb-2 left-0 right-0' : 'right-0 top-full mt-2 w-[290px] sm:w-[310px]'} bg-white rounded-xl shadow-xl border border-[#EDE8E0] p-3.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150`}
          style={{ boxShadow: '0 12px 35px -4px rgba(15, 76, 46, 0.18), 0 4px 12px rgba(0,0,0,0.06)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#EDE8E0]">
            <div className="flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#F2761B]" />
              <span className="text-xs font-bold text-[#1B211D]">
                {lang === 'nl' ? 'Pagina delen' : 'Seite teilen'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[#717E75] hover:text-[#1B211D] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Link Input Bar */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full text-[11.5px] text-[#5F6B63] bg-transparent px-2 outline-none font-mono truncate select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11.5px] font-bold transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0F4C2E] hover:bg-[#186841] text-white shadow-2xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>{lang === 'nl' ? 'Gekopieerd!' : 'Kopiert!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{lang === 'nl' ? 'Kopiëren' : 'Kopieren'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Channels List */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A928B] px-1 block mb-1">
              {lang === 'nl' ? 'Of direct via:' : 'Oder direkt teilen:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {socialChannels.map(channel => (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#EDE8E0] text-[12px] font-semibold text-[#1B211D] ${channel.color} transition-all hover:border-black/20`}
                >
                  {channel.icon}
                  <span className="truncate">{channel.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
