import React, { useState, useMemo } from 'react';
// IMPORTAMOS LOS COMPONENTES ADAPTADORES
import ServiceCard from '../components/services/ServiceCardLg'; 
import ServiceQuickViewModal from '../components/services/ServiceQuickViewModalLg'; 
// 💡 IMPORTACIÓN DEL NUEVO COMPONENTE DE FILTRO
import FilterSidebarLg from '../components/common/FilterSidebarLg';

// IMPORTAR los datos simulados de servicios (Asegúrate de ajustar esta ruta)
import servicesData from '../components/Data/services.json'; 

// FUNCIÓN DE FILTRADO REAL DE SERVICIOS (SIN CAMBIOS)
const filterServices = (services, filterState) => {
    let result = services;
    
    // Obtener filtros activos
    const activeClinics = filterState.filters.clinic || [];
    const activeClinicName = activeClinics.length > 0 ? activeClinics[0] : null;

    // 2. Filtrar por Clínica Destacada (Veterinaria)
    if (activeClinicName) {
        result = result.filter(service => service.clinicName === activeClinicName);
    }
    
    return result;
};


const ServicesLg = () => {
    const [services] = useState(servicesData);
    const [quickViewService, setQuickViewService] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [filterState, setFilterState] = useState({ filters: {}, searchTerm: '', mode: 'services' });


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
    
    const handleFilterChange = (newState) => {
        setFilterState(newState);
    };

    // LÓGICA CLAVE: Recalcula los servicios filtrados
    const filteredServices = useMemo(() => {
        return filterServices(services, filterState);
    }, [services, filterState]);

    // 🌟 LÓGICA DE VISIBILIDAD DEL FILTRO 🌟
    // El filtro se oculta si hay 1 o 0 servicios, o si el filtrado no cambió el conteo total
    // Aquí solo usamos la lógica más simple: si el conteo inicial es <= 1, ocultar.
    // Si queremos ser más estrictos, podríamos contar cuántas clínicas únicas hay en `servicesData`.
    // Usaremos un umbral de 1 para ser concisos.
    const showFilterSidebar = services.length > 1; // Muestra el filtro solo si hay más de 1 servicio inicial

    // Determina la estructura de la cuadrícula
    const gridLayout = showFilterSidebar ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1';
    const contentSpan = showFilterSidebar ? 'lg:col-span-3' : 'lg:col-span-4';


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            
            <header className="mb-10 pt-4">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    Nuestros Servicios 🏥
                </h1>
                <p className="text-center text-gray-500 mt-2 text-lg">
                    Cuidado experto y bienestar integral para tu mejor amigo.
                </p>
            </header>

            <main className="max-w-screen-2xl mx-auto">
                {/* 🌟 AJUSTE DEL LAYOUT DE LA CUADRÍCULA 🌟 */}
                <div className={`grid ${gridLayout} gap-6`}>
                    
                    {/* 1. BARRA DE FILTROS: Renderizado Condicional */}
                    {showFilterSidebar && (
                        <div className="lg:col-span-1">
                            <FilterSidebarLg 
                                onFilterChange={handleFilterChange} 
                                totalResults={filteredServices.length}
                                mode="services" 
                            />
                        </div>
                    )}
                
                    {/* 2. LISTA DE SERVICIOS FILTRADOS: Ajuste del Span */}
                    <div className={`${contentSpan} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6`}>
                        
                        {filteredServices.map(service => (
                            <ServiceCard 
                                key={service.id} 
                                service={service} 
                                onQuickView={handleQuickView}
                                onToggleWishlist={handleToggleWishlist}
                                isWishlisted={wishlist.includes(service.id)} 
                            />
                        ))}
                        
                        {/* Manejo de Cero Resultados */}
                        {filteredServices.length === 0 && (
                            <div className="sm:col-span-2 lg:col-span-3 p-10 text-center bg-white rounded-xl shadow-md">
                                <p className="text-xl font-semibold text-gray-700">
                                    No se encontraron servicios que coincidan con los filtros aplicados. 😔
                                </p>
                                <p className="text-gray-500 mt-2">
                                    Intenta ajustar tu selección de clínica.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
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