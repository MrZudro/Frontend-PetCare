import React from 'react';
import { FaTag } from 'react-icons/fa';

// 1. Recibimos 'onContinue' en lugar de 'goToNextStep'
// 2. Mantenemos 'products = []' para evitar el error anterior
export default function SummaryTL({ subtotal = 0, products = [], onContinue, isSimplified = false, disabled = false }) {

    const total = subtotal;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Resumen de Compra</h2>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                    <span>Productos:</span>
                    {/* Protección contra undefined */}
                    <span className="font-medium">{products ? products.length : 0}</span>
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

            {/* 3. Validamos '!isSimplified' y que 'onContinue' exista */}
            {!isSimplified && onContinue && (
                <button
                    onClick={!disabled ? onContinue : undefined} // 4. Usamos la variable correcta
                    disabled={disabled}
                    className={`w-full font-bold py-3 rounded-lg transition duration-200 ${disabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#F2055C] text-white hover:bg-[#BF0436]'
                        }`}
                >
                    Continuar Compra
                </button>
            )}
        </div>
    );
}