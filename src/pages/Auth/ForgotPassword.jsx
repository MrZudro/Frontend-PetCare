import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && message) {
            navigate('/reset-password');
        }
    }, [countdown, message, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            // Adjust endpoint as per backend implementation
            await api.post('/auth/forgot-password', { email });
            setMessage('Token enviado a tu correo electrónico. Revisa tu bandeja de entrada.');
            setCountdown(5);
        } catch (err) {
            // It's often better security practice not to reveal if the email exists or not,
            // but for this example we'll show a generic error or the specific one if needed.
            setError('Ocurrió un error. Por favor intente de nuevo más tarde.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Recuperar contraseña
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {message && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-green-700">
                                    {message}
                                    {countdown > 0 && (
                                        <span className="block mt-2 font-semibold">
                                            Redirigiendo a la página de validación en {countdown} segundo{countdown !== 1 ? 's' : ''}...
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo electrónico
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
                    </button>
                </div>

                <div className="text-center">
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
