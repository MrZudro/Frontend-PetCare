import React, { useState, useEffect, useMemo } from 'react';
import { FaChevronUp, FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
import { FiSliders } from 'react-icons/fi';
import categoriesMap from '../Data/categories.json';

// --- FUNCIONES DE UTILIDAD (Fuera del componente) ---

const processFilterData = (data, keyName, allowedValues = null) => {
    if (!data || data.length === 0) return [];

    const counts = data.reduce((acc, item) => {
        const value = item[keyName];
        // Handle array values (like clinicNames in services)
        if (Array.isArray(value)) {
            value.forEach(v => {
                if (v && (!allowedValues || allowedValues.includes(v))) {
                    acc[v] = (acc[v] || 0) + 1;
                }
            });
        } else {
            if (value && (!allowedValues || allowedValues.includes(value))) {
                acc[value] = (acc[value] || 0) + 1;
            }
        }
        return acc;
    }, {});

    return Object.keys(counts).map(name => ({
        name,
        count: counts[name],
        active: false,
    }));
};

const getInitialCategories = (data) => {
    const categoryCounts = {};

    data.forEach(product => {
        const productSubcategory = product.subcategories;

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

// 🚩 FUNCIÓN DE INICIALIZACIÓN DE ESTADO PARA USAR EN EL LAZY INITIALIZER
const createInitialFilterState = (mode, data) => {
    if (mode === 'products') {
        return {
            category: getInitialCategories(data),
            subcategories: [],
            brand: processFilterData(data, 'brand'),
        };
    } else {
        // For services, clinicNames is now a list of objects {id, name} in the DTO, but let's see what frontend receives.
        // If frontend receives DTO directly, it has 'clinics' array of objects.
        // If it receives flattened data, we need to adapt.
        // Assuming 'clinics' array of objects {id, name}.
        // We need to extract names for filtering or use IDs.
        // Let's assume we filter by Name for display.

        // Helper to extract clinic names from service data
        const clinicNames = data.flatMap(s => s.clinics ? s.clinics.map(c => c.name) : []);
        // We can't use processFilterData directly if the structure is complex.
        // Let's create a custom processor or map the data first.

        // Mapping data to a simpler structure for processFilterData
        const simplifiedData = data.map(s => ({
            ...s,
            clinicName: s.clinics ? s.clinics.map(c => c.name) : []
        }));

        return {
            clinic: processFilterData(simplifiedData, 'clinicName'),
        };
    }
};

const filterProducts = (data, activeFilters) => {
    const { category, subcategories, brand } = activeFilters;

    if ((category?.length || 0) === 0 && (subcategories?.length || 0) === 0 && (brand?.length || 0) === 0) {
        return data;
    }

    return data.filter(product => {
        let passesCategory = true;
        let passesSubcategory = true;
        let passesBrand = true;

        const productSubcategory = product.subcategories;

        if ((category?.length || 0) > 0) {
            const activeCategoryName = category[0];
            const allowedSubcategories = categoriesMap.find(c => c.categoryName === activeCategoryName)?.subcategories || [];
            passesCategory = allowedSubcategories.includes(productSubcategory);
        }

        if ((subcategories?.length || 0) > 0) {
            passesSubcategory = subcategories.includes(productSubcategory);
        } else if ((category?.length || 0) > 0 && passesCategory) {
            passesSubcategory = true;
        } else if ((category?.length || 0) > 0 && !passesCategory) {
            passesSubcategory = false;
        } else {
            passesSubcategory = true;
        }

        if ((brand?.length || 0) > 0) {
            passesBrand = brand.includes(product.brand);
        }

        return passesCategory && passesSubcategory && passesBrand;
    });
};


// --- COMPONENTE PRINCIPAL ---

const FilterSidebarLg = ({ onFilterChange, onSortChange, totalResults = 0, mode = 'products', data = [] }) => {

    const isProductMode = mode === 'products';

    // 1. 🚩 Inicialización Lazy del estado. Se ejecuta SOLO en el primer render.
    const [filters, setFilters] = useState(() => createInitialFilterState(mode, data));
    const [currentSort, setCurrentSort] = useState('default');
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

    const initialDataForMode = useMemo(() => createInitialFilterState(mode, data), [mode, data]); // Versión memoizada del objeto inicial

    // Estado local para almacenar y mostrar los productos filtrados (para esta demo)
    const [localFilteredProducts, setLocalFilteredProducts] = useState(data);

    const [openSections, setOpenSections] = useState(() => {
        // Inicializa secciones abiertas con las keys del estado inicial (basado en el modo)
        return Object.keys(createInitialFilterState(mode, data)).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    });

    // 2. 🌟 Reiniciar filtros SÓLO cuando el modo cambia o la DATA cambia 🌟
    // Usamos el objeto memoizado 'initialDataForMode'
    useEffect(() => {
        // Si el estado actual es idéntico a la inicialización del nuevo modo, no hacemos nada.
        // Esto previene bucles si el padre re-renderiza con el mismo 'mode'.
        if (JSON.stringify(filters) === JSON.stringify(initialDataForMode)) {
            return;
        }

        setFilters(initialDataForMode);
        setCurrentSort('default');
        setLocalFilteredProducts(data);
        setOpenSections(Object.keys(initialDataForMode).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }, [mode, isProductMode, initialDataForMode, data]); // Dependencia estable: initialDataForMode

    // 3. 🌟 LÓGICA CLAVE: Recalcular Subcategorías ('subcategories') - Solo para Productos 🌟
    useEffect(() => {
        if (!isProductMode) return;

        const activeCategory = filters.category?.find(f => f.active);
        let newSubcategories = [];

        if (activeCategory) {
            const activeCategoryName = activeCategory.name;
            const allowedSubcategories = categoriesMap.find(c => c.categoryName === activeCategoryName)?.subcategories || [];

            // Need all subcategories from current data
            const allProductSubcategories = [...new Set(data.map(p => p.subcategories))];
            const subcategoriesInProducts = allProductSubcategories.filter(sub => allowedSubcategories.includes(sub));

            newSubcategories = processFilterData(data, 'subcategories', subcategoriesInProducts);

            newSubcategories = newSubcategories.map(f => {
                const prevFilter = filters.subcategories?.find(pt => pt.name === f.name);
                return { ...f, active: !!prevFilter?.active };
            });
        }

        // 🛑 CORRECCIÓN ROBUSTA para evitar el bucle (Línea ~196):
        setFilters(prevFilters => {
            // Aseguramos que ambas variables sean arrays válidos para JSON.stringify
            const currentSubcategories = prevFilters.subcategories || [];
            const finalNewSubcategories = newSubcategories || [];

            // Si el contenido del array 'subcategories' es idéntico, NO actualizamos el estado.
            if (JSON.stringify(finalNewSubcategories) === JSON.stringify(currentSubcategories)) {
                return prevFilters; // Rompe el ciclo si no hay cambio de valor.
            }
            return {
                ...prevFilters,
                subcategories: finalNewSubcategories,
            };
        });

    }, [filters.category, isProductMode, data]);

    // 4. Estabilizar los filtros activos (Dependencia del useEffect de filtrado)
    const memoizedActiveFilters = useMemo(() => {
        return Object.keys(filters).reduce((acc, key) => {
            acc[key] = filters[key]?.filter(f => f.active).map(f => f.name) || [];
            return acc;
        }, {});
    }, [filters]);


    // 5. 🚀 LÓGICA DE FILTRADO REAL Y NOTIFICACIÓN
    useEffect(() => {
        const activeFilters = memoizedActiveFilters;

        let results = [];
        if (isProductMode) {
            results = filterProducts(data, activeFilters);
        } else {
            // En modo servicio, el filtrado es trivial si solo es por clínica
            results = data;
            if ((activeFilters.clinic?.length || 0) > 0) {
                // Filter services that have AT LEAST one of the selected clinics
                results = results.filter(s => {
                    const serviceClinicNames = s.clinics ? s.clinics.map(c => c.name) : [];
                    return activeFilters.clinic.some(filterClinic => serviceClinicNames.includes(filterClinic));
                });
            }
        }

        // 🚩 Si setLocalFilteredProducts no cambia el valor, React optimizará y no re-renderizará.
        setLocalFilteredProducts(results);

        if (onFilterChange) {
            // 🚩 Asegurarse de que onFilterChange sea estable o memoizada en el componente padre.
            onFilterChange({
                filters: activeFilters,
                searchTerm: '',
                mode: mode,
                totalCount: results.length, // Usar el conteo LOCAL para evitar bucles con prop externa
            });
        }

        // Usar la dependencia memoizada
    }, [memoizedActiveFilters, mode, onFilterChange, isProductMode, data]); // Se eliminó totalResults como dependencia

    // --- LÓGICA DE MANEJO DE ESTADO ---
    // ... (El resto del código de handlers, renderizado y UI no tiene cambios relevantes para el bucle) ...

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
                newFilters[sectionKey] = newFilters[sectionKey]?.map(f => {
                    const isActiveToggle = (f.name === filterName) ? !f.active : false;

                    if (sectionKey === 'category' && f.name === filterName && (!f.active || !isActiveToggle)) {
                        newFilters.subcategories = newFilters.subcategories?.map(typeF => ({ ...typeF, active: false })) || [];
                    }

                    return { ...f, active: isActiveToggle };
                }) || [];
            } else {
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

    const finalTotalResults = isProductMode ? localFilteredProducts.length : totalResults;

    const renderFilterSection = (title, key) => {
        if (key === 'subcategories') {
            const activeCategory = filters.category?.find(f => f.active);
            if (!activeCategory || filters[key].length === 0) return null;
        }

        if (!filters[key] || filters[key].length === 0) {
            if (key !== 'subcategories' && key !== 'category' && key !== 'brand' && key !== 'clinic') return null;
            if (key !== 'subcategories' && filters[key].length === 0) return null;
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
        return (
            <>
                {renderFilterSection('Categoría', 'category')}
                {renderFilterSection('Subcategoría', 'subcategories')}
                {renderFilterSection('Marca', 'brand')}
            </>
        );
    };

    const renderServiceFilters = () => (
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
                <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">
                        {isMobileView ? `Resultados: ${finalTotalResults}` : `Mostrando 1-${Math.min(12, finalTotalResults)} de ${finalTotalResults} resultados`}
                    </span>
                </div>

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
                                setFilters(createInitialFilterState(mode, data));
                                setCurrentSort('default');
                                setLocalFilteredProducts(data);
                                if (onSortChange && isProductMode) onSortChange('default');
                                if (isMobileModalOpen) setIsMobileModalOpen(false);
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