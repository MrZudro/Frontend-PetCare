import axiosInstance from './axiosConfig';

/**
 * Servicio para gestión de horarios de empleados
 */

// Obtener horarios próximos de un empleado
export const getEmployeeUpcomingSchedule = async (employeeId, days = 15) => {
    try {
        const response = await axiosInstance.get(`/api/schedules/employee/${employeeId}/upcoming`, {
            params: { days }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo horarios próximos:', error);
        throw error;
    }
};

// Obtener horarios de un empleado por período de fechas
export const getEmployeeScheduleForPeriod = async (employeeId, startDate, endDate) => {
    try {
        const response = await axiosInstance.get(`/api/schedules/employee/${employeeId}/period`, {
            params: {
                start: startDate,
                end: endDate
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo horarios por período:', error);
        throw error;
    }
};

// Obtener todos los horarios de todos los empleados por período (para vista de calendario)
export const getAllSchedulesForPeriod = async (startDate, endDate) => {
    try {
        const response = await axiosInstance.get('/api/schedules/calendar', {
            params: {
                start: startDate,
                end: endDate
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo horarios para calendario:', error);
        throw error;
    }
};

// Crear múltiples horarios en lote
export const createBulkSchedules = async (schedules) => {
    try {
        const response = await axiosInstance.post('/api/schedules/bulk', schedules);
        return response.data;
    } catch (error) {
        console.error('Error creando horarios en lote:', error);
        throw error;
    }
};

// Crear un horario individual
export const createSchedule = async (scheduleData) => {
    try {
        const response = await axiosInstance.post('/api/schedules', scheduleData);
        return response.data;
    } catch (error) {
        console.error('Error creando horario:', error);
        throw error;
    }
};

// Actualizar un horario
export const updateSchedule = async (id, scheduleData) => {
    try {
        const response = await axiosInstance.put(`/api/schedules/${id}`, scheduleData);
        return response.data;
    } catch (error) {
        console.error('Error actualizando horario:', error);
        throw error;
    }
};

// Eliminar un horario
export const deleteSchedule = async (id) => {
    try {
        await axiosInstance.delete(`/api/schedules/${id}`);
    } catch (error) {
        console.error('Error eliminando horario:', error);
        throw error;
    }
};

// Obtener todos los horarios de un empleado
export const getEmployeeSchedules = async (employeeId) => {
    try {
        const response = await axiosInstance.get(`/api/schedules/employee/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo horarios del empleado:', error);
        throw error;
    }
};

// Obtener un horario específico por ID
export const getScheduleById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/schedules/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo horario:', error);
        throw error;
    }
};

export default {
    getEmployeeUpcomingSchedule,
    getEmployeeScheduleForPeriod,
    getAllSchedulesForPeriod,
    createBulkSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getEmployeeSchedules,
    getScheduleById
};
