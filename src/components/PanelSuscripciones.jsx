import React from "react";
import { useNavigate } from "react-router-dom";
import "./PanelSuscripciones.css"; // CSS para estilos personalizados

const PanelSuscripciones = () => {
  const navigate = useNavigate();

  const planes = [
    {
      id: 1,
      titulo: "Premium Basico Mensual",
      precio: "$ 150 /mes",
      periodo: "Suscripción renovable cada mes",
      caracteristicas: [
        { texto: "Accesso a otros 2 cardex", incluido: true },
        { texto: "Accesso al chatbot 24/7", incluido: true },
        { texto: "Soporte por email", incluido: true }
      ],
      destacado: false,
      tipo: "mensual"
    },
    {
      id: 2,
      titulo: "Premium Plus Anual",
      precio: "$ 1800 /año",
      periodo: "Suscripción renovable cada año",
      ahorro: "Ahorra un total de $600 mxn con la cuota anual",
      caracteristicas: [
        { texto: "Sin limite de cardex", incluido: true },
        { texto: "Accesso al chatbot 24/7", incluido: true },
        { texto: "Programa de puntos por fidelidad", incluido: true },
        { texto: "Soporte por email", incluido: true }
      ],
      destacado: true,
      tipo: "anual"
    },
    {
      id: 3,
      titulo: "Premium Plus",
      precio: "$ 200 /mes",
      periodo: "Suscripción renovable cada mes",
      caracteristicas: [
        { texto: "Sin limite de cardex", incluido: true },
        { texto: "Accesso al chatbot 24/7", incluido: true },
        { texto: "Programa de puntos por fidelidad", incluido: true },
        { texto: "Soporte por email", incluido: true }
      ],
      destacado: false,
      tipo: "plus"
    }
  ];

  const handleSuscribirse = async (planId) => {
  const linksStripe = {
    1: "https://buy.stripe.com/test_9B614magPcXTcMs5tKeIw01",
    2: "https://buy.stripe.com/test_fZu3cucoX2jfcMscWceIw02",
    3: "https://buy.stripe.com/test_9B6bJ0agP5vraEkf4keIw00"
  };

  const tipos = {
    1: "mensual",
    2: "anual",
    3: "plus"
  };

  // 1. Abre Stripe en una nueva pestaña
  window.open(linksStripe[planId], "_blank");

  // 2. Marca la suscripción en tu backend como activa
  try {
    await fetch("https://vetpet-sandbox-1.onrender.com/api/fake-subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        plan: tipos[planId]
      })
    });

    alert("Suscripción activada para pruebas!");
  } catch (error) {
    console.error(error);
    alert("Hubo un error activando la suscripción.");
  }
};



  /*const handleSuscribirse = (planId) => {
    // Aquí puedes manejar la redirección a Stripe según el plan
    const linksStripe = {
      1: "https://buy.stripe.com/test_9B614magPcXTcMs5tKeIw01", // Mensual
      2: "https://buy.stripe.com/test_fZu3cucoX2jfcMscWceIw02", // Anual
      3: "https://buy.stripe.com/test_9B6bJ0agP5vraEkf4keIw00"  // Plus
    };
    
    window.open(linksStripe[planId], "_blank");
  };*/

  return (
    <div className="suscripciones-container">
      {/* Header */}
      <div className="suscripciones-header text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Únete a la familia VetPet</h1>
        <p className="lead text-muted">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>

      {/* Planes de Suscripción */}
      <div className="container">
        <div className="row justify-content-center g-4">
          {planes.map((plan) => (
            <div key={plan.id} className="col-lg-4 col-md-6">
              <div className={`card suscripcion-card h-100 ${plan.destacado ? 'destacado' : ''}`}>
                <div className="card-body p-4">
                  {/* Badge de ahorro si existe */}
                  {plan.ahorro && (
                    <div className="badge-ahorro">
                      <span className="badge bg-success">{plan.ahorro}</span>
                    </div>
                  )}
                  
                  <h3 className="card-title text-center mb-3">{plan.titulo}</h3>
                  
                  <div className="precio text-center mb-3">
                    <h2 className="fw-bold text-primary">{plan.precio}</h2>
                    <small className="text-muted">{plan.periodo}</small>
                  </div>

                  {/* Características */}
                  <ul className="list-unstyled mb-4">
                    {plan.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="mb-2">
                        <span className={`me-2 ${caracteristica.incluido ? 'text-success' : 'text-muted'}`}>
                          {caracteristica.incluido ? '✓' : '✗'}
                        </span>
                        {caracteristica.texto}
                      </li>
                    ))}
                  </ul>

                  {/* Botón de suscripción */}
                  <div className="text-center mt-auto">
                    <button 
                      className={`btn btn-lg w-100 ${plan.destacado ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleSuscribirse(plan.id)}
                    >
                      Unirse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer informativo */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <p className="text-muted">
              <strong>PRECIOS CON IMPUESTOS INCLUIDOS</strong>
            </p>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              ← Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelSuscripciones;