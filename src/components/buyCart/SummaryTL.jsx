import React from 'react';

export default function SummaryTL({ products, subtotal, goToNextStep, isDeliveryView }) {
    
    const shipping = 0; 
    const total = subtotal + shipping;

    return (
        <div className="md:flex-1 bg-white p-6 rounded-lg shadow-xl h-fit">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Resumen de Compra</h2>

            <div className="space-y-2 text-gray-700">
                {/* Productos */}
                <p className="flex justify-between">
                    <span>Productos ({products.length})</span>
                    <span className="font-semibold">${subtotal.toLocaleString('es-CO')}</span>
                </p>
                
                {/* Subtotal */}
                {!isDeliveryView && (
                    <p className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">${subtotal.toLocaleString('es-CO')}</span>
                    </p>
                )}
                
                {/* Envío */}
                <p className="flex justify-between">
                    <span>Envío:</span>
                    <span className="text-green-600 font-bold">Gratis</span>
                </p>

                {/* Cupón */}
                <p className="flex justify-between">
                    <span>Cupón Aplicado:</span>
                    <span>$0.00</span>
                </p>

                {/* Campo de Cupón (Solo en la vista CART) */}
                {!isDeliveryView && (
                    <div className="py-4 my-4 border-t border-b border-gray-100">
                        <input type="text" placeholder="Código de Cupón" className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                )}
            </div>

            {/* Total */}
            <h3 className="flex justify-between text-2xl font-bold pt-4 mt-4 border-t-2 border-gray-900">
                <span>Total:</span>
                <span>${total.toLocaleString('es-CO')}</span>
            </h3>

            {/* Botón de Continuar */}
            {goToNextStep && (
                <button 
                    className="w-full py-3 mt-5 bg-black text-white font-bold rounded-md text-lg hover:bg-gray-800 transition"
                    onClick={goToNextStep}
                >
                    Continuar Compra
                </button>
            )}
        </div>
    );
}