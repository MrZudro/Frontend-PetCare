import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaStarHalfAlt } from 'react-icons/fa';

const VeterinaryClinics = () => {
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/veterinary-clinics');
                setClinics(response.data);
            } catch (err) {
                console.error('Error fetching veterinary clinics:', err);
                setError('Error al cargar las clínicas veterinarias');
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, []);

    const getCurrentDaySchedule = (horarioPrincipal) => {
        if (!horarioPrincipal) return 'Horario no disponible';

        try {
            const schedule = JSON.parse(horarioPrincipal);
            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const today = days[new Date().getDay()];
            return schedule[today] || 'No disponible';
        } catch (e) {
            return 'Horario no disponible';
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
        }

        return stars;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {clinics.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay clínicas veterinarias disponibles en este momento</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {clinics.map((clinic) => (
                        <div
                            key={clinic.id}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                        >
                            {/* Header con nombre y puntuación */}
                            <div className="bg-linear-to-r from-primary to-primary-hover p-6">
                                <h3 className="text-2xl font-bold text-white mb-3">{clinic.name}</h3>

                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {renderStars(clinic.puntuacion || 5.0)}
                                    </div>
                                    <span className="text-white font-semibold">
                                        {(clinic.puntuacion || 5.0).toFixed(1)}
                                    </span>
                                    <span className="text-white/80 text-sm">
                                        ({clinic.totalReviews || 0} reseñas)
                                    </span>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6 space-y-4">
                                {/* Ubicación */}
                                {clinic.ubicacion && (
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-primary mt-1 shrink-0" size={18} />
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Ubicación</p>
                                            <p className="text-gray-600 text-sm">{clinic.ubicacion}</p>
                                            <p className="text-gray-500 text-xs mt-1">{clinic.address}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Horario del día actual */}
                                <div className="flex items-start gap-3">
                                    <FaClock className="text-primary mt-1 shrink-0" size={18} />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Horario Hoy</p>
                                        <p className="text-gray-600 text-sm">{getCurrentDaySchedule(clinic.horarioPrincipal)}</p>
                                    </div>
                                </div>

                                {/* Contacto */}
                                <div className="space-y-2 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <FaPhone className="text-primary shrink-0" size={16} />
                                        <a
                                            href={`tel:${clinic.phone}`}
                                            className="text-gray-600 text-sm hover:text-primary transition-colors"
                                        >
                                            {clinic.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaEnvelope className="text-primary shrink-0" size={16} />
                                        <a
                                            href={`mailto:${clinic.email}`}
                                            className="text-gray-600 text-sm hover:text-primary transition-colors truncate"
                                        >
                                            {clinic.email}
                                        </a>
                                    </div>
                                </div>

                                {/* Botón de acción */}
                                <button
                                    onClick={() => navigate('/services', { state: { clinicName: clinic.name } })}
                                    className="w-full mt-4 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                                >
                                    Ver Servicios
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VeterinaryClinics;
