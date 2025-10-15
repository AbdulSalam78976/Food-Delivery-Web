import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './cart.css'
import { StoreContext } from '../../components/context/storecontext'
import { assets } from '../../assets/frontend_assets/assets'

function Cart() {
  const { cartItems, updateCartItemQuantity, removeFromCart, getTotalCartAmount, clearCart } = useContext(StoreContext);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img src={assets.basket_icon} alt="Empty Cart" className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/" className="start-shopping-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.image_url || "/assets/frontend_assets/food_1.png"} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "/assets/frontend_assets/food_1.png";
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">Rs. {item.price}</p>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      <img src={assets.cross_icon} alt="Remove" />
                    </button>
                    <p className="item-total">Rs. {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="summary-header">
                <h3>Order Summary</h3>
                <button onClick={clearCart} className="clear-cart-btn">
                  Clear Cart
                </button>
              </div>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span>Rs. {getTotalCartAmount()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>Rs. 50</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>Rs. {getTotalCartAmount() + 50}</span>
                </div>
              </div>
              <div className="checkout-actions">
                <Link to="/" className="continue-shopping-btn">
                  Continue Shopping
                </Link>
                <Link to="/checkout" className="checkout-btn">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart