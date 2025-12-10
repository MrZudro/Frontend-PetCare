import { useState, useEffect } from "react";
import AlertMessage from "./AlertMessage";

export default function EmployeeModal({ isOpen, onClose, onSave, empleado }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    estado: "activo"
  });

  const [errors, setErrors] = useState({});
  const [localMessage, setLocalMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (empleado) {
        setFormData(empleado);
      } else {
        setFormData({
          name: "",
          role: "",
          email: "",
          estado: "activo"
        });
      }
    }
  }, [isOpen, empleado]);

  // Mensajes temporales (desaparecen en 3s)
  useEffect(() => {
    if (localMessage) {
      const timer = setTimeout(() => setLocalMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [localMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };
    if (name === "name" && !value.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    } else {
      delete newErrors.name;
    }
    if (name === "role" && !value.trim()) {
      newErrors.role = "El rol es obligatorio.";
    } else {
      delete newErrors.role;
    }
    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "El correo es obligatorio.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Introduce un correo válido.";
      } else {
        delete newErrors.email;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.role.trim() || !formData.email.trim() || Object.keys(errors).length > 0) {
      setLocalMessage({ type: "error", text: "Corrige los errores antes de guardar." });
      return;
    }
    onSave(formData);
    setLocalMessage({ type: "success", text: "Empleado guardado con éxito." });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-3xl p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-white bg-primary px-4 py-2 rounded-lg mb-6">
          {empleado ? "Editar Empleado" : "Registrar Empleado"}
        </h2>

        {/* Mensaje temporal dentro del modal */}
        <AlertMessage type={localMessage?.type} text={localMessage?.text} />

        <div className="max-h-[70vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-semibold mb-1">Rol</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Ej: Veterinario"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.role && <p className="text-xs text-red-600">{errors.role}</p>}
            </div>

            {/* Correo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold mb-1">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
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