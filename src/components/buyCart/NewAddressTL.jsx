import React from 'react';

export default function NewAddressTL({ onContinue }) {
    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
                <a href="#" className="text-blue-500 font-medium text-sm hover:underline">● Completar con mi ubicación</a>
            </div>

            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Dirección o lugar de entrega</label>
                    <input type="text" placeholder="Ej: Calle 76D #105D-99" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Departamento</label>
                        <select className="w-full border border-gray-300 rounded-lg p-3 bg-white"><option>Bogotá D.C.</option></select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Municipio / Localidad</label>
                        <select className="w-full border border-gray-300 rounded-lg p-3 bg-white"><option>Engativá</option></select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Barrio</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg p-3"/>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Apartamento / Casa</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg p-3"/>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Indicaciones para la entrega</label>
                    <textarea className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de domicilio</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tipo" className="w-4 h-4 text-blue-600"/>
                            <span>Residencial</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tipo" className="w-4 h-4 text-blue-600"/>
                            <span>Laboral</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="button" onClick={onContinue} className="bg-acento-primario text-white font-bold py-3 px-10 rounded-lg hover:bg-acento-secundario transition">
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    );
}