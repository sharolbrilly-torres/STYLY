import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Palette, 
  Ruler, 
  Shirt, 
  Layers,
  Tag,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../controllers/StoreContext';
import { useAuth } from '../controllers/AuthContext';
import { ProductCategory, CustomStyle } from '../models/types';

const ALL_CATEGORIES: (ProductCategory | 'Todas')[] = [
  'Todas',
  'Vestidos',
  'Trajes & Blazers',
  'Camisas & Tops',
  'Pantalones & Faldas',
  'Prendas de Lino',
  'Calzado Elegante',
  'Accesorios de Lujo'
];

const AVAILABLE_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '38', '40', '42', '44'
];

const AVAILABLE_COLORS = [
  { name: 'Verde Oliva', hex: '#556B2F', label: 'Oliva Sastrería' },
  { name: 'Rosa', hex: '#FADADD', label: 'Rosado Pale' },
  { name: 'Dorado', hex: '#D4AF37', label: 'Dorado Champán' },
  { name: 'Blanco', hex: '#FFFFFF', label: 'Blanco Marfil' },
  { name: 'Negro', hex: '#1A1A1A', label: 'Negro Ébano' }
];

const AVAILABLE_STYLES: CustomStyle[] = [
  'Formal & Gala',
  'Casual Chic',
  'Lino & Verano',
  'Minimalista Urbano',
  'Fiesta & Noche',
  'Sastrería Clásica'
];

interface FilterSidebarViewProps {
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebarView: React.FC<FilterSidebarViewProps> = ({ 
  isMobileDrawer = false, 
  onCloseMobile 
}) => {
  const { 
    filters, 
    updateFilter, 
    toggleSizeFilter, 
    toggleColorFilter, 
    toggleStyleFilter, 
    resetFilters, 
    formatPrice,
    filteredProducts 
  } = useStore();

  const { user, isAdmin } = useAuth();

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    sizes: true,
    colors: true,
    styles: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFiltersCount = 
    (filters.category !== 'Todas' ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    filters.styles.length +
    (filters.onlyOffers ? 1 : 0) +
    (filters.onlyInStock ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <aside className={`bg-white border border-gray-100 p-6 rounded-2xl flex flex-col gap-6 font-sans shadow-xs ${isMobileDrawer ? 'w-full' : 'w-full'}`}>
      
      {/* Filter Header - Editorial Aesthetic */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="text-xs font-bold uppercase tracking-widest font-sans text-[#D4AF37] flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-white text-[9px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </h3>

        {activeFiltersCount > 0 && (
          <button
            id="reset-filters-btn"
            onClick={resetFilters}
            className="text-[10px] text-gray-400 hover:text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        
        {/* 1. Categorías */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans font-semibold"
          >
            <span>Categoría</span>
            {expandedSections.categories ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
          </button>

          {expandedSections.categories && (
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {ALL_CATEGORIES.map(cat => {
                const isSelected = filters.category === cat;
                return (
                  <button
                    key={cat}
                    id={`filter-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => updateFilter('category', cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-sans transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gray-100 text-[#1A1A1A] font-bold border-l-2 border-[#D4AF37]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#1A1A1A]'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Talla (Size) - Editorial Square Buttons */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans font-semibold">Talla</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map(size => {
              const isSelected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  id={`filter-size-${size.toLowerCase()}`}
                  onClick={() => toggleSizeFilter(size)}
                  className={`w-8 h-8 text-[10px] flex items-center justify-center font-sans transition-all border ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-white font-bold shadow-xs'
                      : 'border-gray-200 text-gray-700 bg-white hover:border-[#D4AF37]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Color - Editorial Swatches */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans font-semibold">Color</p>
          <div className="flex items-center gap-3">
            {AVAILABLE_COLORS.map(color => {
              const isSelected = filters.colors.includes(color.name);
              return (
                <button
                  key={color.name}
                  id={`filter-color-${color.name.toLowerCase()}`}
                  onClick={() => toggleColorFilter(color.name)}
                  title={color.label}
                  className={`w-5 h-5 rounded-full border cursor-pointer shadow-xs transition-all relative ${
                    isSelected
                      ? 'ring-2 ring-[#D4AF37] ring-offset-2 scale-110 border-transparent'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${color.name === 'Blanco' || color.name === 'Rosa' ? 'bg-[#1A1A1A]' : 'bg-white'}`} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Estilo - Checkboxes */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans font-semibold">Estilo</p>
          <div className="space-y-1.5">
            {AVAILABLE_STYLES.map(style => {
              const isSelected = filters.styles.includes(style);
              return (
                <label 
                  key={style}
                  className="flex items-center text-xs font-sans text-gray-600 hover:text-[#1A1A1A] cursor-pointer"
                >
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => toggleStyleFilter(style)}
                    className="mr-2 accent-[#D4AF37] w-3.5 h-3.5 rounded"
                  />
                  <span>{style}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 5. Rango de Precio */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-sans font-semibold">Precio</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600 font-sans">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span className="font-bold text-[#1A1A1A]">{formatPrice(filters.priceRange[1])}</span>
            </div>
            <input
              id="filter-price-slider"
              type="range"
              min="100000"
              max="800000"
              step="20000"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
          </div>
        </div>

        {/* 6. Quick Switches */}
        <div className="pt-2 border-t border-gray-100 space-y-1.5">
          <label className="flex items-center justify-between cursor-pointer text-xs text-gray-600 hover:text-[#1A1A1A]">
            <span>En Oferta</span>
            <input
              id="filter-offers-toggle"
              type="checkbox"
              checked={filters.onlyOffers}
              onChange={(e) => updateFilter('onlyOffers', e.target.checked)}
              className="accent-[#D4AF37] w-3.5 h-3.5 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer text-xs text-gray-600 hover:text-[#1A1A1A]">
            <span>Disponibilidad Inmediata</span>
            <input
              id="filter-stock-toggle"
              type="checkbox"
              checked={filters.onlyInStock}
              onChange={(e) => updateFilter('onlyInStock', e.target.checked)}
              className="accent-[#D4AF37] w-3.5 h-3.5 rounded"
            />
          </label>
        </div>

      </div>

      {/* Admin Session & Firebase Connection Box */}
      <div className="mt-auto p-4 bg-gray-50 rounded-xl border border-gray-100 font-sans">
        <p className="text-[9px] font-sans text-gray-400 mb-1 uppercase tracking-widest font-semibold">Admin Session</p>
        <p className="text-[10px] font-sans font-bold text-gray-700 truncate">
          {user ? user.email : 'matematicaslzda@gmail.com'}
        </p>
        <div className="flex items-center mt-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          <span className="text-[9px] font-sans text-gray-500 uppercase tracking-wider">Firebase Connected</span>
        </div>
      </div>

      {/* Mobile Drawer Action */}
      {isMobileDrawer && (
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={onCloseMobile}
            className="w-full py-2.5 bg-[#1A1A1A] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-[#D4AF37] transition-colors"
          >
            Ver {filteredProducts.length} Resultados
          </button>
        </div>
      )}

    </aside>
  );
};

