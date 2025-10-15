import React, { useContext } from 'react';
import './fooddisplay.css';
import { StoreContext } from '../context/storecontext';
import FoodItem from '../fooditem/fooditem';

function FoodDisplay({ category }) {
  const { getFoodItemsByCategory, loading } = useContext(StoreContext);
  
  // Get food items based on selected category
  const filteredFoods = getFoodItemsByCategory(category);

  if (loading) {
    return (
      <div className="food-display">
        <div className="food-container">
          <div className="loading">
            <p>Loading delicious food items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="food-display">
      <div className="food-container">
        <h2 className="food-section-title">
          {category === 'All' ? 'All Items' : `${category} `}
        </h2>
        
        {filteredFoods.length > 0 ? (
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <FoodItem 
                key={food.id} 
                food={food}
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