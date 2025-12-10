import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

export default function Header() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [saludo, setSaludo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);


  // Detecta clics fuera del menú para cerrarlo
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarPerfil(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calcula saludo dinámico según la hora
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
      setSaludo("Buenos días");
    } else if (hora >= 12 && hora < 19) {
      setSaludo("Buenas tardes");
    } else {
      setSaludo("Buenas noches");
    }
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-2 bg-fondo dark:bg-card-dark shadow-md">
      {/* Título de la página + saludo dinámico */}
      <h1 className="text-xl font-bold text-texto dark:text-text-primary-dark">
        {saludo}, María 👋
      </h1>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMostrarPerfil(!mostrarPerfil)}
          className="rounded-full overflow-hidden w-10 h-10 border-2 border-primary hover:ring-2 ring-primary-hover transition"
          aria-label="Abrir menú de perfil"
        >
          <img src="/ruta-a-tu-imagen.jpg" alt="Foto de perfil" className="w-full h-full object-cover" />
        </button>

        <div
          className={`absolute right-0 mt-4 bg-fondo dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-80 z-50 p-4 space-y-6 transform transition-all duration-300 ease-out
            ${mostrarPerfil ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        >
          <div className="space-y-1 text-sm">
            <p className="text-base font-semibold text-texto dark:text-text-primary-dark">María Gómez</p>
            <p className="text-texto/70 dark:text-text-secondary-dark">maria.gomez@veterinarialuna.com</p>
            <span className="inline-block text-xs font-medium text-acento-secundario bg-acento-secundario/10 dark:bg-acento-secundario/25 px-2 py-1 rounded-full">
              Administrador general
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-texto/60 dark:text-text-secondary-dark uppercase tracking-wide">Cuenta</h3>
            <ul className="space-y-1 text-sm text-texto dark:text-text-primary-dark">
              <li
                onClick={() => { navigate('/admin/perfil'); setMostrarPerfil(false); }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                <FaUser />
                <span>Mi Perfil</span>
              </li>
              <li
                onClick={() => { navigate('/admin/configuracion'); setMostrarPerfil(false); }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                <FaCog />
                <span>Configuración</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-texto/60 dark:text-text-secondary-dark uppercase tracking-wide">Sesión</h3>
            <ul className="space-y-1 text-sm text-texto dark:text-text-primary-dark">
              <li className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 hover:text-primary cursor-pointer">
                <FaSignOutAlt />
                <span>Cerrar sesión</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}