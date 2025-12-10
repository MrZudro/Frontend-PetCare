import { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import ServiceModal from "./ServiceModal";
import useServices from "./useServices";

export default function ServicesPage() {
  const {
    serviciosFiltrados,
    busqueda,
    setBusqueda,
    toggleEstado,
    handleSave
  } = useServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicioEdit, setServicioEdit] = useState(null);

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-texto dark:text-text-primary-dark">Gestión de Servicios</h1>
        <button
          onClick={() => { setServicioEdit(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <FaPlus /> Crear Servicio
        </button>
      </div>

      {/* Filtro */}
      <div className="relative w-full md:w-1/3">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/40" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar servicio..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-fondo dark:bg-card-dark"
        />
      </div>

      {/* Listado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviciosFiltrados.map(s => (
          <div key={s.id} className="bg-fondo dark:bg-card-dark shadow-lg rounded-lg p-4 space-y-2">
            <img src={s.foto} alt={s.name} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="text-lg font-semibold text-texto dark:text-text-primary-dark">{s.name}</h3>
            <p className="text-sm text-texto/70 dark:text-text-secondary-dark">{s.descripcion}</p>
            <p className="text-sm text-texto/70 dark:text-text-secondary-dark">Precio: ${s.precio}</p>
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => { setServicioEdit(s); setIsModalOpen(true); }}
                className="flex items-center gap-2 text-primary hover:text-primary-hover"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => toggleEstado(s.id)}
                className={`flex items-center gap-2 ${s.estado === "activo" ? "text-green-600" : "text-red-600"}`}
              >
                {s.estado === "activo" ? <FaToggleOn /> : <FaToggleOff />}
                {s.estado?.charAt(0).toUpperCase() + s.estado?.slice(1) || "Sin estado"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(nuevoServicio) => handleSave(nuevoServicio, servicioEdit)}
        servicio={servicioEdit}
      />
    </div>
  );
}