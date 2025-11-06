import React, { useState, useMemo, useCallback } from 'react'; // 💡 Importado useCallback
// Rutas de importación ajustadas asumiendo una estructura relativa
import ProductCard from '../components/products/ProductCardLg';
import QuickViewModal from '../components/products/QuickViewModalLg';
import FilterSidebarLg from '../components/common/FilterSidebarLg';
// import Pagination from '../common/PaginacionLg'; 
import initialProducts from '../components/Data/products.json'; 
import categoriesMap from '../components/Data/categories.json'; 


// --- [ LÓGICA DE ORDENAMIENTO y FILTRADO - (Sin Cambios) ] ---
const sortProducts = (products, sortKey) => {
    // ... (Tu lógica de sort) ...
    if (!sortKey || sortKey === 'default') {
        return products;
    }
    const sorted = [...products];
    switch (sortKey) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name)); // CORREGIDO: Ordena por nombre descendente (Z-A)
        default:
            return products;
    }
};

const filterProducts = (products, filterState) => {
    // ... (Tu lógica de filter) ...
    const activeCategories = filterState.filters.category || [];
    const activeSubcategories = filterState.filters.subcategories || [];
    const activeBrands = filterState.filters.brand || [];
    const searchTerm = filterState.searchTerm?.toLowerCase() || '';

    if (activeCategories.length === 0 && activeSubcategories.length === 0 && activeBrands.length === 0 && !searchTerm) {
        return products;
    }

    return products.filter(product => {
        let passesCategory = true;
        let passesSubcategory = true;
        let passesBrand = true;
        let passesSearch = true; 
        const productSubcategory = product.subcategories; 

        if (activeCategories.length > 0) {
            const activeCategoryName = activeCategories[0];
            const productCategory = categoriesMap.find(c => c.subcategories.includes(productSubcategory))?.categoryName;
            passesCategory = (productCategory === activeCategoryName);
        }
        if (activeSubcategories.length > 0) {
            passesSubcategory = activeSubcategories.includes(productSubcategory);
        }
        if (activeBrands.length > 0) {
            passesBrand = activeBrands.includes(product.brand);
        }
        if (searchTerm) {
            passesSearch = product.name.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm));
        }
        return passesCategory && passesSubcategory && passesBrand && passesSearch;
    });
};


// 💡 Función auxiliar para cargar la lista de deseos desde LocalStorage
const loadWishlistFromLocalStorage = () => {
    try {
        const storedWishlist = localStorage.getItem('wishlistIds');
        // Devuelve el array de IDs parseado o un array vacío si no existe
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
        console.error("Error al cargar la lista de deseos del LocalStorage", error);
        return [];
    }
};

// 💡 Función auxiliar para guardar la lista de deseos en LocalStorage
const saveWishlistToLocalStorage = (wishlistArray) => {
    try {
        localStorage.setItem('wishlistIds', JSON.stringify(wishlistArray));
    } catch (error) {
        console.error("Error al guardar la lista de deseos en el LocalStorage", error);
    }
};


const ProductsLg = () => {
    // 🌟 INICIALIZAR el estado de la lista de deseos desde LocalStorage 🌟
    const [wishlist, setWishlist] = useState(loadWishlistFromLocalStorage);
    
    // Estados de datos
    const [products] = useState(initialProducts);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    
    // Estados de filtrado y ordenamiento
    const [sortKey, setSortKey] = useState('default');
    const [filterState, setFilterState] = useState({ filters: {}, searchTerm: '', mode: 'products' });


    // Handlers (sin cambios)
    const handleQuickView = (product) => {
        setQuickViewProduct(product);
    };

    // 🎯 MODIFICACIÓN: Actualiza el LocalStorage después de cambiar el estado 
    const handleToggleWishlist = (productId) => {
        setWishlist(prevWishlist => {
            let newWishlist;
            
            if (prevWishlist.includes(productId)) {
                // Quitar ID
                newWishlist = prevWishlist.filter(id => id !== productId);
            } else {
                // Añadir ID
                newWishlist = [...prevWishlist, productId];
            }
            
            // 🚨 Guardar la nueva lista en el LocalStorage inmediatamente después
            saveWishlistToLocalStorage(newWishlist);
            
            return newWishlist;
        });
    };

    const handleRemoveProduct = (id) => {
        console.log(`Demo: Intentando remover producto con ID ${id}.`);
    };

    // 🛑 CORRECCIÓN CRÍTICA (Línea ~134): Uso de useCallback y comparación profunda
    const handleFilterChange = useCallback((newState) => {
        
        // Comparamos el objeto de filtros entrantes con el estado actual
        if (JSON.stringify(newState.filters) === JSON.stringify(filterState.filters)) {
            return; // Rompe el bucle si no hay cambio de valor.
        }

        setFilterState(newState); 
    }, [filterState]); // Depende de filterState para la comparación

    const handleSortChange = (newSortKey) => {
        setSortKey(newSortKey);
    };

    // Lógica principal: filtra y luego ordena (Uso de useMemo)
    const filteredAndSortedProducts = useMemo(() => {
        const filtered = filterProducts(products, filterState);
        return sortProducts(filtered, sortKey);
    }, [products, filterState, sortKey]);

    
    // LÓGICA DE LAYOUT
    const showFilterSidebar = products.length > 1; 
    const gridLayout = showFilterSidebar ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1';
    const contentSpan = showFilterSidebar ? 'lg:col-span-3' : 'lg:col-span-4';


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">

            <header className="mb-10 pt-4">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    Productos🐾
                </h1>
                <p className="text-center text-gray-500 mt-2 text-lg">
                    Todo lo que tu perro y gato necesitan para una vida feliz y sana.
                </p>
            </header>

            <main className="max-w-screen-2xl mx-auto">
                <div className={`grid ${gridLayout} gap-6`}>

                    {/* 1. BARRA DE FILTROS */}
                    {showFilterSidebar && (
                        <div className="lg:col-span-1">
                            <FilterSidebarLg
                                onFilterChange={handleFilterChange} // Ahora es estable con useCallback
                                onSortChange={handleSortChange}
                                totalResults={filteredAndSortedProducts.length}
                                mode="products"
                            />
                        </div>
                    )}

                    {/* 2. CONTENIDO PRINCIPAL (Cuadrícula) */}
                    <div className={`${contentSpan}`}>
                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
                                <p className="text-xl text-gray-700 font-bold">No se encontraron productos que coincidan con los filtros aplicados. 🔎</p>
                                <p className="text-gray-500 mt-2">Intenta limpiar los filtros o ajusta tu búsqueda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {/* Mapea los productos */}
                                {filteredAndSortedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickView={handleQuickView}
                                        onRemove={handleRemoveProduct}
                                        onToggleWishlist={handleToggleWishlist}
                                        // La prop isWishlisted usa el estado cargado/actualizado
                                        isWishlisted={wishlist.includes(product.id)} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>

            {/* Renderiza el modal de vista rápida */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                />
            )}
        </div>
    );
}

export default ProductsLg;