import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';
import { getEmployeeUpcomingSchedule } from '../../../services/scheduleService';
import { useAuth } from '../../../context/AuthContext';

// Generar array de horas (00:00 - 23:00)
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Formatear hora para visualización
const formatHour = (hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
};

// Obtener nombre del día de la semana en español
const getDayName = (date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
};

// Formatear fecha para visualización
const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
};

const Agenda = () => {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(new Date());

    // Generar array de 15 días desde startDate
    const getDays = () => {
        const days = [];
        for (let i = 0; i < 15; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const days = getDays();

    // Cargar horarios del empleado
    useEffect(() => {
        const fetchSchedules = async () => {
            if (!user?.id) {
                setError('No se pudo obtener información del usuario');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await getEmployeeUpcomingSchedule(user.id, 15);
                setSchedules(data);
            } catch (err) {
                console.error('Error cargando horarios:', err);
                setError('Error al cargar los horarios');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [user, startDate]);

    // Obtener horarios para una fecha y hora específica
    const getScheduleForDateTime = (date, hour) => {
        if (!schedules || schedules.length === 0) return null;

        const dateStr = date.toISOString().split('T')[0];

        return schedules.find(schedule => {
            if (!schedule.scheduleDate) return false;

            const scheduleDate = schedule.scheduleDate;
            const startHour = Number.parseInt(schedule.start_time.split(':')[0]);
            const endHour = Number.parseInt(schedule.end_time.split(':')[0]);

            return scheduleDate === dateStr && hour >= startHour && hour < endHour;
        });
    };

    // Navegar a la semana anterior
    const handlePreviousWeek = () => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() - 7);
        setStartDate(newDate);
    };

    // Navegar a la semana siguiente
    const handleNextWeek = () => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + 7);
        setStartDate(newDate);
    };

    // Volver a hoy
    const handleToday = () => {
        setStartDate(new Date());
    };

    if (loading) {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando horarios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <p className="text-red-600 font-semibold mb-2">Error</p>
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Mi Horario de Trabajo</h2>
                    <p className="text-gray-500">Próximos 15 días - Verde: Horas regulares | Naranja: Horas extras</p>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={handlePreviousWeek}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        title="Semana anterior"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={handleToday}
                        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors font-medium"
                    >
                        Hoy
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        title="Semana siguiente"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            {/* Calendario */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Header de días */}
                <div className="grid grid-cols-[80px_repeat(15,minmax(60px,1fr))] border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                    <div className="py-3 px-2 text-center font-semibold text-gray-700 border-r border-gray-200">
                        <FaClock className="inline mr-1" />
                        Hora
                    </div>
                    {days.map((date, idx) => {
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                            <div
                                key={idx}
                                className={`py-3 px-1 text-center border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-primary/10' : ''
                                    }`}
                            >
                                <div className={`text-xs font-semibold ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                                    {getDayName(date)}
                                </div>
                                <div className={`text-xs ${isToday ? 'text-primary font-bold' : 'text-gray-500'}`}>
                                    {formatDate(date)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Grid de horarios */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-[80px_repeat(15,minmax(60px,1fr))]">
                        {HOURS.map((hour) => (
                            <React.Fragment key={hour}>
                                {/* Columna de hora */}
                                <div className="py-2 px-2 text-center text-sm font-medium text-gray-600 border-r border-b border-gray-100 bg-gray-50">
                                    {formatHour(hour)}
                                </div>

                                {/* Celdas de días */}
                                {days.map((date, dayIdx) => {
                                    const schedule = getScheduleForDateTime(date, hour);
                                    const isToday = date.toDateString() === new Date().toDateString();

                                    return (
                                        <div
                                            key={dayIdx}
                                            className={`border-r border-b border-gray-100 last:border-r-0 min-h-[40px] ${isToday ? 'bg-primary/5' : ''
                                                } ${schedule
                                                    ? schedule.isOvertime
                                                        ? 'bg-orange-100 hover:bg-orange-200'
                                                        : 'bg-green-100 hover:bg-green-200'
                                                    : 'hover:bg-gray-50'
                                                } transition-colors cursor-pointer`}
                                            title={schedule
                                                ? `${schedule.start_time} - ${schedule.end_time} ${schedule.isOvertime ? '(Horas extras)' : '(Horas regulares)'}`
                                                : 'Sin horario asignado'
                                            }
                                        >
                                            {schedule && (
                                                <div className="p-1 text-center">
                                                    <div className={`text-xs font-semibold ${schedule.isOvertime ? 'text-orange-700' : 'text-green-700'
                                                        }`}>
                                                        {schedule.isOvertime ? 'Extra' : 'Regular'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Leyenda */}
            <div className="mt-4 flex gap-6 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-sm text-gray-600">Horas Regulares (44h/semana)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                    <span className="text-sm text-gray-600">Horas Extras (máx 12h/semana)</span>
                </div>
            </div>
        </div>
    );
};

export default Agenda;
