import React, { useState } from 'react';
import { FaTimes, FaCamera, FaSave } from 'react-icons/fa';

const ProfileEdit = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        profilePhotoUrl: user.profilePhotoUrl || '',
        address: user.address || '', // Assuming address is part of user object, though not in mock yet
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        // In a real app, you'd validate and send to API
        onSave({
            ...user,
            profilePhotoUrl: formData.profilePhotoUrl,
            // address: formData.address 
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="bg-primary p-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">Editar Perfil</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-24 h-24 group">
                            <img
                                src={formData.profilePhotoUrl || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-md"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                <FaCamera className="text-2xl" />
                                <input
                                    type="text"
                                    name="profilePhotoUrl"
                                    placeholder="URL de la imagen"
                                    className="hidden" // For now just a text input for URL, ideally file upload
                                // onChange handled via text input below for simplicity in this mock
                                />
                            </label>
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto de Perfil</label>
                            <input
                                type="text"
                                name="profilePhotoUrl"
                                value={formData.profilePhotoUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Residencia</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Calle 123 # 45-67"
                        />
                    </div>

                    {/* Password Change */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-md font-semibold text-gray-800 mb-3">Cambiar Contraseña</h3>
                        <div className="space-y-3">
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Contraseña Actual"
                            />
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Nueva Contraseña"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Confirmar Nueva Contraseña"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <FaSave /> Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;
