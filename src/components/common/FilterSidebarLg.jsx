import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaChevronUp, FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
import { FiSliders } from 'react-icons/fi';

import productData from '../Data/products.json';
import serviceData from '../Data/services.json';
import categoriesMap from '../Data/categories.json'; 

// --- FUNCIONES DE UTILIDAD (Fuera del componente) ---

// 🚨 CORRECCIÓN: Usar 'subcategories' en lugar de 'type'
const allProductSubcategories = [...new Set(productData.map(p => p.subcategories))];

const processFilterData = (data, keyName, allowedValues = null) => {
    if (!data || data.length === 0) return [];

    const counts = data.reduce((acc, item) => {
        const value = item[keyName];
        if (value && (!allowedValues || allowedValues.includes(value))) {
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

const getInitialCategories = () => {
    const categoryCounts = {};

    productData.forEach(product => {
        // 🚨 CORRECCIÓN: Usar 'subcategories' en lugar de 'type'
        const productSubcategory = product.subcategories; 
        
        // 🎯 Buscar en la clave 'subcategories' del mapa
        const categoryEntry = categoriesMap.find(c => c.subcategories.includes(productSubcategory));

        if (categoryEntry) {
            const categoryName = categoryEntry.categoryName;
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
        }
    });

    return Object.keys(categoryCounts).map(name => ({
        name,
        count: categoryCounts[name],
        active: false,
    }));
};

const getInitialFilterData = (mode) => {
    if (mode === 'products') {
        return {
            category: getInitialCategories(),
            subcategories: [], 
            brand: processFilterData(productData, 'brand'),
        };
    } else {
        // 🚀 CORRECCIÓN CLAVE: Solo retornar el filtro de 'clinic' para el modo 'services'
        return {
            clinic: processFilterData(serviceData, 'clinicName'),
        };
    }
};

/**
 * 🚀 FUNCIÓN CLAVE DE FILTRADO (Productos): Aplica los filtros activos a la lista de productos.
 */
const filterProducts = (data, activeFilters) => {
    const { category, subcategories, brand } = activeFilters;

    if ((category?.length || 0) === 0 && (subcategories?.length || 0) === 0 && (brand?.length || 0) === 0) {
        return data;
    }

    return data.filter(product => {
        let passesCategory = true;
        let passesSubcategory = true;
        let passesBrand = true;

        // 🚨 CORRECCIÓN: Usar 'subcategories' en lugar de 'type'
        const productSubcategory = product.subcategories; 

        // 1. Filtrar por Categoría (Radio Button)
        if ((category?.length || 0) > 0) {
            const activeCategoryName = category[0];
            // 🎯 Buscar en la clave 'subcategories' del mapa
            const allowedSubcategories = categoriesMap.find(c => c.categoryName === activeCategoryName)?.subcategories || [];
            passesCategory = allowedSubcategories.includes(productSubcategory);
        }

        // 2. Filtrar por Subcategoría (Checkbox)
        if ((subcategories?.length || 0) > 0) {
            passesSubcategory = subcategories.includes(productSubcategory);
        } else if ((category?.length || 0) > 0 && passesCategory) {
             // Si hay categoría activa y el producto pasa, y no hay subcategorías seleccionadas, se considera válido.
            passesSubcategory = true;
        } else if ((category?.length || 0) > 0 && !passesCategory) {
            // Si hay categoría activa y NO pasa, fallará.
            passesSubcategory = false;
        } else {
            // Si no hay categoría y no hay subcategoría, pasa.
            passesSubcategory = true;
        }

        // 3. Filtrar por Marca (Radio Button)
        if ((brand?.length || 0) > 0) {
            passesBrand = brand.includes(product.brand);
        }

        return passesCategory && passesSubcategory && passesBrand;
    });
};


// --- COMPONENTE PRINCIPAL ---

const FilterSidebarLg = ({ onFilterChange, onSortChange, totalResults = 0, mode = 'products' }) => {

    const isProductMode = mode === 'products';
    const initialData = useMemo(() => getInitialFilterData(mode), [mode]);

    const [filters, setFilters] = useState(initialData);
    const [currentSort, setCurrentSort] = useState('default');
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

    // Estado local para almacenar y mostrar los productos filtrados (para esta demo)
    const [localFilteredProducts, setLocalFilteredProducts] = useState(isProductMode ? productData : serviceData);

    const [openSections, setOpenSections] = useState(
        Object.keys(initialData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    // 1. Resetear filtros al cambiar de modo/inicializar
    useEffect(() => {
        setFilters(initialData);
        setCurrentSort('default');
        setLocalFilteredProducts(isProductMode ? productData : serviceData); // Resetear datos según el modo
        setOpenSections(Object.keys(initialData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }, [mode, initialData, isProductMode]);

    // 🌟 LÓGICA CLAVE: Recalcular Subcategorías ('subcategories') - Solo para Productos 🌟
    useEffect(() => {
        if (!isProductMode) return;

        const activeCategory = filters.category?.find(f => f.active);
        let newSubcategories = [];

        if (activeCategory) {
            const activeCategoryName = activeCategory.name;
            // 🎯 Buscar en la clave 'subcategories' del mapa
            const allowedSubcategories = categoriesMap.find(c => c.categoryName === activeCategoryName)?.subcategories || [];

            // 🚨 Comparar con las subcategorías reales presentes en los productos
            const subcategoriesInProducts = allProductSubcategories.filter(sub => allowedSubcategories.includes(sub));

            // 🚨 CORRECCIÓN: Usar 'subcategories' como clave de referencia para contar
            newSubcategories = processFilterData(productData, 'subcategories', subcategoriesInProducts);

            newSubcategories = newSubcategories.map(f => {
                const prevFilter = filters.subcategories?.find(pt => pt.name === f.name);
                return { ...f, active: !!prevFilter?.active };
            });
        }

        setFilters(prevFilters => ({
            ...prevFilters,
            subcategories: newSubcategories,
        }));

    }, [filters.category, isProductMode]);

    // 🚀 LÓGICA DE FILTRADO REAL Y NOTIFICACIÓN
    useEffect(() => {
        const activeFilters = Object.keys(filters).reduce((acc, key) => {
            acc[key] = filters[key]?.filter(f => f.active).map(f => f.name) || [];
            return acc;
        }, {});

        // Ejecutar el filtrado localmente
        let results = [];
        if (isProductMode) {
            results = filterProducts(productData, activeFilters);
        } else {
            // El modo 'services' se filtra con una lógica más simple que el componente padre (ServicesLg) necesita implementar
            // Aquí solo pasamos los filtros activos.
            results = isProductMode ? productData : serviceData; 
        }
        
        // Actualizamos los datos para obtener el conteo correcto y manejar el estado de las tags
        // En el modo 'services' el componente padre ServicesLg hace el filtrado real, aquí solo mostramos el conteo del padre
        setLocalFilteredProducts(results); // Esto es solo para la demo

        if (onFilterChange) {
            onFilterChange({
                filters: activeFilters,
                searchTerm: '',
                mode: mode,
                // Si estamos en modo producto, usamos el conteo local. Si es servicio, usamos el que viene del padre.
                totalCount: isProductMode ? results.length : totalResults, 
            });
        }


    }, [filters, mode, onFilterChange, isProductMode, totalResults]);

    // --- LÓGICA DE MANEJO DE ESTADO ---

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
            // Category, Brand, y Clinic funcionan como Radio Buttons (selección única)
            const isRadioSection = sectionKey === 'category' || sectionKey === 'brand' || sectionKey === 'clinic';

            if (isRadioSection) {
                newFilters[sectionKey] = newFilters[sectionKey]?.map(f => {
                    // Si es el filtro clickeado, togglea; si es otro, desactiva.
                    const isActiveToggle = (f.name === filterName) ? !f.active : false;

                    // 🎯 Limpiar Subcategoría al cambiar Categoría
                    if (sectionKey === 'category') {
                        newFilters.subcategories = newFilters.subcategories?.map(typeF => ({ ...typeF, active: false })) || [];
                    }

                    return { ...f, active: isActiveToggle };
                }) || [];
            } else {
                // Checkbox (Subcategoría): Selección múltiple
                newFilters[sectionKey] = newFilters[sectionKey]?.map(f => {
                    if (f.name === filterName) {
                        return { ...f, active: !f.active };
                    }
                    return f;
                }) || [];
            }
            return newFilters;
        });
    };

    const handleTagRemove = (filterName) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            let categoryRemoved = false;

            Object.keys(newFilters).forEach(sectionKey => {
                newFilters[sectionKey] = newFilters[sectionKey]?.map(f => {
                    if (f.name === filterName) {
                        if (sectionKey === 'category' && f.active) {
                            categoryRemoved = true;
                        }
                        return { ...f, active: false };
                    }
                    return f;
                }) || [];
            });

            if (categoryRemoved) {
                newFilters.subcategories = newFilters.subcategories?.map(typeF => ({ ...typeF, active: false })) || [];
            }
            return newFilters;
        });
    };

    const activeTags = Object.keys(filters).flatMap(key =>
        filters[key]?.filter(f => f.active).map(f => f.name) || []
    );

    // Usar el conteo de resultados
    const finalTotalResults = isProductMode ? localFilteredProducts.length : totalResults;

    // --- FUNCIÓN DE RENDERING DE CADA SECCIÓN DE FILTRO ---
    const renderFilterSection = (title, key) => {
        if (!filters[key] || filters[key].length === 0) {
            // Mostrar Subcategorías solo si hay filtros disponibles
            if (key === 'subcategories' && isProductMode && filters.category?.find(f => f.active)) return null;
            if (key === 'subcategories') return null;
            // Si no hay datos para la sección, la omitimos
            if (key !== 'subcategories' && key !== 'category' && key !== 'brand' && key !== 'clinic') return null;
        }

        const isRadioSection = key === 'category' || key === 'brand' || key === 'clinic';

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
                                className={`flex items-center text-sm cursor-pointer py-1 px-1 rounded transition-colors ${filter.active ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}
                                onClick={() => handleFilterSelection(key, filter.name)}
                            >
                                {isRadioSection ? (
                                    <span className={`inline-flex items-center justify-center size-4 border rounded-full mr-2 ${filter.active ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                        {filter.active && <span className="size-2 rounded-full bg-white block" />}
                                    </span>
                                ) : (
                                    <span className={`inline-flex items-center justify-center size-4 border rounded mr-2 ${filter.active ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-transparent'}`}>
                                        {filter.active && <FaCheck className="size-2 text-white" />}
                                    </span>
                                )}

                                <span className={`truncate ${filter.active ? 'font-medium text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}>{filter.name}</span>
                                <span className="ml-auto text-gray-400 font-normal">({filter.count})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderProductFilters = () => {
        const isSubcategoryFilterVisible = filters.subcategories?.length > 0;

        return (
            <>
                {renderFilterSection('Categoría', 'category')}

                {isSubcategoryFilterVisible && (
                    <div className='border-b border-gray-200 py-4 last:border-b-0'>
                        {renderFilterSection('Subcategoría', 'subcategories')}
                    </div>
                )}

                {renderFilterSection('Marca', 'brand')}
            </>
        );
    };

    const renderServiceFilters = () => (
        // 🚀 CORRECCIÓN CLAVE: Solo renderizar el filtro de Clínica
        <>
            {renderFilterSection('Filtrar por Veterinaria', 'clinic')}
        </>
    );

    const renderSortDropdown = () => (
        <select
            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white hover:border-indigo-400 cursor-pointer focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleSortSelect}
            value={currentSort}
        >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
        </select>
    );

    const renderFilterContent = (isMobileView = false) => (
        <div className={`w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6 ${!isMobileView ? 'sticky top-4 self-start' : ''}`}>
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 border-b pb-4">
                <FiSliders className="mr-2 text-indigo-600 size-5" />
                Filtros
            </h2>

            <div className="mb-4 text-sm text-gray-600">
                {/* Contenedor del conteo de resultados */}
                <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">
                        {isMobileView ? `Resultados: ${finalTotalResults}` : `Mostrando 1-${Math.min(12, finalTotalResults)} de ${finalTotalResults} resultados`}
                    </span>
                </div>

                {/* Dropdown de ordenamiento */}
                {isProductMode && (
                    <div className={`mt-2 ${isMobileView ? 'mb-4' : 'mb-3'}`}>
                        {renderSortDropdown()}
                    </div>
                )}

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
                                setFilters(getInitialFilterData(mode));
                                setCurrentSort('default');
                                setLocalFilteredProducts(isProductMode ? productData : serviceData);
                                if(onSortChange && isProductMode) onSortChange('default');
                                if(isMobileModalOpen) setIsMobileModalOpen(false);
                            }}
                            className="text-xs text-red-500 hover:text-red-700 ml-auto font-medium"
                        >
                            Limpiar
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-0">
                {isProductMode ? renderProductFilters() : renderServiceFilters()}
            </div>
        </div>
    );

    return (
        <>
            {/* Versión Desktop/Tablet */}
            <div className="hidden lg:block">
                {renderFilterContent(false)}
            </div>

            {/* Versión Móvil */}
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
                        <div
                            className="absolute inset-0 bg-gray-900/70 transition-opacity"
                            onClick={() => setIsMobileModalOpen(false)}
                            aria-hidden="true"
                        />

                        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">

                            <button
                                type="button"
                                onClick={() => setIsMobileModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 z-10 p-2"
                                aria-label="Cerrar filtros"
                            >
                                <FaTimes className="size-6" />
                            </button>

                            <div className="pt-4">
                                {renderFilterContent(true)}
                                <div className='p-4 border-t'>
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