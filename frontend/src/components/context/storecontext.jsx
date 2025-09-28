import { createContext, useState } from "react";
import { food_list } from "../../assets/frontend_assets/assets";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);

    const addToCart = (food, quantity = 1) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item._id === food._id);
            if (existingItem) {
                return prev.map(item =>
                    item._id === food._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prev, { ...food, quantity }];
            }
        });
    };

    const removeFromCart = (foodId) => {
        setCartItems(prev => prev.filter(item => item._id !== foodId));
    };

    const updateCartItemQuantity = (foodId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(foodId);
        } else {
            setCartItems(prev =>
                prev.map(item =>
                    item._id === foodId ? { ...item, quantity } : item
                )
            );
        }
    };

    const getTotalCartAmount = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        clearCart();
    };

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotalCartAmount,
        getTotalCartItems,
        clearCart,
        user,
        login,
        logout
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;