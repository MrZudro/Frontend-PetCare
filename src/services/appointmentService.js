import api from './axiosConfig';

/**
 * Servicios de API para Appointments (Citas)
 */
export const appointmentService = {
    /**
     * Crear una nueva cita
     * @param {Object} data - Datos de la cita
     * @param {number} data.customerId - ID del cliente
     * @param {number} data.veterinaryClinicId - ID de la clínica
     * @param {number} data.serviceId - ID del servicio
     * @param {number} [data.employeeId] - ID del empleado (opcional)
     * @param {string} data.appointmentDateTime - Fecha y hora (ISO 8601)
     * @param {string} [data.reason] - Razón de la cita
     * @returns {Promise} Cita creada
     */
    create: (data) => api.post('/appointments', data),

    /**
     * Obtener todas las citas (Admin)
     * @returns {Promise} Lista de citas
     */
    getAll: () => api.get('/appointments'),

    /**
     * Obtener cita por ID
     * @param {number} id - ID de la cita
     * @returns {Promise} Datos de la cita
     */
    getById: (id) => api.get(`/appointments/${id}`),

    /**
     * Actualizar una cita
     * @param {number} id - ID de la cita
     * @param {Object} data - Datos a actualizar
     * @returns {Promise} Cita actualizada
     */
    update: (id, data) => api.put(`/appointments/${id}`, data),

    /**
     * Cancelar una cita (Eliminación lógica - cambia estado a CANCELLED)
     * @param {number} id - ID de la cita
     * @returns {Promise}
     */
    cancel: (id) => api.delete(`/appointments/${id}`),

    /**
     * Obtener citas de un cliente específico
     * @param {number} customerId - ID del cliente
     * @returns {Promise} Lista de citas del cliente
     */
    getByCustomer: (customerId) => api.get(`/appointments/customer/${customerId}`),

    /**
     * Obtener citas de un empleado específico
     * @param {number} employeeId - ID del empleado
     * @returns {Promise} Lista de citas del empleado
     */
    getByEmployee: (employeeId) => api.get(`/appointments/employee/${employeeId}`)
};

/**
 * Servicios de API para Schedules (Horarios de empleados)
 */
export const scheduleService = {
    /**
     * Obtener horarios de un empleado
     * @param {number} employeeId - ID del empleado
     * @returns {Promise} Lista de horarios
     */
    getByEmployee: (employeeId) => api.get(`/schedules/employee/${employeeId}`),

    /**
     * Obtener horarios de un empleado en un día específico
     * @param {number} employeeId - ID del empleado
     * @param {string} day - Día de la semana (Lunes, Martes, etc.)
     * @returns {Promise} Lista de horarios para ese día
     */
    getByEmployeeAndDay: (employeeId, day) => api.get(`/schedules/employee/${employeeId}/day/${day}`),

    /**
     * Obtener todos los horarios
     * @returns {Promise} Lista de todos los horarios
     */
    getAll: () => api.get('/schedules')
};

/**
 * Utilidad para generar slots de tiempo disponibles
 * @param {Array} schedules - Horarios del empleado
 * @param {Array} appointments - Citas ya agendadas
 * @param {string} selectedDate - Fecha seleccionada (YYYY-MM-DD)
 * @param {number} slotDurationMinutes - Duración de cada slot en minutos (default: 30)
 * @returns {Array} Lista de horarios disponibles
 */
export const generateAvailableSlots = (schedules, appointments, selectedDate, slotDurationMinutes = 30) => {
    const availableSlots = [];
    const selectedDayOfWeek = new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long' });
    const dayName = selectedDayOfWeek.charAt(0).toUpperCase() + selectedDayOfWeek.slice(1);

    // Filtrar horarios del día seleccionado
    const daySchedules = schedules.filter(schedule => schedule.day === dayName);

    daySchedules.forEach(schedule => {
        const startTime = schedule.start_time || schedule.startTime;
        const endTime = schedule.end_time || schedule.endTime;

        // Generar slots entre start_time y end_time
        const slots = generateTimeSlots(startTime, endTime, slotDurationMinutes);

        slots.forEach(slot => {
            const slotDateTime = `${selectedDate}T${slot}:00`;

            // Verificar si el slot ya está ocupado
            const isOccupied = appointments.some(appointment => {
                const appointmentDateTime = appointment.appointmentDateTime;
                return appointmentDateTime && appointmentDateTime.startsWith(slotDateTime);
            });

            if (!isOccupied) {
                availableSlots.push({
                    time: slot,
                    dateTime: slotDateTime,
                    available: true
                });
            }
        });
    });

    return availableSlots.sort((a, b) => a.time.localeCompare(b.time));
};

/**
 * Generar slots de tiempo entre dos horas
 * @param {string} startTime - Hora inicio (HH:mm:ss o HH:mm)
 * @param {string} endTime - Hora fin (HH:mm:ss o HH:mm)
 * @param {number} intervalMinutes - Intervalo en minutos
 * @returns {Array} Lista de horas en formato HH:mm
 */
const generateTimeSlots = (startTime, endTime, intervalMinutes) => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        slots.push(timeString);

        currentMinute += intervalMinutes;
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute = currentMinute % 60;
        }
    }

    return slots;
};

export default {
    appointmentService,
    scheduleService,
    generateAvailableSlots
};
