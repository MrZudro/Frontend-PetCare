import React, { useState, useMemo, useCallback } from 'react'; 
// 💡 IMPORTADO useCallback
// 🔑 CLAVE: Importar useLocation para leer el estado de navegación
import { useLocation } from 'react-router-dom'; 

// Importamos los datos JSON
import servicesData from '../components/Data/services.json';
import clinicsData from '../components/Data/VeterinaryData.json';
// Importamos el hook para obtener el estado global de citas
import { useAppointmentStore } from '../components/services/useAppointmentStore';

// IMPORTAMOS LOS COMPONENTES ADAPTADORES
import ServiceCard from '../components/services/ServiceCardLg';
import ServiceQuickViewModal from '../components/services/ServiceQuickViewModalLg';
// 💡 IMPORTACIÓN DEL NUEVO COMPONENTE DE GESTIÓN
import AppointmentManagerLg from '../components/services/AppointmentManagerLg'; 
// IMPORTACIÓN DE OTROS COMPONENTES
import FilterSidebarLg from '../components/common/FilterSidebarLg';
import { FaCalendarAlt } from 'react-icons/fa'; 


// FUNCIÓN DE FILTRADO REAL DE SERVICIOS (USANDO clinicsData para los nombres)
const filterServices = (services, filterState) => {
    let result = services;

    // Obtener filtros activos
    const activeClinics = filterState.filters.clinic || [];
    const activeClinicName = activeClinics.length > 0 ? activeClinics[0] : null;

    // 2. Filtrar por Clínica
    if (activeClinicName) {
        result = result.filter(service => service.clinicName === activeClinicName);
    }

    return result;
};


const ServicesLg = () => {
    
    // 🔑 PASO 1: Leemos el estado de navegación
    const location = useLocation();
    // Determinamos si se debe abrir el gestor de inmediato (si el estado de navegación lo indica)
    const initialIsManagerOpen = location.state?.openManager || false; 

    // 💡 Estado del hook para controlar la visibilidad del botón de gestión
    const appointments = useAppointmentStore(state => state.appointments);

    const [services] = useState(servicesData);
    const [clinics] = useState(clinicsData); // Usamos clinicsData para el sidebar
    
    const [quickViewService, setQuickViewService] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    
    // 🔑 PASO 2: Inicializamos el estado del gestor con el valor de la navegación
    const [isManagerOpen, setIsManagerOpen] = useState(initialIsManagerOpen);

    // Estado del filtro (ajustamos el inicial para reflejar clinics)
    const [filterState, setFilterState] = useState({ 
        filters: {
            clinic: [] // Usaremos los nombres de las clínicas para el filtro
        }, 
        searchTerm: '', 
        mode: 'services' 
    });


    const handleQuickView = (service) => {
        setQuickViewService(service);
    };

    const handleToggleWishlist = (serviceId) => {
        console.log(`Wishlist toggled for service: ${serviceId}`);
        setWishlist(prev => prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]);
    };

    // ✅ CORRECCIÓN: Se usa useCallback para estabilizar la función y evitar re-renders en el hijo.
    const handleFilterChange = useCallback((newState) => {
        
        // Comparamos solo la parte relevante (los filtros activos) para romper el ciclo.
        // Si el JSON.stringify de los filtros entrantes es igual al actual, evitamos setState.
        if (JSON.stringify(newState.filters) === JSON.stringify(filterState.filters)) {
            return; // Rompe el bucle si no hay cambio de valor.
        }
    
        setFilterState(newState); 

    }, [filterState]); // Depende de filterState para la comparación

    // LÓGICA CLAVE: Recalcula los servicios filtrados
    const filteredServices = useMemo(() => {
        return filterServices(services, filterState);
    }, [services, filterState]);

    // LÓGICA DE VISIBILIDAD DEL FILTRO
    const showFilterSidebar = true; // Mantener visible para la demo
    
    // Determina la estructura de la cuadrícula
    const gridLayout = showFilterSidebar ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1';
    const contentSpan = showFilterSidebar ? 'lg:col-span-3' : 'lg:col-span-4';

    // 🌟 LÓGICA CLAVE: Control de visibilidad del botón de Solicitudes
    const hasAppointments = appointments.length > 0;

    // 🚀 FUNCIÓN: Cierra el modal y abre la vista de gestión de citas (USADA AQUÍ PARA EL MODAL INTERNO)
    const handleBookingSuccess = useCallback(() => {
        setQuickViewService(null); // Cierra el modal
        setIsManagerOpen(true);    // Muestra la vista de gestión de citas (AppointmentManagerLg)
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">

            <header className="mb-10 pt-4 max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    {isManagerOpen ? 'Gestión de Citas' : 'Nuestros Servicios'} 🏥
                </h1>
                <p className="text-center text-gray-500 mt-2 text-lg">
                    {isManagerOpen
                        ? 'Revisa, modifica o cancela tus servicios agendados.'
                        : 'Cuidado experto y bienestar integral para tu mejor amigo.'
                    }
                </p>

                {/* 🌟 BOTÓN DE TOGGLE DE VISUALIZACIÓN CONDICIONAL 🌟 */}
                {hasAppointments && (
                    <div className="flex justify-center mt-5">
                        <button
                            onClick={() => setIsManagerOpen(prev => !prev)}
                            className="flex items-center px-6 py-2 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-pink-500 hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                        >
                            <FaCalendarAlt className="mr-2" />
                            {isManagerOpen ? '← Volver a Servicios' : `Ver Mis Solicitudes (${appointments.length})`}
                        </button>
                    </div>
                )}
            </header>

            <main className="max-w-screen-2xl mx-auto">
                
                {isManagerOpen ? (
                    /* 1. VISTA DE GESTIÓN DE CITAS */
                    <AppointmentManagerLg />
                ) : (
                    /* 2. VISTA DE LISTA DE SERVICIOS */
                    <div className={`grid ${gridLayout} gap-6`}>

                        {/* 1. BARRA DE FILTROS */}
                        {showFilterSidebar && (
                            <div className="lg:col-span-1">
                                <FilterSidebarLg
                                    onFilterChange={handleFilterChange}
                                    totalResults={filteredServices.length}
                                    mode="services"
                                    // 💡 Pasamos las opciones de clínicas dinámicamente
                                    clinicOptions={clinics.map(c => ({ id: c.id, name: c.name }))} 
                                />
                            </div>
                        )}

                        {/* 2. LISTA DE SERVICIOS FILTRADOS */}
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
                )}
            </main>

            {quickViewService && (
                <ServiceQuickViewModal
                    service={quickViewService}
                    onClose={() => setQuickViewService(null)}
                    // 🚀 Pasamos la función de éxito de reserva para manejar citas desde aquí
                    onAppointmentBooked={handleBookingSuccess} 
                />
            )}
        </div>
    );
};

export default ServicesLg;