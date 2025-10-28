
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// Función auxiliar para combinar clases de Tailwind
const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Componente Modal de Vista Rápida (Sin Calificación)
 */
const QuickViewModalLg = ({ product, onClose }) => {
    if (!product) return null;

    // --- CORRECCIÓN CLAVE 1: Usar encadenamiento opcional (?.) para evitar 'undefined' ---
    // Si product.colors o product.sizes es undefined, usamos un array vacío ([]) por defecto.
    const colors = product.colors ?? [];
    const sizes = product.sizes ?? [];

    // Estado local para selecciones del producto
    // Inicialización segura: si el array 'colors' está vacío, usamos 'null'.
    const [selectedColor, setSelectedColor] = useState(colors[0]?.id || null);
    const [selectedSize, setSelectedSize] = useState(sizes[0]?.name || null);

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
                        
                        {/* Imagen del Producto */}
                        <img
                            alt={product.imageAlt}
                            src={product.imageUrl}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5 shadow-lg"
                        />

                        {/* Detalles del Producto */}
                        <div className="sm:col-span-8 lg:col-span-7">
                            <span className="text-sm font-semibold text-indigo-600 mb-1 block">{product.category}</span>
                            <h2 className="text-3xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

                            <section aria-labelledby="information-heading" className="mt-4 border-b pb-4">
                                <h3 id="information-heading" className="sr-only">Información del Producto</h3>
                                
                                <p className="text-3xl font-extrabold text-indigo-600 mt-2">
                                    {/* CORRECCIÓN: Usar el formato de moneda de peso colombiano ($) de forma segura */}
                                    {`$${product.price?.toLocaleString('es-CO', { minimumFractionDigits: 0 }) ?? 'N/A'}`}
                                </p>
                            </section>
                            
                            {/* Descripción Completa */}
                            <section aria-labelledby="description-heading" className="mt-4">
                                <h3 id="description-heading" className="text-lg font-medium text-gray-900">
                                    Descripción
                                </h3>
                                <div className="mt-2 space-y-3 text-sm text-gray-600">
                                    <p>{product.description}</p>
                                </div>
                            </section>

                            {/* Opciones (Colores y Tallas) */}
                            <section aria-labelledby="options-heading" className="mt-6">
                                <h3 id="options-heading" className="sr-only">Opciones del producto</h3>

                                <form>
                                    {/* Colores */}
                                    {/* CORRECCIÓN CLAVE 2: Usar el array 'colors' ya seguro */}
                                    {colors.length > 0 && (
                                        <fieldset aria-label="Elige un color">
                                            <legend className="text-sm font-medium text-gray-900">Color</legend>
                                            <div className="mt-2 flex items-center gap-x-3">
                                                {colors.map((color) => (
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

                                    {/* Tallas/Tamaños */}
                                    {/* CORRECCIÓN CLAVE 3: Usar el array 'sizes' ya seguro */}
                                    {sizes.length > 0 && (
                                        <fieldset className="mt-4" aria-label="Elige un tamaño">
                                            <legend className="text-sm font-medium text-gray-900">Tamaño</legend>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {sizes.map((size) => (
                                                    <button
                                                        key={size.name}
                                                        type="button"
                                                        // Hacemos una comprobación de inStock más segura
                                                        disabled={size.inStock === false} 
                                                        onClick={() => setSelectedSize(size.name)}
                                                        className={combineClasses(
                                                            'px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-150',
                                                            size.inStock === false ? 
                                                                'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' :
                                                                size.name === selectedSize ? 
                                                                    'bg-indigo-600 text-white border-indigo-600 shadow-md' : 
                                                                    'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                        )}
                                                    >
                                                        {size.name}
                                                        {size.inStock === false && <span className="sr-only"> - Agotado</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </fieldset>
                                    )}

                                    {/* Botón de Añadir al Carrito */}
                                    <button
                                        type="submit"
                                        className="mt-6 flex w-full items-center justify-center rounded-lg border border-transparent bg-green-500 px-8 py-3 text-base font-bold text-white shadow-md hover:bg-green-600 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-hidden active:scale-[0.99]"
                                        // La lógica de deshabilitar ahora usa el array 'sizes' seguro
                                        disabled={sizes.some(s => s.name === selectedSize && s.inStock === false)}
                                    >
                                        Añadir al Carrito
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

export default QuickViewModalLg;
