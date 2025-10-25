import React from 'react'
import './loader.css'

const Loader = ({ message = "Preparing your delicious meal..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        {/* Food Delivery Truck Animation */}
        <div className="delivery-truck">
          <div className="truck-body">
            <div className="truck-cab"></div>
            <div className="truck-cargo">
              <div className="food-items">
                <div className="food-item pizza">🍕</div>
                <div className="food-item burger">🍔</div>
                <div className="food-item fries">🍟</div>
              </div>
            </div>
          </div>
          <div className="truck-wheels">
            <div className="wheel"></div>
            <div className="wheel"></div>
          </div>
          <div className="delivery-smoke">
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
          </div>
        </div>


        
        {/* Central Rotating Food Icon */}
        <div className="central-food-icon">🍽️</div>

        {/* Animated Food Icons */}
        <div className="food-animations">
          <div className="floating-food pizza-icon">🍕</div>
          <div className="floating-food burger-icon">🍔</div>
          <div className="floating-food drink-icon">🥤</div>
          <div className="floating-food dessert-icon">🍰</div>
        </div>

        {/* Progress Dots */}
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

export default Loader
