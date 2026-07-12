import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './ShuraManagement.css';

function ShuraManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    detail: '',
    image_url: '',
    display_order: 999
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchMembers();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/yqt-admin/login');
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('shura_members')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;

    try {
      console.log('Starting image upload...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User authenticated:', user ? 'Yes' : 'No');

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `shura/${fileName}`;

      console.log('Uploading to path:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: imageFile.type
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        if (formData.image_url) return formData.image_url;
        return 'https://via.placeholder.com/400x500/2c5f2d/ffffff?text=تصویر+نہیں';
      }

      console.log('✅ Upload successful:', uploadData);

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', urlData.publicUrl);
      return urlData.publicUrl;

    } catch (error) {
      console.error('❌ Image upload exception:', error);
      if (formData.image_url) return formData.image_url;
      return 'https://via.placeholder.com/400x500/2c5f2d/ffffff?text=تصویر+نہیں';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log('=== SUBMIT STARTED ===');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        alert('❌ آپ لاگ ان نہیں ہیں۔ دوبارہ لاگ ان کریں۔');
        navigate('/yqt-admin/login');
        return;
      }

      let imageUrl = formData.image_url || 'https://via.placeholder.com/400x500/2c5f2d/ffffff?text=No+Image';
      
      if (imageFile) {
        console.log('Uploading image...');
        imageUrl = await uploadImage();
        console.log('Image uploaded successfully:', imageUrl);
      }

      const memberData = {
        name: formData.name,
        address: formData.address,
        detail: formData.detail,
        image_url: imageUrl,
        display_order: formData.display_order || 999
      };

      console.log('Saving to database:', memberData);

      let result;
      if (editingMember) {
        result = await supabase
          .from('shura_members')
          .update(memberData)
          .eq('id', editingMember.id)
          .select();
      } else {
        result = await supabase
          .from('shura_members')
          .insert([memberData])
          .select();
      }

      if (result.error) {
        console.error('❌ DATABASE ERROR:', result.error);
        throw result.error;
      }

      console.log('✅ SUCCESS!');
      alert('✅ کامیابی سے محفوظ ہو گیا!');
      setShowModal(false);
      setFormData({ name: '', address: '', detail: '', image_url: '', display_order: 999 });
      setImageFile(null);
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error('=== ERROR CAUGHT ===', error);
      alert(`❌ خرابی: ${error.message || 'ڈیٹا محفوظ نہیں ہو سکا'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      address: member.address,
      detail: member.detail,
      image_url: member.image_url,
      display_order: member.display_order || 999
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('کیا آپ واقعی حذف کرنا چاہتے ہیں؟')) {
      try {
        const { error } = await supabase
          .from('shura_members')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({ name: '', address: '', detail: '', image_url: '', display_order: 999 });
    setImageFile(null);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">لوڈ ہو رہا ہے...</div>;
  }

  return (
    <div className="shura-management">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🕌 مجلس شوریٰ</h1>
          <p>شوریٰ اراکین کا انتظام</p>
        </div>
        <div className="header-right">
          <a href="/yqt-admin/dashboard" className="btn-back">← Dashboard</a>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-header">
          <h2>شوریٰ اراکین کی فہرست ({members.length})</h2>
          <button onClick={openAddModal} className="btn-add">
            ➕ نیا رکن شامل کریں
          </button>
        </div>

        <div className="members-table">
          {members.length === 0 ? (
            <div className="empty-state">
              <p>ابھی کوئی رکن شامل نہیں</p>
              <button onClick={openAddModal} className="btn-add">
                پہلا رکن شامل کریں
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ترتیب</th>
                  <th>تصویر</th>
                  <th>نام</th>
                  <th>پتہ</th>
                  <th>تفصیل</th>
                  <th>ایکشن</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.display_order}</td>
                    <td>
                      <img src={member.image_url} alt={member.name} className="member-thumb" />
                    </td>
                    <td>{member.name}</td>
                    <td>{member.address}</td>
                    <td className="detail-cell">{member.detail}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleEdit(member)} className="btn-edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="btn-delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMember ? 'ترمیم کریں' : 'نیا رکن شامل کریں'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>نام *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="مثال: محمد اکرم یوسف زئی"
                />
              </div>

              <div className="form-group">
                <label>پتہ *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  placeholder="مثال: ضلع تور غر، مانسہرہ"
                />
              </div>

              <div className="form-group">
                <label>تفصیل *</label>
                <textarea
                  value={formData.detail}
                  onChange={(e) => setFormData({...formData, detail: e.target.value})}
                  required
                  rows="3"
                  placeholder="تفصیل لکھیں..."
                ></textarea>
              </div>

              <div className="form-group">
                <label>ترتیب نمبر</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 999})}
                  placeholder="1, 2, 3, 4..."
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>تصویر URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="url-input"
                />
                <span className="or-text">یا</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {(imageFile || formData.image_url) && (
                  <div className="image-preview">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                      alt="Preview" 
                    />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn-cancel"
                >
                  منسوخ کریں
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={uploading}
                >
                  {uploading ? 'محفوظ ہو رہا ہے...' : 'محفوظ کریں'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShuraManagement;
