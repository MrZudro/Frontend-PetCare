/**
 * Componente de tarjeta para mostrar el nombre, la imagen y un detalle de una veterinaria.
 * @param {string} name - El nombre a mostrar.
 * @param {string} imageUrl - La URL de la imagen de la veterinaria.
 * @param {string} address - La dirección de la veterinaria (para mostrar un detalle).
 * @param {function} onClick - Función que se ejecuta al hacer clic en la tarjeta.
 */

const Card = ({ name = "Nombre\nVeterinaria", imageUrl, address, onClick }) => {
 
  // Mantiene el manejo del texto para saltos de línea (\n)
  const displayText = name.split('\n').map((line, index) => (
    <span key={index} className="block">
      {line}
    </span>
  ));

  return (
    // 1. Contenedor Principal: Colores del Estándar
    <div 
      // Aplicamos color de fondo y borde primario
      style={{ 
          backgroundColor: 'var(--color-fondo)', 
          borderColor: 'var(--color-primary)' 
      }}
      // Se ajustan los tamaños máximos
      className="w-full max-w-44 sm:max-w-52 p-4 border rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition duration-300 transform hover:scale-[1.03]"
      onClick={onClick}
    >
      
      <div 
        // Aumentamos el tamaño del círculo para todos los breakpoints
        className="h-24 w-24 rounded-full mb-4 flex items-center justify-center overflow-hidden sm:h-28 sm:w-28 md:h-40 md:w-40 md:mb-6"
        style={{ backgroundColor: 'var(--color-fondo)' }} 
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name.replace('\n', ' ')} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span className="text-gray-500 text-3xl md:text-5xl">🐾</span> // Ícono por defecto
        )}
      </div>
      
      {/* 3. Área del Texto (Nombre) - Colores del Estándar */}
      <h3 
        // Aplicamos color-acento-secundario para el titular
        style={{ color: 'var(--color-acento-secundario)' }}
        className="text-lg font-extrabold leading-tight md:text-xl mb-2"
      >
        {displayText}
      </h3>
      
      {/* 4. Detalle Adicional (Dirección) - Color del Estándar */}
      {address && (
          // Usamos color-texto con opacidad sutil
          <p style={{ color: 'var(--color-texto)' }} className="text-xs opacity-70 truncate w-full px-1">
            {address}
          </p>
      )}

    </div>
  );
};

export default Card;