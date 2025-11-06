import { useState } from "react";

export default function FormUserXh({ userData, onUpdate, onChangePassword, onDeleteAccount }) {

  const [form, setForm] = useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    onUpdate(updated);
  };

  return (
    <div className="bg-[var(--color-fondo)] shadow-md p-6 rounded-xl max-w-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-[var(--color-texto)]">
        Editar Perfil
      </h2>

      <div className="flex flex-col gap-4">

        <div>
          <label className="font-medium text-sm">Foto de Perfil</label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="names"
            value={form.names}
            onChange={handleChange}
            placeholder="Nombres"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="lastNames"
            value={form.lastNames}
            onChange={handleChange}
            placeholder="Apellidos"
            className="border p-2 rounded w-full"
          />
        </div>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          className="border p-2 rounded w-full"
        />

        <button onClick={onChangePassword} className="styleButton">
          Cambiar contraseña
        </button>

        <button onClick={onDeleteAccount} className="bg-[var(--color-alerta)] text-white px-3 py-2 rounded">
          eliminar mi cuenta
        </button>

      </div>
    </div>
  );
}
