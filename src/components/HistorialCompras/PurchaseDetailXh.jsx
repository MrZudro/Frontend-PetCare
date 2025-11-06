export default function PurchaseDetailXh({ purchase, onHelp }) {
  return (
    <div className="border p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-[var(--color-texto)]">
          <span className="font-semibold">Fecha:</span> {purchase.date}
        </p>
        <p className="text-sm text-[var(--color-texto)]">
          <span className="font-semibold">Valor:</span> ${purchase.total}
        </p>
        <p className="text-sm text-[var(--color-texto)]">
          <span className="font-semibold">Impuestos:</span> ${purchase.tax}
        </p>
        {purchase.detail && (
          <p className="text-sm text-[var(--color-texto)]">
            <span className="font-semibold">Detalle:</span> {purchase.detail}
          </p>
        )}
      </div>

      <button
        onClick={onHelp}
        className="styleButton bg-[var(--color-acento-primario)] hover:bg-[var(--color-primary-hover)] text-[var(--color-texto-secundario)]"
      >
        Reportar ayuda/inconformidad
      </button>
    </div>
  );
}
