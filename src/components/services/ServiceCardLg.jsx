import React from 'react';
import ProductCardLg from '../products/ProductCardLg'; 


const ServiceCardLg = ({ service, onQuickView, onToggleWishlist, isWishlisted }) => {
    
    // Adaptamos el servicio al shape del producto.
    const adaptedService = {
        // ... (Lógica de adaptación sin cambios)
        ...service,
        subcategories: service.clinicName || "Clínica Asociada",
        category: "Servicio",
        price: 0.00, 
    };

    return (
        // 🚨 CLAVE: Ajustamos la clase de envoltura para definir una altura más pequeña
        <div className="service-card h-80"> 
            
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
                .service-card .flex.justify-between.items-center.pt-3.border-t.border-gray-100.mt-3 {
                    justify-content: flex-start !important;
                    border-top: none !important; 
                    padding-top: 0 !important;
                    margin-top: 0 !important;
                }
                
                /* 🚨 CLAVE: Forzamos la altura del componente interno ProductCardLg
                   para que se ajuste al tamaño deseado para el servicio. */
                .service-card > div { 
                    height: 100% !important; /* Asegura que ProductCardLg tome la altura del wrapper */
                }
            `}</style>

            <ProductCardLg 
                product={adaptedService} 
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                onRemove={() => {}}
                isWishlisted={isWishlisted}
            />
        </div>
    );
};

export default ServiceCardLg;