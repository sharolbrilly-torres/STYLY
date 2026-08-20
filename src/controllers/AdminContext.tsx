import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, PQRSTicket, PQRSMessage, PQRSStatus } from '../models/types';
import { 
  getOrdersFromFirestore, 
  subscribeToOrders, 
  updateOrderStatus as updateOrderStatusModel 
} from '../models/orderModel';
import { 
  getPQRSTicketsFromFirestore, 
  subscribeToPQRS, 
  addMessageToPQRSTicket 
} from '../models/pqrsModel';
import { INITIAL_ORDERS, INITIAL_PQRS } from '../models/seedData';

interface AdminContextType {
  orders: Order[];
  pqrsTickets: PQRSTicket[];
  isLoadingAdminData: boolean;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  selectedTicket: PQRSTicket | null;
  setSelectedTicket: (ticket: PQRSTicket | null) => void;
  changeOrderStatus: (orderId: string, status: OrderStatus, trackingCode?: string, carrier?: string, notes?: string) => Promise<void>;
  replyToTicket: (ticketId: string, replyText: string, newStatus?: PQRSStatus) => Promise<void>;
  orderFilter: OrderStatus | 'todos';
  setOrderFilter: (status: OrderStatus | 'todos') => void;
  ticketFilter: PQRSStatus | 'todos';
  setTicketFilter: (status: PQRSStatus | 'todos') => void;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    openTickets: number;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [pqrsTickets, setPqrsTickets] = useState<PQRSTicket[]>(INITIAL_PQRS);
  const [isLoadingAdminData, setIsLoadingAdminData] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<PQRSTicket | null>(null);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'todos'>('todos');
  const [ticketFilter, setTicketFilter] = useState<PQRSStatus | 'todos'>('todos');

  useEffect(() => {
    let unsubOrders: () => void = () => {};
    let unsubPQRS: () => void = () => {};

    const loadData = async () => {
      try {
        const [loadedOrders, loadedPQRS] = await Promise.all([
          getOrdersFromFirestore(),
          getPQRSTicketsFromFirestore()
        ]);
        setOrders(loadedOrders);
        setPqrsTickets(loadedPQRS);

        unsubOrders = subscribeToOrders((newOrders) => {
          if (newOrders && newOrders.length) setOrders(newOrders);
        });

        unsubPQRS = subscribeToPQRS((newTickets) => {
          if (newTickets && newTickets.length) setPqrsTickets(newTickets);
        });
      } catch (err) {
        console.warn('Error loading admin data:', err);
      } finally {
        setIsLoadingAdminData(false);
      }
    };

    loadData();
    return () => {
      unsubOrders();
      unsubPQRS();
    };
  }, []);

  const changeOrderStatus = async (
    orderId: string, 
    status: OrderStatus, 
    trackingCode?: string, 
    carrier?: string,
    notes?: string
  ) => {
    await updateOrderStatusModel(orderId, status, trackingCode, carrier, notes);
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: status,
          trackingCode: trackingCode !== undefined ? trackingCode : ord.trackingCode,
          shippingCarrier: carrier !== undefined ? carrier : ord.shippingCarrier,
          adminNotes: notes !== undefined ? notes : ord.adminNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return ord;
    }));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? {
        ...prev,
        orderStatus: status,
        trackingCode: trackingCode !== undefined ? trackingCode : prev.trackingCode,
        shippingCarrier: carrier !== undefined ? carrier : prev.shippingCarrier,
        adminNotes: notes !== undefined ? notes : prev.adminNotes,
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const replyToTicket = async (ticketId: string, replyText: string, newStatus: PQRSStatus = 'respondido') => {
    const target = pqrsTickets.find(t => t.id === ticketId);
    if (!target) return;

    await addMessageToPQRSTicket(
      ticketId,
      target.messages,
      {
        sender: 'admin',
        senderName: 'Dirección de Calidad Aura & Elegance',
        text: replyText,
        isOfficialResponse: true
      },
      newStatus
    );

    const now = new Date().toISOString();
    const updatedMessages: PQRSMessage[] = [
      ...target.messages,
      {
        id: `msg-${Date.now()}`,
        sender: 'admin',
        senderName: 'Dirección de Calidad Aura & Elegance',
        text: replyText,
        timestamp: now,
        isOfficialResponse: true
      }
    ];

    setPqrsTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: newStatus,
          messages: updatedMessages,
          updatedAt: now
        };
      }
      return t;
    }));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? {
        ...prev,
        status: newStatus,
        messages: updatedMessages,
        updatedAt: now
      } : null);
    }
  };

  const stats = {
    totalRevenue: orders
      .filter(o => o.orderStatus !== 'cancelado')
      .reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.orderStatus === 'pendiente' || o.orderStatus === 'preparacion').length,
    deliveredOrders: orders.filter(o => o.orderStatus === 'entregado').length,
    openTickets: pqrsTickets.filter(t => t.status === 'abierto' || t.status === 'en_revision').length
  };

  return (
    <AdminContext.Provider
      value={{
        orders,
        pqrsTickets,
        isLoadingAdminData,
        selectedOrder,
        setSelectedOrder,
        selectedTicket,
        setSelectedTicket,
        changeOrderStatus,
        replyToTicket,
        orderFilter,
        setOrderFilter,
        ticketFilter,
        setTicketFilter,
        stats
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
