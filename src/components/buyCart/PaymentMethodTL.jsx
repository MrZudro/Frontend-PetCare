import React, { useState } from 'react';
import { FaCreditCard, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';

export default function PaymentMethodTL({ onContinue }) {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [error, setError] = useState(false);

    const methods = [
        { id: 'debito', name: "Nueva tarjeta de débito", icon: <FaCreditCard /> },
        { id: 'credito', name: "Nueva tarjeta de crédito", icon: <FaCreditCard /> },
        { id: 'pse', name: "Transferencia con PSE", icon: <FaUniversity /> },
        { id: 'efecty', name: "Efecty", icon: <FaMoneyBillWave /> },
    ];

    const handleContinue = () => {
        if (!selectedMethod) {
            setError(true);
            return;
        }
        onContinue();
    };

    const handleSelect = (id) => {
        setSelectedMethod(id);
        setError(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">
                    ⚠ Debes seleccionar un método de pago.
                </div>
            )}

            <div className="space-y-4 mb-8">
                {methods.map((m) => (
                    <div 
                        key={m.id} 
                        onClick={() => handleSelect(m.id)}
                        className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition
                            ${selectedMethod === m.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}
                        `}
                    >
                        <input 
                            type="radio" 
                            name="payment" 
                            checked={selectedMethod === m.id}
                            onChange={() => handleSelect(m.id)}
                            className="w-5 h-5 text-blue-600 cursor-pointer" 
                        />
                        <span className="text-xl text-gray-600">{m.icon}</span>
                        <span className="font-medium text-gray-900">{m.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={handleContinue}
                    className="bg-[#F2055C] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#BF0436] transition duration-200"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}