import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import products from "../Data/products.json";

export default function ProductsPage() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [stockFiltro, setStockFiltro] = useState("Todos");
  const [mostrarPanelStock, setMostrarPanelStock] = useState(false);
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const toLower = (v) => (typeof v === "string" ? v.toLowerCase() : "");
  const strIncludes = (value, query) =>
    toLower(value).includes(toLower(query));

  const getEstado = (p) => toLower(p?.estado || "");
  const getNombre = (p) => p?.name || "";
  const getCodigo = (p) => p?.codigo || "";
  const getPrecio = (p) => p?.price || "";
  const getStock = (p) => (typeof p?.stock === "number" ? p.stock : 0);

  const stockOpciones = [
    { label: "Todos", match: () => true, value: "Todos" },
    { label: "Con stock disponible", match: (p) => getStock(p) > 0, value: "Con stock" },
    { label: "Stock bajo (≤ 5 uds)", match: (p) => getStock(p) > 0 && getStock(p) <= 5, value: "Stock bajo" },
    { label: "Sin stock", match: (p) => getStock(p) === 0, value: "Sin stock" }
  ];

  const estadoOpciones = [
    { label: "Todos", value: "Todos" },
    { label: "Activo", value: "activo" },
    { label: "Inactivo", value: "inactivo" }
  ];

  useEffect(() => {
    const filtrados = (Array.isArray(products) ? products : []).filter((p) => {
      const coincideBusqueda =
        busqueda.trim() === "" ||
        strIncludes(getNombre(p), busqueda) ||
        strIncludes(getCodigo(p), busqueda);

      const estadoProducto = getEstado(p);
      const coincideEstado =
        estadoFiltro === "Todos" || estadoProducto === estadoFiltro;

      const s = getStock(p);
      const coincideStock =
        stockFiltro === "Todos" ||
        (stockFiltro === "Con stock" && s > 0) ||
        (stockFiltro === "Stock bajo" && s > 0 && s <= 5) ||
        (stockFiltro === "Sin stock" && s === 0);

      return coincideBusqueda && coincideEstado && coincideStock;
    });

    setProductosFiltrados(filtrados);
  }, [busqueda, estadoFiltro, stockFiltro]);

  return (
    <div className="px-6 pb-6 space-y-6 relative">
      {/* Título y botón */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h2 className="text-5xl font-bold text-gray-800 dark:text-white mt-6">Productos</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 mt-2 md:mt-0">
          <FaPlus /> Crear producto
        </button>
      </div>

      {/* Filtros visuales */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 space-y-6">
        {/* Buscador + botón de filtro */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-4 relative">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o código"
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm w-full"
            />
          </div>

          {/* Botón y panel superpuesto */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setMostrarPanelStock(!mostrarPanelStock)}
              className="flex items-center gap-2 px-3 py-2 mt-4 md:mt-0 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-teal-500 hover:text-white transition text-sm"
            >
              <FaFilter /> Stock
            </button>

            {mostrarPanelStock && (
              <div className="absolute top-full left-0 mt-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl w-full md:w-96 p-4 space-y-4 z-50">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Filtrar por stock</h3>
                <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-100">
                  {stockOpciones.map((opcion, i) => {
                    const count = products.filter(opcion.match).length;
                    const selected = stockFiltro === opcion.value;
                    return (
                      <li
                        key={i}
                        onClick={() => setStockFiltro(opcion.value)}
                        className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition ${
                          selected
                            ? "bg-teal-600 text-white font-medium"
                            : "hover:bg-teal-100 dark:hover:bg-teal-700"
                        }`}
                      >
                        <span>{opcion.label}</span>
                        <span>{count} productos</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex justify-between pt-4 text-sm">
                  <button
                    onClick={() => setStockFiltro("Todos")}
                    className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-teal-500 hover:text-white transition"
                  >
                    Limpiar filtro
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMostrarPanelStock(false)}
                      className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-teal-500 hover:text-white transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => setMostrarPanelStock(false)}
                      className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filtro de estado funcional */}
        <div className="flex gap-2 items-center text-sm text-gray-700 dark:text-gray-200">
          <span className="font-medium">Estado:</span>
          {estadoOpciones.map((opcion, i) => (
            <button
              key={i}
              onClick={() => setEstadoFiltro(opcion.value)}
              className={`px-3 py-1 rounded-full transition ${
                estadoFiltro === opcion.value
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-teal-500 hover:text-white"
              }`}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>


      {/* Tarjetas de producto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden flex flex-col p-4 space-y-2"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{p.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Código:</span> {p.codigo} - {p.categoria}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Stock:</span> {p.stock} unidades
              {p.stock === 0 && (
                <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 font-medium">
                  Sin stock
                </span>
              )}
              {p.stock > 0 && p.stock <= 5 && (
                <span className="ml-2 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
                  Stock bajo
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Precio:</span>{" "}
              {typeof p.price === "number"
              ? p.price.toLocaleString("es-CO", { style: "currency", currency: "COP" })
              : "-"}
              </p>

            {p.mascotas && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Mascotas:</span> {p.mascotas}
              </p>
            )}
            {p.edad && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Edad:</span> {p.edad}
              </p>
            )}
            {p.presentacion && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Presentación:</span> {p.presentacion}
              </p>
            )}
            {p.peso && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Peso:</span> {p.peso}
              </p>
            )}
            {p.vencimiento && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Fecha de vencimiento:</span> {p.vencimiento}
              </p>
            )}
            <div className="flex justify-end pt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  p.estado === "activo"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}