// useAppointmentStore.js
import { create } from 'zustand';
import initialAppointments from '../Data/appointments.json';

// Lógica de "persistencia" en localStorage para simular API
const getInitialState = () => {
    try {
        const persistedState = localStorage.getItem('appointments');
        if (persistedState) {
            return JSON.parse(persistedState);
        }
    } catch (e) {
        console.error("Error loading appointments from localStorage", e);
    }
    return initialAppointments;
};

const persistState = (appointments) => {
    try {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch (e) {
        console.error("Error saving appointments to localStorage", e);
    }
};

export const useAppointmentStore = create((set) => ({
    // Estado inicial cargado desde localStorage o JSON
    appointments: getInitialState(),

    // Simula la llamada POST a la API
    addAppointment: (appointment) => set((state) => {
        const newAppointments = [...state.appointments, appointment];
        persistState(newAppointments);
        return { appointments: newAppointments };
    }),

    // Simula la llamada DELETE a la API
    removeAppointment: (id) => set((state) => {
        const newAppointments = state.appointments.filter(app => app.id !== id);
        persistState(newAppointments);
        return { appointments: newAppointments };
    }),

    // Simula la llamada PUT a la API
    updateAppointment: (updatedAppointment) => set((state) => {
        const newAppointments = state.appointments.map(app =>
            app.id === updatedAppointment.id ? updatedAppointment : app
        );
        persistState(newAppointments);
        return { appointments: newAppointments };
    }),
}));