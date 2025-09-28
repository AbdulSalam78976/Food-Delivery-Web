import React, { useContext } from "react";
import "./navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../context/storecontext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const { getTotalCartItems } = useContext(StoreContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setCartOpen(false); // close cart if menu opens
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
    setMenuOpen(false); // close menu if cart opens
  };

  return (
    <div className="navbar">
      {/* Hamburger */}
      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="logo" alt="Logo" />
      </Link>

      {/* Mobile Cart */}
      <Link to="/cart" className="navbar-cart-mobile">
        <img src={assets.bag_icon} alt="Cart" />   
        {getTotalCartItems() > 0 && <div className="dot">{getTotalCartItems()}</div>}
      </Link>

      {/* Menu Drawer */}
      <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        <li className="navbar-item" onClick={toggleMenu}>
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item" onClick={toggleMenu}>
          <Link to="/">Menu</Link>
        </li>
        <li className="navbar-item" onClick={toggleMenu}>
          <Link to="/">About</Link>
        </li>
        {/* Auth links removed as requested */}
      </ul>

      {/* Cart Drawer */}
      <div className={`cart-drawer ${cartOpen ? "active" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="close-cart" onClick={toggleCart}>×</button>
        </div>
        <div className="cart-content">
          <p>No items added yet.</p>
        </div>
      </div>

      {/* Desktop Right Section */}
      <div className="navbar-right">
        <Link to="/cart" className="navbar-basket-icon" onClick={toggleCart}>
          <img src={assets.basket_icon} alt="Cart" />
          {getTotalCartItems() > 0 && <div className="dot">{getTotalCartItems()}</div>}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
