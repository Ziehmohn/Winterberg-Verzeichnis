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
  const normCat = category.toLowerCase();
  const normSub = subcategory.toLowerCase();
  const normName = name.toLowerCase();

  // Helper matching
  const match = (...terms: string[]) => terms.some(t => normSub.includes(t) || normCat.includes(t) || normName.includes(t));

  // 1. Gastronomie & Food
  if (match('pizza', 'pizzeria', 'pizzerien')) {
    return { icon: Pizza, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
  }
  if (match('café', 'cafe', 'bäcker', 'baeckerei', 'konditorei', 'kaffee', 'frühstück', 'alm-frühstück')) {
    return { icon: Coffee, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (match('kneipe', 'bar', 'pub', 'bier', 'brauhaus', 'hessenkeller', 'irish pub', 'bu\'ket')) {
    return { icon: Beer, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
  }
  if (match('wein', 'weinstube', 'vinothek')) {
    return { icon: Wine, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  }
  if (match('eis', 'eisdiele', 'eiscafé')) {
    return { icon: IceCream, bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' };
  }
  if (match('imbiss', 'burger', 'döner', 'snack', 'grill', 'pommes')) {
    return { icon: Sandwich, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
  }
  if (match('skihütte', 'skihuette', 'alm', 'alm-stub', 'wanderlust', 'marktalm', 'markt alm')) {
    return { icon: UtensilsCrossed, bg: 'bg-emerald-50', text: 'text-[#0F4C2E]', border: 'border-emerald-200' };
  }
  if (normCat.includes('gastro') || match('restaurant', 'speisen', 'gaststätte', 'landhotel & restaurant', 'tapas')) {
    return { icon: UtensilsCrossed, bg: 'bg-orange-50', text: 'text-[#D65F0C]', border: 'border-orange-200' };
  }

  // 2. Freizeit & Sport
  if (match('fitness', 'gym', 'training', 'workout', 'kraftsport', 'fitnessstudio')) {
    return { icon: Dumbbell, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
  }
  if (match('tennis', 'sandplatz', 'tennisclub', 'tennisplatz')) {
    return { icon: Trophy, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (match('fußball', 'fussball', 'sportverein', 'tus', 'sv ')) {
    return { icon: Trophy, bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' };
  }
  if (match('schwimm', 'bad', 'pool', 'sauna', 'therme', 'wellness', 'spa')) {
    return { icon: Waves, bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' };
  }
  if (match('spielplatz', 'indoor-spielplatz', 'kinder', 'funpark')) {
    return { icon: Smile, bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
  }
  if (match('erlebnisberg', 'bikepark', 'kappe', 'kletterwald', 'rodelbahn', 'outdoor', 'abenteuer')) {
    return { icon: Mountain, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (match('ski', 'snowboard', 'lift', 'piste', 'wintersport', 'rodeln', 'skikarussell')) {
    return { icon: MountainSnow, bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
  }
  if (match('bike', 'fahrrad', 'radsport', 'trail')) {
    return { icon: Bike, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
  }
  if (normCat.includes('freizeit')) {
    return { icon: Compass, bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
  }

  // 3. Hotels & Unterkünfte
  if (match('hotel', 'resort', 'lodge', 'hessenhof', 'landhotel')) {
    return { icon: Hotel, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
  }
  if (match('ferienwohnung', 'fewo', 'apartment', 'appartement')) {
    return { icon: Home, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  }
  if (match('ferienhaus', 'chalet', 'hütte', 'huette')) {
    return { icon: Home, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (match('ferienpark', 'camping', 'zelt')) {
    return { icon: Tent, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (match('pension', 'gästehaus', 'bed & breakfast', 'unterkunft', 'unterkünfte')) {
    return { icon: Bed, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' };
  }
  if (normCat.includes('hotel') || normCat.includes('unterk')) {
    return { icon: BedDouble, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
  }

  // 4. Handwerk & Bau
  if (match('kfz', 'auto', 'werkstatt', 'car', 'autoreparatur', 'reifen', 'bosch car', 'kruk', 'nagel', 'mantel')) {
    return { icon: Car, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
  }
  if (match('elektro', 'elektriker', 'strom', 'installation', 'leiße', 'kiemen', 'müller', 'quick', 'kösler')) {
    return { icon: Zap, bg: 'bg-yellow-50', text: 'text-amber-600', border: 'border-yellow-200' };
  }
  if (match('schreinerei', 'tischler', 'holz', 'treppen', 'möbel', 'bröker', 'stockhausen', 'ittermann', 'sögtrop')) {
    return { icon: Hammer, bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
  }
  if (match('dachdecker', 'bedachung', 'dach', 'schindel', 'menke', 'müllenhoff')) {
    return { icon: Building, bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' };
  }
  if (match('maler', 'lackierer', 'farbe', 'anstrich', 'klauke', 'schnorbus', 'leber')) {
    return { icon: Paintbrush, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
  }
  if (match('garten', 'landschaftsbau', 'biene', 'garna', 'tielke', 'lütteken', 'creative garden')) {
    return { icon: Trees, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (match('heizung', 'sanitär', 'klima', 'haustechnik', 'solar', 'santherm', 'lefarth', 'schörmann', '3werk', 'winzenick', 'senge', 'atmos')) {
    return { icon: Flame, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
  }
  if (match('bau', 'bauunternehmen', 'bauunternehmung', 'tiefbau', 'hochbau', 'eickmann', 'brinkmann')) {
    return { icon: HardHat, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  }
  if (match('friseur', 'haare', 'barbier', 'styling', 'salon')) {
    return { icon: Scissors, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' };
  }
  if (match('wäscherei', 'reinigung', 'textilreinigung', 'roj')) {
    return { icon: Sparkles, bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' };
  }
  if (normCat.includes('handwerk')) {
    return { icon: Wrench, bg: 'bg-emerald-50', text: 'text-[#0F4C2E]', border: 'border-emerald-200' };
  }

  // 5. Einzelhandel & Shopping
  if (match('supermarkt', 'rewe', 'edeka', 'lidl', 'aldi', 'netto', 'dorfladen', 'lebensmittel')) {
    return { icon: ShoppingCart, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (match('bekleidung', 'mode', 'fashion', 'kleidung', 'boutique', 'schuh')) {
    return { icon: Shirt, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' };
  }
  if (match('bürobedarf', 'buch', 'schreibwaren', 'papier')) {
    return { icon: BookOpen, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
  }
  if (match('autohaus', 'autohäuser', 'fahrzeughandel')) {
    return { icon: CarFront, bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
  }
  if (normCat.includes('einzelhandel') || normCat.includes('shop') || normCat.includes('einkauf')) {
    return { icon: ShoppingBag, bg: 'bg-orange-50', text: 'text-[#D65F0C]', border: 'border-orange-200' };
  }

  // 6. Dienstleistungen & Gesundheit / Beratung
  if (match('bank', 'sparkasse', 'volksbank', 'finanz', 'kredit')) {
    return { icon: Landmark, bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
  }
  if (match('steuerberater', 'steuer', 'buchhaltung', 'wirtschaftsprüfer')) {
    return { icon: Calculator, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
  }
  if (match('rechtsanwalt', 'anwalt', 'notar', 'kanzlei', 'recht')) {
    return { icon: Scale, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
  }
  if (match('versicherung', 'agentur', 'vorsorge', 'allianz', 'provinzial', 'ergo', 'huk')) {
    return { icon: ShieldCheck, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  }
  if (match('marketing', 'werbeagentur', 'seo', 'sichtbar', 'webdesign', 'software', 'it')) {
    return { icon: Laptop, bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' };
  }
  if (match('immobilien', 'makler', 'immo')) {
    return { icon: Building2, bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' };
  }
  if (match('arzt', 'ärzte', 'praxis', 'apotheke', 'gesundheit', 'therapie', 'zahnarzt', 'physio')) {
    return { icon: HeartPulse, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' };
  }
  if (normCat.includes('dienstleistung')) {
    return { icon: Briefcase, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
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
