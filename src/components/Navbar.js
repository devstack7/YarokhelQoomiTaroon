import React, { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <h1>یارُوخیل قومی تڑون</h1>
          <p className="nav-subtitle">پاکستان</p>
        </div>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰
        </button>

        <ul className={`nav-menu ${mobileMenu ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => setMobileMenu(false)}>خانہ</a></li>
          <li><a href="#about" onClick={() => setMobileMenu(false)}>تعارف</a></li>
          <li><a href="#leadership" onClick={() => setMobileMenu(false)}>قیادت</a></li>
          <li><a href="#gallery" onClick={() => setMobileMenu(false)}>تصاویر</a></li>
          <li><a href="#contact" onClick={() => setMobileMenu(false)}>رابطہ</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
