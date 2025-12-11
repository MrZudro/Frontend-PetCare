// src/components/admin/EmployeesPage.jsx
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaToggleOn, FaToggleOff, FaCalendarAlt } from "react-icons/fa";
import employeesService from "../../services/employeesService";
import EmployeeModal from "./EmployeeModal";
import ScheduleManagerModal from "./ScheduleManagerModal";
import AlertMessage from "./AlertMessage";

export default function EmployeesPage() {
  // Estado base
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);
  const [message, setMessage] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [empleadoSchedule, setEmpleadoSchedule] = useState(null);

  // Cargar empleados desde la API
  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeesService.getAll();
      // Mapear los datos de la API al formato esperado por el componente
      const empleadosMapeados = response.data.map(emp => ({
        id: emp.id,
        name: `${emp.names} ${emp.lastNames}`,
        role: emp.cargo || "Sin cargo",
        email: emp.email,
        estado: "activo", // Por defecto activo, podrías agregar un campo en el backend
        employeeCode: emp.employeeCode,
        salary: emp.salary,
        // Datos adicionales que podrían ser útiles
        names: emp.names,
        lastNames: emp.lastNames,
        phone: emp.phone,
        address: emp.address
      }));
      setEmpleados(empleadosMapeados);
    } catch (err) {
      console.error("Error cargando empleados:", err);
      setError("Error al cargar los empleados. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async (nuevoEmpleado) => {
    const normalizado = {
      ...nuevoEmpleado,
      estado: (nuevoEmpleado.estado ?? "activo").toLowerCase(),
      name: nuevoEmpleado.name ?? "",
      role: nuevoEmpleado.role ?? "",
      email: nuevoEmpleado.email ?? ""
    };

    try {
      if (empleadoEdit) {
        // Edición - llamar a la API
        await employeesService.update(empleadoEdit.id, normalizado);
        setMessage({ type: "success", text: "Empleado actualizado correctamente." });
      } else {
        // Creación - llamar a la API
        await employeesService.create(normalizado);
        setMessage({ type: "success", text: "Empleado registrado correctamente." });
      }
      // Recargar la lista de empleados
      fetchEmpleados();
    } catch (err) {
      console.error("Error guardando empleado:", err);
      setMessage({ type: "error", text: "Error al guardar el empleado. Por favor intente nuevamente." });
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-semibold mb-2">Error</p>
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchEmpleados}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
              {e.employeeCode && (
                <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                  Código: {e.employeeCode}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between items-center">
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
                  className={`flex items-center gap-2 ${e.estado === "activo" ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {e.estado === "activo" ? <FaToggleOn /> : <FaToggleOff />}
                  {e.estado?.charAt(0).toUpperCase() + e.estado?.slice(1) || "Sin estado"}
                </button>
              </div>
              <button
                onClick={() => {
                  setEmpleadoSchedule(e);
                  setIsScheduleModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg transition-colors"
              >
                <FaCalendarAlt /> Gestionar Horario
              </button>
            </div>
          </div>
        ))}
      </div>

      {empleadosFiltrados.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron empleados</p>
        </div>
      )}

      {/* Modal de Empleado */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        empleado={empleadoEdit}
      />

      {/* Modal de Gestión de Horarios */}
      <ScheduleManagerModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        empleado={empleadoSchedule}
      />
    </div>
  );
}