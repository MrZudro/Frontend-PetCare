export default function DeleteXh({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-2">¿Estás seguro?</h2>
        <p className="text-sm text-[var(--color-texto)]">
          Tu cuenta será desactivada y perderás el acceso. 
          No se eliminarán facturas, pedidos ni historial de tus mascotas.
        </p>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="btnCancel">Cancelar</button>
          <button onClick={onConfirm} className="bg-[var(--color-alerta)] text-white px-3 py-2 rounded">
            Desactivar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
