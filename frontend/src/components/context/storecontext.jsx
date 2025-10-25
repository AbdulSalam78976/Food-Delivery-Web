import { createContext, useState, useEffect } from "react";
import { databaseService } from "../../lib/database";
import { useAuth } from "../../hooks/useAuth";
import { useAppLoader } from "../../contexts/AppLoaderContext";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const { updateLoadingStep } = useAppLoader();

    // Fetch food items and categories from Supabase
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch food items and categories in parallel
                const [foodItemsResult, categoriesResult] = await Promise.all([
                    databaseService.getFoodItems(),
                    databaseService.getCategories()
                ]);

                if (foodItemsResult.data) {
                    setFoodItems(foodItemsResult.data);
                }

                if (categoriesResult.data) {
                    setCategories(categoriesResult.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
                updateLoadingStep('data', true);
            }
        };

        fetchData();
    }, []);

    const addToCart = (food, quantity = 1) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === food.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === food.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prev, { ...food, quantity }];
            }
        });
    };

    const removeFromCart = (foodId) => {
        setCartItems(prev => prev.filter(item => item.id !== foodId));
    };

    const updateCartItemQuantity = (foodId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(foodId);
        } else {
            setCartItems(prev =>
                prev.map(item =>
                    item.id === foodId ? { ...item, quantity } : item
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

    // Get food items by category
    const getFoodItemsByCategory = (categoryName) => {
        if (categoryName === 'All') {
            return foodItems;
        }
        return foodItems.filter(food => 
            food.category_id && 
            categories.find(cat => cat.id === food.category_id)?.name === categoryName
        );
    };

    // Refresh food items
    const refreshFoodItems = async () => {
        try {
            const { data, error } = await databaseService.getFoodItems();
            if (data && !error) {
                setFoodItems(data);
            }
        } catch (error) {
            console.error('Error refreshing food items:', error);
        }
    };

    // Refresh categories
    const refreshCategories = async () => {
        try {
            const { data, error } = await databaseService.getCategories();
            if (data && !error) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error refreshing categories:', error);
        }
    };

    const contextValue = {
        // Data
        foodItems,
        categories,
        cartItems,
        loading,
        isAuthenticated,
        user,
        
        // Cart functions
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotalCartAmount,
        getTotalCartItems,
        clearCart,
        
        // Food functions
        getFoodItemsByCategory,
        refreshFoodItems,
        refreshCategories
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;