import React from 'react';

export default function NewAddressTL({ data, onChange, onContinue }) {
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Actualiza el estado en el padre (BuyCartTL)
        onChange('address', name, value);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-[var(--shadow-pred)] p-8 border border-gray-100">
            <div className="mb-6">
                <a href="#" className="text-[var(--color-acento-secundario)] font-medium text-sm hover:underline">
                    ● Completar con mi ubicación
                </a>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onContinue(); }}>
                <div>
                    <label className="block text-sm font-bold text-[var(--color-texto)] mb-1">Dirección o lugar de entrega</label>
                    <input 
                        type="text" 
                        name="addressLine"
                        value={data.addressLine}
                        onChange={handleInputChange}
                        placeholder="Ej: Calle 76D #105D-99" 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-acento-secundario)] outline-none transition-all"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-[var(--color-texto)] mb-1">Departamento</label>
                        <select 
                            name="department"
                            value={data.department}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[var(--color-acento-secundario)] outline-none"
                            required
                        >
                            <option value="Bogotá D.C.">Bogotá D.C.</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[var(--color-texto)] mb-1">Municipio / Localidad</label>
                        <select 
                            name="city"
                            value={data.city}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[var(--color-acento-secundario)] outline-none"
                            required
                        >
                            <option value="Engativá">Engativá</option>
                            <option value="Usaquén">Usaquén</option>
                            <option value="Suba">Suba</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-[var(--color-texto)] mb-1">Barrio</label>
                    <input 
                        type="text" 
                        name="neighborhood"
                        value={data.neighborhood}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-acento-secundario)] outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-[var(--color-texto)] mb-1">Apartamento / Casa</label>
                    <input 
                        type="text" 
                        name="apartment"
                        value={data.apartment}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[var(--color-acento-secundario)] outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-[var(--color-texto)] mb-1">Indicaciones para la entrega</label>
                    <textarea 
                        name="notes"
                        value={data.notes}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:ring-2 focus:ring-[var(--color-acento-secundario)] outline-none"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold text-[var(--color-texto)] mb-2">Tipo de domicilio</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="placeType" 
                                value="Residencial"
                                checked={data.placeType === 'Residencial'}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-[var(--color-acento-secundario)] focus:ring-[var(--color-acento-secundario)]"
                            />
                            <span>Residencial</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="placeType" 
                                value="Laboral"
                                checked={data.placeType === 'Laboral'}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-[var(--color-acento-secundario)] focus:ring-[var(--color-acento-secundario)]"
                            />
                            <span>Laboral</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit"
                        // Usamos tu variable de color acento primario
                        className="bg-[var(--color-acento-primario)] text-[var(--color-texto-secundario)] font-bold py-3 px-10 rounded-full hover:opacity-90 transition shadow-md transform hover:-translate-y-0.5"
                    >
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    );
}