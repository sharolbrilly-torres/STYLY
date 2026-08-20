import React, { createContext, useContext, useState, useEffect } from 'react';
import { PQRSTicket, PQRSMessage, PQRSType, PQRSStatus } from '../models/types';
import { 
  createPQRSTicket, 
  addMessageToPQRSTicket, 
  getSmartBotAnswer, 
  getPQRSTicketsFromFirestore 
} from '../models/pqrsModel';
import { useAuth } from './AuthContext';

interface PQRSContextType {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  toggleChat: () => void;
  messages: PQRSMessage[];
  sendMessage: (text: string) => Promise<void>;
  isBotTyping: boolean;
  activeTicket: PQRSTicket | null;
  createFormalTicket: (type: PQRSType, subject: string, message: string, orderId?: string) => Promise<PQRSTicket>;
  customerTickets: PQRSTicket[];
  refreshCustomerTickets: () => Promise<void>;
  quickPrompts: string[];
}

const PQRSContext = createContext<PQRSContextType | undefined>(undefined);

const INITIAL_GREETING_MSG: PQRSMessage = {
  id: 'greet-1',
  sender: 'bot',
  senderName: 'Concierge Virtual Aura',
  text: '¡Bienvenido(a) a Aura & Elegance! ✨\n\nSoy tu asistente virtual de Atención y PQRS. ¿En qué podemos asesorarte hoy?',
  timestamp: new Date().toISOString()
};

export const PQRSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<PQRSMessage[]>([INITIAL_GREETING_MSG]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [activeTicket, setActiveTicket] = useState<PQRSTicket | null>(null);
  const [customerTickets, setCustomerTickets] = useState<PQRSTicket[]>([]);

  const quickPrompts = [
    '📏 Guía de tallas y medidas',
    '🚚 Tiempos y costos de envío',
    '💳 Métodos de pago (PSE/Nequi/Tarjeta)',
    '🔄 Cambios y Garantía de satisfacción',
    '✍️ Radicar PQRS Formal'
  ];

  useEffect(() => {
    refreshCustomerTickets();
  }, [user?.email]);

  const refreshCustomerTickets = async () => {
    try {
      const all = await getPQRSTicketsFromFirestore();
      if (user?.email) {
        setCustomerTickets(all.filter(t => t.customerEmail.toLowerCase() === user.email.toLowerCase()));
      } else {
        setCustomerTickets(all.slice(0, 3));
      }
    } catch (e) {}
  };

  const toggleChat = () => setIsChatOpen(prev => !prev);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: PQRSMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      senderName: user?.displayName || 'Tú',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsBotTyping(true);

    // If there's an active ticket, save message to Firestore ticket as well
    if (activeTicket) {
      addMessageToPQRSTicket(
        activeTicket.id,
        activeTicket.messages,
        {
          sender: 'customer',
          senderName: user?.displayName || 'Cliente',
          text: text.trim()
        }
      ).catch(() => {});
    }

    // Generate smart concierge response
    setTimeout(async () => {
      const responseData = getSmartBotAnswer(text, {
        customerName: user?.displayName,
      });

      const botMsg: PQRSMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        senderName: 'Concierge Virtual Aura',
        text: responseData.text,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);

      if (activeTicket) {
        addMessageToPQRSTicket(
          activeTicket.id,
          [...activeTicket.messages, userMsg],
          {
            sender: 'bot',
            senderName: 'Concierge Virtual Aura',
            text: responseData.text
          }
        ).catch(() => {});
      }
    }, 850);
  };

  const createFormalTicket = async (type: PQRSType, subject: string, initialMessage: string, orderId?: string) => {
    const ticket = await createPQRSTicket({
      customerId: user?.uid,
      customerName: user?.displayName || 'Cliente Aura',
      customerEmail: user?.email || 'cliente@auraelegance.com',
      customerPhone: user?.phone,
      orderId,
      type,
      subject,
      initialMessage
    });

    setActiveTicket(ticket);
    setCustomerTickets(prev => [ticket, ...prev]);

    const systemMsg: PQRSMessage = {
      id: `sys-${Date.now()}`,
      sender: 'bot',
      senderName: 'Sistema PQRS',
      text: `✅ ¡Tu ticket **${ticket.ticketNumber}** (${type}) ha sido radicado exitosamente en nuestro sistema! \n\nAsunto: *${subject}*\n\nNuestro equipo administrativo revisará tu solicitud y te notificará una respuesta oficial.`,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, systemMsg]);
    return ticket;
  };

  return (
    <PQRSContext.Provider
      value={{
        isChatOpen,
        setIsChatOpen,
        toggleChat,
        messages,
        sendMessage,
        isBotTyping,
        activeTicket,
        createFormalTicket,
        customerTickets,
        refreshCustomerTickets,
        quickPrompts
      }}
    >
      {children}
    </PQRSContext.Provider>
  );
};

export const usePQRS = () => {
  const context = useContext(PQRSContext);
  if (!context) {
    throw new Error('usePQRS must be used within a PQRSProvider');
  }
  return context;
};
