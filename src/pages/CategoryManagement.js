import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './CategoryManagement.css';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    name_urdu: '',
    icon: '📁',
    color: '#4caf50',
    description: '',
    display_order: 0
  });
  const navigate = useNavigate();

  // Common icons for selection
  const commonIcons = ['📚', '🎉', '🏥', '📖', '⚽', '🏠', '🚗', '💰', '🍔', '✈️', '📱', '💼'];
  const commonColors = ['#4caf50', '#9c27b0', '#f44336', '#2196f3', '#ff9800', '#795548', '#607d8b', '#ffd700'];

  useEffect(() => {
    checkAuth();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('fund_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate English name from Urdu name (simple slugify)
      const englishName = editingCategory ? editingCategory.name : 
        formData.name_urdu.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '')
          .substring(0, 50) || `category_${Date.now()}`;

      const categoryData = {
        name: englishName,
        name_urdu: formData.name_urdu,
        icon: formData.icon,
        color: formData.color,
        description: formData.description,
        display_order: parseInt(formData.display_order)
      };

      let result;
      if (editingCategory) {
        result = await supabase
          .from('fund_categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
          .select();
      } else {
        result = await supabase
          .from('fund_categories')
          .insert([categoryData])
          .select();
      }

      if (result.error) throw result.error;

      alert('✅ محفوظ ہو گیا!');
      setShowModal(false);
      setFormData({
        name: '',
        name_urdu: '',
        icon: '📁',
        color: '#4caf50',
        description: '',
        display_order: 0
      });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      alert('❌ خرابی: ' + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_urdu: category.name_urdu,
      icon: category.icon || '📁',
      color: category.color || '#4caf50',
      description: category.description || '',
      display_order: category.display_order || 0
    });
    setShowModal(true);
  };

  const handleToggleActive = async (category) => {
    try {
      const { error } = await supabase
        .from('fund_categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);

      if (error) throw error;
      fetchCategories();
    } catch (error) {
      alert('❌ تبدیلی نہیں ہو سکی');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('کیا آپ واقعی حذف کرنا چاہتے ہیں؟\nنوٹ: اگر اس category میں transactions ہیں تو حذف نہیں ہوگی۔')) return;

    try {
      const { error } = await supabase
        .from('fund_categories')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === '23503') {
          alert('❌ اس category کو حذف نہیں کیا جا سکتا کیونکہ اس میں transactions موجود ہیں۔\nپہلے اسے inactive کریں۔');
        } else {
          throw error;
        }
        return;
      }
      fetchCategories();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('❌ حذف نہیں ہو سکا');
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    const maxOrder = Math.max(...categories.map(c => c.display_order || 0), 0);
    setFormData({
      name: '',
      name_urdu: '',
      icon: '📁',
      color: '#4caf50',
      description: '',
      display_order: maxOrder + 1
    });
    setShowModal(true);
  };

  if (loading) return <div className="loading">لوڈ ہو رہا ہے...</div>;

  return (
    <div className="category-management">
      <div className="page-header">
        <div className="header-left">
          <h1>📂 فنڈ کی اقسام</h1>
          <p>{categories.length} اقسام</p>
        </div>
        <div className="header-right">
          <button onClick={() => navigate('/funds/dashboard')} className="btn-back">
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="action-section">
        <button onClick={openAddModal} className="btn-add-category">
          ➕ نئی قسم شامل کریں
        </button>
      </div>

      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>کوئی category نہیں ملی</p>
            <button onClick={openAddModal} className="btn-add">پہلی category شامل کریں</button>
          </div>
        ) : (
          categories.map((category) => (
            <div 
              key={category.id} 
              className={`category-card ${!category.is_active ? 'inactive' : ''}`}
              style={{borderLeftColor: category.color}}
            >
              <div className="category-header">
                <span className="category-icon" style={{backgroundColor: category.color + '20'}}>
                  {category.icon}
                </span>
                <div className="category-info">
                  <h3>{category.name_urdu}</h3>
                  <small className="category-name-en">{category.name}</small>
                  {category.description && <p className="category-desc">{category.description}</p>}
                </div>
              </div>

              <div className="category-meta">
                <span className="order-badge">ترتیب: {category.display_order}</span>
                <span className={`status-badge ${category.is_active ? 'active' : 'inactive'}`}>
                  {category.is_active ? '✓ فعال' : '⊗ غیر فعال'}
                </span>
              </div>

              <div className="category-actions">
                <button onClick={() => handleEdit(category)} className="btn-edit" title="ترمیم">
                  ✏️
                </button>
                <button 
                  onClick={() => handleToggleActive(category)} 
                  className="btn-toggle"
                  title={category.is_active ? 'غیر فعال کریں' : 'فعال کریں'}
                >
                  {category.is_active ? '⊗' : '✓'}
                </button>
                <button onClick={() => handleDelete(category.id)} className="btn-delete" title="حذف">
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'ترمیم کریں' : 'نئی قسم شامل کریں'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>نام (اردو) *</label>
                <input
                  type="text"
                  value={formData.name_urdu}
                  onChange={(e) => setFormData({...formData, name_urdu: e.target.value})}
                  required
                  placeholder="مثال: طبی امداد"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>آئیکن *</label>
                  <div className="icon-selector">
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      required
                      maxLength="10"
                      className="icon-input"
                    />
                    <div className="common-icons">
                      {commonIcons.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData({...formData, icon})}
                          className={`icon-btn ${formData.icon === icon ? 'selected' : ''}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>رنگ *</label>
                  <div className="color-selector">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      required
                      className="color-input"
                    />
                    <div className="common-colors">
                      {commonColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({...formData, color})}
                          className={`color-btn ${formData.color === color ? 'selected' : ''}`}
                          style={{backgroundColor: color}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>ترتیب نمبر *</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                  required
                  min="0"
                  placeholder="1, 2, 3..."
                />
                <small>چھوٹا نمبر پہلے دکھائی دے گا</small>
              </div>

              <div className="form-group">
                <label>تفصیل (اختیاری)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="2"
                  placeholder="اس category کی تفصیل..."
                ></textarea>
              </div>

              <div className="preview-section">
                <label>پیش نظارہ:</label>
                <div className="category-preview" style={{borderLeftColor: formData.color}}>
                  <span className="preview-icon" style={{backgroundColor: formData.color + '20'}}>
                    {formData.icon}
                  </span>
                  <span className="preview-name">{formData.name_urdu || 'نام'}</span>
                </div>
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

export default CategoryManagement;
