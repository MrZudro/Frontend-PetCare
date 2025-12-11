import React, { useState, useEffect } from 'react';
import { getLocalities, getNeighborhoodsByLocality } from '../../services/locationService';

const AddressForm = ({ initialData = null, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState({
        addressLine: '',
        additionalInfo: '',
        deliveryNotes: '',
        addressType: 'RESIDENTIAL',
        isDefault: false,
        neighborhoodId: '',
        ...initialData
    });

    const [localities, setLocalities] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedLocalityId, setSelectedLocalityId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load localities on mount
    useEffect(() => {
        const fetchLocalities = async () => {
            try {
                const locs = await getLocalities();
                setLocalities(locs);
            } catch (err) {
                console.error('Error loading localities:', err);
                setError('Error al cargar las localidades');
            }
        };
        fetchLocalities();
    }, []);

    // Load initial neighborhood if editing
    useEffect(() => {
        if (initialData?.neighborhoodId && localities.length > 0) {
            // Find locality for this neighborhood
            const loadInitialNeighborhood = async () => {
                try {
                    for (const locality of localities) {
                        const hoods = await getNeighborhoodsByLocality(locality.id);
                        const found = hoods.find(h => h.id === initialData.neighborhoodId);
                        if (found) {
                            setSelectedLocalityId(locality.id);
                            setNeighborhoods(hoods);
                            break;
                        }
                    }
                } catch (err) {
                    console.error('Error loading initial neighborhood:', err);
                }
            };
            loadInitialNeighborhood();
        }
    }, [initialData, localities]);

    // Load neighborhoods when locality changes
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            if (!selectedLocalityId) {
                setNeighborhoods([]);
                return;
            }

            try {
                setLoading(true);
                const hoods = await getNeighborhoodsByLocality(selectedLocalityId);
                setNeighborhoods(hoods); // Already sorted alphabetically from backend
            } catch (err) {
                console.error('Error loading neighborhoods:', err);
                setError('Error al cargar los barrios');
            } finally {
                setLoading(false);
            }
        };

        fetchNeighborhoods();
    }, [selectedLocalityId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLocalityChange = (e) => {
        const localityId = e.target.value ? parseInt(e.target.value) : null;
        setSelectedLocalityId(localityId);
        setFormData(prev => ({ ...prev, neighborhoodId: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.addressLine || !formData.neighborhoodId) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        const submitData = {
            ...formData,
            neighborhoodId: parseInt(formData.neighborhoodId)
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 border-l-4 border-[var(--color-alerta)] text-red-700 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                    Dirección *
                </label>
                <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    placeholder="Ej: Calle 76D #105D-99"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                        Localidad *
                    </label>
                    <select
                        value={selectedLocalityId || ''}
                        onChange={handleLocalityChange}
                        className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                        required
                    >
                        <option value="">Seleccione una localidad...</option>
                        {localities.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                        Barrio *
                    </label>
                    <select
                        name="neighborhoodId"
                        value={formData.neighborhoodId}
                        onChange={handleInputChange}
                        disabled={!selectedLocalityId || loading}
                        className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                    >
                        <option value="">
                            {!selectedLocalityId ? 'Primero seleccione una localidad' : loading ? 'Cargando...' : 'Seleccione un barrio...'}
                        </option>
                        {neighborhoods.map(hood => (
                            <option key={hood.id} value={hood.id}>
                                {hood.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                    Apartamento / Casa
                </label>
                <input
                    type="text"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Ej: Apto 301, Torre B"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                    Indicaciones para la entrega
                </label>
                <textarea
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                    placeholder="Ej: Portería principal, timbre 301"
                    className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--color-texto)] mb-2">
                    Tipo de domicilio *
                </label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="addressType"
                            value="RESIDENTIAL"
                            checked={formData.addressType === 'RESIDENTIAL'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span>Residencial</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="addressType"
                            value="WORK"
                            checked={formData.addressType === 'WORK'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span>Laboral</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="addressType"
                            value="OTHER"
                            checked={formData.addressType === 'OTHER'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span>Otro</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] rounded"
                    />
                    <span className="text-sm text-[var(--color-texto)]">
                        Establecer como dirección predeterminada
                    </span>
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2 text-sm font-medium text-[var(--color-texto)] bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] transition duration-150 disabled:opacity-50"
                >
                    {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
