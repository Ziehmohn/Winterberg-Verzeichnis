import { useTranslation } from '../i18n';
import React, { useState, useEffect } from 'react';
import { Business, ThemeConfig, Job } from '../types';
import { MapPin, Briefcase, Clock, ArrowRight, ChevronRight, Search, Building } from 'lucide-react';
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

  // Extract all jobs from businesses
  const allJobs: { job: Job, business: Business }[] = [];
  businesses.forEach(business => {
    if (business.jobs && business.jobs.length > 0) {
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
    <div className={`w-full bg-white ${theme.cardBorder} ${theme.cardShadow} ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-xl'} overflow-hidden`}>
      <div className="p-6 md:p-8 border-b border-black/5 bg-gradient-to-br from-black/5 to-transparent">
        <h1 className="text-3xl font-display font-bold mb-4 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-black/60" />
          {t("jobsTitle")}
        </h1>
        <p className="text-black/70 max-w-3xl text-lg mb-6">
          {t("jobsDesc")}
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
            <input 
              type="text"
              placeholder={t("jobsSearchPlaceholder")}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white border border-black/10 focus:border-black/30 focus:ring-0 outline-none transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {jobCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-full'} ${
                  filterCategory.toLowerCase() === cat.toLowerCase()
                    ? theme.categoryTagActive
                    : theme.categoryTagInactive
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-black/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("noJobsFound")}</h3>
            <p className="text-black/60">{t("noJobsMatch")}</p>
            <button 
              onClick={() => { setFilterCategory('Alle'); setSearchQuery(''); }}
              className="mt-4 text-sm font-medium hover:underline"
            >
              Alle Stellen anzeigen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(({ job, business }) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group border border-black/10 hover:border-black/20 p-5 flex flex-col transition-all hover:-translate-y-1 bg-white cursor-pointer ${activeThemeKey === 'modern' ? 'rounded-none' : 'rounded-lg'}`}
                onClick={() => onBusinessSelect(business)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 bg-black/5 rounded-full text-black/70">
                    {t(job.type)}
                  </span>
                  <span className="text-xs text-black/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(job.createdAt).toLocaleDateString('de-DE')}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-black/80 transition-colors line-clamp-2">
                  {job.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-black/60 mb-4">
                  <Building className="w-4 h-4 shrink-0" />
                  <span className="truncate">{business.name}</span>
                </div>
                
                <p className="text-sm text-black/60 line-clamp-3 mb-6 flex-1">
                  {job.description}
                </p>
                
                <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-black/5">
                  <div className="flex items-center gap-1 text-black/50">
                    <MapPin className="w-4 h-4" />
                    <span>{business.district || business.city || 'Winterberg'}</span>
                  </div>
                  <span className="font-medium flex items-center gap-1 group-hover:underline"> {t("viewJob")} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
