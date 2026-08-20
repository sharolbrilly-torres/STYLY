export type Gender = 'dama' | 'caballero' | 'todos';

export type ProductCategory = 
  | 'Vestidos' 
  | 'Trajes & Blazers' 
  | 'Camisas & Tops' 
  | 'Pantalones & Faldas' 
  | 'Prendas de Lino' 
  | 'Abrigos & Chaquetas' 
  | 'Calzado Elegante' 
  | 'Accesorios de Lujo';

export type CustomStyle = 
  | 'Formal & Gala' 
  | 'Casual Chic' 
  | 'Lino & Verano' 
  | 'Minimalista Urbano' 
  | 'Fiesta & Noche' 
  | 'Sastrería Clásica';

export interface ProductColor {
  name: string;
  hex: string;
  class?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  details: string[];
  fabric: string;
  careInstructions?: string;
  gender: 'dama' | 'caballero' | 'unisex';
  category: ProductCategory;
  style: CustomStyle;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id combining productId-size-color
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  gender: 'dama' | 'caballero' | 'unisex';
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  stockAvailable: number;
}

export type OrderStatus = 'pendiente' | 'preparacion' | 'enviado' | 'entregado' | 'cancelado';

export type PaymentMethod = 'card' | 'pse' | 'nequi' | 'contraentrega';

export interface ShippingAddress {
  fullName: string;
  documentId: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  department: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentReference?: string;
  orderStatus: OrderStatus;
  trackingCode?: string;
  shippingCarrier?: string;
  estimatedDelivery?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PQRSType = 'Peticion' | 'Queja' | 'Reclamo' | 'Sugerencia' | 'Consulta General';
export type PQRSStatus = 'abierto' | 'en_revision' | 'respondido' | 'cerrado';

export interface PQRSMessage {
  id: string;
  sender: 'customer' | 'admin' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
  isOfficialResponse?: boolean;
}

export interface PQRSTicket {
  id: string;
  ticketNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId?: string;
  type: PQRSType;
  subject: string;
  status: PQRSStatus;
  priority: 'baja' | 'media' | 'alta';
  messages: PQRSMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: ShippingAddress;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  gender: Gender;
  category: string;
  sizes: string[];
  colors: string[];
  styles: string[];
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  onlyInStock: boolean;
  onlyOffers: boolean;
}
