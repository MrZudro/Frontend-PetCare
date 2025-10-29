import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const WishlistCard = ({ product, onToggleWishlist }) => {
    const navigate = useNavigate();
    const isWishlisted = true; // Siempre está en la lista de deseos

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        onToggleWishlist(product.id);
    };

    return (
        <div 
            className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer transition duration-300 ease-in-out border border-gray-200 group w-full max-w-xs mx-auto hover:shadow-2xl"
            onClick={handleCardClick}
        >
            <div className="relative">
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-60 object-cover bg-gray-200 transition-opacity duration-300 group-hover:opacity-90" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/6b7280/ffffff?text=No+Image'; }}
                />
                <span className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500 text-white shadow-md">
                    {product.subcategories}
                </span>
                <button 
                    onClick={handleWishlistClick}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors text-red-500"
                    aria-label="Quitar de Wishlist"
                >
                    <FaHeart className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight" title={product.name}>
                    {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                    <span className="text-xl font-bold text-indigo-600">
                        ${product.price.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </span>
                    
                    <button 
                        className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                        aria-label="Añadir al carrito"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Lógica para añadir al carrito
                        }}
                    >
                        <FaShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistCard;
