import React from 'react';
import SummaryTL from './SummaryTL';

export default function PaymentMethodTL({ products, subtotal, goToNextStep }) {

    const paymentOptions = [
        { id: 'debito', label: 'Nueva tarjeta de débito', icon: 'fas fa-credit-card' },
        { id: 'credito', label: 'Nueva tarjeta de crédito', icon: 'fas fa-credit-card' },
        { id: 'pse', label: 'Transferencia con PSE', icon: 'fas fa-wallet' }, 
        { id: 'efecty', label: 'Efecty', icon: 'fas fa-money-bill-wave' },
    ];

    const handlePaymentSelection = (id) => {
        console.log(`Method selected: ${id}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            
            <div className="md:flex-3 bg-white p-6 rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Elige cómo pagar</h1>
                
                <div className="space-y-4">
                    {paymentOptions.map((option) => (
                        <div 
                            key={option.id}
                            className="border border-gray-200 rounded-lg p-5 flex justify-between items-center cursor-pointer hover:shadow-md transition"
                            onClick={() => handlePaymentSelection(option.id)}
                        >
                            <label className="flex items-center space-x-4 w-full">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value={option.id} 
                                    className="text-blue-600 focus:ring-blue-500"
                                    defaultChecked={option.id === 'debito'}
                                    onChange={() => handlePaymentSelection(option.id)}
                                />
                                <i className={`${option.icon} text-xl text-gray-600`}></i>
                                <span className="font-semibold text-gray-900">{option.label}</span>
                            </label>
                        </div>
                    ))}
                </div>

                <button 
                    className="w-48 mt-8 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition float-right"
                    onClick={goToNextStep}
                >
                    Continuar
                </button>
            </div>

            <div className="md:flex-1">
                <SummaryTL 
                    products={products} 
                    subtotal={subtotal} 
                    isDeliveryView={true} 
                />
            </div>
        </div>
    );
}