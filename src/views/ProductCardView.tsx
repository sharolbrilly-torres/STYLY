import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product, ProductColor } from '../models/types';
import { useStore } from '../controllers/StoreContext';
import { useCart } from '../controllers/CartContext';

interface ProductCardViewProps {
  product: Product;
}

export const ProductCardView: React.FC<ProductCardViewProps> = ({ product }) => {
  const { setSelectedProduct, formatPrice, toggleWishlist, isInWishlist } = useStore();
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer bg-white rounded-xl border border-gray-100 hover:border-[#D4AF37] hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative shadow-xs"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] bg-[#FAFAFA] overflow-hidden">
        
        {/* Main Image */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 font-sans">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-xs">
              Nuevo
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-[#D4AF37] text-white text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-xs">
              Insignia
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-[#f472b6] text-white text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Gender Pill Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10 font-sans">
          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md ${
            product.gender === 'dama'
              ? 'bg-[#FADADD]/90 text-[#1A1A1A] border border-white'
              : product.gender === 'caballero'
              ? 'bg-[#556B2F]/90 text-white border border-white/30'
              : 'bg-white/90 text-[#1A1A1A]'
          }`}>
            {product.gender === 'dama' ? 'Dama' : product.gender === 'caballero' ? 'Caballero' : 'Unisex'}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-xs ${
            isFavorited 
              ? 'bg-[#f472b6] text-white' 
              : 'bg-white/80 text-gray-500 hover:text-[#f472b6] hover:bg-white'
          }`}
          aria-label="Guardar en favoritos"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center font-sans">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-3.5 py-1.5 bg-white/95 hover:bg-white text-[#1A1A1A] text-[10px] font-bold rounded-full shadow-xs flex items-center gap-1.5 tracking-wider uppercase backdrop-blur-sm transition-all"
          >
            <Eye className="w-3 h-3 text-[#D4AF37]" />
            <span>Vista Rápida</span>
          </button>
        </div>

      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        
        <div className="space-y-1">
          
          {/* Style & Rating */}
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
              {product.style}
            </span>
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="text-[10px] font-bold text-gray-800">{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Subtitle */}
          {product.subtitle && (
            <p className="text-[10px] text-gray-400 line-clamp-1 italic font-serif">
              {product.subtitle}
            </p>
          )}

        </div>

        {/* Color Swatches & Sizes in one row */}
        <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            {product.colors.map(col => {
              const isSelected = selectedColor.name === col.name;
              return (
                <button
                  key={col.name}
                  title={col.name}
                  onClick={() => setSelectedColor(col)}
                  className={`w-3.5 h-3.5 rounded-full transition-all border ${
                    isSelected 
                      ? 'ring-1.5 ring-[#D4AF37] ring-offset-1 scale-110' 
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            {product.sizes.slice(0, 3).map(size => (
              <span key={size} className="text-[9px] font-sans font-medium text-gray-400 bg-gray-50 px-1 py-0.5 rounded border border-gray-100">
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Quick Add Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 font-sans">
          
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] block">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through block">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            id={`quick-add-btn-${product.id}`}
            onClick={handleQuickAdd}
            className={`p-2 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider shadow-xs ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-50 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-gray-200'
            }`}
            title="Añadir a la bolsa"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline-block">¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline-block">Bolsa</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};

