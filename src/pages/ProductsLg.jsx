import React, { useState, useMemo, useCallback } from 'react'; 
// 🔑 CLAVE: Importar useNavigate para la redirección
import { useNavigate } from 'react-router-dom'; 

import ProductCard from '../components/products/ProductCardLg';
import QuickViewModal from '../components/products/QuickViewModalLg';
import FilterSidebarLg from '../components/common/FilterSidebarLg';
import initialProducts from '../components/Data/products.json'; 
import categoriesMap from '../components/Data/categories.json'; 

// --- [ LÓGICA DE ORDENAMIENTO y FILTRADO (Sin cambios) ] ---
const sortProducts = (products, sortKey) => {
    if (!sortKey || sortKey === 'default') return products;
    const sorted = [...products];
    switch (sortKey) {
        case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
        case 'rating-desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
        default: return products;
    }
};

const filterProducts = (products, filterState) => {
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

// --- [ LÓGICA LOCALSTORAGE: WISHLIST (Sin cambios) ] ---
const loadWishlistFromLocalStorage = () => {
    try {
        const storedWishlist = localStorage.getItem('wishlistIds');
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
        console.error("Error wishlist LS", error);
        return [];
    }
};

const saveWishlistToLocalStorage = (wishlistArray) => {
    try {
        localStorage.setItem('wishlistIds', JSON.stringify(wishlistArray));
    } catch (error) {
        console.error("Error saving wishlist LS", error);
    }
};

// --- [ LÓGICA LOCALSTORAGE: CARRITO DE COMPRAS (Sin cambios) ] --- 
const loadCartFromLocalStorage = () => {
    try {
        const storedCart = localStorage.getItem('cartProducts');
        // Estructura esperada: [{id: 1, quantity: 1, size: 'M', color: 'red', cartItemId: '1-M-red'}]
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Error loading Cart LS", error);
        return [];
    }
};

const saveCartToLocalStorage = (cartArray) => {
    try {
        localStorage.setItem('cartProducts', JSON.stringify(cartArray));
    } catch (error) {
        console.error("Error saving Cart LS", error);
    }
};


const ProductsLg = () => {
    // 🔑 CLAVE: Inicializar el hook de navegación
    const navigate = useNavigate();
    
    const [wishlist, setWishlist] = useState(loadWishlistFromLocalStorage);
    const [products] = useState(initialProducts);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [sortKey, setSortKey] = useState('default');
    const [filterState, setFilterState] = useState({ filters: {}, searchTerm: '', mode: 'products' });

    // --- Handlers ---

    const handleQuickView = (product) => {
        setQuickViewProduct(product);
    };

    // Wishlist Handler (Sin cambios)
    const handleToggleWishlist = (productId) => { /* ... */
        setWishlist(prevWishlist => {
            let newWishlist;
            if (prevWishlist.includes(productId)) {
                newWishlist = prevWishlist.filter(id => id !== productId);
            } else {
                newWishlist = [...prevWishlist, productId];
            }
            saveWishlistToLocalStorage(newWishlist);
            return newWishlist;
        });
    };

    // 🔑 CLAVE: Handler de redirección
    const handleRedirectToCart = useCallback(() => {
        // Redirige a la página del carrito
        navigate('/car'); 
    }, [navigate]);


    // 🆕 Carrito Handler: Añadir producto (Actualizado para aceptar variantes)
    const handleAddToCart = useCallback((productId, selectedSize, selectedColor) => {
        // 1. Leer el carrito actual del almacenamiento
        const currentCart = loadCartFromLocalStorage();
        
        // Crea un identificador único basado en el producto, talla y color.
        const cartItemId = `${productId}-${selectedSize || 'n/a'}-${selectedColor || 'n/a'}`;
        
        // 2. Verificar si ya existe exactamente el mismo producto/variante en el carrito
        const existingProductIndex = currentCart.findIndex(item => item.cartItemId === cartItemId);

        if (existingProductIndex > -1) {
            // Si existe, incrementa la cantidad
            currentCart[existingProductIndex].quantity += 1;
            console.log(`Cantidad actualizada para producto ID: ${productId} (${cartItemId})`);
        } else {
            // Si no existe, añade el nuevo ítem con sus variantes
            currentCart.push({ 
                id: productId, 
                cartItemId: cartItemId, // ID único para la variante
                quantity: 1, 
                size: selectedSize, 
                color: selectedColor 
            });
            console.log(`Producto nuevo agregado al carrito ID: ${productId} (${cartItemId})`);
        }

        // 3. Guardar en LocalStorage
        saveCartToLocalStorage(currentCart);
    }, []);

    const handleRemoveProduct = (id) => {
        console.log(`Demo: Intentando remover producto con ID ${id}.`);
    };

    const handleFilterChange = useCallback((newState) => { /* ... */
        if (JSON.stringify(newState.filters) === JSON.stringify(filterState.filters)) {
            return; 
        }
        setFilterState(newState); 
    }, [filterState]); 

    const handleSortChange = (newSortKey) => {
        setSortKey(newSortKey);
    };

    const filteredAndSortedProducts = useMemo(() => {
        const filtered = filterProducts(products, filterState);
        return sortProducts(filtered, sortKey);
    }, [products, filterState, sortKey]);

    
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

                    {/* BARRA DE FILTROS */}
                    {showFilterSidebar && (
                        <div className="lg:col-span-1">
                            <FilterSidebarLg
                                onFilterChange={handleFilterChange}
                                onSortChange={handleSortChange}
                                totalResults={filteredAndSortedProducts.length}
                                mode="products"
                            />
                        </div>
                    )}

                    {/* CONTENIDO PRINCIPAL */}
                    <div className={`${contentSpan}`}>
                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
                                <p className="text-xl text-gray-700 font-bold">No se encontraron productos que coincidan con los filtros aplicados. 🔎</p>
                                <p className="text-gray-500 mt-2">Intenta limpiar los filtros o ajusta tu búsqueda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {filteredAndSortedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickView={handleQuickView}
                                        onRemove={handleRemoveProduct}
                                        onToggleWishlist={handleToggleWishlist}
                                        isWishlisted={wishlist.includes(product.id)}
                                        // 🔑 CLAVE: Llamada a onAddToCart desde la tarjeta, pasando null para variantes
                                        onAddToCart={() => handleAddToCart(product.id, null, null)} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>

            {/* MODAL DE VISTA RÁPIDA */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                    // 🔑 CLAVE: Pasamos las funciones actualizadas al modal
                    onAddToCart={handleAddToCart}
                    onRedirectToCart={handleRedirectToCart}
                />
            )}
        </div>
    );
}

export default ProductsLg;