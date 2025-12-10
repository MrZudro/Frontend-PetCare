import React, { useState, useMemo, useCallback } from 'react'; 
// 🔑 CLAVE: Importar useNavigate para la redirección
import { useNavigate } from 'react-router-dom'; 

import rawServicesData from '../components/Data/services.json'; 
import rawProductsData from '../components/Data/products.json'; 

// Importaciones de Componentes Comunes
import CarouselLg from '../components/common/CarouselLg'; 
import HeroCarouselCardLg from '../components/common/HeroCarouselCardLg'; 
import ProductCardLg from '../components/products/ProductCardLg'; 
import ServiceCardLg from '../components/services/ServiceCardLg'; 
import QuickViewModalLg from '../components/products/QuickViewModalLg'; 
import ServiceQuickViewModalLg from '../components/services/ServiceQuickViewModalLg'; 

// =================================================================
// 1. FUNCIONES DE UTILIDAD (LocalStorage - Sin cambios)
// =================================================================

const loadWishlistFromLocalStorage = () => {
    try {
        const storedWishlist = localStorage.getItem('wishlistIds');
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
        console.error("Error loading wishlist from local storage:", error);
        return [];
    }
};

const saveWishlistToLocalStorage = (wishlistArray) => {
    try {
        localStorage.setItem('wishlistIds', JSON.stringify(wishlistArray));
    } catch (error) {
        console.error("Error saving wishlist to local storage:", error);
    }
};

const loadCartFromLocalStorage = () => {
    try {
        const storedCart = localStorage.getItem('cartProducts');
        return storedCart ? JSON.parse(storedCart) : []; 
    } catch (error) {
        console.error("Error loading cart from local storage:", error);
        return [];
    }
};

const saveCartToLocalStorage = (cartArray) => {
    try {
        localStorage.setItem('cartProducts', JSON.stringify(cartArray));
    } catch (error) {
        console.error("Error saving cart to local storage:", error);
    }
};


const LandingPageLg = () => {
    
    const navigate = useNavigate(); 
    
    const [quickViewItem, setQuickViewItem] = useState(null); 
    const [wishlist, setWishlist] = useState(loadWishlistFromLocalStorage); 
    
    // --- Lógica de Procesamiento de Datos (Sin cambios) ---
    const productsData = useMemo(() => {
        return (rawProductsData || []).map(p => ({
            ...p,
            salesCount: p.salesCount || Math.floor(Math.random() * 200) + 50
        }));
    }, [rawProductsData]);

    const servicesData = useMemo(() => { /* ... */ return (rawServicesData || []).map(s => ({ ...s, usageCount: s.usageCount || Math.floor(Math.random() * 100) + 10 })); }, [rawServicesData]);
    const popularProducts = useMemo(() => productsData.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 7), [productsData]);
    const popularServices = useMemo(() => servicesData.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 7), [servicesData]);
    const dynamicHeroSlides = useMemo(() => { /* ... */ return popularProducts.slice(0, 3).map((product, index) => ({ id: product.id, title: index === 0 ? `¡MÁS VENDIDO! ${product.name} 🛍️` : `Oferta Única: ${product.name}`, subtitle: `Precio inigualable: $${product.price.toLocaleString('es-CO', { minimumFractionDigits: 0 })} | Marca: ${product.brand}`, linkText: "Ver Productos", linkUrl: `/products`, imageUrl: product.imageUrl })); }, [popularProducts]);
    
    // =================================================================
    // 2. HANDLERS DE INTERACTIVIDAD (Sin cambios)
    // =================================================================

    const handleToggleWishlist = useCallback((itemId) => {
        setWishlist(prevWishlist => {
            const newWishlist = prevWishlist.includes(itemId)
                ? prevWishlist.filter(id => id !== itemId)
                : [...prevWishlist, itemId];
            saveWishlistToLocalStorage(newWishlist);
            return newWishlist;
        });
    }, []);

    const handleRedirectToCart = useCallback(() => {
        navigate('/car'); 
    }, [navigate]);

    // 🚀 FUNCIÓN CLAVE: Redirección después de agendar un servicio
    const handleServiceBookingSuccess = useCallback(() => {
        setQuickViewItem(null); // 1. Cierra el modal
        // 2. Redirige a /services con el estado para abrir el Manager
        navigate('/services', { state: { openManager: true } }); 
    }, [navigate]);

    const handleAddToCart = useCallback((productId, selectedSize, selectedColor) => {
        const currentCart = loadCartFromLocalStorage();
        
        const cartItemId = `${productId}-${selectedSize || 'n/a'}-${selectedColor || 'n/a'}`;
        
        const existingProductIndex = currentCart.findIndex(item => item.cartItemId === cartItemId);

        if (existingProductIndex > -1) {
            currentCart[existingProductIndex].quantity += 1;
        } else {
            currentCart.push({ 
                id: productId, 
                cartItemId: cartItemId, 
                quantity: 1, 
                size: selectedSize, 
                color: selectedColor 
            });
        }
        
        saveCartToLocalStorage(currentCart);
        console.log(`Producto ID ${productId} (${cartItemId}) añadido al carrito.`);
    }, []);
    
    // --- Funciones de Renderizado (Sin cambios) ---
    const renderHeroCard = (item) => ( /* ... */ <HeroCarouselCardLg key={item.id} item={item} /> );
    
    const renderProductCard = (product) => (
        <ProductCardLg 
            key={product.id} 
            product={product} 
            onQuickView={(p) => setQuickViewItem(p)}
            onToggleWishlist={() => handleToggleWishlist(product.id)}
            isWishlisted={wishlist.includes(product.id)}
            onAddToCart={() => handleAddToCart(product.id, null, null)} 
        />
    );

    const renderServiceCard = (service) => ( /* ... */
        <ServiceCardLg
            key={service.id} 
            service={service} 
            onQuickView={(s) => setQuickViewItem({ ...s, isService: true })} 
            onToggleWishlist={() => handleToggleWishlist(service.id)}
            isWishlisted={wishlist.includes(service.id)}
            onRequestAppointment={() => console.log(`Request Appointment servicio ${service.id}`)}
        />
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            
            {/* 🚨 CLAVE: Ajustado el margen inferior a mb-6 para reducir la separación con los productos */}
            {/* Si necesitas un espacio superior, tendrías que añadir pt-X o mt-X aquí o en el div interno. */}
            <header className="w-full mt-15 mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                    <CarouselLg items={dynamicHeroSlides} renderItem={renderHeroCard} isHero={true} />
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8"> 
                
                {/* --- CARRUSEL DE PRODUCTOS --- */}
                <CarouselLg
                    items={popularProducts}
                    renderItem={renderProductCard}
                    title="🛒 Productos Más Comprados"
                    linkText="Ver todos los productos"
                    linkUrl="/products" 
                />
                
                {/* --- CARRUSEL DE SERVICIOS --- */}
                <CarouselLg
                    items={popularServices}
                    renderItem={renderServiceCard}
                    title="🩺 Servicios Más Solicitados"
                    linkText="Ver todos los servicios"
                    linkUrl="/services" 
                />

                {/* Bloque de Call to Action Adicional */}
                <div className="mt-12 p-10 bg-indigo-50 rounded-xl shadow-inner text-center">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-3">
                        ¡Recibe Ofertas Exclusivas!
                    </h3>
                    <p className="text-indigo-600 mb-4">
                        Suscríbete a nuestro boletín y obtén un 10% de descuento en tu primera compra.</p>
                    <button 
                        className="inline-block bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition" 
                        >Suscribirme
                    </button>
                    </div>

            </main>

            {/* MODAL DE VISTA PREVIA PARA PRODUCTOS */}
            {quickViewItem && !quickViewItem.isService && (
                <QuickViewModalLg
                    product={quickViewItem} 
                    onClose={() => setQuickViewItem(null)}
                    onAddToCart={handleAddToCart}           
                    onRedirectToCart={handleRedirectToCart} 
                />
            )}

            {/* MODAL DE VISTA PREVIA PARA SERVICIOS */}
            {quickViewItem && quickViewItem.isService && (
                <ServiceQuickViewModalLg
                    service={quickViewItem} 
                    onClose={() => setQuickViewItem(null)}
                    // 🚀 FUNCIÓN DE ÉXITO CON REDIRECCIÓN
                    onAppointmentBooked={handleServiceBookingSuccess} 
                />
            )}
        </div>
    );
};

export default LandingPageLg;