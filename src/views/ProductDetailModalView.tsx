import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Check, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Ruler, 
  RotateCcw,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../controllers/StoreContext';
import { useCart } from '../controllers/CartContext';
import { ProductColor } from '../models/types';

export const ProductDetailModalView: React.FC = () => {
  const { selectedProduct, setSelectedProduct, formatPrice, toggleWishlist, isInWishlist } = useStore();
  const { addToCart } = useCart();

  if (!selectedProduct) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(selectedProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(selectedProduct.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(selectedProduct.id);

  const discountPercent = selectedProduct.originalPrice 
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setSelectedProduct(null);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden z-10 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-[#2F3E2B] rounded-full shadow-md backdrop-blur-md z-20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E8E2D8]">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-top"
                />

                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#B85D6F] text-white text-xs font-bold rounded-full shadow-sm">
                    Ahorras {discountPercent}%
                  </div>
                )}
              </div>

              {/* Thumbnail Selector */}
              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx 
                          ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30' 
                          : 'border-[#E8E2D8] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Guarantees Box */}
              <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E8E2D8] space-y-2.5 text-xs text-[#5C645A]">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>Envío asegurado a toda Colombia con número de guía</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-[#E5A99C]" />
                  <span>30 días para cambios de talla o prenda sin complicaciones</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#3F523A]" />
                  <span>Garantía de confección y autenticidad en materiales</span>
                </div>
              </div>

            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                
                {/* Header tags & Rating */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedProduct.gender === 'dama'
                      ? 'bg-[#F8E8E5] text-[#8C3A4D] border border-[#E5A99C]'
                      : 'bg-[#3F523A]/15 text-[#2F3E2B] border border-[#3F523A]/30'
                  }`}>
                    {selectedProduct.gender === 'dama' ? 'Colección Dama' : 'Colección Caballero'} • {selectedProduct.category}
                  </span>

                  <div className="flex items-center gap-1 text-[#C5A059]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-[#1C201C]">{selectedProduct.rating}</span>
                    <span className="text-xs text-[#8E978C]">({selectedProduct.reviewsCount} reseñas)</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C201C] leading-snug">
                    {selectedProduct.name}
                  </h1>
                  {selectedProduct.subtitle && (
                    <p className="text-xs sm:text-sm text-[#7A8C74] italic font-serif mt-1">
                      {selectedProduct.subtitle}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1C201C]">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-base text-[#8E978C] line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    IVA Incluido
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5C645A] leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Color Selector */}
                <div className="space-y-2 pt-2 border-t border-[#F0EBE1]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1C201C]">Color Seleccionado:</span>
                    <span className="text-[#7A8C74] font-medium">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {selectedProduct.colors.map(col => {
                      const isSelected = selectedColor.name === col.name;
                      return (
                        <button
                          key={col.name}
                          onClick={() => setSelectedColor(col)}
                          className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                            isSelected
                              ? 'border-[#C5A059] bg-[#FAF6F0] font-semibold text-[#1C201C] ring-2 ring-[#C5A059]/20'
                              : 'border-[#E8E2D8] hover:border-[#C5A059] text-[#5C645A]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selector + Size Guide */}
                <div className="space-y-2 pt-2 border-t border-[#F0EBE1]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1C201C]">Talla / Medida:</span>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{showSizeGuide ? 'Ocultar guía' : 'Guía de tallas'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(size => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-[#2F3E2B] text-[#FAF7F2] border-[#2F3E2B] shadow-sm ring-2 ring-[#C5A059]/30'
                              : 'bg-[#FAF8F5] text-[#5C645A] border-[#E8E2D8] hover:border-[#C5A059]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Size Guide Accordion */}
                  {showSizeGuide && (
                    <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#DFD7CB] text-xs text-[#5C645A] space-y-2 animate-in fade-in duration-150">
                      <p className="font-semibold text-[#2F3E2B]">Tabla de Medidas Anatómicas (cm):</p>
                      <div className="grid grid-cols-4 gap-2 text-[11px] text-center font-medium bg-white p-2 rounded-lg border border-[#E8E2D8]">
                        <div>Talla</div>
                        <div>Busto/Pecho</div>
                        <div>Cintura</div>
                        <div>Cadera</div>
                        <div className="font-bold text-[#3F523A]">S / 38</div>
                        <div>88-92 cm</div>
                        <div>70-74 cm</div>
                        <div>94-98 cm</div>
                        <div className="font-bold text-[#3F523A]">M / 40</div>
                        <div>94-98 cm</div>
                        <div>76-80 cm</div>
                        <div>100-104 cm</div>
                        <div className="font-bold text-[#3F523A]">L / 42</div>
                        <div>100-104 cm</div>
                        <div>82-86 cm</div>
                        <div>106-110 cm</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stock Indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-800 font-medium">
                    En inventario ({selectedProduct.stockCount} unidades disponibles)
                  </span>
                </div>

              </div>

              {/* Quantity & Add to Cart Section */}
              <div className="pt-4 border-t border-[#F0EBE1] space-y-3">
                <div className="flex items-center gap-3">
                  
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#DFD7CB] rounded-2xl bg-[#FAF8F5] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-[#F0EBE1] text-[#1C201C] font-bold text-sm transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-[#1C201C]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stockCount, quantity + 1))}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-[#F0EBE1] text-[#1C201C] font-bold text-sm transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#3F523A] hover:bg-[#2F3E2B] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Prenda Añadida!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                        <span>Añadir a la Bolsa • {formatPrice(selectedProduct.price * quantity)}</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isFavorited
                        ? 'bg-[#B85D6F] text-white border-[#B85D6F]'
                        : 'bg-[#FAF8F5] text-[#5C645A] border-[#DFD7CB] hover:border-[#B85D6F]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>

                </div>

                {/* Tabbed Info */}
                <div className="pt-2">
                  <div className="flex border-b border-[#F0EBE1] text-xs">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`pb-2 px-3 font-semibold border-b-2 transition-all ${
                        activeTab === 'details' ? 'border-[#C5A059] text-[#2F3E2B]' : 'border-transparent text-[#7A8C74]'
                      }`}
                    >
                      Detalles de Confección
                    </button>
                    <button
                      onClick={() => setActiveTab('fabric')}
                      className={`pb-2 px-3 font-semibold border-b-2 transition-all ${
                        activeTab === 'fabric' ? 'border-[#C5A059] text-[#2F3E2B]' : 'border-transparent text-[#7A8C74]'
                      }`}
                    >
                      Composición & Cuidado
                    </button>
                  </div>

                  <div className="pt-3 text-xs text-[#5C645A]">
                    {activeTab === 'details' && (
                      <ul className="space-y-1 list-disc list-inside">
                        {selectedProduct.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                    {activeTab === 'fabric' && (
                      <div className="space-y-1.5">
                        <p><strong className="text-[#1C201C]">Tejido Principal:</strong> {selectedProduct.fabric}</p>
                        {selectedProduct.careInstructions && (
                          <p><strong className="text-[#1C201C]">Instrucciones de Lavado:</strong> {selectedProduct.careInstructions}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
