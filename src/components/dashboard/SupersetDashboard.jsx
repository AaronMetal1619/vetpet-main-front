import React, { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import "../../Estilos/superset.css"; // Importamos los estilos

const SupersetDashboard = () => {

    useEffect(() => {
        // Definimos la función para montar el dashboard
        const mountDashboard = async () => {

            const dashboardId = "7e1679bc-c9d4-4ac4-a0c1-16521659a5ed"; // ✅ TU ID ACTUALIZADO
            const supersetDomain = "http://localhost:8088"; // Tu Superset local

            try {
                await embedDashboard({
                    id: dashboardId,
                    supersetDomain: supersetDomain,
                    mountPoint: document.getElementById("dashboard-container"), // El DIV donde se pintará

                    // AQUÍ CONECTAMOS CON LARAVEL
                    fetchGuestToken: async () => {
                        console.log("🔄 Pidiendo token a Laravel...");

                        // Llama a tu ruta de Laravel (ajusta el puerto si no es 8000)
                        const response = await axios.get("http://localhost:8000/api/preset-token");

                        console.log("✅ Token recibido:", response.data.token);
                        return response.data.token;
                    },

                    dashboardUiConfig: {
                        hideTitle: true, // Ocultar título de Superset
                        hideChartControls: true, // Ocultar controles de gráficos
                        hideTab: true, // Ocultar pestañas si las hubiera
                        filters: {
                            expanded: false, // Filtros colapsados por defecto
                        }
                    },
                });
            } catch (error) {
                console.error("❌ Error al embeber el dashboard:", error);
            }
        };

        mountDashboard();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <h1>Panel Financiero</h1>
            {/* Este es el div donde Superset inyectará el iframe */}
            <div id="dashboard-container" className="superset-container"></div>
        </div>
    );
};

export default SupersetDashboard;