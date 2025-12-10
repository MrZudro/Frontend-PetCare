import { useState, useEffect } from "react";
import AlertMessage from "./AlertMessage";

export default function VaccineModal({ isOpen, onClose, onSave, vacuna }) {
  const [formData, setFormData] = useState({
    name: "",
    lot: "",
    date: "",
    estado: "activo",
    descripcion: ""
  });

  const [errors, setErrors] = useState({});
  const [localMessage, setLocalMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (vacuna) {
        setFormData(vacuna);
      } else {
        setFormData({
          name: "",
          lot: "",
          date: "",
          estado: "activo",
          descripcion: ""
        });
      }
    }
  }, [isOpen, vacuna]);

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
      newErrors.name = "El nombre de la vacuna es obligatorio.";
    } else {
      delete newErrors.name;
    }
    if (name === "lot" && !value.trim()) {
      newErrors.lot = "El número de lote es obligatorio.";
    } else {
      delete newErrors.lot;
    }
    if (name === "date" && !value.trim()) {
      newErrors.date = "La fecha es obligatoria.";
    } else {
      delete newErrors.date;
    }
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.lot.trim() || !formData.date.trim() || Object.keys(errors).length > 0) {
      setLocalMessage({ type: "error", text: "Corrige los errores antes de guardar." });
      return;
    }
    onSave(formData);
    setLocalMessage({ type: "success", text: "Vacuna guardada con éxito." });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-3xl p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-white bg-primary px-4 py-2 rounded-lg mb-6">
          {vacuna ? "Editar Vacuna" : "Registrar Vacuna"}
        </h2>

        {/* Mensaje temporal dentro del modal */}
        <AlertMessage type={localMessage?.type} text={localMessage?.text} />

        <div className="max-h-[70vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold mb-1">Nombre de la vacuna</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Rabia"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Lote */}
            <div>
              <label className="block text-sm font-semibold mb-1">Número de lote</label>
              <input
                type="text"
                name="lot"
                value={formData.lot}
                onChange={handleChange}
                placeholder="Ej: L12345"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.lot && <p className="text-xs text-red-600">{errors.lot}</p>}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold mb-1">Fecha de aplicación</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                rows={3}
              />
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