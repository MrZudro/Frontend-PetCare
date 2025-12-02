import React from 'react';
import { FaChevronUp, FaChevronDown, FaTimes } from 'react-icons/fa';
import { FiSliders } from 'react-icons/fi';

/**
 * SimpleFilterSidebar - Componente de filtros simple y auto-contenido
 * 
 * Props:
 * - filters: Objeto con la estructura de filtros { filterKey: { label, options: [{ value, label, count }], type: 'radio'|'checkbox' } }
 * - activeFilters: Objeto con filtros activos { filterKey: value | [values] }
 * - onFilterChange: Función callback (filterKey, value) => void
 * - onClearFilters: Función callback () => void
 * - totalResults: Número total de resultados
 * - sortOptions: Array de opciones de ordenamiento (opcional)
 * - onSortChange: Función callback para cambio de orden (opcional)
 */
const SimpleFilterSidebar = ({
    filters = {},
    activeFilters = {},
    onFilterChange,
    onClearFilters,
    totalResults = 0,
    sortOptions = null,
    onSortChange = null
}) => {
    const [openSections, setOpenSections] = React.useState({});
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    // Inicializar todas las secciones como abiertas
    React.useEffect(() => {
        const initialState = {};
        Object.keys(filters).forEach(key => {
            initialState[key] = true;
        });
        setOpenSections(initialState);
    }, [filters]);

    const toggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFilterClick = (filterKey, value) => {
        if (onFilterChange) {
            onFilterChange(filterKey, value);
        }
    };

    const handleClearAll = () => {
        if (onClearFilters) {
            onClearFilters();
        }
        setIsMobileOpen(false);
    };

    // Contar filtros activos
    const activeCount = Object.values(activeFilters).filter(v =>
        Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== ''
    ).length;

    const renderFilterSection = (filterKey, filterConfig) => {
        const { label, options, type = 'radio' } = filterConfig;
        const isOpen = openSections[filterKey];
        const activeValue = activeFilters[filterKey];
        const isRadio = type === 'radio';

        if (!options || options.length === 0) return null;

        return (
            <div key={filterKey} className="border-b border-gray-200 py-4 last:border-b-0">
                <button
                    className="flex w-full items-center justify-between text-gray-800 hover:text-primary transition-colors"
                    onClick={() => toggleSection(filterKey)}
                >
                    <span className="font-semibold text-base">{label}</span>
                    {isOpen ? <FaChevronUp className="size-3" /> : <FaChevronDown className="size-3" />}
                </button>

                {isOpen && (
                    <div className="mt-3 space-y-2">
                        {options.map(option => {
                            const isActive = isRadio
                                ? activeValue === option.value
                                : Array.isArray(activeValue) && activeValue.includes(option.value);

                            return (
                                <div
                                    key={option.value}
                                    className={`flex items-center justify-between text-sm cursor-pointer py-2 px-2 rounded transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => handleFilterClick(filterKey, option.value)}
                                >
                                    <div className="flex items-center flex-1 min-w-0">
                                        {isRadio ? (
                                            <span className={`inline-flex items-center justify-center size-4 border rounded-full mr-2 shrink-0 ${isActive ? 'bg-primary border-primary' : 'border-gray-300'
                                                }`}>
                                                {isActive && <span className="size-2 rounded-full bg-white block" />}
                                            </span>
                                        ) : (
                                            <span className={`inline-flex items-center justify-center size-4 border rounded mr-2 shrink-0 ${isActive ? 'bg-primary border-primary' : 'border-gray-300'
                                                }`}>
                                                {isActive && <FaTimes className="size-2 text-white" />}
                                            </span>
                                        )}
                                        <span className={`truncate ${isActive ? 'font-medium text-primary' : 'text-gray-600'}`}>
                                            {option.label}
                                        </span>
                                    </div>
                                    <span className="ml-2 text-gray-400 font-normal shrink-0">({option.count})</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderContent = (isMobile = false) => (
        <div className={`w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6 ${!isMobile ? 'sticky top-4 self-start' : ''}`}>
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 border-b pb-4">
                <FiSliders className="mr-2 text-primary size-5" />
                Filtros
            </h2>

            <div className="mb-4 text-sm text-gray-600">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">
                        {totalResults} resultado{totalResults !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Sort Options */}
                {sortOptions && onSortChange && (
                    <div className="mt-2 mb-3">
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white hover:border-primary cursor-pointer focus:ring-primary focus:border-primary"
                            onChange={(e) => onSortChange(e.target.value)}
                            defaultValue="default"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Active Filters */}
                {activeCount > 0 && (
                    <div className="flex flex-wrap items-center mt-3 pt-2 border-t border-gray-200">
                        <span className="mr-2 font-semibold text-gray-700 text-xs">Activos:</span>
                        <button
                            onClick={handleClearAll}
                            className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                            Limpiar todo
                        </button>
                    </div>
                )}
            </div>

            {/* Filter Sections */}
            <div className="space-y-0">
                {Object.entries(filters).map(([key, config]) => renderFilterSection(key, config))}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Version */}
            <div className="hidden lg:block">
                {renderContent(false)}
            </div>

            {/* Mobile Version */}
            <div className="lg:hidden">
                {/* Floating Button */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-white shadow-xl hover:bg-primary-hover transition-colors active:scale-95"
                >
                    <FiSliders className="size-6" />
                    {activeCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </button>

                {/* Modal */}
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gray-900/70 transition-opacity"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 z-10 p-2"
                            >
                                <FaTimes className="size-6" />
                            </button>

                            <div className="pt-4">
                                {renderContent(true)}
                                <div className="p-4 border-t">
                                    <button
                                        onClick={() => setIsMobileOpen(false)}
                                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold shadow-md hover:bg-primary-hover transition"
                                    >
                                        Ver Resultados
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

export default SimpleFilterSidebar;
