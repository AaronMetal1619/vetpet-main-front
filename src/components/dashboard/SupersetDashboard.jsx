import React, { useEffect, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import "../../Estilos/superset.css";

const SupersetDashboard = () => {
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const mountDashboard = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || "https://vetpet-back.onrender.com";
                const token = localStorage.getItem('token'); 

                if (!token) {
                    console.error("❌ No hay token de sesión.");
                    return;
                }

                console.log(`🔄 Pidiendo token a: ${apiUrl}/api/preset-token`);

                // 1. Petición al Backend
                const response = await axios.get(`${apiUrl}/api/preset-token`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 🔍 LOG PARA DEPURAR (Mira esto en la consola del navegador)
                console.log("📦 Respuesta del Backend:", response.data);

                // 2. Extraer variables (Aseguramos que dashboardId exista)
                // Si el backend lo manda como 'dashboard_id', aquí lo renombramos a 'dashboardId' para prevenir errores
                const guestToken = response.data.token;
                const supersetDomain = response.data.supersetDomain;
                const dashboardId = response.data.dashboardId; 

                // Validación de seguridad antes de montar
                if (!dashboardId) {
                    throw new Error("El Backend no devolvió el 'dashboardId'. Revisa las variables de entorno en Render.");
                }

                console.log("✅ Montando Dashboard:", { id: dashboardId, domain: supersetDomain });

                // 3. Incrustar Dashboard
                await embedDashboard({
                    id: dashboardId, // Aquí es donde fallaba antes
                    supersetDomain: supersetDomain,
                    mountPoint: document.getElementById("dashboard-container"),
                    fetchGuestToken: () => Promise.resolve(guestToken),
                    dashboardUiConfig: {
                        hideTitle: true,
                        hideChartControls: true,
                        hideTab: true,
                        filters: { expanded: false }
                    },
                    referrerPolicy: "strict-origin-when-cross-origin",
                });

            } catch (error) {
                console.error("❌ Error montando dashboard:", error);
                setErrorMsg(error.message || "Error desconocido");
            }
        };

        mountDashboard();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <div className="d-flex justify-content-between align-items-center px-4 pt-3 mb-3">
                <h2 className="m-0">Panel Financiero</h2>
                {/* Botón de recarga manual por si acaso */}
                <button className="btn btn-sm btn-outline-secondary" onClick={() => window.location.reload()}>
                    <i className="bi bi-arrow-clockwise"></i> Recargar
                </button>
            </div>
            
            {errorMsg && (
                <div className="alert alert-danger mx-4">
                    <strong>Error:</strong> {errorMsg}
                </div>
            )}

            <div id="dashboard-container" className="superset-container"></div>
        </div>
    );
};

export default SupersetDashboard;