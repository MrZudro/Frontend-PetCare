import React from 'react';

export default function ProductListTL({ products, increaseQuantity, decreaseQuantity }) {
    return (
        <div className="md:flex-3 bg-white p-6 rounded-lg shadow-xl">
            {/* Headers en español */}
            <div className="flex justify-between font-bold text-gray-700 pb-3 border-b border-gray-300">
                <span className="w-1/2">Producto</span>
                <span className="w-1/4 text-center">Cantidad</span>
                <span className="w-1/4 text-right">Precio</span>
            </div>

            {/* Listado de Productos */}
            {products.map(p => (
                <div key={p.id} className="flex justify-between items-center py-4 border-b border-gray-100">
                    <div className="w-1/2">
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.weight}</p>
                    </div>

                    <div className="w-1/4 flex justify-center items-center">
                        <button onClick={() => decreaseQuantity(p.id)} className="px-2 py-1 border border-gray-300 rounded-l hover:bg-gray-100 transition">-</button>
                        <input 
                            type="text" 
                            value={p.quantity} 
                            readOnly 
                            className="w-10 text-center border-t border-b border-gray-300 py-1"
                        />
                        <button onClick={() => increaseQuantity(p.id)} className="px-2 py-1 border border-gray-300 rounded-r hover:bg-gray-100 transition">+</button>
                    </div>

                    <div className="w-1/4 text-right font-bold text-gray-900">
                        ${(p.price * p.quantity).toLocaleString('es-CO')}
                    </div>
                </div>
            ))}
        </div>
    );
}