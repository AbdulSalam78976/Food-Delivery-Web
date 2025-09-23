import React, { useState } from "react";

function FoodItemDetail({ food, onClose, onAddToCart }) {
  const [size, setSize] = useState("M"); // for Pizza
  const [mealOption, setMealOption] = useState("simple"); // for Burger
  const [addons, setAddons] = useState([]);

  const handleAddonChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAddons((prev) => [...prev, value]);
    } else {
      setAddons((prev) => prev.filter((a) => a !== value));
    }
  };

  const handleAddToCart = () => {
    const details = { ...food, size, mealOption, addons };
    if (onAddToCart) onAddToCart(details);
    if (onClose) onClose();
  };

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>{food.name}</h2>
        <img src={food.image} alt={food.name} />
        <p>{food.description}</p>
        <p className="food-price">Rs. {food.price}</p>

        {/* Pizza Options */}
        {food.category === "Pizza" && (
          <div className="option-group">
            <h4>Choose Size:</h4>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>
        )}

        {/* Burger Options */}
        {food.category === "Burger" && (
          <div className="option-group">
            <h4>Choose Meal:</h4>
            <select
              value={mealOption}
              onChange={(e) => setMealOption(e.target.value)}
            >
              <option value="simple">Simple Burger</option>
              <option value="meal">With Fries & Drink</option>
              <option value="cheese">Cheese Meal</option>
            </select>
          </div>
        )}

        {/* Common Add-ons */}
        <div className="option-group">
          <h4>Optional Add-ons:</h4>
          <label>
            <input
              type="checkbox"
              value="Ketchup"
              checked={addons.includes("Ketchup")}
              onChange={handleAddonChange}
            />
            Extra Ketchup
          </label>
          <label>
            <input
              type="checkbox"
              value="Mayo"
              checked={addons.includes("Mayo")}
              onChange={handleAddonChange}
            />
            Mayo Dip
          </label>
          <label>
            <input
              type="checkbox"
              value="Drink"
              checked={addons.includes("Drink")}
              onChange={handleAddonChange}
            />
            Cold Drink
          </label>
        </div>

        <button className="full-add-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default FoodItemDetail;
