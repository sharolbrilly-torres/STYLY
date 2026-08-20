import React from 'react';
import { Sparkles, ArrowRight, Shield, Award, Clock, ChevronRight } from 'lucide-react';
import { useStore } from '../controllers/StoreContext';

export const HeroBannerView: React.FC = () => {
  const { filters, setGender, updateFilter } = useStore();

  return (
    <div className="relative overflow-hidden mb-12 font-serif">
      
      {/* Editorial Split Hero Canvas */}
      <div className="mx-4 sm:mx-6 lg:mx-8 border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-sm bg-white">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[460px]">
          
          {/* SECTION DAMAS - Editorial Pale Rose */}
          <div className="bg-[#FADADD]/20 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20 relative group">
            
            {/* Top Eyebrow */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#f472b6] font-sans font-bold block mb-4">
                Sección Damas • Colección 2026
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-[0.9] text-[#1A1A1A] mb-4">
                Suavidad <br />
                <span className="italic text-[#D4AF37] font-normal">Eterna</span>
              </h1>

              <p className="text-xs font-sans text-gray-600 leading-relaxed max-w-sm">
                Vestidos en seda natural, cortes asimétricos con detalles en hilo dorado genuino y linos suaves para ocasiones memorables.
              </p>
            </div>

            {/* Bottom Featured Piece */}
            <div className="mt-8 pt-6 border-t border-[#FADADD] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => setGender('dama')}
                  className="w-20 h-28 sm:w-24 sm:h-32 bg-[#FADADD] rounded-lg overflow-hidden shadow-md flex-shrink-0 cursor-pointer transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 relative border border-white"
                >
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80"
                    alt="Vestido Seda Dama"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-[#FADADD]/20 pointer-events-none" />
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#f472b6] font-sans font-semibold">Pieza Insignia</span>
                  <p className="text-xs font-sans text-gray-800 font-semibold line-clamp-1">Vestido Gala Seda Pale</p>
                  <p className="text-xs font-sans font-bold text-[#D4AF37] mt-0.5">$185.000 COP</p>
                  <button
                    onClick={() => setGender('dama')}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase font-sans font-bold tracking-widest text-[#1A1A1A] hover:text-[#D4AF37] transition-colors"
                  >
                    <span>Ver Damas</span>
                    <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                  </button>
                </div>
              </div>

              <button
                id="hero-dama-filter-btn"
                onClick={() => setGender('dama')}
                className={`hidden sm:flex px-4 py-2.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-sm ${
                  filters.gender === 'dama'
                    ? 'bg-[#1A1A1A] text-white ring-1 ring-[#D4AF37]'
                    : 'bg-white text-[#1A1A1A] border border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                Explorar Damas
              </button>
            </div>

          </div>

          {/* SECTION CABALLEROS - Deep Olive Green */}
          <div className="bg-[#556B2F] p-8 sm:p-12 flex flex-col justify-between text-white relative group">
            
            {/* Top Eyebrow */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/70 font-sans font-bold block mb-4">
                Sección Caballeros • Sastrería Noble
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-[0.9] text-white mb-4">
                Porte <br />
                <span className="italic text-[#D4AF37] font-normal">Natural</span>
              </h1>

              <p className="text-xs font-sans text-white/80 leading-relaxed max-w-sm">
                Blazers en lino de Normandía, trajes sastre verde oliva con botones en oro mate y camisas de corte impecable.
              </p>
            </div>

            {/* Bottom Featured Piece */}
            <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => setGender('caballero')}
                  className="w-20 h-28 sm:w-24 sm:h-32 bg-[#3D4D22] rounded-lg overflow-hidden shadow-md flex-shrink-0 cursor-pointer transform rotate-2 group-hover:rotate-0 transition-transform duration-500 relative border border-white/20"
                >
                  <img
                    src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80"
                    alt="Chaqueta Versalles Caballero"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-[#556B2F]/20 pointer-events-none" />
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/70 font-sans font-semibold">Pieza Insignia</span>
                  <p className="text-xs font-sans text-white font-semibold line-clamp-1">Chaqueta Versalles Oliva</p>
                  <p className="text-xs font-sans font-bold text-[#D4AF37] mt-0.5">$240.000 COP</p>
                  <button
                    onClick={() => setGender('caballero')}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase font-sans font-bold tracking-widest text-white hover:text-[#D4AF37] transition-colors"
                  >
                    <span>Ver Caballeros</span>
                    <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                  </button>
                </div>
              </div>

              <button
                id="hero-caballero-filter-btn"
                onClick={() => setGender('caballero')}
                className={`hidden sm:flex px-4 py-2.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-sm ${
                  filters.gender === 'caballero'
                    ? 'bg-white text-[#1A1A1A] ring-1 ring-[#D4AF37]'
                    : 'bg-[#3D4D22] text-white border border-white/30 hover:bg-white hover:text-[#1A1A1A]'
                }`}
              >
                Explorar Caballeros
              </button>
            </div>

          </div>

        </div>

        {/* Editorial Guarantee Footer Bar */}
        <div className="bg-[#1A1A1A] text-white border-t border-[#D4AF37]/20 px-6 py-3 font-sans">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-[11px] text-gray-300">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Pagos Seguros (PSE, Nequi, Tarjetas)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#FADADD]" />
              <span>Confección Sartorial de Lujo</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Envíos Nacionales 24-72h</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Asistencia PQRS en Vivo</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

