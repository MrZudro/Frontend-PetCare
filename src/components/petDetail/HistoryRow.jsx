// src/components/petHistory/HistoryRow.jsx

import React from 'react';

export default function HistoryRow({ date, type, detail, next_date, onClick, data }) {
    
    const isConsulta = type === 'Consulta';
    const iconColor = isConsulta ? 'var(--color-acento-secundario, #0388A6)' : 'var(--color-primary, #0FC2C0)';
    
    // Ajustamos los iconos para que sean un poco más pequeños en móvil (h-5 w-5)
    const icon = isConsulta ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: iconColor}}>
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-9 0V3h4v2m-4 0h4m-4 4h.01M9 13h.01M9 17h.01M15 13h.01M15 17h.01" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: iconColor}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.617-4.21a2 2 0 011.082.723l1.821 3.51a1 1 0 01-.43 1.34L14 16l-3 3-4-4-3.51-1.82a1 1 0 01-.43-1.34l1.82-3.51a2 2 0 011.083-.723L8 4h8l1.617.79z" />
        </svg>
    );

    const isClickable = typeof onClick === 'function'; 
    
    const clickHandler = () => {
        if (isClickable) {
            onClick(data);
        }
    };

    // Ajustamos el padding (p-3) y el hover de fondo
    const rowClasses = `flex items-start p-3 sm:p-4 transition duration-150 border-b border-gray-100 last:border-b-0 ${isClickable ? 'cursor-pointer hover:bg-gray-100' : 'hover:bg-gray-50'}`;

    return (
        <div 
            className={rowClasses}
            onClick={clickHandler}
        >
            
            {/* 1. Icono de tipo de registro (Ajustamos el margen derecho) */}
            <div className="shrink-0 mr-3 sm:mr-4 mt-0.5"> 
                {icon}
            </div>

            {/* 2. CONTENIDO PRINCIPAL: DETALLES DE LA FILA */}
            <div className="grow">
                {/* Título: Detalle (Ajustamos el tamaño de fuente) */}
                <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight" style={{color: 'var(--color-texto, #161728)'}}>{detail}</p>
                
                {/* Subtítulo: Fecha y Próxima Dosis (Ajustamos el tamaño de fuente) */}
                <div className="text-xs sm:text-sm mt-1">
                    {/* Fecha de registro */}
                    <span className="text-gray-600 mr-2 sm:mr-4">{date}</span>

                    {/* Próxima Dosis (Ajustamos el tamaño del badge) */}
                    {next_date && !isConsulta && (
                        <span 
                            className="font-medium px-1.5 py-0.5 rounded-full text-2xs sm:text-xs ml-2"
                            style={{ backgroundColor: 'rgba(15, 194, 192, 0.1)', color: 'var(--color-primary, #0FC2C0)' }}
                        >
                            Próx: {next_date}
                        </span>
                    )}
                </div>
            </div>
            
            {/* 3. Flecha para indicar que es clickeable */}
            <div className="shrink-0 ml-4 self-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
        </div>
    );
}