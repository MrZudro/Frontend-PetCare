// src/components/admin/EmployeesPage.jsx
import { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import employeesData from "../Data/employees.json";
import EmployeeModal from "./EmployeeModal";
import AlertMessage from "./AlertMessage";

export default function EmployeesPage() {
  // Estado base con los datos del JSON
  const [empleados, setEmpleados] = useState(Array.isArray(employeesData) ? employeesData : []);
  const [busqueda, setBusqueda] = useState("");

  // Estado para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);
  const [message, setMessage] = useState(null);

  // Filtrado dinámico
  const empleadosFiltrados = empleados.filter((e) => {
    const q = busqueda.trim().toLowerCase();
    return (
      q === "" ||
      (typeof e.name === "string" && e.name.toLowerCase().includes(q)) ||
      (typeof e.role === "string" && e.role.toLowerCase().includes(q)) ||
      (typeof e.email === "string" && e.email.toLowerCase().includes(q))
    );
  });

  const toggleEstado = (id) => {
    setEmpleados((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, estado: e.estado === "activo" ? "inactivo" : "activo" } : e
      )
    );
  };

  const handleSave = (nuevoEmpleado) => {
    const normalizado = {
      ...nuevoEmpleado,
      estado: (nuevoEmpleado.estado ?? "activo").toLowerCase(),
      name: nuevoEmpleado.name ?? "",
      role: nuevoEmpleado.role ?? "",
      email: nuevoEmpleado.email ?? ""
    };

    if (empleadoEdit) {
      // Edición
      setEmpleados((prev) =>
        prev.map((e) => (e.id === empleadoEdit.id ? { ...normalizado, id: empleadoEdit.id } : e))
      );
      setMessage({ type: "success", text: "Empleado actualizado correctamente." });
    } else {
      // Creación
      setEmpleados((prev) => {
        const nextId = prev.length ? Math.max(...prev.map((x) => Number(x.id) || 0)) + 1 : 1;
        return [...prev, { ...normalizado, id: nextId }];
      });
      setMessage({ type: "success", text: "Empleado registrado correctamente." });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <AlertMessage type={message?.type} text={message?.text} />

      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-texto dark:text-text-primary-dark">Gestión de Empleados</h1>
        <button
          onClick={() => {
            setEmpleadoEdit(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <FaPlus /> Registrar Empleado
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
            placeholder="Buscar por nombre, rol o correo..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-fondo dark:bg-card-dark"
          />
        </div>
      </div>

      {/* Listado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empleadosFiltrados.map((e) => (
          <div key={e.id} className="bg-fondo dark:bg-card-dark shadow-lg rounded-lg p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-texto dark:text-text-primary-dark">
                {e.name || "Sin nombre"}
              </h3>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                Rol: {e.role || "—"}
              </p>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                Correo: {e.email || "—"}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setEmpleadoEdit(e);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 text-primary hover:text-primary-hover"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => toggleEstado(e.id)}
                className={`flex items-center gap-2 ${
                  e.estado === "activo" ? "text-green-600" : "text-red-600"
                }`}
              >
                {e.estado === "activo" ? <FaToggleOn /> : <FaToggleOff />}
                {e.estado?.charAt(0).toUpperCase() + e.estado?.slice(1) || "Sin estado"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        empleado={empleadoEdit}
      />
    </div>
  );
}