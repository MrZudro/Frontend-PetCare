import React, { useState } from 'react';
import { FaSave, FaStethoscope, FaSyringe, FaNotesMedical, FaFileMedical } from 'react-icons/fa';

const ConsultationForm = () => {
    const [formData, setFormData] = useState({
        symptoms: '',
        diagnosis: '',
        treatment: '',
        notes: '',
        vaccines: '', // Placeholder for vaccine request
        exams: ''     // Placeholder for exam request
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Consultation Data:", formData);
        alert("Consulta registrada con éxito (Mock)");
        // Reset form
        setFormData({
            symptoms: '',
            diagnosis: '',
            treatment: '',
            notes: '',
            vaccines: '',
            exams: ''
        });
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Registro de Consulta</h2>
                <p className="text-gray-500">Completa los detalles de la consulta veterinaria.</p>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm p-8 overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">

                    {/* Section 1: Clinical Evaluation */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                            <FaStethoscope className="text-primary" /> Evaluación Clínica
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Síntomas</label>
                                <textarea
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Describe los síntomas del paciente..."
                                    required
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Diagnóstico preliminar..."
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Treatment & Plan */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                            <FaNotesMedical className="text-primary" /> Tratamiento y Plan
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Tratamiento Recomendado</label>
                            <textarea
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Medicamentos, dosis, frecuencia..."
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FaSyringe className="text-gray-400" /> Solicitud de Vacunas
                                </label>
                                <input
                                    type="text"
                                    name="vaccines"
                                    value={formData.vaccines}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Ej: Rabia, Parvovirus..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FaFileMedical className="text-gray-400" /> Exámenes Complementarios
                                </label>
                                <input
                                    type="text"
                                    name="exams"
                                    value={formData.exams}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Ej: Hemograma, Rayos X..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Additional Notes */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Notas Adicionales</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Observaciones extra..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <FaSave /> Finalizar Consulta
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ConsultationForm;
