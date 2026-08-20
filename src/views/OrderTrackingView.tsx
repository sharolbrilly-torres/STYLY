import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  MessageSquareHeart,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../controllers/AdminContext';
import { useStore } from '../controllers/StoreContext';
import { usePQRS } from '../controllers/PQRSContext';
import { Order, OrderStatus } from '../models/types';

export const OrderTrackingView: React.FC = () => {
  const { orders } = useAdmin();
  const { formatPrice, setActiveView } = useStore();
  const { toggleChat } = usePQRS();

  const [searchQuery, setSearchQuery] = useState('AURA-9842');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    orders.find(o => o.orderNumber === 'AURA-9842') || (orders[0] || null)
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const query = searchQuery.trim().toLowerCase();
    const found = orders.find(o => 
      o.orderNumber.toLowerCase() === query ||
      o.customerEmail.toLowerCase() === query ||
      (o.trackingCode && o.trackingCode.toLowerCase() === query)
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMessage('No encontramos un pedido con ese número de orden o correo. Por favor verifica los datos.');
    }
  };

  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'pendiente': return 1;
      case 'preparacion': return 2;
      case 'enviado': return 3;
      case 'entregado': return 4;
      default: return 1;
    }
  };

  const currentStep = searchedOrder ? getStepProgress(searchedOrder.orderStatus) : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('store')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3F523A] hover:text-[#2F3E2B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <span className="text-xs text-[#7A8C74] font-serif italic">
          Sistema de Rastreo de Envíos en Tiempo Real
        </span>
      </div>

      {/* Search Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C201C]">
            Rastrear mi Pedido
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8C74]">
            Ingresa tu número de orden (ej: <strong>AURA-9842</strong>) o tu correo electrónico para consultar el estado del paquete.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <input
              id="tracking-search-input"
              type="text"
              placeholder="Número de orden o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-[#FAF8F5] rounded-2xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059] uppercase"
            />
            <Search className="w-4 h-4 text-[#8E978C] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="py-3 px-6 bg-[#3F523A] hover:bg-[#2F3E2B] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow transition-colors"
          >
            Buscar
          </button>
        </form>

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {searchedOrder && (
        <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EBE1]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-[#FAF6F0] border border-[#C5A059]/40 text-[#8F6F27] font-mono text-sm font-bold rounded-full">
                  {searchedOrder.orderNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  searchedOrder.orderStatus === 'entregado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : searchedOrder.orderStatus === 'enviado'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {searchedOrder.orderStatus}
                </span>
              </div>
              <p className="text-xs text-[#7A8C74] mt-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Fecha de compra: {new Date(searchedOrder.createdAt).toLocaleDateString('es-CO', { dateStyle: 'long' })}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-[#7A8C74]">Guía de Transporte:</p>
              <p className="font-mono text-sm font-bold text-[#3F523A]">{searchedOrder.trackingCode || 'Generándose en taller'}</p>
              <p className="text-[11px] text-[#8E978C]">{searchedOrder.shippingCarrier || 'Coordinadora Express'}</p>
            </div>
          </div>

          {/* Timeline Visual Steps */}
          <div className="py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F3E2B] mb-6">Línea de Envío y Despacho:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              
              {/* Step 1 */}
              <div className={`p-4 rounded-2xl border text-center transition-all ${
                currentStep >= 1 ? 'bg-[#FAF6F0] border-[#C5A059] text-[#2F3E2B]' : 'bg-[#FAF8F5] border-[#E8E2D8] text-[#8E978C]'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 1 ? 'bg-[#3F523A] text-white' : 'bg-[#EAE5DC] text-[#7A8C74]'
                }`}>
                  1
                </div>
                <p className="text-xs font-bold">Orden Confirmada</p>
                <p className="text-[10px] text-[#7A8C74] mt-0.5">Pago validado con éxito</p>
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded-2xl border text-center transition-all ${
                currentStep >= 2 ? 'bg-[#FAF6F0] border-[#C5A059] text-[#2F3E2B]' : 'bg-[#FAF8F5] border-[#E8E2D8] text-[#8E978C]'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 2 ? 'bg-[#3F523A] text-white' : 'bg-[#EAE5DC] text-[#7A8C74]'
                }`}>
                  2
                </div>
                <p className="text-xs font-bold">En Preparación</p>
                <p className="text-[10px] text-[#7A8C74] mt-0.5">Empaque de lujo y control</p>
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded-2xl border text-center transition-all ${
                currentStep >= 3 ? 'bg-[#FAF6F0] border-[#C5A059] text-[#2F3E2B]' : 'bg-[#FAF8F5] border-[#E8E2D8] text-[#8E978C]'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 3 ? 'bg-[#3F523A] text-white' : 'bg-[#EAE5DC] text-[#7A8C74]'
                }`}>
                  3
                </div>
                <p className="text-xs font-bold">En Camino</p>
                <p className="text-[10px] text-[#7A8C74] mt-0.5">En manos de transportadora</p>
              </div>

              {/* Step 4 */}
              <div className={`p-4 rounded-2xl border text-center transition-all ${
                currentStep >= 4 ? 'bg-[#FAF6F0] border-[#C5A059] text-[#2F3E2B]' : 'bg-[#FAF8F5] border-[#E8E2D8] text-[#8E978C]'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 4 ? 'bg-emerald-700 text-white' : 'bg-[#EAE5DC] text-[#7A8C74]'
                }`}>
                  4
                </div>
                <p className="text-xs font-bold">Entregado</p>
                <p className="text-[10px] text-[#7A8C74] mt-0.5">Recibido en destino</p>
              </div>

            </div>
          </div>

          {/* Delivery & Items Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F0EBE1]">
            
            {/* Delivery Address */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8] space-y-2 text-xs text-[#5C645A]">
              <p className="font-semibold text-[#1C201C] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#3F523A]" />
                <span>Dirección de Entrega:</span>
              </p>
              <p className="font-medium text-[#1C201C]">{searchedOrder.customerName}</p>
              <p>{searchedOrder.shippingAddress.address} {searchedOrder.shippingAddress.apartment}</p>
              <p>{searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.department}</p>
              <p className="text-[11px] text-[#8E978C]">Tel: {searchedOrder.customerPhone}</p>
            </div>

            {/* Items summary */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8] space-y-2 text-xs">
              <p className="font-semibold text-[#1C201C]">Resumen de Prendas:</p>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {searchedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-xl border border-[#DFD7CB]">
                    <div>
                      <p className="font-semibold text-[#1C201C]">{item.name}</p>
                      <p className="text-[10px] text-[#7A8C74]">Talla: {item.selectedSize} • {item.selectedColor.name} (x{item.quantity})</p>
                    </div>
                    <span className="font-bold text-[#1C201C]">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#DFD7CB] pt-2 flex justify-between font-bold text-sm text-[#1C201C]">
                <span>Total:</span>
                <span className="text-[#3F523A]">{formatPrice(searchedOrder.total)}</span>
              </div>
            </div>

          </div>

          {/* Need Help / PQRS prompt */}
          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#2F3E2B]">
              <MessageSquareHeart className="w-5 h-5 text-[#B85D6F]" />
              <div>
                <p className="font-semibold">¿Tienes alguna novedad con este pedido o deseas cambiar la talla?</p>
                <p className="text-[11px] text-[#7A8C74]">Comunícate de inmediato con nuestro equipo de atención PQRS.</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="px-4 py-2 bg-[#B85D6F] hover:bg-[#A34B5D] text-white font-semibold rounded-xl whitespace-nowrap shadow-sm"
            >
              Contactar en PQRS Chat
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
