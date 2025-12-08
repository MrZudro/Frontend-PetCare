import React, { useState, useMemo, useEffect } from 'react'; // Agregado useEffect para la llamada a la API
import { useNavigate } from 'react-router-dom';

import ProductCard from '../components/products/ProductCardLg';
import QuickViewModal from '../components/products/QuickViewModalLg';
import SimpleFilterSidebar from '../components/common/SimpleFilterSidebar';

// 🛑 ELIMINAMOS: import initialProducts from '../components/Data/products.json';

// ✅ MANTENEMOS: JSON de categorías para la lógica de filtros
import categoriesMap from '../components/Data/categories.json'; 

// ✅ AGREGAMOS: Importamos el servicio de productos para el fetch
import { productsService } from '../services/productsService'; 

// --- [ LOCAL STORAGE: WISHLIST ] ---
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

// --- [ LOCAL STORAGE: CART ] ---
const loadCartFromLocalStorage = () => {
    try {
        const storedCart = localStorage.getItem('cartProducts');
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
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState(loadWishlistFromLocalStorage);
    
    // ✅ CAMBIO: Inicializamos products como un array vacío, se llenará con el API
    const [products, setProducts] = useState([]);
    
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    // ✅ NUEVOS ESTADOS para manejo de la API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados de filtros simplificados
    const [activeFilters, setActiveFilters] = useState({
        category: null,
        subcategory: null,
        brand: null
    });
    const [sortBy, setSortBy] = useState('default');

    // 🚀 FETCH DE PRODUCTOS DESDE EL API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // ✅ CAMBIO CLAVE: Usamos el servicio productsService.getAll()
                const response = await productsService.getAll();

                // NOTA: Asumiendo que la respuesta es response.data = [product1, product2, ...]
                setProducts(response.data); 
            } catch (err) {
                console.error('Error fetching products:', err);
                // Si el error es 500 o similar, se mostrará el mensaje de error.
                setError('Error al cargar los productos. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Se ejecuta solo una vez al montar

    // --- LÓGICA DE FILTRADO OPTIMIZADA ---
    const filteredAndSortedProducts = useMemo(() => {
        // Paso 1: Filtrar
        let filtered = products.filter(product => {
            // Filtro de categoría
            if (activeFilters.category) {
                const categoryData = categoriesMap.find(c => c.categoryName === activeFilters.category);
                
                // Verifica si la subcategoría del producto está en la categoría activa.
                if (!categoryData?.subcategories.includes(product.subcategories)) {
                    return false;
                }
            }

            // Filtro de subcategoría
            if (activeFilters.subcategory && product.subcategories !== activeFilters.subcategory) {
                return false;
            }

            // Filtro de marca
            if (activeFilters.brand && product.brand !== activeFilters.brand) {
                return false;
            }

            return true;
        });

        // Paso 2: Ordenar
        switch (sortBy) {
            case 'price-asc':
                return filtered.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return filtered.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return filtered.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return filtered.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return filtered;
        }
    }, [products, activeFilters, sortBy]);

    // --- PREPARAR OPCIONES DE FILTROS (USA 'products' del estado) ---
    const filterOptions = useMemo(() => {
        const options = {};

        // Opción de Categorías
        const categoryCounts = {};
        products.forEach(product => {
            const categoryData = categoriesMap.find(c => c.subcategories.includes(product.subcategories));
            if (categoryData) {
                categoryCounts[categoryData.categoryName] = (categoryCounts[categoryData.categoryName] || 0) + 1;
            }
        });

        options.category = {
            label: 'Categoría',
            type: 'radio',
            options: Object.entries(categoryCounts).map(([name, count]) => ({
                value: name,
                label: name,
                count
            }))
        };

        // ... (El resto de la lógica de filtros se mantiene igual)

        // Opción de Subcategorías (solo si hay categoría seleccionada)
        if (activeFilters.category) {
            const categoryData = categoriesMap.find(c => c.categoryName === activeFilters.category);
            if (categoryData) {
                const subcategoryCounts = {};
                products.forEach(product => {
                    if (categoryData.subcategories.includes(product.subcategories)) {
                        subcategoryCounts[product.subcategories] = (subcategoryCounts[product.subcategories] || 0) + 1;
                    }
                });

                options.subcategory = {
                    label: 'Subcategoría',
                    type: 'radio',
                    options: Object.entries(subcategoryCounts).map(([name, count]) => ({
                        value: name,
                        label: name,
                        count
                    }))
                };
            }
        }

        // Opción de Marcas
        const brandCounts = {};
        products.forEach(product => {
            if (product.brand) {
                brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
            }
        });

        options.brand = {
            label: 'Marca',
            type: 'radio',
            options: Object.entries(brandCounts).map(([name, count]) => ({
                value: name,
                label: name,
                count
            }))
        };

        return options;
    }, [products, activeFilters.category]);

    // --- HANDLERS (se mantienen iguales) ---
    const handleFilterChange = (filterKey, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };

            if (newFilters[filterKey] === value) {
                newFilters[filterKey] = null;
                if (filterKey === 'category') {
                    newFilters.subcategory = null;
                }
            } else {
                newFilters[filterKey] = value;
                if (filterKey === 'category') {
                    newFilters.subcategory = null;
                }
            }
            return newFilters;
        });
    };

    const handleClearFilters = () => {
        setActiveFilters({
            category: null,
            subcategory: null,
            brand: null
        });
        setSortBy('default');
    };

    const handleQuickView = (product) => {
        setQuickViewProduct(product);
    };

    const handleToggleWishlist = (productId) => {
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

    const handleAddToCart = (product, selectedVariant) => {
        const currentCart = loadCartFromLocalStorage();
        const cartItemId = `${product.id}-${selectedVariant.size || 'default'}-${selectedVariant.color || 'default'}`;
        const existingItemIndex = currentCart.findIndex(item => item.cartItemId === cartItemId);

        let updatedCart;
        if (existingItemIndex !== -1) {
            updatedCart = [...currentCart];
            updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                quantity: updatedCart[existingItemIndex].quantity + (selectedVariant.quantity || 1)
            };
        } else {
            const newItem = {
                id: product.id,
                cartItemId: cartItemId,
                quantity: selectedVariant.quantity || 1,
                size: selectedVariant.size || null,
                color: selectedVariant.color || null
            };
            updatedCart = [...currentCart, newItem];
        }

        saveCartToLocalStorage(updatedCart);
    };

    // Opciones de ordenamiento
    const sortOptions = [
        { value: 'default', label: 'Ordenar por...' },
        { value: 'price-asc', label: 'Precio: Menor a Mayor' },
        { value: 'price-desc', label: 'Precio: Mayor a Menor' },
        { value: 'name-asc', label: 'Nombre: A-Z' },
        { value: 'name-desc', label: 'Nombre: Z-A' }
    ];

    // --- RENDERIZADO CONDICIONAL POR ESTADO DE LA API ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full size-16 border-t-4 border-b-4 border-primary mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando productos de la tienda...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="size-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <header className="mb-10 pt-4 max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    Productos para tu Mascota 🐾
                </h1>
                <p className="text-center text-gray-500 mt-2 text-lg">
                    Encuentra todo lo que necesita tu mejor amigo
                </p>
            </header>

            <main className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar de Filtros */}
                    <div className="lg:col-span-1">
                        <SimpleFilterSidebar
                            filters={filterOptions}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                            totalResults={filteredAndSortedProducts.length}
                            sortOptions={sortOptions}
                            onSortChange={setSortBy}
                        />
                    </div>

                    {/* Lista de Productos */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAndSortedProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onQuickView={handleQuickView}
                                onToggleWishlist={handleToggleWishlist}
                                isWishlisted={wishlist.includes(product.id)}
                            />
                        ))}

                        {/* Manejo de Cero Resultados */}
                        {filteredAndSortedProducts.length === 0 && products.length > 0 && (
                            <div className="sm:col-span-2 lg:col-span-3 p-10 text-center bg-white rounded-xl shadow-md">
                                <p className="text-xl font-semibold text-gray-700">
                                    No se encontraron productos que coincidan con los filtros aplicados. 😔
                                </p>
                                <p className="text-gray-500 mt-2">
                                    Intenta ajustar tus filtros o{' '}
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        limpia todos los filtros
                                    </button>
                                </p>
                            </div>
                        )}
                        
                        {/* Caso especial: Cero productos del API (pero sin error) */}
                        {products.length === 0 && !loading && !error && (
                            <div className="sm:col-span-2 lg:col-span-3 p-10 text-center bg-white rounded-xl shadow-md">
                                <p className="text-xl font-semibold text-gray-700">
                                    Parece que la tienda no tiene productos disponibles por ahora. 😔
                                </p>
                                <p className="text-gray-500 mt-2">
                                    Vuelve más tarde o contacta a soporte.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal de Vista Rápida */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.includes(quickViewProduct.id)}
                />
            )}
        </div>
    );
};

export default ProductsLg;