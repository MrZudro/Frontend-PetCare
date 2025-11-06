
import { useState } from "react";
import PurchaseDetailXh from "./PurchaseDetailXh";
import HelpModalXh from "./HelpModalXh";

export default function PurchaseHistoryXh() {
  const [purchases, setPurchases] = useState([]);
  const [period, setPeriod] = useState({ start: "", end: "" });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleSearch = () => {
    if (period.start && period.end) {
      fetchPurchases(period.start, period.end);
    }
  };

  return (
    <div className="bg-[var(--color-fondo)] p-6 rounded-xl shadow-md w-full max-w-5xl">
      <h2 className="text-xl font-semibold text-[var(--color-texto)] mb-4">
        Historial de Compras
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="month"
          value={period.start}
          onChange={(e) => setPeriod({ ...period, start: e.target.value })}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <input
          type="month"
          value={period.end}
          onChange={(e) => setPeriod({ ...period, end: e.target.value })}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <button
          onClick={handleSearch}
          className="styleButton self-end md:self-auto"
        >
          Filtrar
        </button>
      </div>

      {loading ? (
        <p className="text-[var(--color-texto)]">Cargando...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {purchases.map((purchase) => (
            <PurchaseDetailXh
              key={purchase.id}
              purchase={purchase}
              onHelp={() => {
                setSelectedPurchase(purchase);
                setShowHelpModal(true);
              }}
            />
          ))}
        </div>
      )}

      {showHelpModal && selectedPurchase && (
        <HelpModalXh
          purchase={selectedPurchase}
          onClose={() => setShowHelpModal(false)}
        />
      )}
    </div>
  );
}

