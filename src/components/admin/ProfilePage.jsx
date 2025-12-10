import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Card from './Card';
import AlertMessage from './AlertMessage';
import EditProfileModal from './EditProfileModal';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'María Gómez',
    email: 'maria.gomez@veterinarialuna.com',
    role: 'Administrador General',
    avatar: '/ruta-a-tu-imagen.jpg'
  });

  const [previewUrl, setPreviewUrl] = useState(user.avatar);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState(null);

  // --- Funciones ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Recibe los datos validados desde el modal
  const handleProfileSubmit = (updatedUser) => {
    if (!updatedUser.name.trim() || !/\S+@\S+\.\S+/.test(updatedUser.email)) {
      setMessage({ type: 'error', text: 'Por favor ingresa un nombre y correo válidos.' });
      return;
    }
    setUser(updatedUser);
    setPreviewUrl(updatedUser.avatar || previewUrl);
    setMessage({ type: 'success', text: 'Perfil actualizado con éxito.' });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AlertMessage type={message?.type} text={message?.text} />

      {/* Tarjeta de Información Personal */}
      <Card title="Información Personal" icon={<FaUser className="text-primary" />}>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <img
            src={previewUrl}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-md"
          />
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-texto/80 mb-1">Nombre completo</label>
              <p className="text-texto font-medium">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-texto/80 mb-1">Correo electrónico</label>
              <p className="text-texto font-medium">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-texto/80 mb-1">Rol</label>
              <p className="text-texto font-semibold">{user.role}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
          >
            Editar Perfil
          </button>
        </div>
      </Card>

      {/* Modal de edición */}
      {isModalOpen && (
        <EditProfileModal
          user={user}
          previewUrl={previewUrl}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleProfileSubmit}
          onImageChange={handleImageChange}
          setMessage={setMessage}
        />
      )}
    </div>
  );
}