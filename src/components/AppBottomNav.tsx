import React from 'react';
import { Home, Building2, Fuel, Siren, Menu } from 'lucide-react';
import { useTranslation } from '../i18n';

interface AppBottomNavProps {
  currentView: string;
  onNavigateHome: () => void;
  onNavigateBusinesses: () => void;
  onNavigateFuel: () => void;
  onNavigateEmergency: () => void;
  onOpenMenu: () => void;
  isAppStandalone?: boolean;
}

export default function AppBottomNav({
  currentView,
  onNavigateHome,
  onNavigateBusinesses,
  onNavigateFuel,
  onNavigateEmergency,
  onOpenMenu,
  isAppStandalone = false
}: AppBottomNavProps) {
  const { lang } = useTranslation();

  const isHomeActive = currentView === 'home';
  const isBusinessesActive = currentView === 'all' || currentView === 'category' || currentView === 'best-of' || currentView === 'business';
  const isFuelActive = currentView === 'fuel-prices';
  const isEmergencyActive = currentView === 'emergency';

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

        {/* 3. Spritpreise */}
        <button
          type="button"
          onClick={onNavigateFuel}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isFuelActive ? 'text-[#F2761B]' : 'text-[#717E75] hover:text-[#1B211D]'
          }`}
        >
          <div className="relative">
            <Fuel className={`w-5 h-5 ${isFuelActive ? 'stroke-[2.5] text-[#F2761B]' : 'stroke-2'}`} />
            {isFuelActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#F2761B] rounded-full" />
            )}
          </div>
          <span className={`text-[10.5px] mt-1 font-medium leading-none ${isFuelActive ? 'font-bold text-[#F2761B]' : ''}`}>
            {lang === 'nl' ? 'Tanken' : 'Spritpreise'}
          </span>
        </button>

        {/* 4. Notdienste */}
        <button
          type="button"
          onClick={onNavigateEmergency}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isEmergencyActive ? 'text-[#DC2626]' : 'text-[#717E75] hover:text-[#1B211D]'
          }`}
        >
          <div className="relative">
            <Siren className={`w-5 h-5 ${isEmergencyActive ? 'stroke-[2.5] text-[#DC2626]' : 'stroke-2'}`} />
            {isEmergencyActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
            )}
          </div>
          <span className={`text-[10.5px] mt-1 font-medium leading-none ${isEmergencyActive ? 'font-bold text-[#DC2626]' : ''}`}>
            {lang === 'nl' ? 'Noodhulp' : 'Notdienste'}
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
