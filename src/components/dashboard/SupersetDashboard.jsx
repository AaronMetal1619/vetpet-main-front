import React, { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import "../../Estilos/superset.css";

// ... importaciones ...

const SupersetDashboard = () => {
    useEffect(() => {
        const mountDashboard = async () => {
            try {
                // ... (tu código de obtener token sigue igual) ...
                
                // Al momento de incrustar:
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
                    // ✅ AGREGAMOS ESTO SEGÚN LA DOCUMENTACIÓN:
                    referrerPolicy: "strict-origin-when-cross-origin",
                });

            } catch (error) {
                console.error("Error mounting dashboard:", error);
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