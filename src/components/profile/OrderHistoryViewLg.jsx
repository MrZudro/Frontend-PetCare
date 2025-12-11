import React, { useState, useEffect } from 'react';
import { FaBox, FaCalendarAlt, FaMoneyBillWave, FaChevronDown, FaChevronUp, FaDownload, FaShoppingBag } from 'react-icons/fa';
import { getCustomerOrders } from '../../services/orderService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function OrderHistoryViewLg({ customerId }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [generatingPDF, setGeneratingPDF] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [customerId]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCustomerOrders(customerId);
            console.log('📦 Órdenes recibidas:', data);
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('No se pudieron cargar las órdenes. Por favor intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const generateOrderPDF = (order) => {
        setGeneratingPDF(order.id);
        try {
            const doc = new jsPDF();

            // Colores
            const primaryColor = [15, 194, 192];
            const textDark = [22, 23, 40];
            const accentColor = [242, 5, 92];

            // Header
            doc.setFontSize(24);
            doc.setTextColor(...primaryColor);
            doc.setFont(undefined, 'bold');
            doc.text("PetCare", 105, 20, { align: "center" });

            doc.setFontSize(14);
            doc.setTextColor(...textDark);
            doc.text("Factura de Venta", 105, 28, { align: "center" });

            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.5);
            doc.line(20, 32, 190, 32);

            // Order info
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`No. Orden: ${order.id}`, 20, 40);
            doc.text(`Fecha: ${new Date(order.createDate).toLocaleDateString('es-CO')}`, 20, 45);

            // Products table
            const tableColumn = ["Producto", "Cant.", "Precio Unit.", "Total"];
            const tableRows = [];

            order.billDetails.forEach(detail => {
                tableRows.push([
                    detail.productName,
                    detail.amount.toString(),
                    `$${detail.unitPrice.toLocaleString('es-CO')}`,
                    `$${detail.subtotalLine.toLocaleString('es-CO')}`
                ]);
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

            // Totals
            const finalY = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Subtotal:`, 140, finalY);
            doc.text(`$${order.subtotal.toLocaleString('es-CO')}`, 185, finalY, { align: 'right' });

            doc.text(`IVA (19%):`, 140, finalY + 6);
            doc.text(`$${order.taxes.toLocaleString('es-CO')}`, 185, finalY + 6, { align: 'right' });

            doc.setDrawColor(...primaryColor);
            doc.line(140, finalY + 8, 185, finalY + 8);

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...accentColor);
            doc.text(`TOTAL:`, 140, finalY + 14);
            doc.text(`$${order.totalBill.toLocaleString('es-CO')}`, 185, finalY + 14, { align: 'right' });

            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(100);
            doc.text("¡Gracias por confiar en PetCare!", 105, finalY + 30, { align: 'center' });

            doc.save(`Factura_PetCare_${order.id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error al generar el PDF');
        } finally {
            setGeneratingPDF(null);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
                <p className="text-texto text-lg font-medium">Cargando historial...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-alerta p-6 rounded-lg">
                <div className="flex items-center">
                    <svg className="h-6 w-6 text-alerta mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-alerta font-medium">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="mt-2 text-sm text-primary hover:text-primary-hover underline"
                        >
                            Intentar nuevamente
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gradient-to-br from-primary/10 to-acento-secundario/10 rounded-full p-12 mb-6">
                    <FaShoppingBag className="text-7xl text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-texto mb-2">
                    No tienes pedidos todavía
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                    Cuando realices tu primera compra, aparecerá aquí.
                </p>
                <button
                    onClick={() => window.location.href = '/products'}
                    className="bg-primary text-white font-semibold py-3 px-8 rounded-full
                             hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Explorar Productos
                </button>
            </div>
        );
    }

    // Orders list
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-texto">Historial de Pedidos</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {orders.length} {orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
                    </p>
                </div>
            </div>

            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100
                             hover:shadow-lg transition-all duration-300"
                >
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-primary/5 to-acento-secundario/5 p-4 border-b">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 rounded-lg p-3">
                                    <FaBox className="text-primary text-2xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Orden</p>
                                    <p className="text-lg font-bold text-texto">#{order.id}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {new Date(order.createDate).toLocaleDateString('es-CO', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMoneyBillWave className="text-acento-primario" />
                                    <span className="text-lg font-bold text-acento-primario">
                                        ${order.totalBill.toLocaleString('es-CO')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleOrderDetails(order.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-primary 
                                         text-primary rounded-lg hover:bg-primary hover:text-white
                                         transition-all duration-300 font-medium"
                            >
                                {expandedOrder === order.id ? (
                                    <>Ocultar Detalles <FaChevronUp /></>
                                ) : (
                                    <>Ver Detalles <FaChevronDown /></>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order.id && (
                        <div className="p-6 bg-gray-50">
                            {/* Products */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-texto uppercase tracking-wide mb-4">
                                    Productos ({order.billDetails.length})
                                </h4>
                                <div className="space-y-3">
                                    {order.billDetails.map((detail) => (
                                        <div
                                            key={detail.id}
                                            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                {detail.imageUrl ? (
                                                    <img
                                                        src={detail.imageUrl}
                                                        alt={detail.productName}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/80?text=Producto';
                                                        }}
                                                    />
                                                ) : (
                                                    <FaBox className="text-gray-400 text-2xl" />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-texto">{detail.productName}</p>
                                                <p className="text-sm text-gray-600">
                                                    Cantidad: {detail.amount} • Precio: ${detail.unitPrice.toLocaleString('es-CO')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-texto">
                                                    ${detail.subtotalLine.toLocaleString('es-CO')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-texto">
                                        <span>Subtotal:</span>
                                        <span className="font-medium">${order.subtotal.toLocaleString('es-CO')}</span>
                                    </div>
                                    <div className="flex justify-between text-texto">
                                        <span>IVA (19%):</span>
                                        <span className="font-medium">${order.taxes.toLocaleString('es-CO')}</span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-2 mt-2">
                                        <div className="flex justify-between text-xl font-bold text-acento-primario">
                                            <span>Total:</span>
                                            <span>${order.totalBill.toLocaleString('es-CO')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => generateOrderPDF(order)}
                                disabled={generatingPDF === order.id}
                                className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg
                                         hover:bg-primary-hover transition-all duration-300
                                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FaDownload />
                                {generatingPDF === order.id ? 'Generando PDF...' : 'Descargar Factura'}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
