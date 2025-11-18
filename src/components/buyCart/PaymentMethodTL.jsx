import React from 'react';
import { FaCreditCard, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';

export default function PaymentMethodTL({ onContinue }) {
    const methods = [
        { id: 1, name: "Nueva tarjeta de débito", icon: <FaCreditCard /> },
        { id: 2, name: "Nueva tarjeta de crédito", icon: <FaCreditCard /> },
        { id: 3, name: "Transferencia con PSE", icon: <FaUniversity /> },
        { id: 4, name: "Efecty", icon: <FaMoneyBillWave /> },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4 mb-8">
                {methods.map((m) => (
                    <div key={m.id} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-blue-500 transition">
                        <input type="radio" name="payment" className="w-5 h-5 text-blue-600" />
                        <span className="text-xl text-gray-600">{m.icon}</span>
                        <span className="font-medium text-gray-900">{m.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button onClick={onContinue} className="bg-acento-primario text-white font-bold py-3 px-8 rounded-lg hover:bg-acento-secundario transition">
                    Continuar
                </button>
            </div>
        </div>
    );
}