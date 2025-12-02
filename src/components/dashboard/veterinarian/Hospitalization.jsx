import React, { useState } from 'react';
import { FaPlus, FaSearch, FaTimes, FaSyringe, FaNotesMedical, FaUser, FaPaw } from 'react-icons/fa';

// Mock Data for Hospitalized Pets
const MOCK_HOSPITALIZED = [
    { id: 1, petName: 'Max', owner: 'Juan Perez', admissionDate: '2023-10-25', condition: 'Recuperación Cirugía', room: 'Sala A - Jaula 1' },
    { id: 2, petName: 'Luna', owner: 'Maria Gomez', admissionDate: '2023-10-26', condition: 'Observación - Vómitos', room: 'Sala B - Jaula 3' },
];

// Mock Data for Search Results
const MOCK_SEARCH_RESULTS = [
    { id: 101, name: 'Rocky', owner: 'Carlos Ruiz', chip: '987654321', breed: 'Bulldog' },
    { id: 102, name: 'Coco', owner: 'Ana Diaz', chip: '123456789', breed: 'Poodle' },
];

const Hospitalization = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [hospitalizedPets, setHospitalizedPets] = useState(MOCK_HOSPITALIZED);

    const handleSearch = (e) => {
        e.preventDefault();
        // Simulate search
        if (searchTerm.trim() !== '') {
            setSearchResults(MOCK_SEARCH_RESULTS);
        } else {
            setSearchResults([]);
        }
    };

    const handleAddPet = (pet) => {
        const newAdmission = {
            id: Date.now(),
            petName: pet.name,
            owner: pet.owner,
            admissionDate: new Date().toISOString().split('T')[0],
            condition: 'Ingreso Reciente',
            room: 'Por asignar'
        };
        setHospitalizedPets([...hospitalizedPets, newAdmission]);
        setIsModalOpen(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Hospitalización</h2>
                    <p className="text-gray-500">Gestión de pacientes ingresados.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    <FaPlus /> Ingresar Mascota
                </button>
            </div>

            {/* Hospitalized List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitalizedPets.map(pet => (
                    <div key={pet.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                                <FaPaw />
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                {pet.room}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{pet.petName}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                            <FaUser className="text-xs" /> {pet.owner}
                        </p>

                        <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                            <p><span className="font-semibold">Ingreso:</span> {pet.admissionDate}</p>
                            <p><span className="font-semibold">Condición:</span> {pet.condition}</p>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                                <FaNotesMedical /> Evolución
                            </button>
                            <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                                <FaSyringe /> Tratamiento
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Pet Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="bg-primary p-4 flex justify-between items-center text-white">
                            <h2 className="text-xl font-bold">Ingresar Paciente</h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar por Chip o Nombre de Cliente..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                                <button type="submit" className="bg-gray-800 text-white px-6 rounded-xl hover:bg-gray-700 transition-colors">
                                    <FaSearch />
                                </button>
                            </form>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    searchResults.map(pet => (
                                        <div key={pet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{pet.name} <span className="text-xs font-normal text-gray-500">({pet.breed})</span></h4>
                                                <p className="text-sm text-gray-600">Dueño: {pet.owner}</p>
                                                <p className="text-xs text-gray-400">Chip: {pet.chip}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAddPet(pet)}
                                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
                                            >
                                                Ingresar
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-400 py-8">
                                        {searchTerm ? 'No se encontraron resultados' : 'Realiza una búsqueda para ver resultados'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hospitalization;
