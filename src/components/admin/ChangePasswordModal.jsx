import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AlertMessage from "./AlertMessage";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  // Estados para mostrar/ocultar cada campo
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };
    if (name === "newPass" && value.length < 8) {
      newErrors.newPass = "La nueva contraseña debe tener al menos 8 caracteres.";
    } else {
      delete newErrors.newPass;
    }
    if (name === "confirm" && value !== formData.newPass) {
      newErrors.confirm = "Las contraseñas no coinciden.";
    } else {
      delete newErrors.confirm;
    }
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    if (!formData.current || !formData.newPass || !formData.confirm) {
      setMessage({ type: "error", text: "Completa todos los campos." });
      return;
    }
    if (Object.keys(errors).length > 0) {
      setMessage({ type: "error", text: "Corrige los errores antes de continuar." });
      return;
    }

    // 🔹 Simulación: guardar nueva contraseña y fecha en localStorage
    localStorage.setItem("userPassword", formData.newPass);
    localStorage.setItem("lastPasswordUpdate", new Date().toISOString());

    setMessage({ type: "success", text: "Contraseña actualizada con éxito." });
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-white bg-primary px-4 py-2 rounded-lg mb-6">
          Cambiar Contraseña
        </h2>

        <AlertMessage type={message?.type} text={message?.text} />

        <div className="space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña actual</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="current"
                value={formData.current}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-semibold mb-1">Nueva contraseña</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPass"
                value={formData.newPass}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPass && <p className="text-xs text-red-600">{errors.newPass}</p>}
          </div>

          {/* Confirmar nueva contraseña */}
          <div>
            <label className="block text-sm font-semibold mb-1">Confirmar nueva contraseña</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirm && <p className="text-xs text-red-600">{errors.confirm}</p>}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg shadow-md hover:scale-105 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}