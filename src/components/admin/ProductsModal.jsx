import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { uploadImageToCloudinary } from "../../services/cloudinaryService";
import categoriesService from "../../services/categoriesService";
import subcategoriesService from "../../services/subcategoriesService";

export default function ProductModal({ isOpen, onClose, onSave, producto }) {
  const [form, setForm] = useState({
    name: "",
    picture: "",
    brand: "",
    description: "",
    sku: "",
    price: "",
    stock: "",
    categoriaId: "", // guardamos como número más abajo
    subcategoriaIds: [],
    isActive: "ACTIVO",
  });

  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [subTemp, setSubTemp] = useState([]);
  const [showSubDropdown, setShowSubDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, subsRes] = await Promise.all([
          categoriesService.getAll(),
          subcategoriesService.getAll(),
        ]);

        // Normaliza tipos a número para evitar comparaciones fallidas
        const cats = (catsRes.data || []).map((c) => ({
          ...c,
          id: Number(c.id),
        }));

        const subs = (subsRes.data || []).map((s) => ({
          ...s,
          id: Number(s.id),
          categoriaId: Number(s.categoriaId),
        }));

        setCategorias(cats);
        setSubcategorias(subs);
      } catch (err) {
        console.error("Error cargando categorías/subcategorías:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (producto) {
      const categoriaIdNum =
        producto.categoriaId !== undefined && producto.categoriaId !== null
          ? Number(producto.categoriaId)
          : "";

      const subIdsNum = Array.isArray(producto.subcategoriaIds)
        ? producto.subcategoriaIds.map((id) => Number(id))
        : [];

      setForm({
        name: producto.name || "",
        picture: producto.picture || "",
        brand: producto.brand || "",
        description: producto.description || "",
        sku: producto.sku || "",
        price: producto.price?.toString() || "",
        stock: producto.stock?.toString() || "",
        categoriaId: categoriaIdNum,
        subcategoriaIds: subIdsNum,
        isActive: producto.isActive || "ACTIVO",
      });
      setSubTemp(subIdsNum);
    } else {
      setSubTemp([]);
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Asegura tipos correctos al cambiar categoría
    if (name === "categoriaId") {
      const categoriaIdNum = value ? Number(value) : "";
      setForm((prev) => ({
        ...prev,
        categoriaId: categoriaIdNum,
        subcategoriaIds: [], // reset selección al cambiar categoría
      }));
      setSubTemp([]); // también reset temporal
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, picture: url }));
    } catch (err) {
      console.error("Error al subir imagen:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ["name", "picture", "brand", "description", "sku", "price", "stock", "categoriaId", "isActive"];
    for (const field of required) {
      const v = form[field];
      if (v === "" || v === null || v === undefined || v.toString().trim() === "") {
        alert(`El campo "${field}" es obligatorio.`);
        return;
      }
    }

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      subcategoriaIds: form.subcategoriaIds,
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  // Filtra subcategorías por categoría seleccionada (comparación numérica)
  const subcategoriasFiltradas =
    form.categoriaId !== "" && form.categoriaId !== null
      ? subcategorias.filter((sub) => sub.categoriaId === Number(form.categoriaId))
      : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-card-dark rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-texto dark:text-text-primary-dark">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required className="border rounded p-2" />
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Marca" required className="border rounded p-2" />
          <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" required className="border rounded p-2" />
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Precio" required className="border rounded p-2" />
          <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required className="border rounded p-2" />

          <select
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            required
            className="border rounded p-2"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Subcategorías tipo dropdown flotante filtradas */}
          <div className="col-span-1 sm:col-span-2 relative">
            <label className="block text-sm font-medium mb-1">Subcategorías</label>
            <button
              type="button"
              onClick={() => setShowSubDropdown((prev) => !prev)}
              className="border rounded p-2 text-left bg-white dark:bg-card-dark w-fit max-w-full"
              disabled={!form.categoriaId}
            >
              {form.subcategoriaIds.length > 0
                ? subcategorias
                    .filter((sub) => form.subcategoriaIds.includes(sub.id))
                    .map((sub) => sub.name)
                    .join(", ")
                : "Seleccionar subcategorías"}
            </button>

            {showSubDropdown && form.categoriaId && (
              <div className="absolute z-10 mt-2 w-64 max-h-60 overflow-y-auto border rounded-lg bg-white dark:bg-card-dark shadow-lg p-4 space-y-2">
                {subcategoriasFiltradas.map((sub) => (
                  <label key={sub.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={sub.id}
                      checked={subTemp.includes(sub.id)}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setSubTemp((prev) =>
                          e.target.checked ? [...prev, id] : prev.filter((sid) => sid !== id)
                        );
                      }}
                    />
                    <span>{sub.name}</span>
                  </label>
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Asegura que solo se guarden subcategorías de la categoría seleccionada
                      const validSubIds = subTemp.filter((id) =>
                        subcategoriasFiltradas.some((s) => s.id === id)
                      );
                      setForm((prev) => ({ ...prev, subcategoriaIds: validSubIds }));
                      setShowSubDropdown(false);
                    }}
                    className="px-3 py-1 rounded bg-primary text-white hover:bg-primary-hover text-sm"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Imagen con estilo visual sin preview */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Imagen del producto</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="flex flex-col items-center gap-2 text-primary cursor-pointer">
                <FaCloudUploadAlt size={24} />
                <span className="text-sm">Haz clic para subir o reemplazar imagen</span>
              </label>
            </div>
          </div>

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" required className="col-span-1 sm:col-span-2 border rounded p-2" />

          <select name="isActive" value={form.isActive} onChange={handleChange} required className="col-span-1 sm:col-span-2 border rounded p-2">
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>

          <div className="col-span-1 sm:col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}