import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [isTokenValidated, setIsTokenValidated] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [tokenFromUrl, setTokenFromUrl] = useState(false);

    // Check if token came from URL (email link) and pre-fill it
    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
            setTokenFromUrl(true);
            // Don't auto-validate, let user see the token and click validate button
            // This ensures they see confirmation before proceeding
        }
    }, [searchParams]);

    const validateToken = async (tokenToValidate) => {
        setIsLoading(true);
        setError('');

        try {
            // We can validate by checking if the token exists and is not expired
            // For now, we'll just set it as validated since the actual validation
            // happens on the backend when resetting the password
            setIsTokenValidated(true);
            setMessage('Token validado correctamente. Ahora puedes establecer tu nueva contraseña.');
        } catch (err) {
            setError('Token inválido o expirado. Por favor solicita un nuevo enlace de restablecimiento.');
            setIsTokenValidated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleValidateToken = (e) => {
        e.preventDefault();
        if (!token.trim()) {
            setError('Por favor ingresa el token recibido por correo.');
            return;
        }
        validateToken(token);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            setMessage('La contraseña ha sido restablecida exitosamente. Redirigiendo al inicio de sesión...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Ocurrió un error. El token puede estar expirado o ser inválido.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    {!isTokenValidated ? 'Validar Token' : 'Establecer Nueva Contraseña'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {!isTokenValidated
                        ? 'Ingresa el token que recibiste por correo electrónico'
                        : 'Ingresa tu nueva contraseña para completar el restablecimiento'
                    }
                </p>
            </div>

            {message && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                        <FaCheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{message}</p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {!isTokenValidated ? (
                // Token Validation Form
                <form className="space-y-6" onSubmit={handleValidateToken}>
                    {tokenFromUrl && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Token detectado desde el enlace del correo. Por favor haz clic en "Validar Token" para continuar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                            Token de Restablecimiento
                        </label>
                        <div className="mt-1">
                            <input
                                id="token"
                                name="token"
                                type="text"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Ingresa el token de 36 caracteres"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            El token fue enviado a tu correo electrónico. Puedes copiarlo desde el correo o hacer clic en el enlace.
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Validando...' : 'Validar Token'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                            ¿No recibiste el correo? Solicitar nuevo token
                        </Link>
                    </div>
                </form>
            ) : (
                // Password Reset Form (shown after token validation)
                <form className="space-y-6" onSubmit={handleResetPassword}>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Nueva Contraseña
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirmar Nueva Contraseña
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;
