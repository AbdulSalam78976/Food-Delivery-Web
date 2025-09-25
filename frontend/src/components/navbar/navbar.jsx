import React from "react";
import "./navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import SideMenu from "../sidemenu/sidemenu";

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
      {/* Hamburger */}
      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Logo */}
      <img src={assets.logo} className="logo" alt="Logo" />

      {/* Mobile Cart */}
      <div className="navbar-cart-mobile" onClick={toggleCart}>
        <img src={assets.basket_icon} alt="Basket Icon" />
        <div className="dot"></div>
      </div>

      {/* ✅ Side Menu Drawer Component */}
      <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

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
        <img src={assets.search_icon} alt="Search Icon" className="search-icon" />
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
