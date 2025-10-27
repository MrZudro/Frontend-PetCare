const Banner = () => {
  return (
    // 1. Contenedor principal del Banner
    // Se ha ajustado:
    // - h-16 (Altura por defecto, móvil) -> h-24 (Altura en md/escritorio)
    <div className="bg-gray-300 h-30 flex justify-center items-center sm:h-20 md:h-40">  
        {/* 2. Área del Texto (Título) */}
        {/* Se ha ajustado:
            - text-xl (Fuente por defecto, móvil) -> text-2xl (Fuente en md/escritorio) 
        */}
        <h1 className="text-black text-xl font-bold sm:text-2xl">
          Veterinarias
        </h1>
    </div>
  );
};

export default Banner;