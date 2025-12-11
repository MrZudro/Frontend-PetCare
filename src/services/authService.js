// src/services/authService.js

import api from './axiosConfig';

/**
 * Authentication Service - Handles authentication-related API calls
 */

/**
 * Change user password (requires authentication)
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Success message
 */
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.put('/api/customers/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        // Extract error message from response if available
        const errorMessage = error.response?.data || error.message || 'Error al cambiar la contraseña';
        throw new Error(errorMessage);
    }
};

export default {
    changePassword
};
