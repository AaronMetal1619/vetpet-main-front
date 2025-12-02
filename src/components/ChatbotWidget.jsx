import React, { useState, useRef, useEffect } from 'react';

const chatbotUrl = "https://n8n-final-3np7.onrender.com/webhook/chatbot";

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const messagesEndRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) 
                  || JSON.parse(localStorage.getItem("userLocal"));

  const role = storedUser?.role;
  const subscriptionActive = storedUser?.subscription_active;

  const canViewChatbot =
    role === "admin" ||
    role === "partner" || 
    role === "veterinaria" ||
    (role === "user" && subscriptionActive === true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => console.warn("No se pudo obtener la ubicación:", err)
      );
    }
  }, []);

  if (!canViewChatbot) return null;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const getUserId = () => storedUser?.id || "guest";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch(chatbotUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: getUserId(),
          text: userMessage,
          location: userLocation
        })
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        console.warn("Respuesta vacía desde n8n.");
      }

      const botAnswer =
        data.answer ||
        data.message ||
        data.output ||
        "Lo recibí, pero ¿puedes repetirlo?";

      setMessages(prev => [...prev, { from: "bot", text: botAnswer }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "⚠️ Error al conectar con el asistente." }
      ]);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      
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
            overflow: 'hidden'
          }}
        >

          <div style={{ background: "#007bff", color: "white", padding: "12px", display: "flex", justifyContent: "space-between" }}>
            <span><strong>🤖 Asistente VetPet</strong></span>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white" }}>✖</button>
          </div>

          <div style={{ flex: 1, padding: 15, overflowY: "auto", background: "#f8f9fa" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "bot" ? "flex-start" : "flex-end", marginBottom: 10 }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 15,
                    maxWidth: "80%",
                    backgroundColor: msg.from === "bot" ? "#e9ecef" : "#007bff",
                    color: msg.from === "bot" ? "#333" : "white",
                    whiteSpace: "pre-line"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", borderTop: "1px solid #eee", padding: 10 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe..."
              style={{ flex: 1, padding: "8px 15px", borderRadius: 20, border: "1px solid #ddd" }}
            />
            <button type="submit" style={{ marginLeft: 8, width: 40, height: 40, borderRadius: "50%", border: "none", background: "#007bff", color: "white" }}>➤</button>
          </form>

        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#007bff",
          color: "white",
          border: "none",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          cursor: "pointer",
          fontSize: "1.5rem"
        }}
      >
        {isOpen ? "⬇" : "💬"}
      </button>
    </div>
  );
};

export default ChatbotWidget;
