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
import OrderHistoryViewLg from '../components/profile/OrderHistoryViewLg';

// Icon mapping for navigation items
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
            // LOG 1: Verificar datos del usuario desde AuthContext
            console.log('🔍 [UserProfileViewLg] Usuario desde AuthContext:', user);
            console.log('🔍 [UserProfileViewLg] profilePhotoUrl desde user:', user?.profilePhotoUrl);

            // LOG 2: Verificar localStorage
            const storedUser = localStorage.getItem('user');
            console.log('🔍 [UserProfileViewLg] localStorage raw:', storedUser);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                console.log('🔍 [UserProfileViewLg] localStorage parsed:', parsedUser);
                console.log('🔍 [UserProfileViewLg] profilePhotoUrl desde localStorage:', parsedUser?.profilePhotoUrl);
            }

            if (!user || !user.id) {
                setError('Usuario no autenticado');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const customerData = await getCustomerById(user.id);

                // LOG 3: Verificar datos de la API
                console.log('🔍 [UserProfileViewLg] Datos de la API:', customerData);
                console.log('🔍 [UserProfileViewLg] profilePhotoUrl desde API:', customerData?.profilePhotoUrl);

                setProfile(customerData);
                setError(null);
            } catch (err) {
                console.error('❌ [UserProfileViewLg] Error loading customer data:', err);
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

    // RENDER - Loading State
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                    <p className="mt-6 text-texto font-medium text-lg">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    // RENDER - Error State
    if (error || !profile) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4">
                <div className="bg-red-50 border-l-4 border-alerta p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-alerta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-alerta font-medium">{error || 'No se pudo cargar el perfil'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER - Main Content
    return (
        <div className="max-w-7xl mx-auto my-10 px-4">
            <div className="bg-fondo shadow-[var(--shadow-pred)] rounded-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-acento-secundario p-8 text-white">
                    <h1 className="text-3xl font-bold">Mi Perfil</h1>
                    <p className="mt-2 text-white/90">Gestiona tu información personal y preferencias</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-6 lg:p-8">

                    {/* SIDEBAR - Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-white rounded-xl shadow-md overflow-hidden">

                            {/* Profile Photo Section */}
                            <div className="bg-gradient-to-br from-primary/10 to-acento-secundario/10 p-6 border-b">
                                <div className="flex flex-col items-center">
                                    <div className="relative group">
                                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg 
                                                      transition-all duration-300 ease-in-out transform group-hover:scale-105">
                                            <img
                                                src={(() => {
                                                    // LOG 4: Verificar URL de imagen al renderizar
                                                    const imageUrl = profile?.profilePhotoUrl || user?.profilePhotoUrl || 'https://via.placeholder.com/150';
                                                    console.log('🖼️ [UserProfileViewLg] URL de imagen a renderizar:', imageUrl);
                                                    console.log('🖼️ [UserProfileViewLg] profile?.profilePhotoUrl:', profile?.profilePhotoUrl);
                                                    console.log('🖼️ [UserProfileViewLg] user?.profilePhotoUrl:', user?.profilePhotoUrl);
                                                    return imageUrl;
                                                })()}
                                                alt="Foto de Perfil"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error('❌ [UserProfileViewLg] Error cargando imagen:', e.target.src);
                                                    e.target.src = 'https://via.placeholder.com/150?text=Usuario';
                                                }}
                                                onLoad={(e) => {
                                                    console.log('✅ [UserProfileViewLg] Imagen cargada exitosamente:', e.target.src);
                                                }}
                                            />
                                        </div>

                                        {/* Upload Button Overlay */}
                                        <label
                                            htmlFor="image-upload"
                                            className={`absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full 
                                                      cursor-pointer shadow-lg transition-all duration-300 ease-in-out
                                                      transform hover:scale-110 hover:bg-primary-hover
                                                      ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploadingImage ? (
                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            ) : (
                                                <FaCamera className="w-5 h-5" />
                                            )}
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

                                    <div className="mt-4 text-center">
                                        <p className="font-bold text-lg text-texto">
                                            {profile.names} {profile.lastNames}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="p-4">
                                <div className="space-y-1">
                                    {navItemsLg.map((item) => {
                                        const IconComponent = IconMap[item.icon];
                                        const isActive = activeSection === item.id;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveSection(item.id)}
                                                className={`w-full flex items-center px-4 py-3 rounded-lg 
                                                          font-medium text-sm transition-all duration-300 ease-in-out
                                                          transform hover:translate-x-1
                                                          ${isActive
                                                        ? 'bg-gradient-to-r from-primary to-acento-secundario text-white shadow-md'
                                                        : 'text-texto hover:bg-gray-100'
                                                    }`}
                                            >
                                                {IconComponent && <IconComponent className="mr-3 text-lg" />}
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* Action Buttons */}
                            <div className="p-4 border-t space-y-2">
                                <button
                                    onClick={() => setActiveSection('changePassword')}
                                    className="w-full flex items-center justify-start px-4 py-3 rounded-lg
                                             font-medium text-sm text-acento-secundario border border-acento-secundario
                                             transition-all duration-300 ease-in-out
                                             hover:bg-acento-secundario hover:text-white transform hover:scale-105"
                                >
                                    <FaLock className="mr-3 text-lg" />
                                    <span>Cambiar Contraseña</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-start px-4 py-3 rounded-lg
                                             font-medium text-sm text-alerta border border-alerta
                                             transition-all duration-300 ease-in-out
                                             hover:bg-alerta hover:text-white transform hover:scale-105"
                                >
                                    <FaSignOutAlt className="mr-3 text-lg" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-md p-6 min-h-[500px]">
                            {activeSection === 'profile' && (
                                <ProfileFormLg
                                    profile={profile}
                                    onProfileUpdate={handleProfileUpdate}
                                />
                            )}

                            {activeSection === 'payments' && (
                                <PaymentMethodsViewLg userId={user.id} />
                            )}

                            {activeSection === 'changePassword' && (
                                <ChangePasswordViewLg setActiveSection={setActiveSection} />
                            )}

                            {activeSection === 'orders' && (
                                <OrderHistoryViewLg customerId={user.id} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileViewLg;