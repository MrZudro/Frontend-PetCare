// src/components/profile/UserProfileViewLg.jsx

import React, { useState, useReducer, useCallback } from 'react';
import { 
    FaUser, FaBox, FaCreditCard, FaLock, FaSignOutAlt, FaUserCircle, FaCamera 
} from 'react-icons/fa';

// Importación de componentes y lógica del reducer
import ChangePasswordViewLg from '../components/profile/ChangePasswordViewLg;';
import ProfileFormLg from '../components/profile/ProfileFormLg';
import PaymentMethodsViewLg from '../components/profile/PaymentMethodsViewLg';
import { 
    paymentMethodsReducer, initialPaymentMethods, initialProfileData, navItemsLg 
} from '../components/profile/UserProfileReducerLg';


// Mapeo de strings a componentes de iconos
const IconMap = {
    FaUser, FaBox, FaCreditCard, FaLock, FaSignOutAlt
};

const UserProfileViewLg = () => {
    
    // ESTADOS
    const [profile, setProfile] = useState(initialProfileData);
    const [profileImage, setProfileImage] = useState(null); 
    const [activeSection, setActiveSection] = useState('profile'); 
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const [payments, dispatchPayments] = useReducer(paymentMethodsReducer, initialPaymentMethods);
    const [isAddingPayment, setIsAddingPayment] = useState(false);

    // LÓGICA DE BLOQUEO
    const isNameLocked = profile.nameChangeLockUntil && profile.nameChangeLockUntil > Date.now();
    const lockDate = profile.nameChangeLockUntil ? new Date(profile.nameChangeLockUntil).toLocaleDateString() : null;

    // HANDLERS
    const handleProfileInputChange = useCallback((e) => {
        let { name, value } = e.target; 
        if (name === 'name' || name === 'lastName') {
            if (value.length > 0) {
                value = value.charAt(0).toUpperCase() + value.slice(1);
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleProfileSave = useCallback((e) => {
        e.preventDefault();
        let newLockTime = profile.nameChangeLockUntil;
        if (!profile.nameChangeLockUntil && (profile.name !== formData.name || profile.lastName !== formData.lastName)) {
            const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000; 
            newLockTime = Date.now() + sixMonthsInMs;
            alert(`Nombre y Apellido modificados. No podrá volver a cambiarlos hasta el ${new Date(newLockTime).toLocaleDateString()}.`);
        }
        setProfile({ ...formData, nameChangeLockUntil: newLockTime });
        setIsEditing(false);
        alert('Perfil actualizado con éxito.');
    }, [profile, formData]);

    const handleLogout = useCallback(() => {
        console.log('Sesión cerrada.');
        alert('Sesión cerrada exitosamente.');
    }, []);

    const handleImageUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); 
                alert("Foto de perfil actualizada (simulado).");
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // RENDER
    return (
        <div className="max-w-7xl mx-auto my-10 px-4">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6 md:p-8">
                
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
                    
                    {/* COLUMNA 1: Menú de Navegación Lateral (Estático y Fijo) */}
                    <div className="md:w-60 md:col-span-1">
                        <div className="sticky top-6 bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col justify-between">
                        
                            <div className="space-y-4 mb-6">
                                {/* Sección de Foto de Perfil */}
                                <div className="flex flex-col items-center border-b pb-4">
                                    <div className="w-24 h-24 mb-2 relative">
                                        {profileImage ? (
                                            <img 
                                                src={profileImage} 
                                                alt="Foto de Perfil" 
                                                className="w-full h-full rounded-full object-cover border-2 border-indigo-400"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-full h-full text-gray-400" />
                                        )}
                                        {/* Botón flotante para cargar imagen */}
                                        <label htmlFor="image-upload" className="absolute bottom-0 right-0 p-1 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                                            <FaCamera className="w-4 h-4" />
                                            <input 
                                                id="image-upload" 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleImageUpload} 
                                                className="hidden" 
                                            />
                                        </label>
                                    </div>

                                    <p className="font-semibold text-gray-900">{profile.name} {profile.lastName}</p>
                                    <p className="text-sm text-gray-500">{profile.email}</p>
                                </div>
                                
                                <nav className="flex flex-col space-y-1">
                                    {navItemsLg.map((item) => {
                                        const IconComponent = IconMap[item.icon];
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveSection(item.id)}
                                                className={`flex items-center p-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                                                    activeSection === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {IconComponent && <IconComponent className="mr-3 text-lg" />}
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            
                            {/* Botones de acción inferiores */}
                            <div className="space-y-3 pt-3 border-t">
                                <button
                                    onClick={() => setActiveSection('changePassword')}
                                    className="w-full flex items-center justify-start p-2 rounded-md transition-colors duration-200 text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                                >
                                    <FaLock className="mr-3 text-lg" /> Cambiar Contraseña
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-start p-2 rounded-md transition-colors duration-200 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200"
                                >
                                    <FaSignOutAlt className="mr-3 text-lg" /> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 2: Contenido Principal */}
                    <div className="md:col-span-3 bg-white p-4">
                        {activeSection === 'profile' && (
                            <ProfileFormLg 
                                profile={profile}
                                formData={formData}
                                isEditing={isEditing}
                                isNameLocked={isNameLocked}
                                lockDate={lockDate}
                                handleProfileSave={handleProfileSave}
                                handleProfileInputChange={handleProfileInputChange}
                                setIsEditing={setIsEditing}
                                setFormData={setFormData}
                            />
                        )}
                        {activeSection === 'payments' && (
                            <PaymentMethodsViewLg 
                                payments={payments}
                                dispatchPayments={dispatchPayments}
                                isAddingPayment={isAddingPayment}
                                setIsAddingPayment={setIsAddingPayment}
                            />
                        )}
                        
                        {activeSection === 'changePassword' && <ChangePasswordViewLg setActiveSection={setActiveSection} />}

                        {activeSection === 'orders' && (
                            <div className='p-8 text-center text-gray-600 border rounded-lg h-96 flex items-center justify-center'>
                                Contenido de la sección Historial de Pedidos <FaBox className="ml-2" />.
                                (Pendiente de implementación)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileViewLg;