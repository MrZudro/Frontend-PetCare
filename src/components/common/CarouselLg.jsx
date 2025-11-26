import React, { useState, useEffect, useRef, useMemo } from 'react';

// Duración fija para el scroll suave, clave para el loop
const SCROLL_DURATION_MS = 500;

// Componente Carrusel Reutilizable con Paginación de Puntos, Desplazamiento por Página y Loop Continuo
const CarouselLg = ({ items, renderItem, title, linkText, linkUrl, autoSlideInterval = 5000, isHero = false }) => {
    
    // --- Lógica para determinar itemsPerPage para CLONACIÓN y Paginación ---
    const CLONING_ITEMS_PER_PAGE = isHero ? 1 : 3; 

    const itemsPerPage = CLONING_ITEMS_PER_PAGE;
    
    // Clona el primer grupo de ítems (al menos una página) al final para simular el loop continuo.
    const clonedItems = useMemo(() => {
        if (!items || items.length === 0) return [];
        const clones = items.slice(0, itemsPerPage).map(item => ({ ...item, isClone: true }));
        return [...items, ...clones];
    }, [items, itemsPerPage]);

    const [currentSlide, setCurrentSlide] = useState(0); 
    const carouselRef = useRef(null);
    const totalItems = clonedItems.length;
    const realItemsCount = items.length;
    
    // Calcula los índices de inicio de cada página para los dots, solo de los ítems reales.
    const pageIndices = useMemo(() => {
        const indices = [];
        for (let i = 0; i < realItemsCount; i += itemsPerPage) {
            indices.push(i);
        }
        return indices.length > 0 ? indices : (realItemsCount > 0 ? [0] : []);
    }, [realItemsCount, itemsPerPage]);
    
    // Lógica para calcular el índice del DOT activo (Paginación)
    const currentPageStart = useMemo(() => {
        const realCurrentSlide = currentSlide % realItemsCount; 
        
        let closestIndex = 0;
        for (const idx of pageIndices) {
            if (realCurrentSlide >= idx) {
                closestIndex = idx;
            } else {
                break;
            }
        }
        return closestIndex;
    }, [currentSlide, realItemsCount, pageIndices]);

    const activeDotIndex = pageIndices.indexOf(currentPageStart);

    // 🌟 Efecto para Desplazamiento Automático (Loop Continuo) 🌟
    useEffect(() => {
        if (realItemsCount <= itemsPerPage || autoSlideInterval <= 0) return; 

        let resetTimeout = null;

        const interval = setInterval(() => {
            setCurrentSlide(prevSlide => {
                const nextSlideIndex = prevSlide + itemsPerPage;
                
                if (nextSlideIndex >= realItemsCount) {
                    const cloneIndex = realItemsCount;
                    
                    resetTimeout = setTimeout(() => {
                        if (carouselRef.current) {
                            carouselRef.current.scrollTo({ left: 0, 
                                behavior: 'instant' }); 
                        }
                        setCurrentSlide(0);
                    }, SCROLL_DURATION_MS); 
                    
                    return cloneIndex;
                }

                return nextSlideIndex;
            });
        }, autoSlideInterval); 

        return () => {
            clearInterval(interval);
            if (resetTimeout) clearTimeout(resetTimeout);
        };
    }, [realItemsCount, itemsPerPage, autoSlideInterval]);

    // Efecto para sincronizar el desplazamiento visual con el estado
    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel && totalItems > 0) {
            const itemWidth = carousel.children[0]?.offsetWidth || 0;
            
            carousel.scrollTo({
                left: currentSlide * itemWidth,
                behavior: 'smooth',
            });
        }
    }, [currentSlide, totalItems]);
    
    const goToSlide = (pageIndex) => {
        setCurrentSlide(pageIndex);
    };

    // 🏆 CAMBIO CLAVE AQUÍ: Reducido de py-8 a py-4 para menor margen vertical
    const sectionClass = isHero ? "py-0" : "**py-4** bg-white rounded-xl shadow-lg mb-8";

    return (
        <section className={`${sectionClass} max-w-7xl mx-auto`}>
            
            {/* CSS para eliminar la barra de desplazamiento */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            <div className="w-full px-0 sm:px-0 lg:px-0">
                
                {/* 🔑 Encabezado de la Sección */}
                {!isHero && (
                    <div 
                        className="flex flex-col justify-start items-start md:flex-row md:justify-between md:items-end px-4 sm:px-6 lg:px-8 mb-4"
                    >
                        
                        {/* Título */}
                        <h2 
                            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 
                                     truncate max-w-full whitespace-nowrap order-2 md:order-1 w-full md:w-auto"
                        >
                            {title}
                        </h2>
                        
                        {/* Enlace */}
                        {linkUrl && (
                            <a 
                                href={linkUrl} 
                                className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150 
                                          text-xs sm:text-sm whitespace-nowrap order-1 md:order-2 mb-1 md:mb-0"
                            >
                                {linkText} &rarr;
                            </a>
                        )}
                    </div>
                )}

                <div className="relative">
                    {/* Contenedor de Items del Carrusel */}
                    <div 
                        ref={carouselRef}
                        // Solo padding lateral (px) y padding inferior (pb-4)
                        className={`flex overflow-x-scroll space-x-0 sm:space-x-6 pb-4 hide-scrollbar snap-x snap-mandatory 
                            ${!isHero && 'px-4 sm:px-6 lg:px-8'}`} 
                        style={{ scrollBehavior: 'smooth' }} 
                    >
                        {/* Mapeamos los ítems clonados */}
                        {clonedItems.map((item, index) => (
                            <div 
                                key={index} 
                                // CLASES RESPONSIVE: Determinan el ancho
                                className={`shrink-0 w-full 
                                            ${isHero 
                                                ? 'snap-start' 
                                                : 'sm:w-1/2 lg:w-1/3 2xl:w-1/4 px-3 snap-start'
                                            }`}
                            >
                                {renderItem(item, index)}
                            </div>
                        ))}
                    </div>

                    {/* Paginación de Puntos (Dots) */}
                    {pageIndices.length > 1 && (
                        <div className="flex justify-center mt-4">
                            <div className="flex space-x-2 bg-white/70 p-2 rounded-full shadow-md">
                                {pageIndices.map((pageIndex, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(pageIndex)} 
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            index === activeDotIndex
                                                ? 'bg-indigo-600 w-5' 
                                                : 'bg-gray-300'
                                        }`}
                                        aria-label={`Ir a la página ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CarouselLg;