import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaUserMd,
    FaCalendarAlt,
    FaNotesMedical,
    FaBed,
    FaCashRegister,
    FaUsers,
    FaPaw,
    FaSignOutAlt,
    FaBars,
    FaTimes
} from 'react-icons/fa';
import ProfileEdit from '../components/dashboard/shared/ProfileEdit';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Fallback if no user in context (for development/testing without login)
    const currentUser = user || {
        names: "Usuario",
        lastNames: "Mock",
        cargo: "VETERINARIAN", // Default for dev
        profilePhotoUrl: "https://ui-avatars.com/api/?name=User+Mock&background=random"
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const isActive = (path) => location.pathname === path;

    const handleSaveProfile = (updatedUser) => {
        // In a real app, update context/state
        console.log("Updated User:", updatedUser);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const veterinarianLinks = [
        { path: '/dashboard/agenda', label: 'Agenda', icon: <FaCalendarAlt /> },
        { path: '/dashboard/consultation', label: 'Consulta', icon: <FaNotesMedical /> },
        { path: '/dashboard/hospitalization', label: 'Hospitalización', icon: <FaBed /> },
    ];

    const cashierLinks = [
        { path: '/dashboard/pos', label: 'Punto de Venta', icon: <FaCashRegister /> },
        { path: '/dashboard/clients', label: 'Clientes', icon: <FaUsers /> },
        { path: '/dashboard/pets', label: 'Mascotas', icon: <FaPaw /> },
        { path: '/dashboard/appointments', label: 'Gestión Citas', icon: <FaCalendarAlt /> },
    ];

    const links = currentUser.cargo === 'VETERINARIAN' ? veterinarianLinks :
        currentUser.cargo === 'CASHIER' ? cashierLinks : [];

    return (
        <div className="flex h-screen bg-gray-100 font-poppins">
            {/* Profile Edit Modal */}
            {isProfileEditOpen && (
                <ProfileEdit
                    user={currentUser}
                    onClose={() => setIsProfileEditOpen(false)}
                    onSave={handleSaveProfile}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-white shadow-xl z-20 transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full md:relative`}
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <div
                        className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${!isSidebarOpen && 'justify-center w-full'}`}
                        onClick={() => setIsProfileEditOpen(true)}
                        title="Editar Perfil"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
                            <img
                                src={currentUser.profilePhotoUrl || "https://ui-avatars.com/api/?name=User&background=random"}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <h3 className="font-semibold text-gray-800 truncate">{currentUser.names}</h3>
                                <p className="text-xs text-gray-500 truncate">{currentUser.cargo || currentUser.role}</p>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 py-6 overflow-y-auto">
                    <ul className="space-y-2 px-3">
                        {links.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive(link.path)
                                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                        } ${!isSidebarOpen && 'justify-center'}`}
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    {isSidebarOpen && <span className="font-medium">{link.label}</span>}

                                    {/* Tooltip for collapsed state */}
                                    {!isSidebarOpen && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                            {link.label}
                                        </div>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <FaSignOutAlt className="text-xl" />
                        {isSidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header for Mobile/Toggle */}
                <header className="bg-white shadow-sm p-4 flex items-center gap-4 md:hidden">
                    <button onClick={toggleSidebar} className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg">
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <h1 className="font-bold text-lg text-gray-800">PetCare Dashboard</h1>
                </header>

                {/* Desktop Toggle (Optional, maybe floating or in header) */}
                <div className="hidden md:flex items-center p-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <button onClick={toggleSidebar} className="text-gray-500 p-2 hover:bg-white hover:shadow-md rounded-lg transition-all">
                        <FaBars />
                    </button>
                    <h2 className="ml-4 text-xl font-bold text-gray-800">
                        {links.find(l => isActive(l.path))?.label || 'Dashboard'}
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
