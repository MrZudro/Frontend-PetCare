import React, { useState } from 'react';
// IMPORTAMOS LOS COMPONENTES ADAPTADORES
import ServiceCard from '../components/services/ServiceCardLg'; 
import ServiceQuickViewModal from '../components/services/ServiceQuickViewModalLg'; 

// IMPORTAR los datos simulados de servicios (Asegúrate de ajustar esta ruta)
import servicesData from '../components/Data/services.json'; 

const ServicesLg = () => {
    const [services] = useState(servicesData);
    const [quickViewService, setQuickViewService] = useState(null);
    const [wishlist, setWishlist] = useState([]);

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
                /* CSS PARA OCULTAR ELEMENTOS DE PRODUCTO EN LAS TARJETAS DE SERVICIO */
                /* ========================================================= */
                /* Usamos la clase .service-card que ServiceCard añade */
                .service-card .text-xl.font-bold { /* Oculta el precio en la tarjeta */
                    display: none !important;
                }
                .service-card .flex.items-center.space-x-2 { /* Oculta Wishlist/Carrito en la tarjeta */
                    display: none !important;
                }
                /* Ajusta el layout para que el nombre ocupe el espacio sin los botones */
                .service-card .flex.justify-between.items-center.pt-2.border-t.border-gray-100.mt-2 {
                    justify-content: flex-start !important; /* Alinea a la izquierda si no hay botones */
                    border-top: none !important; /* Elimina la línea si no hay contenido debajo del nombre */
                    padding-top: 0 !important;
                    margin-top: 0 !important;
                }

                /* ========================================================= */
                /* CSS PARA EL MODAL DE VISTA RÁPIDA DE SERVICIO */
                /* ========================================================= */
                /* Usamos la clase .service-modal que ServiceQuickViewModal añade */
                
                /* 1. Ocultar el precio en el modal (selectores más específicos para asegurar) */
                .service-modal .text-3xl.font-extrabold.text-indigo-600.mt-2 {
                    display: none !important;
                }

                /* 2. Cambiar el texto del botón del modal a "Agendar Servicio" y quitar el icono de carrito */
                /* Nota: El icono de carrito ya no debería aparecer si no hay productos ni opciones.
                         Pero para el texto, podemos sobrescribirlo directamente con CSS si es necesario. */
                .service-modal button[type="submit"] {
                    /* Esto es más robusto que ::after si el texto original se renderiza directamente */
                    font-size: 0 !important; /* Oculta el texto original "Añadir al Carrito" */
                    position: relative;
                }
                .service-modal button[type="submit"]::before {
                    content: "Agendar Servicio"; /* Inserta el nuevo texto */
                    font-size: 1rem; /* Tamaño de fuente para el nuevo texto */
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white; /* Color del texto del nuevo botón */
                }
                /* Si ProductCardLg o QuickViewModalLg tuviera un icono de carrito dentro del botón, también se ocultaría */
                .service-modal button[type="submit"] svg {
                    display: none !important;
                }
            `}</style>
            
            <header className="mb-10 pt-4">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    Nuestros Servicios 🏥
                </h1>
                <p className="text-center text-gray-500 mt-2 text-lg">
                    Cuidado experto y bienestar integral para tu mejor amigo.
                </p>
            </header>

            <main className="max-w-screen-2xl mx-auto">
                {services.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
                        <p className="text-2xl text-red-500 font-bold">¡Catálogo de Servicios temporalmente vacío! 😿</p>
                        <p className="text-gray-600 mt-2">Pronto añadiremos más opciones de cuidado.</p>
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
                )}
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