import React, { useState, useRef, useEffect } from 'react';

// ✅ URL ACTUALIZADA: Usa la variable de entorno O tu enlace directo
const chatbotUrl = import.meta.env.VITE_CHATBOT_URL || "https://n8n-final-3np7.onrender.com/webhook/chatbot";

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // ⬅️ 1. Obtener usuario logeado desde localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) 
                  || JSON.parse(localStorage.getItem("userLocal"));

  // ⬅️ 2. Validar si el usuario tiene acceso al chatbot
  const role = storedUser?.role;
  const subscriptionActive = storedUser?.subscription_active;
  
  const canViewChatbot =
    role === "admin" ||
    role === "veterinaria" ||
    (role === "usuario" && subscriptionActive === true);

  // ⬅️ 3. Si NO tiene permiso → Bloquear vista
  if (!canViewChatbot) {
    return (
      <div style={{ padding: 20, textAlign: "center", border: '1px solid #ccc', borderRadius: 12, margin: '20px auto', width: 350, backgroundColor: 'white' }}>
        <p style={{ color: "gray", fontSize: 14 }}>
          🔒 El chatbot está disponible solo para usuarios con suscripción activa.
        </p>
      </div>
    );
  }

  if (!chatbotUrl) {
    return <div style={{ padding: 10, color: 'red' }}>Chatbot URL no configurada</div>;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Obtener el user_id desde localStorage
  const getUserId = () => {
    try {
      const localUser = localStorage.getItem('userLocal');
      const realUser = localStorage.getItem('user');

      const user = localUser
        ? JSON.parse(localUser)
        : realUser
        ? JSON.parse(realUser)
        : null;

      return user?.id || null;
    } catch (error) {
      console.error("Error leyendo el user_id:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const user_id = getUserId();

    // Mostrar el mensaje del usuario
    setMessages(prev => [...prev, { from: 'user', text: input }]);

    try {
      const res = await fetch(chatbotUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          message: input,
        })
      });

      if (!res.ok) throw new Error("Error al comunicarse con el chatbot");

      const data = await res.json();

      // Compatibilidad con cualquier retorno de n8n
      const botAnswer =
        data.answer ||
        data.response ||
        data.reply ||
        data.message ||
        "Sin respuesta del bot.";

      setMessages(prev => [...prev, { from: 'bot', text: botAnswer }]);

    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setMessages(prev => [...prev, { from: 'bot', text: "Hubo un problema al conectar con el chatbot." }]);
    }

    setInput('');
  };

  return (
    <div
      style={{
        width: 350,
        height: 500,
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        margin: '20px auto',
        position: 'static',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px",
          fontWeight: "bold",
          textAlign: "center",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        🤖 Asistente Virtual
      </div>

      {/* MENSAJES */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#888", fontStyle: "italic", textAlign: 'center', marginTop: 20 }}>
            Hola 👋, ¿en qué puedo ayudarte hoy?
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              display: "flex",
              justifyContent: msg.from === "bot" ? "flex-start" : "flex-end",
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 16,
                maxWidth: "80%",
                backgroundColor: msg.from === "bot" ? "#e9ecef" : "#007bff",
                color: msg.from === "bot" ? "#212529" : "white",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          borderTop: "1px solid #ddd",
          padding: 8,
          backgroundColor: "#fff",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: 20,
            padding: "8px 15px",
            outline: "none",
            fontSize: 14,
          }}
        />

        <button
          type="submit"
          style={{
            marginLeft: 8,
            padding: "8px 16px",
            borderRadius: 20,
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatbotWidget;