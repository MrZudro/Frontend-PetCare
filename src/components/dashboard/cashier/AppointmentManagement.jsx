import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaPaw, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';

// Mock Data
const MOCK_APPOINTMENTS = [
    { id: 1, date: '2023-11-25', time: '09:00', client: 'Juan Perez', pet: 'Max', status: 'Confirmada', type: 'Consulta' },
    { id: 2, date: '2023-11-25', time: '10:30', client: 'Maria Gomez', pet: 'Luna', status: 'Pendiente', type: 'Vacunación' },
    { id: 3, date: '2023-11-26', time: '14:00', client: 'Carlos Ruiz', pet: 'Rocky', status: 'Cancelada', type: 'Cirugía' },
];

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
    const [filterDate, setFilterDate] = useState('');

    const filteredAppointments = filterDate
        ? appointments.filter(app => app.date === filterDate)
        : appointments;

    const handleStatusChange = (id, newStatus) => {
        setAppointments(appointments.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    const handleReschedule = (id) => {
        const newDate = prompt("Ingrese nueva fecha (YYYY-MM-DD):");
        const newTime = prompt("Ingrese nueva hora (HH:MM):");
        if (newDate && newTime) {
            setAppointments(appointments.map(app =>
                app.id === id ? { ...app, date: newDate, time: newTime, status: 'Reprogramada' } : app
            ));
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Citas</h2>
                    <p className="text-gray-500">Asignar, reprogramar y cancelar citas.</p>
                </div>
                <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 transition-all">
                    <FaCalendarAlt /> Nueva Cita
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Filtrar por fecha:</label>
                <input
                    type="date"
                    className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-primary"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
                <button onClick={() => setFilterDate('')} className="text-sm text-blue-500 hover:underline">Ver todas</button>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                            <th className="p-4 font-semibold">Fecha y Hora</th>
                            <th className="p-4 font-semibold">Cliente / Mascota</th>
                            <th className="p-4 font-semibold">Tipo</th>
                            <th className="p-4 font-semibold">Estado</th>
                            <th className="p-4 font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredAppointments.map(app => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{app.date}</div>
                                    <div className="text-sm text-gray-500 flex items-center gap-1"><FaClock className="size-3" /> {app.time}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-800 flex items-center gap-2"><FaUser className="size-3 text-gray-400" /> {app.client}</div>
                                    <div className="text-sm text-gray-500 flex items-center gap-2"><FaPaw className="size-3 text-gray-400" /> {app.pet}</div>
                                </td>
                                <td className="p-4 text-gray-600">{app.type}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${app.status === 'Confirmada' ? 'bg-green-100 text-green-700' :
                                            app.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'Cancelada' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                        }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleStatusChange(app.id, 'Confirmada')}
                                        title="Confirmar"
                                        className="text-green-500 hover:bg-green-50 p-2 rounded-lg transition-colors"
                                    ><FaCheck className="size-4" /></button>
                                    <button
                                        onClick={() => handleReschedule(app.id)}
                                        title="Reprogramar"
                                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                    ><FaEdit className="size-4" /></button>
                                    <button
                                        onClick={() => handleStatusChange(app.id, 'Cancelada')}
                                        title="Cancelar"
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    ><FaTimes className="size-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {filteredAppointments.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-400">No hay citas para mostrar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentManagement;
