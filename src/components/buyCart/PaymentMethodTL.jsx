import React, { useState } from 'react';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaArrowLeft } from 'react-icons/fa';

// --- SUB-COMPONENTE: Formulario de Tarjeta ---
const CreditCardForm = ({ onBack, onContinue }) => {
    const [formData, setFormData] = useState({ number: '', name: '', expiry: '', cvv: '', doc: '' });
    const [errors, setErrors] = useState({});

    const validateAndSubmit = () => {
        const newErrors = {};
        if (!formData.number) newErrors.number = true;
        if (!formData.name) newErrors.name = true;
        if (!formData.expiry) newErrors.expiry = true;
        if (!formData.cvv) newErrors.cvv = true;
        if (!formData.doc) newErrors.doc = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            // Aquí se llamaría a la API de pagos
            onContinue(); 
        }
    };

    const inputClass = (error) => `w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <button onClick={onBack} className="flex items-center text-blue-500 font-bold mb-4 hover:underline">
                <FaArrowLeft className="mr-2"/> Volver
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaCreditCard/> Nueva tarjeta de crédito
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Número de tarjeta</label>
                        <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" 
                            className={inputClass(errors.number)} 
                            onChange={(e) => setFormData({...formData, number: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del titular</label>
                        <input type="text" placeholder="Como aparece en la tarjeta" 
                            className={inputClass(errors.name)}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Vencimiento</label>
                            <input type="text" placeholder="MM/AA" maxLength="5" 
                                className={inputClass(errors.expiry)}
                                onChange={(e) => setFormData({...formData, expiry: e.target.value})} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-700 mb-1">CVC</label>
                            <input type="password" placeholder="123" maxLength="4" 
                                className={inputClass(errors.cvv)}
                                onChange={(e) => setFormData({...formData, cvv: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Documento del titular</label>
                        <div className="flex gap-2">
                            <select className="border border-gray-300 rounded-lg p-3 bg-white">
                                <option>CC</option><option>CE</option>
                            </select>
                            <input type="text" placeholder="Número de documento" 
                                className={inputClass(errors.doc)}
                                onChange={(e) => setFormData({...formData, doc: e.target.value})} />
                        </div>
                    </div>
                </div>
                {/* Visualización de tarjeta (Decorativo) */}
                <div className="hidden md:block w-64 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl shadow-inner mt-6"></div>
            </div>

            <div className="flex justify-end mt-8">
                <button onClick={validateAndSubmit} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition">
                    Continuar
                </button>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE: Formulario PSE ---
const PSEForm = ({ onBack, onContinue }) => {
    const [selectedBank, setSelectedBank] = useState('');
    const [error, setError] = useState(false);

    const banks = ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Nequi", "Daviplata", "Banco de Occidente", "Scotiabank Colpatria"];

    const validateAndSubmit = () => {
        if (!selectedBank) {
            setError(true);
        } else {
            onContinue();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <button onClick={onBack} className="flex items-center text-blue-500 font-bold mb-4 hover:underline">
                <FaArrowLeft className="mr-2"/> Volver
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaUniversity/> Selecciona tu banco
            </h2>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold">⚠ Por favor selecciona un banco.</div>}

            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                {banks.map((bank, idx) => (
                    <label key={idx} className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${selectedBank === bank ? 'bg-blue-50' : ''}`}>
                        <input 
                            type="radio" 
                            name="bank" 
                            value={bank} 
                            onChange={() => { setSelectedBank(bank); setError(false); }}
                            className="w-5 h-5 text-blue-600 mr-4" 
                        />
                        <span className="text-gray-700 font-medium">{bank}</span>
                    </label>
                ))}
            </div>

            <div className="flex justify-end mt-8">
                <button onClick={validateAndSubmit} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition">
                    Continuar
                </button>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE: Formulario Efecty/Facturación ---
const InvoiceDataForm = ({ onBack, onContinue }) => {
    const [formData, setFormData] = useState({ name: '', lastname: '', doc: '', address: '' });
    const [errors, setErrors] = useState({});

    const validateAndSubmit = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = true;
        if (!formData.lastname) newErrors.lastname = true;
        if (!formData.doc) newErrors.doc = true;
        if (!formData.address) newErrors.address = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            onContinue();
        }
    };

    const inputClass = (error) => `w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <button onClick={onBack} className="flex items-center text-blue-500 font-bold mb-4 hover:underline">
                <FaArrowLeft className="mr-2"/> Volver
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Datos para tu factura</h2>
            <p className="text-sm text-gray-500 mb-6 border-l-4 border-blue-500 pl-3 bg-blue-50 py-2">
                Estos datos son necesarios para la emisión de tu recibo de pago.
            </p>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                        <input type="text" className={inputClass(errors.name)} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Apellido</label>
                        <input type="text" className={inputClass(errors.lastname)} onChange={(e) => setFormData({...formData, lastname: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Documento (CC/NIT)</label>
                    <input type="text" className={inputClass(errors.doc)} onChange={(e) => setFormData({...formData, doc: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Dirección de Facturación</label>
                    <input type="text" className={inputClass(errors.address)} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button onClick={validateAndSubmit} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition">
                    Continuar
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
// Nota: Solo recibe onContinue, ya no necesita products ni subtotal porque NO renderiza el resumen.
export default function PaymentMethodTL({ onContinue }) {
    const [view, setView] = useState('menu');

    const paymentOptions = [
        { id: 'card', name: "Nueva tarjeta de crédito / débito", icon: <FaCreditCard /> },
        { id: 'pse', name: "Transferencia con PSE", icon: <FaUniversity /> },
        { id: 'efecty', name: "Efecty", icon: <FaMoneyBillWave /> },
    ];

    // Renderizado condicional de vistas
    if (view === 'card') {
        return <CreditCardForm onBack={() => setView('menu')} onContinue={onContinue} />;
    }
    if (view === 'pse') {
        return <PSEForm onBack={() => setView('menu')} onContinue={onContinue} />;
    }
    if (view === 'efecty') {
        return <InvoiceDataForm onBack={() => setView('menu')} onContinue={onContinue} />;
    }

    // Vista por defecto: Menú de selección
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Elige cómo pagar</h1>
            <div className="space-y-4">
                {paymentOptions.map((option) => (
                    <div 
                        key={option.id}
                        onClick={() => setView(option.id)}
                        className="border border-gray-200 rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
                        <span className="text-xl text-gray-600">{option.icon}</span>
                        <span className="font-semibold text-gray-900">{option.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}