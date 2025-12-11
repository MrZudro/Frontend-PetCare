// src/services/subcategoriesService.js
import api from './axiosConfig';

const subcategoriesService = {
  getAll: () => api.get("/api/subcategories"),
};

export default subcategoriesService;