import { useState } from "react";
import vaccinesData from "../Data/vaccines.json";

export default function useVaccines() {
  const [vacunas, setVacunas] = useState(Array.isArray(vaccinesData) ? vaccinesData : []);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  // Filtrado dinámico seguro
  const vacunasFiltradas = vacunas.filter((v) => {
    const q = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      q === "" ||
      (typeof v.name === "string" && v.name.toLowerCase().includes(q)) ||
      (typeof v.codigo === "string" && v.codigo.toLowerCase().includes(q));

    const coincideEstado =
      estadoFiltro === "Todos" ||
      (typeof v.estado === "string" && v.estado.toLowerCase() === estadoFiltro.toLowerCase());

    return coincideBusqueda && coincideEstado;
  });

  // Cambiar estado activo/inactivo
  const toggleEstado = (id) => {
    setVacunas((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, estado: v.estado === "activo" ? "inactivo" : "activo" } : v
      )
    );
  };

  // Guardar nueva o editar vacuna
  const handleSave = (nuevaVacuna, vacunaEdit) => {
    const normalizada = {
      ...nuevaVacuna,
      stock: Number(nuevaVacuna.stock ?? 0),
      estado: (nuevaVacuna.estado ?? "activo").toLowerCase(),
      name: nuevaVacuna.name ?? "",
      codigo: nuevaVacuna.codigo ?? "",
    };

    if (vacunaEdit) {
      // Edición
      setVacunas((prev) =>
        prev.map((v) => (v.id === vacunaEdit.id ? { ...normalizada, id: vacunaEdit.id } : v))
      );
    } else {
      // Creación (id incremental robusto)
      setVacunas((prev) => {
        const nextId = prev.length ? Math.max(...prev.map((x) => Number(x.id) || 0)) + 1 : 1;
        return [...prev, { ...normalizada, id: nextId }];
      });
    }
  };

  return {
    vacunas,
    vacunasFiltradas,
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    toggleEstado,
    handleSave
  };
}