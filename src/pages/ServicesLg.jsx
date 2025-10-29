import React, { useState, useMemo } from 'react';
// IMPORTAMOS LOS COMPONENTES ADAPTADORES
import ServiceCard from '../components/services/ServiceCardLg'; 
import ServiceQuickViewModal from '../components/services/ServiceQuickViewModalLg'; 
// 💡 IMPORTACIÓN DEL NUEVO COMPONENTE DE FILTRO
import FilterSidebarLg from '../components/common/FilterSidebarLg';

// IMPORTAR los datos simulados de servicios (Asegúrate de ajustar esta ruta)
import servicesData from '../components/Data/services.json'; 

// FUNCIÓN DE FILTRADO REAL DE SERVICIOS
const filterServices = (services, filterState) => {
    let result = services;
    
    // Obtener filtros activos
    const activeCategory = filterState.filters.category?.find(f => f.active)?.name;
    const activeClinicName = filterState.filters.clinic?.find(f => f.active)?.name;
    // La búsqueda por texto se elimina, pero mantenemos filterState.searchTerm='' por si la lógica de otro componente la espera.
    
    // 1. Filtrar por Categoría de Servicio (Filtro lateral)
    if (activeCategory) {
        result = result.filter(service => service.category === activeCategory);
    }

    // 2. Filtrar por Clínica Destacada (Filtro lateral)
    if (activeClinicName) {
        result = result.filter(service => service.clinicName === activeClinicName);
    }
    
    // NOTA: Se ha eliminado toda la lógica de filtrado por 'searchTerm'.
    
    return result;
};


const ServicesLg = () => {
    const [services] = useState(servicesData);
    const [quickViewService, setQuickViewService] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    // Aseguramos que el modo sea 'services' y searchTerm sea vacío
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
    
    // Función para manejar los cambios en el filtro (recibe el estado completo)
    const handleFilterChange = (newState) => {
        setFilterState(newState);
    };

    // LÓGICA CLAVE: Recalcula los servicios filtrados
    const filteredServices = useMemo(() => {
        return filterServices(services, filterState);
    }, [services, filterState]);


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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* 1. BARRA DE FILTROS: Modo Servicios */}
                    <div className="lg:col-span-1">
                        <FilterSidebarLg 
                            onFilterChange={handleFilterChange} 
                            totalResults={filteredServices.length}
                            mode="services" 
                            // onSortChange se omite intencionalmente para no mostrar el selector de ordenamiento
                        />
                    </div>
                ) : (
                    // La grilla es la que define el tamaño y número de columnas, manteniendo la misma que ProductsLg
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {services.map(service => (
                            <ServiceCard 
                                key={service.id} 
                                service={service} 
                                onQuickView={handleQuickView}
                                onToggleWishlist={handleToggleWishlist}
                                isWishlisted={wishlist.includes(service.id)} 
                            />
                        ))}
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