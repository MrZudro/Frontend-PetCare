import { FaHome, FaBox, FaUserTie, FaSyringe, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes limpiar tokens, cerrar sesión, etc.
    localStorage.clear(); // si usas localStorage
    navigate("/login");   // redirige al login
  };

  return (
    <aside className="w-64 bg-fondo dark:bg-card-dark h-screen shadow-lg flex flex-col">
      <div className="p-6 text-2xl font-bold text-primary">VetDashboard</div>
      <nav className="flex-1 px-4 space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-primary text-white" : "text-texto dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-200"
            }`
          }
        >
          <FaHome /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/productos"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-primary text-white" : "text-texto dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-200"
            }`
          }
        >
          <FaBox /> Productos
        </NavLink>

        <NavLink
          to="/admin/servicios"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-primary text-white" : "text-texto dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-200"
            }`
          }
        >
          <FaClipboardList /> Servicios
        </NavLink>

        <NavLink
          to="/admin/empleados"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-primary text-white" : "text-texto dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-200"
            }`
          }
        >
          <FaUserTie /> Empleados
        </NavLink>

        <NavLink
          to="/admin/vacunas"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-primary text-white" : "text-texto dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-200"
            }`
          }
        >
          <FaSyringe /> Vacunas
        </NavLink>

        <NavLink
          to="/admin/reportes"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-primary text-white" : "text-texto dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-200"
            }`
          }
        >
          <FaClipboardList /> Reportes
        </NavLink>
      </nav>

      {/* Cerrar sesión */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-texto dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-200 transition w-full"
        >
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}