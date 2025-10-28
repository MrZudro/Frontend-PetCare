import React, { useState } from 'react';

export default function NewAddressTL({ setAddress, goToNextStep }) {
    
    const [inputAddress, setInputAddress] = useState('Ej: Calle 76D #105D-99');
    
    const handleContinue = () => {
        setAddress(inputAddress); 
        goToNextStep(); 
    };
    
    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Nuevo Domicilio</h1>

            <p className="text-blue-600 mb-6 cursor-pointer">
                • Completar con mi ubicación
            </p>

            <div className="space-y-4">
                {/* Dirección */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección o lugar de entrega</label>
                    <input 
                        type="text" 
                        id="address" 
                        value={inputAddress} 
                        onChange={(e) => setInputAddress(e.target.value)} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Ej: Calle 76D #105D-99" 
                    />
                </div>
                
                {/* Departamento / Municipio */}
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Departamento</label>
                        <input type="text" placeholder="Placeholder text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Municipio / Localidad</label>
                        <input type="text" placeholder="Placeholder text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                </div>
                
                {/* Tipo de Domicilio */}
                <div className="pt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Tipo de domicilio</p>
                    <label className="inline-flex items-center">
                        <input type="radio" name="type" value="residential" defaultChecked className="text-blue-600" />
                        <span className="ml-2 text-gray-700">Residencia</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                        <input type="radio" name="type" value="work" className="text-blue-600" />
                        <span className="ml-2 text-gray-700">Laboral</span>
                    </label>
                </div>
                
                {/* Datos de Contacto */}
                <h2 className="text-lg font-bold pt-4 text-gray-900">Datos de Contacto</h2>
                <p className="text-xs text-gray-500 mb-4">Tu información de contacto es importante para nosotros. Solo la usaremos para avisarte rápidamente si surge algún imprevisto con la entrega.</p>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre y Apellido</label>
                    <input type="text" id="name" placeholder="John Doe" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input type="tel" id="phone" placeholder="+57 300 000 0000" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
            </div>

            <button 
                className="w-full mt-8 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition"
                onClick={handleContinue}
            > 
                Continuar 
            </button>
        </div>
    );
}