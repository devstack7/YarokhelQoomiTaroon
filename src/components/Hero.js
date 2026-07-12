import React, { useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90', // Mountain landscape
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90', // Mountain peaks
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=90', // Mountain peaks
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=90', // Valley
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=90', // Mountain range
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90'  // Green hills
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="home" className="hero">
      <div className="hero-slider">
        {images.map((img, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>
      
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div className="hero-badge">🏔️ پشتون قوم</div>
        <h1 className="hero-title">یارُوخیل قومی تڑون</h1>
        <div className="title-underline"></div>
        <p className="hero-subtitle">خوش آمدید</p>
        <p className="hero-description">
          ایک مضبوط اور متحد قوم کی تعمیر کے لیے
        </p>
        <div className="hero-location">
          <p>📍 پاکستان</p>
        </div>
        <div className="hero-buttons">
          <a href="/heritage" className="btn btn-heritage">یارُوخیل کے بارے میں مزید پڑھیں</a>
          <a href="#about" className="btn btn-primary">مزید جانیے</a>
          <a href="#contact" className="btn btn-secondary">رابطہ کریں</a>
        </div>
      </div>

      <div className="hero-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentImage ? 'active' : ''}`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
