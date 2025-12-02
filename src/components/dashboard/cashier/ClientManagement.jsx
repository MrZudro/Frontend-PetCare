import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

// Mock Data
const MOCK_CLIENTS = [
    { id: 1, names: 'Juan', lastNames: 'Perez', documentNumber: '12345678', email: 'juan@example.com', phone: '3001234567' },
    { id: 2, names: 'Maria', lastNames: 'Gomez', documentNumber: '87654321', email: 'maria@example.com', phone: '3109876543' },
];

const ClientManagement = () => {
    const [clients, setClients] = useState(MOCK_CLIENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null); // For edit

    const filteredClients = clients.filter(client =>
        client.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.documentNumber.includes(searchTerm)
    );

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            setClients(clients.filter(c => c.id !== id));
        }
    };

    const handleEdit = (client) => {
        setCurrentClient(client);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentClient(null);
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newClient = {
            id: currentClient ? currentClient.id : Date.now(),
            names: formData.get('names'),
            lastNames: formData.get('lastNames'),
            documentNumber: formData.get('documentNumber'),
            email: formData.get('email'),
            phone: formData.get('phone'),
        };

        if (currentClient) {
            setClients(clients.map(c => c.id === currentClient.id ? newClient : c));
        } else {
            setClients([...clients, newClient]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
                    <p className="text-gray-500">Administra la información de los clientes.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 transition-all"
                >
                    <FaPlus /> Nuevo Cliente
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o documento..."
                    className="flex-1 outline-none text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Nombre Completo</th>
                                <th className="p-4 font-semibold">Documento</th>
                                <th className="p-4 font-semibold">Contacto</th>
                                <th className="p-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredClients.map(client => (
                                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <FaUser />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{client.names} {client.lastNames}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{client.documentNumber}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col text-sm text-gray-500 gap-1">
                                            <span className="flex items-center gap-2"><FaEnvelope className="text-xs" /> {client.email}</span>
                                            <span className="flex items-center gap-2"><FaPhone className="text-xs" /> {client.phone}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(client)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><FaEdit /></button>
                                        <button onClick={() => handleDelete(client.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400">No se encontraron clientes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="bg-primary p-4 text-white font-bold text-lg">
                            {currentClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                                    <input name="names" defaultValue={currentClient?.names} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                                    <input name="lastNames" defaultValue={currentClient?.lastNames} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                                <input name="documentNumber" defaultValue={currentClient?.documentNumber} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input name="email" type="email" defaultValue={currentClient?.email} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input name="phone" defaultValue={currentClient?.phone} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
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

export default ClientManagement;
