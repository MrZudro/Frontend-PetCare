import React from 'react';
import ProductCardLg from '../products/ProductCardLg'; 

/**
 * Adaptador que reutiliza ProductCardLg para Servicios.
 * * CAMBIO CLAVE: Asigna service.clinicName a la propiedad 'category' 
 * para que ProductCardLg muestre el nombre de la veterinaria 
 * en el lugar donde normalmente iría la categoría.
 */
const ServiceCardLg = ({ service, onQuickView, onToggleWishlist, isWishlisted }) => {
    
    // Adaptamos el servicio al shape del producto.
    const adaptedService = {
        ...service,
        // 🌟 CAMBIO CLAVE: Reemplazar la 'category' real por el nombre de la clínica
        // Esto asume que ProductCardLg renderiza 'category' en una posición visible.
        category: service.clinicName || "Clínica Asociada",
        
        // Forzamos un precio para que el componente ProductCardLg no falle, aunque lo ocultaremos
        price: 0.00, 
    };

    return (
        <div className="service-card"> {/* Clase de identificación */}
            
            {/* INYECCIÓN DE CSS NECESARIA PARA OCULTAR ELEMENTOS EN LA TARJETA BASE */}
            <style>{`
                /* Oculta el precio en la tarjeta */
                .service-card .text-xl.font-bold { 
                    display: none !important;
                }
                /* Oculta Wishlist/Carrito en la tarjeta */
                .service-card .flex.items-center.space-x-2 { 
                    display: none !important;
                }
                /* Limpia el layout inferior de la tarjeta */
                .service-card .flex.justify-between.items-center.pt-2.border-t.border-gray-100.mt-2 {
                    justify-content: flex-start !important;
                    border-top: none !important; 
                    padding-top: 0 !important;
                    margin-top: 0 !important;
                }
                /* Estilos opcionales para destacar el clinicName */
                .service-card .text-sm.font-medium.text-gray-500 {
                    font-weight: 600 !important; /* Semi-negrita */
                    color: #4f46e5 !important; /* Color índigo */
                }
            `}</style>

            <ProductCardLg 
                product={adaptedService} 
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted}
            />
        </div>
    );
};

export default ServiceCardLg;