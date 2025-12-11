// src/services/paymentMethodService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/payment-methods';

/**
 * Servicio para gestionar métodos de pago de clientes
 */

/**
 * Obtiene todos los métodos de pago de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Lista de métodos de pago
 */
export const getPaymentMethodsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener métodos de pago:', error);
        throw error;
    }
};

/**
 * Crea un nuevo método de pago para un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} paymentMethodData - Datos del método de pago
 * @param {string} paymentMethodData.tokenPaymentMethod - Token del método de pago
 * @param {string} paymentMethodData.tokenClientGateway - Token del cliente en la pasarela
 * @param {string} paymentMethodData.brand - Marca de la tarjeta (Visa, Mastercard, etc.)
 * @param {number} paymentMethodData.lastFourDigits - Últimos 4 dígitos
 * @param {string} paymentMethodData.expirationDate - Fecha de expiración (MM/YY)
 * @param {boolean} paymentMethodData.isDefault - Si es el método predeterminado
 * @returns {Promise<Object>} Método de pago creado
 */
export const createPaymentMethod = async (userId, paymentMethodData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/${userId}`, paymentMethodData);
        return response.data;
    } catch (error) {
        console.error('Error al crear método de pago:', error);
        throw error;
    }
};

/**
 * Elimina un método de pago
 * @param {number} methodId - ID del método de pago
 * @param {number} userId - ID del usuario (para validar ownership)
 * @returns {Promise<void>}
 */
export const deletePaymentMethod = async (methodId, userId) => {
    try {
        await axios.delete(`${API_BASE_URL}/${methodId}/user/${userId}`);
    } catch (error) {
        console.error('Error al eliminar método de pago:', error);
        throw error;
    }
};

/**
 * Marca un método de pago como predeterminado
 * @param {number} methodId - ID del método de pago
 * @param {number} userId - ID del usuario (para validar ownership)
 * @returns {Promise<Object>} Método de pago actualizado
 */
export const setDefaultPaymentMethod = async (methodId, userId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${methodId}/default/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al marcar método como predeterminado:', error);
        throw error;
    }
};

/**
 * Detecta la marca de tarjeta basándose en el número
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} Marca detectada (Visa, Mastercard, Amex, Discover, Unknown)
 */
export const detectCardBrand = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '').replace(/\D/g, '');

    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'Diners Club';

    return 'Unknown';
};

/**
 * Valida un número de tarjeta usando el algoritmo de Luhn
 * @param {string} cardNumber - Número de tarjeta
 * @returns {boolean} True si es válido
 */
export const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '').replace(/\D/g, '');

    if (cleaned.length < 13 || cleaned.length > 19) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

/**
 * Formatea un número de tarjeta con espacios
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} Número formateado
 */
export const formatCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '').replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
};

/**
 * Valida una fecha de expiración
 * @param {string} expirationDate - Fecha en formato MM/YY
 * @returns {boolean} True si es válida y no está vencida
 */
export const validateExpirationDate = (expirationDate) => {
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
        return false;
    }

    const [month, year] = expirationDate.split('/').map(num => parseInt(num, 10));

    if (month < 1 || month > 12) {
        return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Últimos 2 dígitos
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false; // Tarjeta vencida
    }

    return true;
};
