import React from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa'; 
import { FiShoppingCart } from 'react-icons/fi';
// 1. IMPORTAMOS LA LÓGICA
import { addToCart } from '../buyCart/CartUtils'; 

const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

const ProductCardLg = ({ product, onQuickView, onToggleWishlist, isWishlisted }) => {
    
    const HeartIcon = isWishlisted ? FaHeart : FaRegHeart;
    const heartColor = isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500";

    const handleCardClick = (e) => {
        const target = e.target;
        const isInteractiveButton = target.closest('button[aria-label="Quitar de Wishlist"], button[aria-label="Añadir a Wishlist"], button[aria-label="Añadir al carrito"]');

        if (!isInteractiveButton) {
            onQuickView(product);
        }
    };

    // 2. FUNCIÓN INTERMEDIA PARA MANEJAR EL CLICK Y DAR FEEDBACK
    const handleAddToCart = (e) => {
        e.stopPropagation(); // Evita abrir el QuickView
        
        addToCart(product.id); // Llamamos a nuestra utilidad
        
        // Aquí puedes poner una alerta o un Toast bonito
        alert(`¡${product.name} agregado al carrito!`); 
    };

    return (
        <div 
            className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer transition duration-300 ease-in-out border border-gray-200 group 
                        w-full max-w-xs mx-auto hover:shadow-2xl"
            onClick={handleCardClick}
        >
            <div className="relative">
                <img 
                    src={product.imageUrl} 
                    alt={product.name} // Corregido: usualmente es product.name si no tienes imageAlt
                    className="w-full h-60 object-cover bg-gray-200 transition-opacity duration-300 group-hover:opacity-90" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/6b7280/ffffff?text=No+Image'; }}
                />
                
                <span className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500 text-white shadow-md">
                    {product.subcategories}
                </span>
            </div>

            <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight" title={product.name}>
                    {product.name}
                </h3>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                    <span className="text-xl font-bold text-indigo-600">
                        ${product.price.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                        
                        {/* Wishlist */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 active:scale-95"
                            aria-label={isWishlisted ? "Quitar de Wishlist" : "Añadir a Wishlist"}
                        >
                            <HeartIcon className={combineClasses("w-5 h-5", heartColor)} />
                        </button>
                        
                        {/* Carrito */}
                        <button 
                            onClick={handleAddToCart} // 3. USAMOS EL NUEVO MANEJADOR
                            className="p-2 rounded-full text-gray-400 hover:text-green-500 transition-colors duration-200 active:scale-95 flex items-center justify-center"
                            aria-label="Añadir al carrito"
                        >
                            <FiShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardLg;