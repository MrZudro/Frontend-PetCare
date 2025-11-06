// src/components/services/AppointmentManagerLg.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaCalendarCheck, FaClock, FaCalendarDay } from 'react-icons/fa';
// 💡 Importamos el hook para acceder y modificar las citas
import { useAppointmentStore } from '../services/useAppointmentStore';

// 🚀 Importamos los datos de disponibilidad y citas ocupadas (simulación)
import mockAvailabilityData from '../Data/availability.json'; 
import occupiedAppointments from '../Data/appointments.json'; 

// ------------------- FUNCIÓN DE UTILIDAD DE HORA -------------------

/**
 * Convierte una hora en formato militar (HH:MM) a formato de 12 horas (h:mm AM/PM).
 * @param {string} militaryTime - La hora en formato "HH:MM".
 * @returns {string} La hora en formato "h:mm AM" o "h:mm PM".
 */
const formatMilitaryTo12Hour = (militaryTime) => {
    if (!militaryTime || militaryTime.length !== 5) return '';
    const [hours, minutes] = militaryTime.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; // Convierte 0 a 12 (medianoche) y 12 a 12 (mediodía)
    const minuteStr = String(minutes).padStart(2, '0');
    return `${hour12}:${minuteStr} ${period}`;
};

// ------------------- COMPONENTES MODAL (Mantenidos) -------------------

