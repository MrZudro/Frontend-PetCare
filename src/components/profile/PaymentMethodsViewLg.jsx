// src/components/profile/PaymentMethodsViewLg.jsx

import React, { useState, useCallback } from 'react';

const PaymentMethodsViewLg = React.memo(({ payments, dispatchPayments, isAddingPayment, setIsAddingPayment }) => {
    
    const [newPaymentData, setNewPaymentData] = useState({ type: '', last4: '', expiry: '' });

    const handleNewPaymentChange = useCallback((e) => {
        let { name, value } = e.target;
        
        if (name === 'expiry') {
            let cleanedValue = value.replace(/\D/g, '').substring(0, 4); 
            if (cleanedValue.length > 2) {
                value = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
            } else {
                value = cleanedValue;
            }
        }
        
        if (name === 'last4') {
            value = value.replace(/\D/g, '').substring(0, 4);
        }

        setNewPaymentData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleAddPayment = useCallback((e) => {
        e.preventDefault();
        
        const { type, last4, expiry } = newPaymentData;

        if (!type || last4.length !== 4 || expiry.length !== 5 || expiry.charAt(2) !== '/') {
            alert('Por favor, verifique el Tipo, los 4 dígitos y el formato de Expiración (MM/AA).');
            return;
        }

        dispatchPayments({ type: 'ADD_METHOD', payload: { type, last4, expiry } });
        
        setNewPaymentData({ type: '', last4: '', expiry: '' });
        setIsAddingPayment(false);
        alert('Método de pago agregado.');
    }, [newPaymentData, dispatchPayments, setIsAddingPayment]);

    const handleDeletePayment = useCallback((methodId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
            dispatchPayments({ type: 'DELETE_METHOD', payload: { id: methodId } });
        }
    }, [dispatchPayments]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">Tarjetas Guardadas</h2>
                <button
                    onClick={() => setIsAddingPayment(true)}
                    className="px-3 py-1 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition duration-150"
                >
                    + Agregar
                </button>
            </div>

            {isAddingPayment && (
                <form onSubmit={handleAddPayment} className="p-4 border border-green-300 bg-green-50 rounded-lg space-y-3 mb-4">
                    <h3 className="text-lg font-semibold text-green-700">Añadir Nueva Tarjeta</h3>
                    <div className="grid grid-cols-3 gap-3">
                         <input type="text" name="type" placeholder="Tipo (Visa, MC, etc)" value={newPaymentData.type} onChange={handleNewPaymentChange} required
                            className="col-span-1 p-2 border rounded-md"
                        />
                        <input type="text" name="last4" placeholder="Últimos 4 dígitos" value={newPaymentData.last4} onChange={handleNewPaymentChange} maxLength="4" required
                            className="col-span-1 p-2 border rounded-md"
                        />
                        <input type="text" name="expiry" placeholder="MM/AA" value={newPaymentData.expiry} onChange={handleNewPaymentChange} maxLength="5" required
                            className="col-span-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsAddingPayment(false)} className="text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
                        <button type="submit" className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Crear Tarjeta</button>
                    </div>
                </form>
            )}

            {payments.length > 0 ? (
                payments.map(method => (
                    <div key={method.id} className="flex justify-between items-center p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl text-gray-500">💳</span>
                            <div>
                                <p className="font-medium text-gray-800">{method.type} ****{method.last4}</p>
                                <p className="text-sm text-gray-500">Vence: {method.expiry}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDeletePayment(method.id)}
                            className="text-sm text-red-600 hover:text-red-800 font-semibold"
                        >
                            Eliminar
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center p-8 text-gray-500 border rounded-lg">No hay métodos de pago guardados.</div>
            )}
        </div>
    );
});

export default PaymentMethodsViewLg;