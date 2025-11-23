// src/utils/cartUtils.js

// Clave para el localStorage
const CART_KEY = 'cartProducts';

/**
 * Agrega un producto al carrito.
 * Si ya existe, suma 1 a la cantidad.
 * @param {number} productId - El ID del producto
 */
export const addToCart = (productId) => {
    // 1. Obtener carrito actual
    const currentCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    // 2. Buscar si el producto ya está
    const existingIndex = currentCart.findIndex(item => item.id === productId);

    if (existingIndex !== -1) {
        // Si existe, aumentamos cantidad
        currentCart[existingIndex].quantity += 1;
    } else {
        // Si no existe, lo creamos con cantidad 1
        currentCart.push({ id: productId, quantity: 1 });
    }

    // 3. Guardar
    localStorage.setItem(CART_KEY, JSON.stringify(currentCart));

    // 4. (Opcional) Disparar un evento personalizado para que otros componentes (como el header) se enteren
    window.dispatchEvent(new Event("cart-updated"));
};

/**
 * Obtiene la cantidad total de items (opcional, útil para el ícono del header)
 */
export const getCartCount = () => {
    const currentCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    return currentCart.reduce((acc, item) => acc + item.quantity, 0);
};