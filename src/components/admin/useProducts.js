import { useState } from "react";
import productsData from "../Data/products.json";

export default function useProducts() {
  const [productos, setProductos] = useState(Array.isArray(productsData) ? productsData : []);
  const [busqueda, setBusqueda] = useState("");

  // Filtrado dinámico seguro
  const productosFiltrados = productos.filter((p) => {
    const q = busqueda.trim().toLowerCase();
    return (
      q === "" ||
      (typeof p.name === "string" && p.name.toLowerCase().includes(q)) ||
      (typeof p.descripcion === "string" && p.descripcion.toLowerCase().includes(q)) ||
      (typeof p.codigo === "string" && p.codigo.toLowerCase().includes(q))
    );
  });

  // Cambiar estado activo/inactivo
  const toggleEstado = (id) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: p.estado === "activo" ? "inactivo" : "activo" } : p
      )
    );
  };

  // Guardar nuevo o editar producto
  const handleSave = (nuevoProducto, productoEdit) => {
    const normalizado = {
      ...nuevoProducto,
      precio: Number(nuevoProducto.precio ?? 0),
      stock: Number(nuevoProducto.stock ?? 0),
      estado: (nuevoProducto.estado ?? "activo").toLowerCase(),
      foto: nuevoProducto.foto ?? "",
      descripcion: nuevoProducto.descripcion ?? "",
      name: nuevoProducto.name ?? "",
      codigo: nuevoProducto.codigo ?? "",
    };

    if (productoEdit) {
      // Edición
      setProductos((prev) =>
        prev.map((p) => (p.id === productoEdit.id ? { ...normalizado, id: productoEdit.id } : p))
      );
    } else {
      // Creación (id incremental robusto)
      setProductos((prev) => {
        const nextId = prev.length ? Math.max(...prev.map((x) => Number(x.id) || 0)) + 1 : 1;
        return [...prev, { ...normalizado, id: nextId }];
      });
    }
  };

  return {
    productos,
    productosFiltrados,
    busqueda,
    setBusqueda,
    toggleEstado,
    handleSave
  };
}