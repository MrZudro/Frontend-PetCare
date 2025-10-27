import React, { useState, useMemo, useEffect } from 'react';
// IMPORTACIÓN ACTUAL: Usando JSON. LISTO PARA SER REEMPLAZADO por fetch/axios y useEffect
import initialProducts from '../components/Data/products.json'; 
// Asegúrate de que la ruta a ProductCardLg y QuickViewModalLg sea correcta
import ProductCard from '../components/products/ProductCardLg'; 
import QuickViewModal from '../components/products/QuickViewModalLg'; 
// NUEVA IMPORTACIÓN: El componente de barra lateral de filtros
import FilterSidebarLg from '../components/common/FilterSidebarLg'; 

const ProductsLg = () => {
    // Definición de estados
    const [products, setProducts] = useState(initialProducts);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    
    // ESTADOS PARA FILTRO Y ORDENAMIENTO
    const [currentFilters, setCurrentFilters] = useState({});
    const [currentSort, setCurrentSort] = useState('default');

    // Maneja la actualización de los filtros desde el Sidebar
    const handleFilterChange = ({ filters, searchTerm, mode }) => {
        // Solo nos interesa el objeto 'filters' para la lógica aquí
        setCurrentFilters(filters);
    };

    // Maneja la actualización del ordenamiento desde el Sidebar
    const handleSortChange = (sortKey) => {
        setCurrentSort(sortKey);
    };

    /**
     * LÓGICA DE FILTRADO Y ORDENAMIENTO CENTRAL
     * Usa useMemo para recalcular la lista solo cuando cambien products, currentFilters o currentSort.
     */
    const filteredAndSortedProducts = useMemo(() => {
        let list = [...products];

        // 1. FILTRADO
        const activeFilters = Object.keys(currentFilters).reduce((acc, key) => {
            const activeValues = currentFilters[key]
                ?.filter(f => f.active)
                .map(f => f.name);
            if (activeValues && activeValues.length > 0) {
                acc[key] = activeValues;
            }
            return acc;
        }, {});

        // Aplicar filtros
        if (Object.keys(activeFilters).length > 0) {
            list = list.filter(product => {
                let matchesAllActiveFilters = true;

                // Para cada grupo de filtros activos (e.g., category, brand, type)
                for (const key of Object.keys(activeFilters)) {
                    const filterValues = activeFilters[key];
                    const productValue = product[key];
                    
                    // Nota: 'clinic' en servicios, 'brand/type' en productos. Usamos la clave del filtro.
                    if (key === 'brand') { // Caso especial: El filtro de marca es simple
                        if (!filterValues.includes(productValue)) {
                            matchesAllActiveFilters = false;
                            break;
                        }
                    } else { // Asumimos que category, type son simples (o implementa lógica OR si es necesario)
                         if (!filterValues.includes(productValue)) {
                            matchesAllActiveFilters = false;
                            break;
                        }
                    }
                }
                return matchesAllActiveFilters;
            });
        }

        // 2. ORDENAMIENTO
        if (currentSort !== 'default') {
            list.sort((a, b) => {
                switch (currentSort) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    default:
                        return 0;
                }
            });
        }
        
        return list;
    }, [products, currentFilters, currentSort]); // Dependencias para la re-ejecución

    // Maneja la acción de Vista Rápida
    const handleQuickView = (product) => {
        setQuickViewProduct(product);
    };

    // Maneja el toggle de Wishlist
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

            {/* CONTENEDOR PRINCIPAL: Grid para Sidebar + Contenido */}
            <main className="max-w-screen-2xl mx-auto grid lg:grid-cols-[280px_1fr] gap-8">
                
                {/* COLUMNA 1: SIDEBAR DE FILTROS */}
                <div>
                    <FilterSidebarLg 
                        onFilterChange={handleFilterChange}
                        onSortChange={handleSortChange}
                        totalResults={filteredAndSortedProducts.length}
                        mode="products" // Modo: Productos (para renderizar los filtros correctos)
                    />
                </div>

                {/* COLUMNA 2: LISTA DE PRODUCTOS */}
                <section>
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-0 border border-gray-200">
                            <p className="text-2xl text-red-500 font-bold">
                                ¡No se encontraron productos con estos filtros! 😿
                            </p>
                            <p className="text-gray-600 mt-2">
                                Intenta limpiar algunos filtros para ver más resultados.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* GRANDE Y EXTRA GRANDE: Transición fluida de 1 -> 2 -> 3 -> 4 -> 5 -> 6 columnas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
                                {filteredAndSortedProducts.map(product => (
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
                </section>
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