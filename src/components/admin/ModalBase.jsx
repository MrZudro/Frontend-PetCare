export default function ModalBase({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-3xl p-6 animate-fadeIn">
        {/* Header */}
        <h2 className="text-xl font-bold text-white bg-primary px-4 py-2 rounded-lg mb-6">
          {title}
        </h2>

        {/* Contenido dinámico */}
        <div className="max-h-[70vh] overflow-y-auto space-y-6">
          {children}
        </div>

        {/* Footer con acciones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
          >
            Cancelar
          </button>
          {actions}
        </div>
      </div>
    </div>
  );
}