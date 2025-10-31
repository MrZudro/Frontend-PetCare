import React from 'react';
import SummaryTL from './SummaryTL';

export default function ShippingDateTL({ products, subtotal, goToNextStep, selectedAddress}) { // Prop en inglés

    // Variable local en español para la UI
    const direccionTexto = selectedAddress || 'Dirección no especificada'; 

    return (
        <div className="flex flex-col md:flex-row gap-8">
            
            <div className="md:flex-3 bg-white p-6 rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Revisa cuándo llega tu compra</h1>
                
                <p className="text-gray-700 mb-6 flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                    Envío a (<span className="font-semibold">{direccionTexto}</span>) 
                </p>
                
                <div className="border border-gray-200 rounded-lg p-5 flex justify-between items-center cursor-pointer hover:shadow-md transition">
                    <label className="flex items-center space-x-4">
                        <input type="radio" name="deliveryDate" value="shipping1" defaultChecked className="text-blue-600 focus:ring-blue-500"/>
                        <p className="font-semibold text-gray-900">Envío 1</p>
                    </label>
                    <span className="text-green-600 font-bold">Gratis</span>
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