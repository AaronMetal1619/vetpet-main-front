import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaCalendarCheck, FaMapMarkerAlt, FaClock, FaStethoscope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Mensaje inicial de bienvenida con opciones
    const initialMessage = {
        id: 1,
        sender: 'bot',
        text: '¡Hola! Soy VitaBot 🤖, tu asistente virtual de VitaFem. ¿En qué te puedo ayudar hoy? Selecciona una opción:',
        options: [
            { text: '📍 Ubicación', action: 'ubicacion' },
            { text: '⏰ Horarios', action: 'horarios' },
            { text: '👩‍⚕️ Servicios', action: 'servicios' },
            { text: '📅 Agendar Cita', action: 'agendar' }
        ]
    };

    // Al abrir el chat por primera vez, cargamos el mensaje inicial
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([initialMessage]);
        }
    }, [isOpen]);

    // Auto-scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Lógica para procesar las respuestas del bot
    const handleOptionClick = (option) => {
        // 1. Agregamos lo que el usuario "preguntó" (como si lo hubiera escrito)
        const userMsg = { id: Date.now(), sender: 'user', text: option.text };
        setMessages(prev => [...prev, userMsg]);

        // 2. Simulamos que el bot está escribiendo (pequeño retraso)
        setTimeout(() => {
            let botReply = { id: Date.now() + 1, sender: 'bot', text: '' };

            switch (option.action) {
                case 'ubicacion':
                    botReply.text = 'Nos encontramos en la Av. Principal #123, Colonia Centro. ¡Estamos muy cerca de ti! 🏥';
                    break;
                case 'horarios':
                    botReply.text = 'Nuestros especialistas atienden de Lunes a Viernes de 9:00 a.m. a 5:00 p.m. ☀️';
                    break;
                case 'servicios':
                    botReply.text = 'Ofrecemos consultas de Ginecología, Obstetricia, Control Prenatal y Planificación Familiar. 🩺';
                    break;
                case 'agendar':
                    botReply.text = '¡Excelente! Te llevaré a la sección de citas. Solo debes elegir a tu médico y la fecha que prefieras. 📅';
                    botReply.redirect = '/agendar'; // Le decimos al bot que nos redireccione
                    break;
                default:
                    botReply.text = 'No entendí esa opción. ¿Podemos intentar de nuevo?';
            }

            // Volvemos a mostrar el menú principal para que no se quede atascado
            botReply.options = initialMessage.options;

            setMessages(prev => [...prev, botReply]);

            // Si la opción era agendar, lo redireccionamos después de 2 segundos
            if (botReply.redirect) {
                setTimeout(() => {
                    navigate(botReply.redirect);
                    setIsOpen(false); // Cerramos el chat para que vea la pantalla
                }, 2000);
            }

        }, 800); // 800ms de retraso para que se sienta natural
    };

    // Lógica por si el usuario escribe texto libre (Respuestas básicas)
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userText = inputText.trim().toLowerCase();
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputText }]);
        setInputText('');

        setTimeout(() => {
            let botReply = { id: Date.now() + 1, sender: 'bot', text: '' };

            if (userText.includes('hola') || userText.includes('buenos dias')) {
                botReply.text = '¡Hola! Qué gusto saludarte. ¿Te ayudo con alguna de estas opciones?';
            } else if (userText.includes('cita') || userText.includes('agendar')) {
                botReply.text = 'Para agendar una cita, es muy fácil. Toca el botón de "Agendar Cita" aquí abajo 👇';
            } else if (userText.includes('gracias')) {
                botReply.text = '¡Con mucho gusto! Estoy aquí 24/7 para ayudarte. ❤️';
            } else {
                botReply.text = 'Aún estoy aprendiendo a conversar. 😅 Por favor, usa los botones de abajo para poder ayudarte mejor:';
            }

            botReply.options = initialMessage.options;
            setMessages(prev => [...prev, botReply]);
        }, 800);
    };

    return (
        <>
            {/* BOTÓN FLOTANTE */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary rounded-circle shadow-lg position-fixed d-flex align-items-center justify-content-center animation-bounce"
                    style={{ bottom: '30px', right: '30px', width: '65px', height: '65px', zIndex: 1050 }}
                >
                    <FaRobot className="fs-2 text-white" />
                </button>
            )}

            {/* VENTANA DEL CHAT */}
            {isOpen && (
                <div className="card shadow-lg position-fixed border-0 rounded-4 overflow-hidden" 
                     style={{ bottom: '30px', right: '30px', width: '350px', height: '500px', zIndex: 1050, display: 'flex', flexDirection: 'column' }}>
                    
                    {/* ENCABEZADO */}
                    <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '40px', height: '40px'}}>
                                <FaRobot className="fs-4" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">VitaBot</h6>
                                <small className="opacity-75" style={{fontSize: '0.75rem'}}>En línea • Respuestas automáticas</small>
                            </div>
                        </div>
                        <button className="btn btn-sm text-white" onClick={() => setIsOpen(false)}>
                            <FaTimes className="fs-5" />
                        </button>
                    </div>

                    {/* ÁREA DE MENSAJES */}
                    <div className="card-body bg-light p-3" style={{ overflowY: 'auto', flexGrow: 1 }}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`mb-3 d-flex flex-column ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                                
                                {/* Búrbuja de texto */}
                                <div className={`p-3 rounded-4 shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-bottom-end-0' : 'bg-white border text-dark rounded-bottom-start-0'}`} style={{ maxWidth: '85%', fontSize: '0.9rem' }}>
                                    {msg.text}
                                </div>

                                {/* Botones de opciones (Solo si es el bot y trae opciones) */}
                                {msg.options && (
                                    <div className="d-flex flex-wrap gap-2 mt-2 w-100 pe-4">
                                        {msg.options.map((opt, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => handleOptionClick(opt)}
                                                className="btn btn-sm btn-outline-primary bg-white rounded-pill shadow-sm fw-bold border"
                                                style={{ fontSize: '0.8rem' }}
                                            >
                                                {opt.text}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* ÁREA DE ESCRITURA */}
                    <div className="card-footer bg-white border-top p-2">
                        <form onSubmit={handleSendMessage} className="input-group">
                            <input 
                                type="text" 
                                className="form-control form-control-sm border-0 bg-light rounded-pill px-3" 
                                placeholder="Escribe un mensaje..." 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button type="submit" className="btn text-primary bg-transparent border-0 ms-1">
                                <FaPaperPlane className="fs-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;