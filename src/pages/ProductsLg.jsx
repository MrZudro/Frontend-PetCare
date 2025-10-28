import React, { useState, useMemo } from 'react';
// Importamos los componentes específicos de productos y el filtro común
import ProductCard from '../components/products/ProductCardLg'; 
import QuickViewModal from '../components/products/QuickViewModalLg'; 
import FilterSidebarLg from '../components/common/FilterSidebarLg'; 
// Importamos los datos simulados de productos
import initialProducts from '../components/Data/products.json'; 

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

// --- [ LÓGICA DE FILTRADO ] ---
const filterProducts = (products, filterState) => {
    let result = products;
    
    // Obtener filtros activos
    const activeCategory = filterState.filters.category?.find(f => f.active)?.name;
    const activeType = filterState.filters.type?.find(f => f.active)?.name;
    const activeBrand = filterState.filters.brand?.find(f => f.active)?.name;
    
    // 1. Filtrar por Categoría
    if (activeCategory) {
        result = result.filter(product => product.category === activeCategory);
    }
    // 2. Filtrar por Tipo
    if (activeType) {
        result = result.filter(product => product.type === activeType);
    }
    // 3. Filtrar por Marca
    if (activeBrand) {
        result = result.filter(product => product.brand === activeBrand);
    }
    // 4. Filtrar por Búsqueda de Texto
    if (filterState.searchTerm) {
        const term = filterState.searchTerm.toLowerCase();
        result = result.filter(product => 
            product.name.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
        );
    }
    return result;
};


const ProductsLg= () => {
    // Estados de datos
    const [products] = useState(initialProducts);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    
    // Estados de filtrado y ordenamiento (IDÉNTICO al de Servicios)
    const [sortKey, setSortKey] = useState('default'); 
    const [filterState, setFilterState] = useState({ filters: {}, searchTerm: '', mode: 'products' });


    // Handlers
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
    
    // Lógica principal: filtra y luego ordena (Uso de useMemo como en Servicios)
    const filteredAndSortedProducts = useMemo(() => {
        const filtered = filterProducts(products, filterState);
        return sortProducts(filtered, sortKey);
    }, [products, filterState, sortKey]);


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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* 1. BARRA DE FILTROS (Mismo componente que Servicios) */}
                    <div className="lg:col-span-1">
                        <FilterSidebarLg 
                            onFilterChange={handleFilterChange} 
                            onSortChange={handleSortChange}
                            totalResults={filteredAndSortedProducts.length} 
                            mode="products" // Se mantiene el modo 'products'
                        />
                    </div>

                    {/* 2. CONTENIDO PRINCIPAL (Cuadrícula) */}
                    <div className="lg:col-span-3">
                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
                                <p className="text-xl text-gray-700 font-bold">No se encontraron productos que coincidan con los filtros aplicados. 🔎</p>
                                <p className="text-gray-500 mt-2">Intenta limpiar los filtros o ajusta tu búsqueda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

            {/* Renderiza el modal de vista rápida (Igual que en Servicios) */}
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