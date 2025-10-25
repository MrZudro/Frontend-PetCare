import React, { useState, useMemo } from 'react';
import initialProducts from '../components/Data/products.json'; 
import ProductCard from '../components/products/ProductCardLg'; 
import QuickViewModal from '../components/products/QuickViewModalLg'; 
import FilterSidebarLg from '../components/common/FilterSidebarLg'; 

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
            return sorted.sort((a, b) => a.name.localeCompare(b.name)); 
        default:
            return products;
    }
};

// --- [ LÓGICA DE FILTRADO ] ---
const filterProducts = (products, filterState) => {
    let result = products;
    
    const activeCategory = filterState.filters.category?.find(f => f.active)?.name;
    const activeType = filterState.filters.type?.find(f => f.active)?.name;
    const activeBrand = filterState.filters.brand?.find(f => f.active)?.name;
    
    if (activeCategory) {
        result = result.filter(product => product.category === activeCategory);
    }
    if (activeType) {
        result = result.filter(product => product.type === activeType);
    }
    if (activeBrand) {
        result = result.filter(product => product.brand === activeBrand);
    }
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
    const [products] = useState(initialProducts);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [sortKey, setSortKey] = useState('default'); 
    const [filterState, setFilterState] = useState({ filters: {}, searchTerm: '', mode: 'products' });


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
                    
                    {/* 1. BARRA DE FILTROS */}
                    <div className="lg:col-span-1">
                        <FilterSidebarLg 
                            onFilterChange={handleFilterChange} 
                            onSortChange={handleSortChange}
                            totalResults={filteredAndSortedProducts.length} 
                            mode="products" 
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
                            // La cuadrícula mapea los productos filtrados Y ordenados
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 1xl:grid-cols-4 gap-6">
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

            {/* Renderiza el modal solo si quickViewProduct tiene un valor (Función de vista previa no tocada) */}
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