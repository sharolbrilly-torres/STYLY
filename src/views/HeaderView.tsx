import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X, 
  Truck, 
  LogOut, 
  Settings, 
  Package, 
  MessageSquareHeart,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../controllers/StoreContext';
import { useCart } from '../controllers/CartContext';
import { useAuth } from '../controllers/AuthContext';
import { usePQRS } from '../controllers/PQRSContext';
import { Gender } from '../models/types';

export const HeaderView: React.FC = () => {
  const { 
    filters, 
    setGender, 
    updateFilter, 
    wishlist, 
    activeView, 
    setActiveView 
  } = useStore();
  const { itemCount, openCart } = useCart();
  const { user, isAdmin, openAuthModal, logout, quickLoginAdmin } = useAuth();
  const { toggleChat } = usePQRS();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('searchQuery', searchInput);
    if (activeView !== 'store') setActiveView('store');
  };

  const handleGenderSelect = (gender: Gender) => {
    setGender(gender);
    if (activeView !== 'store') setActiveView('store');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all font-serif">
      {/* Top Editorial Announcement Bar */}
      <div className="bg-[#1A1A1A] text-white text-[11px] py-2 px-4 text-center font-sans tracking-widest uppercase flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Envío Express GRATIS en compras mayores a $150.000 COP</span>
        </span>
        <span className="hidden md:inline-block text-[#D4AF37]">•</span>
        <span className="hidden md:inline-block">Colección Editorial Verde Oliva & Rosa Empolvado</span>
        <span className="hidden lg:inline-block text-[#D4AF37]">•</span>
        <span className="hidden lg:flex items-center gap-1 text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Garantía Sartorial 30 Días</span>
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1A1A1A] hover:text-[#D4AF37] transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - Editorial Style */}
          <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
            <button 
              id="brand-logo-btn"
              onClick={() => {
                setActiveView('store');
                setGender('todos');
              }}
              className="group text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#1A1A1A] font-serif group-hover:text-[#D4AF37] transition-colors">
                  AURA <span className="text-[#D4AF37] italic font-light">&</span> ELEGANCE
                </span>
              </div>
              <p className="text-[9px] tracking-[0.35em] uppercase text-gray-400 font-sans font-medium hidden sm:block">
                Alta Moda • Edición Editorial
              </p>
            </button>
          </div>

          {/* Desktop Navigation Links - Editorial Style */}
          <nav className="hidden lg:flex items-center gap-8 font-sans">
            <button
              id="nav-todos"
              onClick={() => handleGenderSelect('todos')}
              className={`text-xs uppercase tracking-widest py-1 relative transition-colors ${
                filters.gender === 'todos' && activeView === 'store'
                  ? 'text-[#D4AF37] font-bold'
                  : 'text-gray-500 hover:text-[#D4AF37]'
              }`}
            >
              Colección
              {filters.gender === 'todos' && activeView === 'store' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#D4AF37]" />
              )}
            </button>

            <button
              id="nav-dama"
              onClick={() => handleGenderSelect('dama')}
              className={`text-xs uppercase tracking-widest py-1 relative flex items-center gap-1.5 transition-colors ${
                filters.gender === 'dama' && activeView === 'store'
                  ? 'text-[#f472b6] font-bold'
                  : 'text-gray-500 hover:text-[#D4AF37]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FADADD]" />
              Damas
              {filters.gender === 'dama' && activeView === 'store' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FADADD]" />
              )}
            </button>

            <button
              id="nav-caballero"
              onClick={() => handleGenderSelect('caballero')}
              className={`text-xs uppercase tracking-widest py-1 relative flex items-center gap-1.5 transition-colors ${
                filters.gender === 'caballero' && activeView === 'store'
                  ? 'text-[#556B2F] font-bold'
                  : 'text-gray-500 hover:text-[#D4AF37]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#556B2F]" />
              Caballeros
              {filters.gender === 'caballero' && activeView === 'store' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#556B2F]" />
              )}
            </button>

            <button
              id="nav-tracking"
              onClick={() => setActiveView('tracking')}
              className={`text-xs uppercase tracking-widest py-1 relative flex items-center gap-1 transition-colors ${
                activeView === 'tracking'
                  ? 'text-[#D4AF37] font-bold'
                  : 'text-gray-500 hover:text-[#D4AF37]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Rastreo
            </button>

            <button
              id="nav-admin"
              onClick={() => setActiveView('admin')}
              className={`text-xs uppercase tracking-widest py-1 relative flex items-center gap-1 transition-colors ${
                activeView === 'admin'
                  ? 'text-[#D4AF37] font-bold'
                  : 'text-gray-400 hover:text-[#D4AF37]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </nav>

          {/* Search Bar - Editorial Minimal */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100 focus-within:border-[#D4AF37]/50 transition-all">
                <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                <input
                  id="header-search-input"
                  type="text"
                  placeholder="Buscar estilo..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    updateFilter('searchQuery', e.target.value);
                  }}
                  className="bg-transparent text-xs font-sans outline-none w-full text-[#1A1A1A] placeholder-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* PQRS Quick Chat Button */}
            <button
              id="header-pqrs-btn"
              onClick={toggleChat}
              title="Atención al Cliente & PQRS"
              className="p-2 text-gray-600 hover:text-[#D4AF37] rounded-full transition-colors relative"
            >
              <MessageSquareHeart className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => {
                setActiveView('wishlist');
              }}
              title="Favoritos"
              className="p-2 text-gray-600 hover:text-[#f472b6] rounded-full transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-white text-[9px] font-sans font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={openCart}
              className="relative p-2 text-gray-700 hover:text-[#D4AF37] transition-all flex items-center"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-sans px-1.5 py-0.2 rounded-full min-w-[18px] text-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile & Admin Portal */}
            <div className="relative font-sans">
              <button
                id="header-user-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-sans border border-[#D4AF37] text-[#1A1A1A] hover:bg-[#D4AF37] hover:text-white transition-all"
                title={user ? user.displayName : 'Iniciar Sesión'}
              >
                {isAdmin ? (
                  <span className="font-bold">AD</span>
                ) : user ? (
                  <span>{user.displayName.substring(0, 2).toUpperCase()}</span>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">Sesión iniciada como</p>
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-[#D4AF37]/15 text-[#B38E22] text-[10px] font-bold rounded-full uppercase">
                            <ShieldCheck className="w-3 h-3" /> Administrador Master
                          </span>
                        )}
                      </div>

                      <button
                        id="user-menu-admin-btn"
                        onClick={() => setActiveView('admin')}
                        className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[#D4AF37]" />
                        <span>Panel Administrador (Pedidos & PQRS)</span>
                      </button>

                      <button
                        id="user-menu-tracking-btn"
                        onClick={() => setActiveView('tracking')}
                        className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#556B2F]" />
                        <span>Mis Pedidos & Rastreo</span>
                      </button>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        id="user-menu-logout-btn"
                        onClick={() => logout()}
                        className="w-full px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-[#1A1A1A]">Bienvenido a Aura & Elegance</p>
                        <p className="text-[10px] text-gray-400">Inicia sesión para gestionar pedidos</p>
                      </div>

                      <button
                        id="auth-login-btn"
                        onClick={() => openAuthModal('login')}
                        className="w-full px-4 py-2.5 text-left text-xs text-gray-800 hover:bg-gray-50 font-semibold flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-[#D4AF37]" />
                        <span>Iniciar Sesión / Registrarse</span>
                      </button>

                      <div className="border-t border-gray-100 my-1" />

                      {/* Direct Admin Access Helper */}
                      <button
                        id="quick-admin-login-btn"
                        onClick={() => quickLoginAdmin()}
                        className="w-full px-4 py-2.5 text-left text-xs text-[#B38E22] bg-[#FAF8F0] hover:bg-[#F5EED5] flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        <div>
                          <p className="font-semibold text-[11px]">Acceso Admin Instantáneo</p>
                          <p className="text-[10px] text-gray-500">matematicaslzda@gmail.com</p>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-3 animate-in fade-in duration-200 font-sans">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar prendas..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    updateFilter('searchQuery', e.target.value);
                  }}
                  className="w-full bg-gray-50 text-xs text-[#1A1A1A] pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </form>

            <div className="grid grid-cols-3 gap-2 pb-2">
              <button
                onClick={() => handleGenderSelect('todos')}
                className={`py-2 px-3 text-xs uppercase font-medium rounded-full text-center border ${
                  filters.gender === 'todos'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                Colección
              </button>
              <button
                onClick={() => handleGenderSelect('dama')}
                className={`py-2 px-3 text-xs uppercase font-medium rounded-full text-center border ${
                  filters.gender === 'dama'
                    ? 'bg-[#FADADD] text-[#1A1A1A] border-[#FADADD]'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                Damas
              </button>
              <button
                onClick={() => handleGenderSelect('caballero')}
                className={`py-2 px-3 text-xs uppercase font-medium rounded-full text-center border ${
                  filters.gender === 'caballero'
                    ? 'bg-[#556B2F] text-white border-[#556B2F]'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                Caballeros
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setActiveView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 text-left text-xs font-semibold text-[#B38E22] bg-[#FAF8F0] rounded-xl flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Panel Administrador</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('tracking');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 text-left text-xs text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-[#556B2F]" />
                <span>Rastrear Mi Pedido</span>
              </button>

              <button
                onClick={() => {
                  toggleChat();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 text-left text-xs text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2"
              >
                <MessageSquareHeart className="w-4 h-4 text-[#D4AF37]" />
                <span>Chat Asistente PQRS</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
