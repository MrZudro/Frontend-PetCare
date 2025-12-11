// src/components/profile/ProfileFormLg.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { updateCustomer } from '../../services/customerService';
import { getDocumentTypes, getLocalities, getNeighborhoodsByLocality } from '../../services/locationService';

const ProfileFormLg = React.memo(({ profile, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedLocalityId, setSelectedLocalityId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize form data when profile changes
    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    // Fetch document types and localities on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [docTypes, locs] = await Promise.all([
                    getDocumentTypes(),
                    getLocalities()
                ]);
                setDocumentTypes(docTypes);
                setLocalities(locs);
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Error al cargar los datos iniciales');
            }
        };

        fetchInitialData();
    }, []);

    // Load initial neighborhood and set locality when profile has neighborhoodId
    useEffect(() => {
        const loadInitialNeighborhood = async () => {
            if (profile?.neighborhoodId && localities.length > 0 && neighborhoods.length === 0) {
                try {
                    // Fetch all neighborhoods to find the one matching profile.neighborhoodId
                    const allNeighborhoods = await Promise.all(
                        localities.map(loc => getNeighborhoodsByLocality(loc.id))
                    );

                    // Flatten and find the neighborhood
                    const flatNeighborhoods = allNeighborhoods.flat();
                    const currentNeighborhood = flatNeighborhoods.find(n => n.id === profile.neighborhoodId);

                    if (currentNeighborhood) {
                        setSelectedLocalityId(currentNeighborhood.localityId);
                        // Fetch neighborhoods for this locality
                        const hoods = await getNeighborhoodsByLocality(currentNeighborhood.localityId);
                        setNeighborhoods(hoods);
                    }
                } catch (err) {
                    console.error('Error loading initial neighborhood:', err);
                }
            }
        };

        loadInitialNeighborhood();
    }, [profile, localities, neighborhoods.length]);

    // Fetch neighborhoods when locality changes
    useEffect(() => {
        const fetchNeighborhoods = async () => {
            if (!selectedLocalityId) {
                setNeighborhoods([]);
                return;
            }

            try {
                const hoods = await getNeighborhoodsByLocality(selectedLocalityId);
                setNeighborhoods(hoods);
            } catch (err) {
                console.error('Error fetching neighborhoods:', err);
                setError('Error al cargar los barrios');
            }
        };

        // Only fetch if we're changing locality (not initial load)
        if (selectedLocalityId && neighborhoods.length === 0) {
            fetchNeighborhoods();
        }
    }, [selectedLocalityId]);

    const handleInputChange = useCallback((e) => {
        let { name, value } = e.target;

        // Capitalize first letter for names
        if (name === 'names' || name === 'lastNames') {
            if (value.length > 0) {
                value = value.charAt(0).toUpperCase() + value.slice(1);
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleLocalityChange = useCallback((e) => {
        const localityId = e.target.value ? parseInt(e.target.value) : null;
        setSelectedLocalityId(localityId);
        // Reset neighborhood when locality changes
        setFormData(prev => ({ ...prev, neighborhoodId: null }));
        setNeighborhoods([]);
    }, []);

    const handleSave = useCallback(async (e) => {
        e.preventDefault();

        if (!formData.names || !formData.lastNames || !formData.email || !formData.phone || !formData.address) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Prepare data for API (CustomerNewUpdateDTO)
            const updateData = {
                names: formData.names,
                lastNames: formData.lastNames,
                documentNumber: formData.documentNumber,
                email: formData.email,
                birthDate: formData.birthDate,
                address: formData.address,
                phone: formData.phone,
                documentTypeId: formData.documentTypeId,
                neighborhoodId: formData.neighborhoodId,
                profilePhotoUrl: formData.profilePhotoUrl
            };

            const updatedProfile = await updateCustomer(profile.id, updateData);
            onProfileUpdate(updatedProfile);
            setIsEditing(false);
            alert('Perfil actualizado con éxito');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    }, [formData, profile.id, onProfileUpdate]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setFormData(profile);
        setError(null);
    }, [profile]);

    const getBaseInputClass = (isDisabled) =>
        `mt-1 block w-full rounded-md border ${isDisabled
            ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
            : 'border-[var(--color-primary)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent'
        } shadow-sm p-2 transition-all`;

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-texto)] mb-6 border-b pb-2">
                Información Personal
            </h2>

            {error && (
                <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Nombres *</span>
                    <input
                        type="text"
                        name="names"
                        value={formData.names || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={getBaseInputClass(!isEditing)}
                        required
                    />
                </label>

                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Apellidos *</span>
                    <input
                        type="text"
                        name="lastNames"
                        value={formData.lastNames || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={getBaseInputClass(!isEditing)}
                        required
                    />
                </label>

                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Tipo de Documento *</span>
                    <select
                        name="documentTypeId"
                        value={formData.documentTypeId || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={getBaseInputClass(!isEditing)}
                        required
                    >
                        <option value="">Seleccione...</option>
                        {documentTypes.map(dt => (
                            <option key={dt.id} value={dt.id}>
                                {dt.name} ({dt.abreviation})
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Número de Documento *</span>
                    <input
                        type="text"
                        name="documentNumber"
                        value={formData.documentNumber || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={getBaseInputClass(!isEditing)}
                        required
                    />
                </label>

                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Correo Electrónico *</span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        disabled={true}
                        className={getBaseInputClass(true)}
                        title="El correo electrónico no se puede modificar"
                    />
                </label>

                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Teléfono *</span>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={getBaseInputClass(!isEditing)}
                        required
                    />
                </label>

                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">
                        Fecha de Nacimiento {isEditing && '(No Modificable)'}
                    </span>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate || ''}
                        disabled={true}
                        className={getBaseInputClass(true)}
                        title="La fecha de nacimiento no se puede modificar"
                    />
                </label>

                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Localidad</span>
                    <select
                        value={selectedLocalityId || ''}
                        onChange={handleLocalityChange}
                        disabled={!isEditing}
                        className={getBaseInputClass(!isEditing)}
                    >
                        <option value="">Seleccione una localidad...</option>
                        {localities.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Barrio</span>
                    <select
                        name="neighborhoodId"
                        value={formData.neighborhoodId || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing || !selectedLocalityId}
                        className={getBaseInputClass(!isEditing || !selectedLocalityId)}
                    >
                        <option value="">
                            {selectedLocalityId ? 'Seleccione un barrio...' : 'Primero seleccione una localidad'}
                        </option>
                        {neighborhoods.map(hood => (
                            <option key={hood.id} value={hood.id}>
                                {hood.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block md:col-span-2">
                    <span className="text-[var(--color-texto)] text-sm font-medium">Dirección *</span>
                    <input
                        type="text"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={getBaseInputClass(!isEditing)}
                        required
                    />
                </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-[var(--color-texto)] bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition duration-150 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition duration-150"
                    >
                        Editar Información
                    </button>
                )}
            </div>
        </form>
    );
});

export default ProfileFormLg;