// src/components/profile/ProfileFormLg.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { updateCustomer } from '../../services/customerService';
import { getDocumentTypes } from '../../services/locationService';
import AddressManager from '../address/AddressManager';

const ProfileFormLg = React.memo(({ profile, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize form data when profile changes
    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    // Fetch document types on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const docTypes = await getDocumentTypes();
                setDocumentTypes(docTypes);
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Error al cargar los datos iniciales');
            }
        };

        fetchInitialData();
    }, []);

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

    const handleSave = useCallback(async (e) => {
        e.preventDefault();

        if (!formData.names || !formData.lastNames || !formData.email || !formData.phone) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Prepare data for API (CustomerNewUpdateDTO)
            // Note: address, neighborhoodId are deprecated - addresses managed separately
            const updateData = {
                names: formData.names,
                lastNames: formData.lastNames,
                documentNumber: formData.documentNumber,
                email: formData.email,
                birthDate: formData.birthDate,
                address: formData.address || 'Ver direcciones guardadas', // Mantener compatibilidad
                phone: formData.phone,
                documentTypeId: formData.documentTypeId,
                neighborhoodId: formData.neighborhoodId || null,
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
        <>
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

            {/* Address Management Section */}
            <div className="mt-8 pt-8 border-t">
                <AddressManager customerId={profile.id} />
            </div>
        </>
    );
});

export default ProfileFormLg;