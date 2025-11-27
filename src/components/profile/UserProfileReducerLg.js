// src/components/profile/UserProfileReducerLg.js

// --- Reducer para Métodos de Pago (CRUD) ---
export const paymentMethodsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_METHOD':
            const newId = Date.now(); 
            return [...state, { ...action.payload, id: newId }];
        case 'DELETE_METHOD':
            return state.filter(method => method.id !== action.payload.id);
        default:
            return state;
    }
};

// --- Estados Iniciales ---
export const initialPaymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/26' },
    { id: 2, type: 'MasterCard', last4: '0011', expiry: '05/25' },
];

export const initialProfileData = { 
    name: 'Ana', lastName: 'Pérez', email: 'ana.perez@ejemplo.com', phone: '300 123 4567',
    address: 'Calle Falsa 123, Bogotá', birthDate: '1990-01-01', nameChangeLockUntil: null, 
};

// Definición de ítems de navegación (para centralizar los iconos)
export const navItemsLg = [
    // Nota: Los iconos deben ser importados en UserProfileViewLg
    { id: 'profile', label: 'Información Personal', icon: 'FaUser' },
    { id: 'orders', label: 'Historial de Pedidos', icon: 'FaBox' },
    { id: 'payments', label: 'Métodos de Pago', icon: 'FaCreditCard' },
];