import React, { useState, useMemo } from 'react';
// IMPORTAMOS LOS COMPONENTES ADAPTADORES
import ServiceCard from '../components/services/ServiceCardLg'; 
import ServiceQuickViewModal from '../components/services/ServiceQuickViewModalLg'; 
// NUEVA IMPORTACIÓN: El componente de barra lateral de filtros
import FilterSidebarLg from '../components/common/FilterSidebarLg'; 

// IMPORTAR los datos simulados de servicios (Asegúrate de ajustar esta ruta)
import servicesData from '../components/Data/services.json'; 

const ServicesLg = () => {
    const [services] = useState(servicesData);
    const [quickViewService, setQuickViewService] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    
    // ESTADO PARA FILTRO
    const [currentFilters, setCurrentFilters] = useState({});

    // Maneja la actualización de los filtros desde el Sidebar
    const handleFilterChange = ({ filters, searchTerm, mode }) => {
        // Solo nos interesa el objeto 'filters' para la lógica aquí
        setCurrentFilters(filters);
    };

    /**
     * LÓGICA DE FILTRADO CENTRAL (solo filtrado, no ordenamiento)
     */
    const filteredServices = useMemo(() => {
        let list = [...services];

        // 1. FILTRADO
        const activeFilters = Object.keys(currentFilters).reduce((acc, key) => {
            const activeValues = currentFilters[key]
                ?.filter(f => f.active)
                .map(f => f.name);
            if (activeValues && activeValues.length > 0) {
                acc[key] = activeValues;
            }
            return acc;
        }, {});

        // Aplicar filtros
        if (Object.keys(activeFilters).length > 0) {
            list = list.filter(service => {
                let matchesAllActiveFilters = true;

                // Para cada grupo de filtros activos (e.g., category, clinic)
                for (const key of Object.keys(activeFilters)) {
                    const filterValues = activeFilters[key];
                    // La clave 'clinic' se mapea a 'clinicName' en el JSON de servicios
                    const productKey = key === 'clinic' ? 'clinicName' : key;
                    const serviceValue = service[productKey];

                    if (!filterValues.includes(serviceValue)) {
                        matchesAllActiveFilters = false;
                        break;
                    }
                }
                return matchesAllActiveFilters;
            });
        }
        
        return list;
    }, [services, currentFilters]); // Dependencias para la re-ejecución

    const handleQuickView = (service) => {
        setQuickViewService(service);
    };

    const handleToggleWishlist = (serviceId) => {
        console.log(`Wishlist toggled for service: ${serviceId}`);
        setWishlist(prev => prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]);
    };
    
    const handleRemoveProduct = (id) => {
        console.log(`Demo: Intentando remover servicio con ID ${id}.`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                body { font-family: 'Inter', sans-serif; }

                /* ========================================================= */
                /* CSS PARA OCULTAR ELEMENTOS DE PRODUCTO EN LAS TARJETAS DE SERVICIO (MANTENIDO) */
                /* ========================================================= */
                .service-card .text-xl.font-bold { display: none !important; }
                .service-card .flex.items-center.space-x-2 { display: none !important; }
                .service-card .flex.justify-between.items-center.pt-2.border-t.border-gray-100.mt-2 {
                    justify-content: flex-start !important; 
                    border-top: none !important; 
                    padding-top: 0 !important;
                    margin-top: 0 !important;
                }

                /* ========================================================= */
                /* CSS PARA EL MODAL DE VISTA RÁPIDA DE SERVICIO (MANTENIDO) */
                /* ========================================================= */
                .service-modal .text-3xl.font-extrabold.text-indigo-600.mt-2 { display: none !important; }
                .service-modal button[type="submit"] {
                    font-size: 0 !important; 
                    position: relative;
                }
                .service-modal button[type="submit"]::before {
                    content: "Agendar Servicio"; 
                    font-size: 1rem; 
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white; 
                }
                .service-modal button[type="submit"] svg { display: none !important; }
            `}</style>
            
            <header className="mb-10 pt-4">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    Nuestros Servicios 🏥
                </h1>
                <p className="text-center text-gray-500 mt-2 text-lg">
                    Cuidado experto y bienestar integral para tu mejor amigo.
                </p>
            </header>

            {/* CONTENEDOR PRINCIPAL: Grid para Sidebar + Contenido */}
            <main className="max-w-screen-2xl mx-auto grid lg:grid-cols-[280px_1fr] gap-8">
                
                {/* COLUMNA 1: SIDEBAR DE FILTROS */}
                <div>
                    <FilterSidebarLg 
                        onFilterChange={handleFilterChange}
                        // No pasamos onSortChange porque no hay ordenamiento en servicios
                        totalResults={filteredServices.length}
                        mode="services" // Modo: Servicios
                    />
                </div>
                
                {/* COLUMNA 2: LISTA DE SERVICIOS */}
                <section>
                    {filteredServices.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-0 border border-gray-200">
                            <p className="text-2xl text-red-500 font-bold">
                                ¡No se encontraron servicios con estos filtros! 😿
                            </p>
                            <p className="text-gray-600 mt-2">
                                Intenta limpiar algunos filtros para ver más resultados.
                            </p>
                        </div>
                    ) : (
                        // La grilla es la que define el tamaño y número de columnas, ajustada para el nuevo layout
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
                            {filteredServices.map(service => (
                                <ServiceCard 
                                    key={service.id} 
                                    service={service} 
                                    onQuickView={handleQuickView}
                                    onToggleWishlist={handleToggleWishlist}
                                    isWishlisted={wishlist.includes(service.id)} 
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {quickViewService && (
                <ServiceQuickViewModal 
                    service={quickViewService} 
                    onClose={() => setQuickViewService(null)} 
                />
            )}
        </div>
    );
};

export default ServicesLg;