import React, { useState, useRef, useEffect } from 'react';

const chatbotUrl = import.meta.env.VITE_CHATBOT_URL;

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
  const subscriptionType = storedUser?.subscription_type;

  const canViewChatbot =
    role === "admin" ||
    role === "veterinaria" ||
    (role === "usuario" && subscriptionActive === true);

  // ⬅️ 3. Si NO tiene permiso → no mostrar chatbot
  if (!canViewChatbot) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p style={{ color: "gray" }}>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { from: 'user', text: input }]);

    try {
      const res = await fetch(chatbotUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error('Respuesta del servidor incorrecta');

      const data = await res.json();
      const botAnswer = data.answer || 'Sin respuesta';

      setMessages(prev => [...prev, { from: 'bot', text: botAnswer }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Error al comunicarse con el chatbot.' }]);
      console.error('Error enviando mensaje:', err);
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
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px',
          fontWeight: 'bold',
          textAlign: 'center',
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
          padding: '10px',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa',
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            Escribe algo para comenzar la conversación...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              display: 'flex',
              justifyContent: msg.from === 'bot' ? 'flex-start' : 'flex-end',
            }}
          >
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 16,
                maxWidth: '80%',
                backgroundColor: msg.from === 'bot' ? '#e9ecef' : '#007bff',
                color: msg.from === 'bot' ? '#212529' : 'white',
                wordBreak: 'break-word',
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
          display: 'flex',
          borderTop: '1px solid #ddd',
          padding: 8,
          backgroundColor: '#fff',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{
            flex: 1,
            border: '1px solid #ccc',
            borderRadius: 20,
            padding: '8px 15px',
            outline: 'none',
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 8,
            padding: '8px 16px',
            borderRadius: 20,
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatbotWidget;
