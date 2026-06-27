import React, { useState } from 'react';
import './Gallery.css';

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      title: 'خوبصورت پہاڑی مناظر',
      category: 'قدرتی'
    },
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      title: 'برفانی چوٹیاں',
      category: 'قدرتی'
    },
    {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      title: 'قبائلی اجتماع',
      category: 'تقریبات'
    },
    {
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
      title: 'روایتی جرگہ',
      category: 'ثقافتی'
    },
    {
      url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
      title: 'سرسبز وادیاں',
      category: 'قدرتی'
    },
    {
      url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
      title: 'پہاڑی علاقے',
      category: 'قدرتی'
    }
  ];

  return (
    <section id="gallery" className="gallery">
      <div className="gallery-container">
        <h2>تصاویر</h2>
        <p className="gallery-intro">
          ہمارے خوبصورت علاقے، ثقافتی تقریبات اور قومی سرگرمیوں کی جھلکیاں
        </p>

        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="gallery-item"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.url} alt={image.title} />
              <div className="gallery-overlay">
                <h3>{image.title}</h3>
                <p className="gallery-category">{image.category}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>✕</button>
              <img src={selectedImage.url} alt={selectedImage.title} />
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.category}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Gallery;
