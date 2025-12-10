import { useState, useEffect } from "react";
import ModalBase from "./ModalBase";

export default function ServiceModal({ isOpen, onClose, onSave, servicio }) {
  const [formData, setFormData] = useState({
    name: "",
    descripcion: "",
    precio: 0,
    estado: "activo",
    foto: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (servicio) {
      setFormData(servicio);
    } else {
      setFormData({
        name: "",
        descripcion: "",
        precio: 0,
        estado: "activo",
        foto: ""
      });
    }
    setLoading(false);
    setSuccess(false);
  }, [servicio, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
      onSave(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={servicio ? "Editar Servicio" : "Crear Servicio"}
      actions={
        <button
          onClick={handleSubmit}
          disabled={loading}
          aria-label="Guardar servicio"
          className={`px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-primary to-primary-hover text-white hover:scale-105"}`}
        >
          {loading && (
            <span
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            ></span>
          )}
          {success ? "Guardado ✅" : loading ? "Guardando..." : "Guardar"}
        </button>
      }
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        aria-describedby="service-modal-description"
      >
        <h2 id="service-modal-title" className="sr-only">
          {servicio ? "Editar Servicio" : "Crear Servicio"}
        </h2>
        <div id="service-modal-description" className="sr-only">
          Formulario para crear o editar un servicio en el sistema.
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="name">Nombre del servicio</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-label="Nombre del servicio"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="foto">Foto (URL)</label>
          <input
            id="foto"
            type="text"
            name="foto"
            value={formData.foto}
            onChange={handleChange}
            aria-label="URL de la foto del servicio"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            aria-label="Precio del servicio"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            aria-label="Estado del servicio"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1" htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            aria-label="Descripción del servicio"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            rows={3}
          />
        </div>
      </div>
    </ModalBase>
  );
}
