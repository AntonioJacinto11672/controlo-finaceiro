import { CartProductType } from '@/utils/cartType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';


interface CartContextType {
    cartTotalQty: number;
    cartTotalAmount: number;
    cartProducts: CartProductType[] | null;
    handleAddProductToCart: (product: CartProductType) => void;
    handleRemoveProductFromCart: (product: CartProductType) => void;
    handleCartQtyIncrease: (product: CartProductType) => void;
    handleCartQtyDecrease: (product: CartProductType) => void;
    handleClearCart: () => void;
    paymentIntent: string | null;
    handleSetPaymentIntent: (val: string | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartTotalQty, setCartTotalQty] = useState(0);
    const [cartTotalAmount, setCartTotalAmount] = useState(0);
    const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);
    const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const cartItems = await AsyncStorage.getItem('netFarmaCartItems');
                const netFarmaPaymentIntent = await AsyncStorage.getItem('netFarmaPaymentIntent');
                if (cartItems) {
                    setCartProducts(JSON.parse(cartItems));
                }
                if (netFarmaPaymentIntent) {
                    setPaymentIntent(JSON.parse(netFarmaPaymentIntent));
                }
            } catch (error) {
                console.error('Erro ao carregar o carrinho:', error);
            }
        };

        loadCart();
    }, []);

    useEffect(() => {
        if (!cartProducts) return;
        const { total, qty } = cartProducts.reduce(
            (acc, item) => {
                const itemTotal = item.price * item.quantity;
                acc.total += itemTotal;
                acc.qty += item.quantity;
                return acc;
            },
            { total: 0, qty: 0 }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
    }, [cartProducts]);

    const persistCart = async (updatedCart: CartProductType[]) => {
        try {
            const result = await AsyncStorage.setItem('netFarmaCartItems', JSON.stringify(updatedCart));
            console.log('Carrinho salvo com sucesso:', result);
        } catch (error) {
            console.error('Erro ao salvar carrinho:', error);
        }
    };

    const handleAddProductToCart = useCallback((product: CartProductType) => {
        setCartProducts((prev) => {
            const updatedCart = prev ? [...prev, product] : [product];
            persistCart(updatedCart);
            return updatedCart;
        });
    }, []);

    const handleRemoveProductFromCart = useCallback((product: CartProductType) => {
        if (!cartProducts) return;
        const filteredProducts = cartProducts.filter(item => item.id !== product.id);
        setCartProducts(filteredProducts);
        persistCart(filteredProducts);
    }, [cartProducts]);

    const handleCartQtyIncrease = useCallback((product: CartProductType) => {
        if (!cartProducts || product.quantity >= 99) return;
        const updatedCart = cartProducts.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartProducts(updatedCart);
        persistCart(updatedCart);
    }, [cartProducts]);

    const handleCartQtyDecrease = useCallback((product: CartProductType) => {
        if (!cartProducts || product.quantity <= 1) return;
        const updatedCart = cartProducts.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCartProducts(updatedCart);
        persistCart(updatedCart);
    }, [cartProducts]);

    const handleClearCart = useCallback(() => {
        setCartProducts(null);
        setCartTotalQty(0);
        setCartTotalAmount(0);
        AsyncStorage.removeItem('netFarmaCartItems');
    }, []);

    const handleSetPaymentIntent = useCallback(async (val: string | null) => {
        try {
            setPaymentIntent(val);
            await AsyncStorage.setItem('netFarmaPaymentIntent', JSON.stringify(val));
        } catch (error) {
            console.error('Erro ao definir paymentIntent:', error);
        }
    }, []);

    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
        paymentIntent,
        handleSetPaymentIntent
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
}
