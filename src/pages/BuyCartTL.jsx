import { useState, useEffect } from "react";

import TitleTL from "../components/buyCart/TitleTL";
import ProductListTL from "../components/buyCart/ProductListTL";
import SummaryTL from "../components/buyCart/SummaryTL";
import EmptyCartButtonTL from "../components/buyCart/EmptyCartButtonTL";
import ShippingOptionTL from "../components/buyCart/ShippingOptionTL";
import NewAddressTL from "../components/buyCart/NewAddressTL";
import ShippingDateTL from "../components/buyCart/ShippingOptionTL";
import PaymentMethodTL from "../components/buyCart/PaymentMethodTL";
import OrderReadyTL from "../components/buyCart/OrderReadyTL";

// Datos Mock (Simulados) para visualización inmediata
import PRODUCTS_DATA from '../components/Data/products.json';

const STEPS = {
    CART: 'cart',
    DELIVERY: 'delivery',
    ADDRESS: 'address',
    DATE: 'date',
    PAYMENT: 'payment',
    CONFIRMATION: 'confirmation',
};

export default function BuyCartTL() {

    const [step, setStep] = useState(STEPS.CART);
    const [products, setProducts] = useState([]); // 1. Iniciar vacío
    const [address, setAddress] = useState('');

    // --- 2. EFECTO: CARGAR DATOS DEL LOCALSTORAGE ---
    useEffect(() => {
        // Leemos el carrito guardado (solo IDs y cantidades)
        const storedCart = JSON.parse(localStorage.getItem('cartProducts')) || [];

        // Cruzamos los IDs del storage con la información completa del JSON
        const hydratedProducts = storedCart.map(cartItem => {
            const fullProduct = PRODUCTS_DATA.find(p => p.id === cartItem.id);
            if (fullProduct) {
                return { ...fullProduct, quantity: cartItem.quantity };
            }
            return null;
        }).filter(Boolean); // Eliminamos nulos si algún producto ya no existe

        setProducts(hydratedProducts);
    }, []);

    // --- 3. FUNCIÓN AUXILIAR: GUARDAR EN LOCALSTORAGE ---
    const updateLocalStorage = (updatedProducts) => {
        const cartToSave = updatedProducts.map(p => ({ id: p.id, quantity: p.quantity }));
        localStorage.setItem('cartProducts', JSON.stringify(cartToSave));
    };

    // --- 4. LÓGICA DE BOTONES (CANTIDAD) ---
    const increaseQuantity = (id) => {
        const updatedProducts = products.map(p => 
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
        );
        setProducts(updatedProducts);
        updateLocalStorage(updatedProducts);
    };

    const decreaseQuantity = (id) => {
        const updatedProducts = products.map(p => 
            p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
        );

        setProducts(updatedProducts);
        updateLocalStorage(updatedProducts);
    };

    const removeProduct = (id) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    updateLocalStorage(updatedProducts); // Llama a la función que guarda en LS
};

    const emptyCart = () => {
        setProducts([]);
        localStorage.removeItem('cartProducts');
    };

    // --- Lógica de UI ---
    const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

    // Funciones de Transición
    const goToDelivery = () => { setStep(STEPS.DELIVERY); };
    const goToAddress = () => { setStep(STEPS.ADDRESS); };
    const goToDate = () => { setStep(STEPS.DATE); };
    const goToPayment = () => { setStep(STEPS.PAYMENT); };
    const goToConfirmation = () => { setStep(STEPS.CONFIRMATION); };
    
    let CurrentView;
    const baseLayoutClasses = "flex flex-col min-h-screen bg-fondo text-texto"; // Asegúrate de tener estos colores en tailwind.config
    const bodyContentClasses = "flex-grow px-8 pb-8 pt-24 max-w-7xl mx-auto w-full"; 

    if (step === STEPS.CART) {
        CurrentView = (
            <>
                <TitleTL />
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:flex-3">
                        {/* 5. PASAMOS LAS FUNCIONES A PRODUCTLIST */}
                        <ProductListTL 
                            products={products} 
                            increaseQuantity={increaseQuantity} 
                            decreaseQuantity={decreaseQuantity} 
                            handleRemoveProduct={removeProduct}
                        />
                        {products.length > 0 && <EmptyCartButtonTL emptyCart={emptyCart} />}
                    </div>
                    <div className="lg:flex-1">
                        <SummaryTL products={products} subtotal={subtotal} goToNextStep={goToDelivery} isDeliveryView={false}/>
                    </div>
                </div>
            </>
        );
    } else if (step === STEPS.DELIVERY) {
        CurrentView = (
            <ShippingOptionTL products={products} subtotal={subtotal} goToNextStep={goToAddress}/>
        );
    } else if (step === STEPS.ADDRESS) {
        CurrentView = (
            <NewAddressTL products={products} subtotal={subtotal} setAddress={setAddress} goToNextStep={goToDate}/>
        );
    } else if (step === STEPS.DATE){
        CurrentView = (
            <ShippingDateTL products={products} subtotal={subtotal} selectedAddress={address} goToNextStep={goToPayment}/>
        )
    } else if (step === STEPS.PAYMENT){
        CurrentView = (
            <PaymentMethodTL products={products} subtotal={subtotal} goToNextStep={goToConfirmation}/>
        )
    } else if (step === STEPS.CONFIRMATION){
        CurrentView = (
            <OrderReadyTL products={products} subtotal={subtotal}/>
        )
    }
    
    return (
        <div className={baseLayoutClasses}> 
            <main className={bodyContentClasses}> 
                {CurrentView} 
            </main>
        </div>
    );
}