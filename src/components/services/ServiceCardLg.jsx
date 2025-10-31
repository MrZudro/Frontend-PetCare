import React from 'react';
import ProductCardLg from '../products/ProductCardLg'; 


const ServiceCardLg = ({ service, onQuickView, onToggleWishlist, isWishlisted }) => {
    
    // Adaptamos el servicio al shape del producto.
    const adaptedService = {
        ...service,
        // 🌟 CORRECCIÓN CLAVE: Asignar el nombre de la clínica a 'subcategories' 🌟
        // para que se renderice como la etiqueta de color.
        subcategories: service.clinicName || "Clínica Asociada",
        
        // La 'category' original del servicio puede ser nula o "Servicio" si es necesario, 
        // pero ProductCardLg esperará una cadena.
        category: "Servicio", // Opcional: Puedes dejarlo en blanco o poner un valor genérico.
        
        // Forzamos un precio para que el componente ProductCardLg no falle, aunque lo ocultaremos
        price: 0.00, 
    };

    return (
        <div className="service-card"> {/* Clase de identificación */}
            
            {/* 🚨 CSS ELIMINADO: Ya no necesitamos sobrescribir estilos para la 'category' */}
            {/* El estilo de la etiqueta de subcategoría (clinicName) será el predeterminado de ProductCardLg */}
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
                /* Ya no necesitamos sobrescribir el estilo de la categoría */
                /* .service-card .text-sm.font-medium.text-gray-500 {
                    font-weight: 600 !important;
                    color: #4f46e5 !important;
                } */
            `}</style>

            <ProductCardLg 
                product={adaptedService} 
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                onRemove={() => {}} // Añadir onRemove dummy para evitar errores si ProductCardLg lo espera
                isWishlisted={isWishlisted}
            />
        </div>
    );
};

export default ServiceCardLg;