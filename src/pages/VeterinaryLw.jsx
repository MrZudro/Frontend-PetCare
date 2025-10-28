import React, { useState } from 'react'; // ¡Necesitamos useState!
import Banner from "../components/veterinary/Banner";
import Card from "../components/veterinary/Card";
import VeterinaryModal from "../components/veterinary/VeterinaryModal"; // ¡Importamos el nuevo modal!
import VeterinaryData from "../components/veterinary/VeterinaryData.json";       

export default function VeterinaryLw() {
    // 1. Estado para guardar la veterinaria seleccionada (inicialmente null)
    const [selectedVet, setSelectedVet] = useState(null);
    
    // 2. Función para manejar el clic en la tarjeta y abrir el modal
    const handleCardClick = (vetData) => {
        setSelectedVet(vetData);
    };

    // 3. Función para cerrar el modal
    const handleCloseModal = () => {
        setSelectedVet(null);
    };

    const veterinaries = VeterinaryData; 

    return (
        <div className="w-full">
            
            {/* 1. Banner */}
            <Banner/>
            
            {/* 2. Contenedor de las Tarjetas */}
            <div className="mt-8 mx-4 grid grid-cols-2 gap-4 justify-items-center md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                
                {veterinaries.map((vet) => (
                    // Pasamos la función onClick a la Card, dándole los datos completos del objeto vet
                    <Card 
                        key={vet.id} 
                        name={vet.name}
                        onClick={() => handleCardClick(vet)} // ¡Aquí está la magia!
                    />
                ))}

            </div>
            
            {/* 3. Footer */}
            <div className="bg-gray-300 h-16 flex justify-center items-center sm:h-20 md:h-24 mt-8">
                <h1>
                    Footer
                </h1>
            </div>

            {/* 4. Componente Modal (Se renderiza si selectedVet NO es null) */}
            <VeterinaryModal 
                vet={selectedVet} 
                onClose={handleCloseModal}
            />

        </div>
    )
}