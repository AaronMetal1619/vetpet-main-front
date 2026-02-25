import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    // 1. Los Hooks siempre van adentro del componente
    const navigate = useNavigate();

    // 2. Función para ir a la página de agendar
    const handleClick = () => {
        navigate('/agendar'); 
    };

    // 🎨 Paleta azul pastel (Adaptada a VitaFem)
    const mainBlue = '#c36eeae9'; // Tu tono actual (tirando a morado/lila)
    const lightBlueBg = '#f4eaff'; // Un lila muy clarito para que combine
    const darkText = '#010101';

    // 👉 Cargar Bootstrap Icons
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    return (
        <main className="bg-light pb-5" style={{ color: darkText }}>
            
            {/* --- CARRUSEL --- */}
            <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2"></button>
                </div>
                <div className="carousel-inner">
                    {[{
                        img: "https://www.shutterstock.com/image-photo/smiling-doctor-stethoscope-clipboard-on-600nw-2536277671.jpg",
                        alt: "Doctora sonriendo",
                        title: "Cuidamos tu salud íntima",
                        text: "Atención ginecológica integral con empatía y profesionalismo."
                    }, {
                        img: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
                        alt: "Médico especialista",
                        title: "Especialistas certificados",
                        text: "El mejor equipo médico enfocado en la salud de la mujer."
                    }, {
                        img: "https://www.shutterstock.com/image-photo/healthcare-medical-staff-concept-portrait-600nw-2281024823.jpg",
                        alt: "Clínica moderna",
                        title: "Instalaciones de vanguardia",
                        text: "Tecnología de punta para diagnósticos precisos y seguros."
                    }].map((slide, i) => (
                        <div className={`carousel-item${i === 0 ? ' active' : ''}`} key={i}>
                            <img
                                src={`${slide.img}?w=1920&auto=format&fit=crop&q=80`}
                                className="d-block w-100"
                                alt={slide.alt}
                                style={{ height: '70vh', minHeight: '500px', objectFit: 'cover' }}
                                loading="lazy"
                            />
                            <div
                                className="carousel-caption d-none d-md-block rounded-3 p-4 mx-auto"
                                style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '800px',
                                    backgroundColor: i === 0 ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.85)',
                                    backdropFilter: i === 0 ? 'blur(6px)' : 'none',
                                    WebkitBackdropFilter: i === 0 ? 'blur(6px)' : 'none',
                                }}
                            >
                                <h1 className="fw-bold display-5 mb-3" style={{ color: i === 0 ? 'white' : darkText }}>{slide.title}</h1>
                                <p className="fs-5 mb-4" style={{ color: i === 0 ? 'white' : darkText }}>{slide.text}</p>
                                <button className="btn btn-lg shadow rounded-pill px-4" onClick={handleClick}
                                    style={{ backgroundColor: mainBlue, color: 'white', border: 'none' }}>
                                    Agenda tu cita <i className="bi bi-calendar-plus ms-2"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>

            {/* --- SECCIÓN DE SERVICIOS --- */}
            <section className="container mt-5 pt-4">
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3 fs-3" style={{ color: mainBlue }}>Nuestros Servicios</h2>
                    <p className="text-muted small mx-auto" style={{ maxWidth: '700px' }}>
                        Ofrecemos atención médica especializada para cada etapa de tu vida.
                    </p>
                </div>
                <div className="row g-4">
                    {[{
                        icon: "bi-heart-pulse",
                        title: "Consulta Ginecológica",
                        text: "Chequeos anuales, Papanicolaou, ultrasonidos y prevención integral."
                    }, {
                        icon: "bi-person-hearts",
                        title: "Control Prenatal",
                        text: "Acompañamiento médico experto durante todo tu embarazo para ti y tu bebé."
                    }, {
                        icon: "bi-capsule",
                        title: "Planificación Familiar",
                        text: "Asesoría personalizada sobre métodos anticonceptivos y salud reproductiva."
                    }].map((servicio, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card h-100 shadow-sm border-0 rounded-4 transition-hover">
                                <div className="card-body p-4 text-center">
                                    <div className="p-3 rounded-circle d-inline-flex mb-4" style={{ backgroundColor: lightBlueBg }}>
                                        <i className={`bi ${servicio.icon}`} style={{ color: mainBlue, fontSize: '2rem' }}></i>
                                    </div>
                                    <h5 className="card-title fw-bold mb-3" style={{ color: darkText }}>{servicio.title}</h5>
                                    <p className="card-text text-muted small">{servicio.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECCIÓN TESTIMONIOS --- */}
            <section className="container py-5 mt-4">
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3 fs-3" style={{ color: mainBlue }}>Lo que dicen nuestras pacientes</h2>
                    <p className="text-muted small mx-auto" style={{ maxWidth: '700px' }}>
                        La confianza y bienestar de nuestras pacientes es nuestra mayor recompensa.
                    </p>
                </div>
                <div className="row g-4">
                    {[{
                        quote: "Me sentí súper cómoda y escuchada. La doctora explicó todo con mucha paciencia.",
                        author: "Ana G.",
                        rating: 5
                    }, {
                        quote: "Llevé todo mi embarazo aquí y la atención fue inmejorable. Instalaciones hermosas.",
                        author: "María L.",
                        rating: 5
                    }, {
                        quote: "El trato desde recepción hasta el consultorio es excelente. Muy profesionales.",
                        author: "Sofía R.",
                        rating: 4
                    }].map((testimonio, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card h-100 border-0 shadow-sm rounded-4" style={{ backgroundColor: lightBlueBg }}>
                                <div className="card-body p-4">
                                    <div className="mb-3" style={{ color: '#ffc107' }}>
                                        {[...Array(testimonio.rating)].map((_, j) => (
                                            <i key={j} className="bi bi-star-fill me-1"></i>
                                        ))}
                                    </div>
                                    <blockquote className="blockquote mb-0">
                                        <p className="small mb-4">"{testimonio.quote}"</p>
                                        <footer className="blockquote-footer mt-auto" style={{ borderTop: `2px solid ${mainBlue}`, paddingTop: '1rem' }}>
                                            <cite>
                                                <span className="fw-bold px-3 py-1 rounded-pill" style={{ backgroundColor: mainBlue, color: 'white', fontSize: '0.85rem' }}>
                                                    {testimonio.author}
                                                </span>
                                            </cite>
                                        </footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    );
};

export default Home;