import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './PersonManagement.css';

function PersonManagement() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Function to format phone number with country code
  const formatPhoneNumber = (value) => {
    // Remove any non-digit characters
    let digits = value.replace(/\D/g, '');
    
    // Detect country and format accordingly
    
    // Saudi Arabia: starts with 966 or 05
    if (digits.startsWith('966')) {
      digits = digits.substring(0, 12); // 966 + 9 digits
      return '+' + digits;
    }
    
    // UAE: starts with 971 or 05
    if (digits.startsWith('971')) {
      digits = digits.substring(0, 12); // 971 + 9 digits (or 8 for landline)
      return '+' + digits;
    }
    
    // Pakistan: starts with 92 or 0
    if (digits.startsWith('92')) {
      digits = digits.substring(0, 12); // 92 + 10 digits
      return '+' + digits;
    }
    
    if (digits.startsWith('0')) {
      // Could be Pakistan (03XX), Saudi (05XX), or UAE (05XX)
      // Default to Pakistan for 03XX
      if (digits.startsWith('03')) {
        digits = '92' + digits.substring(1, 11);
        return '+' + digits;
      }
      // For 05XX, user needs to specify country manually or we default to Pakistan
      digits = '92' + digits.substring(1, 11);
      return '+' + digits;
    }
    
    // Default: assume Pakistan
    digits = '92' + digits.substring(0, 10);
    return '+' + digits;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow user to type freely
    setFormData({...formData, phone: value});
  };

  const handlePhoneBlur = (e) => {
    // Format on blur (when user leaves the field)
    const value = e.target.value;
    if (value) {
      const formatted = formatPhoneNumber(value);
      setFormData({...formData, phone: formatted});
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchPersons();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/funds/login');
      return;
    }

    const { data: userData } = await supabase
      .from('fund_users')
      .select('role')
      .eq('email', user.email)
      .single();

    if (!userData || userData.role !== 'manager') {
      alert('صرف Manager access ہے');
      navigate('/funds/dashboard');
    }
  };

  const fetchPersons = async () => {
    try {
      const { data, error } = await supabase
        .from('fund_persons')
        .select('*')
        .order('name');

      if (error) throw error;
      setPersons(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      if (editingPerson) {
        result = await supabase
          .from('fund_persons')
          .update(formData)
          .eq('id', editingPerson.id)
          .select();
      } else {
        result = await supabase
          .from('fund_persons')
          .insert([formData])
          .select();
      }

      if (result.error) throw result.error;

      alert('✅ محفوظ ہو گیا!');
      setShowModal(false);
      setFormData({ name: '', phone: '', address: '', notes: '' });
      setEditingPerson(null);
      fetchPersons();
    } catch (error) {
      alert('❌ خرابی: ' + error.message);
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      phone: person.phone || '',
      address: person.address || '',
      notes: person.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('کیا آپ واقعی حذف کرنا چاہتے ہیں؟')) return;

    try {
      const { error } = await supabase
        .from('fund_persons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPersons();
    } catch (error) {
      alert('❌ حذف نہیں ہو سکا: ' + error.message);
    }
  };

  const openAddModal = () => {
    setEditingPerson(null);
    setFormData({ name: '', phone: '', address: '', notes: '' });
    setShowModal(true);
  };

  const filteredPersons = persons.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  if (loading) return <div className="loading">لوڈ ہو رہا ہے...</div>;

  return (
    <div className="person-management">
      <div className="page-header">
        <div className="header-left">
          <h1>👥 افراد کی فہرست</h1>
          <p>{persons.length} افراد</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate('/funds/dashboard')} className="btn-back">
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 نام یا فون سے تلاش کریں..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={openAddModal} className="btn-add-mobile">
          ➕ نیا شخص
        </button>
      </div>

      <div className="persons-grid">
        {filteredPersons.length === 0 ? (
          <div className="empty-state">
            <p>کوئی شخص نہیں ملا</p>
            <button onClick={openAddModal} className="btn-add">پہلا شخص شامل کریں</button>
          </div>
        ) : (
          filteredPersons.map((person) => (
            <div key={person.id} className="person-card">
              <div className="person-info">
                <h3>{person.name}</h3>
                {person.phone && <p className="phone">📱 {person.phone}</p>}
                {person.address && <p className="address">📍 {person.address}</p>}
                {person.notes && <p className="notes">📝 {person.notes}</p>}
              </div>
              <div className="person-actions">
                <button onClick={() => handleEdit(person)} className="btn-edit">✏️</button>
                <button onClick={() => handleDelete(person.id)} className="btn-delete">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPerson ? 'ترمیم کریں' : 'نیا شخص شامل کریں'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="person-form">
              <div className="form-group">
                <label>نام *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="مثال: محمد احمد"
                />
              </div>

              <div className="form-group">
                <label>فون نمبر * (Pakistan / Saudi / UAE)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  required
                  placeholder="+923001234567 یا +966501234567 یا +971501234567"
                  pattern="^(\+92[0-9]{10}|\+966[0-9]{9}|\+971[0-9]{8,9})$"
                  title="Pakistan: +923001234567, Saudi: +966501234567, UAE: +971501234567"
                />
                <small className="field-hint">
                  پاکستان: +92 | سعودی: +966 | متحدہ عرب امارات: +971 (خودکار شامل ہو جائے گا)
                </small>
              </div>

              <div className="form-group">
                <label>پتہ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="لاہور، پاکستان"
                />
              </div>

              <div className="form-group">
                <label>نوٹس</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="2"
                  placeholder="اضافی معلومات..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  منسوخ
                </button>
                <button type="submit" className="btn-save">
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonManagement;
