import React, { useState } from 'react';

const FormPets = () => {
  const [petData, setPetData] = useState({
    nombre: '',
    raza: '',
    microchip: '',
    color: '',
    genero: '',
    peso: '',
  });

  // para actualizar el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData(prevData => ({
      ...prevData,
      [name]: value,
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
    <div className="max-w-xl mx-auto my-10 p-8 bg-white shadow-lg rounded-xl">
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
        </div>

        {/* Botón de Enviar */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Guardar Mascota
          </button>
        </div>
      </form>
    </div>
  );
};
export default FormPets;