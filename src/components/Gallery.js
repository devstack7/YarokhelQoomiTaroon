import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import './Gallery.css';

function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(galleryItems.map(item => item.category).filter(Boolean))];
  
  const filteredItems = filterCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filterCategory);

  if (loading) {
    return (
      <section id="gallery" className="gallery">
        <div className="gallery-container">
          <div className="loading">لوڈ ہو رہا ہے...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="gallery">
      <div className="gallery-container">
        <h2>🖼️ گیلری</h2>
        <p className="gallery-intro">
          ہمارے خوبصورت علاقے، ثقافتی تقریبات اور قومی سرگرمیوں کی جھلکیاں
        </p>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="category-filters">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat === 'all' ? 'تمام' : cat}
              </button>
            ))}
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="empty-gallery">
            <p>ابھی کوئی تصویر یا ویڈیو موجود نہیں</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`gallery-item ${item.type}`}
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'image' ? (
                  <>
                    <img src={item.image_url} alt={item.title} />
                    <div className="gallery-overlay">
                      <h3>{item.title}</h3>
                      {item.category && <p className="gallery-category">{item.category}</p>}
                    </div>
                  </>
                ) : (
                  <div className="video-thumbnail">
                    {item.thumbnail_url ? (
                      // Show custom thumbnail if available
                      <img src={item.thumbnail_url} alt={item.title} className="video-thumb-image" />
                    ) : (
                      // Show iframe preview if no thumbnail
                      <iframe
                        src={item.video_url}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                    <div className="gallery-overlay">
                      <h3>{item.title}</h3>
                      {item.category && <p className="gallery-category">{item.category}</p>}
                      <span className="video-badge">🎥</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedItem && (
          <div className="lightbox" onClick={() => setSelectedItem(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedItem(null)}>✕</button>
              
              {selectedItem.type === 'image' ? (
                <img src={selectedItem.image_url} alt={selectedItem.title} />
              ) : (
                <div className="video-player">
                  <iframe
                    src={selectedItem.video_url}
                    title={selectedItem.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              <h3>{selectedItem.title}</h3>
              {selectedItem.category && <p className="category">{selectedItem.category}</p>}
              {selectedItem.description && <p className="description">{selectedItem.description}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Gallery;
