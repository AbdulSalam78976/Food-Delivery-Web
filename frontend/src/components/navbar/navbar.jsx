import React, { useContext } from "react";
import "./navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../context/storecontext";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const { getTotalCartItems } = useContext(StoreContext);
  const { user, isAuthenticated, signOut } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setCartOpen(false); // close cart if menu opens
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
    setMenuOpen(false); // close menu if cart opens
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        {isAuthenticated ? (
          <>
            <li className="navbar-item" onClick={toggleMenu}>
              <span>Welcome, {user?.user_metadata?.full_name || user?.email}</span>
            </li>
            <li className="navbar-item" onClick={handleLogout}>
              <span>Logout</span>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item" onClick={toggleMenu}>
              <Link to="/login">Login</Link>
            </li>
            <li className="navbar-item" onClick={toggleMenu}>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>

     
      {/* Desktop Right Section */}
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="navbar-welcome">
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </span>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-auth-link">Login</Link>
            <Link to="/signup" className="navbar-auth-link">Sign Up</Link>
          </>
        )}
        <Link to="/cart" className="navbar-basket-icon" onClick={toggleCart}>
          <img src={assets.bag_icon} alt="Cart" />  
          {getTotalCartItems() > 0 && <div className="dot">{getTotalCartItems()}</div>}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
