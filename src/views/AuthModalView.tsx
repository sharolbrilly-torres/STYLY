import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  LogOut, 
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../controllers/AuthContext';
import { useStore } from '../controllers/StoreContext';
import { ADMIN_EMAIL } from '../models/userModel';

export const AuthModalView: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithEmail, 
    registerWithEmail, 
    quickLoginAdmin, 
    logout 
  } = useAuth();
  const { setActiveView } = useStore();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (tab === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name, phone);
      }
      closeAuthModal();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al procesar autenticación. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminQuickFill = async () => {
    setEmail(ADMIN_EMAIL);
    setPassword('1234567890');
    setIsLoading(true);
    try {
      await quickLoginAdmin();
      closeAuthModal();
      setActiveView('admin');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden z-10">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#7A8C74] hover:bg-[#FAF8F5] rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in, show User Card */}
        {user ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border-2 border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059] shadow-sm">
              <User className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1C201C]">
                {user.displayName}
              </h3>
              <p className="text-xs text-[#7A8C74]">{user.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-[#3F523A] text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  Administrador Master
                </span>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#F0EBE1]">
              {isAdmin && (
                <button
                  onClick={() => {
                    closeAuthModal();
                    setActiveView('admin');
                  }}
                  className="w-full py-3 bg-[#3F523A] hover:bg-[#2F3E2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Abrir Panel Administrador</span>
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  closeAuthModal();
                }}
                className="w-full py-3 bg-[#FAF8F5] text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl border border-[#DFD7CB] transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Forms */
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="text-center space-y-1">
              <span className="font-serif text-sm tracking-widest uppercase text-[#C5A059] font-bold">
                Aura & Elegance
              </span>
              <h2 className="font-serif text-2xl font-semibold text-[#1C201C]">
                {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Exclusiva'}
              </h2>
              <p className="text-xs text-[#7A8C74]">
                Guarda tus prendas favoritas, rastrea tus compras y accede a beneficios VIP.
              </p>
            </div>

            {/* Quick Master Admin Login Button */}
            <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#C5A059]/40 text-xs space-y-2">
              <div className="flex items-center justify-between text-[#8F6F27] font-bold">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#C5A059]" />
                  Acceso Rápido Administrador:
                </span>
                <span className="text-[10px] uppercase bg-white px-2 py-0.5 rounded border border-[#C5A059]/40">
                  {ADMIN_EMAIL}
                </span>
              </div>
              <button
                type="button"
                id="quick-admin-login-btn"
                onClick={handleAdminQuickFill}
                disabled={isLoading}
                className="w-full py-2 bg-[#2F3E2B] hover:bg-[#3F523A] text-[#FAF7F2] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Ingresar como Administrador (1234567890)</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#F0EBE1] text-xs">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 pb-2.5 font-semibold text-center border-b-2 transition-all ${
                  tab === 'login' ? 'border-[#3F523A] text-[#2F3E2B]' : 'border-transparent text-[#7A8C74]'
                }`}
              >
                Ya tengo cuenta
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 pb-2.5 font-semibold text-center border-b-2 transition-all ${
                  tab === 'register' ? 'border-[#3F523A] text-[#2F3E2B]' : 'border-transparent text-[#7A8C74]'
                }`}
              >
                Registrarme
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {tab === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#2F3E2B]">Nombre Completo *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ej: Laura Morales"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DFD7CB] text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                      />
                      <User className="w-4 h-4 text-[#8E978C] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#2F3E2B]">Teléfono Celular</label>
                    <input
                      type="tel"
                      placeholder="Ej: 310 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#DFD7CB] text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-[#2F3E2B]">Correo Electrónico *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DFD7CB] text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                  <Mail className="w-4 h-4 text-[#8E978C] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2F3E2B]">Contraseña *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DFD7CB] text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                  <Lock className="w-4 h-4 text-[#8E978C] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {errorMsg && (
                <p className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#3F523A] hover:bg-[#2F3E2B] text-white font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              >
                <span>{isLoading ? 'Verificando...' : tab === 'login' ? 'Entrar a mi Cuenta' : 'Completar Registro'}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
