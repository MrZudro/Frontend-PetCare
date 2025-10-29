import React from 'react';

// Este componente recibe la información de la veterinaria y la función para cerrar el modal
export default function VeterinaryModal({ vet, onClose }) {
    // Si no hay datos (porque el modal está cerrado), no renderizar nada
    if (!vet) return null;

    // La función 'replace' se usa para convertir el '\n' en un salto de línea real para que se muestre correctamente
    const displayName = vet.name.replace('\n', ' ');

    return (
        // Fondo oscuro (Overlay)
        <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose} // Cierra el modal si se hace clic fuera de la caja
        >
            {/* Contenedor principal del Modal */}
            {/* El 'e.stopPropagation()' evita que el clic dentro del modal cierre el overlay */}
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()} 
            >
                
                {/* Botón de Cerrar */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                
                <h2 className="text-2xl font-bold text-blue-700 border-b pb-2 mb-4">
                    {displayName}
                </h2>

                {/* Contenido de Detalles */}
                <div className="space-y-3 text-gray-700">
                    <p>
                        <strong className="font-semibold text-gray-900">Dirección:</strong> {vet.address}
                    </p>
                    <p>
                        <strong className="font-semibold text-gray-900">Teléfono:</strong> {vet.phone}
                    </p>
                </div>

                {/* Botón de Acción (Opcional) */}
                <div className="mt-6 flex justify-end">
                    {/* <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                        onClick={onClose}
                    >
                        Entendido
                    </button> */}
                </div>
            </div>
        </div>
    );
}