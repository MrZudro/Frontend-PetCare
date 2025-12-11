import React, { useState } from 'react';
import { FaCheckCircle, FaDownload, FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function OrderReadyTL({ orderData, onExit }) {

    // ===== DEBUG LOGS =====
    console.log('🔍 OrderReadyTL - orderData completo:', orderData);
    console.log('🔍 OrderReadyTL - orderData.billDetails:', orderData?.billDetails);
    console.log('🔍 OrderReadyTL - Cantidad de billDetails:', orderData?.billDetails?.length);

    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Datos básicos de la orden
    const orderNumber = orderData?.id || "---";
    const date = orderData?.createDate
        ? new Date(orderData.createDate).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    // Totales calculados por el backend
    const subtotal = orderData?.subtotal || 0;
    const iva = orderData?.taxes || 0;
    const total = orderData?.totalBill || 0;

    // Mapear productos del billDetails
    const products = orderData?.billDetails?.map(detail => {
        console.log('🔍 Procesando detail:', detail);
        return {
            id: detail.id,
            name: detail.productName || "Producto",
            quantity: detail.amount || 0,
            price: detail.unitPrice || 0,
            imageUrl: detail.imageUrl || 'https://via.placeholder.com/80?text=Sin+Imagen',
            total: (detail.unitPrice || 0) * (detail.amount || 0)
        };
    }) || [];

    console.log('🔍 OrderReadyTL - products mapeados:', products);
    console.log('🔍 OrderReadyTL - Cantidad de products:', products.length);

    const generatePDF = () => {
        setIsGeneratingPDF(true);
        try {
            const doc = new jsPDF();

            // Configuración de colores (usando paleta de index.css)
            const primaryColor = [15, 194, 192];  // --color-primary: #0FC2C0
            const textDark = [22, 23, 40];         // --color-texto: #161728
            const accentColor = [242, 5, 92];      // --color-acento-primario: #F2055C

            // -- Encabezado --
            doc.setFontSize(24);
            doc.setTextColor(...primaryColor);
            doc.setFont(undefined, 'bold');
            doc.text("PetCare", 105, 20, { align: "center" });

            doc.setFontSize(14);
            doc.setTextColor(...textDark);
            doc.text("Factura de Venta", 105, 28, { align: "center" });

            // Línea divisoria
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.5);
            doc.line(20, 32, 190, 32);

            // Información de la orden
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...textDark);
            doc.text(`No. Orden: ${orderNumber}`, 20, 40);
            doc.text(`Fecha: ${date}`, 20, 45);

            // -- Tabla de Productos --
            const tableColumn = ["Producto", "Cant.", "Precio Unit.", "Total"];
            const tableRows = [];

            products.forEach(product => {
                const productData = [
                    product.name,
                    product.quantity.toString(),
                    `$${product.price.toLocaleString('es-CO')}`,
                    `$${product.total.toLocaleString('es-CO')}`
                ];
                tableRows.push(productData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 55,
                theme: 'striped',
                headStyles: {
                    fillColor: primaryColor,
                    textColor: [255, 255, 255],
                    fontSize: 11,
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 4
                },
                columnStyles: {
                    0: { cellWidth: 90 },
                    1: { cellWidth: 25, halign: 'center' },
                    2: { cellWidth: 35, halign: 'right' },
                    3: { cellWidth: 35, halign: 'right' }
                }
            });

            // -- Totales --
            const finalY = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Subtotal:`, 140, finalY);
            doc.text(`$${subtotal.toLocaleString('es-CO')}`, 185, finalY, { align: 'right' });

            doc.text(`IVA (19%):`, 140, finalY + 6);
            doc.text(`$${iva.toLocaleString('es-CO')}`, 185, finalY + 6, { align: 'right' });

            // Línea antes del total
            doc.setDrawColor(...primaryColor);
            doc.line(140, finalY + 8, 185, finalY + 8);

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...accentColor);
            doc.text(`TOTAL:`, 140, finalY + 14);
            doc.text(`$${total.toLocaleString('es-CO')}`, 185, finalY + 14, { align: 'right' });

            // -- Pie de página --
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(100);
            doc.text("¡Gracias por confiar en PetCare para el cuidado de tu mascota!", 105, finalY + 30, { align: 'center' });

            // Guardar PDF
            doc.save(`Factura_PetCare_${orderNumber}.pdf`);
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Hubo un error al generar el PDF. Por favor intenta nuevamente.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-fondo)] py-8 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Success Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <div className="bg-[var(--color-primary)] rounded-full p-4 shadow-lg">
                            <FaCheckCircle className="text-white text-5xl" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-texto)] mb-2">
                        ¡Orden Confirmada!
                    </h1>
                    <p className="text-[var(--color-texto)] opacity-70">
                        Gracias por tu compra. Tu orden está siendo procesada.
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">

                    {/* Header con información de orden */}
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-acento-secundario)] text-white p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm opacity-80 mb-1">Número de Orden</p>
                                <p className="text-xl font-bold">#{orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-80 mb-1">Fecha</p>
                                <p className="text-xl font-bold">{date}</p>
                            </div>
                            <div className="flex items-center justify-start md:justify-end">
                                <button
                                    onClick={generatePDF}
                                    disabled={isGeneratingPDF}
                                    className="bg-white text-[var(--color-primary)] font-semibold py-2 px-6 rounded-full 
                                             hover:shadow-xl transition-all duration-300 transform hover:scale-105
                                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <FaDownload />
                                    {isGeneratingPDF ? 'Generando...' : 'Descargar Factura'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FaShoppingBag className="text-[var(--color-primary)] text-xl" />
                            <h2 className="text-xl font-bold text-[var(--color-texto)]">
                                Productos ({products.length})
                            </h2>
                        </div>

                        {products.length > 0 ? (
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100
                                                 hover:border-[var(--color-primary)] transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80?text=Sin+Imagen';
                                                }}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-[var(--color-texto)] text-lg mb-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Cantidad: <span className="font-medium">{product.quantity}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Precio unitario: <span className="font-medium">${product.price.toLocaleString('es-CO')}</span>
                                            </p>
                                        </div>

                                        {/* Product Total */}
                                        <div className="flex-shrink-0 text-right">
                                            <p className="text-lg font-bold text-[var(--color-texto)]">
                                                ${product.total.toLocaleString('es-CO')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FaShoppingBag className="text-gray-300 text-5xl mx-auto mb-4" />
                                <p className="text-gray-500">No hay productos en esta orden</p>
                            </div>
                        )}
                    </div>

                    {/* Totals Section */}
                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <div className="max-w-md ml-auto space-y-2">
                            <div className="flex justify-between text-[var(--color-texto)]">
                                <span>Subtotal:</span>
                                <span className="font-medium">${subtotal.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="flex justify-between text-[var(--color-texto)]">
                                <span>IVA (19%):</span>
                                <span className="font-medium">${iva.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2 mt-2">
                                <div className="flex justify-between text-xl font-bold text-[var(--color-acento-primario)]">
                                    <span>Total:</span>
                                    <span>${total.toLocaleString('es-CO')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => {
                            if (onExit) onExit();
                            window.location.href = '/products';
                        }}
                        className="bg-[var(--color-primary)] text-white font-semibold py-3 px-8 rounded-full
                                 hover:bg-[var(--color-primary-hover)] transition-all duration-300 
                                 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Seguir Comprando
                    </button>
                    <button
                        onClick={() => window.location.href = '/orders'}
                        className="bg-white text-[var(--color-texto)] font-semibold py-3 px-8 rounded-full
                                 border-2 border-[var(--color-texto)] hover:bg-gray-50
                                 transition-all duration-300 transform hover:scale-105"
                    >
                        Ver Mis Órdenes
                    </button>
                </div>
            </div>
        </div>
    );
}