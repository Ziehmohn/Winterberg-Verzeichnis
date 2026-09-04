import React from 'react';
import { MapPin } from 'lucide-react';

export default function TestKachelPreview() {
  return (
    <div className="bg-[#FAF8F5] border border-[#EDE8E0] rounded-lg p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
      <h2 className="font-display text-[21px] font-bold m-0 mb-[16px]">Test Ansicht für Unternehmenskacheln</h2>
      <p className="text-[14px] text-[#5F6B63] mb-6">
        Hier können Sie das neue Design der Unternehmenskacheln überprüfen, bevor es live geschaltet wird.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Kachel 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E7E2DA] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <div className="h-[200px] w-full bg-gray-200 relative">
            <img 
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80" 
              alt="Insider Fashion Store" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <span className="text-[11px] font-bold text-[#F2761B] tracking-wider uppercase mb-1.5">
              Bekleidung
            </span>
            <h3 className="text-[20px] font-bold text-[#1B211D] mb-2 leading-tight">
              Insider Fashion Store
            </h3>
            <p className="text-[14.5px] text-[#4A544D] leading-relaxed mb-5 line-clamp-2">
              Moderner Fashion Store im Herzen von Winterberg mit aktueller Damen- und Herrenmode, Schuhen und Accessoires für jeden...
            </p>
            <div className="mt-auto pt-4 border-t border-[#E7E2DA] flex items-center gap-2 text-[#8A928B]">
              <MapPin className="w-4 h-4" />
              <span className="text-[13.5px]">Am Waltenberg 21</span>
            </div>
          </div>
        </div>

        {/* Kachel 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E7E2DA] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <div className="h-[200px] w-full bg-gray-200 relative">
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80" 
              alt="Café Extrablatt" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <span className="text-[11px] font-bold text-[#F2761B] tracking-wider uppercase mb-1.5">
              Café & Bar
            </span>
            <h3 className="text-[20px] font-bold text-[#1B211D] mb-2 leading-tight">
              Café Extrablatt
            </h3>
            <p className="text-[14.5px] text-[#4A544D] leading-relaxed mb-5 line-clamp-2">
              Gemütliches Café mit großem Frühstücksbuffet, leckeren Burgern und frischen Cocktails am Abend. Täglich geöffnet.
            </p>
            <div className="mt-auto pt-4 border-t border-[#E7E2DA] flex items-center gap-2 text-[#8A928B]">
              <MapPin className="w-4 h-4" />
              <span className="text-[13.5px]">Marktplatz 1</span>
            </div>
          </div>
        </div>

        {/* Kachel 3 - Premium mit allen Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E7E2DA] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <div className="h-[200px] w-full bg-gray-200 relative">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
              alt="SICHTBAR SEO - Simon Kräling" 
              className="w-full h-full object-cover"
            />
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              {/* Premium Label */}
              <div className="bg-[#FFF1E4] text-[#D65F0C] border border-[#FBD9BC] px-2.5 py-1 rounded-md text-[12px] font-bold shadow-sm">
                Premium
              </div>
              
              {/* Rating Badge */}
              <div className="bg-white/95 backdrop-blur-sm border border-[#E7E2DA] px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                <span className="text-[#F2761B] text-[13px]">★</span>
                <span className="font-bold text-[13.5px] text-[#1B211D]">5.0</span>
                <span className="text-[12px] text-[#5F6B63]">(2)</span>
              </div>
            </div>
            
            {/* Logo overlayed at bottom of image */}
            <div className="absolute -bottom-6 left-5">
              <div className="w-[60px] h-[60px] bg-white rounded-xl shadow-md border border-[#E7E2DA] flex items-center justify-center overflow-hidden p-1">
                {/* Placeholder Logo */}
                <div className="w-full h-full bg-[#1B211D] rounded-lg flex items-center justify-center text-white text-[10px] font-bold text-center leading-tight">
                  SICHTBAR<br/>SEO
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-5 pt-9 pb-5 flex flex-col flex-1">
            <span className="text-[11px] font-bold text-[#5F6B63] tracking-wide uppercase mb-1.5 line-clamp-1">
              Dienstleistungen · Marketing & PR
            </span>
            <h3 className="text-[20px] font-bold text-[#1B211D] mb-3 leading-tight">
              SICHTBAR SEO - Simon Kräling
            </h3>
            
            {/* Ranking Badge */}
            <div className="bg-[#FCD34D] text-[#1B211D] px-3 py-2 rounded-lg flex items-center gap-2 mb-4 font-bold text-[13px] shadow-sm">
               <span className="text-[#D97706] text-[16px] leading-none">★</span> PLATZ 1: WINTERBERG
            </div>
            
            {/* Review USP */}
            <div className="inline-flex items-center gap-1.5 bg-[#E8F1EB] border border-[#C5DFCE] text-[#0F4C2E] px-2.5 py-1 rounded-full text-[13px] font-semibold mb-3 w-fit">
              <span className="text-[#F2761B]">✓</span> Kompetente Beratung
            </div>
            
            <p className="text-[14.5px] text-[#4A544D] leading-relaxed mb-4 line-clamp-2">
              Simon Kräling ist Berater für digitale Sichtbarkeit aus Winterberg im Sauerland. Er unters...
            </p>
            
            {/* Tags (Services & Products) */}
            <div className="flex flex-wrap gap-2 mb-5">
              {/* Services (Gray) */}
              <span className="bg-[#FAF8F5] border border-[#E7E2DA] text-[#4A544D] px-2.5 py-1 rounded-md text-[13px]">
                Suchmaschinenoptimierung (SEO)
              </span>
              <span className="bg-[#FAF8F5] border border-[#E7E2DA] text-[#4A544D] px-2.5 py-1 rounded-md text-[13px]">
                Generative Engine Optimization (GEO)
              </span>
              <span className="bg-[#FAF8F5] border border-[#E7E2DA] text-[#4A544D] px-2.5 py-1 rounded-md text-[13px]">
                Digitale Sichtbarkeit
              </span>
              <span className="text-[#8A928B] text-[13px] self-center">+2 weitere</span>
              
              {/* Products (Orange) */}
              <span className="bg-[#FFF8F1] border border-[#FBD9BC] text-[#D65F0C] px-2.5 py-1 rounded-md text-[13px]">
                SEO-Audits
              </span>
              <span className="bg-[#FFF8F1] border border-[#FBD9BC] text-[#D65F0C] px-2.5 py-1 rounded-md text-[13px]">
                GEO-Strategiepläne
              </span>
              <span className="bg-[#FFF8F1] border border-[#FBD9BC] text-[#D65F0C] px-2.5 py-1 rounded-md text-[13px]">
                Content-Pakete
              </span>
              <span className="text-[#8A928B] text-[13px] self-center">+5 weitere</span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-[#E7E2DA] flex items-center gap-2 text-[#8A928B]">
              <MapPin className="w-4 h-4" />
              <span className="text-[13.5px]">Schanzenstraße 28, 59955 Winterberg</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
