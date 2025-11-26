// =================================================================
// src/components/services/ServiceQuickViewModalLg.jsx
// Modal de Vista Rápida y Agendamiento de Citas para Servicios.
// =================================================================

import React, { useState, useMemo } from 'react';
import { FaTimes, FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import { useAppointmentStore } from '../services/useAppointmentStore'; // 🚨 RUTA AJUSTADA
import { FaArrowLeft } from "react-icons/fa";


// 🚀 IMPORTACIÓN CLAVE: Datos de disponibilidad con estructura de Clínica/Servicio
// 🚨 NOTA: Asegúrate de que esta ruta sea correcta:
import mockAvailabilityData from '../Data/availability.json'; 

// --- FUNCIONES DE UTILIDAD (Fuera del componente) ---

// Función auxiliar para combinar clases de Tailwind (Mantenemos por si se usa en otras partes)
const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Hook para obtener y transformar la disponibilidad de un servicio y clínica específicos.
 * Se filtra en base a la estructura Clinic -> Service -> Availability.
 */
const useFilteredAvailabilityMap = (clinicName, serviceName) => {
    return useMemo(() => {
        if (!mockAvailabilityData) return {};
        
        // 1. Encontrar la clínica
        const clinicEntry = mockAvailabilityData.find(c => c.clinicName === clinicName);
        if (!clinicEntry) return {};

        // 2. Encontrar el servicio dentro de la clínica
        const serviceEntry = clinicEntry.services.find(s => s.serviceName === serviceName);
        if (!serviceEntry) return {};

        // 3. Crear el mapa de disponibilidad (Date -> [Slots])
        return serviceEntry.availability.reduce((acc, entry) => {
            // Aseguramos que la fecha sea una clave válida
            if (entry.date) {
                acc[entry.date] = entry.slots;
            }
            return acc;
        }, {});
    }, [clinicName, serviceName]); 
};

// --- COMPONENTE PRINCIPAL ---

// 💡 CAMBIO CLAVE: Agregamos onAppointmentBooked a las props
const ServiceQuickViewModalLg = ({ service, onClose, onAppointmentBooked }) => {
    if (!service) return null;

    const addAppointment = useAppointmentStore(state => state.addAppointment);

    // 💡 Obtener el mapa de disponibilidad filtrado por Clínica y Servicio
    const availabilityMap = useFilteredAvailabilityMap(service.clinicName, service.name);
    
    // 🌟 ESTADOS PARA AGENDAMIENTO 🌟
    // NOTA: Asumo que el objeto 'service' ya trae 'clinicName'
    const [selectedClinic, setSelectedClinic] = useState(service.clinicName || 'Clínica Principal'); 
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [step, setStep] = useState(1); // 1: Info, 2: Disponibilidad, 3: Confirmación

    // Obtiene las fechas disponibles (las claves del mapa)
    const availableDates = Object.keys(availabilityMap);

    // Obtiene los slots disponibles para la fecha seleccionada
    const availableSlots = selectedDate ? availabilityMap[selectedDate] || [] : [];
    
    // Simulación de clínicas disponibles (basado en el nombre único del servicio)
    // Se mantiene la estructura para posible expansión futura, aunque aquí solo usemos el nombre del servicio.
    const availableClinics = useMemo(() => {
        return [service.clinicName]; 
    }, [service]);


    // ----------------------------------------------------
    // MANEJADORES DE PASOS DEL FLUJO
    // ----------------------------------------------------

    const handleCheckAvailability = () => {
        setStep(2); // Avanza al paso 2: Selección de fecha y hora
    };

    const handleSelectSlot = (date, slot) => {
        setSelectedDate(date);
        setSelectedSlot(slot);
        setStep(3); // Avanza al paso 3: Confirmación
    };

    const handleConfirmBooking = (e) => {
        e.preventDefault();
        
        const newAppointment = {
            id: Date.now(), 
            serviceId: service.id,
            serviceName: service.name,
            clinicName: selectedClinic,
            date: selectedDate,
            time: selectedSlot.time,
            professional: selectedSlot.professional,
            status: 'Pending',
        };

        addAppointment(newAppointment); 

        console.log("Cita Confirmada y Almacenada:", newAppointment);
        
        // 🚀 CAMBIO APLICADO: Llama a onAppointmentBooked para manejar la navegación.
        // Se asume que esta función en el padre cerrará el modal y navegará a AppointmentManagerLg.
        if (onAppointmentBooked) {
            onAppointmentBooked();
        } else {
            // Fallback si no se pasa la prop de navegación
            alert(`Cita agendada para ${service.name} en ${selectedClinic} el ${selectedDate} a las ${selectedSlot.time}.`);
            onClose();
        }
    };


    // ----------------------------------------------------
    // LÓGICA DE RENDERIZADO CONDICIONAL POR PASO
    // ----------------------------------------------------
    const renderStepContent = () => {
        switch (step) {
            case 1: 
                return (
                    <>
                        <section aria-labelledby="description-heading" className="mt-15">
                            <h3 id="description-heading" className="text-lg font-medium text-gray-900">
                                Descripción
                            </h3>
                            <div className="mt-2 space-y-3 text-sm text-gray-600">
                                <p>{service.description}</p>
                            </div>
                        </section>

                        <section aria-labelledby="options-heading" className="mt-6">
                            <h3 id="options-heading" className="sr-only">Opciones del servicio</h3>

                            <button
                                type="button"
                                onClick={handleCheckAvailability}
                                // 🚨 CLASES DE COLOR PERSONALIZADAS: 
                                // Asegúrate de definir 'acento-primario' y 'acento-secundario' en tu tailwind.config.js
                                className="mt-20 flex w-full items-center justify-center rounded-lg border border-transparent bg-acento-primario px-8 py-3 text-base font-bold text-white shadow-md hover:bg-acento-secundario transition-colors focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-hidden active:scale-[0.99]"
                            >
                                <FaCalendarAlt className="mr-3 size-5" />
                                <span>Agendar Cita</span>
                            </button>


                        </section>
                    </>
                );

            case 2: // Selección de Fecha y Hora
                return (
                    <div className="pt-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Elegir Fecha y Hora para {selectedClinic}
                        </h3>
                        
                        {/* Selector de Fecha (Ahora usa availableDates filtradas) */}
                        <div className="mt-10">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Seleccionar Fecha Disponible
                            </label>
                            <select
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedSlot(null); // Reset slot al cambiar fecha
                                }}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Elige un día</option>
                                {/* Mapeamos las fechas disponibles filtradas */}
                                {availableDates.map(date => (
                                    <option key={date} value={date}>
                                        {new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Listado de Horarios Disponibles (Slots) */}
                        {selectedDate && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-900 mb-2">
                                    Horarios y Doctores Disponibles en {selectedClinic}:
                                </p>
                                {availableSlots.length > 0 ? (
                                    <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto pr-2 border-t pt-3">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot.time + slot.professional}
                                                type="button"
                                                onClick={() => handleSelectSlot(selectedDate, slot)}
                                                // 🚨 CLASES DE COLOR PERSONALIZADAS: 
                                                className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-150 bg-white text-acento-primario border-acento-primario hover:bg-indigo-50 hover:shadow-md flex items-center"
                                            >
                                                <FaUserMd className="mr-2 size-4 text-gray-500" />
                                                {slot.time} - {slot.professional.split(' ')[1]}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No hay horarios disponibles para esta fecha.</p>
                                )}
                            </div>
                        )}

                        <button
                        type="button"
                        onClick={() => setStep(1)}
                        // 🚨 CLASES DE COLOR PERSONALIZADAS: 
                        className="mt-8 flex items-center gap-2 text-sm text-acento-terciario hover:text-sombra-sutil font-bold transition-colors"
                        >
                        <FaArrowLeft className="text-lg" />
                        Volver a Detalles
                        </button>
                    </div>
                );

            case 3: // Confirmación
                return (
                    <form onSubmit={handleConfirmBooking} className="pt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-bold text-acento-secundario mb-4">
                            Confirmación de Cita
                        </h3>
                        <p className="text-gray-700 mb-2 font-semibold">Servicio: {service.name}</p>
                        <p className="text-gray-700 mb-2 font-semibold">Clínica: {selectedClinic}</p>
                        <p className="text-gray-700 mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-500" />
                            <span className='font-bold'>Fecha y Hora: {selectedDate} a las {selectedSlot.time}</span> 
                        </p>
                        <p className="text-gray-700 mb-6 flex items-center">
                            <FaUserMd className="mr-2 text-gray-500" />
                            <span className='font-bold'>Profesional: {selectedSlot.professional}</span>
                        </p>

                        <div className="flex justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-1/2 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Modificar
                            </button>
                            <button
                                type="submit"
                                // 🚨 CLASES DE COLOR PERSONALIZADAS: Usa 'acento-cuaternario' y su hover específico
                                className="w-1/2 py-3 rounded-lg border border-transparent bg-acento-cuaternario text-base font-bold text-white shadow-md hover:bg-[#d33d56] transition-colors"
                            >
                                ¡Confirmar Agendamiento!
                            </button>
                        </div>
                    </form>
                );

            default:
                return null;
        }
    };


    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-gray-900/75 transition-opacity" aria-hidden="true" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4 text-center md:items-center md:px-2 lg:px-4">
                <div className="relative flex w-full max-w-lg transform items-center overflow-hidden rounded-xl bg-white px-4 pt-14 pb-8 shadow-2xl transition-all sm:px-6 sm:pt-8 md:p-6 lg:max-w-4xl lg:p-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8 z-10 p-2 rounded-full bg-white transition-colors shadow-md"
                        aria-label="Cerrar vista rápida"
                    >
                        <FaTimes aria-hidden="true" className="size-6" />
                    </button>

                    <div className="grid w-full grid-cols-1 items-start lg:grid-cols-12 lg:gap-x-8">

                        <img
                            alt={service.imageAlt || service.name}
                            src={service.imageUrl}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5 shadow-lg"
                        />

                        <div className="mt-6 sm:mt-0 sm:col-span-8 lg:col-span-7">
                            <span className="text-sm font-semibold text-blue-600 mb-1 block">
                                {service.clinicName || "Clínica Veterinaria"}
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 sm:pr-12">{service.name}</h2>
                            
                            {/* CLAVE: Renderiza el contenido según el paso */}
                            {renderStepContent()}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceQuickViewModalLg;