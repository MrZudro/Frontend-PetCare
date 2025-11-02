// src/pages/PetDetailPage.jsx

import React, { useState, useEffect } from 'react';
import HistoryRow from '../components/petDetail/HistoryRow.jsx'; 
import petsDetail from '../components/Data/petDetail.json'; 

import vaccineHistory from '../components/Data/vaccineHistory.json'; 
import vaccinesCatalog from '../components/Data/vaccines.json';       
import consultationHistory from '../components/Data/consultationHistory.json'; 
import employeesCatalog from '../components/Data/employees.json';
import clinicsCatalog from '../components/Data/clinics.json';
import prescriptionHistory from '../components/Data/prescriptionHistory.json'; 
import activeConditionsHistory from '../components/Data/activeConditionsHistory.json'; 
import VaccineDetailModal from '../components/petDetail/VaccineDetailModal.jsx'; 
import ConsultationDetailModal from '../components/petDetail/ConsultationDetailModal.jsx'; 


// Función auxiliar para calcular la edad (Sin cambios)
const calculateAge = (birthdate) => {
    if (!birthdate) return 'Edad no disp.';
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth(); 
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return `${age} años`;
};

// Componente auxiliar PetDetailRow (Sin cambios)
const PetDetailRow = ({ label, value, isImportant = false }) => {
    const displayValue = value === null || value === undefined || value === '' 
        ? <span className="text-gray-400 italic">No especificado</span> 
        : value;
        
    const valueClass = isImportant 
        ? 'font-bold text-base sm:text-lg' 
        : 'text-xs sm:text-sm text-gray-700';

    return (
        <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <dt className="text-xs sm:text-sm text-gray-500 font-medium">{label}</dt>
            <dd className={valueClass} style={isImportant ? {color: 'var(--color-acento-primario, #F2055C)'} : {}}>
                {displayValue}
            </dd>
        </div>
    );
};


