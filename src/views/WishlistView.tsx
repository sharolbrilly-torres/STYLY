import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useStore } from '../controllers/StoreContext';
import { ProductCardView } from './ProductCardView';

export const WishlistView: React.FC = () => {
  const { wishlistProducts, setActiveView } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-6">
        <div>
          <button
            onClick={() => setActiveView('store')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3F523A] hover:text-[#2F3E2B] mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Tienda</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C201C] flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-[#B85D6F] fill-current" />
            <span>Mis Prendas Favoritas</span>
          </h1>
          <p className="text-xs text-[#7A8C74] mt-1">
            Tienes {wishlistProducts.length} {wishlistProducts.length === 1 ? 'pieza guardada' : 'piezas guardadas'} en tu lista de deseos.
          </p>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E2D8] p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#B85D6F]">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-[#1C201C]">
            Tu lista de deseos está vacía
          </h3>
          <p className="text-xs text-[#7A8C74]">
            Explora las colecciones para dama y caballero y haz clic en el corazón para guardar tus prendas favoritas.
          </p>
          <button
            onClick={() => setActiveView('store')}
            className="px-6 py-2.5 bg-[#3F523A] hover:bg-[#2F3E2B] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow transition-all"
          >
            Descubrir Colecciones
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <ProductCardView key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
