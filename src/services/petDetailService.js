import api from './axiosConfig';

const petDetailService = {
    getPetDetail: async (petId) => {
        const response = await api.get(`/api/pets/${petId}/detail`);
        return response.data;
    },
    getActiveConditions: async (petId) => {
    }
};

export default petDetailService;
