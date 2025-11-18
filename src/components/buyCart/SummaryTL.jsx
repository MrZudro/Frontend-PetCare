import React from 'react';
import { FaTag } from 'react-icons/fa';

export default function SummaryTL({ subtotal, products, onContinue, isSimplified = false }) {
    const total = subtotal; // + envío si aplica

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Resumen de Compra</h2>
            
            <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                    <span>Productos:</span>
                    <span className="font-medium">{products.length}</span>
                </div>
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">${subtotal.toLocaleString('es-CO')}</span>
                </div>
                {!isSimplified && (
                    <>
                        <div className="flex justify-between">
                            <span>Descuento:</span>
                            <span className="font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Envío:</span>
                            <span className="text-green-600 font-bold">Gratis</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Cupón Aplicado:</span>
                            <span className="font-medium">$0.00</span>
                        </div>
                    </>
                )}
            </div>

            {!isSimplified && (
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Código de Cupón" 
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:border-blue-500"
                    />
                    <FaTag className="absolute right-3 top-3 text-gray-400" />
                </div>
            )}

            <div className="flex justify-between items-center border-t pt-4 mb-6">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">${total.toLocaleString('es-CO')}</span>
            </div>

            {!isSimplified && onContinue && (
                <button 
                    onClick={onContinue}
                    className="w-full bg-acento-primario text-texto-secundario font-bold py-3 rounded-lg hover:bg-acento-secundario transition duration-200"
                >
                    Continuar Compra
                </button>
            )}
        </div>
    );
}