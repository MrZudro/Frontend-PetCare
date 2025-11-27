import React, { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaCalendarAlt, FaUserMd, FaArrowLeft, FaClinicMedical } from 'react-icons/fa';
import api from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ServiceQuickViewModalLg = ({ service, onClose, onAppointmentBooked }) => {
    const { user } = useAuth();

    // Steps: 1=Info, 2=Clinic, 3=Employee, 4=Date/Slot, 5=Confirm
    const [step, setStep] = useState(1);

    // Selection State
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Reset state when step changes backwards
    useEffect(() => {
        if (step < 3) setSelectedEmployee(null);
        if (step < 4) {
            setSelectedDate('');
            setAvailableSlots([]);
            setSelectedSlot(null);
        }
    }, [step]);

    // Fetch Employees when Clinic is selected
    useEffect(() => {
        if (selectedClinic) {
            const fetchEmployees = async () => {
                try {
                    const response = await api.get(`/employees/clinic/${selectedClinic.id}`);
                    setEmployees(response.data);
                    // If only one employee, auto-select? Maybe better to let user choose.
                } catch (error) {
                    console.error("Error fetching employees", error);
                    toast.error("Error al cargar veterinarios");
                }
            };
            fetchEmployees();
        }
    }, [selectedClinic]);

    // Generate Slots when Date and Employee are selected
    useEffect(() => {
        if (selectedDate && selectedEmployee) {
            fetchSlots();
        }
    }, [selectedDate, selectedEmployee]);

    const fetchSlots = async () => {
        setLoadingSlots(true);
        setAvailableSlots([]);
        try {
            const dateObj = new Date(selectedDate);
            // Get day name in English for API (MONDAY, TUESDAY...)
            const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
            const dayName = days[dateObj.getUTCDay()]; // Use UTC to avoid timezone shifts

            // 1. Get Schedule
            const scheduleRes = await api.get(`/schedules/employee/${selectedEmployee.id}/day/${dayName}`);
            const schedules = scheduleRes.data;

            if (schedules.length === 0) {
                setAvailableSlots([]);
                setLoadingSlots(false);
                return;
            }

            // 2. Get Existing Appointments
            const appointmentsRes = await api.get(`/appointments/employee/${selectedEmployee.id}`);
            const existingAppointments = appointmentsRes.data.filter(app => app.appointmentDateTime.startsWith(selectedDate));

            // 3. Generate Slots
            const slots = [];
            schedules.forEach(sch => {
                let current = new Date(`${selectedDate}T${sch.startTime}`);
                const end = new Date(`${selectedDate}T${sch.endTime}`);

                while (current < end) {
                    const timeString = current.toTimeString().substring(0, 5);

                    // Check collision
                    const isTaken = existingAppointments.some(app => {
                        const appTime = app.appointmentDateTime.split('T')[1].substring(0, 5);
                        return appTime === timeString && app.status !== 'CANCELLED';
                    });

                    if (!isTaken) {
                        slots.push(timeString);
                    }

                    // Increment 30 mins
                    current.setMinutes(current.getMinutes() + 30);
                }
            });

            setAvailableSlots(slots.sort());

        } catch (error) {
            console.error("Error calculating slots", error);
            toast.error("Error al calcular horarios");
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.warning("Debes iniciar sesión para agendar.");
            return;
        }

        setBookingLoading(true);
        try {
            const payload = {
                customerId: user.id, // Assuming user object has id
                veterinaryClinicId: selectedClinic.id,
                employeeId: selectedEmployee.id,
                appointmentDateTime: `${selectedDate}T${selectedSlot}:00`,
                reason: `Cita para ${service.name}`
            };

            await api.post('/appointments', payload);
            toast.success("¡Cita agendada con éxito!");
            if (onAppointmentBooked) onAppointmentBooked();
            onClose();
        } catch (error) {
            console.error("Error booking", error);
            toast.error("Error al agendar la cita. Intenta nuevamente.");
        } finally {
            setBookingLoading(false);
        }
    };

    // --- RENDER HELPERS ---

    const renderStep1_Info = () => (
        <>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <button
                onClick={() => {
                    if (service.clinics && service.clinics.length === 1) {
                        setSelectedClinic(service.clinics[0]);
                        setStep(3); // Skip clinic selection if only one
                    } else {
                        setStep(2);
                    }
                }}
                className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition shadow-md flex items-center justify-center gap-2"
            >
                <FaCalendarAlt /> Agendar Cita
            </button>
        </>
    );

    const renderStep2_Clinic = () => (
        <div>
            <h3 className="text-lg font-bold mb-4">Selecciona una Clínica</h3>
            <div className="space-y-3">
                {service.clinics && service.clinics.map(clinic => (
                    <button
                        key={clinic.id}
                        onClick={() => {
                            setSelectedClinic(clinic);
                            setStep(3);
                        }}
                        className="w-full p-4 border rounded-lg hover:bg-pink-50 hover:border-pink-500 transition flex items-center gap-3 text-left"
                    >
                        <FaClinicMedical className="text-pink-500" />
                        <span className="font-medium">{clinic.name}</span>
                    </button>
                ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <FaArrowLeft /> Volver
            </button>
        </div>
    );

    const renderStep3_Employee = () => (
        <div>
            <h3 className="text-lg font-bold mb-4">Selecciona un Profesional</h3>
            {employees.length === 0 ? (
                <p className="text-gray-500">Cargando veterinarios...</p>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {employees.map(emp => (
                        <button
                            key={emp.id}
                            onClick={() => {
                                setSelectedEmployee(emp);
                                setStep(4);
                            }}
                            className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition flex items-center gap-3"
                        >
                            <div className="bg-blue-100 p-2 rounded-full">
                                <FaUserMd className="text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-800">{emp.names} {emp.lastNames}</p>
                                <p className="text-xs text-gray-500">{emp.cargo}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            <button onClick={() => setStep(service.clinics.length > 1 ? 2 : 1)} className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <FaArrowLeft /> Volver
            </button>
        </div>
    );

    const renderStep4_DateSlot = () => (
        <div>
            <h3 className="text-lg font-bold mb-4">Fecha y Hora</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                />
            </div>

            {selectedDate && (
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Horarios Disponibles:</p>
                    {loadingSlots ? (
                        <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div></div>
                    ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                            {availableSlots.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => {
                                        setSelectedSlot(slot);
                                        setStep(5);
                                    }}
                                    className="px-2 py-1 text-sm border rounded hover:bg-pink-500 hover:text-white transition"
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-red-500">No hay horarios disponibles para este día.</p>
                    )}
                </div>
            )}

            <button onClick={() => setStep(3)} className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <FaArrowLeft /> Volver
            </button>
        </div>
    );

    const renderStep5_Confirm = () => (
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Cita</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-6 text-sm">
                <p><span className="font-bold">Servicio:</span> {service.name}</p>
                <p><span className="font-bold">Clínica:</span> {selectedClinic?.name}</p>
                <p><span className="font-bold">Profesional:</span> {selectedEmployee?.names} {selectedEmployee?.lastNames}</p>
                <p><span className="font-bold">Fecha:</span> {selectedDate}</p>
                <p><span className="font-bold">Hora:</span> {selectedSlot}</p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => setStep(4)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Modificar
                </button>
                <button
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="flex-1 py-2 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 disabled:opacity-50"
                >
                    {bookingLoading ? 'Agendando...' : 'Confirmar'}
                </button>
            </div>
        </div>
    );

    if (!service) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">

                    {/* Header Image */}
                    <div className="h-32 bg-gray-200 relative">
                        <img
                            src={service.imageUrl || "https://via.placeholder.com/400x200"}
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white transition"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{service.name}</h2>
                        <p className="text-sm text-blue-600 font-medium mb-4">
                            {selectedClinic ? selectedClinic.name : "Selecciona una clínica"}
                        </p>

                        {step === 1 && renderStep1_Info()}
                        {step === 2 && renderStep2_Clinic()}
                        {step === 3 && renderStep3_Employee()}
                        {step === 4 && renderStep4_DateSlot()}
                        {step === 5 && renderStep5_Confirm()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceQuickViewModalLg;