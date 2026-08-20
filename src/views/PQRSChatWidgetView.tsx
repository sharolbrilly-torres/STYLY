import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquareHeart, 
  X, 
  Send, 
  Sparkles, 
  FileText, 
  MessageCircle, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { usePQRS } from '../controllers/PQRSContext';
import { useAuth } from '../controllers/AuthContext';
import { PQRSType } from '../models/types';

export const PQRSChatWidgetView: React.FC = () => {
  const { 
    isChatOpen, 
    toggleChat, 
    messages, 
    sendMessage, 
    isBotTyping, 
    createFormalTicket, 
    customerTickets, 
    quickPrompts 
  } = usePQRS();
  const { user } = useAuth();

  const [chatMode, setChatMode] = useState<'chat' | 'ticket' | 'history'>('chat');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Formal Ticket Form State
  const [ticketType, setTicketType] = useState<PQRSType>('Peticion');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketOrderId, setTicketOrderId] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBotTyping, isChatOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    await sendMessage(text);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    await createFormalTicket(ticketType, ticketSubject, ticketMessage, ticketOrderId || undefined);
    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSuccess(false);
      setChatMode('chat');
      setTicketSubject('');
      setTicketOrderId('');
      setTicketMessage('');
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Trigger Button */}
      {!isChatOpen && (
        <button
          id="open-pqrs-widget-btn"
          onClick={toggleChat}
          className="group relative flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] text-white rounded-full shadow-xl hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300 border border-[#D4AF37]/30"
          aria-label="Abrir asistente y centro de PQRS"
        >
          <div className="relative">
            <MessageSquareHeart className="w-5 h-5 text-[#D4AF37]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#1A1A1A]" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-serif font-bold text-white tracking-wide">Concierge PQRS</p>
            <p className="text-[9px] font-sans text-gray-400">Atención en Vivo</p>
          </div>
        </button>
      )}

      {/* Expanded Chat & PQRS Portal Window */}
      {isChatOpen && (
        <div className="bg-white w-[92vw] sm:w-[380px] h-[540px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#1A1A1A] text-white p-4 border-b border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold text-white">
                  Concierge PQRS • Aura
                </h3>
                <p className="text-[10px] text-gray-400 flex items-center gap-1 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Atención en vivo & radicación oficial
                </p>
              </div>
            </div>

            <button
              id="close-pqrs-widget-btn"
              onClick={toggleChat}
              className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Bar inside Chat */}
          <div className="flex border-b border-gray-100 bg-gray-50 text-xs font-sans">
            <button
              onClick={() => setChatMode('chat')}
              className={`flex-1 py-2.5 font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                chatMode === 'chat'
                  ? 'bg-white text-[#1A1A1A] border-b-2 border-[#D4AF37]'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setChatMode('ticket')}
              className={`flex-1 py-2.5 font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                chatMode === 'ticket'
                  ? 'bg-white text-[#D4AF37] border-b-2 border-[#D4AF37]'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Radicar PQRS</span>
            </button>

            <button
              onClick={() => setChatMode('history')}
              className={`flex-1 py-2.5 font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                chatMode === 'history'
                  ? 'bg-white text-[#556B2F] border-b-2 border-[#556B2F]'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Mis Tickets ({customerTickets.length})</span>
            </button>
          </div>

          {/* MODE 1: LIVE CHAT */}
          {chatMode === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#FAFAFA]">
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[9px] text-gray-400 mb-0.5 px-1 uppercase tracking-wider">{msg.senderName}</span>
                    <div
                      className={`max-w-[88%] p-3 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${
                        msg.sender === 'customer'
                          ? 'bg-[#1A1A1A] text-white rounded-tr-none shadow-xs'
                          : 'bg-white text-[#1A1A1A] border border-gray-200 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="flex items-center gap-1.5 p-3 bg-white border border-gray-200 rounded-2xl w-20 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#556B2F] animate-bounce delay-100" />
                    <span className="w-2 h-2 rounded-full bg-[#f472b6] animate-bounce delay-200" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Pills */}
              <div className="p-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-1.5 no-scrollbar">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (prompt.includes('Radicar')) {
                        setChatMode('ticket');
                      } else {
                        sendMessage(prompt);
                      }
                    }}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 hover:border-[#D4AF37] text-[10px] text-gray-600 hover:text-[#1A1A1A] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                  id="pqrs-chat-input"
                  type="text"
                  placeholder="Escribe tu consulta o petición..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white rounded-xl transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4 text-[#D4AF37] group-hover:text-white" />
                </button>
              </form>

            </div>
          )}

          {/* MODE 2: RADICAR PQRS FORMAL */}
          {chatMode === 'ticket' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#FAFAFA]">
              {ticketSuccess ? (
                <div className="text-center py-12 space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-base text-[#1A1A1A]">¡PQRS Radicado Exitosamente!</h4>
                  <p className="text-xs text-gray-500">Tu solicitud ha sido guardada en nuestra base de datos. Recibirás respuesta oficial del Administrador.</p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Tipo de Solicitud:</label>
                    <select
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value as any)}
                      className="w-full p-2 bg-white rounded-xl border border-gray-200 focus:border-[#D4AF37]"
                    >
                      <option value="Peticion">Petición (Solicitud de servicio/información)</option>
                      <option value="Queja">Queja (Inconformidad con atención)</option>
                      <option value="Reclamo">Reclamo (Problema con prenda o pedido)</option>
                      <option value="Sugerencia">Sugerencia (Propuesta de mejora)</option>
                      <option value="Consulta General">Consulta General</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Número de Pedido (Opcional):</label>
                    <input
                      type="text"
                      placeholder="Ej: AURA-9842"
                      value={ticketOrderId}
                      onChange={(e) => setTicketOrderId(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-gray-200 focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Asunto Breve *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Solicitud de cambio de talla vestido"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-gray-200 focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Descripción Detallada *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe claramente los hechos, medidas o requerimiento..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-gray-200 focus:border-[#D4AF37] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white font-bold uppercase tracking-widest text-[11px] rounded-xl shadow-xs transition-colors"
                  >
                    Radicar Solicitud Oficial
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 3: MIS TICKETS RADICADOS */}
          {chatMode === 'history' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA]">
              {customerTickets.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-[#D4AF37]" />
                  <p>Aún no has radicado tickets de PQRS.</p>
                </div>
              ) : (
                customerTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#D4AF37]">{ticket.ticketNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ticket.status === 'respondido' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#1A1A1A]">{ticket.subject}</p>
                    <p className="text-[10px] text-gray-400">{ticket.type} • {ticket.messages.length} mensajes</p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

