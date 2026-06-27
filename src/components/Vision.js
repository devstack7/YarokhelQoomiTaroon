import React from 'react';
import './Vision.css';

function Vision() {
  return (
    <section className="vision">
      <div className="vision-container">
        <div className="vision-content">
          <div className="vision-text">
            <h2 className="vision-title">ہمارا وژن</h2>
            <div className="vision-line"></div>
            <p className="vision-description">
              یارُوخیل قوم کو ایک مضبوط، متحد اور خوشحال قوم بنانا جو اپنی روایات، 
              اقدار اور ثقافت کو محفوظ رکھتے ہوئے جدید دور کی ترقی میں پیش پیش ہو۔
            </p>
            <div className="vision-points">
              <div className="vision-point">
                <span className="point-icon">✓</span>
                <span className="point-text">تعلیمی فروغ اور نوجوانوں کی رہنمائی</span>
              </div>
              <div className="vision-point">
                <span className="point-icon">✓</span>
                <span className="point-text">معاشرتی اور معاشی ترقی</span>
              </div>
              <div className="vision-point">
                <span className="point-icon">✓</span>
                <span className="point-text">پشتون ثقافت اور روایات کا تحفظ</span>
              </div>
              <div className="vision-point">
                <span className="point-icon">✓</span>
                <span className="point-text">قبائلی اتحاد اور بھائی چارہ</span>
              </div>
            </div>
          </div>
          <div className="vision-image">
            <div className="image-wrapper">
              <img src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80" alt="Vision" />
              <div className="image-overlay">
                <div className="overlay-text">
                  <h3>ایک روشن مستقبل</h3>
                  <p>اتحاد، ترقی، خوشحالی</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Vision;
