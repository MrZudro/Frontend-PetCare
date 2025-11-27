import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaUserMd, FaArrowLeft, FaClinicMedical, FaCheck } from 'react-icons/fa';
import { appointmentService, scheduleService, generateAvailableSlots } from '../../services/appointmentService';

const ServiceQuickViewModalLg = ({ service, onClose, onAppointmentBooked }) => {
    // Estados para el flujo multi-paso
    const [step, setStep] = useState(1); // 1: Info, 2: Clinic, 3: Date, 4: Time, 5: Confirm, 6: Success

    // Estados de selección
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Estados de carga y error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auto-seleccionar clínica si solo hay una
    useEffect(() => {
        if (service?.clinics?.length === 1 && step === 1) {
            setSelectedClinic(service.clinics[0]);
        }
    }, [service, step]);

    // Generar slots disponibles cuando se selecciona fecha
    useEffect(() => {
        if (selectedDate && selectedClinic) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
            setSelectedSlot(null);
        }
    }, [selectedDate, selectedClinic]);

    const fetchAvailableSlots = async () => {
        setLoading(true);
        setError(null);

        try {
            // Obtener horarios de todos los veterinarios
            const schedulesRes = await scheduleService.getAll();
            const schedules = schedulesRes.data;

            // Obtener citas ya agendadas
            const appointmentsRes = await appointmentService.getAll();
            const appointments = appointmentsRes.data;

            // Generar slots disponibles
            const slots = generateAvailableSlots(
                schedules,
                appointments,
                selectedDate,
                30 // 30 minutos por slot
            );

            setAvailableSlots(slots);
        } catch (err) {
            console.error('Error al obtener horarios:', err);
            setError('Error al cargar horarios disponibles');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        setLoading(true);
        setError(null);

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.id) {
                setError('Debes iniciar sesión para agendar una cita');
                return;
            }

            const appointmentData = {
                customerId: user.id,
                veterinaryClinicId: selectedClinic.id,
                serviceId: service.id,
                appointmentDateTime: `${selectedDate}T${selectedSlot.time}:00`,
                reason: `Solicitud de ${service.name}`
            };

            await appointmentService.create(appointmentData);
            setStep(6); // Mostrar pantalla de éxito

            // Notificar al padre después de 2 segundos
            setTimeout(() => {
                if (onAppointmentBooked) onAppointmentBooked();
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Error al crear cita:', err);
            setError(err.response?.data?.message || 'Error al agendar la cita. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Renderizado condicional por paso
    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed">{service.description}</p>

                        {service.clinics && service.clinics.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-1">Disponible en:</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {service.clinics.map((clinic, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <FaClinicMedical className="text-primary mr-2 size-3" />
                                            {clinic.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                if (service.clinics?.length === 1) {
                                    setSelectedClinic(service.clinics[0]);
                                    setStep(3);
                                } else {
                                    setStep(2);
                                }
                            }}
                            className="w-full py-3 px-4 bg-[#F2055C] hover:bg-[#BF0436] text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaCalendarAlt />
                            Agendar Cita
                        </button>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Selecciona una Clínica</h3>
                        <div className="space-y-3">
                            {service.clinics && service.clinics.map(clinic => (
                                <button
                                    key={clinic.id}
                                    onClick={() => {
                                        setSelectedClinic(clinic);
                                        setStep(3);
                                    }}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#0FC2C0] hover:bg-[#0FC2C0]/5 transition-all flex items-center gap-3 text-left group"
                                >
                                    <div className="bg-[#0FC2C0]/10 group-hover:bg-[#0FC2C0]/20 p-3 rounded-full transition-colors">
                                        <FaClinicMedical className="text-[#0FC2C0] size-5" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{clinic.name}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(1)}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
                        >
                            <FaArrowLeft />
                            Volver
                        </button>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Selecciona Fecha</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ¿Cuándo deseas tu cita?
                            </label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0FC2C0] focus:ring-2 focus:ring-[#0FC2C0]/20 transition-all outline-none"
                            />
                        </div>

                        {selectedDate && (
                            <button
                                onClick={() => availableSlots.length > 0 && setStep(4)}
                                disabled={loading || availableSlots.length === 0}
                                className="w-full py-3 bg-[#0388A6] hover:bg-[#024059] text-white font-bold rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Cargando horarios...' :
                                    availableSlots.length === 0 ? 'No hay horarios disponibles' :
                                        'Continuar'}
                            </button>
                        )}

                        <button
                            onClick={() => setStep(service.clinics?.length > 1 ? 2 : 1)}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
                        >
                            <FaArrowLeft />
                            Volver
                        </button>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Selecciona Hora</h3>

                        <p className="text-sm text-gray-600">
                            Horarios disponibles para el {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full size-12 border-4 border-[#0FC2C0] border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2">
                                {availableSlots.map(slot => (
                                    <button
                                        key={slot.time}
                                        onClick={() => {
                                            setSelectedSlot(slot);
                                            setStep(5);
                                        }}
                                        className="px-3 py-2 text-sm font-medium border-2 border-[#0FC2C0] text-[#0FC2C0] rounded-lg hover:bg-[#0FC2C0] hover:text-white transition-all"
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setStep(3)}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
                        >
                            <FaArrowLeft />
                            Volver
                        </button>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Cita</h3>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-600">Servicio</span>
                                <span className="text-sm font-bold text-gray-900 text-right">{service.name}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-600">Clínica</span>
                                <span className="text-sm font-bold text-gray-900 text-right">{selectedClinic?.name}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-600">Fecha</span>
                                <span className="text-sm font-bold text-gray-900">
                                    {new Date(selectedDate).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-600">Hora</span>
                                <span className="text-sm font-bold text-gray-900">{selectedSlot?.time}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-[#BF0436] p-3 rounded">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(4)}
                                className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Modificar
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={loading}
                                className="flex-1 py-3 bg-[#F2055C] hover:bg-[#BF0436] text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                            >
                                {loading ? 'Agendando...' : 'Confirmar Cita'}
                            </button>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="text-center py-8 space-y-4">
                        <div className="mx-auto size-20 bg-green-100 rounded-full flex items-center justify-center">
                            <FaCheck className="text-green-600 size-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">¡Cita Agendada!</h3>
                        <p className="text-gray-600">
                            Tu cita ha sido programada exitosamente para el {' '}
                            {new Date(selectedDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long'
                            })} a las {selectedSlot?.time}
                        </p>
                        <p className="text-sm text-gray-500">
                            Recibirás una confirmación por correo electrónico
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!service) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={step !== 6 ? onClose : undefined}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                    {/* Header con imagen */}
                    <div className="relative h-40">
                        <img
                            src={service.imageUrl || 'https://placehold.co/600x400/0FC2C0/FFFFFF?text=Servicio'}
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                        {/* Botón cerrar */}
                        {step !== 6 && (
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors shadow-lg"
                            >
                                <FaTimes className="text-gray-700" />
                            </button>
                        )}

                        {/* Título sobre la imagen */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h2 className="text-2xl font-bold text-white drop-shadow-lg">{service.name}</h2>
                            {selectedClinic && step > 1 && (
                                <p className="text-sm text-white/90 font-medium">{selectedClinic.name}</p>
                            )}
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                        {renderContent()}
                    </div>

                    {/* Progress indicator */}
                    {step > 0 && step < 6 && (
                        <div className="px-6 pb-4">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <div
                                        key={s}
                                        className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-[#0FC2C0]' : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceQuickViewModalLg;