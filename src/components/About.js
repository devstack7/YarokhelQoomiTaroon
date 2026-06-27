import React from 'react';
import './About.css';

function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2>تعارف</h2>
        
        <div className="about-content">
          <div className="about-card">
            <div className="card-icon">🏔️</div>
            <h3>ہمارا وطن</h3>
            <p>
              یارُوخیل قوم ضلع تورغر، مانسہرہ کے خوبصورت پہاڑی علاقے میں آباد ہے۔ 
              یہ علاقہ اپنی قدرتی خوبصورتی، سرسبز وادیوں اور بلند پہاڑوں کے لیے مشہور ہے۔
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">🤝</div>
            <h3>ہمارا مقصد</h3>
            <p>
              یارُوخیل قومی تڑون کا بنیادی مقصد قوم کے افراد میں اتحاد، بھائی چارہ اور 
              باہمی تعاون کو فروغ دینا ہے۔ ہم اپنی تہذیب، روایات اور پشتون اقدار کو 
              محفوظ رکھتے ہوئے ترقی کی جانب گامزن ہیں۔
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">🎯</div>
            <h3>ہمارے اہداف</h3>
            <p>
              تعلیمی ترقی، سماجی بہبود، نوجوانوں کی رہنمائی، اور قوم کی مجموعی ترقی 
              کے لیے کام کرنا ہمارے بنیادی اہداف ہیں۔ ہم ایک مضبوط اور متحد قوم کی 
              تعمیر کے لیے ہر ممکن کوشش کر رہے ہیں۔
            </p>
          </div>
        </div>

        <div className="heritage-section">
          <h3>پشتون روایات اور ثقافت</h3>
          <div className="heritage-grid">
            <div className="heritage-item">
              <span className="heritage-icon">🕌</span>
              <h4>مذہبی اقدار</h4>
              <p>اسلامی تعلیمات کی پاسداری اور روحانی ترقی</p>
            </div>
            <div className="heritage-item">
              <span className="heritage-icon">⚖️</span>
              <h4>پختونولی</h4>
              <p>مہمان نوازی، ایمانداری اور انصاف کی روایت</p>
            </div>
            <div className="heritage-item">
              <span className="heritage-icon">🎭</span>
              <h4>ثقافتی ورثہ</h4>
              <p>لوک موسیقی، اتان اور روایتی رسومات</p>
            </div>
            <div className="heritage-item">
              <span className="heritage-icon">👥</span>
              <h4>قبائلی نظام</h4>
              <p>جرگہ، مشاورت اور اجتماعی فیصلے</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
