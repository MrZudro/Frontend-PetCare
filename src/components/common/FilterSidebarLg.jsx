import React, { useState, useEffect, useMemo } from 'react';
import { FaChevronUp, FaChevronDown, FaCheck, FaTimes, FaSearch } from 'react-icons/fa'; 
import { FiSliders } from 'react-icons/fi';

// IMPORTACIÓN DE DATOS (Asegúrate de que la ruta sea correcta)
import productData from '../Data/products.json'; 
import serviceData from '../Data/services.json'; 

// Función de utilidad para extraer filtros únicos y sus conteos (API-like)
const processFilterData = (data, keyName) => {
    if (!data || data.length === 0) return [];
    
    const counts = data.reduce((acc, item) => {
        const value = item[keyName];
        if (value) {
            acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
    }, {});

    return Object.keys(counts).map(name => ({
        name,
        count: counts[name],
        active: false,
    }));
};

// Generar datos de filtro iniciales
const initialProductFiltersData = {
    category: processFilterData(productData, 'category'),
    type: processFilterData(productData, 'type'),
    brand: processFilterData(productData, 'brand'),
};

const initialServiceFiltersData = {
    category: processFilterData(serviceData, 'category'),
    clinic: processFilterData(serviceData, 'clinicName'),
};
// ----------------------------------

/**
 * Componente de Barra Lateral de Filtros (Responsive: Sidebar en LG+, Modal/Botón fijo en <LG)
 */
const FilterSidebarLg = ({ onFilterChange, onSortChange, totalResults = 0, mode = 'products' }) => {
    
    const isProductMode = mode === 'products';
    
    const getCurrentInitialData = () => 
        isProductMode 
            ? initialProductFiltersData 
            : initialServiceFiltersData;

    const [filters, setFilters] = useState(getCurrentInitialData);
    const [currentSort, setCurrentSort] = useState('default');
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false); // <-- Estado para el modal móvil
    
    const [openSections, setOpenSections] = useState(
        Object.keys(getCurrentInitialData()).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    // 1. Sincronizar y reiniciar filtros al cambiar de modo
    useEffect(() => {
        const newData = getCurrentInitialData();
        setFilters(newData);
        setCurrentSort('default'); 
        setOpenSections(Object.keys(newData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        
        if (onFilterChange) {
            onFilterChange({ filters: newData, searchTerm: '', mode: mode });
        }
    }, [mode]); 

    // 2. Notificar al componente padre sobre los cambios de FILTRO (Mantiene la funcionalidad en tiempo real)
    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                filters: filters,
                searchTerm: '', 
                mode: mode,
            });
        }
    }, [filters, mode, onFilterChange]);
    
    // --- LÓGICA DE FILTRADO Y MANEJO DE ESTADO (TU LÓGICA ORIGINAL) ---

    const handleSortSelect = (e) => {
        const newSortKey = e.target.value;
        setCurrentSort(newSortKey);
        if (onSortChange) {
            onSortChange(newSortKey);
        }
    };

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleFilterSelection = (sectionKey, filterName) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            
            const isRadioSection = sectionKey === 'category' || sectionKey === 'brand' || sectionKey === 'clinic';
            
            if (isRadioSection) {
                 newFilters[sectionKey] = newFilters[sectionKey].map(f => ({
                     ...f,
                     // Lógica Radio
                     active: (f.name === filterName) ? !f.active : false
                 }));
            } else {
                // Lógica Checkbox
                newFilters[sectionKey] = newFilters[sectionKey].map(f => {
                    if (f.name === filterName) {
                        return { ...f, active: !f.active };
                    }
                    return f;
                });
            }
            return newFilters;
        });
    };

    const handleTagRemove = (filterName) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            Object.keys(newFilters).forEach(sectionKey => {
                newFilters[sectionKey] = newFilters[sectionKey].map(f => {
                    if (f.name === filterName) {
                        return { ...f, active: false };
                    }
                    return f;
                });
            });
            return newFilters;
        });
    };
    // --- FIN LÓGICA DE FILTRADO ---


    const activeTags = Object.keys(filters).flatMap(key => 
        filters[key]?.filter(f => f.active).map(f => f.name) || []
    );

    // --- FUNCIÓN DE RENDERING DE CADA SECCIÓN DE FILTRO (REUTILIZADA) ---
    const renderFilterSection = (title, key) => {
        if (!filters[key] || filters[key].length === 0) return null;

        return (
            <div key={key} className="border-b border-gray-200 py-4 last:border-b-0">
                <button
                    className="flex w-full items-center justify-between text-gray-800 hover:text-indigo-600 transition-colors"
                    onClick={() => toggleSection(key)}
                    aria-expanded={openSections[key]}
                >
                    <span className="font-semibold text-base">{title}</span>
                    {openSections[key] ? <FaChevronUp className="size-3" /> : <FaChevronDown className="size-3" />}
                </button>
                {openSections[key] && (
                    <div className="mt-2 space-y-2">
                        {filters[key].map((filter) => (
                            <div
                                key={filter.name}
                                className={`flex items-center text-sm cursor-pointer py-1 px-1 rounded transition-colors`}
                                // ESTO HACE QUE FUNCIONE: LLAMADA DIRECTA AL MANEJADOR DE ESTADO
                                onClick={() => handleFilterSelection(key, filter.name)} 
                            >
                                <span className={`inline-flex items-center justify-center size-4 border rounded mr-2 ${filter.active ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-transparent'}`}>
                                    {filter.active && <FaCheck className="size-2 text-white" />}
                                </span>
                                <span className={`truncate ${filter.active ? 'font-medium text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}>{filter.name}</span>
                                <span className="ml-auto text-gray-400 font-normal">({filter.count})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    const renderProductFilters = () => (
        <>
            {renderFilterSection('Categoría', 'category')}
            {renderFilterSection('Tipo', 'type')}
            {renderFilterSection('Marca', 'brand')}
        </>
    );

    const renderServiceFilters = () => (
        <>
            {renderFilterSection('Categoría de Servicio', 'category')} 
            {renderFilterSection('Clínicas Destacadas', 'clinic')} 
        </>
    );

    // --- FUNCIÓN QUE CONTIENE TODO EL CONTENIDO DEL FILTRO (REUTILIZABLE) ---
    const renderFilterContent = (isMobileView = false) => (
        <div className={`w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6 ${!isMobileView ? 'sticky top-4 self-start' : ''}`}>
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 border-b pb-4">
                <FiSliders className="mr-2 text-indigo-600 size-5" />
                Filtros
            </h2>

            <div className="mb-4 text-sm text-gray-600">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">
                        {isMobileView ? `Resultados: ${totalResults}` : `Mostrando 1-${Math.min(12, totalResults)} de ${totalResults} resultados`}
                    </span>
                    
                    {/* SELECTOR DE ORDENAMIENTO (Solo para Productos y Desktop/Tablet) */}
                    {isProductMode && !isMobileView && (
                        <select 
                            className="border border-gray-300 rounded-lg p-1 text-sm bg-white hover:border-indigo-400 cursor-pointer"
                            onChange={handleSortSelect}
                            value={currentSort}
                        >
                            <option value="default">Ordenar por</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                            <option value="rating-desc">Mejor valorados</option>
                        </select>
                    )}
                </div>

                {activeTags.length > 0 && (
                    <div className="flex flex-wrap items-center mt-3 pt-2 border-t border-gray-200">
                        <span className="mr-3 font-semibold text-gray-700">Filtros Activos:</span>
                        {activeTags.map((tag, index) => (
                            <span 
                                key={index} 
                                className="flex items-center bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 my-1 px-2.5 py-1 rounded-full shadow-sm cursor-pointer hover:bg-indigo-200 transition-colors"
                            >
                                {tag}
                                <FaTimes 
                                    className="ml-1 size-3 text-indigo-600 hover:text-indigo-800" 
                                    onClick={() => handleTagRemove(tag)} 
                                />
                            </span>
                        ))}
                        <button 
                            onClick={() => { 
                                setFilters(getCurrentInitialData()); 
                                setCurrentSort('default'); 
                                if(onSortChange) onSortChange('default');
                                if(isMobileModalOpen) setIsMobileModalOpen(false); 
                            }}
                            className="text-xs text-red-500 hover:text-red-700 ml-auto font-medium"
                        >
                            Limpiar
                        </button>
                    </div>
                )}
            </div>

            {/* Renderizado Condicional de Filtros */}
            <div className="space-y-0">
                {isProductMode ? renderProductFilters() : renderServiceFilters()}
            </div>
        </div>
    );
    // --- FIN FUNCIÓN DE RENDERING DEL CONTENIDO ---


    return (
        <>
            {/* 1. Versión Desktop/Tablet (Sidebar estático) - Visible en LG+ */}
            <div className="hidden lg:block">
                {renderFilterContent(false)}
            </div>

            {/* 2. Versión Móvil (Botón Fixed + Modal/Drawer) - Oculto en LG+ */}
            <div className="lg:hidden"> 
                {/* Botón Flotante Fijo */}
                <button
                    onClick={() => setIsMobileModalOpen(true)}
                    className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-colors active:scale-95"
                    aria-label="Abrir filtros"
                >
                    <FiSliders className="size-6" />
                </button>

                {/* Modal/Drawer de Filtros */}
                {isMobileModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-gray-900/70 transition-opacity" 
                            onClick={() => setIsMobileModalOpen(false)} 
                            aria-hidden="true" 
                        />

                        {/* Contenido del Drawer (Abre desde la derecha) */}
                        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
                            
                            {/* Botón de Cerrar */}
                            <button
                                type="button"
                                onClick={() => setIsMobileModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 z-10 p-2"
                                aria-label="Cerrar filtros"
                            >
                                <FaTimes className="size-6" />
                            </button>

                            {/* Contenido REAL de los filtros */}
                            <div className="pt-4">
                                {renderFilterContent(true)}
                                <div className='p-4 border-t'>
                                    {/* Botón para aplicar y cerrar en móvil */}
                                    <button 
                                        onClick={() => setIsMobileModalOpen(false)} 
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
                                    >
                                        Aplicar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterSidebarLg;