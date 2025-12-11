// src/services/categoriesService.js
import api from './axiosConfig';

const categoriesService = {
  getAll: () => api.get("/api/categories"),
};

export default categoriesService;