// src/components/admin/VaccinesPage.jsx
import { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import vaccinesData from "../Data/vaccines.json";
import VaccineModal from "./VaccineModal";
import AlertMessage from "./AlertMessage";

export default function VaccinesPage() {
  // Estado base con los datos del JSON
  const [vacunas, setVacunas] = useState(Array.isArray(vaccinesData) ? vaccinesData : []);
  const [busqueda, setBusqueda] = useState("");

  // Estado para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vacunaEdit, setVacunaEdit] = useState(null);
  const [message, setMessage] = useState(null);

  // Filtrado dinámico
  const vacunasFiltradas = vacunas.filter((v) => {
    const q = busqueda.trim().toLowerCase();
    return (
      q === "" ||
      (typeof v.name === "string" && v.name.toLowerCase().includes(q)) ||
      (typeof v.descripcion === "string" && v.descripcion.toLowerCase().includes(q)) ||
      (typeof v.lot === "string" && v.lot.toLowerCase().includes(q))
    );
  });

  const toggleEstado = (id) => {
    setVacunas((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, estado: v.estado === "activo" ? "inactivo" : "activo" } : v
      )
    );
  };

  const handleSave = (nuevaVacuna) => {
    const normalizado = {
      ...nuevaVacuna,
      estado: (nuevaVacuna.estado ?? "activo").toLowerCase(),
      descripcion: nuevaVacuna.descripcion ?? "",
      name: nuevaVacuna.name ?? "",
      lot: nuevaVacuna.lot ?? "",
      date: nuevaVacuna.date ?? ""
    };

    if (vacunaEdit) {
      // Edición
      setVacunas((prev) =>
        prev.map((v) => (v.id === vacunaEdit.id ? { ...normalizado, id: vacunaEdit.id } : v))
      );
      setMessage({ type: "success", text: "Vacuna actualizada correctamente." });
    } else {
      // Creación
      setVacunas((prev) => {
        const nextId = prev.length ? Math.max(...prev.map((x) => Number(x.id) || 0)) + 1 : 1;
        return [...prev, { ...normalizado, id: nextId }];
      });
      setMessage({ type: "success", text: "Vacuna registrada correctamente." });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <AlertMessage type={message?.type} text={message?.text} />

      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-texto dark:text-text-primary-dark">Gestión de Vacunas</h1>
        <button
          onClick={() => {
            setVacunaEdit(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <FaPlus /> Registrar Vacuna
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/40" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, lote o descripción..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-fondo dark:bg-card-dark"
          />
        </div>
      </div>

      {/* Listado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vacunasFiltradas.map((v) => (
          <div key={v.id} className="bg-fondo dark:bg-card-dark shadow-lg rounded-lg p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-texto dark:text-text-primary-dark">
                {v.name || "Sin nombre"}
              </h3>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                Lote: {v.lot || "—"}
              </p>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                Fecha: {v.date || "—"}
              </p>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                {v.descripcion || "Sin descripción"}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setVacunaEdit(v);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 text-primary hover:text-primary-hover"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => toggleEstado(v.id)}
                className={`flex items-center gap-2 ${
                  v.estado === "activo" ? "text-green-600" : "text-red-600"
                }`}
              >
                {v.estado === "activo" ? <FaToggleOn /> : <FaToggleOff />}
                {v.estado?.charAt(0).toUpperCase() + v.estado?.slice(1) || "Sin estado"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <VaccineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        vacuna={vacunaEdit}
      />
    </div>
  );
}