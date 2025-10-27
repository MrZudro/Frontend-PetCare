import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // Importaciones originales
import { FiShoppingCart } from 'react-icons/fi'; // Aunque no se usa visiblemente, es bueno mantener las originales

// Función auxiliar para combinar clases de Tailwind (Copia la original)
const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Componente Modal de Vista Rápida para Servicios (Copia de QuickViewModalLg)
 * Cambios: 
 * 1. Precio está ausente.
 * 2. Botón dice "Agendar Servicio" y usa color verde.
 * 3. Se asume que el objeto 'service' tiene estructura similar a 'product'.
 */
const ServiceQuickViewModalLg = ({ service, onClose }) => {
    // Usamos 'service' en lugar de 'product' para mayor claridad
    if (!service) return null;

    // Estado local para selecciones (aunque no se usen para servicios, mantenemos por si el componente base lo espera)
    const [selectedColor, setSelectedColor] = useState(service.colors?.[0]?.id || null);
    const [selectedSize, setSelectedSize] = useState(service.sizes?.[0]?.name || null);

    // Adaptamos los arrays de opciones para que no se rendericen si no existen en el objeto de servicio.
    const serviceColors = service.colors || [];
    const serviceSizes = service.sizes || [];
    
    // Función de manejo del agendamiento
    const handleAgendar = (e) => {
        e.preventDefault();
        console.log("Servicio Agendado:", service.id, "Opciones:", { selectedColor, selectedSize });
        // Aquí iría la lógica para redirigir a una página de agendamiento o mostrar un mensaje.
        onClose(); 
    };

    return (
        // Diálogo / Backdrop (Fondo Oscuro)
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-gray-900/75 transition-opacity" aria-hidden="true" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-4 text-center md:items-center md:px-2 lg:px-4">
                
                {/* Panel del Diálogo / Contenido Principal */}
                <div className="relative flex w-full max-w-lg transform items-center overflow-hidden rounded-xl bg-white px-4 pt-14 pb-8 shadow-2xl transition-all sm:px-6 sm:pt-8 md:p-6 lg:max-w-4xl lg:p-8">
                    
                    {/* Botón de Cerrar */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8 z-10 p-2 rounded-full bg-white transition-colors shadow-md"
                        aria-label="Cerrar vista rápida"
                    >
                        <FaTimes aria-hidden="true" className="size-6" />
                    </button>

                    {/* Contenido del Producto (Grid) */}
                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                        
                        {/* Imagen del Servicio */}
                        <img
                            alt={service.imageAlt}
                            src={service.imageUrl}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5 shadow-lg"
                        />

                        {/* Detalles del Servicio */}
                        <div className="sm:col-span-8 lg:col-span-7">
                            <span className="text-sm font-semibold text-indigo-600 mb-1 block">{service.category}</span>
                            <h2 className="text-3xl font-bold text-gray-900 sm:pr-12">{service.name}</h2>

                            <section aria-labelledby="information-heading" className="mt-4 border-b pb-4">
                                <h3 id="information-heading" className="sr-only">Información del Servicio</h3>
                                
                                {/* ELIMINACIÓN CLAVE: EL PRECIO YA NO ESTÁ AQUÍ */}
                                {/* <p className="text-3xl font-extrabold text-indigo-600 mt-2">${service.price.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p> */}

                            </section>
                            
                            {/* Descripción Completa */}
                            <section aria-labelledby="description-heading" className="mt-4">
                                <h3 id="description-heading" className="text-lg font-medium text-gray-900">
                                    Descripción
                                </h3>
                                <div className="mt-2 space-y-3 text-sm text-gray-600">
                                    <p>{service.description}</p>
                                </div>
                            </section>

                            {/* Opciones (Colores y Tallas/Tamaños) */}
                            <section aria-labelledby="options-heading" className="mt-6">
                                <h3 id="options-heading" className="sr-only">Opciones del servicio</h3>

                                <form onSubmit={handleAgendar}>
                                    {/* Colores (Solo si el servicio tiene colores definidos) */}
                                    {serviceColors.length > 0 && (
                                        <fieldset aria-label="Elige un color">
                                            <legend className="text-sm font-medium text-gray-900">Color</legend>
                                            <div className="mt-2 flex items-center gap-x-3">
                                                {serviceColors.map((color) => (
                                                    <button
                                                        key={color.id}
                                                        type="button"
                                                        onClick={() => setSelectedColor(color.id)}
                                                        className={combineClasses(
                                                            color.classes,
                                                            'size-8 rounded-full outline outline-offset-1 outline-gray-400/20 shadow-md transition-all duration-150',
                                                            color.id === selectedColor ? 'ring-2 ring-offset-2 ring-indigo-600' : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                                                        )}
                                                        aria-label={color.name}
                                                    >
                                                        <span className="sr-only">{color.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </fieldset>
                                    )}

                                    {/* Tallas/Tamaños (Solo si el servicio tiene tallas definidas) */}
                                    {serviceSizes.length > 0 && (
                                        <fieldset className="mt-4" aria-label="Elige un tamaño">
                                            <legend className="text-sm font-medium text-gray-900">Tamaño</legend>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {serviceSizes.map((size) => (
                                                    <button
                                                        key={size.name}
                                                        type="button"
                                                        disabled={!size.inStock}
                                                        onClick={() => setSelectedSize(size.name)}
                                                        className={combineClasses(
                                                            'px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-150',
                                                            !size.inStock ? 
                                                                'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' :
                                                                size.name === selectedSize ? 
                                                                    'bg-indigo-600 text-white border-indigo-600 shadow-md' : 
                                                                    'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                        )}
                                                    >
                                                        {size.name}
                                                        {!size.inStock && <span className="sr-only"> - Agotado</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </fieldset>
                                    )}

                                    {/* CAMBIO CLAVE: Botón de Agendar Servicio */}
                                    <button
                                        type="submit"
                                        className="mt-6 flex w-full items-center justify-center rounded-lg border border-transparent bg-pink-400 px-8 py-3 text-base font-bold text-white shadow-md hover:bg-blue-500 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-hidden active:scale-[0.99]"
                                        disabled={serviceSizes.some(s => s.name === selectedSize && !s.inStock)}
                                    >
                                        Agendar Servicio
                                    </button>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceQuickViewModalLg;