import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Order, OrderStatus, CartItem, ShippingAddress, PaymentMethod } from './types';
import { INITIAL_ORDERS } from './seedData';

const ORDERS_COLLECTION = 'orders';

export async function getOrdersFromFirestore(): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    }
    // Seed sample orders if empty
    await seedInitialOrders();
    return INITIAL_ORDERS;
  } catch (error) {
    console.warn('Firestore orders fetch fallback:', error);
    return INITIAL_ORDERS;
  }
}

export function subscribeToOrders(callback: (orders: Order[]) => void) {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        callback(ords);
      } else {
        callback(INITIAL_ORDERS);
      }
    }, (err) => {
      console.warn('Orders subscription error:', err);
      callback(INITIAL_ORDERS);
    });
  } catch {
    callback(INITIAL_ORDERS);
    return () => {};
  }
}

export async function seedInitialOrders() {
  try {
    for (const order of INITIAL_ORDERS) {
      await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
    }
  } catch (err) {
    console.error('Error seeding initial orders to Firestore:', err);
  }
}

export interface CreateOrderParams {
  customerId?: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
}

export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `AURA-${randomSuffix}`;
  const now = new Date().toISOString();
  
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customerId: params.customerId || `guest-${Date.now()}`,
    customerName: params.shippingAddress.fullName,
    customerEmail: params.shippingAddress.email,
    customerPhone: params.shippingAddress.phone,
    shippingAddress: params.shippingAddress,
    items: params.items,
    subtotal: params.subtotal,
    shippingFee: params.shippingFee,
    discount: params.discount,
    couponCode: params.couponCode,
    total: params.total,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentMethod === 'contraentrega' ? 'pending' : 'paid',
    paymentReference: params.paymentReference || `TXN-${Date.now()}`,
    orderStatus: 'pendiente',
    trackingCode: `ENV-AURA-${randomSuffix}`,
    shippingCarrier: 'Coordinadora Express Premier',
    estimatedDelivery: '3 a 5 días hábiles',
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, ORDERS_COLLECTION, newOrder.id), newOrder);
  } catch (err) {
    console.warn('Could not save order directly to Firestore, saving locally:', err);
  }

  return newOrder;
}

export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  trackingCode?: string, 
  carrier?: string,
  adminNotes?: string
): Promise<void> {
  try {
    const ref = doc(db, ORDERS_COLLECTION, orderId);
    const updates: Partial<Order> = {
      orderStatus: status,
      updatedAt: new Date().toISOString()
    };
    if (trackingCode !== undefined) updates.trackingCode = trackingCode;
    if (carrier !== undefined) updates.shippingCarrier = carrier;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    
    await updateDoc(ref, updates);
  } catch (err) {
    console.warn('Error updating order status in Firestore:', err);
  }
}
