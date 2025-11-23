import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaClock, FaUser, FaPaw } from 'react-icons/fa';

// Mock Data
const MOCK_APPOINTMENTS = [
    { id: 1, day: 'Lunes', time: '08:00', client: 'Juan Perez', pet: 'Max', type: 'Consulta General', status: 'Pendiente' },
    { id: 2, day: 'Lunes', time: '10:30', client: 'Maria Gomez', pet: 'Luna', type: 'Vacunación', status: 'Confirmada' },
    { id: 3, day: 'Martes', time: '09:00', client: 'Carlos Ruiz', pet: 'Rocky', type: 'Cirugía', status: 'Confirmada' },
    { id: 4, day: 'Miércoles', time: '14:00', client: 'Ana Diaz', pet: 'Coco', type: 'Consulta General', status: 'Pendiente' },
    { id: 5, day: 'Jueves', time: '11:00', client: 'Luis Torres', pet: 'Simba', type: 'Revisión', status: 'Completada' },
    { id: 6, day: 'Viernes', time: '16:00', client: 'Sofia Lopez', pet: 'Nala', type: 'Vacunación', status: 'Pendiente' },
    { id: 7, day: 'Sábado', time: '09:30', client: 'Pedro Gil', pet: 'Toby', type: 'Consulta General', status: 'Confirmada' },
];

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00

const Agenda = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

    const getAppointmentsForDay = (day) => {
        return MOCK_APPOINTMENTS.filter(app => app.day === day);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Agenda Semanal</h2>
                    <p className="text-gray-500">Visualiza y gestiona tus citas de la semana.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                        <FaChevronLeft />
                    </button>
                    <span className="font-semibold text-gray-700 self-center px-2">Semana Actual</span>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Header Row */}
                <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50">
                    {DAYS.map(day => (
                        <div key={day} className="py-4 text-center font-semibold text-gray-700 border-r border-gray-100 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-6 min-h-[600px]">
                        {DAYS.map(day => (
                            <div key={day} className="border-r border-gray-100 last:border-r-0 p-2 space-y-3 min-h-[200px]">
                                {getAppointmentsForDay(day).map(app => (
                                    <div
                                        key={app.id}
                                        className={`p-3 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer
                      ${app.status === 'Confirmada' ? 'bg-green-50 border-green-500' :
                                                app.status === 'Pendiente' ? 'bg-yellow-50 border-yellow-500' :
                                                    'bg-blue-50 border-blue-500'}`}
                                    >
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-1">
                                            <FaClock /> {app.time}
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm">{app.type}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                            <FaUser className="text-[10px]" /> {app.client}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <FaPaw className="text-[10px]" /> {app.pet}
                                        </div>
                                    </div>
                                ))}
                                {getAppointmentsForDay(day).length === 0 && (
                                    <div className="h-full flex items-center justify-center text-gray-300 text-sm italic">
                                        Sin citas
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Agenda;
