import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('شکریہ! آپ کا پیغام موصول ہو گیا ہے۔ ہم جلد آپ سے رابطہ کریں گے۔');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2>رابطہ کریں</h2>
        <p className="contact-intro">
          ہم سے رابطہ کرنے کے لیے نیچے دیا گیا فارم استعمال کریں یا براہ راست کال کریں
        </p>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>پتہ</h3>
              <p>ضلع تورغر، مانسہرہ</p>
              <p>خیبر پختونخوا، پاکستان</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>فون</h3>
              <p dir="ltr">+92-XXX-XXXXXXX</p>
              <p>ہفتے کے تمام دن دستیاب</p>
            </div>

            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>ای میل</h3>
              <p dir="ltr">info@yarukhelqoomi.org</p>
              <p>24 گھنٹے کے اندر جواب</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>نام</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="اپنا نام درج کریں"
                />
              </div>

              <div className="form-group">
                <label>ای میل</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  dir="ltr"
                />
              </div>

              <div className="form-group">
                <label>فون نمبر</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92-XXX-XXXXXXX"
                  dir="ltr"
                />
              </div>

              <div className="form-group">
                <label>پیغام</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="اپنا پیغام یہاں لکھیں"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                پیغام بھیجیں
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
