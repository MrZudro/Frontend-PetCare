// src/components/admin/ProductsPage.jsx
import { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import ProductModal from "./ProductsModal";
import useProducts from "./useProducts"; // 👈 ajusta la ruta según tu estructura

export default function ProductsPage() {
  const {
    productosFiltrados,
    busqueda,
    setBusqueda,
    toggleEstado,
    handleSave,
    loading,
    error,
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold">
        Cargando productos...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 font-bold">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-texto dark:text-text-primary-dark">
          Gestión de Productos
        </h1>
        <button
          onClick={() => {
            setProductoEdit(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <FaPlus /> Crear Producto
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
            placeholder="Buscar por nombre, descripción o código..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-fondo dark:bg-card-dark"
          />
        </div>
      </div>

      {/* Listado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((p) => (
          <div
            key={p.id}
            className="bg-fondo dark:bg-card-dark shadow-lg rounded-lg p-4 space-y-3"
          >
            <img
              src={p.foto}
              alt={p.name || "Producto"}
              className="w-full h-40 object-cover rounded-lg bg-gray-100 dark:bg-gray-800"
            />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-texto dark:text-text-primary-dark">
                {p.name || "Sin nombre"}
              </h3>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                {p.descripcion || "Sin descripción"}
              </p>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                Código: {p.codigo || "—"}
              </p>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                Precio: ${typeof p.precio === "number" ? p.precio : 0}
              </p>
              <p className="text-sm text-texto/70 dark:text-text-secondary-dark">
                Stock: {typeof p.stock === "number" ? p.stock : 0}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              {/* Editar */}
              <button
                onClick={() => {
                  setProductoEdit(p);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 text-primary hover:text-primary-hover"
              >
                <FaEdit /> Editar
              </button>

              {/* Activar/Desactivar */}
              <button
                onClick={() => toggleEstado(p.id)}
                className={`flex items-center gap-2 ${
                  p.estado === "activo" ? "text-green-600" : "text-red-600"
                }`}
              >
                {p.estado === "activo" ? <FaToggleOn /> : <FaToggleOff />}
                {p.estado?.charAt(0).toUpperCase() + p.estado?.slice(1) || "Sin estado"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(nuevoProducto) => handleSave(nuevoProducto, productoEdit)}
        producto={productoEdit}
      />
    </div>
  );
}