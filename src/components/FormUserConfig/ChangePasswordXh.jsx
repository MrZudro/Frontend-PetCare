import { useState } from "react";

export default function ChangePasswordXh({ onClose, onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSave = () => {
    if (newPassword !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    onSubmit({ currentPassword, newPassword });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>

        <input
          type="password"
          placeholder="Contraseña actual"
          className="input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          className="input mt-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          className="input mt-2"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="btnCancel">
            Cancelar
          </button>
          <button onClick={handleSave} className="styleButton">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
