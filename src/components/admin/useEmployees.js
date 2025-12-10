import { useState } from "react";
import employeesData from "../Data/employees.json";

export default function useEmployees() {
  const [empleados, setEmpleados] = useState(Array.isArray(employeesData) ? employeesData : []);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos");

  // Filtrado dinámico
  const empleadosFiltrados = empleados.filter(e => {
    const coincideCedula = typeof e.cedula === "string" && e.cedula.includes(busqueda);
    const coincideRol = rolFiltro === "Todos" || e.role === rolFiltro;
    return coincideCedula && coincideRol;
  });

  // Cambiar estado activo/inactivo
  const toggleEstado = (id) => {
    setEmpleados(prev =>
      prev.map(e =>
        e.id === id ? { ...e, estado: e.estado === "activo" ? "inactivo" : "activo" } : e
      )
    );
  };

  // Guardar nuevo o editar empleado
  const handleSave = (nuevoEmpleado, empleadoEdit) => {
    if (empleadoEdit) {
      setEmpleados(prev =>
        prev.map(e => e.id === empleadoEdit.id ? { ...nuevoEmpleado, id: empleadoEdit.id } : e)
      );
    } else {
      setEmpleados(prev => [...prev, { ...nuevoEmpleado, id: prev.length + 1 }]);
    }
  };

  return {
    empleados,
    empleadosFiltrados,
    busqueda,
    setBusqueda,
    rolFiltro,
    setRolFiltro,
    toggleEstado,
    handleSave
  };
}