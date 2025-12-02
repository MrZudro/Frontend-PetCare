import api from './axiosConfig';

const petDetailService = {
    getPetDetail: async (petId) => {
        const response = await api.get(`/api/pets/${petId}/detail`);
        return response.data;
    },

    // Add other related methods if needed, e.g., fetching specific history separately if not aggregated
    getActiveConditions: async (petId) => {
        // This might be redundant if included in detail, but good to have
        // const response = await api.get(`/api/pet-conditions/pet/${petId}/active`);
        // return response.data;
    }
};

export default petDetailService;
