import React, { useState } from 'react';

export default function ShippingOptionTL({ onContinue }) {
    // 1. Estado para guardar la opción seleccionada
    const [selectedOption, setSelectedOption] = useState(''); // Inicializa vacío para obligar a elegir
    // 2. Estado para manejar el error visual
    const [error, setError] = useState(false);

    const handleContinue = () => {
        // 3. Validación
        if (!selectedOption) {
            setError(true);
            return; // Detiene la ejecución si no hay selección
        }
        setError(false);
        onContinue(); // Pasa al siguiente paso si todo está bien
    };

    const handleSelect = (value) => {
        setSelectedOption(value);
        setError(false); // Limpia el error cuando el usuario selecciona algo
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Método de Envío</h2>
            
            {/* Mensaje de Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">
                    ⚠ Por favor, selecciona una forma de entrega.
                </div>
            )}

            <div 
                onClick={() => handleSelect('domicilio')}
                className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition mb-6
                    ${selectedOption === 'domicilio' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}
                `}
            >
                <div className="flex items-center gap-4">
                    <input 
                        type="radio" 
                        name="shipping" 
                        checked={selectedOption === 'domicilio'}
                        onChange={() => handleSelect('domicilio')}
                        className="w-5 h-5 text-blue-600 cursor-pointer" 
                    />
                    <div>
                        <p className="font-bold text-gray-900">Enviar a domicilio</p>
                        <p className="text-sm text-gray-500">Engativá, Bogotá D.C.</p>
                    </div>
                </div>
                <span className="text-green-600 font-bold">Gratis</span>
            </div>

            <div className="flex justify-end gap-4 items-center">
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