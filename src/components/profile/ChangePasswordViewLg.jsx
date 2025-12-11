// src/components/profile/ChangePasswordViewLg.jsx

import React, { useState, useCallback } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePassword } from '../../services/authService';

const ChangePasswordViewLg = React.memo(({ setActiveSection }) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordChange = useCallback((e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        setError('');
    }, []);

    const handleSavePassword = useCallback(async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwords;

        // Client-side validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Todos los campos de contraseña son obligatorios.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("La nueva contraseña y la confirmación no coinciden.");
            return;
        }

        if (newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (!/[0-9]/.test(newPassword)) {
            setError("La contraseña debe incluir al menos un número.");
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            setError("La contraseña debe incluir al menos una mayúscula.");
            return;
        }

        try {
            setLoading(true);
            setError('');

            await changePassword(currentPassword, newPassword);

            alert("¡Contraseña actualizada con éxito!");
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setActiveSection('profile');
        } catch (err) {
            console.error('Error changing password:', err);
            setError(err.message || 'Error al cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    }, [passwords, setActiveSection]);

    const togglePasswordVisibility = useCallback((field) => {
        if (field === 'current') {
            setShowCurrentPassword(prev => !prev);
        } else if (field === 'new') {
            setShowNewPassword(prev => !prev);
        } else if (field === 'confirm') {
            setShowConfirmPassword(prev => !prev);
        }
    }, []);

    return (
        <form onSubmit={handleSavePassword} className="space-y-6 p-4">
            <h2 className="text-xl font-bold text-[var(--color-texto)] border-b pb-2 flex items-center">
                <FaLock className="mr-2" /> Cambiar Contraseña
            </h2>

            {error && (
                <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                    {error}
                </div>
            )}

            <label className="block">
                <span className="text-[var(--color-texto)] text-sm font-medium">Contraseña Actual *</span>
                <div className="relative">
                    <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border border-[var(--color-primary)] bg-white shadow-sm p-2 pr-10 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        required
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
                        title={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showCurrentPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                    </button>
                </div>
            </label>

            <label className="block">
                <span className="text-[var(--color-texto)] text-sm font-medium">Nueva Contraseña *</span>
                <div className="relative">
                    <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border border-[var(--color-primary)] bg-white shadow-sm p-2 pr-10 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        required
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
                        title={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showNewPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                    </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Mínimo 8 caracteres, incluye mayúsculas y números.
                </p>
            </label>

            <label className="block">
                <span className="text-[var(--color-texto)] text-sm font-medium">Confirmar Nueva Contraseña *</span>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border border-[var(--color-primary)] bg-white shadow-sm p-2 pr-10 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        required
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
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
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition duration-150 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
                </button>
            </div>
        </form>
    );
});

export default ChangePasswordViewLg;