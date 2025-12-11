import { useState, useEffect } from "react";
import { getLocalities, getNeighborhoodsByLocality } from "../../services/locationService";
import { createAddress } from "../../services/addressService";

export default function NewAddressTL({ data, onChange, onContinue, onCancel, customerId }) {
    const [localities, setLocalities] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [selectedLocality, setSelectedLocality] = useState(data.localityId || '');

    // Fetch initial data
    useEffect(() => {
        const fetchLocalities = async () => {
            try {
                const locs = await getLocalities();
                setLocalities(locs);
            } catch (err) {
                console.error("Error fetching localities:", err);
                setError("Error al cargar localidades");
            }
        };
        fetchLocalities();
    }, []);

    // Fetch neighborhoods when locality changes
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            if (selectedLocality) {
                try {
                    setLoading(true);
                    const hoods = await getNeighborhoodsByLocality(selectedLocality);
                    setNeighborhoods(hoods); // Backend sorts them alphabetically

                    // If current neighborhood not in new list, reset it
                    if (data.neighborhoodId) {
                        const exists = hoods.find(h => h.id === parseInt(data.neighborhoodId));
                        if (!exists) {
                            onChange('root', 'address', { ...data, neighborhoodId: '', neighborhood: '' });
                        }
                    }
                } catch (err) {
                    console.error("Error fetching neighborhoods:", err);
                    setNeighborhoods([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setNeighborhoods([]);
            }
        };
        fetchNeighborhoods();
    }, [selectedLocality]);

    const handleLocalityChange = (e) => {
        const locId = e.target.value;
        setSelectedLocality(locId);

        // Find locality name for display/storage
        const loc = localities.find(l => l.id === parseInt(locId));
        const locName = loc ? loc.name : '';

        // Update parent state
        onChange('root', 'address', {
            ...data,
            localityId: locId,
            localityName: locName,
            neighborhoodId: '',
            neighborhood: '' // Reset neighborhood name
        });
    };

    const handleNeighborhoodChange = (e) => {
        const hoodId = e.target.value;

        // Find neighborhood name
        const hood = neighborhoods.find(n => n.id === parseInt(hoodId));
        const hoodName = hood ? hood.name : '';

        onChange('root', 'address', {
            ...data,
            neighborhoodId: hoodId,
            neighborhood: hoodName
        });
    };

    const handleInputChange = (field, value) => {
        onChange('root', 'address', { ...data, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (data.saveAddress && customerId) {
            try {
                setSaving(true);
                const addressPayload = {
                    addressLine: data.addressLine,
                    additionalInfo: data.apartment || '',
                    deliveryNotes: data.notes || '',
                    addressType: data.placeType === 'Residencial' ? 'RESIDENTIAL' :
                        data.placeType === 'Trabajo' ? 'WORK' : 'OTHER',
                    neighborhoodId: parseInt(data.neighborhoodId),
                    isDefault: false
                };

                const newAddress = await createAddress(customerId, addressPayload);
                // Return the created address to parent
                onContinue(newAddress);
            } catch (err) {
                console.error("Error saving address:", err);
                setError("Error al guardar la dirección. Por favor verifica los datos.");
            } finally {
                setSaving(false);
            }
        } else {
            // Check required fields for temporary address
            if (!selectedLocality || !data.neighborhoodId || !data.addressLine) {
                setError("Por favor completa los campos obligatorios (*)");
                return;
            }
            // Continue with temporary data
            onContinue(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--color-texto)] mb-6">
                Nueva Dirección de Entrega
            </h3>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Localidad */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                            Localidad *
                        </label>
                        <select
                            value={selectedLocality}
                            onChange={handleLocalityChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none bg-white"
                            required
                        >
                            <option value="">Seleccione...</option>
                            {localities.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Barrio */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                            Barrio *
                        </label>
                        <select
                            value={data.neighborhoodId || ''}
                            onChange={handleNeighborhoodChange}
                            disabled={!selectedLocality || loading}
                            className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none bg-white ${(!selectedLocality || loading) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            required
                        >
                            <option value="">
                                {loading ? 'Cargando...' : (!selectedLocality ? 'Primero selec. localidad' : 'Seleccione...')}
                            </option>
                            {neighborhoods.map(hood => (
                                <option key={hood.id} value={hood.id}>{hood.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                        Dirección *
                    </label>
                    <input
                        type="text"
                        value={data.addressLine || ''}
                        onChange={(e) => handleInputChange('addressLine', e.target.value)}
                        placeholder="Ej: Calle 123 # 45 - 67"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Apartamento / Info Adicional */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                            Interior / Apto / Info Adicional
                        </label>
                        <input
                            type="text"
                            value={data.apartment || ''}
                            onChange={(e) => handleInputChange('apartment', e.target.value)}
                            placeholder="Ej: Apto 201, Torre 3"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                        />
                    </div>
                    {/* Tipo de lugar */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                            Tipo de lugar
                        </label>
                        <select
                            value={data.placeType || 'Residencial'}
                            onChange={(e) => handleInputChange('placeType', e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none bg-white"
                        >
                            <option value="Residencial">Residencial</option>
                            <option value="Trabajo">Trabajo</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                </div>

                {/* Notas de entrega */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-texto)] mb-1">
                        Notas para la entrega (Opcional)
                    </label>
                    <textarea
                        value={data.notes || ''}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows="2"
                        placeholder="Ej: Dejar en portería"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                    />
                </div>

                {/* Guardar dirección Checkbox */}
                {customerId && (
                    <div className="flex items-center mt-2">
                        <input
                            id="saveAddress"
                            type="checkbox"
                            checked={data.saveAddress || false}
                            onChange={(e) => handleInputChange('saveAddress', e.target.checked)}
                            className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="saveAddress" className="ml-2 block text-sm text-[var(--color-texto)] cursor-pointer">
                            Guardar esta dirección en mi perfil para futuras compras
                        </label>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t mt-4">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[var(--color-primary)] text-white px-8 py-2 rounded-md font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-70 flex-1 sm:flex-none sm:ml-auto"
                    >
                        {saving ? 'Guardando...' : (data.saveAddress ? 'Guardar y Continuar' : 'Continuar')}
                    </button>
                </div>
            </form>
        </div>
    );
}
