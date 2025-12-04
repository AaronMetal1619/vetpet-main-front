import React, { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import "../../Estilos/superset.css";

const SupersetDashboard = () => {

    useEffect(() => {
        const mountDashboard = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || "https://vetpet-back.onrender.com";
                const token = localStorage.getItem('token'); // 1. OBTENEMOS EL TOKEN

                if (!token) {
                    console.error("❌ No hay token de sesión. No se puede cargar el dashboard.");
                    return;
                }

                console.log(`🔄 Contactando al Backend en: ${apiUrl}`);

                // 2. ENVIAMOS EL TOKEN EN LOS HEADERS (SOLUCIONA EL ERROR 401)
                const response = await axios.get(`${apiUrl}/api/preset-token`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { token: guestToken, supersetDomain, dashboardId } = response.data;
                console.log("✅ Datos recibidos. Conectando a:", supersetDomain);

                await embedDashboard({
                    id: dashboardId,
                    supersetDomain: supersetDomain,
                    mountPoint: document.getElementById("dashboard-container"),
                    fetchGuestToken: () => Promise.resolve(guestToken),
                    dashboardUiConfig: {
                        hideTitle: true,
                        hideChartControls: true,
                        hideTab: true,
                        filters: { expanded: false }
                    },
                });

            } catch (error) {
                console.error("❌ Error al cargar dashboard:", error);
                // Si el error es 401, podríamos redirigir al login, pero por ahora solo logueamos
            }
        };

        mountDashboard();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <h2 className="mb-3 px-4 pt-3">Panel Financiero</h2>
            <div id="dashboard-container" className="superset-container"></div>
        </div>
    );
};

export default SupersetDashboard;