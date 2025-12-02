import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import services from "../Data/services.json";

export default function ServicesPage() {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);

  useEffect(() => {
    const filtrados = services.filter((s) => {
      const coincideEstado = filtro === "Todos" || s.estado.toLowerCase() === filtro.toLowerCase();
      const coincideBusqueda = s.name.toLowerCase().includes(busqueda.toLowerCase());
      return coincideEstado && coincideBusqueda;
    });
    setServiciosFiltrados(filtrados);
  }, [filtro, busqueda]);

  return (
    <div className="px-6 pb-6 space-y-6">
      {/* Título y botón fuera del cuadro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h2 className="text-5xl font-bold text-gray-800 mt-6">Servicios</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 mt-2 md:mt-0">
          <FaPlus /> Crear servicio
        </button>
      </div>

      {/* Cuadro con buscador + filtros */}
      <div className="bg-white dark:bg-(--color-card) shadow-xl rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Buscador con ícono */}
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar servicio por nombre..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-(--color-card) text-gray-800 dark:text-white text-sm w-full"
            />
          </div>

          {/* Botones de filtro */}
          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            {["activo", "inactivo", "Todos"].map((estado, i) => (
              <button
                key={i}
                onClick={() => setFiltro(estado)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filtro.toLowerCase() === estado
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-teal-500 hover:text-white"
                }`}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listado de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviciosFiltrados.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-(--color-card) shadow-2xl rounded-lg overflow-hidden flex flex-col"
          >
            <img
              src={s.imageUrl}
              alt={s.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{s.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.description}</p>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-teal-600 font-medium">{s.clinicName}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    s.estado === "activo"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}