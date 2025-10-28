import React from 'react';

export default function EmptyCartButtonTL({ emptyCart }) {
    return (
        <button 
            className="block w-full max-w-7xl mx-auto text-white underline cursor-pointer text-base py-4 text-center hover:text-gray-200 transition"
            onClick={emptyCart}
        >
            Vaciar Carrito
        </button>
    );
}