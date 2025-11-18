import React from 'react';

export default function ShippingOptionTL({ onContinue }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-blue-500 transition mb-6">
                <div className="flex items-center gap-4">
                    <input type="radio" checked readOnly className="w-5 h-5 text-blue-600" />
                    <div>
                        <p className="font-bold text-gray-900">Enviar a domicilio</p>
                        <p className="text-sm text-gray-500">Engativá, Bogotá D.C.</p>
                    </div>
                </div>
                <span className="text-green-600 font-bold">Gratis</span>
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={onContinue}
                    className="bg-acento-primario text-white font-bold py-3 px-8 rounded-lg hover:bg-acento-secundario transition duration-200"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}