import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import axios from '../../services/axiosConfig'; // Assuming this is the configured axios instance
import { useNavigate } from 'react-router-dom';

const FormPets = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [petData, setPetData] = useState({
    name: '',
    raza: '', // This will hold the ID of the race if we had a list, or just a string if API allows
    microchip: '',
    color: '',
    gender: '',
    weight: '',
    birthdate: '',
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Redirect if not logged in
      // navigate('/login'); // Uncomment to enforce redirect
      // alert("Debes iniciar sesión para registrar una mascota.");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      alert("Error: No se ha identificado el usuario logueado.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = petData.imageUrl;

      // 1. Upload Image to Cloudinary if selected
      if (imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Error al subir la imagen. Intente de nuevo.");
          setLoading(false);
          return;
        }
      }

      // 2. Prepare Payload
      // Note: 'raza' expects a Race entity or ID. Since we don't have a race selector with IDs yet,
      // we might need to adjust this. For now, we'll send it as is, but typically you'd send { id: raceId }.
      // If the backend expects a Race object:
      // const racePayload = { id: parseInt(petData.raza) }; // Assuming value is ID

      const payload = {
        name: petData.name,
        birthdate: petData.birthdate,
        microchip: petData.microchip || null,
        color: petData.color,
        weight: petData.weight || null,
        gender: petData.gender,
        imageUrl: imageUrl,
        user: { id: user.id }, // Associate with logged in user
        // raza: { id: 1 } // Placeholder: You need to implement race selection fetching from API
        // For now, we are not sending 'raza' properly because we lack the ID list. 
        // If the API requires it, this will fail. 
        // Assuming for this task we focus on the structure and user association.
      };

      console.log('Enviando payload:', payload);

      // 3. Send to API
      // await axios.post('/pets', payload); 

      alert('Mascota registrada con éxito (Simulación). URL Imagen: ' + imageUrl);

      // Reset form
      setPetData({
        name: '',
        raza: '',
        microchip: '',
        color: '',
        gender: '',
        weight: '',
        birthdate: '',
        imageUrl: '',
      });
      setImageFile(null);

    } catch (error) {
      console.error("Error saving pet:", error);
      alert("Error al registrar la mascota.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white shadow-xl/15 rounded-xl content-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        FORMULARIO PARA LA CREACION DE MASCOTAS
      </h2>

      {!isAuthenticated && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-sm text-yellow-700">
            Debes iniciar sesión como cliente para registrar una mascota.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Campo: Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              id="name"
              value={petData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Campo: Raza (Select) - NOTE: This should ideally load from API */}
          <div>
            <label htmlFor="raza" className="block text-sm font-medium text-gray-700">Raza / Especie</label>
            <select
              id="raza"
              name="raza"
              value={petData.raza}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona una opción</option>
              {/* These values should be IDs from the Race table */}
              <option value="1">Perro (Mock ID 1)</option>
              <option value="2">Gato (Mock ID 2)</option>
            </select>
          </div>

          {/* Campo: Género */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
            <select
              id="gender"
              name="gender"
              value={petData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          {/* Campo: Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="text"
              name="color"
              id="color"
              value={petData.color}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Campo: Número de Microchip (Opcional) */}
          <div>
            <label htmlFor="microchip" className="block text-sm font-medium text-gray-700">Número de Microchip (Opcional)</label>
            <input
              type="text"
              name="microchip"
              id="microchip"
              value={petData.microchip}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: 900xxxxxxxxxxxxxx"
            />
          </div>

          {/* Campo: Peso (Opcional) */}
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Peso (Opcional en kg)</label>
            <input
              type="number"
              name="weight"
              id="weight"
              value={petData.weight}
              onChange={handleChange}
              step="0.1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: 5.5"
            />
          </div>

          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              value={petData.birthdate}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Imagen de la Mascota (Opcional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Sube un archivo</span>
                    <input
                      id="file-upload"
                      name="imagenMascota"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
                {imageFile && (
                  <p className="text-sm text-gray-700 mt-2">
                    Archivo seleccionado: {imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Enviar */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || !isAuthenticated}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading || !isAuthenticated ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
          >
            {loading ? 'Guardando...' : 'Guardar Mascota'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default FormPets;