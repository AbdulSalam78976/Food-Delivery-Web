import React from 'react';
import './footer.css';
import { assets } from "../../assets/frontend_assets/assets";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Brand Section with Logo */}
        <div className="footer-brand">
          <img src={assets.logo} alt="App Logo" className="footer-logo" />
          <h4 className="footer-punchline">Where flavor meets fire 🔥</h4>
          <p>
            Delicious meals delivered right to your doorstep. Fresh ingredients,
            authentic taste, and a menu crafted with love.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#explore-menu">Menu</a></li>
            <li><a href="#food-display">Food</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} All Rights Reserved.</p>
        <p>Powered by <strong>AppCrafters</strong>.</p>
      </div>
    </footer>
  );
}

export default Footer;
