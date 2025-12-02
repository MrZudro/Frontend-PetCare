// src/components/profile/ProfileFormLg.jsx

import React, { useCallback } from 'react';

const ProfileFormLg = React.memo(({ profile, formData, isEditing, isNameLocked, lockDate, handleProfileSave, handleProfileInputChange, setIsEditing, setFormData }) => {
    
    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setFormData(profile);
    }, [profile, setIsEditing, setFormData]);

    const getBaseInputClass = (isDisabled) => 
        `mt-1 block w-full rounded-md border ${isDisabled ? 'border-gray-200 bg-gray-100 cursor-not-allowed' : 'border-indigo-300 bg-white'} shadow-sm p-2`;
    
    const isNameDisabled = !isEditing || isNameLocked;
    const isLastNameDisabled = !isEditing || isNameLocked;
    const isEmailDisabled = !isEditing;
    const isPhoneDisabled = !isEditing;
    const isAddressDisabled = !isEditing;

    return (
        <form onSubmit={handleProfileSave} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Información Personal</h2>
            
            {isEditing && isNameLocked && (
                <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                    ⚠️ El cambio de Nombre/Apellido está bloqueado hasta el **{lockDate}**.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-gray-700 text-sm">Nombre</span>
                    <input type="text" name="name" value={formData.name} onChange={handleProfileInputChange} 
                        disabled={isNameDisabled} 
                        className={getBaseInputClass(isNameDisabled)}
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700 text-sm">Apellido</span>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleProfileInputChange} 
                        disabled={isLastNameDisabled} 
                        className={getBaseInputClass(isLastNameDisabled)}
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700 text-sm">Correo Electrónico</span>
                    <input type="email" name="email" value={formData.email} onChange={handleProfileInputChange} disabled={isEmailDisabled}
                        className={getBaseInputClass(isEmailDisabled)}
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700 text-sm">Teléfono</span>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleProfileInputChange} disabled={isPhoneDisabled}
                        className={getBaseInputClass(isPhoneDisabled)}
                    />
                </label>
                <label className="block">
                    <span className={`text-gray-700 text-sm font-semibold ${isEditing ? 'block' : 'hidden'}`}>Fecha de Nacimiento (No Modificable)</span>
                    <span className={`text-gray-700 text-sm ${isEditing ? 'hidden' : 'block'}`}>Fecha de Nacimiento</span>
                    <input type="date" name="birthDate" value={formData.birthDate} disabled={true} className={getBaseInputClass(true)} />
                </label>
                <label className="block md:col-span-2">
                    <span className="text-gray-700 text-sm">Dirección</span>
                    <input type="text" name="address" value={formData.address} onChange={handleProfileInputChange} disabled={isAddressDisabled}
                        className={getBaseInputClass(isAddressDisabled)}
                    />
                </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
                {isEditing ? (
                    <>
                        <button type="button" onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150">
                            Guardar Cambios
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150">
                        Editar Información
                    </button>
                )}
            </div>
        </form>
    );
});

export default ProfileFormLg;