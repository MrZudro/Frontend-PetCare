import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaCopy, FaTrash, FaClock } from 'react-icons/fa';
import { createBulkSchedules } from '../../services/scheduleService';

const DAYS_OF_WEEK = [
    { name: 'Lunes', value: 'Lunes' },
    { name: 'Martes', value: 'Martes' },
    { name: 'Miércoles', value: 'Miércoles' },
    { name: 'Jueves', value: 'Jueves' },
    { name: 'Viernes', value: 'Viernes' },
    { name: 'Sábado', value: 'Sábado' },
    { name: 'Domingo', value: 'Domingo' }
];

const HOURS = Array.from({ length: 24 }, (_, i) => ({
    value: `${i.toString().padStart(2, '0')}:00`,
    label: `${i.toString().padStart(2, '0')}:00`
}));

const ScheduleManagerModal = ({ isOpen, onClose, empleado }) => {
    const [periodStartDate, setPeriodStartDate] = useState('');
    const [periodEndDate, setPeriodEndDate] = useState('');
    const [schedules, setSchedules] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Inicializar fechas del período (próximas 2 semanas)
    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            const twoWeeksLater = new Date(today);
            twoWeeksLater.setDate(today.getDate() + 14);

            setPeriodStartDate(today.toISOString().split('T')[0]);
            setPeriodEndDate(twoWeeksLater.toISOString().split('T')[0]);
            setSchedules({});
            setError(null);
            setSuccess(false);
        }
    }, [isOpen, empleado]);

    if (!isOpen) return null;

    // Generar array de fechas del período
    const getDatesInPeriod = () => {
        if (!periodStartDate || !periodEndDate) return [];

        const dates = [];
        const start = new Date(periodStartDate);
        const end = new Date(periodEndDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }

        return dates;
    };

    const dates = getDatesInPeriod();

    // Obtener nombre del día de la semana
    const getDayName = (date) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[date.getDay()];
    };

    // Formatear fecha para visualización
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Agregar horario para una fecha
    const addScheduleForDate = (dateStr) => {
        setSchedules(prev => ({
            ...prev,
            [dateStr]: {
                startTime: '08:00',
                endTime: '17:00',
                isOvertime: false
            }
        }));
    };

    // Actualizar horario
    const updateSchedule = (dateStr, field, value) => {
        setSchedules(prev => ({
            ...prev,
            [dateStr]: {
                ...prev[dateStr],
                [field]: value
            }
        }));
    };

    // Eliminar horario
    const removeSchedule = (dateStr) => {
        setSchedules(prev => {
            const newSchedules = { ...prev };
            delete newSchedules[dateStr];
            return newSchedules;
        });
    };

    // Copiar horario a todos los días de la semana
    const copyToWeekdays = (sourceDate) => {
        const source = schedules[sourceDate];
        if (!source) return;

        const newSchedules = { ...schedules };
        dates.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            const dayName = getDayName(date);

            // Solo copiar a días laborales (Lunes a Viernes)
            if (['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].includes(dayName)) {
                newSchedules[dateStr] = { ...source };
            }
        });

        setSchedules(newSchedules);
    };

    // Limpiar todos los horarios
    const clearAll = () => {
        if (window.confirm('¿Está seguro de que desea eliminar todos los horarios?')) {
            setSchedules({});
        }
    };

    // Guardar horarios
    const handleSave = async () => {
        if (Object.keys(schedules).length === 0) {
            setError('Debe agregar al menos un horario');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Convertir schedules a formato de API
            const schedulesArray = Object.entries(schedules).map(([dateStr, schedule]) => {
                const date = new Date(dateStr);
                return {
                    employeeId: empleado.id,
                    day: getDayName(date),
                    scheduleDate: dateStr,
                    start_time: schedule.startTime,
                    end_time: schedule.endTime,
                    isOvertime: schedule.isOvertime,
                    periodStartDate,
                    periodEndDate
                };
            });

            await createBulkSchedules(schedulesArray);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error guardando horarios:', err);
            setError('Error al guardar los horarios. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestionar Horario</h2>
                        <p className="text-gray-600 mt-1">
                            Empleado: <span className="font-semibold">{empleado?.name}</span> - {empleado?.role}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-600" />
                    </button>
                </div>

                {/* Período */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                value={periodStartDate}
                                onChange={(e) => setPeriodStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Fin
                            </label>
                            <input
                                type="date"
                                value={periodEndDate}
                                onChange={(e) => setPeriodEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={clearAll}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <FaTrash /> Limpiar Todo
                        </button>
                    </div>
                </div>

                {/* Lista de fechas y horarios */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                            ¡Horarios guardados exitosamente!
                        </div>
                    )}

                    <div className="space-y-3">
                        {dates.map(date => {
                            const dateStr = date.toISOString().split('T')[0];
                            const schedule = schedules[dateStr];
                            const dayName = getDayName(date);

                            return (
                                <div
                                    key={dateStr}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="font-semibold text-gray-800">{dayName}</span>
                                            <span className="text-gray-500 ml-2">{formatDate(date)}</span>
                                        </div>
                                        {!schedule ? (
                                            <button
                                                onClick={() => addScheduleForDate(dateStr)}
                                                className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
                                            >
                                                + Agregar Horario
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => copyToWeekdays(dateStr)}
                                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center gap-1"
                                                    title="Copiar a días laborales"
                                                >
                                                    <FaCopy /> Copiar
                                                </button>
                                                <button
                                                    onClick={() => removeSchedule(dateStr)}
                                                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {schedule && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Hora Inicio
                                                </label>
                                                <select
                                                    value={schedule.startTime}
                                                    onChange={(e) => updateSchedule(dateStr, 'startTime', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                                >
                                                    {HOURS.map(hour => (
                                                        <option key={hour.value} value={hour.value}>
                                                            {hour.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Hora Fin
                                                </label>
                                                <select
                                                    value={schedule.endTime}
                                                    onChange={(e) => updateSchedule(dateStr, 'endTime', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                                >
                                                    {HOURS.map(hour => (
                                                        <option key={hour.value} value={hour.value}>
                                                            {hour.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Tipo de Horas
                                                </label>
                                                <select
                                                    value={schedule.isOvertime ? 'overtime' : 'regular'}
                                                    onChange={(e) => updateSchedule(dateStr, 'isOvertime', e.target.value === 'overtime')}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                                >
                                                    <option value="regular">Regulares (44h/sem)</option>
                                                    <option value="overtime">Extras (máx 12h/sem)</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || Object.keys(schedules).length === 0}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FaSave /> Guardar Horarios
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagerModal;
