import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function OrderReadyTL({ products, subtotal }) {
    const total = subtotal; // + impuestos

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="flex flex-col items-center mb-8">
                <FaCheckCircle className="text-6xl text-black mb-4" />
                <h1 className="text-3xl font-extrabold text-gray-900">¡Tu orden está lista!</h1>
            </div>

            {/* Barra Negra de Detalles */}
            <div className="bg-black text-white rounded-lg p-6 flex flex-wrap justify-between items-center text-left gap-4 mb-8">
                <div>
                    <p className="text-gray-400 text-xs uppercase">Número de Orden</p>
                    <p className="font-bold">#FKGZ9876TY</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase">Método de Pago</p>
                    <p className="font-bold">Visa **** 1234</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase">Fecha Estimada</p>
                    <p className="font-bold">10 - Junio - 2025</p>
                </div>
                <button className="bg-white text-black font-bold py-2 px-4 rounded text-sm hover:bg-gray-200 transition">
                    Descargar Factura
                </button>
            </div>

            <h2 className="text-left text-xl font-bold text-gray-900 border-b pb-2 mb-4">Detalles del Pedido</h2>

            <div className="space-y-4 mb-8">
                {products.map((p) => (
                    <div key={p.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{p.name}</p>
                                <p className="text-sm text-gray-500">{p.subcategories}</p>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">${(p.price * p.quantity).toLocaleString('es-CO')}</span>
                    </div>
                ))}
            </div>

            <div className="text-right space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex justify-between"><span>Envío</span><span>$0.00</span></div>
                <div className="flex justify-between"><span>IVA</span><span>${(subtotal * 0.19).toLocaleString('es-CO')}</span></div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-4">
                    <span>Total</span>
                    <span>${(subtotal * 1.19).toLocaleString('es-CO')}</span>
                </div>
            </div>
        </div>
    );
}