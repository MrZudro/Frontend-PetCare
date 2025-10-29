import React from 'react';

// Reutilizamos la función auxiliar para mostrar los detalles
const DetailRow = ({ label, value }) => (
    <p style={{ color: 'var(--color-texto)' }}>
        <strong style={{ color: 'var(--color-texto)' }} className="font-semibold">
            {label}:
        </strong> {value}
    </p>
);

export default function VeterinaryDetailView({ vet }) {
    if (!vet) return null;

    const cleanName = vet.name.replace(/\n/g, ' ');

    return (
        <div 
            // Contenedor principal con colores del tema
            style={{ 
                backgroundColor: 'var(--color-fondo)', 
                borderColor: 'var(--color-primary)' 
            }}
            className="w-full max-w-2xl mx-auto mt-8 p-6 border rounded-xl shadow-2xl"
        >
            
            <h1 
                // Título principal con color de acento
                style={{ color: 'var(--color-acento-secundario)', borderBottomColor: 'var(--color-primary)' }}
                className="text-4xl font-extrabold text-center border-b-4 pb-4 mb-6"
            >
                Información Detallada
            </h1>

            {/* Área Superior de la Imagen y Nombre */}
            <div className="flex flex-col items-center">
                
                {/* 1. Área de la Imagen Circular */}
                {vet.image && (
                    <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-200 ring-8 ring-blue-50 shadow-xl mb-6">
                        <img 
                            src={vet.image} 
                            alt={`Imagen de ${cleanName}`} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                )}
                
                {/* 2. Nombre principal con color de texto */}
                <h2 style={{ color: 'var(--color-texto)' }} className="text-4xl font-black mb-6">
                    {cleanName}
                </h2>
            </div>


            {/* 3. Contenido de Detalles: SOLO CONTACTO Y HORARIOS */}
            <div 
                // Margen superior para separarlo de la imagen/nombre
                className="space-y-4 text-base mt-8" 
            >
                
                <h3 
                    // Título secundario centrado con color de acento
                    style={{ color: 'var(--color-acento-secundario)', borderBottomColor: 'var(--color-primary)' }}
                    className="text-xl font-bold mb-4 border-b pb-2 text-center"
                >
                    Contacto y Horarios
                </h3>
                
                {/* Campos de contacto (usan DetailRow) */}
                <DetailRow label="Dirección" value={vet.address} />
                <DetailRow label="Teléfono" value={vet.phone} />
                <DetailRow label="Horarios" value={vet.schedules} />
                
            </div>
            
        </div>
    );
}