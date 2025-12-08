import api from './axiosConfig';

/**
 * Servicios de API para la gestión de Productos (E-commerce)
 */
export const productsService = {
    /**
     * Obtener todos los productos
     * @returns {Promise} Lista de productos
     */
    getAll: () => api.get('/products'),

    /**
     * Obtener un producto por su ID
     * @param {number} id - ID del producto
     * @returns {Promise} Datos del producto
     */
    getById: (id) => api.get(`/products/${id}`),

    /**
     * Crear un nuevo producto
     * @param {Object} data - Datos del producto a crear
     * @returns {Promise} Producto creado
     */
    create: (data) => api.post('/products', data),

    /**
     * Actualizar un producto existente
     * @param {number} id - ID del producto
     * @param {Object} data - Datos actualizados del producto
     * @returns {Promise} Producto actualizado
     */
    update: (id, data) => api.put(`/products/${id}`, data),

    /**
     * Eliminar (suspender) un producto
     * @param {number} id - ID del producto a eliminar/suspender
     * @returns {Promise} Respuesta de la eliminación
     */
    delete: (id) => api.delete(`/products/${id}`)
};

// Exportación por defecto si se usa en archivos que no usan desestructuración
export default productsService;