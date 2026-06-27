import React from 'react';
import './Leadership.css';

function Leadership() {
  const leaders = [
    {
      name: 'صاحب خان عاجز',
      position: 'صدر',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      description: 'یارُوخیل قومی تارون کے بانی صدر، جن کی قیادت میں تنظیم نے ترقی کی منازل طے کیں'
    },
    {
      name: 'نائب صدر',
      position: 'نائب صدر',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      description: 'تنظیمی امور میں صدر کے معاون اور قوم کی خدمت میں پیش پیش'
    },
    {
      name: 'سیکریٹری خزانہ',
      position: 'سیکریٹری خزانہ',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
      description: 'مالی معاملات کی نگرانی اور تنظیم کے مالیاتی نظام کے ذمہ دار'
    },
    {
      name: 'سیکریٹری اطلاعات',
      position: 'سیکریٹری اطلاعات',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      description: 'تنظیمی سرگرمیوں کی تشہیر اور رابطہ عامہ کے فرائض'
    }
  ];

  return (
    <section id="leadership" className="leadership">
      <div className="leadership-container">
        <h2>قیادت</h2>
        <p className="leadership-intro">
          یارُوخیل قومی تڑون کی قیادت تجربہ کار اور لائق افراد کے ہاتھوں میں ہے جو 
          قوم کی ترقی اور بہبود کے لیے دن رات محنت کر رہے ہیں۔
        </p>

        <div className="leaders-grid">
          {leaders.map((leader, index) => (
            <div key={index} className="leader-card">
              <div className="leader-image-wrapper">
                <img src={leader.image} alt={leader.name} className="leader-image" />
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
        </div>
      </div>
    </section>
  );
}

export default Leadership;