export default function PetDetailPage() {
    
    // CONSOLIDACIÓN DE ESTADOS
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Estados de Vacunas
    const [selectedVaccine, setSelectedVaccine] = useState(null); 
    const [showAllVaccines, setShowAllVaccines] = useState(false);
    const [allVaccines, setAllVaccines] = useState([]); 
    
    // Estados de Consultas
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [showAllConsultations, setShowAllConsultations] = useState(false);
    const [allConsultations, setAllConsultations] = useState([]); 


    // --- Lógica de carga de datos ---
    useEffect(() => {
        setTimeout(() => {
            const petIdToFetch = 7; 
            const fetchedPet = petsDetail.find(p => p.id === petIdToFetch); 
            
            if (fetchedPet) {
                // Formateo de datos básicos
                const raceMap = { 1: "Perro", 2: "Gato"};
                fetchedPet.race_name = fetchedPet.id_race ? raceMap[fetchedPet.id_race] : 'Raza'; 
                fetchedPet.age = calculateAge(fetchedPet.birthdate);
                const dob = fetchedPet.birthdate ? new Date(fetchedPet.birthdate) : null;
                fetchedPet.formatted_birthdate = dob && !isNaN(dob) 
                    ? dob.toLocaleDateString('es-CO', {day: '2-digit', month: '2-digit', year: 'numeric'}) 
                    : 'N/A';
                fetchedPet.chronic_condition = fetchedPet.chronic_condition || "Ninguna";
                fetchedPet.allergies = Array.isArray(fetchedPet.allergies) 
                    ? fetchedPet.allergies 
                    : (fetchedPet.allergies ? [fetchedPet.allergies] : []); 
                if (!fetchedPet.weight) {
                    fetchedPet.weight = "N/A";
                }


                // 1. Lógica de Vacunas 
                const petVaccineHistory = vaccineHistory
                    .filter(history => history.id_pet === petIdToFetch)
                    .map(history => {
                        const vaccineInfo = vaccinesCatalog.find(v => v.id === history.id_vaccines);
                        return { id: history.id, name: vaccineInfo ? vaccineInfo.name : 'Vacuna Desconocida', date: new Date(history.create_date).toLocaleDateString('es-CO'), next_date: new Date(history.next_vaccine).toLocaleDateString('es-CO'), professional: `Emp. ID ${history.id_employee}`, clinic: "Veterinaria Central", lote: "LOTE-" + history.id, description: vaccineInfo ? vaccineInfo.description : 'N/A', observations: history.observations, certificate: history.certificate, ...history };
                    });
                
                setAllVaccines(petVaccineHistory);


                // 2. Lógica de Consultas 
                const petConsultationHistory = consultationHistory
                    .filter(history => history.id_pet === petIdToFetch)
                    .map(history => {
                        const employeeInfo = employeesCatalog.find(e => e.id === history.id_employee);
                        const clinicInfo = clinicsCatalog.find(c => c.id === history.id_clinic);
                        return { id: history.id, date: new Date(history.created_date).toLocaleDateString('es-CO'), reason: history.reason, diagnosis: history.diagnosis, prescription: history.treatment, weight: history.weight, temperature: history.temperature, physical_examination: history.physical_examination, observation: history.observation, professional: employeeInfo ? employeeInfo.name : `ID Emp. ${history.id_employee}`, clinic: clinicInfo ? clinicInfo.name : `ID Clin. ${history.id_clinic}`, ...history };
                    });
                
                setAllConsultations(petConsultationHistory); 

                // 3. Lógica de TODAS las Recetas Activas
                const now = new Date();
                now.setHours(0, 0, 0, 0); 
                
                const petPrescriptions = prescriptionHistory
                    .filter(p => p.id_pet === petIdToFetch);

                const allActivePrescriptions = petPrescriptions
                    .filter(p => {
                        const validUntilDate = new Date(p.valid_until);
                        validUntilDate.setHours(0, 0, 0, 0);
                        return validUntilDate >= now;
                    })
                    .sort((a, b) => new Date(a.valid_until) - new Date(b.valid_until)); 

                let activePrescriptionData = { name: "Ninguna", valid_until: "N/A", list: [] };

                if (allActivePrescriptions.length > 0) {
                    activePrescriptionData = {
                        name: allActivePrescriptions.length > 1 
                              ? `${allActivePrescriptions.length} Recetas Activas` 
                              : allActivePrescriptions[0].medication_name,
                        
                        valid_until: new Date(allActivePrescriptions[0].valid_until).toLocaleDateString('es-CO'),
                        
                        list: allActivePrescriptions.map(p => ({
                            name: p.medication_name,
                            valid_until: new Date(p.valid_until).toLocaleDateString('es-CO'),
                            data: p 
                        }))
                    };
                }

                fetchedPet.active_prescription = activePrescriptionData;
                
                // ----------------------------------------------------
                // 4. ✨ Lógica de Condiciones Activas (NUEVO)
                // ----------------------------------------------------

                const petActiveConditions = activeConditionsHistory
                    .filter(c => c.id_pet === petIdToFetch);
                    
                fetchedPet.active_conditions_list = petActiveConditions; 
                // ----------------------------------------------------

            } // Fin del if (fetchedPet)

            setPet(fetchedPet);
            setLoading(false);
        }, 1000);
    }, []); 

    const handleVaccineClick = (data) => setSelectedVaccine({...data, pet_name: pet.name});
    const handleCloseVaccineModal = () => setSelectedVaccine(null);
    const handleConsultationClick = (data) => setSelectedConsultation({...data, pet_name: pet.name});
    const handleCloseConsultationModal = () => setSelectedConsultation(null);

    const vaccinesToShow = showAllVaccines ? allVaccines : allVaccines.slice(0, 2);
    const consultationsToShow = showAllConsultations ? allConsultations : allConsultations.slice(0, 2); 


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-semibold">
                Cargando datos de la mascota... 🐾
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="text-center p-8 text-red-600 font-bold">
                Error: No se encontró la mascota con el ID solicitado.
            </div>
        );
    }
    
    const displayAllergies = pet.allergies && pet.allergies.length > 0 
        ? pet.allergies.join(', ') 
        : <span className="text-gray-700 italic">Sin alergias registradas</span>;

    
    return (
        <div className="w-full min-h-screen bg-gray-100 py-6 sm:py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> 
                {/* Título y Tarjeta de Perfil */}
                <h1 className="text-xl sm:text-3xl font-bold mb-6 text-center" style={{color: 'var(--color-texto, #161728)'}}>
                    Historial de {pet.name} {pet.race_name === 'Gato' ? '🐈' : '🐕'}
                </h1>
                
                <div 
                    className="text-white p-4 sm:p-6 rounded-xl shadow-xl mb-8 transform hover:scale-[1.01] transition duration-300"
                    style={{ background: 'linear-gradient(to right, var(--color-primary, #0FC2C0), var(--color-acento-secundario, #0388A6))' }}
                >
                    <div className="flex items-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 shrink-0 mr-4 sm:mr-6 border-4 border-white flex items-center justify-center text-2xl sm:text-3xl font-semibold">
                        {pet.race_name === 'Gato' ? '🐈' : '🐕'}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">{pet.name}</h2>
                            <p className="text-sm sm:text-lg font-medium opacity-90 mt-1">
                                {pet.race_name} • {pet.age} • {pet.gender}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    
                    {/* COLUMNA 1: DATOS GENERALES Y ALERTA */}
                    <div className="lg:col-span-1 space-y-6 sm:space-y-8">
                        {/* CARD: DATOS GENERALES (Sin cambios) */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center" style={{color: 'var(--color-texto, #161728)'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-3" viewBox="0 0 20 20" fill="currentColor" style={{color: 'var(--color-primary, #0FC2C0)'}}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                Datos Generales
                            </h2>
                            <dl className="space-y-1">
                                <PetDetailRow label="Nacimiento" value={pet.formatted_birthdate} />
                                <PetDetailRow label="Microchip" value={pet.microchip} />
                                <PetDetailRow label="Color" value={pet.color} />
                                <PetDetailRow label="Edad" value={pet.age} />
                                <PetDetailRow label="Peso" value={pet.weight} isImportant={true} /> 
                            </dl>
                        </div>
                        
                        {/* CARD: CONDICIÓN CRÓNICA / ALERTA (ACTUALIZADO para Condiciones Activas) */}
                        <div 
                            className="p-4 sm:p-5 rounded-lg shadow-sm border"
                            style={{ backgroundColor: 'rgba(191, 4, 54, 0.05)', borderColor: 'var(--color-alerta, #BF0436)' }}
                        >
                            <h2 className="text-base sm:text-lg font-semibold mb-3 flex items-center" style={{color: 'var(--color-alerta, #BF0436)'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2" viewBox="0 0 20 20" fill="currentColor" style={{color: 'var(--color-alerta, #BF0436)'}}><path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v2.926C6.544 5.256 5.097 5.56 4 6.072v2.302A8.995 8.995 0 0011 18c.954 0 1.905-.084 2.842-.246A8.922 8.922 0 0019 9.374V6.072c-1.097-.512-2.544-.816-4-1.002V3a1 1 0 00-1-1h-4zm0 6a1 1 0 000 2h2a1 1 0 100-2h-2z" clipRule="evenodd" /></svg>
                                Alergias y Condiciones
                            </h2>
                            <div className="space-y-3 text-sm">
                                {/* Sección de Alergias */}
                                <div>
                                    <p className="font-medium" style={{color: 'var(--color-alerta, #BF0436)'}}>Alergias</p>
                                    <p className="text-gray-700">{displayAllergies}</p>
                                </div>
                                
                                {/* Sección de Condiciones Activas */}
                                <div>
                                    <p className="font-medium mb-2" style={{color: 'var(--color-alerta, #BF0436)'}}>Condiciones Crónicas Activas</p>
                                    {pet.active_conditions_list && pet.active_conditions_list.length > 0 ? (
                                        <div className="space-y-2">
                                            {pet.active_conditions_list.map(condicion => (
                                                <div 
                                                    key={condicion.id}
                                                    className="p-3 rounded-lg cursor-pointer transition duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md border"
                                                    style={{borderColor: 'var(--color-alerta, #BF0436)', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}
                                                >
                                                    <p className="font-semibold flex items-center mb-1 text-sm" style={{color: 'var(--color-alerta, #BF0436)'}}>
                                                        <span className="mr-2 text-lg">{condicion.icon}</span>
                                                        {condicion.condition_name}
                                                    </p>
                                                    <p className="text-xs text-gray-700 ml-5">{condicion.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-700 font-semibold">
                                            <span className="text-gray-400 italic">No tiene condiciones crónicas activas.</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 2 Y 3: SALUD */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        
                        {/* CARD: RECETAS ACTIVAS (Actualizado para lista y estilo de borde) */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center" style={{color: 'var(--color-texto, #161728)'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: 'var(--color-acento-cuaternario, #F04560)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                Recetas Activas
                            </h2>
                            <div
                                className="rounded-lg border divide-y" 
                                style={{ 
                                    borderColor: 'var(--color-acento-cuaternario, #F04560)', 
                                    backgroundColor: 'rgba(240, 69, 96, 0.1)',
                                    '--tw-divide-y-reverse': '0',
                                    'border-color': 'var(--color-acento-cuaternario, #F04560)'
                                }}
                            >
                                {pet.active_prescription && pet.active_prescription.list && pet.active_prescription.list.length > 0 ? (
                                    pet.active_prescription.list.map((receta, index) => (
                                        <div 
                                            key={index} 
                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"
                                            style={{ borderColor: 'var(--color-acento-cuaternario, #F04560)' }}
                                        >
                                            <span className="text-sm sm:text-base font-semibold flex-1 mb-2 sm:mb-0" style={{color: 'var(--color-acento-cuaternario, #F04560)'}}>{receta.name}</span>
                                            <div className="text-left sm:text-right">
                                                <p className="text-xs sm:text-sm font-medium" style={{color: 'var(--color-acento-cuaternario, #F04560)'}}>Válida hasta:</p>
                                                <p className="text-sm sm:text-base font-bold" style={{color: 'var(--color-acento-cuaternario, #F04560)'}}>{receta.valid_until}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-4 text-sm" style={{color: 'var(--color-acento-cuaternario, #F04560)'}}>No hay recetas activas actualmente.</p>
                                )}
                            </div>
                        </div>


                        {/* CARD: VACUNAS RECIENTES (Sin cambios) */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center" style={{color: 'var(--color-texto, #161728)'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-3" viewBox="0 0 20 20" fill="currentColor" style={{color: 'var(--color-primary, #0FC2C0)'}}><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1h6v4H7V6zm6 5H7v2h6v-2z" clipRule="evenodd" /></svg>
                                Historial de Vacunación
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {vaccinesToShow.map((v, index) => (
                                    <HistoryRow 
                                        key={`vac-${index}`}
                                        date={v.date} 
                                        type="Vacuna" 
                                        detail={v.name} 
                                        next_date={v.next_date} 
                                        onClick={handleVaccineClick}
                                        data={v}
                                    />
                                ))}
                            </div>
                            {allVaccines.length > 2 && (
                                <button 
                                    className="mt-4 w-full font-medium text-xs sm:text-sm hover:text-indigo-800"
                                    style={{color: 'var(--color-acento-secundario, #0388A6)'}}
                                    onClick={() => setShowAllVaccines(!showAllVaccines)}
                                >
                                    {showAllVaccines 
                                        ? '↑ Mostrar menos' 
                                        : `Ver más (${allVaccines.length} items) →`
                                    }
                                </button>
                            )}
                        </div>
                        
                        
                        {/* CARD: CONSULTAS RECIENTES (Sin cambios) */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center" style={{color: 'var(--color-texto, #161728)'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-3" viewBox="0 0 20 20" fill="currentColor" style={{color: 'var(--color-acento-secundario, #0388A6)'}}><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1h6v4H7V6zm6 5H7v2h6v-2z" clipRule="evenodd" /></svg>
                                Consultas Recientes
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {consultationsToShow.map((c, index) => (
                                    <HistoryRow
                                        key={`con-${index}`}
                                        date={c.date}
                                        type="Consulta"
                                        detail={c.reason}
                                        next_date={null}
                                        onClick={handleConsultationClick}
                                        data={c} 
                                    />
                                ))}
                            </div>
                            {allConsultations.length > 2 && (
                                <button
                                    className="mt-4 w-full font-medium text-xs sm:text-sm hover:text-indigo-800"
                                    style={{color: 'var(--color-acento-secundario, #0388A6)'}}
                                    onClick={() => setShowAllConsultations(!showAllConsultations)}
                                >
                                    {showAllConsultations 
                                        ? '↑ Mostrar menos' 
                                        : `Ver más (${allConsultations.length} items) →`
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* INTEGRACIÓN DE MODALES */}
            <VaccineDetailModal 
                vaccineData={selectedVaccine}
                onClose={handleCloseVaccineModal}
            />
            <ConsultationDetailModal
                consultationData={selectedConsultation}
                onClose={handleCloseConsultationModal}
            />
        </div>
    );
}