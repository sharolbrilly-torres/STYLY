import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  ArrowLeft, 
  Lock, 
  Sparkles,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../controllers/CartContext';
import { useStore } from '../controllers/StoreContext';
import { useAuth } from '../controllers/AuthContext';
import { createOrder } from '../models/orderModel';
import { Order, PaymentMethod, ShippingAddress } from '../models/types';

export const CheckoutModalView: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    cartItems, 
    subtotal, 
    shippingFee, 
    discount, 
    couponCode, 
    total, 
    clearCart 
  } = useCart();
  const { formatPrice, setActiveView } = useStore();
  const { user } = useAuth();

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Form State: Shipping Address
  const [shippingData, setShippingData] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    documentId: '1020304050',
    email: user?.email || '',
    phone: user?.phone || '+57 310 123 4567',
    address: 'Calle 100 # 19A-40',
    apartment: 'Apto 402',
    city: 'Bogotá',
    department: 'Cundinamarca',
    postalCode: '110111',
    notes: 'Entregar en conserjería'
  });

  // Form State: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardData, setCardData] = useState({
    number: '4532 8821 9023 4512',
    name: user?.displayName || 'VALENTINA RESTREPO',
    expiry: '08/29',
    cvc: '782'
  });
  const [selectedBank, setSelectedBank] = useState('Bancolombia');
  const [nequiPhone, setNequiPhone] = useState('310 123 4567');

  if (!isCheckoutOpen) return null;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.fullName || !shippingData.email || !shippingData.address || !shippingData.city) {
      alert('Por favor completa todos los campos requeridos de envío.');
      return;
    }
    setStep('payment');
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      const order = await createOrder({
        customerId: user?.uid,
        shippingAddress: shippingData,
        items: cartItems,
        subtotal,
        shippingFee,
        discount,
        couponCode: couponCode || undefined,
        total,
        paymentMethod,
        paymentReference: paymentMethod === 'card' 
          ? `TXN-CARD-${Date.now().toString().slice(-6)}`
          : paymentMethod === 'pse'
          ? `PSE-${selectedBank.toUpperCase()}-${Date.now().toString().slice(-6)}`
          : paymentMethod === 'nequi'
          ? `NEQUI-${Date.now().toString().slice(-6)}`
          : `COD-PENDING`
      });

      setCompletedOrder(order);
      clearCart();
      setStep('success');

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A059', '#3F523A', '#E5A99C', '#FAF7F2']
      });
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Hubo un problema procesando la orden. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (step !== 'success') closeCheckout();
        }}
      />

      {/* Checkout Window */}
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden z-10 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                onClick={() => setStep('shipping')}
                className="p-1.5 hover:bg-[#EAE5DC] rounded-full text-[#5C645A]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#1C201C]">
                {step === 'shipping' && 'Paso 1: Datos de Envío & Entrega'}
                {step === 'payment' && 'Paso 2: Método de Pago Seguro'}
                {step === 'success' && '¡Orden Confirmada con Éxito! 🎉'}
              </h2>
              <p className="text-[11px] text-[#7A8C74]">
                Aura & Elegance • Pasarela Cifrada 256-bit SSL
              </p>
            </div>
          </div>

          {step !== 'success' && (
            <button
              onClick={closeCheckout}
              className="p-1.5 text-[#5C645A] hover:bg-[#EAE5DC] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          
          {/* ================= STEP 1: SHIPPING ================= */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#2F3E2B]">Nombre y Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Valentina Restrepo"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2F3E2B]">Cédula / Documento de Identidad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 1020304050"
                    value={shippingData.documentId}
                    onChange={(e) => setShippingData({ ...shippingData, documentId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2F3E2B]">Teléfono Celular *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 312 456 7890"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#2F3E2B]">Correo Electrónico para Factura y Guía *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ej: cliente@correo.com"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#2F3E2B]">Dirección de Envío Completa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Calle 93 # 14-20, Apto 502"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2F3E2B]">Ciudad / Municipio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Bogotá, Medellín, Cali..."
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2F3E2B]">Departamento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Cundinamarca, Antioquia..."
                    value={shippingData.department}
                    onChange={(e) => setShippingData({ ...shippingData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#2F3E2B]">Indicaciones de Entrega (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Dejar en portería o tocar timbre 402"
                    value={shippingData.notes}
                    onChange={(e) => setShippingData({ ...shippingData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none"
                  />
                </div>

              </div>

              {/* Order Summary Recap */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D8] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#7A8C74]">{cartItems.length} prendas en tu bolsa</p>
                  <p className="text-base font-bold text-[#1C201C]">Total: {formatPrice(total)}</p>
                </div>
                <button
                  type="submit"
                  className="py-3 px-6 bg-[#3F523A] hover:bg-[#2F3E2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Continuar al Pago</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-[#C5A059]" />
                </button>
              </div>

            </form>
          )}

          {/* ================= STEP 2: PAYMENT ================= */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Payment Methods Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                <button
                  id="pay-method-card"
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'bg-[#FAF6F0] border-[#C5A059] shadow-sm text-[#2F3E2B] ring-2 ring-[#C5A059]/20'
                      : 'border-[#E8E2D8] hover:bg-[#FAF8F5] text-[#5C645A]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#C5A059]" />
                  <span className="text-xs font-semibold">Tarjeta Crédito/Débito</span>
                </button>

                <button
                  id="pay-method-pse"
                  type="button"
                  onClick={() => setPaymentMethod('pse')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'pse'
                      ? 'bg-[#FAF6F0] border-[#C5A059] shadow-sm text-[#2F3E2B] ring-2 ring-[#C5A059]/20'
                      : 'border-[#E8E2D8] hover:bg-[#FAF8F5] text-[#5C645A]'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-[#3F523A]" />
                  <span className="text-xs font-semibold">PSE Bancario</span>
                </button>

                <button
                  id="pay-method-nequi"
                  type="button"
                  onClick={() => setPaymentMethod('nequi')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'nequi'
                      ? 'bg-[#FAF6F0] border-[#C5A059] shadow-sm text-[#2F3E2B] ring-2 ring-[#C5A059]/20'
                      : 'border-[#E8E2D8] hover:bg-[#FAF8F5] text-[#5C645A]'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#B85D6F]" />
                  <span className="text-xs font-semibold">Nequi / Daviplata</span>
                </button>

                <button
                  id="pay-method-contraentrega"
                  type="button"
                  onClick={() => setPaymentMethod('contraentrega')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'contraentrega'
                      ? 'bg-[#FAF6F0] border-[#C5A059] shadow-sm text-[#2F3E2B] ring-2 ring-[#C5A059]/20'
                      : 'border-[#E8E2D8] hover:bg-[#FAF8F5] text-[#5C645A]'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-semibold">Contra Entrega</span>
                </button>

              </div>

              {/* METHOD 1: CREDIT CARD */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  {/* Luxury 3D Card Simulation */}
                  <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-tr from-[#1C261A] via-[#354530] to-[#5A3840] text-white p-5 shadow-xl flex flex-col justify-between overflow-hidden border border-[#C5A059]/30">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold tracking-widest text-[#E5C378]">AURA & ELEGANCE VIP</span>
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    </div>
                    <div className="w-10 h-7 rounded-md bg-[#C5A059]/60 border border-[#FAF7F2]/40" />
                    <div>
                      <p className="font-mono text-base sm:text-lg tracking-widest font-semibold">{cardData.number || '•••• •••• •••• ••••'}</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] uppercase text-[#D7DFD5]">
                        <span>{cardData.name || 'TITULAR DE LA TARJETA'}</span>
                        <span>EXP: {cardData.expiry || 'MM/AA'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-[#2F3E2B]">Número de Tarjeta</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#DFD7CB] text-xs font-mono"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-[#2F3E2B]">Nombre en la Tarjeta</label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 rounded-xl border border-[#DFD7CB] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2F3E2B]">Vencimiento (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#DFD7CB] text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2F3E2B]">CVC / Código de Seguridad</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#DFD7CB] text-xs text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: PSE */}
              {paymentMethod === 'pse' && (
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#3F523A]">
                    <Building2 className="w-4 h-4 text-[#C5A059]" />
                    <span>Selecciona tu Entidad Financiera en Colombia:</span>
                  </div>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs font-semibold text-[#1C201C] bg-white"
                  >
                    <option value="Bancolombia">Bancolombia</option>
                    <option value="Davivienda">Davivienda</option>
                    <option value="Banco de Bogotá">Banco de Bogotá</option>
                    <option value="BBVA Colombia">BBVA Colombia</option>
                    <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                    <option value="Banco de Occidente">Banco de Occidente</option>
                    <option value="Nequi">Nequi (vía PSE)</option>
                    <option value="Daviplata">Daviplata (vía PSE)</option>
                  </select>
                  <p className="text-[11px] text-[#7A8C74]">
                    Al confirmar serás redirigido a la pasarela segura PSE de {selectedBank} para autorizar la transacción en tiempo real.
                  </p>
                </div>
              )}

              {/* METHOD 3: NEQUI / DAVIPLATA */}
              {paymentMethod === 'nequi' && (
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8] space-y-4 text-center">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl border border-[#DFD7CB] shadow-sm flex flex-col items-center justify-center">
                    <QrCode className="w-24 h-24 text-[#B85D6F]" />
                    <span className="text-[9px] font-bold text-[#B85D6F] uppercase">Escanear con App</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#1C201C]">Transfiere a la cuenta oficial Aura & Elegance</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DFD7CB] rounded-full text-xs font-mono font-bold text-[#2F3E2B]">
                      <span>Nequi: 312 456 7890</span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount('3124567890')}
                        className="text-[#C5A059] hover:underline"
                        title="Copiar número"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 4: CONTRA ENTREGA */}
              {paymentMethod === 'contraentrega' && (
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Banknote className="w-4 h-4 text-amber-700" />
                    <span>Pago en Efectivo al Recibir tu Pedido</span>
                  </div>
                  <p>
                    Pagas el total de <strong>{formatPrice(total)}</strong> en efectivo al mensajero de Coordinadora Express una vez te entregue el paquete de lujo en tu domicilio.
                  </p>
                </div>
              )}

              {/* Final Confirm Button */}
              <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#7A8C74]">Total a facturar:</p>
                  <p className="text-lg font-bold text-[#3F523A]">{formatPrice(total)}</p>
                </div>

                <button
                  id="confirm-pay-btn"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="py-4 px-8 bg-[#3F523A] hover:bg-[#2F3E2B] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-[#C5A059]" />
                  <span>{isProcessing ? 'Procesando Pago Seguro...' : 'Confirmar & Pagar'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ================= STEP 3: SUCCESS ================= */}
          {step === 'success' && completedOrder && (
            <div className="text-center py-6 space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 bg-[#FAF6F0] text-[#8F6F27] border border-[#C5A059]/40 text-xs font-bold rounded-full uppercase">
                  Orden #{completedOrder.orderNumber}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#1C201C] pt-2">
                  ¡Gracias por tu compra en Aura & Elegance!
                </h3>
                <p className="text-xs sm:text-sm text-[#7A8C74] max-w-md mx-auto">
                  Hemos enviado la confirmación y recibo de compra al correo <strong>{completedOrder.customerEmail}</strong>.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8] text-left text-xs space-y-3 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                  <span className="text-[#7A8C74]">Destinatario:</span>
                  <span className="font-semibold text-[#1C201C]">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                  <span className="text-[#7A8C74]">Dirección:</span>
                  <span className="font-semibold text-[#1C201C]">{completedOrder.shippingAddress.address}, {completedOrder.shippingAddress.city}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                  <span className="text-[#7A8C74]">Método de Pago:</span>
                  <span className="font-semibold text-[#1C201C] uppercase">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                  <span className="text-[#7A8C74]">Guía de Rastreo:</span>
                  <span className="font-mono font-bold text-[#3F523A]">{completedOrder.trackingCode}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-[#1C201C]">
                  <span>Total Pagado:</span>
                  <span className="text-[#3F523A]">{formatPrice(completedOrder.total)}</span>
                </div>
              </div>

              {/* Next Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    closeCheckout();
                    setActiveView('tracking');
                  }}
                  className="px-6 py-3 bg-[#3F523A] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow hover:bg-[#2F3E2B]"
                >
                  Rastrear mi Pedido
                </button>

                <button
                  onClick={() => {
                    closeCheckout();
                    setActiveView('admin');
                  }}
                  className="px-6 py-3 bg-[#FAF6F0] text-[#8F6F27] border border-[#C5A059] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#F5EACB]"
                >
                  Ver en Panel Administrador
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
