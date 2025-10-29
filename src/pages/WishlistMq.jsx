import { FaFilter, FaRegHeart } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import productsData from '../components/Data/products.json';
import WishlistCard from '../components/products/WishlistCard';

export default function WishlistMq() {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const loadWishlistFromLocalStorage = () => {
        try {
            const storedWishlist = localStorage.getItem('wishlistIds');
            return storedWishlist ? JSON.parse(storedWishlist) : [];
        } catch (error) {
            console.error("Error al cargar la lista de deseos del LocalStorage", error);
            return [];
        }
    };

    const loadWishlistProducts = () => {
        const wishlistIds = loadWishlistFromLocalStorage();
        const products = productsData.filter(product => wishlistIds.includes(product.id));
        setWishlistProducts(products);
    };

    const handleToggleWishlist = (productId) => {
        const wishlistIds = loadWishlistFromLocalStorage();
        const newWishlist = wishlistIds.filter(id => id !== productId);
        
        localStorage.setItem('wishlistIds', JSON.stringify(newWishlist));
        loadWishlistProducts();
    };

    useEffect(() => {
        loadWishlistProducts();
        // Escuchar cambios en el localStorage
        const handleStorageChange = () => loadWishlistProducts();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                        Mi Lista de Deseos ({wishlistProducts.length})
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <FaFilter className="mr-2" />
                            <span>Filtrar</span>
                            <RiArrowDropDownLine className={`ml-1 text-xl transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {wishlistProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                            <FaRegHeart className="w-full h-full" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu lista de deseos está vacía</h2>
                        <p className="text-gray-500 mb-6">¡Guarda tus productos favoritos aquí para encontrarlos fácilmente después!</p>
                        <button 
                            onClick={() => { /* Navegar a la página de productos */ }}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Explorar Productos
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistProducts.map((product) => (
                            <WishlistCard 
                                key={product.id}
                                product={product}
                                onToggleWishlist={handleToggleWishlist}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
