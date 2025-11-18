import React from 'react';
import { FaTag } from 'react-icons/fa';

// Aceptamos tanto onContinue como goToNextStep para evitar errores
export default function SummaryTL({ subtotal, products, onContinue, goToNextStep, isSimplified = false }) {
    
    // Calculamos el total
    const total = subtotal; 
    
    // Definimos la función de continuar (usa la que venga definida)
    const handleContinue = onContinue || goToNextStep;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-4">
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
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <FaTag className="absolute right-3 top-3 text-gray-400" />
                </div>
            )}

            <div className="flex justify-between items-center border-t pt-4 mb-6">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">${total.toLocaleString('es-CO')}</span>
            </div>

            {/* Condición corregida: Verifica handleContinue.
                He cambiado los colores a unos estándar de Tailwind (indigo) 
                por si 'bg-acento-primario' no está definido en tu config.
            */}
            {!isSimplified && handleContinue && (
                <button 
                    onClick={handleContinue}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Continuar Compra
                </button>
            )}
        </div>
    );
}