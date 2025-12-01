import React, { useState, useRef, useEffect } from 'react';

// ✅ URL de tu n8n
const chatbotUrl = "https://n8n-final-3np7.onrender.com/webhook/chatbot";

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar
  const [userLocation, setUserLocation] = useState(null); // 📍 Nuevo estado para ubicación
  const messagesEndRef = useRef(null);

  // ⬅️ 1. Obtener usuario
  const storedUser = JSON.parse(localStorage.getItem("user")) 
                  || JSON.parse(localStorage.getItem("userLocal"));

  // ⬅️ 2. Validar acceso
  const role = storedUser?.role;
  const subscriptionActive = storedUser?.subscription_active;
  
  const canViewChatbot =
    role === "admin" ||
    role === "partner" || 
    role === "veterinaria" ||
    (role === "user" && subscriptionActive === true);

  // ⬅️ 3. Obtener Ubicación del Usuario (NUEVO)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log("📍 Ubicación detectada:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("⚠️ No se pudo obtener la ubicación:", error.message);
        }
      );
    }
  }, []);

  // ⬅️ 4. Si NO tiene permiso, no renderizamos NADA
  if (!canViewChatbot) return null;

  // Scroll automático al último mensaje
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const getUserId = () => storedUser?.id || 'guest';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    
    // Limpiar input y añadir mensaje usuario
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);

    try {
      const res = await fetch(chatbotUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: getUserId(),
          text: userMessage,
          location: userLocation // 📍 Enviamos la ubicación a n8n
        })
      });

      if (!res.ok) throw new Error("Error n8n");

      const data = await res.json();

      // Manejar respuesta de n8n
      const botAnswer = data.answer || data.output || data.message || "Recibido.";
      
      setMessages(prev => [...prev, { from: 'bot', text: botAnswer }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { from: 'bot', text: "⚠️ Error de conexión con el asistente." }]);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      {/* VENTANA DEL CHAT (Solo visible si isOpen es true) */}
      {isOpen && (
        <div
          style={{
            width: 350,
            height: 500,
            marginBottom: 15,
            borderRadius: 12,
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: "#007bff", color: "white", padding: "12px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: "bold" }}>🤖 Asistente VetPet</span>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, padding: "15px", overflowY: "auto", backgroundColor: "#f8f9fa" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#aaa' }}>
                <i className="bi bi-chat-dots" style={{ fontSize: '2rem' }}></i>
                <p>¡Hola! Soy tu asistente virtual.<br/>¿En qué puedo ayudarte?</p>
                {userLocation && <p style={{fontSize: '0.8rem', color: 'green'}}>📍 Ubicación activa</p>}
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "bot" ? "flex-start" : "flex-end", marginBottom: 10 }}>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "15px",
                  maxWidth: "80%",
                  fontSize: "0.9rem",
                  backgroundColor: msg.from === "bot" ? "#e9ecef" : "#007bff",
                  color: msg.from === "bot" ? "#333" : "white",
                  borderBottomLeftRadius: msg.from === "bot" ? "2px" : "15px",
                  borderBottomRightRadius: msg.from === "user" ? "2px" : "15px",
                  whiteSpace: 'pre-line' // Permite saltos de línea en la respuesta del bot
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{ borderTop: "1px solid #eee", padding: "10px", display: "flex", backgroundColor: 'white' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe tu duda..."
              style={{ flex: 1, border: "1px solid #ddd", borderRadius: "20px", padding: "8px 15px", outline: "none" }}
            />
            <button type="submit" style={{ marginLeft: 8, width: 40, height: 40, borderRadius: "50%", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      )}

      {/* BOTÓN FLOTANTE (LAUNCHER) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chat-dots-fill"></i>}
      </button>

      {/* Estilo para animación simple */}
      <style>
        {`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}
      </style>
    </div>
  );
};

export default ChatbotWidget;