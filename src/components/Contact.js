import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log('Submitting contact form:', formData);

      // Insert into database
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message,
            status: 'unread'
          }
        ])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Contact form submitted successfully:', data);
      
      // Show success message
      setSubmitStatus('success');
      alert('✅ شکریہ! آپ کا پیغام موصول ہو گیا ہے۔ ہم جلد آپ سے رابطہ کریں گے۔');
      
      // Clear form
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      alert('❌ خرابی: پیغام بھیجنے میں مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں۔');
    } finally {
      setSubmitting(false);
    }
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
              <p>پاکستان</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>فون</h3>
              <p dir="ltr">+92-xxx-xxxxxxx</p>
              <p>ہفتے کے تمام دن دستیاب</p>
            </div>

            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>ای میل</h3>
              <p dir="ltr">yqt.official@gmail.com</p>
              <p>24 گھنٹے کے اندر جواب</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {submitStatus === 'success' && (
              <div className="alert alert-success">
                ✅ آپ کا پیغام کامیابی سے بھیج دیا گیا ہے!
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="alert alert-error">
                ❌ پیغام بھیجنے میں مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں۔
              </div>
            )}
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>نام *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="اپنا نام درج کریں"
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>ای میل *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  dir="ltr"
                  disabled={submitting}
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
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>پیغام *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="اپنا پیغام یہاں لکھیں"
                  disabled={submitting}
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'بھیج رہے ہیں...' : 'پیغام بھیجیں'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
