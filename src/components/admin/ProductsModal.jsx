import { useState, useEffect } from "react";
import AlertMessage from "./AlertMessage";

export default function ProductModal({ isOpen, onClose, onSave, producto }) {
  const [formData, setFormData] = useState({
    name: "",
    picture: "",
    brand: "",
    description: "",
    sku: "",
    price: 0,
    stock: 0,
    subcategoriaIds: [],
    isActive: "ACTIVE"
  });

  const [errors, setErrors] = useState({});
  const [localMessage, setLocalMessage] = useState(null);

  // Reinicia el estado cada vez que el modal se abre
  useEffect(() => {
    if (isOpen) {
      if (producto) {
        setFormData(producto);
      } else {
        setFormData({
          name: "",
          picture: "",
          brand: "",
          description: "",
          sku: "",
          price: 0,
          stock: 0,
          subcategoriaIds: [],
          isActive: "ACTIVE"
        });
      }
    }
  }, [isOpen, producto]);

  // Mensajes temporales
  useEffect(() => {
    if (localMessage) {
      const timer = setTimeout(() => setLocalMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [localMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };
    if (name === "name" && !value.trim()) {
      newErrors.name = "El nombre del producto es obligatorio.";
    } else {
      delete newErrors.name;
    }
    if (name === "price") {
      if (!value.trim()) {
        newErrors.price = "El precio es obligatorio.";
      } else if (Number(value) <= 0) {
        newErrors.price = "El precio debe ser mayor a 0.";
      } else {
        delete newErrors.price;
      }
    }
    if (name === "stock") {
      if (value === "") {
        newErrors.stock = "El stock es obligatorio.";
      } else if (Number(value) < 0) {
        newErrors.stock = "El stock no puede ser negativo.";
      } else {
        delete newErrors.stock;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.price || !formData.stock || Object.keys(errors).length > 0) {
      setLocalMessage({ type: "error", text: "Corrige los errores antes de guardar." });
      return;
    }
    onSave(formData);
    setLocalMessage({ type: "success", text: "Producto guardado con éxito." });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-3xl p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-white bg-primary px-4 py-2 rounded-lg mb-6">
          {producto ? "Editar Producto" : "Crear Producto"}
        </h2>

        <AlertMessage type={localMessage?.type} text={localMessage?.text} />

        <div className="max-h-[70vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Alimento Premium 10kg"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-semibold mb-1">Imagen (URL)</label>
              <input
                type="text"
                name="picture"
                value={formData.picture}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-semibold mb-1">Marca</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Ej: Purina"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-semibold mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Código único"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold mb-1">Precio</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.stock && <p className="text-xs text-red-600">{errors.stock}</p>}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                rows={3}
              />
            </div>

            {/* Subcategorías */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Subcategorías</label>
              <select
                multiple
                name="subcategoriaIds"
                value={formData.subcategoriaIds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subcategoriaIds: Array.from(e.target.selectedOptions, opt => opt.value)
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="1">Medicamentos</option>
                <option value="2">Accesorios</option>
                <option value="3">Alimentos</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold mb-1">Estado</label>
              <select
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg shadow-md hover:scale-105 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}