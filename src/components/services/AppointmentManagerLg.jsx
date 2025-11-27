import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaCalendarCheck, FaClock, FaCalendarDay, FaExclamationTriangle } from 'react-icons/fa';
import { appointmentService } from '../../services/appointmentService';

const AppointmentManagerLg = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, PENDING, CONFIRMED, COMPLETED, CANCELLED
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.id) {
                console.error('No hay usuario autenticado');
                return;
            }

            const response = await appointmentService.getByCustomer(user.id);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error al obtener citas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return;

        try {
            setActionLoading(true);
            await appointmentService.cancel(selectedAppointment.id);

            // Actualizar lista
            await fetchAppointments();
            setShowCancelModal(false);
            setSelectedAppointment(null);
        } catch (error) {
            console.error('Error al cancelar cita:', error);
            alert('Error al cancelar la cita. Por favor, intenta nuevamente.');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const configs = {
            PENDING: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                label: 'Pendiente'
            },
            CONFIRMED: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                label: 'Confirmada'
            },
            CANCELLED: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                label: 'Cancelada'
            },
            COMPLETED: {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                border: 'border-gray-300',
                label: 'Completada'
            },
            UNATTENDED: {
                bg: 'bg-orange-100',
                text: 'text-orange-800',
                border: 'border-orange-300',
                label: 'No Atendida'
            }
        };

        const config = configs[status] || configs.PENDING;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                {config.label}
            </span>
        );
    };

    const formatDateTime = (dateTimeString) => {
        try {
            const date = new Date(dateTimeString);
            return {
                date: date.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),
                time: date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
        } catch (error) {
            return { date: 'Fecha inválida', time: '' };
        }
    };

    const canBeCancelled = (appointment) => {
        // Solo se puede cancelar si está en estado PENDING o CONFIRMED
        if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
            return false;
        }

        // Verificar que falten al menos 5 horas
        try {
            const appointmentDate = new Date(appointment.appointmentDateTime);
            const now = new Date();
            const diffHours = (appointmentDate - now) / (1000 * 60 * 60);
            return diffHours > 5;
        } catch (error) {
            return false;
        }
    };

    // Filtrado de citas
    const filteredAppointments = appointments.filter(apt => {
        if (filter === 'all') return true;
        return apt.status === filter;
    });

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full size-16 border-4 border-[#0FC2C0] border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Cargando citas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
                    <FaCalendarCheck className="text-[#0FC2C0] size-8" />
                    Mis Citas
                </h2>
                <p className="text-gray-600">Gestiona tus citas veterinarias</p>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex flex-wrap gap-2">
                {['all', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                            ? 'bg-[#0FC2C0] text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#0FC2C0]'
                            }`}
                    >
                        {status === 'all' ? 'Todas' :
                            status === 'PENDING' ? 'Pendientes' :
                                status === 'CONFIRMED' ? 'Confirmadas' :
                                    status === 'COMPLETED' ? 'Completadas' : 'Canceladas'}
                    </button>
                ))}
            </div>

            {/* Lista de citas */}
            {filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-200">
                    <FaCalendarCheck className="mx-auto size-12 text-gray-300 mb-4" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                        {filter === 'all'
                            ? 'No tienes citas agendadas'
                            : `No tienes citas ${filter === 'PENDING' ? 'pendientes' : filter === 'CONFIRMED' ? 'confirmadas' : filter === 'COMPLETED' ? 'completadas' : 'canceladas'}`}
                    </p>
                    <p className="text-gray-500">
                        {filter === 'all' && 'Agenda una cita desde la página de servicios'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAppointments.map(appointment => {
                        const { date, time } = formatDateTime(appointment.appointmentDateTime);
                        const canCancel = canBeCancelled(appointment);

                        return (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-[#0FC2C0]"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                                {appointment.serviceName}
                                            </h3>
                                            {getStatusBadge(appointment.status)}
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p className="flex items-center gap-2">
                                                <FaClinicMedical className="text-[#0388A6] size-4" />
                                                {appointment.veterinaryClinicName}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FaCalendarDay className="text-[#0388A6] size-4" />
                                                {date}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FaClock className="text-[#0388A6] size-4" />
                                                {time}
                                            </p>
                                            {appointment.employeeName && (
                                                <p className="flex items-center gap-2">
                                                    <FaUserMd className="text-[#0388A6] size-4" />
                                                    {appointment.employeeName}
                                                </p>
                                            )}
                                        </div>

                                        {!canCancel && ['PENDING', 'CONFIRMED'].includes(appointment.status) && (
                                            <div className="mt-2 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded inline-flex">
                                                <FaExclamationTriangle className="size-3" />
                                                No se puede cancelar (faltan menos de 5 horas)
                                            </div>
                                        )}
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedAppointment(appointment);
                                                setShowDetailModal(true);
                                            }}
                                            className="p-3 bg-[#0388A6]/10 text-[#0388A6] hover:bg-[#0388A6]/20 rounded-full transition-colors"
                                            title="Ver Detalles"
                                        >
                                            <FaInfoCircle className="size-4" />
                                        </button>

                                        {canCancel && (
                                            <button
                                                onClick={() => {
                                                    setSelectedAppointment(appointment);
                                                    setShowCancelModal(true);
                                                }}
                                                className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                                title="Cancelar Cita"
                                            >
                                                <FaTrashAlt className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Detalles */}
            {showDetailModal && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FaInfoCircle className="text-[#0388A6] size-6" />
                                Detalles de la Cita
                            </h3>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedAppointment(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Servicio</p>
                                <p className="text-lg font-semibold text-gray-900">{selectedAppointment.serviceName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Clínica</p>
                                <p className="text-lg font-semibold text-gray-900">{selectedAppointment.veterinaryClinicName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Fecha y Hora</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatDateTime(selectedAppointment.appointmentDateTime).date}
                                </p>
                                <p className="text-md text-gray-700">
                                    {formatDateTime(selectedAppointment.appointmentDateTime).time}
                                </p>
                            </div>
                            {selectedAppointment.employeeName && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Profesional</p>
                                    <p className="text-lg font-semibold text-gray-900">{selectedAppointment.employeeName}</p>
                                </div>
                            )}
                            {selectedAppointment.reason && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Razón</p>
                                    <p className="text-gray-700">{selectedAppointment.reason}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-500">Estado</p>
                                <div className="mt-1">
                                    {getStatusBadge(selectedAppointment.status)}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowDetailModal(false);
                                setSelectedAppointment(null);
                            }}
                            className="w-full mt-6 py-3 bg-[#0388A6] hover:bg-[#024059] text-white font-bold rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Cancelación */}
            {showCancelModal && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="mx-auto size-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <FaExclamationTriangle className="text-red-600 size-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancelar Cita</h3>
                            <p className="text-gray-600">
                                ¿Estás seguro de que deseas cancelar esta cita?
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                            <p className="text-sm"><span className="font-semibold">Servicio:</span> {selectedAppointment.serviceName}</p>
                            <p className="text-sm"><span className="font-semibold">Fecha:</span> {formatDateTime(selectedAppointment.appointmentDateTime).date}</p>
                            <p className="text-sm"><span className="font-semibold">Hora:</span> {formatDateTime(selectedAppointment.appointmentDateTime).time}</p>
                        </div>

                        <p className="text-sm text-red-600 mb-6 text-center">
                            Esta acción no se puede deshacer
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedAppointment(null);
                                }}
                                className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                disabled={actionLoading}
                            >
                                No, mantener
                            </button>
                            <button
                                onClick={handleCancelAppointment}
                                disabled={actionLoading}
                                className="flex-1 py-3 bg-[#BF0436] hover:bg-[#F2055C] text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {actionLoading ? 'Cancelando...' : 'Sí, cancelar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FaClinicMedical = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M232 224h56v56c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-56h56c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8h-56v-56c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v56h-56c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM544 128V384c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V128c0-35.3 28.7-64 64-64h320c35.3 0 64 28.7 64 64zm-64 0H160v256h320V128z" />
    </svg>
);

const FaUserMd = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136 32-96h-96l32 96-32 136-47.8-191.4C60.2 263.9 0 320.9 0 391.8V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-72.2c0-70.9-60.2-127.9-128.2-103.2z" />
    </svg>
);

export default AppointmentManagerLg;