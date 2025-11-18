import React from 'react';

export default function ShippingDateTL({ address, onContinue }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6 text-gray-700">
                <p className="flex items-center gap-2">
                    <span className="font-bold">📍 Envío a:</span> {address}
                </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-blue-500 transition mb-8">
                <div className="flex items-center gap-4">
                    <input type="radio" checked readOnly className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-gray-900">Envío Estándar (2-3 días)</span>
                </div>
                <span className="text-green-600 font-bold">Gratis</span>
            </div>

            <div className="flex justify-end">
                <button onClick={onContinue} className="bg-acento-primario text-white font-bold py-3 px-8 rounded-lg hover:bg-acento-secundario transition">
                    Continuar
                </button>
            </div>
        </div>
    );
}