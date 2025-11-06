import React, { useState, useEffect } from 'react';
import ChangePassword_Xh from '../Xiomara/CambioContraseña/ChangePassword_Xh';

export default function ConfigurationXh() {
  const [mostrarCambio, setMostrarCambio] = useState(false);
  const [foto, setFoto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    fecha: '',
    direccion: ''
  });
  
  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-gray-50 py-10 px-4">
      {!mostrarCambio ? (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Información Personal
          </h2>

          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-32 h-32">
              {foto ? (
                <img
                  src={foto}
                  alt="Perfil"
                  className="w-full h-full object-cover rounded-full border-4 border-gray-200"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-gray-100 rounded-full border-2 border-dashed">
                  +
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImagen}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500">
              Haz clic para cambiar tu foto de perfil
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="text"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                  Fecha de Nacimiento
                </label>
                <input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  id="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center pt-6 gap-4">
            <button
              className="px-5 py-2 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition font-medium"
              onClick={() => setMostrarCambio(true)}
            >
              Cambiar Contraseña
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => setModal({ tipo: 'actualizar', abierto: true })}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Guardar Cambios
              </button>

              <button
                onClick={() => setModal({ tipo: 'eliminar', abierto: true })}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ChangePassword_Xh volver={() => setMostrarCambio(false)} />
      )}


      {modal.abierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {modal.tipo === 'actualizar'
                ? '¿Confirmas actualizar tu información?'
                : '¿Seguro que deseas eliminar tu cuenta?'}
            </h3>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() =>
                  modal.tipo === 'actualizar' ? handleActualizar() : handleEliminar()
                }
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  modal.tipo === 'actualizar'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirmar
              </button>
              <button
                onClick={() => setModal({ tipo: null, abierto: false })}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
