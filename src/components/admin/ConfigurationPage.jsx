import { useState, useEffect } from "react";
import { FaMoon, FaSun, FaBell, FaGlobe, FaLock } from "react-icons/fa";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ConfigurationPage() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("es");
  const [notifications, setNotifications] = useState({
    alerts: true,
    reminders: true,
    news: false,
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [lastPasswordUpdate, setLastPasswordUpdate] = useState(null);

  // --- Cargar preferencias guardadas ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    const savedLang = localStorage.getItem("language") || "es";
    setLanguage(savedLang);

    const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || {
      alerts: true,
      reminders: true,
      news: false,
    };
    setNotifications(savedNotifications);

    const savedDate = localStorage.getItem("lastPasswordUpdate");
    if (savedDate) {
      setLastPasswordUpdate(new Date(savedDate));
    }
  }, []);

  // --- Apariencia ---
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // --- Idioma ---
  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  // --- Notificaciones ---
  const toggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-texto dark:text-text-primary-dark">
          Configuración ⚙️
        </h1>
        <p className="text-texto/70 dark:text-text-secondary-dark mt-1">
          Ajusta las preferencias básicas de tu cuenta y del sistema.
        </p>
      </div>

      {/* Apariencia */}
      <div className="bg-fondo dark:bg-card-dark shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaSun className="text-primary text-xl" />
          <h2 className="text-lg font-semibold text-texto dark:text-text-primary-dark">
            Apariencia
          </h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => toggleTheme("light")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              theme === "light"
                ? "bg-primary text-white shadow-md"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <FaSun /> Modo Claro
          </button>
          <button
            onClick={() => toggleTheme("dark")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              theme === "dark"
                ? "bg-primary text-white shadow-md"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <FaMoon /> Modo Oscuro
          </button>
        </div>
      </div>

      {/* Idioma */}
      <div className="bg-fondo dark:bg-card-dark shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaGlobe className="text-primary text-xl" />
          <h2 className="text-lg font-semibold text-texto dark:text-text-primary-dark">
            Idioma
          </h2>
        </div>
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
        <p className="text-sm text-texto/70 dark:text-text-secondary-dark mt-2">
          Idioma actual: {language === "es" ? "Español" : "Inglés"}
        </p>
      </div>

      {/* Notificaciones */}
      <div className="bg-fondo dark:bg-card-dark shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaBell className="text-primary text-xl" />
          <h2 className="text-lg font-semibold text-texto dark:text-text-primary-dark">
            Notificaciones
          </h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.alerts}
              onChange={() => toggleNotification("alerts")}
              className="accent-primary"
            />
            Recibir alertas de stock bajo
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.reminders}
              onChange={() => toggleNotification("reminders")}
              className="accent-primary"
            />
            Recordatorios de citas
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.news}
              onChange={() => toggleNotification("news")}
              className="accent-primary"
            />
            Noticias y actualizaciones del sistema
          </label>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-fondo dark:bg-card-dark shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaLock className="text-primary text-xl" />
          <h2 className="text-lg font-semibold text-texto dark:text-text-primary-dark">
            Seguridad
          </h2>
        </div>
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Cambiar contraseña
        </button>

        {lastPasswordUpdate && (
          <p className="text-sm text-texto/70 dark:text-text-secondary-dark mt-3">
            Última actualización:{" "}
            {lastPasswordUpdate.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            a las{" "}
            {lastPasswordUpdate.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          const savedDate = localStorage.getItem("lastPasswordUpdate");
          if (savedDate) setLastPasswordUpdate(new Date(savedDate));
        }}
      />
    </div>
  );
}