import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Trash2, MapPin, ChevronRight } from 'lucide-react';
import { Business } from '../types';
import { useFavorites } from '../utils/favorites';
import { useTranslation } from '../i18n';
import { getLocalizedBusiness } from '../utils/translator';
import { isBusinessDeactivated } from '../utils/routes';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allBusinesses: Business[];
  onSelectBusiness: (business: Business) => void;
  onBrowseDirectory: () => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  allBusinesses,
  onSelectBusiness,
  onBrowseDirectory
}: FavoritesDrawerProps) {
  const { lang } = useTranslation();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const favoriteBusinesses = allBusinesses.filter(
    b => favoriteIds.includes(b.id) && !isBusinessDeactivated(b)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'nl' ? 'Mijn favorieten' : 'Meine Favoriten'}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E7E2DA] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
                  <Heart className="w-5 h-5 fill-red-500" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-[#1B211D] leading-tight m-0">
                    {lang === 'nl' ? 'Mijn favorieten' : 'Meine Favoriten'}
                  </h2>
                  <p className="text-xs text-[#5F6B63] m-0">
                    {favoriteBusinesses.length === 1
                      ? (lang === 'nl' ? '1 bedrijf opgeslagen' : '1 Unternehmen gemerkt')
                      : (lang === 'nl' ? `${favoriteBusinesses.length} bedrijven opgeslagen` : `${favoriteBusinesses.length} Unternehmen gemerkt`)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-[#E7E2DA] flex items-center justify-center text-[#5F6B63] hover:text-[#1B211D] hover:bg-gray-100 transition-colors cursor-pointer"
                title={lang === 'nl' ? 'Sluiten' : 'Schließen'}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {favoriteBusinesses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
                  <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-400 mb-4 shadow-inner">
                    <Heart className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-bold text-[#1B211D] mb-1.5">
                    {lang === 'nl' ? 'Nog geen favorieten' : 'Noch keine Favoriten gemerkt'}
                  </h3>
                  <p className="text-xs text-[#5F6B63] max-w-xs leading-relaxed mb-6">
                    {lang === 'nl'
                      ? 'Klik op het hartje op de kaartjes van bedrijven om ze op te slaan voor uw volgende bezoek aan Winterberg.'
                      : 'Klicke bei beliebigen Unternehmen auf das Herz-Symbol, um sie hier für deinen nächsten Besuch in Winterberg zu merken.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBrowseDirectory();
                    }}
                    className="bg-[#0F4C2E] hover:bg-[#06301C] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>{lang === 'nl' ? 'Bedrijven ontdekken' : 'Unternehmen entdecken'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                favoriteBusinesses.map((b) => {
                  const img = b.headerImage || b.uploadedImage || b.imageLink || (Array.isArray(b.gallery) && b.gallery[0]) || null;
                  const approvedReviews = Array.isArray(b.reviews) ? b.reviews.filter(r => !r.status || r.status === 'approved') : [];
                  const avgRating = approvedReviews.length > 0
                    ? (approvedReviews.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / approvedReviews.length).toFixed(1)
                    : null;

                  return (
                    <div
                      key={b.id}
                      onClick={() => {
                        onClose();
                        onSelectBusiness(b);
                      }}
                      className="group bg-[#FAF8F5] hover:bg-white border border-[#E7E2DA] hover:border-[#0F4C2E]/40 rounded-xl p-3 flex items-center gap-3.5 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-md"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg bg-[#EDE8E0] overflow-hidden shrink-0 border border-[#E7E2DA] flex items-center justify-center">
                        {img ? (
                          <img
                            src={typeof img === 'string' ? img : (img as any)?.url}
                            alt={b.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-xl font-bold text-[#0F4C2E]">
                            {b.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-[14.5px] font-bold text-[#1B211D] truncate group-hover:text-[#0F4C2E] transition-colors m-0">
                            {b.name}
                          </h4>
                          {b.isPremium && (
                            <span className="bg-[#FFF1E4] text-[#D65F0C] text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5F6B63] truncate mt-0.5 mb-1">
                          {b.subcategory || b.category}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#717E75]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#0F4C2E]" />
                            {b.district || 'Winterberg'}
                          </span>
                          {avgRating && (
                            <span className="flex items-center gap-0.5 text-[#1B211D] font-bold">
                              <span className="text-[#F2761B]">★</span> {avgRating}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(b.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                        title={lang === 'nl' ? 'Verwijderen' : 'Entfernen'}
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {favoriteBusinesses.length > 0 && (
              <div className="p-4 border-t border-[#E7E2DA] bg-[#FAF8F5] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBrowseDirectory();
                  }}
                  className="w-full bg-[#0F4C2E] hover:bg-[#06301C] text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer text-center"
                >
                  {lang === 'nl' ? 'Alle bedrijven bekijken' : 'Alle Unternehmen ansehen'}
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
