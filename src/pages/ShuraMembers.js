import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Link } from 'react-router-dom';
import './ShuraMembers.css';

function ShuraMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('shura_members')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching shura members:', error);
        setError('ڈیٹا لوڈ نہیں ہو سکا');
      } else {
        setMembers(data || []);
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
      <div className="shura-page">
        <div className="shura-header">
          <Link to="/" className="back-button">← واپس</Link>
          <h1>مجلس شوریٰ</h1>
        </div>
        <div className="shura-container">
          <div className="loading-message">
            <p>⏳ لوڈ ہو رہا ہے...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shura-page">
        <div className="shura-header">
          <Link to="/" className="back-button">← واپس</Link>
          <h1>مجلس شوریٰ</h1>
        </div>
        <div className="shura-container">
          <div className="error-message">
            <p>⚠️ {error}</p>
            <p>براہ کرم Admin Panel سے اراکین شامل کریں</p>
          </div>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="shura-page">
        <div className="shura-header">
          <Link to="/" className="back-button">← واپس</Link>
          <h1>مجلس شوریٰ</h1>
        </div>
        <div className="shura-container">
          <div className="empty-message">
            <p>📋 ابھی کوئی رکن شامل نہیں کیا گیا</p>
            <p>Admin Panel سے شوریٰ اراکین شامل کریں</p>
            <a href="/admin/login" className="admin-link">Admin Panel →</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shura-page">
      <div className="shura-header">
        <Link to="/" className="back-button">← واپس</Link>
        <h1>🕌 مجلس شوریٰ</h1>
        <p className="shura-subtitle">شوریٰ اراکین</p>
      </div>

      <div className="shura-container">
        <div className="shura-intro">
          <h2>تنظیم کی شوریٰ</h2>
          <p>
            تنظیم کی پالیسی سازی اور اہم فیصلوں میں شوریٰ کے تمام اراکین کی شرکت 
            اور مشاورت لازمی ہے۔ ہماری شوریٰ میں قوم کے معزز اور تجربہ کار افراد 
            شامل ہیں جو اپنے علم اور تجربے سے فائدہ پہنچاتے ہیں۔
          </p>
          <div className="members-count">
            <span className="count-number">{members.length}</span>
            <span className="count-label">شوریٰ اراکین</span>
          </div>
        </div>

        <div className="members-grid">
          {members.map((member, index) => (
            <div key={member.id} className="member-card">
              <div className="member-image-wrapper">
                <img src={member.image_url} alt={member.name} className="member-image" />
                <div className="member-badge">
                  <span>{index === 0 ? 'صدر مجلس شوریٰ' : 'رکن شوریٰ'}</span>
                </div>
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="member-address">📍 {member.address}</p>
                <p className="member-detail">{member.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="shura-footer">
          <p>
            ان تمام اراکین کی رہنمائی اور مشاورت سے یارُوخیل قومی تڑون ترقی کی 
            راہ پر گامزن ہے۔
          </p>
          <Link to="/" className="home-button">
            🏠 واپس ہوم پیج پر
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShuraMembers;
