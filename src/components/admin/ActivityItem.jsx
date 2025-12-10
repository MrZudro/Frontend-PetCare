const ActivityItem = ({ titulo, descripcion, tiempo, tipo }) => {
  return (
    <li className="shadow-2xl rounded-lg border-b py-2 px-2 text-[var(--color-texto)] dark:text-[var(--color-text-primary)]">
      <p className="text-sm font-medium text-[var(--color-texto)] dark:text-[var(--color-text-primary)] mb-2">{titulo}</p>
      <p className="text-sm text-[var(--color-texto)]/70 dark:text-[var(--color-text-secondary)] mb-2">
        {descripcion} <span className="mx-1 text-[var(--color-texto)]/50 dark:text-[var(--color-text-secondary)]">·</span> {tiempo}
      </p>
      <span
        className={`self-start px-2 py-0.5 rounded-full text-white text-[11px] font-semibold ${
          tipo === "Servicio" ? "bg-[var(--color-acento-secundario)]"
          : tipo === "Producto" ? "bg-[var(--color-primary)]"
          : "bg-[var(--color-acento-primario)]"
        }`}
      >
        {tipo}
      </span>
    </li>
  );
};

export default ActivityItem;