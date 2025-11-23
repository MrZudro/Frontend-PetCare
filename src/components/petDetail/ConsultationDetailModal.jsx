// src/components/petDetail/ConsultationDetailModal.jsx

import React, { useEffect } from 'react'; 

// Componente auxiliar para las filas de detalle (Sin cambios)
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
    </div>
);

export default function ConsultationDetailModal({ consultationData, onClose }) {
    if (!consultationData) return null;
    
    // ✨ CÓDIGO CLAVE DE SCROLL CORREGIDO (USANDO CLASES CSS)
    useEffect(() => {
        // Bloquear el scroll del body al abrir el modal
        document.body.classList.add('modal-open-no-scroll');
        
        // Función de limpieza: restaurar el scroll al cerrar el modal
        return () => {
            document.body.classList.remove('modal-open-no-scroll'); 
        };
    }, []); 

    // Desestructuración de datos (Sin cambios)
    const {
        pet_name,
        date,
        reason,
        diagnosis,
        prescription, 
        professional,
        clinic,
        weight, 
        temperature, 
        physical_examination, 
        observation, 
    } = consultationData;

    // --- FUNCIÓN: handleGenerateReport (Sin cambios) ---
    const handleGenerateReport = () => {
        alert(`
            --- 📜 Generando Reporte de Consulta ---
            Mascota: ${pet_name}
            Fecha de Consulta: ${date}
            Motivo: ${reason}
            Profesional: ${professional}
            ------------------------------------------------
            (¡En producción, se descargaría un archivo PDF!)
        `);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 transition-opacity flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Encabezado */}
                <div 
                    className="p-5 text-white" 
                    style={{ background: 'linear-gradient(to right, var(--color-acento-secundario, #0388A6), #06B6D4)' }}
                >
                    <h3 className="text-lg font-bold opacity-80 mb-1">Detalles de la Consulta</h3>
                    <h2 className="text-2xl font-extrabold">{pet_name} - {date}</h2> 
                </div>

                {/* Contenido del Detalle */}
                <div className="p-6 space-y-4">
                    
                    {/* Sección de Motivo */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-bold text-gray-600 mb-1">Motivo de la Consulta</p>
                        <p className="text-base font-semibold text-gray-800">{reason}</p>
                    </div>

                    {/* Detalles Administrativos */}
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg p-3">
                        <DetailRow label="Profesional" value={professional} />
                        <DetailRow label="Clínica/Sucursal" value={clinic} />
                    </div>

                    {/* DETALLES FÍSICOS */}
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg p-3">
                        <DetailRow label="Peso (Kg)" value={weight} />
                        <DetailRow label="Temperatura (°C)" value={temperature} />
                    </div>

                    {/* Detalles de Diagnóstico (solo diagnóstico en fila) */}
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg p-3">
                        <DetailRow label="Diagnóstico" value={diagnosis} />
                    </div>

                    {/* EXÁMEN FÍSICO Y OBSERVACIONES */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm font-bold text-gray-600 mb-1">Examen Físico</p>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{physical_examination}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-600 mb-1">Notas/Observaciones</p>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{observation}</p>
                        </div>
                    </div>

                    {/* Tratamiento/Prescripción: misma caja que Diagnóstico, título arriba y texto debajo */}
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
                        <div className="p-3">
                            <p className="text-sm font-bold text-gray-600 mb-0">Tratamiento/Prescripción</p>
                        </div>
                        <div className="p-3 bg-gray-50">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap wrap-break-words mb-0">{prescription}</p>
                        </div>
                    </div>



                </div>

                {/* Pie del Modal (Botones) */}
                <div className="p-4 border-t border-gray-100 flex justify-between space-x-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 h-full px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
                    >
                        Cerrar
                    </button>
                    <button 
                        onClick={handleGenerateReport}
                        className="flex-1 h-full px-4 py-3 text-sm font-bold rounded-lg text-white transition duration-150 shadow-md transform hover:scale-105"
                        style={{ backgroundColor: 'var(--color-primary, #0FC2C0)' }}
                    >
                        Generar Reporte
                    </button>
                </div>
            </div>
        </div>
    );
}