// src/hooks/useServices.js
import { useState, useEffect } from "react";
import servicesService from "../../services/servicesService.js";

export default function useServices() {
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Cargar servicios desde el backend ---
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesService.getAll();
        setServicios(response.data); // 👈 el backend devuelve lista en response.data
      } catch (err) {
        console.error("Error cargando servicios:", err);
        setError("No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // --- Filtrado dinámico ---
  const serviciosFiltrados = servicios.filter((s) => {
    const q = busqueda.trim().toLowerCase();
    return (
      q === "" ||
      (typeof s.name === "string" && s.name.toLowerCase().includes(q)) ||
      (typeof s.descripcion === "string" && s.descripcion.toLowerCase().includes(q))
    );
  });

  // --- Cambiar estado activo/inactivo ---
  const toggleEstado = async (id) => {
    try {
      const servicio = servicios.find((s) => s.id === id);
      if (!servicio) return;

      const updated = {
        ...servicio,
        estado: servicio.estado === "activo" ? "inactivo" : "activo",
      };

      await servicesService.update(id, updated);
      setServicios((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setError("Error al actualizar estado del servicio.");
    }
  };

  // --- Guardar nuevo o editar servicio ---
  const handleSave = async (nuevoServicio, servicioEdit) => {
    try {
      if (servicioEdit) {
        const response = await servicesService.update(servicioEdit.id, nuevoServicio);
        const updated = response.data;
        setServicios((prev) =>
          prev.map((s) => (s.id === servicioEdit.id ? updated : s))
        );
      } else {
        const response = await servicesService.create(nuevoServicio);
        const created = response.data;
        setServicios((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error("Error al guardar servicio:", err);
      setError("Error al guardar servicio.");
    }
  };

  // --- Eliminar servicio ---
  const handleDelete = async (id) => {
    try {
      await servicesService.delete(id);
      setServicios((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
      setError("Error al eliminar servicio.");
    }
  };

  return {
    servicios,
    serviciosFiltrados,
    busqueda,
    setBusqueda,
    toggleEstado,
    handleSave,
    handleDelete,
    loading,
    error,
  };
}