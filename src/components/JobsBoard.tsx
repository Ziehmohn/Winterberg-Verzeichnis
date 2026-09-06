import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { Business, ThemeConfig } from '../types';
import { 
  JobListing, 
  JobTypeCategory, 
  getPortalPartnerJobs, 
  fetchArbeitsagenturJobs 
} from '../utils/jobService';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Search, 
  ExternalLink, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  X,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface JobsBoardProps {
  businesses: Business[];
  theme: ThemeConfig;
  activeThemeKey: string;
  initialCategory?: string | null;
  onBusinessSelect: (business: Business) => void;
  onBack: () => void;
  onNavigatePricing?: () => void;
}

export default function JobsBoard({ 
  businesses, 
  theme, 
  activeThemeKey, 
  initialCategory, 
  onBusinessSelect, 
  onBack,
  onNavigatePricing 
}: JobsBoardProps) {
  const { t, lang } = useTranslation();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<JobTypeCategory>('Alle');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [onlyLocalPartners, setOnlyLocalPartners] = useState(false);

  // Job data states
  const [baJobs, setBaJobs] = useState<JobListing[]>([]);
  const [totalBaCount, setTotalBaCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Extract direct partner jobs from Winterberg directory businesses
  const partnerJobs = useMemo(() => {
    return getPortalPartnerJobs(businesses, lang);
  }, [businesses, lang]);

  // Fetch jobs from Bundesagentur für Arbeit
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetchArbeitsagenturJobs(
      {
        wo: 'Winterberg',
        umkreis: radiusKm,
        size: 100
      },
      businesses,
      lang
    ).then(({ jobs, total }) => {
      if (!isCancelled) {
        setBaJobs(jobs);
        setTotalBaCount(total);
        setIsLoading(false);
      }
    }).catch(err => {
      console.warn('Jobs fetch error:', err);
      if (!isCancelled) {
        setIsLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [radiusKm, businesses, lang]);

  // Combined and filtered jobs list
  const filteredJobs = useMemo(() => {
    // 1. Combine partner jobs and BA jobs
    let list: JobListing[] = [];

    if (onlyLocalPartners) {
      list = [...partnerJobs, ...baJobs.filter(j => j.matchedBusiness)];
    } else {
      list = [...partnerJobs, ...baJobs];
    }

    // 2. Filter by Employment Type
    if (selectedType !== 'Alle') {
      list = list.filter(j => {
        const tLower = j.type.toLowerCase();
        const selLower = selectedType.toLowerCase();
        if (selectedType === 'Vollzeit') {
          return tLower.includes('vollzeit');
        }
        if (selectedType === 'Teilzeit') {
          return tLower.includes('teilzeit');
        }
        if (selectedType === 'Ausbildung') {
          return tLower.includes('ausbildung') || tLower.includes('azubi');
        }
        if (selectedType === 'Minijob') {
          return tLower.includes('minijob') || tLower.includes('aushilfe');
        }
        return tLower.includes(selLower);
      });
    }

    // 3. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        (j.description && j.description.toLowerCase().includes(q)) ||
        (j.category && j.category.toLowerCase().includes(q))
      );
    }

    return list;
  }, [partnerJobs, baJobs, selectedType, searchQuery, onlyLocalPartners]);

  // Badge styling helper
  const getTypeBadgeStyle = (type: JobListing['type']) => {
    switch (type) {
      case 'Ausbildung':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Minijob':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Teilzeit':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Vollzeit':
      case 'Vollzeit / Teilzeit':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  const totalPositionsCount = totalBaCount + partnerJobs.length;

  return (
    <main className="flex-1 w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24">
      {/* Back button */}
      <div className="mb-4">
        <button 
          onClick={onBack} 
          className="inline-flex items-center gap-1.5 bg-transparent border-none text-[#5F6B63] hover:text-[#0F4C2E] text-[13.5px] font-medium cursor-pointer transition-colors"
        >
          <span>←</span>
          <span>{lang === 'nl' ? 'Terug naar overzicht' : 'Zurück zur Übersicht'}</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0F4C2E] to-[#15603A] text-white rounded-3xl p-6 sm:p-10 shadow-lg mb-8 relative overflow-hidden">
        {/* Background decorative ring */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-4 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3.5">
            <Briefcase className="w-3.5 h-3.5 text-[#F2761B]" />
            <span>{totalPositionsCount > 0 ? `${totalPositionsCount} ${lang === 'nl' ? 'vacatures beschikbaar' : 'Stellenangebote verfügbar'}` : (lang === 'nl' ? 'Vacatures Winterberg' : 'Jobs in Winterberg')}</span>
          </div>

          <h1 className="font-display text-[clamp(28px,4.5vw,42px)] font-extrabold tracking-tight leading-[1.15] mb-3 text-white">
            {t("jobsTitle")}
          </h1>

          <p className="text-[15.5px] sm:text-[17px] leading-relaxed text-white/85 font-normal">
            {t("jobsDesc")}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E7E2DA] rounded-2xl p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717E75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("jobsSearchPlaceholder")}
            className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl text-[14.5px] text-[#1B211D] placeholder-[#8A958E] focus:outline-none focus:ring-2 focus:ring-[#0F4C2E]/20 focus:border-[#0F4C2E] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Suche leeren"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Rows */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-[#F0EBE1]">
          {/* Employment Type Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(['Alle', 'Vollzeit', 'Teilzeit', 'Ausbildung', 'Minijob'] as JobTypeCategory[]).map((type) => {
              const isActive = selectedType === type;
              const label = type === 'Alle' 
                ? t('jobsFilterAll') 
                : type === 'Vollzeit' 
                ? t('jobsFilterFulltime')
                : type === 'Teilzeit'
                ? t('jobsFilterParttime')
                : type === 'Ausbildung'
                ? t('jobsFilterApprenticeship')
                : t('jobsFilterMinijob');

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0F4C2E] text-white shadow-xs'
                      : 'bg-[#F4F1EA] text-[#4A544D] hover:bg-[#EBE5DB]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Radius selector */}
          <div className="flex items-center gap-1.5 self-start lg:self-auto text-xs text-[#5F6B63]">
            <MapPin className="w-3.5 h-3.5 text-[#0F4C2E]" />
            <span className="font-medium mr-1">{lang === 'nl' ? 'Straal:' : 'Umkreis:'}</span>
            <div className="inline-flex rounded-lg border border-[#E7E2DA] bg-[#FAF8F5] p-0.5">
              {[
                { km: 0, label: '0 km' },
                { km: 10, label: '+10 km' },
                { km: 15, label: '+15 km' },
              ].map(({ km, label }) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setRadiusKm(km)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    radiusKm === km 
                      ? 'bg-[#0F4C2E] text-white shadow-xs' 
                      : 'text-[#5F6B63] hover:text-[#1B211D]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="text-sm font-semibold text-[#1B211D]">
          {isLoading ? (
            <span className="text-[#717E75]">{t("jobsLoading")}</span>
          ) : (
            <span>
              {filteredJobs.length} {filteredJobs.length === 1 ? (lang === 'nl' ? 'vacature gevonden' : 'Stellenangebot gefunden') : (lang === 'nl' ? 'vacatures gefunden' : 'Stellenangebote gefunden')}
              {radiusKm > 0 && <span className="text-[#717E75] font-normal ml-1.5">({lang === 'nl' ? `in Winterberg & ${radiusKm} km omtrek` : `in Winterberg & ${radiusKm} km Umkreis`})</span>}
            </span>
          )}
        </div>

        {/* Quick toggle for local partner businesses */}
        {partnerJobs.length > 0 && (
          <button
            type="button"
            onClick={() => setOnlyLocalPartners(!onlyLocalPartners)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
              onlyLocalPartners 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Award className="w-3 h-3 text-[#0F4C2E]" />
            <span>{lang === 'nl' ? 'Alleen lokale partners' : 'Nur lokale Partnerbetriebe'}</span>
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-[#EDE8E0] rounded-2xl p-5 shadow-xs animate-pulse">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jobs Listing Grid */}
      {!isLoading && (
        <div className="space-y-3.5">
          {filteredJobs.length === 0 ? (
            <div className="bg-white border border-dashed border-[#D8D2C8] rounded-2xl p-12 text-center text-[#5F6B63]">
              <Briefcase className="w-10 h-10 mx-auto text-[#8A958E] mb-3" />
              <p className="text-base font-semibold text-[#1B211D] mb-1">
                {t("noJobsFound")}
              </p>
              <p className="text-sm text-[#717E75] max-w-md mx-auto mb-4">
                {t("noJobsMatch")}
              </p>
              {(searchQuery || selectedType !== 'Alle' || radiusKm !== 10) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('Alle');
                    setRadiusKm(10);
                    setOnlyLocalPartners(false);
                  }}
                  className="px-4 py-2 bg-[#0F4C2E] text-white text-xs font-semibold rounded-lg hover:bg-[#15603A] transition-colors"
                >
                  {lang === 'nl' ? 'Filters resetten' : 'Filter zurücksetzen'}
                </button>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => {
              const hasDirectProfile = !!job.matchedBusiness;
              const isPartner = job.source === 'partner';

              return (
                <article
                  key={job.id}
                  className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-[0_2px_10px_rgba(27,33,29,0.03)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(27,33,29,0.08)] ${
                    isPartner 
                      ? 'border-emerald-300 ring-1 ring-emerald-200/60 bg-emerald-50/20' 
                      : 'border-[#EDE8E0] hover:border-[#D8D2C8]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Main Title & Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {/* Source Badge */}
                        {isPartner ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F1EB] text-[#0F4C2E] border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-[#0F4C2E]" />
                            <span>{t("jobsSourcePartner")}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            <Building2 className="w-3 h-3 text-gray-500" />
                            <span>{t("jobsSourceBA")}</span>
                          </span>
                        )}

                        {/* Relative Date */}
                        {job.relativeDate && (
                          <span className="text-[11.5px] text-[#8A958E] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{job.relativeDate}</span>
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h2 className="font-display text-[17.5px] sm:text-[19px] font-bold text-[#1B211D] leading-snug group-hover:text-[#0F4C2E] transition-colors">
                        {job.title}
                      </h2>

                      {/* Company & Location */}
                      <div className="flex items-center gap-2 text-[13.5px] text-[#5F6B63] mt-1.5 flex-wrap">
                        {hasDirectProfile ? (
                          <button
                            type="button"
                            onClick={() => {
                              const found = businesses.find(b => b.id === job.matchedBusiness?.id);
                              if (found) onBusinessSelect(found);
                            }}
                            className="font-semibold text-[#0F4C2E] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>{job.company}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C2E]" />
                          </button>
                        ) : (
                          <span className="font-medium text-[#2C3530]">{job.company}</span>
                        )}
                        <span className="text-gray-300">·</span>
                        <span className="flex items-center gap-1 text-[#6F7B73]">
                          <MapPin className="w-3 h-3 text-[#8A958E]" />
                          <span>{job.location}</span>
                        </span>
                      </div>

                      {/* Description snippet if present */}
                      {job.description && (
                        <p className="mt-2 text-[13px] text-[#717E75] line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>

                    {/* Type Badge & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      {/* Job Type Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTypeBadgeStyle(job.type)}`}>
                        {job.type}
                      </span>

                      {/* Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Profile Link button if matched */}
                        {hasDirectProfile && (
                          <button
                            type="button"
                            onClick={() => {
                              const found = businesses.find(b => b.id === job.matchedBusiness?.id);
                              if (found) onBusinessSelect(found);
                            }}
                            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E7E2DA] bg-white hover:bg-[#FAF8F5] text-[#1B211D] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                          >
                            <span>{t("toCompanyProfile")}</span>
                          </button>
                        )}

                        {/* Apply / Detail Link */}
                        {job.externalUrl && (
                          <a
                            href={job.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F4C2E] hover:bg-[#15603A] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
                          >
                            <span>{t("jobsApplyNow")}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* Employer CTA Box */}
      <div className="mt-12 bg-[#FAF8F5] border border-[#E7E2DA] rounded-3xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2761B] uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === 'nl' ? 'Voor werkgevers' : 'Für Arbeitgeber'}</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1B211D]">
            {t("jobsEmployerCtaTitle")}
          </h3>
          <p className="text-sm text-[#5F6B63] leading-relaxed">
            {t("jobsEmployerCtaDesc")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onNavigatePricing) {
              onNavigatePricing();
            } else {
              window.history.pushState(null, '', lang === 'nl' ? '/nl/prijzen' : '/preise');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F4C2E] hover:bg-[#15603A] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>{t("jobsEmployerCtaButton")}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
