import React, { useState } from "react";
import "./fooditem.css";
import FoodItemDetail from "../fooditemdetail/fooditemdetail";

function FoodItem({ food }) {
  const [open, setOpen] = useState(false);

  const handleCardClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCart = (details) => {
    console.log("Added to cart:", details);
    // Later, replace console.log with actual add-to-cart logic (context/state)
  };

  return (
    <>
      {/* Food Card */}
      <div className="food-item" onClick={handleCardClick}>
        <div className="food-image-container">
          <img src={food.image} alt={food.name} className="food-image" />
        </div>
        <div className="food-info">
          <h3 className="food-name">{food.name}</h3>
          <p className="food-description">
            {food.description.length > 60
              ? food.description.slice(0, 60) + "..."
              : food.description}
          </p>
          <div className="food-footer">
            <span className="food-price">Rs. {food.price}</span>
            <button
              className="full-add-btn"
              onClick={(e) => {
                e.stopPropagation(); // ✅ Prevent opening dialog
                handleAddToCart(food);
              }}
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
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}

export default FoodItem;
