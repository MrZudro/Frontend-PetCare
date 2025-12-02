import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Importamos Axios
import api from '../services/axiosConfig';

// Importamos el servicio de citas
import { appointmentService } from '../services/appointmentService';

// IMPORTAMOS LOS COMPONENTES ADAPTADORES
import ServiceCard from '../components/services/ServiceCardLg';
import ServiceQuickViewModal from '../components/services/ServiceQuickViewModalLg';
import AppointmentManagerLg from '../components/services/AppointmentManagerLg';
import SimpleFilterSidebar from '../components/common/SimpleFilterSidebar';
import { FaCalendarAlt } from 'react-icons/fa';

const ServicesLg = () => {
    // 🔑 Leemos el estado de navegación
    const location = useLocation();
    const initialIsManagerOpen = location.state?.openManager || false;
    const preSelectedClinic = location.state?.clinicName || null;

    // 💡 Estado para el conteo de citas PENDING/CONFIRMED desde la API
    const [pendingOrConfirmedCount, setPendingOrConfirmedCount] = useState(0);

    // Estados para datos del API
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [quickViewService, setQuickViewService] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [isManagerOpen, setIsManagerOpen] = useState(initialIsManagerOpen);

    // Estado de filtros simplificado con pre-filtro de clínica
    const [activeFilters, setActiveFilters] = useState({
        clinic: preSelectedClinic
    });

    // 🚀 FETCH DE SERVICIOS DESDE EL API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/services');

                // Transformar los datos del backend al formato que espera el frontend
                const transformedServices = response.data.map(service => ({
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    imageUrl: service.imageUrl || service.picture || 'https://placehold.co/600x400/A0B9E2/000000?text=Servicio',
                    status: service.status,
                    // Crear array de nombres de clínicas para el filtrado
                    clinicNames: service.clinics?.map(clinic => clinic.name) || [],
                    // Guardar también las clínicas completas por si se necesitan
                    clinics: service.clinics || []
                }));

                setServices(transformedServices);
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('Error al cargar los servicios. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // 🚀 FETCH DEL CONTEO DE CITAS PENDING/CONFIRMED DESDE LA API
    useEffect(() => {
        const fetchPendingConfirmedCount = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user || !user.id) {
                    setPendingOrConfirmedCount(0);
                    return;
                }

                const response = await appointmentService.getByCustomer(user.id);
                const appointments = response.data;

                // Filtrar solo PENDING o CONFIRMED
                const pendingOrConfirmed = appointments.filter(
                    app => app.status === 'PENDING' || app.status === 'CONFIRMED'
                );

                setPendingOrConfirmedCount(pendingOrConfirmed.length);
            } catch (err) {
                console.error('Error fetching appointments count:', err);
                setPendingOrConfirmedCount(0);
            }
        };

        fetchPendingConfirmedCount();
    }, [isManagerOpen]); // Refrescar cuando se cierra/abre el manager

    // --- LÓGICA DE FILTRADO OPTIMIZADA ---
    const filteredServices = useMemo(() => {
        return services.filter(service => {
            // Filtro de clínica
            if (activeFilters.clinic) {
                return service.clinicNames?.includes(activeFilters.clinic);
            }
            return true;
        });
    }, [services, activeFilters]);

    // --- PREPARAR OPCIONES DE FILTROS ---
    const filterOptions = useMemo(() => {
        const clinicCounts = {};

        services.forEach(service => {
            service.clinicNames?.forEach(clinicName => {
                clinicCounts[clinicName] = (clinicCounts[clinicName] || 0) + 1;
            });
        });

        return {
            clinic: {
                label: 'Filtrar por Veterinaria',
                type: 'radio',
                options: Object.entries(clinicCounts)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([name, count]) => ({
                        value: name,
                        label: name,
                        count
                    }))
            }
        };
    }, [services]);

    // --- HANDLERS ---
    const handleFilterChange = (filterKey, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };

            // Si hace clic en el mismo filtro, lo deselecciona
            if (newFilters[filterKey] === value) {
                newFilters[filterKey] = null;
            } else {
                newFilters[filterKey] = value;
            }

            return newFilters;
        });
    };

    const handleClearFilters = () => {
        setActiveFilters({
            clinic: null
        });
    };

    const handleQuickView = (service) => {
        setQuickViewService(service);
    };

    const handleToggleWishlist = (serviceId) => {
        console.log(`Wishlist toggled for service: ${serviceId}`);
        setWishlist(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    // 🚀 FUNCIÓN: Cierra el modal y abre la vista de gestión de citas
    const handleBookingSuccess = () => {
        setQuickViewService(null);
        setIsManagerOpen(true);
    };

    // 🌟 LÓGICA CLAVE: Control de visibilidad del botón de Solicitudes
    // El conteo ya viene desde la API filtrado por PENDING o CONFIRMED
    const hasAppointments = pendingOrConfirmedCount > 0;

    // Renderizado condicional basado en el estado de carga
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full size-16 border-t-4 border-b-4 border-primary mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando servicios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="size-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

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
                            {isManagerOpen ? '← Volver a Servicios' : `Ver Mis Solicitudes (${pendingOrConfirmedCount})`}
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
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar de Filtros */}
                        <div className="lg:col-span-1">
                            <SimpleFilterSidebar
                                filters={filterOptions}
                                activeFilters={activeFilters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                                totalResults={filteredServices.length}
                            />
                        </div>

                        {/* Lista de Servicios */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                            {filteredServices.length === 0 && services.length > 0 && (
                                <div className="sm:col-span-2 lg:col-span-3 p-10 text-center bg-white rounded-xl shadow-md">
                                    <p className="text-xl font-semibold text-gray-700">
                                        No se encontraron servicios que coincidan con los filtros aplicados. 😔
                                    </p>
                                    <p className="text-gray-500 mt-2">
                                        Intenta ajustar tu selección de clínica o{' '}
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            limpia el filtro
                                        </button>
                                    </p>
                                </div>
                            )}

                            {/* Caso especial: No hay servicios en total */}
                            {services.length === 0 && !loading && (
                                <div className="sm:col-span-2 lg:col-span-3 p-10 text-center bg-white rounded-xl shadow-md">
                                    <p className="text-xl font-semibold text-gray-700">
                                        No hay servicios disponibles en este momento. 😔
                                    </p>
                                    <p className="text-gray-500 mt-2">
                                        Por favor, contacte al administrador.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Modal de Vista Rápida */}
            {quickViewService && (
                <ServiceQuickViewModal
                    service={quickViewService}
                    onClose={() => setQuickViewService(null)}
                    onAppointmentBooked={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default ServicesLg;