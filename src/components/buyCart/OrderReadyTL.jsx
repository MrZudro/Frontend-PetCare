import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function OrderReadyTL({ products, subtotal }) {
    const total = subtotal; 

    const handleBackToProducts = () => {
        // Ajusta la ruta según tu routing
        window.location.href = '/products'; 
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-[var(--shadow-pred)] p-8 text-center border border-gray-100">
            <div className="flex flex-col items-center mb-8">
                <FaCheckCircle className="text-6xl text-[var(--color-primary)] mb-4" />
                <h1 className="text-3xl font-extrabold text-[var(--color-texto)]">¡Tu orden está lista!</h1>
                <p className="text-gray-500 mt-2">Gracias por confiar en PetCare</p>
            </div>

            {/* Barra Oscura de Detalles */}
            <div className="bg-[var(--color-texto)] text-[var(--color-texto-secundario)] rounded-lg p-6 flex flex-wrap justify-between items-center text-left gap-4 mb-8 shadow-lg">
                <div>
                    <p className="text-gray-400 text-xs uppercase font-medium">Número de Orden</p>
                    <p className="font-bold text-lg">#FKGZ9876TY</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase font-medium">Método de Pago</p>
                    <p className="font-bold text-lg">Visa **** 1234</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase font-medium">Total Pagado</p>
                    <p className="font-bold text-lg">${total.toLocaleString('es-CO')}</p>
                </div>
                <button className="bg-white text-[var(--color-texto)] font-bold py-2 px-4 rounded text-sm hover:bg-gray-100 transition">
                    Descargar Factura
                </button>
            </div>

            <h2 className="text-left text-xl font-bold text-[var(--color-texto)] border-b border-gray-200 pb-2 mb-4">
                Detalles del Pedido
            </h2>

            <div className="space-y-4 mb-8">
                {products.map((p) => (
                    <div key={p.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-bold text-[var(--color-texto)]">{p.name}</p>
                                <p className="text-sm text-gray-500">{p.subcategories}</p>
                                <p className="text-xs text-[var(--color-acento-secundario)] font-medium">Cant: {p.quantity}</p>
                            </div>
                        </div>
                        <span className="font-bold text-[var(--color-texto)]">${(p.price * p.quantity).toLocaleString('es-CO')}</span>
                    </div>
                ))}
            </div>

            <div className="text-right space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-4 mb-8">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toLocaleString('es-CO')}</span></div>
                <div className="flex justify-between"><span>Envío</span><span className="text-green-600 font-bold">Gratis</span></div>
                <div className="flex justify-between text-xl font-bold text-[var(--color-texto)] mt-4 pt-2 border-t border-gray-100">
                    <span>Total Final</span>
                    <span>${total.toLocaleString('es-CO')}</span>
                </div>
            </div>

            {/* Botón Volver a Productos */}
            <button 
                onClick={handleBackToProducts}
                className="w-full sm:w-auto bg-[var(--color-acento-primario)] text-[var(--color-texto-secundario)] font-bold py-4 px-12 rounded-full hover:opacity-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
                Volver a Productos
            </button>
        </div>
    );
}