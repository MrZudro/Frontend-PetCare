// src/pages/UserProfileViewLg.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
    FaUser, FaBox, FaCreditCard, FaLock, FaSignOutAlt, FaCamera
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getCustomerById } from '../services/customerService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

// Component imports
import ChangePasswordViewLg from '../components/profile/ChangePasswordViewLg.jsx';
import ProfileFormLg from '../components/profile/ProfileFormLg';
import PaymentMethodsViewLg from '../components/profile/PaymentMethodsViewLg';

// Mapeo de strings a componentes de iconos
const IconMap = {
    FaUser, FaBox, FaCreditCard, FaLock, FaSignOutAlt
};

const navItemsLg = [
    { id: 'profile', label: 'Información Personal', icon: 'FaUser' },
    { id: 'orders', label: 'Historial de Pedidos', icon: 'FaBox' },
    { id: 'payments', label: 'Métodos de Pago', icon: 'FaCreditCard' },
];

const UserProfileViewLg = () => {
    const { user, logout } = useAuth();

    // ESTADOS
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('profile');
    const [uploadingImage, setUploadingImage] = useState(false);

    // Fetch customer data on mount
    useEffect(() => {
        const fetchCustomerData = async () => {
            if (!user || !user.id) {
                setError('Usuario no autenticado');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const customerData = await getCustomerById(user.id);
                setProfile(customerData);
                setError(null);
            } catch (err) {
                console.error('Error loading customer data:', err);
                setError('Error al cargar los datos del perfil');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [user]);

    // HANDLERS
    const handleImageUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen no debe superar 2MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido');
            return;
        }

        try {
            setUploadingImage(true);
            const imageUrl = await uploadImageToCloudinary(file);

            // Update profile with new image URL
            setProfile(prev => ({ ...prev, profilePhotoUrl: imageUrl }));

            // Update user in localStorage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            storedUser.profilePhotoUrl = imageUrl;
            localStorage.setItem('user', JSON.stringify(storedUser));

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen. Por favor intenta de nuevo.');
        } finally {
            setUploadingImage(false);
        }
    }, []);

    const handleLogout = useCallback(() => {
        if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            logout();
            window.location.href = '/';
        }
    }, [logout]);

    const handleProfileUpdate = useCallback((updatedProfile) => {
        setProfile(updatedProfile);
    }, []);

    // RENDER
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                    <p className="mt-4 text-[var(--color-texto)]">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{error || 'No se pudo cargar el perfil'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto my-10 px-4">
            <div className="bg-[var(--color-fondo)] shadow-[var(--shadow-pred)] rounded-xl overflow-hidden p-6 md:p-8">

                <h1 className="text-2xl font-bold text-[var(--color-texto)] mb-6">Mi Perfil</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">

                    {/* COLUMNA 1: Menú de Navegación Lateral */}
                    <div className="md:w-60 md:col-span-1">
                        <div className="sticky top-6 bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col justify-between">

                            <div className="space-y-4 mb-6">
                                {/* Sección de Foto de Perfil */}
                                <div className="flex flex-col items-center border-b pb-4">
                                    <div className="w-24 h-24 mb-2 relative">
                                        <img
                                            src={profile?.profilePhotoUrl || 'https://via.placeholder.com/150'}
                                            alt="Foto de Perfil"
                                            className="w-full h-full rounded-full object-cover border-2 border-[var(--color-primary)]"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                        />
                                        {/* Botón flotante para cargar imagen */}
                                        <label
                                            htmlFor="image-upload"
                                            className={`absolute bottom - 0 right - 0 p - 1 bg - [var(--color - primary)]text - white rounded - full cursor - pointer hover: bg - [var(--color - primary - hover)]transition - colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''} `}
                                        >
                                            <FaCamera className="w-4 h-4" />
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploadingImage}
                                            />
                                        </label>
                                    </div>

                                    <p className="font-semibold text-[var(--color-texto)]">
                                        {profile.names} {profile.lastNames}
                                    </p>
                                    <p className="text-sm text-gray-500">{profile.email}</p>
                                </div>

                                <nav className="flex flex-col space-y-1">
                                    {navItemsLg.map((item) => {
                                        const IconComponent = IconMap[item.icon];
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveSection(item.id)}
                                                className={`flex items - center p - 2 rounded - md transition - colors duration - 200 text - sm font - medium ${activeSection === item.id
                                                        ? 'bg-[var(--color-primary)] text-white'
                                                        : 'text-[var(--color-texto)] hover:bg-gray-200'
                                                    } `}
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
                                    className="w-full flex items-center justify-start p-2 rounded-md transition-colors duration-200 text-sm font-medium text-[var(--color-acento-secundario)] hover:bg-blue-50 border border-[var(--color-acento-secundario)]"
                                >
                                    <FaLock className="mr-3 text-lg" /> Cambiar Contraseña
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-start p-2 rounded-md transition-colors duration-200 text-sm font-medium text-[var(--color-alerta)] hover:bg-red-50 border border-[var(--color-alerta)]"
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
                                onProfileUpdate={handleProfileUpdate}
                            />
                        )}
                        {activeSection === 'payments' && (
                            <PaymentMethodsViewLg />
                        )}

                        {activeSection === 'changePassword' && (
                            <ChangePasswordViewLg setActiveSection={setActiveSection} />
                        )}

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