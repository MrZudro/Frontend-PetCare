import React, { useState } from 'react';
import Banner from "../components/veterinary/Banner";
import Card from "../components/veterinary/Card";
import VeterinaryModal from "../components/veterinary/VeterinaryModal";
import VeterinaryDetailView from "../components/veterinary/VeterinaryDetailView"; 
import VeterinaryData from "../components/Data/VeterinaryData.json";

export default function VeterinaryLw() {
    const [selectedVet, setSelectedVet] = useState(null);
    
    const handleCardClick = (vetData) => {
        setSelectedVet(vetData);
    };

    const handleCloseModal = () => {
        setSelectedVet(null);
    };

    const veterinaries = VeterinaryData;
    
    // LÓGICA CLAVE: Determinar si solo hay una veterinaria
    const isSingleView = veterinaries.length === 1;

    // Si solo hay una, pasamos el objeto a la vista detallada.
    const singleVetData = isSingleView ? veterinaries[0] : null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            
            {/* 1. Banner */}
            <header className="mb-10 pt-4">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    Veterinarias🏥⚕️
                </h1>
                <p className="text-center text-gray-500 mt-2 text-lg">
                    Cuidamos la salud y felicidad de tu perro o gato con productos de calidad y confianza.
                </p>
            </header>

            {/* 2. Contenedor Principal: Lógica Condicional */}
            {isSingleView ? (
                // CASO 1: Solo una veterinaria (Vista Detallada Completa)
                <VeterinaryDetailView vet={singleVetData} />
            ) : (
                // CASO 2: Múltiples veterinarias (Cuadrícula de Tarjetas)
                <div className="mt-8 2xl:mx-[10vw]">
                    <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {veterinaries.map((vet) => (
                            <Card 
                                key={vet.id} 
                                name={vet.name}
                                imageUrl={vet.image} 
                                onClick={() => handleCardClick(vet)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Componente Modal (Solo necesario si hay múltiples tarjetas) */}
            {!isSingleView && (
                <VeterinaryModal 
                    vet={selectedVet} 
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
}
