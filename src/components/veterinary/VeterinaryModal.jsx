import React from 'react';

export default function VeterinaryModal({ vet, onClose }) {
    if (!vet) return null;

    const cleanName = vet.name.replace(/\n/g, ' ');

    // La función auxiliar de fila de detalle
    const DetailRow = ({ label, value }) => (
        <p style={{ color: 'var(--color-texto)' }}> {/* Usamos color-texto para el valor */}
            <strong style={{ color: 'var(--color-texto)' }} className="font-semibold">
                {label}:
            </strong> {value}
        </p>
    );

    return (
        // 1. Contenedor Principal / Overlay
        <div 
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
        >
            
            {/* 2. Backdrop (Fondo Oscuro) */}
            {/* Mantenemos el fondo oscuro semi-transparente para el overlay */}
            <div 
                className="fixed inset-0 bg-gray-900/50 transition-opacity" 
                aria-hidden="true" 
                onClick={onClose} 
            />

            {/* 3. Contenedor del Contenido del Modal (Color de Fondo de la Tarjeta) */}
            <div 
                // Cambiamos bg-white a tu variable de fondo
                style={{ backgroundColor: 'var(--color-fondo)' }}
                className="relative z-10 rounded-lg shadow-2xl w-full max-w-sm p-6 transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                
                {/* 1. Botón de Cerrar */}
                {/* Usamos color-texto para el icono */}
                <button
                    style={{ color: 'var(--color-texto)' }}
                    className="absolute top-2 right-2 hover:opacity-70 text-3xl font-bold p-1 z-20 transition-colors"
                    onClick={onClose}
                >
                    &times;
                </button>
                
                {/* 2. Área de la Imagen Circular */}
                {vet.image && (
                    <div className="flex justify-center mb-6 -mt-16">
                        <div 
                            // Cambiamos ring-white a ring-color-fondo para que se vea bien
                            className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 shadow-lg"
                            style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-fondo)', borderWidth: '4px' }}
                        >
                            <img 
                                src={vet.image} 
                                alt={`Imagen de ${cleanName}`} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>
                )}
                
                {/* 3. Contenido de Detalles */}
                <div className="text-center">
                    <h2 
                        // Cambiamos text-blue-800 a color-acento-secundario
                        style={{ color: 'var(--color-acento-secundario)', borderBottomColor: 'var(--color-primary)' }}
                        className="text-3xl font-extrabold pb-3 mb-4 border-b"
                    >
                        {cleanName}
                    </h2>
                    
                    <div className="space-y-3 text-sm text-left">
                        
                        {/* El resto de los campos ya usan DetailRow que aplica el estilo */}
                        <DetailRow label="Horarios" value={vet.schedules} />
                        <DetailRow label="Dirección" value={vet.address} />
                        <DetailRow label="Teléfono" value={vet.phone} />

                    </div>
                </div>
            </div>
        </div>
    );
}