/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './controllers/AuthContext';
import { StoreProvider, useStore } from './controllers/StoreContext';
import { CartProvider } from './controllers/CartContext';
import { AdminProvider } from './controllers/AdminContext';
import { PQRSProvider } from './controllers/PQRSContext';

import { HeaderView } from './views/HeaderView';
import { HeroBannerView } from './views/HeroBannerView';
import { ProductGridView } from './views/ProductGridView';
import { ProductDetailModalView } from './views/ProductDetailModalView';
import { CartDrawerView } from './views/CartDrawerView';
import { CheckoutModalView } from './views/CheckoutModalView';
import { AuthModalView } from './views/AuthModalView';
import { WishlistView } from './views/WishlistView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { PQRSChatWidgetView } from './views/PQRSChatWidgetView';
import { FooterView } from './views/FooterView';

const AppContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1A1A1A] font-serif selection:bg-[#D4AF37]/25 selection:text-[#1A1A1A]">
      
      {/* Global Header */}
      <HeaderView />

      {/* Main Content Area based on Active View */}
      <main className="flex-1">
        {activeView === 'store' && (
          <>
            <HeroBannerView />
            <ProductGridView />
          </>
        )}

        {activeView === 'wishlist' && (
          <WishlistView />
        )}

        {activeView === 'tracking' && (
          <OrderTrackingView />
        )}

        {activeView === 'admin' && (
          <AdminDashboardView />
        )}
      </main>

      {/* Global Overlays & Modals */}
      <ProductDetailModalView />
      <CartDrawerView />
      <CheckoutModalView />
      <AuthModalView />
      <PQRSChatWidgetView />

      {/* Global Footer */}
      <FooterView />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <AdminProvider>
            <PQRSProvider>
              <AppContent />
            </PQRSProvider>
          </AdminProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
