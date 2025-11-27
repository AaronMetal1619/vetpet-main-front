import React from 'react';

const StatsCards = () => {
    // Data Fake
    const stats = [
        { title: "Citas Totales", value: 120, color: "primary", icon: "bi-calendar" },
        { title: "Usuarios Activos", value: 45, color: "success", icon: "bi-person" },
        { title: "Veterinarias", value: 10, color: "danger", icon: "bi-hospital" },
        { title: "Ingresos (Mes)", value: "$12,500", color: "warning", icon: "bi-currency-dollar" }
    ];

    return (
        <div className="row g-4 mb-4">
            {stats.map((stat, index) => (
                <div className="col-md-3" key={index}>
                    <div className={`card border-start border-4 border-${stat.color} shadow-sm h-100`}>
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted text-uppercase mb-1">{stat.title}</h6>
                                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                                </div>
                                <div className={`text-${stat.color} fs-1`}>
                                    <i className={`bi ${stat.icon}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;