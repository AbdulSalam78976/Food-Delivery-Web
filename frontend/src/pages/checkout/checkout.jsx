import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './checkout.css'
import { StoreContext } from '../../components/context/storecontext'
import { useAuth } from '../../hooks/useAuth'
import { databaseService } from '../../lib/database'
import { useToast } from '../../components/toast/ToastProvider'
import { assets } from '../../assets/frontend_assets/assets'

function Checkout() {
  const { cartItems, getTotalCartAmount, clearCart } = useContext(StoreContext)
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()
  
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: user?.user_metadata?.phone || '',
    paymentMethod: 'cash',
    specialInstructions: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required'
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (!/^\d{5,6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }
    
    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }
    
    if (!validateForm()) return
    
    setIsProcessing(true)
    
    try {
      // Prepare order data
      const deliveryAddress = `${formData.deliveryAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`
      const totalAmount = getTotalCartAmount() + 50 // including delivery fee
      
      const orderData = {
        user_id: user.id,
        status: 'pending',
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        payment_method: formData.paymentMethod,
        notes: formData.specialInstructions
      }
      
      // Create order in Supabase
      const { data: order, error: orderError } = await databaseService.createOrder(orderData)
      
      if (orderError) {
        throw orderError
      }
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        food_item_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
      
      const { error: itemsError } = await databaseService.createOrderItems(orderItems)
      
      if (itemsError) {
        throw itemsError
      }
      
      // Save address for future use
      await databaseService.createAddress({
        user_id: user.id,
        street_address: formData.deliveryAddress,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        is_default: false
      })
      
      // Clear cart and show success
      clearCart()
      success('Order placed successfully!')
      setOrderPlaced(true)
    } catch (error) {
      console.error('Order error:', error)
      setErrors({ general: error.message || 'Order failed. Please try again.' })
      toastError('Order failed')
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <img src={assets.parcel_icon} alt="Order Placed" className="success-icon" />
            <h1>Order Placed Successfully!</h1>
            <p>Your order has been confirmed and will be delivered soon.</p>
            <div className="success-actions">
              <Link to="/" className="continue-shopping-btn">
                Continue Shopping
              </Link>
              <Link to="/orders" className="view-orders-btn">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="login-required">
            <h1>Login Required</h1>
            <p>Please log in to proceed with checkout.</p>
            <div className="auth-actions">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-cart">
            <img src={assets.basket_icon} alt="Empty Cart" className="empty-cart-icon" />
            <h1>Your cart is empty</h1>
            <p>Add some items to your cart before checkout.</p>
            <Link to="/" className="start-shopping-btn">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-section">
            <form className="checkout-form" onSubmit={handleSubmit}>
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <div className="form-section">
                <h2>Delivery Information</h2>
                
                <div className="form-group">
                  <label htmlFor="deliveryAddress">Delivery Address *</label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    className={errors.deliveryAddress ? 'error' : ''}
                    placeholder="Enter your complete delivery address"
                    rows="3"
                  />
                  {errors.deliveryAddress && (
                    <span className="error-message">{errors.deliveryAddress}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <span className="error-message">{errors.city}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <span className="error-message">{errors.state}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={errors.zipCode ? 'error' : ''}
                      placeholder="Enter ZIP code"
                    />
                    {errors.zipCode && (
                      <span className="error-message">{errors.zipCode}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                    />
                    <span className="payment-label">
                      <img src={assets.bag_icon} alt="Cash" />
                      Cash on Delivery
                    </span>
                  </label>
              {/*
  <label className="payment-option">
    <input
      type="radio"
      name="paymentMethod"
      value="card"
      checked={formData.paymentMethod === 'card'} 
      onChange={handleChange}
    />
    <span className="payment-label">
      <img src={assets.bag_icon} alt="Card" />
      Credit/Debit Card
    </span>
  </label>
*/}

                </div>
              </div>

              <div className="form-section">
                <h2>Special Instructions</h2>
                <div className="form-group">
                  <label htmlFor="specialInstructions">Additional Notes (Optional)</label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery..."
                    rows="3"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.image_url || "/assets/frontend_assets/food_1.png"} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "/assets/frontend_assets/food_1.png";
                    }}
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">Rs. {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rs. {getTotalCartAmount()}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee</span>
                <span>Rs. 50</span>
              </div>
              <div className="total-row final-total">
                <span>Total</span>
                <span>Rs. {getTotalCartAmount() + 50}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout