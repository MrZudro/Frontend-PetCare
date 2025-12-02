import { useState, useEffect } from "react";

// Componentes
import TitleTL from "../components/buyCart/TitleTL"; //titulo
import SummaryTL from "../components/buyCart/SummaryTL"; //resumen
import EmptyCartButtonTL from "../components/buyCart/EmptyCartButtonTL"; //boton vaciar carrito
import ProductListTL from "../components/buyCart/ProductListTL"; //1er vista
import ShippingOptionTL from "../components/buyCart/ShippingOptionTL"; //2da vista
import NewAddressTL from "../components/buyCart/NewAddressTL"; //3ra vista
import PaymentMethodTL from "../components/buyCart/PaymentMethodTL"; //4ta vista
import OrderReadyTL from "../components/buyCart/OrderReadyTL"; //5ta vista

// Datos Mock
import PRODUCTS_DATA from '../components/Data/products.json';

const STEPS = {
    CART: 'cart',
    DELIVERY: 'delivery',
    ADDRESS: 'address',
    PAYMENT: 'payment',
    CONFIRMATION: 'confirmation',
};

export default function BuyCartTL() {
    const [step, setStep] = useState(STEPS.CART);
    const [products, setProducts] = useState([]);

    // --- ESTADO PARA DATOS DEL USUARIO (PERSISTENCIA) ---
    const [checkoutData, setCheckoutData] = useState({
        deliveryOption: 'standar',
        address: {
            addressLine: '',
            department: 'Bogotá D.C.',
            city: 'Engativá',
            neighborhood: '',
            apartment: '',
            notes: '',
            placeType: 'Residencial'
        },
        paymentMethod: ''
    });

    // --- CARGA INICIAL ---
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cartProducts')) || [];
        const hydratedProducts = storedCart.map(cartItem => {
            const fullProduct = PRODUCTS_DATA.find(p => p.id === cartItem.id);
            if (fullProduct) return { ...fullProduct, quantity: cartItem.quantity };
            return null;
        }).filter(Boolean);
        setProducts(hydratedProducts);
    }, []);

    // --- FUNCIONES DE CARRITO ---
    const updateLocalStorage = (updated) => {
        localStorage.setItem('cartProducts', JSON.stringify(updated.map(p => ({ id: p.id, quantity: p.quantity }))));
    };

    const handleQuantityChange = (id, change) => {
        const updated = products.map(p => {
            if (p.id === id) return { ...p, quantity: Math.max(1, p.quantity + change) };
            return p;
        });
        setProducts(updated);
        updateLocalStorage(updated);
    };

    const removeProduct = (id) => {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        updateLocalStorage(updated);
    };

    const emptyCart = () => {
        setProducts([]);
        localStorage.removeItem('cartProducts');
    };

    // --- ACTUALIZAR DATOS ---
    const handleDataChange = (section, field, value) => {
        setCheckoutData(prev => ({
            ...prev,
            [section]: section === 'address' ? { ...prev.address, [field]: value } : value
        }));
    };

    // --- NAVEGACIÓN ---
    const nextStep = () => {
        if (step === STEPS.CART) setStep(STEPS.DELIVERY);
        else if (step === STEPS.DELIVERY) setStep(STEPS.ADDRESS); // Saltamos Fecha
        else if (step === STEPS.ADDRESS) setStep(STEPS.PAYMENT);
        else if (step === STEPS.PAYMENT) setStep(STEPS.CONFIRMATION);
    };

    const cancelProcess = () => {
        setStep(STEPS.CART);
    };

    const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

    // --- REGLAS DE VISIBILIDAD ---
    // Ocultar Summary en ADDRESS y CONFIRMATION
    const showSummary = step !== STEPS.ADDRESS && step !== STEPS.CONFIRMATION;
    // Mostrar cancelar en todas MENOS CONFIRMATION y CART (opcional en cart)
    const showCancelButton = step !== STEPS.CONFIRMATION && step !== STEPS.CART;

    let content;
    switch (step) {
        case STEPS.CART:
            content = (
                <>
                    <ProductListTL 
                        products={products} 
                        increaseQuantity={(id) => handleQuantityChange(id, 1)} 
                        decreaseQuantity={(id) => handleQuantityChange(id, -1)} 
                        handleRemoveProduct={removeProduct}
                    />
                    {products.length > 0 && <EmptyCartButtonTL emptyCart={emptyCart} />}
                </>
            );
            break;
        case STEPS.DELIVERY:
            content = (
                <ShippingOptionTL 
                    selectedOption={checkoutData.deliveryOption}
                    onSelect={(val) => handleDataChange('root', 'deliveryOption', val)}
                    onContinue={nextStep}
                />
            );
            break;
        case STEPS.ADDRESS:
            content = (
                <NewAddressTL 
                    data={checkoutData.address} 
                    onChange={handleDataChange} 
                    onContinue={nextStep}
                />
            );
            break;
        case STEPS.PAYMENT:
            content = <PaymentMethodTL onContinue={nextStep} />;
            break;
        case STEPS.CONFIRMATION:
            content = <OrderReadyTL products={products} subtotal={subtotal} />;
            break;
        default:
            content = null;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-fondo)] text-[var(--color-texto)] font-[family-name:var(--font-poppins)]">
            <main className="flex-grow px-4 py-8 max-w-7xl mx-auto w-full">
                <TitleTL step={step} />
                
                <div className={`flex flex-col ${showSummary ? 'lg:flex-row' : ''} gap-8`}>
                    
                    {/* CONTENIDO PRINCIPAL */}
                    <div className={`flex-1 ${!showSummary ? 'max-w-3xl mx-auto w-full' : ''}`}>
                        {content}

                        {/* Botón Cancelar Global */}
                        {showCancelButton && (
                            <div className="mt-6 text-left">
                                <button 
                                    onClick={cancelProcess}
                                    className="text-[var(--color-alerta)] hover:text-red-700 underline text-sm font-medium transition-colors"
                                >
                                    Cancelar y volver
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RESUMEN LATERAL */}
                    {showSummary && (
                        <div className="lg:w-1/3 xl:w-1/4 h-fit sticky top-4">
                            <SummaryTL 
                                products={products} 
                                subtotal={subtotal} 
                                onContinue={step === STEPS.CART ? nextStep : null}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}