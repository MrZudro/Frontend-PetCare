// src/components/profile/PaymentMethodsViewLg.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FaCreditCard, FaTrash, FaStar, FaRegStar, FaPlus, FaTimes } from 'react-icons/fa';
import {
    getPaymentMethodsByUserId,
    createPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    detectCardBrand,
    validateCardNumber,
    validateExpirationDate,
    formatCardNumber
} from '../../services/paymentMethodService';

/**
 * Componente reutilizable para gestionar métodos de pago
 * @param {number} userId - ID del usuario
 * @param {boolean} selectionMode - Si true, permite seleccionar un método (para checkout)
 * @param {function} onSelect - Callback cuando se selecciona un método
 * @param {boolean} showAddButton - Si true, muestra el botón para agregar (default: true)
 */
const PaymentMethodsViewLg = ({
    userId,
    selectionMode = false,
    onSelect = null,
    showAddButton = true
}) => {
    // Estados
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    // Estados del formulario
    const [formData, setFormData] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        isDefault: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Cargar métodos de pago al montar
    useEffect(() => {
        loadPaymentMethods();
    }, [userId]);

    const loadPaymentMethods = async () => {
        try {
            setLoading(true);
            setError(null);
            const methods = await getPaymentMethodsByUserId(userId);
            setPaymentMethods(methods);
        } catch (err) {
            console.error('Error cargando métodos de pago:', err);
            setError('Error al cargar los métodos de pago');
        } finally {
            setLoading(false);
        }
    };

    // Manejador de cambios en el formulario
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        let processedValue = value;

        // Formatear número de tarjeta
        if (name === 'cardNumber') {
            processedValue = formatCardNumber(value);
        }

        // Formatear fecha de expiración
        if (name === 'expirationDate') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length >= 2) {
                processedValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
            } else {
                processedValue = cleaned;
            }
        }

        // Limitar CVV a 4 dígitos
        if (name === 'cvv') {
            processedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));

        // Limpiar error del campo
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Validar formulario
    const validateForm = () => {
        const errors = {};

        if (!formData.cardNumber) {
            errors.cardNumber = 'El número de tarjeta es requerido';
        } else if (!validateCardNumber(formData.cardNumber)) {
            errors.cardNumber = 'Número de tarjeta inválido';
        }

        if (!formData.expirationDate) {
            errors.expirationDate = 'La fecha de expiración es requerida';
        } else if (!validateExpirationDate(formData.expirationDate)) {
            errors.expirationDate = 'Fecha inválida o tarjeta vencida';
        }

        if (!formData.cvv) {
            errors.cvv = 'El CVV es requerido';
        } else if (formData.cvv.length < 3) {
            errors.cvv = 'CVV inválido';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Crear método de pago
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            // Detectar marca de tarjeta
            const brand = detectCardBrand(formData.cardNumber);

            // Obtener últimos 4 dígitos
            const cleaned = formData.cardNumber.replace(/\s/g, '');
            const lastFourDigits = parseInt(cleaned.slice(-4), 10);

            // En producción, aquí se integraría con la pasarela de pago
            // Por ahora, usamos tokens simulados
            const paymentMethodData = {
                tokenPaymentMethod: `tok_${brand.toLowerCase()}_${Date.now()}`,
                tokenClientGateway: `cus_${userId}_${Date.now()}`,
                brand: brand,
                lastFourDigits: lastFourDigits,
                expirationDate: formData.expirationDate,
                isDefault: formData.isDefault
            };

            await createPaymentMethod(userId, paymentMethodData);

            // Recargar métodos
            await loadPaymentMethods();

            // Cerrar modal y resetear formulario
            setShowModal(false);
            setFormData({
                cardNumber: '',
                expirationDate: '',
                cvv: '',
                isDefault: false
            });
            setFormErrors({});

        } catch (err) {
            console.error('Error creando método de pago:', err);
            setError('Error al guardar el método de pago');
        } finally {
            setSubmitting(false);
        }
    };

    // Eliminar método de pago
    const handleDelete = async (methodId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
            return;
        }

        try {
            await deletePaymentMethod(methodId, userId);
            await loadPaymentMethods();
        } catch (err) {
            console.error('Error eliminando método de pago:', err);
            setError('Error al eliminar el método de pago');
        }
    };

    // Marcar como predeterminado
    const handleSetDefault = async (methodId) => {
        try {
            await setDefaultPaymentMethod(methodId, userId);
            await loadPaymentMethods();
        } catch (err) {
            console.error('Error marcando como predeterminado:', err);
            setError('Error al marcar como predeterminado');
        }
    };

    // Seleccionar método (modo selección)
    const handleSelectMethod = (method) => {
        setSelectedMethod(method.id);
        if (onSelect) {
            onSelect(method);
        }
    };

    // Obtener icono de marca
    const getBrandIcon = (brand) => {
        const brandLower = brand?.toLowerCase() || '';

        // Colores de marca
        const brandColors = {
            'visa': 'text-blue-600',
            'mastercard': 'text-red-600',
            'american express': 'text-blue-500',
            'discover': 'text-orange-500',
            'diners club': 'text-blue-700'
        };

        const color = brandColors[brandLower] || 'text-gray-600';

        return (
            <div className={`text-4xl ${color}`}>
                <FaCreditCard />
            </div>
        );
    };

    // RENDER - Loading
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-texto">Métodos de Pago</h2>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-xl"></div>
                ))}
            </div>
        );
    }

    // RENDER - Main
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-texto">
                        {selectionMode ? 'Selecciona un método de pago' : 'Métodos de Pago'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {selectionMode
                            ? 'Elige cómo deseas pagar'
                            : 'Gestiona tus tarjetas guardadas de forma segura'}
                    </p>
                </div>
                {showAddButton && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg
                                 font-medium transition-all duration-300 ease-in-out
                                 hover:bg-primary-hover transform hover:scale-105 shadow-md"
                    >
                        <FaPlus /> Agregar Tarjeta
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-alerta p-4 rounded-lg">
                    <p className="text-alerta font-medium">{error}</p>
                </div>
            )}

            {/* Payment Methods List */}
            {paymentMethods.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map(method => (
                        <div
                            key={method.id}
                            onClick={() => selectionMode && handleSelectMethod(method)}
                            className={`relative bg-white rounded-xl shadow-md p-6 border-2 transition-all duration-300
                                      ${selectionMode ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''}
                                      ${selectedMethod === method.id ? 'border-primary bg-primary/5' : 'border-transparent'}
                                      ${method.isDefault ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                        >
                            {/* Default Badge */}
                            {method.isDefault && (
                                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full
                                              flex items-center gap-1">
                                    <FaStar className="text-xs" /> Predeterminada
                                </div>
                            )}

                            {/* Card Info */}
                            <div className="flex items-start gap-4">
                                {/* Brand Icon */}
                                <div className="shrink-0">
                                    {getBrandIcon(method.brand)}
                                </div>

                                {/* Card Details */}
                                <div className="flex-1">
                                    <p className="font-bold text-lg text-texto">
                                        {method.brand}
                                    </p>
                                    <p className="text-gray-600 font-mono">
                                        •••• •••• •••• {method.lastFourDigits}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Vence: {method.expirationDate}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            {!selectionMode && (
                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                    {!method.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(method.id)}
                                            className="flex items-center gap-1 text-sm text-acento-secundario hover:text-acento-terciario
                                                     transition-colors duration-200"
                                        >
                                            <FaRegStar /> Marcar como predeterminada
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(method.id)}
                                        className="ml-auto flex items-center gap-1 text-sm text-alerta hover:text-red-700
                                                 transition-colors duration-200"
                                    >
                                        <FaTrash /> Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <FaCreditCard className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No tienes métodos de pago guardados</p>
                    <p className="text-sm text-gray-500 mt-2">Agrega una tarjeta para comenzar</p>
                </div>
            )}

            {/* Modal para agregar tarjeta */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-linear-to-r from-primary to-acento-secundario p-6 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">Agregar Tarjeta</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <p className="text-white/90 text-sm mt-2">
                                Tus datos están protegidos y encriptados
                            </p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Número de Tarjeta */}
                            <div>
                                <label className="block text-sm font-bold text-texto mb-2">
                                    Número de Tarjeta
                                </label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleFormChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors
                                              ${formErrors.cardNumber ? 'border-alerta bg-red-50' : 'border-gray-300 focus:border-primary'}`}
                                />
                                {formErrors.cardNumber && (
                                    <p className="text-alerta text-sm mt-1">{formErrors.cardNumber}</p>
                                )}
                                {formData.cardNumber && !formErrors.cardNumber && (
                                    <p className="text-acento-secundario text-sm mt-1">
                                        {detectCardBrand(formData.cardNumber)}
                                    </p>
                                )}
                            </div>

                            {/* Fecha de Expiración y CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-texto mb-2">
                                        Vencimiento
                                    </label>
                                    <input
                                        type="text"
                                        name="expirationDate"
                                        value={formData.expirationDate}
                                        onChange={handleFormChange}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors
                                                  ${formErrors.expirationDate ? 'border-alerta bg-red-50' : 'border-gray-300 focus:border-primary'}`}
                                    />
                                    {formErrors.expirationDate && (
                                        <p className="text-alerta text-sm mt-1">{formErrors.expirationDate}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-texto mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="password"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleFormChange}
                                        placeholder="123"
                                        maxLength="4"
                                        className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors
                                                  ${formErrors.cvv ? 'border-alerta bg-red-50' : 'border-gray-300 focus:border-primary'}`}
                                    />
                                    {formErrors.cvv && (
                                        <p className="text-alerta text-sm mt-1">{formErrors.cvv}</p>
                                    )}
                                </div>
                            </div>

                            {/* Marcar como predeterminada */}
                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleFormChange}
                                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                                />
                                <label htmlFor="isDefault" className="text-sm text-texto cursor-pointer">
                                    Marcar como método de pago predeterminado
                                </label>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg
                                             font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium
                                             hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Guardando...' : 'Guardar Tarjeta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodsViewLg;