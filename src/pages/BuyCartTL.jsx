import { useState } from "react";

import TitleTL from "../components/buyCart/TitleTL";
import ProductListTL from "../components/buyCart/ProductListTL";
import SummaryTL from "../components/buyCart/SummaryTL";
import EmptyCartButtonTL from "../components/buyCart/EmptyCartButtonTL";
import ShippingOptionTL from "../components/buyCart/ShippingOptionTL";
import NewAddressTL from "../components/buyCart/NewAddressTL";
import ShippingDateTL from "../components/buyCart/ShippingOptionTL";
import PaymentMethodTL from "../components/buyCart/PaymentMethodTL";
import OrderReadyTL from "../components/buyCart/OrderReadyTL";

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
    const [products, setProducts] = useState([ 
        { id: 1, name: "Nombre Producto", weight: "Peso producto", price: 20000, quantity: 1 }, 
        { id: 2, name: "Nombre Producto", weight: "Peso producto", price: 15000, quantity: 1 },
        { id: 3, name: "Nombre Producto", weight: "Peso producto", price: 41000, quantity: 1 },
    ]);
    const [address, setAddress] = useState(''); 
    
    // Funciones de Modificación en inglés
    const increaseQuantity = (id) => { 
        setProducts(products.map(p => 
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
        ));
    };
    const decreaseQuantity = (id) => { 
        setProducts(products.map(p => 
            p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
        ));
    };
    const emptyCart = () => { setProducts([]); };
    const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0); 

    // Funciones de Transición en inglés
    const goToDelivery = () => { setStep(STEPS.DELIVERY); };
    const goToAddress = () => { setStep(STEPS.ADDRESS); };
    const goToDate = () => { setStep(STEPS.DATE); };
    const goToPayment = () => { setStep(STEPS.PAYMENT); };
    const goToConfirmation = () => { setStep(STEPS.CONFIRMATION); };
    
    let CurrentView;
    const baseLayoutClasses = "flex flex-col min-h-screen bg-[#0b4f6c] text-gray-800";
    const bodyContentClasses = "flex-grow px-8 pb-8 pt-24 max-w-7xl mx-auto w-full"; 
    
    if (step === STEPS.CART) {
        CurrentView = (
            <>
                <TitleTL />
                <div className="flex flex-col md:flex-row gap-5">
                    <ProductListTL products={products} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity}/>
                    <SummaryTL products={products} subtotal={subtotal} goToNextStep={goToDelivery} isDeliveryView={false}/>
                </div>
                {products.length > 0 && <EmptyCartButtonTL emptyCart={emptyCart} />} 
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