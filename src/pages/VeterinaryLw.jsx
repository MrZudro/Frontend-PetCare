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
        <div className="w-full">
            
            {/* 1. Banner */}
            <Banner title="Veterinarias" />
            
            {/* 2. Contenedor Principal: Lógica Condicional */}
            {isSingleView ? (
                // CASO 1: Solo una veterinaria (Vista Detallada Completa)
                <VeterinaryDetailView vet={singleVetData} />
            ) : (
                // CASO 2: Múltiples veterinarias (Cuadrícula de Tarjetas)
                <div 
                    className="mt-8 mx-4 grid grid-cols-2 gap-y-4 gap-x-3 justify-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
                >
                    
                    {veterinaries.map((vet) => (
                        <Card 
                            key={vet.id} 
                            name={vet.name}
                            imageUrl={vet.image} 
                            onClick={() => handleCardClick(vet)}
                        />
                    ))}

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