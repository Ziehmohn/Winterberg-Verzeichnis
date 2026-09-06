import React, { useState } from 'react';
import { Home, Building2, Fuel, Siren, Menu, Activity, Snowflake, Briefcase } from 'lucide-react';
import { useTranslation } from '../i18n';

interface AppBottomNavProps {
  currentView: string;
  isJobsMode: boolean;
  onNavigateHome: () => void;
  onNavigateBusinesses: () => void;
  onNavigateFuel: () => void;
  onNavigateEmergency: () => void;
  onNavigateJobs: () => void;
  onOpenMenu: () => void;
  isAppStandalone?: boolean;
}

export default function AppBottomNav({
  currentView,
  isJobsMode,
  onNavigateHome,
  onNavigateBusinesses,
  onNavigateFuel,
  onNavigateEmergency,
  onNavigateJobs,
  onOpenMenu,
  isAppStandalone = false
}: AppBottomNavProps) {
  const { lang } = useTranslation();
  const [liveMenuOpen, setLiveMenuOpen] = useState(false);

  const isHomeActive = currentView === 'home' && !isJobsMode;
  const isBusinessesActive = (currentView === 'all' || currentView === 'category' || currentView === 'best-of' || currentView === 'business') && !isJobsMode;
  const isFuelActive = currentView === 'fuel-prices' && !isJobsMode;
  const isEmergencyActive = currentView === 'emergency' && !isJobsMode;
  const isJobsActive = isJobsMode;

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E7E2DA] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="App Bottom Navigation"
    >
      <div className="grid grid-cols-5 h-[62px] items-center px-1 max-w-lg mx-auto">
        {/* 1. Start / Home */}
        <button
          type="button"
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isHomeActive ? 'text-[#0F4C2E]' : 'text-[#717E75] hover:text-[#1B211D]'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0F4C2E] rounded-full" />
            )}
          </div>
          <span className={`text-[10.5px] mt-1 font-medium leading-none ${isHomeActive ? 'font-bold text-[#0F4C2E]' : ''}`}>
            Start
          </span>
        </button>

        {/* 2. Unternehmen */}
        <button
          type="button"
          onClick={onNavigateBusinesses}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isBusinessesActive ? 'text-[#0F4C2E]' : 'text-[#717E75] hover:text-[#1B211D]'
          }`}
        >
          <div className="relative">
            <Building2 className={`w-5 h-5 ${isBusinessesActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isBusinessesActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0F4C2E] rounded-full" />
            )}
          </div>
          <span className={`text-[10.5px] mt-1 font-medium leading-none ${isBusinessesActive ? 'font-bold text-[#0F4C2E]' : ''}`}>
            {lang === 'nl' ? 'Bedrijven' : 'Unternehmen'}
          </span>
        </button>

        {/* 3. Live (Sprit, Notfall, Skilifte) */}
        <div className="relative h-full w-full flex justify-center">
          <button
            type="button"
            onClick={() => setLiveMenuOpen(!liveMenuOpen)}
            className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
              (isFuelActive || isEmergencyActive || liveMenuOpen) ? 'text-[#DC2626]' : 'text-[#717E75] hover:text-[#1B211D]'
            }`}
          >
            <div className="relative">
              <Activity className={`w-5 h-5 ${isFuelActive || isEmergencyActive || liveMenuOpen ? 'stroke-[2.5] text-[#DC2626]' : 'stroke-2'}`} />
              {(isFuelActive || isEmergencyActive) && !liveMenuOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
              )}
            </div>
            <span className={`text-[10.5px] mt-1 font-medium leading-none ${isFuelActive || isEmergencyActive || liveMenuOpen ? 'font-bold text-[#DC2626]' : ''}`}>
              Live
            </span>
          </button>
          
          {liveMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLiveMenuOpen(false)} />
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 w-56 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <button 
                  onClick={() => { setLiveMenuOpen(false); onNavigateFuel(); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <Fuel className="w-5 h-5 text-[#F2761B]" />
                  <span className="font-medium text-gray-800 text-sm">{lang === 'nl' ? 'Tanken' : 'Spritpreise'}</span>
                </button>
                <button 
                  onClick={() => { setLiveMenuOpen(false); onNavigateEmergency(); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <Siren className="w-5 h-5 text-[#DC2626]" />
                  <span className="font-medium text-gray-800 text-sm">{lang === 'nl' ? 'Noodhulp' : 'Notdienste'}</span>
                </button>
                <div className="flex items-center gap-3 px-4 py-3 opacity-50 text-left">
                  <Snowflake className="w-5 h-5 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 text-sm">{lang === 'nl' ? 'Skiliften' : 'Skilifte'}</span>
                    <span className="text-[10px] text-gray-500">{lang === 'nl' ? 'Binnenkort' : 'In Kürze'}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 4. Jobs */}
        <button
          type="button"
          onClick={onNavigateJobs}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isJobsActive ? 'text-[#0F4C2E]' : 'text-[#717E75] hover:text-[#1B211D]'
          }`}
        >
          <div className="relative">
            <Briefcase className={`w-5 h-5 ${isJobsActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isJobsActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0F4C2E] rounded-full" />
            )}
          </div>
          <span className={`text-[10.5px] mt-1 font-medium leading-none ${isJobsActive ? 'font-bold text-[#0F4C2E]' : ''}`}>
            Jobs
          </span>
        </button>

        {/* 5. Menü / Mehr */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center h-full w-full py-1 text-[#717E75] hover:text-[#1B211D] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5 stroke-2" />
          <span className="text-[10.5px] mt-1 font-medium leading-none">
            Menü
          </span>
        </button>
      </div>
    </nav>
  );
}
