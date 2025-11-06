export default function ModalXh({ message, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <p className="text-[var(--color-texto)] text-sm">{message}</p>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="btnCancel">Cancelar</button>
          <button onClick={onConfirm} className="styleButton">
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
