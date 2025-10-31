import React from 'react';

/**
 * Componente de Banner simple y reutilizable.
 * Muestra un título centrado en una franja gris.
 * * @param {object} props
 * @param {string} props.title - El texto que se mostrará como título del banner.
 */
const Banner = ({ title }) => {
  // Aseguramos que 'title' tenga un valor predeterminado si no se proporciona
  const bannerTitle = title || "Título Predeterminado"; 

  return (
    // 1. Contenedor principal del Banner
    <div className="bg-gray-300 h-32 flex justify-center items-center sm:h-20 md:h-40"> 
        {/* 2. Área del Texto (Título) */}
        {/* TAMAÑO DE FUENTE AUMENTADO: text-2xl por defecto, sm:text-4xl en pantallas grandes */}
        <h1 className="text-black text-2xl font-bold sm:text-4xl">
          {bannerTitle}
        </h1>
    </div>
  );
};

export default Banner;