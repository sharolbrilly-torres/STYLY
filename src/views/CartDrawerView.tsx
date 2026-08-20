import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Tag, 
  Truck, 
  ArrowRight, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../controllers/CartContext';
import { useStore } from '../controllers/StoreContext';

const FREE_SHIPPING_THRESHOLD = 150000;

export const CartDrawerView: React.FC = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shippingFee, 
    discount, 
    couponCode, 
    couponApplied, 
    couponError, 
    applyCoupon, 
    removeCoupon, 
    total,
    openCheckout 
  } = useCart();
  const { formatPrice } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Slide-over Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Cart Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif text-lg font-semibold text-[#1C201C]">Tu Bolsa de Compras</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#3F523A] text-white text-xs font-bold">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            id="close-cart-btn"
            onClick={closeCart}
            className="p-1.5 text-[#5C645A] hover:text-[#1C201C] hover:bg-[#EAE5DC] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#FAF6F0] px-5 py-3 border-b border-[#E8E2D8]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-[#2F3E2B]">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold">¡Felicidades! Tienes Envío Express GRATIS 🎉</span>
              ) : (
                <span>Te faltan <strong>{formatPrice(remainingForFreeShipping)}</strong> para Envío GRATIS</span>
              )}
            </span>
            <span className="font-bold text-[#C5A059]">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E8E2D8] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C5A059] to-[#3F523A] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#7A8C74]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1C201C]">Tu bolsa está vacía</h3>
              <p className="text-xs text-[#7A8C74] max-w-xs mx-auto">
                Explora nuestras colecciones en tonos verde oliva, rosa empolvado, lino y dorado.
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 bg-[#3F523A] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow hover:bg-[#2F3E2B]"
              >
                Explorar Colecciones
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="flex gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] transition-all hover:border-[#C5A059]/40"
              >
                {/* Thumbnail */}
                <div className="w-18 h-22 rounded-xl overflow-hidden bg-white border border-[#DFD7CB] flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-xs font-semibold text-[#1C201C] line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#8E978C] hover:text-red-600 p-1 transition-colors"
                        title="Eliminar de la bolsa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variant specs: Size & Color swatch */}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#7A8C74]">
                      <span className="font-semibold px-1.5 py-0.5 bg-white border border-[#DFD7CB] rounded">
                        Talla {item.selectedSize}
                      </span>
                      <span className="flex items-center gap-1">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-black/10" 
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                    </div>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-[#1C201C]">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    <div className="flex items-center border border-[#DFD7CB] rounded-xl bg-white p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg text-[#1C201C] font-bold text-xs hover:bg-[#FAF6F0] flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#1C201C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg text-[#1C201C] font-bold text-xs hover:bg-[#FAF6F0] flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer: Summary, Promo Coupon, Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#E8E2D8] bg-[#FAF8F5] space-y-4">
            
            {/* Coupon Code Input */}
            <div className="space-y-1.5">
              {couponApplied ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cupón <strong>{couponCode}</strong> aplicado</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-emerald-900 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="cart-coupon-input"
                      type="text"
                      placeholder="Código cupón (ej: AURA10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="w-full bg-white text-xs text-[#1C201C] pl-8 pr-3 py-2 rounded-xl border border-[#DFD7CB] focus:outline-none uppercase"
                    />
                    <Tag className="w-3.5 h-3.5 text-[#8E978C] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2F3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#3F523A]"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600 pl-1">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#5C645A]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#1C201C]">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Descuento Promocional:</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío Nacional:</span>
                <span className="font-semibold text-[#1C201C]">
                  {shippingFee === 0 ? <strong className="text-emerald-700">GRATIS</strong> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="border-t border-[#DFD7CB] pt-2 flex justify-between text-sm sm:text-base font-bold text-[#1C201C]">
                <span>Total a Pagar:</span>
                <span className="text-[#3F523A]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="proceed-checkout-btn"
              onClick={openCheckout}
              className="w-full py-4 bg-[#3F523A] hover:bg-[#2F3E2B] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>Continuar con el Pago Seguro</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#7A8C74]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Transacciones Cifradas SSL • Pagos PSE, Tarjetas & Contra Entrega</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
