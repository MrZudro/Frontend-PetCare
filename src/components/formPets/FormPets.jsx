import React, { useState } from 'react';

const FormPets = () => {
  const [petData, setPetData] = useState({
    nombre: '',
    raza: '',
    microchip: '',
    color: '',
    genero: '',
    peso: '',
    fechaNacimiento:'',
    imagenMascota: null,
  });

  // para actualizar el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleImageChange = (e) => {
    // Almacena el archivo seleccionado. En un entorno real, lo subirías a un servidor.
    setPetData(prevData => ({
      ...prevData,
      imagenMascota: e.target.files[0], // Guarda el objeto File
    }));
  };

  //para enviar el formulario (a la API)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos a enviar:', petData);
    // Lógica para enviar petData a la API (POST) con el ID del cliente
    // e.g., petCreationApi(petData, clientId)
    alert('Mascota registrada (Simulación de envío a API)');
    // Aquí podrías redirigir o actualizar el estado del perfil
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white shadow-xl/15 rounded-xl content-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        FORMULARIO PARA LA CREACION DE MASCOTAS
      </h2>
      <form onSubmit={handleSubmit}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Campo: Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input 
              type="text" 
              name="nombre" 
              id="nombre"
              value={petData.nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Campo: Raza (Select) */}
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
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="pajaro">Pajaro</option>
              <option value="pez">Pez</option>
              <option value="conejo">Conejo</option>
              <option value="roedor">Roedor</option>
            </select>
          </div>

          {/* Campo: Género */}
          <div>
            <label htmlFor="genero" className="block text-sm font-medium text-gray-700">Género</label>
            <select
              id="genero"
              name="genero"
              value={petData.genero}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
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
            <label htmlFor="peso" className="block text-sm font-medium text-gray-700">Peso (Opcional en kg)</label>
            <input 
              type="number" 
              name="peso" 
              id="peso"
              value={petData.peso}
              onChange={handleChange}
              step="0.1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: 5.5"
            />
          </div>

          <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input 
                type="date" 
                name="fechaNacimiento" 
                id="fechaNacimiento"
                value={petData.fechaNacimiento}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <div className="md:col-span-2"> {/* Ocupa ambas columnas en pantallas medianas y grandes */}
              <label htmlFor="imagenMascota" className="block text-sm font-medium text-gray-700">Imagen de la Mascota (Opcional)</label>
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
                        accept="image/*" // Solo acepta archivos de imagen
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                  {petData.imagenMascota && (
                    <p className="text-sm text-gray-700 mt-2">
                      Archivo seleccionado: {petData.imagenMascota.name}
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
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-texto-secundario bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Guardar Mascota
          </button>
        </div>
      </form>
    </div>
  );
};
export default FormPets;