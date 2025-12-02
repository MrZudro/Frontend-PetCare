const ActivityItem = ({ titulo, descripcion, tiempo, tipo }) => {
  return (
  <li className="shadow-2xl rounded-lg border-b py-4 text-texto dark:text-(--color-text-secondary) px-2">
    <p className="text-sm font-medium text-gray-800 dark:text-white mb-2">{titulo}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {descripcion} <span className="mx-1 text-gray-400">·</span> {tiempo}
      </p>
      <span
        className={`self-start px-2 py-0.5 rounded-full text-white text-[11px] font-semibold ${
          tipo === "Servicio"
            ? "bg-blue-600"
            : tipo === "Producto"
            ? "bg-green-600"
            : "bg-red-600"
        }`}
      >
        {tipo}
      </span>
    </li>
  );
};

export default ActivityItem;