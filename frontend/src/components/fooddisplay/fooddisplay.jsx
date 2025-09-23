import React from 'react';
import './fooddisplay.css';
import { food_list } from '../../assets/frontend_assets/assets';
import FoodItem from '../fooditem/fooditem';

function FoodDisplay({ category }) {
  // Filter food items based on selected category
  const filteredFoods = category === 'All' 
    ? food_list 
    : food_list.filter(food => food.category === category);

  // Handle add to cart functionality
  const handleAddToCart = (food) => {
    console.log('Added to cart:', food.name);
    // TODO: Implement actual cart functionality
  };

  return (
    <div className="food-display">
      <div className="food-container">
        <h2 className="food-section-title">
          {category === 'All' ? 'All Items' : `${category} Items`}
        </h2>
        
        {filteredFoods.length > 0 ? (
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <FoodItem 
                key={food._id} 
                food={food} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="no-items">
            <p>No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodDisplay;