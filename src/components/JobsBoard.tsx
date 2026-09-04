import { useTranslation } from '../i18n';
import React, { useState, useEffect } from 'react';
import { Business, ThemeConfig, Job } from '../types';
import { MapPin, Briefcase, Clock, ArrowRight, ChevronRight, Search, Building, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface JobsBoardProps {
  businesses: Business[];
  theme: ThemeConfig;
  activeThemeKey: string;
  initialCategory?: string | null;
  onBusinessSelect: (business: Business) => void;
  onBack: () => void;
}

export default function JobsBoard({ businesses, theme, activeThemeKey, initialCategory, onBusinessSelect, onBack }: JobsBoardProps) {
  const { t } = useTranslation();

  const [filterCategory, setFilterCategory] = useState<string>(initialCategory || 'Alle');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all jobs from Premium businesses only
  const allJobs: { job: Job, business: Business }[] = [];
  businesses.forEach(business => {
    if (business.isPremium && business.jobs && business.jobs.length > 0) {
      business.jobs.forEach(job => {
        allJobs.push({ job, business });
      });
    }
  });


  // Unique job categories
  const jobCategories = ['Alle', ...Array.from(new Set(allJobs.map(j => j.job.type)))];

  const filteredJobs = allJobs.filter(item => {
    const matchesCategory = filterCategory === 'Alle' || item.job.type.toLowerCase() === filterCategory.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      item.job.title.toLowerCase().includes(searchLower) ||
      item.business.name.toLowerCase().includes(searchLower) ||
      item.job.description.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-[54px] pb-[80px]">
      <div className="mb-4">
        <button 
          onClick={onBack} 
          className="bg-transparent border-none text-[#5F6B63] text-[13.5px] cursor-pointer hover:underline mb-2"
        >
          Zurück
        </button>
      </div>
      <h1 className="font-display text-[clamp(32px,5vw,50px)] font-bold mb-[14px]">Offene Stellen in Winterberg</h1>
      <p className="text-[17px] leading-[1.65] text-[#4A544D] max-w-[58ch] mb-[26px]">
        Alle Vakanzen der eingetragenen Betriebe an einem Ort. Unternehmen pflegen ihre Stellenangebote direkt im eigenen Profil.
      </p>

      <div className="flex gap-2 flex-wrap mb-[26px]">
        {jobCategories.map(cat => {
          const isActive = filterCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`border rounded-md py-2 px-3.5 text-[14px] font-medium cursor-pointer transition-colors ${
                isActive 
                  ? 'border-[#0F4C2E] bg-[#0F4C2E] text-white' 
                  : 'border-[#D8D2C8] bg-transparent text-[#4A544D] hover:border-[#5F6B63]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-dashed border-[#D8D2C8] rounded-lg p-10 text-center text-[#5F6B63]">
            Aktuell sind keine offenen Stellen hinterlegt.
          </div>
        ) : (
          filteredJobs.map(({ job, business }) => (
            <div 
              key={job.id} 
              onClick={() => onBusinessSelect(business)} 
              className="bg-white border border-[#EDE8E0] rounded-xl p-5 cursor-pointer shadow-[0_2px_10px_rgba(27,33,29,0.04)] transition-all hover:-translate-y-[2px] hover:shadow-[0_16px_34px_rgba(27,33,29,0.10)] group"
            >
              <div className="flex justify-between gap-[14px] items-baseline flex-wrap">
                <div className="font-display text-[19px] font-semibold text-[#1B211D] group-hover:text-[#0F4C2E] transition-colors">{job.title}</div>
                <div className="flex items-center gap-2">
                  {job.source && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {job.source}
                    </span>
                  )}
                  <span className="bg-[#FFF1E4] text-[#D65F0C] rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold">
                    {job.type}
                  </span>
                </div>
              </div>
              <div className="text-[14px] text-[#5F6B63] mt-[5px]">
                {business.name} · {job.location || business.district || business.city || 'Winterberg'}
              </div>
              {job.description && (
                <p className="mt-2 text-[13.5px] text-[#717E75] line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              )}
              {job.externalUrl && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                  <a
                    href={job.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F4C2E] hover:bg-[#15603A] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <span>Jetzt bewerben</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
