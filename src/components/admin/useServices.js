import { useState } from "react";
import servicesData from "../Data/services.json";

export default function useServices() {
  const [servicios, setServicios] = useState(Array.isArray(servicesData) ? servicesData : []);
  const [busqueda, setBusqueda] = useState("");

  // Filtrado dinámico seguro
  const serviciosFiltrados = servicios.filter(s =>
    busqueda.trim() === "" ||
    (typeof s.name === "string" && s.name.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Cambiar estado activo/inactivo
  const toggleEstado = (id) => {
    setServicios(prev =>
      prev.map(s =>
        s.id === id ? { ...s, estado: s.estado === "activo" ? "inactivo" : "activo" } : s
      )
    );
  };

  // Guardar nuevo o editar servicio
  const handleSave = (nuevoServicio, servicioEdit) => {
    const normalizado = {
      ...nuevoServicio,
      precio: Number(nuevoServicio.precio ?? 0),
      estado: (nuevoServicio.estado ?? "activo").toLowerCase(),
      foto: nuevoServicio.foto ?? "",
      descripcion: nuevoServicio.descripcion ?? "",
      name: nuevoServicio.name ?? "",
    };

    if (servicioEdit) {
      // Edición
      setServicios(prev =>
        prev.map(s => (s.id === servicioEdit.id ? { ...normalizado, id: servicioEdit.id } : s))
      );
    } else {
      // Creación (id incremental robusto)
      setServicios(prev => {
        const nextId = prev.length ? Math.max(...prev.map((x) => Number(x.id) || 0)) + 1 : 1;
        return [...prev, { ...normalizado, id: nextId }];
      });
    }
  };

  return {
    servicios,
    serviciosFiltrados,
    busqueda,
    setBusqueda,
    toggleEstado,
    handleSave
  };
}