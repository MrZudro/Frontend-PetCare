import React from 'react';

export default function OrderReadyTL({ products, subtotal }) {

    // Variables internas en inglés
    const orderDetails = { 
        orderNumber: "FKGZ9876TY", 
        paymentMethod: "Tarjeta de Crédito (VISA)", 
        transactionNumber: "CD789PLMNB", 
        estimatedDate: "10 - Junio - 2025", 
        vat: 0.19 * subtotal, 
        shipping: 0, 
        coupon: 0, 
        total: subtotal + (0.19 * subtotal)
    };

    const productItem = (p, index) => (
        <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div> 
                <div>
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.weight}</p>
                </div>
            </div>
            <span className="font-semibold text-gray-900">
                ${(p.price * p.quantity).toLocaleString('es-CO')}
            </span>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
            
            {/* Título de Confirmación en español */}
            <div className="text-center mb-10">
                <i className="fas fa-check-circle text-6xl text-black mb-4"></i>
                <h1 className="text-3xl font-bold text-gray-900">¡Tu orden está lista!</h1>
            </div>

            {/* Banner de Datos del Pedido */}
            <div className="bg-black text-white p-4 rounded-lg flex justify-between items-center text-sm mb-8">
                <div className="flex space-x-6">
                    <div>
                        <p className="text-gray-400">Número de Orden</p>
                        <p className="font-bold">#{orderDetails.orderNumber}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Método de Pago</p>
                        <p className="font-bold">{orderDetails.paymentMethod}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Número de Transacción</p>
                        <p className="font-bold">{orderDetails.transactionNumber}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Fecha estimada de entrega</p>
                        <p className="font-bold">{orderDetails.estimatedDate}</p>
                    </div>
                </div>
                
                <button className="bg-white text-black py-2 px-4 rounded-md font-bold hover:bg-gray-200 transition">
                    Descargar factura
                </button>
            </div>

            {/* Detalles del Pedido */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">Detalles del Pedido</h2>
            
            {/* Lista de Productos */}
            <div className="mb-6">
                {products.map(productItem)}
            </div>

            {/* Desglose de Precios */}
            <div className="border-t border-gray-300 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold">${orderDetails.shipping.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">IVA</span>
                    <span className="font-semibold">${orderDetails.vat.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Cupón Aplicado</span>
                    <span className="font-semibold">${orderDetails.coupon.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                    <span>Total</span>
                    <span>${orderDetails.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

        </div>
    );
}