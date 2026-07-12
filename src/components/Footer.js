import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>یارُوخیل قومی تڑون</h3>
            <p>
              پاکستان کی قومی تنظیم جو قوم کے اتحاد، ترقی اور 
              فلاح و بہبود کے لیے کوشاں ہے۔
            </p>
          </div>

          <div className="footer-section">
            <h3>اہم روابط</h3>
            <ul>
              <li><a href="#home">خانہ</a></li>
              <li><a href="#about">تعارف</a></li>
              <li><a href="#leadership">قیادت</a></li>
              <li><a href="#gallery">تصاویر</a></li>
              <li><a href="#contact">رابطہ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>رابطہ</h3>
            <p>📍 پاکستان</p>
            <p dir="ltr">📞 +92-xxx-xxxxxxx</p>
            <p dir="ltr">✉️ yqt.official@gmail.com</p>
          </div>

          <div className="footer-section">
            <h3>سوشل میڈیا</h3>
            <div className="social-links">
              <a 
                href="https://www.facebook.com/YarokhelOfficialYE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon facebook"
                title="Facebook"
              >
                📘 Facebook
              </a>
              <a 
                href="https://www.youtube.com/@YarokhelOfficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon youtube"
                title="YouTube"
              >
                📺 YouTube
              </a>
            </div>
            <p className="social-note">ہمارے ساتھ جڑیں</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} یارُوخیل قومی تڑون - تمام حقوق محفوظ ہیں</p>
          <p className="footer-tagline">
            پشتون روایات کی پاسداری، ترقی کی جانب سفر
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
