import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  X, 
  Frown, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../controllers/StoreContext';
import { ProductCardView } from './ProductCardView';
import { FilterSidebarView } from './FilterSidebarView';

export const ProductGridView: React.FC = () => {
  const { 
    filteredProducts, 
    filters, 
    updateFilter, 
    toggleSizeFilter, 
    toggleColorFilter, 
    toggleStyleFilter, 
    resetFilters, 
    isLoadingProducts 
  } = useStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilters = [
    ...(filters.category !== 'Todas' ? [{ label: `Categoría: ${filters.category}`, clear: () => updateFilter('category', 'Todas') }] : []),
    ...filters.sizes.map(s => ({ label: `Talla: ${s}`, clear: () => toggleSizeFilter(s) })),
    ...filters.colors.map(c => ({ label: `Color: ${c}`, clear: () => toggleColorFilter(c) })),
    ...filters.styles.map(st => ({ label: `Estilo: ${st}`, clear: () => toggleStyleFilter(st) })),
    ...(filters.searchQuery ? [{ label: `Búsqueda: "${filters.searchQuery}"`, clear: () => updateFilter('searchQuery', '') }] : []),
    ...(filters.onlyOffers ? [{ label: 'En Oferta', clear: () => updateFilter('onlyOffers', false) }] : []),
    ...(filters.onlyInStock ? [{ label: 'En Stock', clear: () => updateFilter('onlyInStock', false) }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 font-serif">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        
        {/* Results Count & Title */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A1A1A]">
              {filters.gender === 'dama' 
                ? 'Colección Dama' 
                : filters.gender === 'caballero' 
                ? 'Sastrería Caballero' 
                : 'Catálogo de Temporada'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-sans font-bold uppercase tracking-widest text-[#D4AF37]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'pieza' : 'piezas'}
            </span>
          </div>
          <p className="text-xs font-sans text-gray-400 mt-1">
            Confecciones exclusivas en lino francés, seda natural y cortes anatómicos de alta sastrería.
          </p>
        </div>

        {/* Action Controls: Mobile Filters Button & Sort By */}
        <div className="flex items-center gap-3 font-sans">
          
          {/* Mobile Filter Button */}
          <button
            id="mobile-filter-trigger-btn"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-[#1A1A1A] shadow-xs hover:border-[#D4AF37]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Filtros</span>
            {activeFilters.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-white text-[9px] flex items-center justify-center font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 shadow-xs text-xs text-[#1A1A1A]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <label htmlFor="sort-select" className="hidden sm:inline-block font-medium text-gray-400">Ordenar:</label>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="bg-transparent font-semibold text-[#1A1A1A] focus:outline-none cursor-pointer"
            >
              <option value="featured">Destacados & Recomendados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificados</option>
              <option value="newest">Llegadas Recientes</option>
            </select>
          </div>

        </div>

      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4 font-sans">
          <span className="text-xs text-gray-400 font-medium">Activos:</span>
          {activeFilters.map((f, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 text-[#1A1A1A] text-xs rounded-full font-medium shadow-2xs"
            >
              <span>{f.label}</span>
              <button
                onClick={f.clear}
                className="text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetFilters}
            className="text-xs text-[#D4AF37] hover:underline font-semibold ml-2"
          >
            Limpiar todos
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
        
        {/* Desktop Sidebar (1 Column) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28">
            <FilterSidebarView />
          </div>
        </div>

        {/* Product Grid (3 Columns) */}
        <div className="lg:col-span-3">
          
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse space-y-4">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-6 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCardView key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto text-[#D4AF37]">
                <Frown className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1A1A1A]">
                No encontramos piezas con estos filtros
              </h3>
              <p className="text-xs sm:text-sm font-sans text-gray-500 max-w-md mx-auto">
                Prueba seleccionando otras tallas, explorando la paleta de Verde Oliva, Rosado o Dorado, o restablece los filtros para disfrutar del catálogo completo.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-sans font-bold uppercase tracking-widest rounded-full shadow hover:bg-[#D4AF37] transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex font-sans">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-sm bg-white h-full overflow-y-auto p-4 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">Filtros de Búsqueda</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="pt-4">
                <FilterSidebarView isMobileDrawer onCloseMobile={() => setMobileFiltersOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
