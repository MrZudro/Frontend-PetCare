import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaMapMarkerAlt } from 'react-icons/fa';
import { getCustomerAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../services/addressService';
import AddressForm from './AddressForm';

const AddressManager = ({ customerId }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadAddresses();
    }, [customerId]);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const data = await getCustomerAddresses(customerId);
            setAddresses(data);
        } catch (err) {
            console.error('Error loading addresses:', err);
            setError('Error al cargar las direcciones');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setShowForm(true);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAddress(null);
    };

    const handleSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            setError(null);

            if (editingAddress) {
                await updateAddress(editingAddress.id, formData);
            } else {
                await createAddress(customerId, formData);
            }

            await loadAddresses();
            setShowForm(false);
            setEditingAddress(null);
        } catch (err) {
            console.error('Error saving address:', err);
            setError(err.response?.data?.message || 'Error al guardar la dirección');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (addressId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
            return;
        }

        try {
            await deleteAddress(addressId);
            await loadAddresses();
        } catch (err) {
            console.error('Error deleting address:', err);
            setError(err.response?.data?.message || 'Error al eliminar la dirección');
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await setDefaultAddress(customerId, addressId);
            await loadAddresses();
        } catch (err) {
            console.error('Error setting default address:', err);
            setError('Error al establecer dirección predeterminada');
        }
    };

    const getAddressTypeLabel = (type) => {
        const types = {
            RESIDENTIAL: 'Residencial',
            WORK: 'Laboral',
            OTHER: 'Otro'
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[var(--color-texto)]">Mis Direcciones</h3>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] transition duration-150"
                    >
                        <FaPlus /> Agregar Dirección
                    </button>
                )}
            </div>

            {error && (
                <div className="p-3 bg-red-100 border-l-4 border-[var(--color-alerta)] text-red-700 rounded">
                    {error}
                </div>
            )}

            {showForm ? (
                <div className="bg-white rounded-xl shadow-[var(--shadow-pred)] p-6 border border-gray-100">
                    <h4 className="text-md font-bold text-[var(--color-texto)] mb-4">
                        {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
                    </h4>
                    <AddressForm
                        initialData={editingAddress}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isLoading={isSubmitting}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            <FaMapMarkerAlt className="mx-auto text-4xl mb-2 opacity-50" />
                            <p>No tienes direcciones guardadas</p>
                            <p className="text-sm">Agrega una dirección para facilitar tus compras</p>
                        </div>
                    ) : (
                        addresses.map(address => (
                            <div
                                key={address.id}
                                className={`relative bg-white rounded-xl shadow-[var(--shadow-pred)] p-4 border-2 transition-all ${address.isDefault
                                        ? 'border-[var(--color-primary)]'
                                        : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                {address.isDefault && (
                                    <div className="absolute top-2 right-2">
                                        <FaStar className="text-[var(--color-primary)]" title="Dirección predeterminada" />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaMapMarkerAlt className="text-[var(--color-primary)]" />
                                        <span className="text-xs font-medium text-gray-500 uppercase">
                                            {getAddressTypeLabel(address.addressType)}
                                        </span>
                                    </div>
                                    <p className="font-medium text-[var(--color-texto)]">
                                        {address.addressLine}
                                    </p>
                                    {address.additionalInfo && (
                                        <p className="text-sm text-gray-600">{address.additionalInfo}</p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        {address.neighborhoodName}, {address.localityName}
                                    </p>
                                    {address.deliveryNotes && (
                                        <p className="text-xs text-gray-500 mt-1 italic">
                                            {address.deliveryNotes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-3 border-t">
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-[var(--color-primary)] hover:bg-gray-100 rounded transition"
                                            title="Establecer como predeterminada"
                                        >
                                            <FaRegStar /> Predeterminada
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-[var(--color-acento-secundario)] hover:bg-gray-100 rounded transition"
                                    >
                                        <FaEdit /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-[var(--color-alerta)] hover:bg-red-50 rounded transition"
                                    >
                                        <FaTrash /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressManager;
