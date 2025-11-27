// src/components/profile/ChangePasswordViewLg.jsx

import React, { useState, useCallback } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePasswordViewLg = React.memo(({ setActiveSection }) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handlePasswordChange = useCallback((e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        setError('');
    }, []);

    const handleSavePassword = useCallback((e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwords;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Todos los campos de contraseña son obligatorios.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("La nueva contraseña y la confirmación no coinciden.");
            return;
        }

        if (newPassword.length < 8 || !/[0-9]/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
            setError("La contraseña debe tener al menos 8 caracteres, incluyendo un número y una mayúscula.");
            return;
        }

        alert("¡Contraseña actualizada con éxito!");
        
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setActiveSection('profile'); 
    }, [passwords, setActiveSection]);

    const togglePasswordVisibility = useCallback((field) => {
        if (field === 'new') {
            setShowNewPassword(prev => !prev);
        } else if (field === 'confirm') {
            setShowConfirmPassword(prev => !prev);
        }
    }, []);

    return (
        <form onSubmit={handleSavePassword} className="space-y-6 p-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center"><FaLock className="mr-2" /> Cambiar Contraseña</h2>
            
            {error && (
                <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                    {error}
                </div>
            )}

            <label className="block">
                <span className="text-gray-700 text-sm font-medium">Contraseña Actual</span>
                <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm p-2"
                />
            </label>

            <label className="block">
                <span className="text-gray-700 text-sm font-medium">Nueva Contraseña</span>
                <div className="relative">
                    <input type={showNewPassword ? 'text' : 'password'} name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm p-2 pr-10"
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
                        title={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showNewPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                    </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Recomendación: Mínimo 8 caracteres, incluye mayúsculas y números.
                </p>
            </label>

            <label className="block">
                <span className="text-gray-700 text-sm font-medium">Confirmar Nueva Contraseña</span>
                <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm p-2 pr-10"
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
                        title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showConfirmPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                    </button>
                </div>
                {passwords.newPassword && passwords.confirmPassword && (
                    <p className={`mt-1 text-xs font-semibold ${passwords.newPassword === passwords.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {passwords.newPassword === passwords.confirmPassword ? '✅ Las contraseñas coinciden.' : '❌ Las contraseñas NO coinciden.'}
                    </p>
                )}
            </label>

            <div className="flex justify-end pt-4 border-t">
                <button type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150">
                    Guardar Nueva Contraseña
                </button>
            </div>
        </form>
    );
});

export default ChangePasswordViewLg;