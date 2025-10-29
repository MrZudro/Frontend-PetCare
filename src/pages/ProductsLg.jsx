import React, { useState, useMemo } from 'react';
import ProductCard from '../components/products/ProductCardLg';
import QuickViewModal from '../components/products/QuickViewModalLg';
import FilterSidebarLg from '../components/common/FilterSidebarLg';
import initialProducts from '../components/Data/products.json'; 
import categoriesMap from '../components/Data/categories.json'; 


// --- [ LÓGICA DE ORDENAMIENTO ] ---
const sortProducts = (products, sortKey) => {
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
            // Si no hay 'rating' real, se ordena por nombre
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return products;
    }
};

// --- [ LÓGICA DE FILTRADO CORREGIDA ] ---
const filterProducts = (products, filterState) => {
    // 1. Extraer los filtros activos como ARRAYS de nombres
    const activeCategories = filterState.filters.category || [];
    const activeSubcategories = filterState.filters.subcategories || [];
    const activeBrands = filterState.filters.brand || [];
    const searchTerm = filterState.searchTerm?.toLowerCase() || '';

    // Si no hay filtros o búsqueda, retornar todos los productos
    if (activeCategories.length === 0 && activeSubcategories.length === 0 && activeBrands.length === 0 && !searchTerm) {
        return products;
    }

    returproducts.filter(product => {
        let passesCategory = true;
        let passesSubcategory = true;
        let passesBrand = true;
        let passesSearch = true;

        // 🚨 CORRECCIÓN: Usar 'subcategories' en lugar de 'type'
        const productSubcategory = product.subcategories; 

        // --- Criterios de Filtrado ---

        // 1. Filtrar por Categoría (Radio Button - array de 0 o 1 elemento)
        if (activeCategories.length > 0) {
            const activeCategoryName = activeCategories[0];
            // 🎯 Buscar en la clave 'subcategories' del mapa
            const productCategory = categoriesMap.find(c => c.subcategories.includes(productSubcategory))?.categoryName;
            passesCategory = (productCategory === activeCategoryName);
        }

        // 2. Filtrar por Subcategoría (Checkbox - array de 0 o más elementos)
        if (activeSubcategories.length > 0) {
            passesSubcategory = activeSubcategories.includes(productSubcategory);
        }

        // 3. Filtrar por Marca (Radio Button - array de 0 o 1 elemento)
        if (activeBrands.length > 0) {
            passesBrand = activeBrands.includes(product.brand);
        }

        // 4. Filtrar por Búsqueda de Texto
        if (searchTerm) {
            passesSearch = product.name.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm));
        }

        // El producto debe pasar TODOS los filtros activos
        return passesCategory && passesSubcategory && passesBrand && passesSearch;
    });
};


const ProductsLg = () => {
    // Estados de datos
    const [products] = useState(initialProducts);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    // Estados de filtrado y ordenamiento
    const [sortKey, setSortKey] = useState('default');
    const [filterState, setFilterState] = useState({ filters: {}, searchTerm: '', mode: 'products' });


    // Handlers (sin cambios)
    const handleQuickView = (product) => {
        setQuickViewProduct(product);
    };

    const handleToggleWishlist = (productId) => {
        setWishlist(prevWishlist => {
            if (prevWishlist.includes(productId)) {
                return prevWishlist.filter(id => id !== productId);
            } else {
                return [...prevWishlist, productId];
            }
        });
    };

    const handleRemoveProduct = (id) => {
        console.log(`Demo: Intentando remover producto con ID ${id}.`);
    };

    const handleFilterChange = (newState) => {
        setFilterState(newState);
    };

    const handleSortChange = (newSortKey) => {
        setSortKey(newSortKey);
    };

    // Lógica principal: filtra y luego ordena (Uso de useMemo)
    const filteredAndSortedProducts = useMemo(() => {
        const filtered = filterProducts(products, filterState);
        return sortProducts(filtered, sortKey);
    }, [products, filterState, sortKey]);

    
    // 🌟 LÓGICA CLAVE: Ocultar filtro si hay 1 o 0 productos inicialmente 🌟
    const showFilterSidebar = products.length > 1; 

    // Ajuste de la cuadrícula basado en la visibilidad del filtro
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
                {/* 🌟 APLICACIÓN DEL LAYOUT DINÁMICO 🌟 */}
                <div className={`grid ${gridLayout} gap-6`}>

                    {/* 1. BARRA DE FILTROS: Renderizado Condicional */}
                    {showFilterSidebar && (
                        <div className="lg:col-span-1">
                            <FilterSidebarLg
                                onFilterChange={handleFilterChange}
                                onSortChange={handleSortChange}
                                totalResults={filteredAndSortedProducts.length}
                                mode="products" // Se mantiene el modo 'products'
                            />
                        </div>
                    )}

                    {/* 2. CONTENIDO PRINCIPAL (Cuadrícula): Ajuste del Span */}
                    <div className={`${contentSpan}`}>
                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
                                <p className="text-xl text-gray-700 font-bold">No se encontraron productos que coincidan con los filtros aplicados. 🔎</p>
                                <p className="text-gray-500 mt-2">Intenta limpiar los filtros o ajusta tu búsqueda.</p>
                            </div>
                        ) : (
                            // La cuadrícula interna no necesita cambiar el col-span, solo la clase contenedora externa
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {/* Mapea los productos */}
                                {filteredAndSortedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickView={handleQuickView}
                                        onRemove={handleRemoveProduct}
                                        onToggleWishlist={handleToggleWishlist}
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