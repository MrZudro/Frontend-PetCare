export default function ConfiguracionPage() {
  const categorias = ["Servicios", "Productos", "Inventario"];
  const usuarios = ["María Gómez (Administrador)", "Carlos Pérez (Veterinario)"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Configuración
      </h1>

      {/* Gestión de categorías */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Categorías
        </h2>
        <ul className="space-y-2">
          {categorias.map((c, i) => (
            <li
              key={i}
              className="flex justify-between items-center border-b pb-2 text-gray-700 dark:text-gray-300"
            >
              {c}
              <button className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 text-sm">
                Editar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Gestión de usuarios */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Usuarios
        </h2>
        <ul className="space-y-2">
          {usuarios.map((u, i) => (
            <li
              key={i}
              className="flex justify-between items-center border-b pb-2 text-gray-700 dark:text-gray-300"
            >
              {u}
              <button className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 text-sm">
                Editar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}