import React, { useState } from 'react';
// IMPORTACIÓN ACTUAL: Usando JSON. LISTO PARA SER REEMPLAZADO por fetch/axios y useEffect
import initialProducts from '../components/Data/products.json'; 
// Asegúrate de que la ruta a ProductCardLg y QuickViewModalLg sea correcta
import ProductCard from '../components/products/ProductCardLg'; 
import QuickViewModal from '../components/products/QuickViewModalLg'; 

const ProductsLg= () => {
    // Definición de estados
    const [products, setProducts] = useState(initialProducts);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    // Maneja la acción de Vista Rápida
    const handleQuickView = (product) => {
        setQuickViewProduct(product);
    };

    /**
     * FUNCIÓN CENTRAL DE WISHLIST: Usa la variable 'wishlist' para el toggle.
     */
    const handleToggleWishlist = (productId) => {
        setWishlist(prevWishlist => {
            if (prevWishlist.includes(productId)) {
                console.log(`Producto ${productId} ELIMINADO de Wishlist.`);
                return prevWishlist.filter(id => id !== productId);
            } else {
                console.log(`Producto ${productId} AÑADIDO a Wishlist.`);
                return [...prevWishlist, productId];
            }
        });
    };
    
    // Función de remoción (mantengo el placeholder)
    const handleRemoveProduct = (id) => {
        console.log(`Demo: Intentando remover producto con ID ${id}.`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            {/* INYECCIÓN DE ESTILOS (Solo para el entorno de demostración) */}
            <script src="https://cdn.tailwindcss.com"></script>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                body { font-family: 'Inter', sans-serif; }
            `}</style>
            
            <header className="mb-10 pt-4">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    Productos🐾
                </h1>
                <p className="text-center text-gray-500 mt-2 text-lg">
                    Todo lo que tu perro y gato necesitan para una vida feliz y sana.
                </p>
            </header>

            {/* CONTENEDOR AJUSTADO A max-w-screen-2xl para pantallas más grandes */}
            <main className="max-w-screen-2xl mx-auto">
                {products.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
                        <p className="text-2xl text-red-500 font-bold">¡Catálogo temporalmente vacío! 😿</p>
                        <p className="text-gray-600 mt-2">Regresa pronto para ver nuestras novedades.</p>
                    </div>
                ) : (
                    <>
                        {/* GRANDE Y EXTRA GRANDE: Transición fluida de 1 -> 2 -> 3 -> 4 -> 5 -> 6 columnas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
                            {products.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onQuickView={handleQuickView}
                                    onRemove={handleRemoveProduct}
                                    // PROPS DE WISHLIST
                                    onToggleWishlist={handleToggleWishlist}
                                    isWishlisted={wishlist.includes(product.id)} // VERIFICA si el ID está en la lista
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* Renderiza el modal solo si quickViewProduct tiene un valor */}
            {quickViewProduct && (
                <QuickViewModal 
                    product={quickViewProduct} 
                    onClose={() => setQuickViewProduct(null)} 
                />
            )}
        </div>
    );
};

export default ProductsLg;