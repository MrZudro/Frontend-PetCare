import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaPaw, FaUser } from 'react-icons/fa';

// Mock Data
const MOCK_PETS = [
    { id: 1, name: 'Max', breed: 'Golden Retriever', age: '3 años', owner: 'Juan Perez', ownerId: 1 },
    { id: 2, name: 'Luna', breed: 'Siames', age: '2 años', owner: 'Maria Gomez', ownerId: 2 },
];

const MOCK_CLIENTS = [
    { id: 1, names: 'Juan', lastNames: 'Perez' },
    { id: 2, names: 'Maria', lastNames: 'Gomez' },
];

const PetManagement = () => {
    const [pets, setPets] = useState(MOCK_PETS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);

    // Client Search for Add/Edit
    const [clientSearch, setClientSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredClients = MOCK_CLIENTS.filter(client =>
        `${client.names} ${client.lastNames}`.toLowerCase().includes(clientSearch.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta mascota?')) {
            setPets(pets.filter(p => p.id !== id));
        }
    };

    const handleEdit = (pet) => {
        setCurrentPet(pet);
        setSelectedClient({ id: pet.ownerId, names: pet.owner.split(' ')[0], lastNames: pet.owner.split(' ')[1] || '' }); // Mock reconstruction
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentPet(null);
        setSelectedClient(null);
        setClientSearch('');
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!selectedClient) {
            alert("Debes asociar un cliente a la mascota.");
            return;
        }

        const formData = new FormData(e.target);
        const newPet = {
            id: currentPet ? currentPet.id : Date.now(),
            name: formData.get('name'),
            breed: formData.get('breed'),
            age: formData.get('age'),
            owner: `${selectedClient.names} ${selectedClient.lastNames}`,
            ownerId: selectedClient.id
        };

        if (currentPet) {
            setPets(pets.map(p => p.id === currentPet.id ? newPet : p));
        } else {
            setPets([...pets, newPet]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Mascotas</h2>
                    <p className="text-gray-500">Administra las mascotas registradas.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 transition-all"
                >
                    <FaPlus /> Nueva Mascota
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre de mascota o dueño..."
                    className="flex-1 outline-none text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Pets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
                {filteredPets.map(pet => (
                    <div key={pet.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button onClick={() => handleEdit(pet)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"><FaEdit /></button>
                            <button onClick={() => handleDelete(pet.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><FaTrash /></button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-2xl">
                                <FaPaw />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{pet.name}</h3>
                                <p className="text-sm text-gray-500">{pet.breed}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <p className="flex items-center gap-2"><span className="font-semibold">Edad:</span> {pet.age}</p>
                            <p className="flex items-center gap-2"><FaUser className="text-xs" /> {pet.owner}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="bg-primary p-4 text-white font-bold text-lg">
                            {currentPet ? 'Editar Mascota' : 'Nueva Mascota'}
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">

                            {/* Client Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Cliente Asociado</label>
                                {!selectedClient ? (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Buscar cliente..."
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                                            value={clientSearch}
                                            onChange={(e) => setClientSearch(e.target.value)}
                                        />
                                        {clientSearch && (
                                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
                                                {filteredClients.map(client => (
                                                    <div
                                                        key={client.id}
                                                        className="p-2 hover:bg-gray-50 cursor-pointer text-sm"
                                                        onClick={() => {
                                                            setSelectedClient(client);
                                                            setClientSearch('');
                                                        }}
                                                    >
                                                        {client.names} {client.lastNames}
                                                    </div>
                                                ))}
                                                {filteredClients.length === 0 && <div className="p-2 text-gray-400 text-sm">No encontrado</div>}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <span className="font-medium text-blue-800">{selectedClient.names} {selectedClient.lastNames}</span>
                                        <button type="button" onClick={() => setSelectedClient(null)} className="text-red-500 hover:text-red-700 text-sm">Cambiar</button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Mascota</label>
                                <input name="name" defaultValue={currentPet?.name} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                                    <input name="breed" defaultValue={currentPet?.breed} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                                    <input name="age" defaultValue={currentPet?.age} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetManagement;
