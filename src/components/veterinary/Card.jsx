/**
 * Componente de tarjeta para mostrar el nombre de una veterinaria
 * y su imagen.
 * * @param {string} name - El nombre a mostrar debajo del círculo.
 * @param {string} [imageUrl] - La URL de la imagen (opcional por ahora).
 * @param {function} onClick - Función que se ejecuta al hacer clic en la tarjeta.
 */

// AÑADIMOS 'onClick' como una propiedad desestructurada
const Card = ({ name = "Nombre\nVeterinaria", imageUrl, onClick }) => {
  
  // Mantiene el manejo del texto para saltos de línea (\n)
  const displayText = name.split('\n').map((line, index) => (
    <span key={index} className="block">
      {line}
    </span>
  ));

  return (
    // 1. Contenedor principal de la Tarjeta (Card)
    // AÑADIMOS:
    // - onClick={onClick}: Para que al hacer clic se ejecute la función pasada desde el padre (VeterinaryLw).
    // - cursor-pointer: Para indicar visualmente al usuario que es cliqueable.
    // - hover:shadow-lg: Para dar un efecto de interactividad al pasar el ratón.
    <div 
      className="w-full max-w-32 p-2 bg-white border border-gray-300 rounded-xl shadow-md flex flex-col items-center text-center md:w-40 md:p-4 md:max-w-none cursor-pointer hover:shadow-lg transition duration-300"
      onClick={onClick} // <-- ¡Añadido el manejador de clic!
    >
      
      {/* 2. Área del Círculo (Imagen) */}
      <div className="w-16 h-16 bg-gray-300 rounded-full mb-2 flex items-center justify-center overflow-hidden md:w-28 md:h-28 md:mb-4">
        {/* ... */}
      </div>
      
      {/* 3. Área del Texto (Nombre) */}
      <p className="text-xs font-bold leading-tight md:text-sm">
        {displayText}
      </p>
    </div>
  );
};

export default Card;