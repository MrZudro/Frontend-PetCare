import api from './axiosConfig';

/**
 * Customer Service - Handles all customer-related API calls
 */

/**
 * Get customer by ID
 * @param {number} id - Customer ID
 * @returns {Promise} Customer data
 */
export const getCustomerById = async (id) => {
    try {
        const response = await api.get(`/api/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching customer:', error);
        throw error;
    }
};

/**
 * Update customer information
 * @param {number} id - Customer ID
 * @param {object} customerData - Updated customer data
 * @returns {Promise} Updated customer data
 */
export const updateCustomer = async (id, customerData) => {
    try {
        const response = await api.put(`/api/customers/${id}`, customerData);
        return response.data;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
};

export default {
    getCustomerById,
    updateCustomer
};
