import React from 'react';
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa'; // Usaremos FaMinus y FaPlus para los botones

export default function ProductListTL({ 
    products, 
    increaseQuantity, 
    decreaseQuantity,
    handleRemoveProduct 
}) {
    
    // 1. Manejo de Carrito Vacío
    if (!products || products.length === 0) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-lg text-center border-2 border-dashed border-gray-300">
                <p className="text-2xl font-bold text-gray-700 mb-2">Tu Carrito Está Vacío 🛒</p>
                <p className="text-gray-500">¡Regresa a la sección de productos para llenarlo!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            {/* Encabezados */}
            <div className="hidden md:flex justify-between text-gray-700 font-bold text-lg border-b pb-3 mb-4">
                <span className="w-1/2">Producto</span>
                <span className="w-1/4 text-center">Cantidad</span>
                <span className="w-1/4 text-right">Subtotal / Eliminar</span>
            </div>

            {/* Items */}
            <div className="space-y-6">
                {products.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                        
                        {/* Info Producto */}
                        <div className="flex items-center w-full md:w-1/2 mb-4 md:mb-0">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 mr-4 overflow-hidden">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.subcategories}</p>
                                <p className="text-sm text-gray-400 mt-1 hidden md:block">${item.price.toLocaleString('es-CO')} c/u</p>
                            </div>
                        </div>

                        {/* Controles Cantidad (CONECTADO) */}
                        <div className="flex items-center justify-center w-full md:w-1/4 mb-4 md:mb-0">
                            <div className="flex items-center border border-indigo-300 rounded-lg overflow-hidden">
                                
                                {/* Botón DISMINUIR (-) */}
                                <button 
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 font-bold text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    // ⚠️ MEJORA: Deshabilitar si la cantidad es 1 para no ir a 0
                                    disabled={item.quantity <= 1} 
                                >
                                    <FaMinus className="w-3 h-3"/>
                                </button>
                                
                                <input 
                                    type="text" 
                                    value={item.quantity} 
                                    readOnly 
                                    className="w-10 text-center py-2 text-gray-800 outline-none border-l border-r border-indigo-300 bg-white font-semibold"
                                />
                                
                                {/* Botón AUMENTAR (+) */}
                                <button 
                                    onClick={() => increaseQuantity(item.id)}
                                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 font-bold text-indigo-600"
                                >
                                    <FaPlus className="w-3 h-3"/>
                                </button>
                            </div>
                        </div>

                        {/* Subtotal y Eliminar (CONECTADO) */}
                        <div className="w-full md:w-1/4 flex justify-between md:justify-end items-center">
                            <p className="font-bold text-xl text-indigo-700 md:mr-6">
                                ${(item.price * item.quantity).toLocaleString('es-CO')}
                            </p>
                            
                            {/* Botón ELIMINAR */}
                            <button 
                                onClick={() => handleRemoveProduct(item.id)}
                                className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                                aria-label={`Eliminar ${item.name}`}
                            >
                                <FaTrashAlt className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}