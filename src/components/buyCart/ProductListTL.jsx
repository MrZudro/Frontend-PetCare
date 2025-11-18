import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

// 1. Recibir las nuevas funciones como props
export default function ProductListTL({ 
    products, 
    increaseQuantity, 
    decreaseQuantity,
    handleRemoveProduct // Nueva función para eliminar
}) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            {/* Encabezados */}
            <div className="hidden md:flex justify-between text-gray-700 font-bold text-lg border-b pb-3 mb-4">
                <span className="w-1/2">Producto</span>
                <span className="w-1/4 text-center">Cantidad</span>
                <span className="w-1/4 text-right">Precio / Eliminar</span> {/* Encabezado ajustado */}
            </div>

            {/* Items */}
            <div className="space-y-6">
                {products.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                        
                        {/* Info Producto */}
                        <div className="flex items-center w-full md:w-1/2 mb-4 md:mb-0">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 mr-4 overflow-hidden">
                                {/* Asegúrate de que item.imageUrl existe */}
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.subcategories}</p>
                            </div>
                        </div>

                        {/* Controles Cantidad (MODIFICADO) */}
                        <div className="flex items-center justify-center w-full md:w-1/4 mb-4 md:mb-0">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                
                                {/* Botón DISMINUIR (-) */}
                                <button 
                                    onClick={() => decreaseQuantity(item.id)} // 2. Conectado
                                    className="px-3 py-1 hover:bg-gray-100 font-bold text-gray-600"
                                >
                                    -
                                </button>
                                
                                <input 
                                    type="text" 
                                    value={item.quantity} 
                                    readOnly 
                                    className="w-10 text-center border-l border-r border-gray-300 py-1 text-gray-800 outline-none"
                                />
                                
                                {/* Botón AUMENTAR (+) */}
                                <button 
                                    onClick={() => increaseQuantity(item.id)} // 2. Conectado
                                    className="px-3 py-1 hover:bg-gray-100 font-bold text-gray-600"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Precio y Eliminar (MODIFICADO) */}
                        <div className="w-full md:w-1/4 flex justify-between md:justify-end items-center">
                            <p className="font-bold text-xl text-gray-900 md:mr-6">
                                {/* Asegúrate de que el precio se muestre correctamente */}
                                ${(item.price * item.quantity).toLocaleString('es-CO')}
                            </p>
                            
                            {/* Botón ELIMINAR (MODIFICADO) */}
                            <button 
                                onClick={() => handleRemoveProduct(item.id)} // 3. Conectado
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