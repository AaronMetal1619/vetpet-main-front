import React, { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import "../../Estilos/superset.css";

const SupersetDashboard = () => {

    useEffect(() => {
        const mountDashboard = async () => {
            try {
                // 🚨 CAMBIO DE SEGURIDAD:
                // Antes: || "http://localhost:8000"
                // Ahora: || "https://vetpet-back.onrender.com"
                // Si no encuentra la variable de entorno, asume que estamos en Producción.

                const apiUrl = import.meta.env.VITE_API_URL || "https://vetpet-back.onrender.com";

                console.log(`🔄 Contactando al Backend en: ${apiUrl}`);

                // Hacemos la petición
                const response = await axios.get(`${apiUrl}/api/preset-token`);

                const { token, supersetDomain, dashboardId } = response.data;
                console.log("✅ Datos recibidos. Conectando a:", supersetDomain);

                await embedDashboard({
                    id: dashboardId,
                    supersetDomain: supersetDomain,
                    mountPoint: document.getElementById("dashboard-container"),
                    fetchGuestToken: () => Promise.resolve(token),
                    dashboardUiConfig: {
                        hideTitle: true,
                        hideChartControls: true,
                        hideTab: true,
                        filters: { expanded: false }
                    },
                });

            } catch (error) {
                console.error("❌ Error al cargar dashboard:", error);
            }
        };

        mountDashboard();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <h1>Panel Financiero</h1>
            <div id="dashboard-container" className="superset-container"></div>
        </div>
    );
};

export default SupersetDashboard;