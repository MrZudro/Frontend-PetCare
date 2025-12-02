import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaTrash, FaReceipt, FaBarcode } from 'react-icons/fa';

// Mock Products
const MOCK_PRODUCTS = [
    { id: 1, name: 'Alimento Perro 1kg', price: 25000, stock: 50 },
    { id: 2, name: 'Alimento Gato 1kg', price: 22000, stock: 30 },
    { id: 3, name: 'Juguete Hueso', price: 15000, stock: 20 },
    { id: 4, name: 'Collar Antipulgas', price: 45000, stock: 15 },
    { id: 5, name: 'Shampoo Mascotas', price: 18000, stock: 25 },
];

const POS = () => {
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientName, setClientName] = useState('');

    const filteredProducts = MOCK_PRODUCTS.filter(prod =>
        prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("El carrito está vacío.");
            return;
        }
        if (!clientName) {
            alert("Por favor ingrese el nombre del cliente.");
            return;
        }
        alert(`Factura generada para ${clientName}. Total: $${total.toLocaleString()}`);
        setCart([]);
        setClientName('');
    };

    return (
        <div className="p-6 h-full flex flex-col lg:flex-row gap-6">
            {/* Left: Product Catalog */}
            <div className="flex-1 flex flex-col">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Punto de Venta</h2>
                    <p className="text-gray-500">Selecciona productos para la venta.</p>
                </div>

                <div className="mb-4 bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <FaSearch className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="flex-1 outline-none text-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                                onClick={() => addToCart(product)}
                            >
                                <div>
                                    <div className="bg-gray-100 h-24 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                                        <FaBarcode className="text-3xl" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h3>
                                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                </div>
                                <div className="mt-3 font-bold text-primary">
                                    ${product.price.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Cart / Invoice */}
            <div className="w-full lg:w-96 bg-white rounded-2xl shadow-lg flex flex-col h-full border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FaShoppingCart /> Carrito de Compras
                    </h3>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente</label>
                    <input
                        type="text"
                        placeholder="Nombre del Cliente / NIT"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none text-sm"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                                <div className="text-xs text-gray-500">${item.price.toLocaleString()} x {item.quantity}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-white rounded-lg border border-gray-200">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
                                    <span className="text-xs font-bold px-1">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                    <FaTrash className="text-xs" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="text-center text-gray-400 py-8 text-sm">
                            Carrito vacío
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4 text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                        <FaReceipt /> Generar Factura
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;
