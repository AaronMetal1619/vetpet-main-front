import React, { useState, useEffect } from 'react';
import AgendarCita from './AgendarCita';

const Home = () => {
    const [mostrarAgendarCita, setMostrarAgendarCita] = useState(false);

    const handleClick = () => {
        setMostrarAgendarCita(true);
    };

    // 🎨 Paleta azul pastel
    const mainBlue = '#5A8DEE';
    const lightBlueBg = '#E6F0FF';
    const darkText = '#2E3A59';

    // 👉 Cargar Bootstrap Icons desde CDN
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    return (
        <div>
            {!mostrarAgendarCita ? (
                <main className="bg-light" style={{ color: darkText }}>
                    {/* Carrusel */}
                    <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner">
                            {[{
                                img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
                                alt: "Veterinario examinando un cachorro",
                                title: "Cuidamos a tu mascota",
                                text: "Desde atención médica hasta cuidados especiales para tu mejor amigo."
                            }, {
                                img: "https://images.unsplash.com/photo-1601758003122-53c40e686a19",
                                alt: "Veterinario realizando examen",
                                title: "Atención personalizada",
                                text: "Brindamos el mejor cuidado adaptado a cada mascota."
                            }, {
                                img: "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
                                alt: "Clínica veterinaria moderna",
                                title: "Tu mascota en buenas manos",
                                text: "Nuestro equipo está siempre listo para lo mejor."
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
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '90%',
                                            maxWidth: '800px',
                                            backgroundColor: i === 0 ? 'rgba(90, 141, 238, 0.5)' : 'rgba(90, 141, 238, 0.85)',
                                            backdropFilter: i === 0 ? 'blur(6px)' : 'none',
                                            WebkitBackdropFilter: i === 0 ? 'blur(6px)' : 'none',
                                        }}
                                    >
                                        <h1 className="text-white fw-bold display-5 mb-3">{slide.title}</h1>
                                        <p className="text-white fs-5 mb-4">{slide.text}</p>
                                        <button className="btn btn-lg shadow" onClick={handleClick}
                                            style={{ backgroundColor: mainBlue, color: 'white', border: 'none' }}>
                                            Agenda tu cita <i className="bi bi-calendar-plus ms-2"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Siguiente</span>
                        </button>
                    </div>

                    {/* Sección de Servicios */}
                    <section className="container pb-5">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold mb-3 fs-4" style={{ color: mainBlue }}>Nuestros Servicios</h2>
                            <p className="text-muted small mx-auto" style={{ maxWidth: '700px' }}>
                                Ofrecemos una amplia gama de servicios para el cuidado integral de tu mascota
                            </p>
                        </div>
                        <div className="row g-4">
                            {[{
                                icon: "bi-heart-pulse",
                                title: "Consulta Veterinaria",
                                text: "Chequeos generales y tratamientos especializados para tu mascota con equipos de última generación."
                            }, {
                                icon: "bi-activity",
                                title: "Cuidado de Emergencia",
                                text: "Atención 24/7 para emergencias con equipo especializado en cuidados intensivos."
                            }, {
                                icon: "bi-scissors",
                                title: "Servicios de Grooming",
                                text: "Baños terapéuticos, cortes profesionales y cuidado estético para que tu mascota luzca genial."
                            }].map((servicio, i) => (
                                <div className="col-md-4" key={i}>
                                    <div className="card h-100 shadow-sm border-0 rounded-3">
                                        <div className="card-body p-4 text-center">
                                            <div className="p-3 rounded-circle d-inline-flex mb-4"
                                                style={{ backgroundColor: lightBlueBg }}>
                                                <i className={`bi ${servicio.icon}`} style={{ color: mainBlue, fontSize: '2rem' }}></i>
                                            </div>
                                            <h5 className="card-title mb-2" style={{ color: darkText }}>{servicio.title}</h5>
                                            <p className="card-text text-muted small">{servicio.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sección de Contacto 
                    
                        <section className="py-5" style={{ backgroundColor: lightBlueBg }}>
                        <div className="container text-center py-4">
                            <h2 className="fw-bold mb-4" style={{ color: mainBlue }}>Contáctanos</h2>
                            <div className="row g-4 justify-content-center">
                                {[{
                                    icon: "bi-telephone",
                                    title: "Teléfono",
                                    detail: "123-456-789"
                                }, {
                                    icon: "bi-envelope",
                                    title: "Email",
                                    detail: "contacto@veterinaria.com"
                                }, {
                                    icon: "bi-geo-alt",
                                    title: "Dirección",
                                    detail: "Calle Ficticia 123, Ciudad, País"
                                }].map((contacto, i) => (
                                    <div className="col-md-4" key={i}>
                                        <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                                            <i className={`bi ${contacto.icon} mb-3`} style={{ color: mainBlue, fontSize: '1.5rem' }}></i>
                                            <h5 className="mb-2" style={{ color: darkText }}>{contacto.title}</h5>
                                            <p className="mb-0 text-muted small">{contacto.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    */}
                    

                    {/* Testimonios */}
                    <section className="container py-5">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold mb-3 fs-4" style={{ color: mainBlue }}>Lo que dicen nuestros clientes</h2>
                            <p className="text-muted small mx-auto" style={{ maxWidth: '700px' }}>
                                La satisfacción de nuestros clientes y sus mascotas es nuestra mayor recompensa
                            </p>
                        </div>
                        <div className="row g-4">
                            {[{
                                quote: "Excelente servicio, mi perro se siente mucho mejor después de la consulta.",
                                author: "Juan Pérez",
                                rating: 5
                            }, {
                                quote: "Mis gatos están en las mejores manos. Siempre atentos y profesionales.",
                                author: "María López",
                                rating: 5
                            }, {
                                quote: "Atención de calidad y un equipo muy amable. ¡Gracias por todo!",
                                author: "Roberto García",
                                rating: 4
                            }].map((testimonio, i) => (
                                <div className="col-md-4" key={i}>
                                    <div
                                        className="card h-100 border-0 shadow-sm rounded-3"
                                        style={{ backgroundColor: lightBlueBg }}
                                    >
                                        <div className="card-body p-4">
                                            <div className="mb-3 text-warning">
                                                {[...Array(testimonio.rating)].map((_, j) => (
                                                    <i key={j} className="bi bi-star-fill"></i>
                                                ))}
                                            </div>
                                            <blockquote className="blockquote mb-0">
                                                <p className="font-italic small">"{testimonio.quote}"</p>
                                                <footer className="blockquote-footer mt-3"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        marginTop: '1rem',
                                                        borderTop: `4px solid ${mainBlue}`,
                                                        paddingTop: '1rem',
                                                    }}
                                                >
                                                    <cite>
                                                        <span
                                                            style={{
                                                                backgroundColor: mainBlue,
                                                                color: 'white',
                                                                padding: '6px 14px',
                                                                borderRadius: '16px',
                                                                fontWeight: '600',
                                                                fontSize: '0.9rem',
                                                                display: 'inline-block',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                            }}
                                                        >
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
            ) : (
                <AgendarCita />
            )}
        </div>
    );
};

export default Home;
