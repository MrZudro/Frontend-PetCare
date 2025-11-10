export default function HelpModalXh({ purchase, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[var(--color-fondo)] p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h3 className="text-lg font-semibold text-[var(--color-texto)] mb-3">
          Reporte de ayuda / inconformidad
        </h3>

        <p className="text-sm text-[var(--color-texto)] mb-4">
          Compra: {purchase.id} - Fecha: {purchase.date}
        </p>

        <form className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Asunto"
            className="border p-2 rounded w-full"
          />
          <textarea
            placeholder="Describe tu problema o inconformidad"
            className="border p-2 rounded w-full"
          />
          <button
            type="button"
            className="styleButton self-end"
            onClick={onClose}
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
}
