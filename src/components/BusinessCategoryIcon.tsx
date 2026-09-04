import React from 'react';
import {
  UtensilsCrossed,
  Utensils,
  Coffee,
  Beer,
  Wine,
  Pizza,
  IceCream,
  Sandwich,
  Dumbbell,
  Trophy,
  Waves,
  Smile,
  Mountain,
  MountainSnow,
  Compass,
  Bike,
  Sun,
  Hotel,
  BedDouble,
  Bed,
  Home,
  Tent,
  Car,
  CarFront,
  Zap,
  Hammer,
  Paintbrush,
  Trees,
  Flower2,
  Sprout,
  Flame,
  Droplets,
  HardHat,
  Scissors,
  Sparkles,
  Shirt,
  Wrench,
  ShoppingCart,
  Store,
  ShoppingBag,
  BookOpen,
  Landmark,
  Calculator,
  Scale,
  ShieldCheck,
  Laptop,
  Building2,
  Building,
  HeartPulse,
  Stethoscope,
  Fuel,
  Film,
  Briefcase,
  LucideIcon
} from 'lucide-react';

interface BusinessCategoryIconProps {
  category?: string;
  subcategory?: string;
  name?: string;
  isPremium?: boolean;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface CategoryStyle {
  icon: LucideIcon;
  bg: string;
  text: string;
  border: string;
}

export function getCategoryStyle(category = '', subcategory = '', name = '', isPremium = false): CategoryStyle {
  const normCat = (category || '').toLowerCase().trim();
  const normSub = (subcategory || '').toLowerCase().trim();
  const normName = (name || '').toLowerCase().trim();

  // Helper matching on subcategory or name (NOT category, to avoid false substring matches like 'eis' in 'dienstleistungen')
  const matchSubOrName = (...terms: string[]) => 
    terms.some(t => normSub.includes(t) || normName.includes(t));

  // --- 1. Gastronomie & Food ---
  if (matchSubOrName('pizza', 'pizzerien', 'pizzeria')) {
    return { icon: Pizza, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
  }
  if (matchSubOrName('eisdiele', 'eisdielen', 'eiscafé', 'eiscafe', 'gelato')) {
    return { icon: IceCream, bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' };
  }
  if (matchSubOrName('café', 'cafe', 'kaffee', 'bäcker', 'baeckerei', 'konditorei', 'frühstück')) {
    return { icon: Coffee, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (matchSubOrName('kneipe', 'kneipen', 'bar', 'bars', 'pub', 'bier', 'brauhaus', 'hessenkeller')) {
    return { icon: Beer, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
  }
  if (matchSubOrName('wein', 'weinstube', 'weinstuben', 'vinothek')) {
    return { icon: Wine, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  }
  if (matchSubOrName('imbiss', 'imbisse', 'burger', 'döner', 'snack', 'grill', 'pommes')) {
    return { icon: Sandwich, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
  }
  if (matchSubOrName('skihütte', 'skihütten', 'skihuette', 'alm', 'alm-stub', 'wanderlust', 'marktalm')) {
    return { icon: UtensilsCrossed, bg: 'bg-emerald-50', text: 'text-[#0F4C2E]', border: 'border-emerald-200' };
  }
  if (matchSubOrName('restaurant', 'gaststätte', 'speisen', 'tapas', 'gastro')) {
    return { icon: UtensilsCrossed, bg: 'bg-orange-50', text: 'text-[#D65F0C]', border: 'border-orange-200' };
  }

  // --- 2. Dienstleistungen (Banken, Versicherungen, Steuerberater, Recht, Marketing) ---
  if (matchSubOrName('bank', 'banken', 'sparkasse', 'volksbank', 'finanz', 'kredit')) {
    return { icon: Landmark, bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
  }
  if (matchSubOrName('versicherung', 'versicherungsagentur', 'versicherungsagenturen', 'allianz', 'provinzial', 'ergo', 'huk', 'signal iduna', 'gothaer', 'axa', 'debeka', 'vorsorge')) {
    return { icon: ShieldCheck, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (matchSubOrName('steuerberater', 'steuerberatung', 'steuer', 'buchhaltung', 'wirtschaftsprüfer')) {
    return { icon: Calculator, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
  }
  if (matchSubOrName('rechtsanwälte', 'rechtsanwalt', 'anwalt', 'notar', 'kanzlei', 'recht')) {
    return { icon: Scale, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
  }
  if (matchSubOrName('marketing', 'werbeagentur', 'seo', 'sichtbar', 'webdesign', 'software', 'agentur', 'werbung')) {
    return { icon: Laptop, bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' };
  }
  if (matchSubOrName('immobilien', 'makler', 'immo')) {
    return { icon: Building2, bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' };
  }

  // --- 3. Gesundheit & Schönheit (Kosmetikstudios, Friseure, Ärzte) ---
  if (matchSubOrName('kosmetik', 'kosmetikstudios', 'kosmetikstudio', 'nagelstudio', 'nageldesign', 'beauty', 'fußpflege', 'maniküre', 'pediküre', 'ästhetik')) {
    return { icon: Sparkles, bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' };
  }
  if (matchSubOrName('friseur', 'friseure', 'haare', 'barbier', 'styling', 'salon')) {
    return { icon: Scissors, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' };
  }
  if (matchSubOrName('zahnarzt', 'zahnärzte', 'dental', 'zähne')) {
    return { icon: Smile, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
  }
  if (matchSubOrName('apotheke', 'apotheken')) {
    return { icon: HeartPulse, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' };
  }
  if (matchSubOrName('arzt', 'ärzte', 'praxis', 'mediz', 'klinik', 'doktor', 'hausarzt', 'facharzt')) {
    return { icon: Stethoscope, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' };
  }
  if (matchSubOrName('physio', 'physiotherapie', 'massage', 'massagen', 'osteopathie', 'ergotherapie')) {
    return { icon: HeartPulse, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
  }
  if (matchSubOrName('pflege', 'pflegedienst', 'pflegedienste', 'senioren')) {
    return { icon: ShieldCheck, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (matchSubOrName('tier', 'tiergesundheit', 'tierarzt', 'veterinär')) {
    return { icon: HeartPulse, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (matchSubOrName('yoga', 'pilates', 'meditation')) {
    return { icon: Smile, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }

  // --- 4. Mobilität & KFZ ---
  if (matchSubOrName('tankstelle', 'tankstellen', 'kraftstoff', 'sprit', 'diesel', 'benzin')) {
    return { icon: Fuel, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
  }
  if (matchSubOrName('kfz', 'werkstatt', 'autoreparatur', 'reifen', 'bosch car', 'inspektion', 'mechanik')) {
    return { icon: Wrench, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
  }
  if (matchSubOrName('autohaus', 'autohäuser', 'fahrzeughandel', 'auto')) {
    return { icon: CarFront, bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
  }

  // --- 5. Handwerk & Bau ---
  if (matchSubOrName('elektro', 'elektriker', 'strom', 'installation')) {
    return { icon: Zap, bg: 'bg-yellow-50', text: 'text-amber-600', border: 'border-yellow-200' };
  }
  if (matchSubOrName('schreinerei', 'schreinereien', 'tischler', 'holz', 'möbel', 'fenster')) {
    return { icon: Hammer, bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
  }
  if (matchSubOrName('dachdecker', 'bedachung', 'dach')) {
    return { icon: Building, bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' };
  }
  if (matchSubOrName('maler', 'lackierer', 'farbe', 'anstrich')) {
    return { icon: Paintbrush, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
  }
  if (matchSubOrName('garten', 'gartenbauer', 'landschaftsbau', 'baumschule', 'baumschulen')) {
    return { icon: Trees, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (matchSubOrName('heizung', 'heizungstechnik', 'sanitär', 'klima', 'solar', 'haustechnik')) {
    return { icon: Flame, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
  }
  if (matchSubOrName('bauunternehmen', 'bau', 'tiefbau', 'hochbau', 'baustoffe')) {
    return { icon: HardHat, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (matchSubOrName('bäderstudios', 'bäderstudio', 'bad')) {
    return { icon: Droplets, bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' };
  }
  if (matchSubOrName('wäscherei', 'wäschereien', 'reinigung', 'textilreinigung')) {
    return { icon: Sparkles, bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' };
  }
  if (matchSubOrName('fleischerei', 'metzgerei', 'metzger')) {
    return { icon: Utensils, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  }

  // --- 6. Einzelhandel & Shopping ---
  if (matchSubOrName('supermarkt', 'lebensmittel', 'rewe', 'edeka', 'lidl', 'aldi', 'netto', 'dorfladen')) {
    return { icon: ShoppingCart, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (matchSubOrName('bekleidung', 'mode', 'fashion', 'kleidung', 'boutique', 'textil')) {
    return { icon: Shirt, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' };
  }
  if (matchSubOrName('schuh', 'schuhe', 'schuhgeschäfte', 'schuhgeschäft')) {
    return { icon: ShoppingBag, bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
  }
  if (matchSubOrName('drogerie', 'drogerien')) {
    return { icon: HeartPulse, bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' };
  }
  if (matchSubOrName('baumarkt', 'baumärkte')) {
    return { icon: Hammer, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
  }
  if (matchSubOrName('blumen', 'blumengeschäfte', 'floristik')) {
    return { icon: Flower2, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' };
  }
  if (matchSubOrName('feinkost')) {
    return { icon: UtensilsCrossed, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (matchSubOrName('bürobedarf', 'buch', 'schreibwaren', 'papier')) {
    return { icon: BookOpen, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
  }

  // --- 7. Hotels & Unterkünfte ---
  if (matchSubOrName('hotel', 'hotels', 'resort', 'lodge', 'pension', 'gästehaus', 'landhotel')) {
    return { icon: Hotel, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
  }
  if (matchSubOrName('ferienwohnung', 'ferienwohnungen', 'fewo', 'apartment', 'appartement')) {
    return { icon: Home, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  }
  if (matchSubOrName('ferienhaus', 'ferienhäuser', 'chalet', 'hütte')) {
    return { icon: Home, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (matchSubOrName('ferienpark', 'ferienparks', 'camping', 'zelt')) {
    return { icon: Tent, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }

  // --- 8. Ski, Bike & Sport ---
  if (matchSubOrName('bike', 'fahrrad', 'fahrradverleih', 'fahrradgeschäfte', 'radsport', 'trail', 'bikepark')) {
    return { icon: Bike, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
  }
  if (matchSubOrName('ski', 'skiverleih', 'skischule', 'snowboard', 'lift', 'piste', 'wintersport', 'rodeln')) {
    return { icon: MountainSnow, bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
  }
  if (matchSubOrName('fitness', 'fitnessstudios', 'gym', 'workout', 'training')) {
    return { icon: Dumbbell, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
  }
  if (matchSubOrName('tennis', 'tennisplätze', 'fußball', 'fußballvereine', 'sportverein', 'reitsport')) {
    return { icon: Trophy, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (matchSubOrName('sport', 'outdoor')) {
    return { icon: Compass, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }

  // --- 9. Freizeit ---
  if (matchSubOrName('kino', 'film', 'cinema')) {
    return { icon: Film, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  }
  if (matchSubOrName('schwimmbad', 'schwimmbäder', 'bad', 'pool', 'therme', 'sauna')) {
    return { icon: Waves, bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' };
  }
  if (matchSubOrName('spielplatz', 'indoor-spielplätze', 'kinder', 'funpark', 'kart')) {
    return { icon: Smile, bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
  }
  if (matchSubOrName('bowling', 'kegeln')) {
    return { icon: Trophy, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
  }

  // --- 10. Fallbacks by Category ---
  if (normCat.includes('gastro')) {
    return { icon: UtensilsCrossed, bg: 'bg-orange-50', text: 'text-[#D65F0C]', border: 'border-orange-200' };
  }
  if (normCat.includes('hotel') || normCat.includes('unterk')) {
    return { icon: Hotel, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
  }
  if (normCat.includes('handwerk')) {
    return { icon: Wrench, bg: 'bg-emerald-50', text: 'text-[#0F4C2E]', border: 'border-emerald-200' };
  }
  if (normCat.includes('einzelhandel') || normCat.includes('shop') || normCat.includes('einkauf')) {
    return { icon: ShoppingBag, bg: 'bg-orange-50', text: 'text-[#D65F0C]', border: 'border-orange-200' };
  }
  if (normCat.includes('gesund') || normCat.includes('mediz')) {
    return { icon: HeartPulse, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' };
  }
  if (normCat.includes('mobil') || normCat.includes('kfz')) {
    return { icon: Car, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
  }
  if (normCat.includes('dienstleistung')) {
    return { icon: Briefcase, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
  }
  if (normCat.includes('sport') || normCat.includes('ski') || normCat.includes('bike')) {
    return { icon: MountainSnow, bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
  }
  if (normCat.includes('freizeit')) {
    return { icon: Compass, bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
  }

  // General Fallback
  return { icon: Store, bg: 'bg-[#FAF8F5]', text: 'text-[#0F4C2E]', border: 'border-[#EDE8E0]' };
}

export default function BusinessCategoryIcon({
  category = '',
  subcategory = '',
  name = '',
  isPremium = false,
  className = '',
  iconClassName = '',
  size = 'md'
}: BusinessCategoryIconProps) {
  const style = getCategoryStyle(category, subcategory, name, isPremium);
  const IconComponent = style.icon;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  return (
    <div
      className={`rounded-md flex items-center justify-center shrink-0 transition-colors ${
        isPremium
          ? 'bg-[#F2761B] text-white shadow-sm'
          : `${style.bg} ${style.text} border ${style.border}`
      } ${sizeClasses[size]} ${className}`}
      title={subcategory || category || name}
    >
      <IconComponent className={`${iconSizes[size]} ${iconClassName}`} />
    </div>
  );
}
