import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCustomerAddresses } from "../services/addressService";

// Componentes
import TitleTL from "../components/buyCart/TitleTL"; //titulo
import SummaryTL from "../components/buyCart/SummaryTL"; //resumen
import EmptyCartButtonTL from "../components/buyCart/EmptyCartButtonTL"; //boton vaciar carrito
import ProductListTL from "../components/buyCart/ProductListTL"; //1er vista
import ShippingOptionTL from "../components/buyCart/ShippingOptionTL"; //2da vista
import NewAddressTL from "../components/buyCart/NewAddressTL"; //3ra vista
import PaymentMethodsViewLg from "../components/profile/PaymentMethodsViewLg"; //4ta vista
import OrderReadyTL from "../components/buyCart/OrderReadyTL"; //5ta vista
import { createOrder } from "../services/orderService";

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

    const { user } = useAuth();
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderData, setOrderData] = useState(null);

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
            placeType: 'Residencial',
            // Fields needed for creating new address
            localityId: '',
            neighborhoodId: '',
            saveAddress: false
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

    // Load user addresses
    useEffect(() => {
        const loadAddresses = async () => {
            if (user?.id) {
                try {
                    const addresses = await getCustomerAddresses(user.id);
                    setSavedAddresses(addresses);

                    // Select default address if available
                    const defaultAddr = addresses.find(a => a.isDefault);
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.id);
                        // Update checkout data with default address info
                        handleAddressSelect(defaultAddr);
                    } else if (addresses.length > 0) {
                        setSelectedAddressId(addresses[0].id);
                        handleAddressSelect(addresses[0]);
                    } else {
                        setShowAddressForm(true); // No addresses, show form
                    }
                } catch (err) {
                    console.error("Error loading addresses:", err);
                    setShowAddressForm(true);
                }
            } else {
                setShowAddressForm(true); // Guest or not logged in
            }
        };
        loadAddresses();
    }, [user]);

    const handleAddressSelect = (address) => {
        setCheckoutData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                addressLine: address.addressLine,
                neighborhood: address.neighborhoodName || '',
                notes: address.deliveryNotes || '',
                placeType: address.addressType || 'Residencial'
            }
        }));
    };

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

    // --- FINALIZAR COMPRA ---
    const handleCheckout = async () => {
        try {
            setIsProcessing(true);
            const checkoutPayload = {
                userId: user.id,
                paymentMethodId: checkoutData.paymentMethod.id,
                shippingAddress: `${checkoutData.address.addressLine}, ${checkoutData.address.neighborhood}, ${checkoutData.address.city}`, // Simple string for now
                items: products.map(p => ({
                    productId: p.id,
                    quantity: p.quantity
                }))
            };

            console.log('🚀 BuyCartTL - Enviando checkout payload:', checkoutPayload);
            console.log('🚀 BuyCartTL - Products antes de enviar:', products);

            const response = await createOrder(checkoutPayload);

            console.log('✅ BuyCartTL - Respuesta del backend:', response);
            console.log('✅ BuyCartTL - billDetails en respuesta:', response?.billDetails);

            setOrderData(response);
            // emptyCart(); // Moved to OrderReadyTL exit or explicit action
            nextStep();
        } catch (error) {
            console.error("❌ Error al procesar compra:", error);
            console.error("❌ Detalles del error:", error.response?.data);
            alert("Hubo un error al procesar tu compra. Por favor intenta nuevamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- ACTUALIZAR DATOS ---
    const handleDataChange = (section, field, value) => {
        setCheckoutData(prev => {
            // Special case for full address update (used by NewAddressTL)
            if (section === 'root' && field === 'address') {
                return { ...prev, address: value };
            }
            // Generic root level update (e.g. deliveryOption)
            if (section === 'root') {
                return { ...prev, [field]: value };
            }

            // Standard nested update
            return {
                ...prev,
                [section]: section === 'address' ? { ...prev.address, [field]: value } : value
            };
        });
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
            content = showAddressForm ? (
                <NewAddressTL
                    data={checkoutData.address}
                    onChange={handleDataChange}
                    onContinue={(savedAddress) => {
                        // If we saved an address, add it to list and select it
                        if (savedAddress && savedAddress.id) {
                            setSavedAddresses(prev => [...prev, savedAddress]);
                            setSelectedAddressId(savedAddress.id);
                            handleAddressSelect(savedAddress);
                            setShowAddressForm(false);
                            // Don't auto-advance to allow user to verify selection
                        } else if (!savedAddress) {
                            // Just regular continue with manual data
                            nextStep();
                        }
                    }}
                    onCancel={() => {
                        // Only allow cancel if we have addresses to go back to
                        if (savedAddresses.length > 0) {
                            setShowAddressForm(false);
                        }
                    }}
                    customerId={user?.id}
                />
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[var(--color-texto)] mb-4">
                        Selecciona una dirección de entrega
                    </h3>
                    <div className="space-y-4 mb-6">
                        {savedAddresses.map(addr => (
                            <div
                                key={addr.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id
                                    ? 'border-[var(--color-primary)] bg-teal-50 ring-1 ring-[var(--color-primary)]'
                                    : 'border-gray-200 hover:border-[var(--color-primary)]'
                                    }`}
                                onClick={() => {
                                    setSelectedAddressId(addr.id);
                                    handleAddressSelect(addr);
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-[var(--color-texto)]">
                                                {addr.addressLine}
                                            </p>
                                            {addr.isDefault && (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                                    Predeterminada
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {addr.neighborhoodName ? `${addr.neighborhoodName}, ` : ''}
                                            {addr.localityName || 'Bogotá'}
                                        </p>
                                        {addr.additionalInfo && (
                                            <p className="text-sm text-gray-500 mt-1">{addr.additionalInfo}</p>
                                        )}
                                        {addr.deliveryNotes && (
                                            <p className="text-xs text-gray-400 mt-1 italic">Nota: {addr.deliveryNotes}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${addr.addressType === 'RESIDENTIAL' ? 'bg-green-100 text-green-800' :
                                            addr.addressType === 'WORK' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {addr.addressType === 'RESIDENTIAL' ? 'Residencial' :
                                                addr.addressType === 'WORK' ? 'Trabajo' : 'Otro'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4 border-t">
                        <button
                            onClick={() => setShowAddressForm(true)}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
                        >
                            + Nueva dirección
                        </button>

                        <button
                            onClick={nextStep}
                            disabled={!selectedAddressId}
                            className="bg-[var(--color-primary)] text-white px-8 py-2 rounded font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            );
            break;
        case STEPS.PAYMENT:
            content = (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <PaymentMethodsViewLg
                        userId={user.id}
                        selectionMode={true}
                        onSelect={(method) => handleDataChange('root', 'paymentMethod', method)}
                    />

                    <div className="mt-8 flex justify-end pt-6 border-t">
                        <button
                            onClick={handleCheckout}
                            disabled={!checkoutData.paymentMethod || isProcessing}
                            className="bg-[var(--color-primary)] text-white px-8 py-2 rounded font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
                        </button>
                    </div>
                </div>
            );
            break;
        case STEPS.CONFIRMATION:
            content = <OrderReadyTL orderData={orderData} onExit={emptyCart} />;
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
                                disabled={step === STEPS.CART && products.length === 0}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}