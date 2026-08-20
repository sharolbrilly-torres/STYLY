import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  MessageSquareHeart, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Send, 
  ArrowLeft,
  DollarSign,
  User,
  MapPin,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { useAdmin } from '../controllers/AdminContext';
import { useStore } from '../controllers/StoreContext';
import { useAuth } from '../controllers/AuthContext';
import { OrderStatus, PQRSStatus, Product } from '../models/types';
import { ADMIN_EMAIL } from '../models/userModel';

export const AdminDashboardView: React.FC = () => {
  const { 
    orders, 
    pqrsTickets, 
    stats, 
    selectedOrder, 
    setSelectedOrder, 
    selectedTicket, 
    setSelectedTicket, 
    changeOrderStatus, 
    replyToTicket,
    orderFilter,
    setOrderFilter,
    ticketFilter,
    setTicketFilter
  } = useAdmin();

  const { products, addProduct, removeProduct, formatPrice, setActiveView } = useStore();
  const { user, isAdmin, quickLoginAdmin } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'products' | 'pqrs'>('orders');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [newTrackingCode, setNewTrackingCode] = useState('');
  const [newCarrier, setNewCarrier] = useState('Coordinadora Express');

  // New Product Modal Form State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    subtitle: '',
    description: '',
    gender: 'dama' as 'dama' | 'caballero' | 'unisex',
    category: 'Vestidos' as any,
    style: 'Casual Chic' as any,
    price: 250000,
    originalPrice: 300000,
    stockCount: 15,
    sizes: 'XS, S, M, L',
    colors: 'Verde Oliva, Palo de Rosa, Blanco Marfil, Dorado',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'
  });

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.name || !newProductData.price) return;

    const sizesArr = newProductData.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = newProductData.colors.split(',').map(c => {
      const name = c.trim();
      let hex = '#3E503B';
      if (name.toLowerCase().includes('rosa')) hex = '#E2A9A0';
      if (name.toLowerCase().includes('oro') || name.toLowerCase().includes('dorado')) hex = '#C5A059';
      if (name.toLowerCase().includes('blanco')) hex = '#FAF7F2';
      return { name, hex };
    });

    await addProduct({
      name: newProductData.name,
      subtitle: newProductData.subtitle,
      description: newProductData.description,
      gender: newProductData.gender,
      category: newProductData.category,
      style: newProductData.style,
      price: Number(newProductData.price),
      originalPrice: newProductData.originalPrice ? Number(newProductData.originalPrice) : undefined,
      stockCount: Number(newProductData.stockCount),
      sizes: sizesArr.length ? sizesArr : ['S', 'M', 'L'],
      colors: colorsArr.length ? colorsArr : [{ name: 'Verde Oliva', hex: '#3E503B' }],
      images: [newProductData.imageUrl],
      inStock: true,
      featured: true,
      rating: 5.0,
      reviewsCount: 1
    });

    setIsAddProductOpen(false);
    alert('¡Prenda agregada exitosamente al catálogo!');
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !adminReplyText.trim()) return;
    await replyToTicket(selectedTicket.id, adminReplyText, 'respondido');
    setAdminReplyText('');
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter !== 'todos' && order.orderStatus !== orderFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredTickets = pqrsTickets.filter(ticket => {
    if (ticketFilter !== 'todos' && ticket.status !== ticketFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Return to Store */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2F3E2B] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#C5A059]/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059] rounded-full text-xs text-[#E5C378] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Panel de Administración Master</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF7F2]">
            Gestión Central Aura & Elegance
          </h1>
          <p className="text-xs sm:text-sm text-[#D7DFD5]">
            Administrador Autorizado: <strong className="text-[#E5C378]">{ADMIN_EMAIL}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <button
              onClick={() => quickLoginAdmin()}
              className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38D46] text-[#1C201C] text-xs font-bold uppercase rounded-xl transition-all shadow"
            >
              Autenticar como Admin
            </button>
          )}

          <button
            onClick={() => setActiveView('store')}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium uppercase tracking-wider rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Tienda</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A8C74] font-medium">
            <span>Ventas Totales</span>
            <DollarSign className="w-4 h-4 text-[#C5A059]" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#1C201C]">{formatPrice(stats.totalRevenue)}</p>
          <p className="text-[10px] text-emerald-700 font-semibold">100% transacciones seguras</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A8C74] font-medium">
            <span>Pedidos Totales</span>
            <Package className="w-4 h-4 text-[#3F523A]" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#1C201C]">{stats.totalOrders} órdenes</p>
          <p className="text-[10px] text-[#7A8C74]">Histórico en Firestore</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A8C74] font-medium">
            <span>Por Despachar</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-amber-900">{stats.pendingOrders} pedidos</p>
          <p className="text-[10px] text-amber-700 font-semibold">Pendientes / Preparación</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A8C74] font-medium">
            <span>Entregados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-emerald-900">{stats.deliveredOrders} pedidos</p>
          <p className="text-[10px] text-emerald-700 font-semibold">Entregas con éxito</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#7A8C74] font-medium">
            <span>PQRS Abiertos</span>
            <MessageSquareHeart className="w-4 h-4 text-[#B85D6F]" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#B85D6F]">{stats.openTickets} tickets</p>
          <p className="text-[10px] text-[#8C3A4D] font-semibold">Requieren respuesta</p>
        </div>

      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#E8E2D8] gap-4">
        
        <button
          id="admin-tab-orders"
          onClick={() => setActiveAdminTab('orders')}
          className={`pb-4 px-3 text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeAdminTab === 'orders'
              ? 'border-[#3F523A] text-[#2F3E2B]'
              : 'border-transparent text-[#7A8C74] hover:text-[#2F3E2B]'
          }`}
        >
          <Package className="w-4 h-4 text-[#C5A059]" />
          <span>Gestión de Pedidos ({orders.length})</span>
        </button>

        <button
          id="admin-tab-products"
          onClick={() => setActiveAdminTab('products')}
          className={`pb-4 px-3 text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeAdminTab === 'products'
              ? 'border-[#3F523A] text-[#2F3E2B]'
              : 'border-transparent text-[#7A8C74] hover:text-[#2F3E2B]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#E5A99C]" />
          <span>Inventario & Catálogo ({products.length})</span>
        </button>

        <button
          id="admin-tab-pqrs"
          onClick={() => setActiveAdminTab('pqrs')}
          className={`pb-4 px-3 text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeAdminTab === 'pqrs'
              ? 'border-[#3F523A] text-[#2F3E2B]'
              : 'border-transparent text-[#7A8C74] hover:text-[#2F3E2B]'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4 text-[#B85D6F]" />
          <span>Centro PQRS ({pqrsTickets.length})</span>
        </button>

      </div>

      {/* ================= TAB 1: GESTIÓN DE PEDIDOS ================= */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Controls: Search & Status Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Buscar por orden, cliente o correo..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#8E978C] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Filter Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {(['todos', 'pendiente', 'preparacion', 'enviado', 'entregado', 'cancelado'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
                    orderFilter === status
                      ? 'bg-[#3F523A] text-white border-[#3F523A]'
                      : 'bg-white text-[#5C645A] border-[#DFD7CB] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : status}
                </button>
              ))}
            </div>

          </div>

          {/* Orders List & Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Orders Table List */}
            <div className="lg:col-span-2 space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] text-center text-xs text-[#7A8C74]">
                  No se encontraron pedidos con los filtros aplicados.
                </div>
              ) : (
                filteredOrders.map(order => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewTrackingCode(order.trackingCode || '');
                        setNewCarrier(order.shippingCarrier || 'Coordinadora Express');
                      }}
                      className={`cursor-pointer bg-white p-5 rounded-2xl border transition-all hover:shadow-md ${
                        isSelected 
                          ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-md' 
                          : 'border-[#E8E2D8]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1C201C] bg-[#FAF8F5] px-2 py-1 rounded-md border border-[#E8E2D8]">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs font-semibold text-[#1C201C]">
                            {order.customerName}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === 'entregado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'enviado'
                            ? 'bg-blue-100 text-blue-800'
                            : order.orderStatus === 'preparacion'
                            ? 'bg-amber-100 text-amber-800'
                            : order.orderStatus === 'cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-[#5C645A]">
                        <div>
                          <span>{order.items.length} {order.items.length === 1 ? 'prenda' : 'prendas'} • </span>
                          <span className="uppercase text-[10px] font-semibold">{order.paymentMethod}</span>
                        </div>
                        <span className="font-bold text-[#1C201C]">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected Order Detail Panel */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <div className="bg-white p-6 rounded-3xl border border-[#E8E2D8] shadow-sm space-y-5 sticky top-28">
                  
                  <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                    <div>
                      <span className="font-mono text-sm font-bold text-[#1C201C]">{selectedOrder.orderNumber}</span>
                      <p className="text-[10px] text-[#7A8C74]">Creado el {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs text-[#7A8C74] hover:underline"
                    >
                      Cerrar detalle
                    </button>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-1.5 text-xs text-[#5C645A]">
                    <p className="font-semibold text-[#1C201C] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{selectedOrder.customerName}</span>
                    </p>
                    <p className="text-[11px]">{selectedOrder.customerEmail} • {selectedOrder.customerPhone}</p>
                    <p className="flex items-start gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#3F523A] flex-shrink-0 mt-0.5" />
                      <span>{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.department}</span>
                    </p>
                  </div>

                  {/* Purchased Items */}
                  <div className="space-y-2 border-t border-[#F0EBE1] pt-3">
                    <p className="text-xs font-semibold text-[#1C201C]">Prendas del Pedido:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#FAF8F5] p-2 rounded-xl text-xs">
                          <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg border" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#1C201C] truncate">{item.name}</p>
                            <p className="text-[10px] text-[#7A8C74]">Talla: {item.selectedSize} | {item.selectedColor.name} x{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Change Order Status Controls */}
                  <div className="space-y-3 border-t border-[#F0EBE1] pt-3">
                    <label className="text-xs font-semibold text-[#2F3E2B]">Actualizar Estado del Pedido:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['pendiente', 'preparacion', 'enviado', 'entregado', 'cancelado'] as OrderStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={() => changeOrderStatus(selectedOrder.id, st, newTrackingCode, newCarrier)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all ${
                            selectedOrder.orderStatus === st
                              ? 'bg-[#3F523A] text-white border-[#3F523A]'
                              : 'bg-[#FAF8F5] text-[#5C645A] border-[#DFD7CB] hover:border-[#C5A059]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#5C645A]">Guía de Transporte / Tracking:</label>
                        <input
                          type="text"
                          value={newTrackingCode}
                          onChange={(e) => setNewTrackingCode(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DFD7CB] rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#5C645A]">Transportadora:</label>
                        <input
                          type="text"
                          value={newCarrier}
                          onChange={(e) => setNewCarrier(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DFD7CB] rounded-xl text-xs"
                        />
                      </div>
                      <button
                        onClick={() => changeOrderStatus(selectedOrder.id, selectedOrder.orderStatus, newTrackingCode, newCarrier)}
                        className="w-full py-2 bg-[#2F3E2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#3F523A]"
                      >
                        Guardar Guía & Cambios
                      </button>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] text-center text-xs text-[#7A8C74] space-y-2">
                  <Package className="w-8 h-8 mx-auto text-[#C5A059]" />
                  <p>Selecciona un pedido de la lista para ver su detalle, dirección y gestionar su despacho.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 2: INVENTARIO & CATÁLOGO ================= */}
      {activeAdminTab === 'products' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1C201C]">Catálogo de Prendas</h3>
              <p className="text-xs text-[#7A8C74]">Administra prendas, precios, inventario y colores disponibles.</p>
            </div>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-5 py-2.5 bg-[#3F523A] hover:bg-[#2F3E2B] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Agregar Nueva Prenda</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#5C645A]">
                <thead className="bg-[#FAF8F5] border-b border-[#E8E2D8] text-[10px] font-bold uppercase tracking-wider text-[#2F3E2B]">
                  <tr>
                    <th className="p-4">Prenda</th>
                    <th className="p-4">Género & Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Tallas</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE1]">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.name} className="w-12 h-14 object-cover rounded-xl border border-[#DFD7CB]" />
                        <div>
                          <p className="font-serif font-semibold text-sm text-[#1C201C]">{prod.name}</p>
                          <p className="text-[10px] text-[#7A8C74]">{prod.style}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          prod.gender === 'dama' ? 'bg-[#F8E8E5] text-[#8C3A4D]' : 'bg-[#3F523A]/10 text-[#2F3E2B]'
                        }`}>
                          {prod.gender}
                        </span>
                        <p className="text-[11px] text-[#7A8C74] mt-1">{prod.category}</p>
                      </td>
                      <td className="p-4 font-bold text-[#1C201C]">{formatPrice(prod.price)}</td>
                      <td className="p-4">
                        <span className="font-semibold text-emerald-800">{prod.stockCount} uds</span>
                      </td>
                      <td className="p-4 text-[11px]">{prod.sizes.join(', ')}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => removeProduct(prod.id)}
                          className="p-2 text-[#8E978C] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 3: CENTRO PQRS ================= */}
      {activeAdminTab === 'pqrs' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1C201C]">Atención de Peticiones, Quejas, Reclamos y Sugerencias</h3>
              <p className="text-xs text-[#7A8C74]">Responde directamente a los clientes y gestiona el estado de cada solicitud.</p>
            </div>

            {/* Filter PQRS Status */}
            <div className="flex items-center gap-1.5">
              {(['todos', 'abierto', 'en_revision', 'respondido', 'cerrado'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setTicketFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
                    ticketFilter === st
                      ? 'bg-[#B85D6F] text-white border-[#B85D6F]'
                      : 'bg-white text-[#5C645A] border-[#DFD7CB] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {st === 'todos' ? 'Todos' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* PQRS Ticket List */}
            <div className="lg:col-span-1 space-y-3">
              {filteredTickets.map(ticket => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all hover:shadow-md space-y-2 ${
                      isSelected ? 'border-[#B85D6F] ring-2 ring-[#B85D6F]/20' : 'border-[#E8E2D8]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#8C3A4D] bg-[#F8E8E5] px-2 py-0.5 rounded">
                        {ticket.ticketNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ticket.status === 'respondido' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#1C201C] line-clamp-1">{ticket.subject}</p>
                    <p className="text-[11px] text-[#7A8C74]">{ticket.customerName} ({ticket.type})</p>
                  </div>
                );
              })}
            </div>

            {/* PQRS Chat & Official Reply */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 space-y-4 shadow-sm flex flex-col h-[520px]">
                  
                  <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#8C3A4D]">{selectedTicket.ticketNumber}</span>
                        <span className="text-xs font-semibold text-[#1C201C]">{selectedTicket.subject}</span>
                      </div>
                      <p className="text-[11px] text-[#7A8C74]">{selectedTicket.customerName} • {selectedTicket.customerEmail}</p>
                    </div>

                    <span className="px-2.5 py-1 bg-[#FAF6F0] border border-[#DFD7CB] rounded-full text-[10px] font-bold uppercase text-[#8F6F27]">
                      Tipo: {selectedTicket.type}
                    </span>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-2">
                    {selectedTicket.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-[#7A8C74] mb-0.5">{msg.senderName}</span>
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'admin'
                              ? 'bg-[#2F3E2B] text-white rounded-tr-none shadow-sm'
                              : 'bg-[#FAF8F5] text-[#1C201C] border border-[#DFD7CB] rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Official Response Form */}
                  <form onSubmit={handleReplySubmit} className="pt-2 border-t border-[#F0EBE1] flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe la respuesta oficial como Administrador..."
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#DFD7CB] text-xs text-[#1C201C] focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#3F523A] hover:bg-[#2F3E2B] text-white text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Enviar</span>
                    </button>
                  </form>

                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-[#E8E2D8] text-center text-xs text-[#7A8C74] space-y-2">
                  <MessageSquareHeart className="w-10 h-10 mx-auto text-[#B85D6F]" />
                  <p>Selecciona un ticket de PQRS para leer el hilo y enviar una respuesta oficial al cliente.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ================= MODAL: AGREGAR NUEVA PRENDA ================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-[#E8E2D8] space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <h3 className="font-serif text-lg font-semibold text-[#1C201C]">Agregar Prenda al Catálogo</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1 text-[#5C645A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#2F3E2B]">Nombre de la Prenda *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Camisa de Lino Verde Oliva & Oro"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFD7CB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#2F3E2B]">Género</label>
                  <select
                    value={newProductData.gender}
                    onChange={(e) => setNewProductData({ ...newProductData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD7CB] bg-white"
                  >
                    <option value="dama">Dama</option>
                    <option value="caballero">Caballero</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2F3E2B]">Categoría</label>
                  <select
                    value={newProductData.category}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD7CB] bg-white"
                  >
                    <option value="Vestidos">Vestidos</option>
                    <option value="Trajes & Blazers">Trajes & Blazers</option>
                    <option value="Camisas & Tops">Camisas & Tops</option>
                    <option value="Pantalones & Faldas">Pantalones & Faldas</option>
                    <option value="Prendas de Lino">Prendas de Lino</option>
                    <option value="Calzado Elegante">Calzado Elegante</option>
                    <option value="Accesorios de Lujo">Accesorios de Lujo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#2F3E2B]">Precio COP *</label>
                  <input
                    type="number"
                    required
                    value={newProductData.price}
                    onChange={(e) => setNewProductData({ ...newProductData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD7CB]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#2F3E2B]">Inventario (Stock)</label>
                  <input
                    type="number"
                    value={newProductData.stockCount}
                    onChange={(e) => setNewProductData({ ...newProductData, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD7CB]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2F3E2B]">Tallas (separadas por coma)</label>
                <input
                  type="text"
                  value={newProductData.sizes}
                  onChange={(e) => setNewProductData({ ...newProductData, sizes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFD7CB]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2F3E2B]">URL de Fotografía</label>
                <input
                  type="url"
                  value={newProductData.imageUrl}
                  onChange={(e) => setNewProductData({ ...newProductData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFD7CB]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-[#5C645A] hover:bg-[#FAF8F5] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3F523A] text-white font-bold uppercase rounded-xl hover:bg-[#2F3E2B]"
                >
                  Guardar en Catálogo
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
