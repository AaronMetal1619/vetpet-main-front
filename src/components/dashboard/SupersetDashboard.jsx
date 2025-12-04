import React, { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import "../../Estilos/superset.css";

const SupersetDashboard = () => {

    useEffect(() => {
        const mountDashboard = async () => {
            try {
                // PASO 1: Pedimos TODO al backend (Token, URL y ID)
                // Usamos una ruta relativa o la variable de entorno de tu API
                const apiUrl = import.meta.env.VITE_API_URL || "https://4169f60d.us1a.app.preset.io";

                console.log("🔄 Contactando al Backend...");
                const response = await axios.get(`${apiUrl}/api/preset-token`);

                const { token, supersetDomain, dashboardId } = response.data;
                console.log("✅ Datos recibidos. Conectando a:", supersetDomain);

                // PASO 2: Embeber con los datos dinámicos
                await embedDashboard({
                    id: dashboardId,
                    supersetDomain: supersetDomain,
                    mountPoint: document.getElementById("dashboard-container"),
                    fetchGuestToken: () => Promise.resolve(token), // Ya tenemos el token, lo pasamos directo
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