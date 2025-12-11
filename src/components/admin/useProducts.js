// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import productsService from "../../services/productsService";

export default function useProducts() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Cargar productos desde el backend ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsService.getAll();
        setProductos(response.data);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Filtrado dinámico ---
  const productosFiltrados = productos.filter((p) => {
    const q = busqueda.trim().toLowerCase();
    return (
      q === "" ||
      (typeof p.name === "string" && p.name.toLowerCase().includes(q)) ||
      (typeof p.descripcion === "string" && p.descripcion.toLowerCase().includes(q)) ||
      (typeof p.codigo === "string" && p.codigo.toLowerCase().includes(q))
    );
  });

  // --- Activar / Desactivar producto (este es tu "eliminar") ---
  const toggleEstado = async (id) => {
    try {
      const producto = productos.find((p) => p.id === id);
      if (!producto) return;

      const updated = {
        ...producto,
        estado: producto.estado === "activo" ? "inactivo" : "activo",
      };

      await productsService.update(id, updated);
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setError("Error al cambiar estado del producto.");
    }
  };

  // --- Guardar nuevo o editar producto ---
  const handleSave = async (nuevoProducto, productoEdit) => {
    try {
      if (productoEdit) {
        const response = await productsService.update(productoEdit.id, nuevoProducto);
        const updated = response.data;
        setProductos((prev) =>
          prev.map((p) => (p.id === productoEdit.id ? updated : p))
        );
      } else {
        const response = await productsService.create(nuevoProducto);
        const created = response.data;
        setProductos((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setError("Error al guardar producto.");
    }
  };

  return {
    productos,
    productosFiltrados,
    busqueda,
    setBusqueda,
    toggleEstado, // 👈 este es el botón de activo/inactivo
    handleSave,
    loading,
    error,
  };
}
