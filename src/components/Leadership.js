import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import './Leadership.css';

function Leadership() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from('leaders')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching leaders:', error);
        setError('ڈیٹا لوڈ نہیں ہو سکا');
      } else {
        setLeaders(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('کنکشن میں خرابی');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="leadership" className="leadership">
        <div className="leadership-container">
          <h2>قیادت</h2>
          <div className="loading-message">
            <p>⏳ لوڈ ہو رہا ہے...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="leadership" className="leadership">
        <div className="leadership-container">
          <h2>قیادت</h2>
          <div className="error-message">
            <p>⚠️ {error}</p>
            <p>براہ کرم Admin Panel سے قائدین شامل کریں</p>
          </div>
        </div>
      </section>
    );
  }

  if (leaders.length === 0) {
    return (
      <section id="leadership" className="leadership">
        <div className="leadership-container">
          <h2>قیادت</h2>
          <div className="empty-message">
            <p>📋 ابھی کوئی قائد شامل نہیں کیا گیا</p>
            <p>Admin Panel سے قائدین شامل کریں</p>
            <a href="/admin/login" className="admin-link">Admin Panel →</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="leadership" className="leadership">
      <div className="leadership-container">
        <h2>قیادت</h2>
        <p className="leadership-intro">
          یارُوخیل قومی تڑون کی قیادت تجربہ کار اور لائق افراد کے ہاتھوں میں ہے جو 
          قوم کی ترقی اور بہبود کے لیے دن رات محنت کر رہے ہیں۔
        </p>

        <div className="leaders-grid">
          {leaders.map((leader) => (
            <div key={leader.id} className="leader-card">
              <div className="leader-image-wrapper">
                <img src={leader.image_url} alt={leader.name} className="leader-image" />
                <div className="leader-overlay">
                  <p className="leader-quote">خدمت ہی ہمارا مقصد</p>
                </div>
              </div>
              <div className="leader-info">
                <h3>{leader.name}</h3>
                <p className="leader-position">{leader.position}</p>
                <p className="leader-description">{leader.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="council-info">
          <h3>شوریٰ اراکین</h3>
          <p>
            تنظیم کی پالیسی سازی اور اہم فیصلوں میں شوریٰ کے تمام اراکین کی شرکت 
            اور مشاورت لازمی ہے۔ ہماری شوریٰ میں قوم کے معزز اور تجربہ کار افراد 
            شامل ہیں جو اپنے علم اور تجربے سے فائدہ پہنچاتے ہیں۔
          </p>
          <a href="/shura-members" className="shura-btn">
            <span>🕌 مجلس شوریٰ کے تمام اراکین دیکھیں</span>
            <span className="arrow">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Leadership;
