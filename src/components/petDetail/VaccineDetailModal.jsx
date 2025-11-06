// src/components/petDetail/VaccineDetailModal.jsx

import React, { useEffect } from 'react'; 

// Componente auxiliar para las filas de detalle (Sin cambios)
const DetailRow = ({ label, value }) => (
    <div className="flex flex-wrap justify-between py-2 border-b border-gray-100 last:border-b-0">
        <dt className="text-sm font-medium text-gray-700 w-full sm:w-auto">{label}</dt>
        <dd className="text-sm font-semibold text-gray-900 text-right w-full sm:w-auto">{value || 'N/A'}</dd>
    </div>
);

export default function VaccineDetailModal({ vaccineData, onClose }) {

    if (!vaccineData) return null;

    // ✨ CÓDIGO CLAVE DE SCROLL CORREGIDO (USANDO CLASES CSS)
    useEffect(() => {
        // Bloquear el scroll del body al abrir el modal
        document.body.classList.add('modal-open-no-scroll');
        
        // Función de limpieza: restaurar el scroll del body al cerrar el modal
        return () => {
            document.body.classList.remove('modal-open-no-scroll');
        };
    }, []); 

    const handleGeneratePdf = () => {
        const petName = vaccineData.pet_name || "Mascota";
        const applicationDate = vaccineData.date;

        alert(`
            --- 📜 Generando Certificado de Vacunación ---
            Mascota: ${petName}
            Vacuna: ${vaccineData.name}
            Fecha de Aplicación: ${applicationDate}
            ------------------------------------------------
            (¡En producción, se descargaría un archivo PDF con detalles!)
        `);
    };
    
    // Lista de campos. (Sin cambios)
    const detailFields = [
        { label: "Fecha de Aplicación", value: vaccineData.date },
        { label: "Fecha de Renovación", value: vaccineData.next_date },
        { label: "Vacuna", value: vaccineData.name },
        // { label: "Número de Lote", value: vaccineData.lote || "No especificado" },
        { label: "Observaciones", value: vaccineData.observations || "Ninguna" },
        { label: "Profesional", value: vaccineData.professional || "No registrado" },
        { label: "Clínica/Sucursal", value: vaccineData.clinic || "Veterinaria Central" },
    ];


    return (
        // Overlay 
        <div 
            className="fixed inset-0 bg-gray-900/50 transition-opacity flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            {/* Contenido del Modal */}
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform scale-100 transition-transform duration-300 overflow-hidden"
                onClick={e => e.stopPropagation()} 
            >
                {/* Header */}
                <div 
                    className="relative p-4 sm:p-5 text-white" 
                    style={{ background: 'linear-gradient(to right, var(--color-primary, #0FC2C0), var(--color-acento-secundario, #0388A6))' }}
                >
                    <h3 className="text-sm sm:text-base font-semibold tracking-wide mb-1 opacity-90">
                        Detalles de la Vacuna
                    </h3>
                    <p className="text-xl sm:text-3xl font-extrabold">{vaccineData.name}</p>
                </div>

                {/* Body de Detalles */}
                <div className="p-4 sm:p-5 pb-4"> 
                    <dl className="divide-y divide-gray-100">
                        {detailFields.map((field, index) => (
                            <DetailRow key={index} label={field.label} value={field.value} />
                        ))}
                    </dl>
                    
                    {/* Bloque de Descripción */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-1">Descripción de la Vacuna</p>
                        <p className="text-sm font-semibold text-gray-900 text-left whitespace-normal">
                            {vaccineData.description || <span className="text-gray-400 italic">No especificado en el catálogo.</span>}
                        </p>
                    </div>

                </div>
                
                {/* Footer y Acciones - BOTONES */}
                <div className="p-4 pt-0 border-t border-gray-100"> 
                    <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-3"> 
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 h-full px-4 py-3 text-base font-semibold rounded-lg shadow-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleGeneratePdf}
                            className="w-full sm:flex-1 h-full px-4 py-3 text-base font-semibold rounded-lg shadow-lg transition hover:opacity-95 transform hover:scale-105 text-white text-center"
                            style={{ backgroundColor: 'var(--color-primary, #0FC2C0)' }}
                        >
                            Generar Certificado
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}