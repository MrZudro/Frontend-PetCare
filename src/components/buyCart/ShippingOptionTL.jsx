import React from 'react';
import SummaryTL from './SummaryTL';

export default function ShippingOptionTL({ products, subtotal, goToNextStep }) {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            
            <div className="md:flex-3 bg-white p-6 rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Elige la forma de entrega</h1>
                
                <div className="border border-gray-200 rounded-lg p-5 flex justify-between items-center cursor-pointer hover:shadow-md transition">
                    <label className="flex items-center space-x-4">
                        <input type="radio" name="deliveryOption" value="domicilio" defaultChecked className="text-blue-600 focus:ring-blue-500"/>
                        <div>
                            <p className="font-semibold text-gray-900">Enviar a domicilio</p>
                            <p className="text-sm text-gray-500">Engativá, Bogotá D.C.</p>
                        </div>
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