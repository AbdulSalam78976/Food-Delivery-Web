import React from "react";
import "./sidemenu.css";

function SideMenu({ menuOpen, toggleMenu }) {
  return (
    <div className={`side-menu ${menuOpen ? "active" : ""}`}>
      <div className="side-menu-header">
        <h3 >Menu</h3>
      </div>
      <ul className="side-menu-list">
        <li><a href="#hero" onClick={toggleMenu}>Home</a></li>
        <li><a href="#explore-menu" onClick={toggleMenu}>Menu</a></li>
        <li><a href="#about" onClick={toggleMenu}>About</a></li>
        <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
      </ul>
    </div>
  );
}

export default SideMenu;
