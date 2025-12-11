import api from './axiosConfig';

/**
 * Location Service - Handles location-related API calls (document types, localities, neighborhoods)
 */

/**
 * Get all document types
 * @returns {Promise} List of document types
 */
export const getDocumentTypes = async () => {
    try {
        const response = await api.get('/api/document-types');
        return response.data;
    } catch (error) {
        console.error('Error fetching document types:', error);
        throw error;
    }
};

/**
 * Get all localities
 * @returns {Promise} List of localities
 */
export const getLocalities = async () => {
    try {
        const response = await api.get('/api/localities');
        return response.data;
    } catch (error) {
        console.error('Error fetching localities:', error);
        throw error;
    }
};

/**
 * Get neighborhoods filtered by locality ID
 * @param {number} localityId - Locality ID to filter by
 * @returns {Promise} List of neighborhoods for the specified locality
 */
export const getNeighborhoodsByLocality = async (localityId) => {
    try {
        const response = await api.get(`/api/neighborhoods/by-locality/${localityId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching neighborhoods:', error);
        throw error;
    }
};

export default {
    getDocumentTypes,
    getLocalities,
    getNeighborhoodsByLocality
};
