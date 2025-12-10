import { useState, useEffect } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import AlertMessage from './AlertMessage';

export default function EditProfileModal({
  user,
  previewUrl,
  onClose,
  onSubmit,
  onImageChange
}) {
  const [localUser, setLocalUser] = useState(user);
  const [errors, setErrors] = useState({});
  const [localMessage, setLocalMessage] = useState(null);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  useEffect(() => {
    if (localMessage) {
      const timer = setTimeout(() => setLocalMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [localMessage]);

  const handleFieldChange = (e) => {
    const { id, value } = e.target;
    setLocalUser(prev => ({ ...prev, [id]: value }));

    let newErrors = { ...errors };
    if (id === "name" && !value.trim()) {
      newErrors.name = "El nombre no puede estar vacío.";
    } else {
      delete newErrors.name;
    }
    if (id === "email") {
      if (!value.trim()) {
        newErrors.email = "El correo no puede estar vacío.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Introduce un correo válido.";
      } else {
        delete newErrors.email;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localUser.name.trim() || !localUser.email.trim() || Object.keys(errors).length > 0) {
      setLocalMessage({ type: 'error', text: 'Corrige los errores antes de guardar.' });
      return;
    }
    onSubmit(localUser);
    setLocalMessage({ type: 'success', text: 'Perfil actualizado con éxito.' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary">Editar Perfil</h2>

        {/* Mensaje temporal dentro del modal */}
        <AlertMessage type={localMessage?.type} text={localMessage?.text} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-md font-medium text-texto/80 mb-1">Nombre completo</label>
            <input
              type="text"
              id="name"
              value={localUser.name}
              onChange={handleFieldChange}
              placeholder="Ej: María Gómez"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-fondo"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Correo */}
          <div>
            <label htmlFor="email" className="block text-md font-medium text-texto/80 mb-1">Correo electrónico</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/40" />
              <input
                type="email"
                id="email"
                value={localUser.email}
                onChange={handleFieldChange}
                placeholder="Ej: maria.gomez@veterinarialuna.com"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-fondo"
              />
            </div>
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-md font-medium text-texto/80 mb-2">Foto de perfil</label>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 border">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0 file:text-sm file:font-semibold
                    file:bg-primary file:text-white hover:file:bg-primary-hover"
                />
                <p className="text-xs text-gray-500 mt-1">Selecciona una imagen cuadrada para mejor visualización.</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}