import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart, 
  Lock, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Instagram,
  Facebook
} from 'lucide-react';
import { useStore } from '../controllers/StoreContext';
import { useAuth } from '../controllers/AuthContext';
import { usePQRS } from '../controllers/PQRSContext';
import { ADMIN_EMAIL } from '../models/userModel';

export const FooterView: React.FC = () => {
  const { setActiveView, updateFilter } = useStore();
  const { openAuthModal } = useAuth();
  const { toggleChat } = usePQRS();

  return (
    <footer className="bg-[#1C261A] text-[#FAF7F2] border-t border-[#C5A059]/30 pt-16 pb-12">
      
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#E5C378]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-sm text-[#FAF7F2]">Envíos a Toda Colombia</h4>
              <p className="text-xs text-[#B5C2B1] mt-1">
                Gratis por compras superiores a $150.000 COP con empaque de lujo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#E5A99C]/15 border border-[#E5A99C]/40 text-[#E5A99C]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-sm text-[#FAF7F2]">Cambios Sin Costo</h4>
              <p className="text-xs text-[#B5C2B1] mt-1">
                30 días para cambio de talla o prenda en nuestras boutiques o por mensajería.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#E5C378]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-sm text-[#FAF7F2]">Tejidos de Alta Gama</h4>
              <p className="text-xs text-[#B5C2B1] mt-1">
                Seda natural, lino europeo, algodón egipcio y lana merino certificada.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#3F523A]/50 border border-white/20 text-[#FAF7F2]">
              <Lock className="w-6 h-6 text-[#E5C378]" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-sm text-[#FAF7F2]">Pagos 100% Protegidos</h4>
              <p className="text-xs text-[#B5C2B1] mt-1">
                Pasarelas certificadas PSE, Tarjetas de Crédito, Nequi y Contra Entrega.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col (2 cols on large) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#3F523A] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-[#FAF7F2]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-[#FAF7F2]">
                Aura & Elegance
              </span>
            </div>
            <p className="text-xs text-[#B5C2B1] leading-relaxed max-w-sm">
              Casa de alta moda contemporánea especializada en sastrería refinada para caballero y siluetas sofisticadas para dama. Una paleta distinguida de verde oliva, rosa empolvado, lino y destellos dorados.
            </p>
            <div className="space-y-1.5 text-xs text-[#D7DFD5] pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>Boutique Principal: Cra 11 # 82-71, Zona Rosa, Bogotá</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>Atención VIP: +57 (601) 745 8890 | WhatsApp +57 312 456 7890</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>Contacto Directo: contacto@auraelegance.com</span>
              </p>
            </div>
          </div>

          {/* Col 2: Colecciones Dama */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm font-semibold text-[#E5A99C] uppercase tracking-wider">
              Colección Dama
            </h4>
            <ul className="space-y-2 text-[#B5C2B1]">
              <li>
                <button
                  onClick={() => {
                    updateFilter('gender', 'dama');
                    updateFilter('category', 'Vestidos');
                    setActiveView('store');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Vestidos de Gala & Seda
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    updateFilter('gender', 'dama');
                    updateFilter('category', 'Trajes & Blazers');
                    setActiveView('store');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Blazers Rosa & Oliva
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    updateFilter('gender', 'dama');
                    updateFilter('category', 'Prendas de Lino');
                    setActiveView('store');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Conjuntos de Lino Fino
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    updateFilter('gender', 'dama');
                    updateFilter('category', 'Calzado Elegante');
                    setActiveView('store');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Zapatillas & Sandalias Doradas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Colecciones Caballero */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm font-semibold text-[#A4BA9D] uppercase tracking-wider">
              Colección Caballero
            </h4>
            <ul className="space-y-2 text-[#B5C2B1]">
              <li>
                <button
                  onClick={() => {
                    updateFilter('gender', 'caballero');
                    updateFilter('category', 'Trajes & Blazers');
                    setActiveView('store');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Trajes Sastrería Verde Oliva
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    updateFilter('gender', 'caballero');
                    updateFilter('category', 'Camisas & Tops');
                    setActiveView('store');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Camisas Lino & Cuello Nerú
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    updateFilter('gender', 'caballero');
                    updateFilter('category', 'Pantalones & Faldas');
                    setActiveView('store');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Pantalones Sartoriales Plisados
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    updateFilter('gender', 'caballero');
                    updateFilter('category', 'Calzado Elegante');
                    setActiveView('store');
                  }}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Mocasines & Oxfords de Cuero
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Atención & Administración */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm font-semibold text-[#E5C378] uppercase tracking-wider">
              Atención & Admin
            </h4>
            <ul className="space-y-2 text-[#B5C2B1]">
              <li>
                <button
                  onClick={() => setActiveView('tracking')}
                  className="hover:text-[#FAF7F2] transition-colors font-medium text-[#FAF7F2]"
                >
                  📦 Rastrear mi Pedido
                </button>
              </li>
              <li>
                <button
                  onClick={toggleChat}
                  className="hover:text-[#FAF7F2] transition-colors text-[#E5A99C] font-semibold"
                >
                  💬 Mini Chat PQRS
                </button>
              </li>
              <li>
                <button
                  onClick={openAuthModal}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Mi Cuenta de Usuario
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-[#FAF7F2] transition-colors text-[#E5C378] font-bold"
                >
                  🛡️ Panel Administrador
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E9E8A]">
        <div>
          © {new Date().getFullYear()} Aura & Elegance S.A.S. Todos los derechos reservados. NIT 901.458.912-3.
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] font-bold text-white">PSE</span>
          <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] font-bold text-white">VISA</span>
          <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] font-bold text-white">MASTERCARD</span>
          <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] font-bold text-[#E5A99C]">NEQUI</span>
          <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] font-bold text-emerald-400">CONTRA ENTREGA</span>
        </div>
      </div>

    </footer>
  );
};
