// =================================================================
// src/components/products/QuickViewModalLg.jsx (MODIFICADO)
// =================================================================

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// Función auxiliar para combinar clases de Tailwind
const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Componente Modal de Vista Rápida
 * @param {object} product - El objeto producto
 * @param {function} onClose - Función para cerrar el modal
 * @param {function} onAddToCart - CLAVE: Función para agregar el producto al carrito (viene de LandingPageLg)
 * @param {function} onRedirectToCart - CLAVE: Función para redirigir al usuario a la vista de carrito
 */
const QuickViewModalLg = ({ product, onClose, onAddToCart, onRedirectToCart }) => { // 🚨 AÑADIR NUEVAS PROPS
    if (!product) return null;

    // Aseguramos que 'colors' y 'sizes' existan
    const colors = product.colors ?? [];
    const sizes = product.sizes ?? [];

    // Estado local para selecciones del producto
    const [selectedColor, setSelectedColor] = useState(colors[0]?.id || null);
    const [selectedSize, setSelectedSize] = useState(sizes[0]?.name || null);

    // Determinar si la talla seleccionada está agotada
    const isSizeOutOfStock = sizes.some(s => s.name === selectedSize && s.inStock === false);

    // 🔑 CLAVE: Handler de envío
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Añadir al carrito (usando el handler pasado por prop)
        // Nota: Solo pasamos el ID del producto, ya que el handler de la LandingPage
        // asume que las opciones ya están seleccionadas o maneja la cantidad.
        onAddToCart(product.id, selectedSize, selectedColor); 

        // 2. Cerrar el modal
        onClose();

        // 3. Redirigir al carrito
        onRedirectToCart(); 
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
                    <div className="grid w-full grid-cols-1 items-start lg:grid-cols-12 lg:gap-x-8">

                        {/* Imagen del Producto */}
                        <img
                            alt={product.imageAlt || product.name}
                            src={product.imageUrl}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5 shadow-lg"
                        />

                        {/* Detalles del Producto */}
                        <div className="sm:col-span-8 lg:col-span-7">
                            
                            {/* CATEGORÍA y ID */}
                            <div className="flex justify-between items-center text-sm font-semibold mb-1">
                                <span className="text-indigo-600 block">
                                    {product.subcategories || 'Sin Categoría'}
                                </span>
                                {/* CLAVE: Muestra el ID del producto */}
                                <span className="text-gray-500">
                                    ID: {product.id}
                                </span>
                            </div>
                            
                            {/* Nombre del Producto */}
                            <h2 className="text-3xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>
                            
                            {/* MARCA */}
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p>
                                    <span className="font-semibold text-gray-800">Marca: </span>
                                    {product.brand || 'No especificada'}
                                </p>
                            </div>

                            <section aria-labelledby="information-heading" className="mt-4 border-b pb-4">
                                <h3 id="information-heading" className="sr-only">Información del Producto</h3>
                                
                                <p className="text-3xl font-extrabold text-indigo-600 mt-2">
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

                                {/* 🚨 CLAVE: Usamos el nuevo handler 'handleSubmit' en el form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Colores */}
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
                                    {sizes.length > 0 && (
                                        <fieldset className="mt-4" aria-label="Elige un tamaño">
                                            <legend className="text-sm font-medium text-gray-900">Tamaño</legend>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {sizes.map((size) => (
                                                    <button
                                                        key={size.name}
                                                        type="button"
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
                                        disabled={isSizeOutOfStock}
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