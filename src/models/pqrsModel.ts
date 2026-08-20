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
import { PQRSTicket, PQRSType, PQRSMessage, PQRSStatus } from './types';
import { INITIAL_PQRS } from './seedData';

const PQRS_COLLECTION = 'pqrs';

export async function getPQRSTicketsFromFirestore(): Promise<PQRSTicket[]> {
  try {
    const q = query(collection(db, PQRS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PQRSTicket));
    }
    await seedInitialPQRS();
    return INITIAL_PQRS;
  } catch (error) {
    console.warn('PQRS fetch error, fallback:', error);
    return INITIAL_PQRS;
  }
}

export function subscribeToPQRS(callback: (tickets: PQRSTicket[]) => void) {
  try {
    const q = query(collection(db, PQRS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PQRSTicket));
        callback(tickets);
      } else {
        callback(INITIAL_PQRS);
      }
    }, (err) => {
      console.warn('PQRS subscription error:', err);
      callback(INITIAL_PQRS);
    });
  } catch {
    callback(INITIAL_PQRS);
    return () => {};
  }
}

export async function seedInitialPQRS() {
  try {
    for (const ticket of INITIAL_PQRS) {
      await setDoc(doc(db, PQRS_COLLECTION, ticket.id), ticket);
    }
  } catch (err) {
    console.error('Error seeding initial PQRS to Firestore:', err);
  }
}

export interface CreatePQRSOptions {
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId?: string;
  type: PQRSType;
  subject: string;
  initialMessage: string;
}

export async function createPQRSTicket(options: CreatePQRSOptions): Promise<PQRSTicket> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketNumber = `PQRS-2026-${randomSuffix}`;
  const now = new Date().toISOString();

  const firstMessage: PQRSMessage = {
    id: `msg-${Date.now()}`,
    sender: 'customer',
    senderName: options.customerName,
    text: options.initialMessage,
    timestamp: now
  };

  const newTicket: PQRSTicket = {
    id: `pqrs-${Date.now()}`,
    ticketNumber,
    customerId: options.customerId,
    customerName: options.customerName,
    customerEmail: options.customerEmail,
    customerPhone: options.customerPhone,
    orderId: options.orderId,
    type: options.type,
    subject: options.subject,
    status: 'abierto',
    priority: options.type === 'Reclamo' || options.type === 'Queja' ? 'alta' : 'media',
    messages: [firstMessage],
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, PQRS_COLLECTION, newTicket.id), newTicket);
  } catch (err) {
    console.warn('Could not save PQRS ticket directly to Firestore, saving locally:', err);
  }

  return newTicket;
}

export async function addMessageToPQRSTicket(
  ticketId: string, 
  currentMessages: PQRSMessage[], 
  newMessage: { sender: 'customer' | 'admin' | 'bot'; senderName: string; text: string; isOfficialResponse?: boolean },
  newStatus?: PQRSStatus
): Promise<PQRSTicket | null> {
  const now = new Date().toISOString();
  const messageObj: PQRSMessage = {
    id: `msg-${Date.now()}`,
    sender: newMessage.sender,
    senderName: newMessage.senderName,
    text: newMessage.text,
    timestamp: now,
    isOfficialResponse: newMessage.isOfficialResponse
  };

  const updatedMessages = [...currentMessages, messageObj];

  try {
    const docRef = doc(db, PQRS_COLLECTION, ticketId);
    const updates: Partial<PQRSTicket> = {
      messages: updatedMessages,
      updatedAt: now
    };
    if (newStatus) {
      updates.status = newStatus;
    } else if (newMessage.sender === 'admin') {
      updates.status = 'respondido';
    }

    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Error updating PQRS message in Firestore:', err);
  }

  return null;
}

// Smart Automated PQRS Chatbot Knowledge Base & Responder
export function getSmartBotAnswer(userMessage: string, context?: { customerName?: string; orderNumber?: string }): { text: string; suggestedType?: PQRSType; quickActions?: string[] } {
  const msg = userMessage.toLowerCase();

  if (msg.includes('talla') || msg.includes('medida') || msg.includes('size')) {
    return {
      text: '📏 En Aura & Elegance manejamos siluetas sartoriales europeas. \n\n• Dama: XS (Busto 82-86cm, Cintura 64-68cm), S (88-92cm / 70-74cm), M (94-98cm / 76-80cm), L (100-104cm / 82-86cm).\n• Caballero: Sastrería en tallas numéricas 36 a 44, o S a XXL en camisería.\n\n¿Deseas que un asesor te brinde asesoría personalizada para una prenda en específico?',
      suggestedType: 'Consulta General',
      quickActions: ['Radicar consulta de talla', 'Ver catálogo dama', 'Ver trajes caballero']
    };
  }

  if (msg.includes('envio') || msg.includes('envío') || msg.includes('tiempo') || msg.includes('cuanto demora') || msg.includes('llegar') || msg.includes('cobertura')) {
    return {
      text: '🚚 Tiempos de Entrega & Envíos VIP:\n\n• Ciudades principales (Bogotá, Medellín, Cali, Barranquilla): 1 a 3 días hábiles.\n• Resto del país: 3 a 5 días hábiles.\n• ¡Envío GRATIS en todas las compras superiores a $150.000 COP!\n\nTodos los paquetes viajan con empaque de lujo perfumado y seguro contra pérdidas.',
      suggestedType: 'Consulta General',
      quickActions: ['Rastrear mi pedido', 'Radicar petición de envío', 'Hablar con asesor']
    };
  }

  if (msg.includes('pago') || msg.includes('tarjeta') || msg.includes('pse') || msg.includes('nequi') || msg.includes('contra entrega') || msg.includes('efectivo')) {
    return {
      text: '💳 Métodos de Pago Disponibles:\n\n1. Tarjetas de Crédito / Débito (Visa, Mastercard, Amex) con cifrado SSL bancario.\n2. PSE (Todos los bancos en Colombia sin recargo).\n3. Nequi y Daviplata con confirmación inmediata.\n4. Pago Contra Entrega en efectivo al recibir tu paquete en ciudades principales.',
      suggestedType: 'Consulta General',
      quickActions: ['Ayuda con pago PSE', 'Pagar con Nequi', 'Comprar ahora']
    };
  }

  if (msg.includes('cambio') || msg.includes('devolucion') || msg.includes('devolución') || msg.includes('garantia') || msg.includes('garantía') || msg.includes('defecto')) {
    return {
      text: '✨ Garantía & Política de Cambios:\n\nTienes hasta 30 días calendario para solicitar cambio de talla, color o prenda sin ningún costo adicional. La prenda debe conservar sus etiquetas originales y empaque.\n\nPara iniciar tu cambio o radicar una queja/reclamo formal, por favor compártenos el número de pedido y correo.',
      suggestedType: 'Reclamo',
      quickActions: ['Radicar solicitud de cambio', 'Reportar inconveniente', 'Hablar con supervisor']
    };
  }

  if (msg.includes('rastrear') || msg.includes('guia') || msg.includes('guía') || msg.includes('donde esta mi pedido') || msg.includes('estado')) {
    return {
      text: '📦 Rastrear Pedido:\nPuedes consultar el estado en tiempo real ingresando tu número de orden (ej: AURA-9842) en el menú o radicando un ticket aquí mismo. ¿Tienes a mano tu número de orden?',
      suggestedType: 'Peticion',
      quickActions: ['Ingresar número de orden', 'Consultar con asesor']
    };
  }

  // Default elegant response
  return {
    text: `Hola ${context?.customerName || 'estimado cliente'}, gracias por comunicarte con el Centro de Atención PQRS de Aura & Elegance.\n\nHe registrado tu mensaje. Puedes formular una Petición, Queja, Reclamo o Sugerencia formal seleccionando una de las opciones o escribirnos tus dudas detalladas. Nuestro equipo administrativo responderá a la brevedad.`,
    suggestedType: 'Consulta General',
    quickActions: ['Radicar PQRS Formal', 'Guía de Tallas', 'Tiempos de Envío', 'Hablar con Asesor']
  };
}
