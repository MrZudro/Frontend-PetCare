import React from 'react';
import ProductCardLg from '../products/ProductCardLg'; 

/**
 * Adaptador que reutiliza ProductCardLg para Servicios.
 * INCLUYE ESTILOS LOCALES MÍNIMOS para ocultar Precio y Botones de la tarjeta.
 */
const ServiceCardLg = ({ service, onQuickView, onToggleWishlist, isWishlisted }) => {
    
    // Adaptamos el servicio al shape del producto.
    const adaptedService = {
        ...service,
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