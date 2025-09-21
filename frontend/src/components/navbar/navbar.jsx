import React from "react";
import "./navbar.css";
import { assets } from "../../assets/frontend_assets/assets";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);

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
      {/* Hamburger (mobile left) */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Logo */}
      <img src={assets.logo} className="logo" alt="Logo" />

      {/* Mobile Cart (right of logo) */}
      <div className="navbar-cart-mobile" onClick={toggleCart}>
        <img src={assets.basket_icon} alt="Basket Icon" />
        <div className="dot"></div>
      </div>

      {/* Menu Drawer */}
      <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        <li className="navbar-item" onClick={toggleMenu}>Home</li>
        <li className="navbar-item" onClick={toggleMenu}>Menu</li>
        <li className="navbar-item" onClick={toggleMenu}>About</li>
        <li className="navbar-item" onClick={toggleMenu}>Contact</li>
      </ul>

      {/* Cart Drawer */}
      <div className={`cart-drawer ${cartOpen ? "active" : ""}`}>
        <h3>Your Cart</h3>
        <p>No items added yet.</p>
        <button className="close-cart" onClick={toggleCart}>Close</button>
      </div>

      {/* Desktop Right Section */}
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search Icon" />
        <div className="navbar-search-icon" onClick={toggleCart}>
          <img src={assets.basket_icon} alt="Basket Icon" />
          <div className="dot"></div>
        </div>
        <button className="login-button">Login</button>
      </div>
    </div>
  );
};

export default Navbar;