// Modal de Confirmación Genérico (Para Cancelación)
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Aceptar', confirmButtonClass = 'bg-red-600 hover:bg-red-700' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/75 p-4">
            <div className="bg-white rounded-lg p-6 shadow-2xl max-w-sm w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        No, mantener cita
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal de Detalle de Cita (La hora aquí también se convierte)
const DetailModal = ({ appointment, onClose }) => {
    if (!appointment) return null;
    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-gray-900/50 p-4">
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full">
                <h3 className="text-2xl font-bold text-indigo-600 mb-4 flex items-center">
                    <FaInfoCircle className="mr-3" />
                    Detalles de la Cita
                </h3>
                <p className="mb-2"><span className="font-semibold">Servicio:</span> {appointment.serviceName}</p>
                <p className="mb-2"><span className="font-semibold">Clínica:</span> {appointment.clinicName}</p>
                <p className="mb-2"><span className="font-semibold">Fecha:</span> {appointment.date}</p>
                <p className="mb-2">
                    <span className="font-semibold">Hora:</span> 
                    {formatMilitaryTo12Hour(appointment.time)} 
                </p>
                <p className="mb-4"><span className="font-semibold">Profesional:</span> {appointment.professional}</p>
                <button
                    onClick={onClose}
                    className="w-full py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

// --- HOOK DE DISPONIBILIDAD (Sin cambios en lógica, solo en datos que maneja) ---

const useAvailableSlotsForEditing = (clinicName, serviceName, appointmentToExclude) => {
    return useMemo(() => {
        const clinicEntry = mockAvailabilityData.find(c => c.clinicName === clinicName);
        if (!clinicEntry) return {};

        const serviceEntry = clinicEntry.services.find(s => s.serviceName === serviceName);
        if (!serviceEntry) return {};

        const occupiedSlots = new Set();
        occupiedAppointments.forEach(appt => {
            const isCurrentAppointmentSlot = appointmentToExclude && 
                                             appt.id === appointmentToExclude.id &&
                                             appt.date === appointmentToExclude.date &&
                                             appt.time === appointmentToExclude.time;

            if (appt.clinicName === clinicName && appt.serviceName === serviceName && !isCurrentAppointmentSlot) {
                occupiedSlots.add(`${appt.date}|${appt.time}|${appt.professional}`);
            }
        });

        return serviceEntry.availability.reduce((acc, entry) => {
            const date = entry.date;
            
            const availableSlotsForDate = entry.slots.filter(slot => {
                const slotKey = `${date}|${slot.time}|${slot.professional}`;
                return !occupiedSlots.has(slotKey);
            });

            if (availableSlotsForDate.length > 0) {
                acc[date] = availableSlotsForDate;
            }
            return acc;
        }, {});

    }, [clinicName, serviceName, appointmentToExclude]); 
};

// ------------------- MODAL DE MODIFICACIÓN (Actualizado para mostrar 12 horas) -------------------

const ModificationModal = ({ appointment, onClose, onSave }) => {
    
    const availabilityMap = useAvailableSlotsForEditing(
        appointment?.clinicName, 
        appointment?.serviceName, 
        appointment 
    );
    const availableDates = Object.keys(availabilityMap);

    const originalSlotStillAvailable = 
        availabilityMap[appointment?.date]?.some(slot => 
            slot.time === appointment?.time && slot.professional === appointment?.professional
        );

    const [selectedDate, setSelectedDate] = useState(originalSlotStillAvailable ? appointment.date : '');
    const [selectedSlot, setSelectedSlot] = useState(originalSlotStillAvailable ? {
        time: appointment.time, // Guardamos siempre el formato militar
        professional: appointment.professional,
    } : null);
    
    const [confirmModification, setConfirmModification] = useState(false);

    useEffect(() => {
        if (selectedDate && !availabilityMap[selectedDate]) {
            setSelectedDate('');
            setSelectedSlot(null);
        }
    }, [availabilityMap]);


    if (!appointment) return null;
    
    const slotsForSelectedDate = availabilityMap[selectedDate] || [];

    // Lógica de Confirmación
    if (confirmModification) {
        const finalDate = selectedDate;
        const finalTime = selectedSlot?.time; // Usamos el formato militar para guardar
        const finalProfessional = selectedSlot?.professional;

        return (
            <ConfirmationModal
                isOpen={true}
                title="Confirmar Modificación"
                // Mostramos 12 horas en el mensaje de confirmación
                message={`¿Deseas modificar la cita para el ${finalDate} a las ${formatMilitaryTo12Hour(finalTime)} con ${finalProfessional}?`}
                onConfirm={() => {
                    if (selectedSlot) {
                        onSave({ 
                            ...appointment, 
                            date: finalDate, 
                            time: finalTime,
                            professional: finalProfessional 
                        });
                    }
                    setConfirmModification(false);
                    onClose();
                }}
                onCancel={() => setConfirmModification(false)}
                confirmText="Guardar Cambios"
                confirmButtonClass="bg-indigo-600 hover:bg-indigo-700"
            />
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDate && selectedSlot) {
            setConfirmModification(true);
        } else {
            alert('Por favor, selecciona una fecha y un horario disponibles.');
        }
    };

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-gray-900/50 p-4">
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full">
                <h3 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center">
                    <FaEdit className="mr-3" />
                    Modificar Cita
                </h3>
                <p className="text-sm text-gray-600 mb-4">Servicio: {appointment.serviceName} en {appointment.clinicName}</p>

                <form onSubmit={handleSubmit}>
                    {/* Selector de Fecha (Sin cambios) */}
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
                             <FaCalendarDay className='mr-2' /> Nueva Fecha
                        </label>
                        <select
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedSlot(null);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        >
                            <option value="">Seleccione una nueva fecha</option>
                            {availableDates.map(date => (
                                <option key={date} value={date}>
                                    {new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                                </option>
                            ))}
                        </select>
                         {availableDates.length === 0 && (
                            <p className="text-red-500 text-xs mt-1">No hay fechas disponibles para este servicio.</p>
                        )}
                    </div>

                    {/* Selector de Horario (ACTUALIZADO para mostrar 12 horas) */}
                    {selectedDate && (
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
                                <FaClock className='mr-2' /> Nuevo Horario
                            </label>
                             <div className="flex flex-wrap gap-2">
                                {slotsForSelectedDate.length > 0 ? (
                                    slotsForSelectedDate.map(slot => {
                                        const isSelected = selectedSlot && 
                                                           slot.time === selectedSlot.time && 
                                                           slot.professional === selectedSlot.professional;
                                        
                                        const isOriginal = appointment.date === selectedDate && 
                                                           appointment.time === slot.time && 
                                                           appointment.professional === slot.professional;

                                        return (
                                            <button
                                                key={slot.time + slot.professional}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors 
                                                    ${isSelected 
                                                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' 
                                                        : 'bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50'
                                                    }`}
                                            >
                                                {/* CONVERSIÓN AQUÍ */}
                                                {formatMilitaryTo12Hour(slot.time)} - {slot.professional.split(' ')[0]} {isOriginal && ' (Actual)'}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-sm">No hay horarios disponibles para esta fecha.</p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedDate || !selectedSlot}
                            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            Ver Confirmación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ------------------- COMPONENTE PRINCIPAL (ACTUALIZADO para mostrar 12 horas en el listado) -------------------

const AppointmentManagerLg = () => {
    const appointments = useAppointmentStore(state => state.appointments);
    const removeAppointment = useAppointmentStore(state => state.removeAppointment); 
    const updateAppointment = useAppointmentStore(state => state.updateAppointment);
    
    const [detailModal, setDetailModal] = useState(null);
    const [modificationModal, setModificationModal] = useState(null);
    const [cancelConfirmModal, setCancelConfirmModal] = useState(null);

    // Lógica de 5 horas para cancelación (Validación)
    const canBeCancelled = (appointment) => {
        const [year, month, day] = appointment.date.split('-').map(Number);
        const [hour, minute] = appointment.time.split(':').map(Number);
        const appointmentDateTime = new Date(year, month - 1, day, hour, minute);
        const now = new Date();
        const diffMilliseconds = appointmentDateTime - now;
        const diffHours = diffMilliseconds / (1000 * 60 * 60);
        return diffHours > 5;
    };

    // Manejadores
    const handleCancel = (appointment) => {
        if (!canBeCancelled(appointment)) {
            alert("⚠️ No se puede cancelar la cita: deben faltar al menos 5 horas para el servicio.");
            return;
        }
        setCancelConfirmModal(appointment);
    };

    const confirmCancel = () => {
        if (cancelConfirmModal) {
            removeAppointment(cancelConfirmModal.id);
            console.log(`Cita ${cancelConfirmModal.id} cancelada.`);
            setCancelConfirmModal(null);
        }
    };

    const handleModify = (appointment) => {
        setModificationModal(appointment);
    };

    const handleSaveModification = (modifiedAppointment) => {
        updateAppointment(modifiedAppointment);
        console.log(`Cita ${modifiedAppointment.id} modificada.`);
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg border">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                <FaCalendarCheck className="mr-3 text-indigo-600" />
                Mis Solicitudes de Servicio
            </h2>

            {appointments.length === 0 ? (
                <div className="p-10 text-center bg-gray-50 rounded-lg border-dashed border-2 border-gray-300">
                    <p className="text-xl font-semibold text-gray-700">
                        No tienes citas agendadas actualmente. 🥳
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map(appointment => (
                        <div key={appointment.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-indigo-500">
                            <div className="flex-1 min-w-0">
                                <p className="text-lg font-bold text-gray-900 truncate">{appointment.serviceName}</p>
                                <p className="text-sm text-gray-500">
                                    {appointment.clinicName} | {appointment.date} a las {formatMilitaryTo12Hour(appointment.time)}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                {/* Botones */}
                                <button
                                    onClick={() => setDetailModal(appointment)}
                                    className="p-3 text-indigo-600 hover:text-indigo-800 rounded-full bg-indigo-50 transition-colors"
                                    title="Ver Detalles"
                                >
                                    <FaInfoCircle className="size-5" />
                                </button>
                                <button
                                    onClick={() => handleModify(appointment)}
                                    className="p-3 text-yellow-600 hover:text-yellow-800 rounded-full bg-yellow-50 transition-colors"
                                    title="Modificar Cita"
                                >
                                    <FaEdit className="size-5" />
                                </button>
                                <button
                                    onClick={() => handleCancel(appointment)}
                                    className="p-3 text-red-600 hover:text-red-800 rounded-full bg-red-50 transition-colors disabled:opacity-50"
                                    title="Cancelar Cita"
                                    disabled={!canBeCancelled(appointment)}
                                >
                                    <FaTrashAlt className="size-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modales */}
            <DetailModal appointment={detailModal} onClose={() => setDetailModal(null)} />
            <ModificationModal
                appointment={modificationModal}
                onClose={() => setModificationModal(null)}
                onSave={handleSaveModification}
            />
            <ConfirmationModal
                isOpen={!!cancelConfirmModal}
                title="Confirmar Cancelación"
                // Mostramos 12 horas en el modal de cancelación
                message={`¿Estás seguro de que deseas cancelar la cita para "${cancelConfirmModal?.serviceName}" el ${cancelConfirmModal?.date} a las ${formatMilitaryTo12Hour(cancelConfirmModal?.time)}? Esta acción no se puede deshacer. (Política: 5 horas mínimo)`}
                onConfirm={confirmCancel}
                onCancel={() => setCancelConfirmModal(null)}
                confirmText="Sí, Cancelar Cita"
            />
        </div>
    );
};

export default AppointmentManagerLg;