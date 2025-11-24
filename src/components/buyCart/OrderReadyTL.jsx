import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
// 1. Importar librerías de PDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function OrderReadyTL({ products, subtotal }) {
    
    // Datos simulados de la orden
    const orderNumber = "FKGZ9876TY";
    const date = "10 - Junio - 2025";
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    // 2. Función para generar el PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // -- Encabezado --
        doc.setFontSize(20);
        doc.setTextColor(15, 194, 192); // Color Primary (#0FC2C0)
        doc.text("PetCare - Factura de Venta", 105, 20, null, null, "center");
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Orden #: ${orderNumber}`, 14, 30);
        doc.text(`Fecha: ${date}`, 14, 35);
        doc.text("Cliente: Usuario Registrado", 14, 40);

        // -- Tabla de Productos --
        const tableColumn = ["Producto", "Categoría", "Cant.", "Precio Unit.", "Total"];
        const tableRows = [];

        products.forEach(product => {
            const productData = [
                product.name,
                product.subcategories,
                product.quantity,
                `$${product.price.toLocaleString('es-CO')}`,
                `$${(product.price * product.quantity).toLocaleString('es-CO')}`
            ];
            tableRows.push(productData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: [15, 194, 192] }, // Color cabecera tabla
        });

        // -- Totales --
        // Obtener la posición final de la tabla
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.text(`Subtotal: $${subtotal.toLocaleString('es-CO')}`, 140, finalY);
        doc.text(`IVA (19%): $${iva.toLocaleString('es-CO')}`, 140, finalY + 5);
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Total a Pagar: $${total.toLocaleString('es-CO')}`, 140, finalY + 12);

        // -- Pie de página --
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100);
        doc.text("¡Gracias por confiar en PetCare!", 105, finalY + 30, null, null, "center");

        // Descargar el archivo
        doc.save(`Factura_PetCare_${orderNumber}.pdf`);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="flex flex-col items-center mb-8">
                <FaCheckCircle className="text-6xl text-[#0FC2C0] mb-4" />
                <h1 className="text-3xl font-extrabold text-[#161728]">¡Tu orden está lista!</h1>
                <p className="text-gray-500">Gracias por confiar en PetCare</p>
            </div>

            {/* Barra Negra de Detalles */}
            <div className="bg-[#161728] text-white rounded-lg p-6 flex flex-wrap justify-between items-center text-left gap-4 mb-8">
                <div>
                    <p className="text-gray-400 text-xs uppercase">Número de Orden</p>
                    <p className="font-bold">#{orderNumber}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase">Método de Pago</p>
                    <p className="font-bold">Visa **** 1234</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase">Fecha Estimada</p>
                    <p className="font-bold">{date}</p>
                </div>
                
                {/* 3. Botón Conectado a la función */}
                <button 
                    onClick={generatePDF}
                    className="bg-white text-[#161728] font-bold py-2 px-4 rounded text-sm hover:bg-gray-200 transition duration-200 shadow-md"
                >
                    Descargar Factura
                </button>
            </div>

            <h2 className="text-left text-xl font-bold text-[#161728] border-b pb-2 mb-4">Detalles del Pedido</h2>

            {/* ... (Resto del código de lista de productos y totales - Sin cambios importantes, solo visual) ... */}
            <div className="space-y-4 mb-8">
                {products.map((p) => (
                    <div key={p.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-bold text-[#161728]">{p.name}</p>
                                <p className="text-sm text-gray-500">{p.subcategories}</p>
                                <p className="text-xs text-gray-400">Cant: {p.quantity}</p>
                            </div>
                        </div>
                        <span className="font-bold text-[#161728]">${(p.price * p.quantity).toLocaleString('es-CO')}</span>
                    </div>
                ))}
            </div>

            {/* Botón para volver (Opcional) */}
            <div className="mt-8">
                 <button 
                    className="bg-[#F2055C] text-white font-bold py-3 px-8 rounded-full hover:bg-[#BF0436] transition"
                    onClick={() => window.location.href = '/products'} 
                 >
                    Volver a Productos
                 </button>
            </div>
        </div>
    );
}