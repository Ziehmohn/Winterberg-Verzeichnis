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

      </div>
    </div>
  );
}
