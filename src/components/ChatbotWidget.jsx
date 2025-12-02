import React, { useState, useRef, useEffect } from 'react';

const chatbotUrl = "https://n8n-final-3np7.onrender.com/webhook/chatbot";

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const messagesEndRef = useRef(null);

  // Obtener usuario del almacenamiento local
  const storedUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("userLocal"));

  const role = storedUser?.role;
  const subscriptionActive = storedUser?.subscription_active;

  // Lógica de permisos para ver el chatbot
  const canViewChatbot =
    role === "admin" ||
    role === "partner" ||
    role === "veterinaria" ||
    (role === "user" && subscriptionActive === true);

  // Obtener geolocalización al montar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("No se pudo obtener la ubicación:", err);
        }
      );
    }
  }, []);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const getUserId = () => storedUser?.id || "guest";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    // Agregamos mensaje del usuario a la lista
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInput("");

    try {
      const res = await fetch(chatbotUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: getUserId(),
          text: userText,
          location: userLocation,
        }),
      });

      // 🔥 Debugging Mejorado: Ver respuesta cruda si hay error
      const raw = await res.text();
      // console.log("Respuesta cruda n8n:", raw); 

      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (parseError) {
        console.error("Error parseando JSON de n8n:", parseError, raw);
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠️ Recibí una respuesta inválida del servidor." },
        ]);
        return;
      }

      // N8N puede devolver "message", "answer" o "output" dependiendo del nodo
      const botMessage =
        data.answer ||
        data.message ||
        data.output ||
        (typeof data === 'string' ? data : "No entendí la respuesta.");

      setMessages((prev) => [...prev, { from: "bot", text: botMessage }]);

    } catch (error) {
      console.error("Error de red o fetch:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error de conexión con el asistente." },
      ]);
    }
  };

  if (!canViewChatbot) return null;

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {isOpen && (
        <div
          style={{
            width: 350,
            height: 500,
            marginBottom: 15,
            borderRadius: 12,
            boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
            border: "1px solid #ddd",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#007bff",
              color: "white",
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <strong>🤖 Asistente VetPet</strong>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer" }}
            >
              ✖
            </button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, padding: 15, overflowY: "auto", background: "#f8f9fa" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "bot" ? "flex-start" : "flex-end",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 15,
                    maxWidth: "80%",
                    backgroundColor: msg.from === "bot" ? "#e9ecef" : "#007bff",
                    color: msg.from === "bot" ? "#333" : "white",
                    whiteSpace: "pre-line",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} style={{ display: "flex", borderTop: "1px solid #eee", padding: 10, backgroundColor: "white" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe aquí..."
              style={{
                flex: 1,
                padding: "8px 15px",
                borderRadius: 20,
                border: "1px solid #ddd",
                outline: "none"
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: 8,
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: "#007bff",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
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
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? "⬇" : "💬"}
      </button>
    </div>
  );
};

export default ChatbotWidget;