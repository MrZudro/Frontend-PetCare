import React from 'react';

export default function EmptyCartButtonTL({ onClick }) {
    return (
        <button 
            onClick={onClick}
            className="block mx-auto mt-6 text-acento-primario hover:text-acento-secundario underline text-sm transition-colors"
        >
            Vaciar Carrito
        </button>
    );
}