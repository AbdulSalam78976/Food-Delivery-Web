import React, { useState, useContext } from "react";
import { StoreContext } from "../context/storecontext";
import { assets } from "../../assets/frontend_assets/assets";
import "./fooditemdetail.css";
import { useToast } from "../toast/ToastProvider";

function FoodItemDetail({ food, onClose }) {
  const { addToCart } = useContext(StoreContext);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M"); // Only used when category is Pizza
  const [isAdding, setIsAdding] = useState(false);
  const { success } = useToast();
  

  // no addons/variants in simplified dialog

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const details = { ...food, quantity, size };
      addToCart(details);
       success(`${details.name} added to cart`);
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      if (onClose) onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const updateQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Calculate total price (no addons)
  const calculateTotalPrice = () => {
    return food.price * quantity;
  };

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <button className="close-dialog-btn" onClick={onClose}>
          <img src={assets.cross_icon} alt="Close" />
        </button>
        
        <div className="dialog-content">
          <div className="food-image-container">
            <img src={food.image} alt={food.name} />
          </div>
          
          <div className="food-details">
            <h2>{food.name}</h2>
            <p className="food-category">{food.category}</p>
            <p className="food-description">{food.description}</p>
            <p className="food-price">Rs. {food.price}</p>

            {/* Pizza size selector */}
            {food.category === "Pizza" && (
              <div className="option-group">
                <h4>Choose Size:</h4>
                <div className="size-selector">
                  {['S','M','L'].map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`size-btn ${size === s ? 'active' : ''}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="option-group">
              <h4>Quantity:</h4>
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={() => updateQuantity(1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="price-breakdown">
              <div className="price-row total-price">
                <span>Total</span>
                <span>Rs. {calculateTotalPrice()}</span>
              </div>
            </div>


            <div className="dialog-actions">
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : `Add to Cart - Rs. ${calculateTotalPrice()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodItemDetail;
