import React, { useState, useContext } from "react";
import "./fooditem.css";
import FoodItemDetail from "../fooditemdetail/fooditemdetail";
import { StoreContext } from "../context/storecontext";
import { useToast } from "../toast/ToastProvider";

function FoodItem({ food }) {
  const [open, setOpen] = useState(false);
  const { addToCart } = useContext(StoreContext);
  const { success } = useToast();

  const handleCardClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCart = (details) => {
    addToCart(details);
    success(`${details.name} added to cart`);
  };

  return (
    <>
      {/* Food Card */}
      <div 
        className="food-item" 
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${food.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <div className="food-image-container">
          <img 
            src={food.image_url || "/assets/frontend_assets/food_1.png"} 
            alt={food.name} 
            className="food-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/assets/frontend_assets/food_1.png";
            }}
          />
        </div>
        <div className="food-info">
          <h3 className="food-name">{food.name}</h3>
          <p className="food-description">
            {food.description && food.description.length > 60
              ? food.description.slice(0, 60) + "..."
              : food.description || "Delicious food item"}
          </p>
          <div className="food-footer">
            <span className="food-price">Rs. {food.price}</span>
            <button
              className="full-add-btn"
              onClick={(e) => {
                e.stopPropagation(); // ✅ Prevent opening dialog
                handleAddToCart(food);
              }}
              aria-label={`Add ${food.name} to cart`}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Food Detail Dialog */}
      {open && (
        <FoodItemDetail
          food={food}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export default FoodItem;
