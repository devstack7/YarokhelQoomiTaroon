import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    description: '',
    image_url: '',
    display_order: 999
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchLeaders();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/yqt-admin/login');
    }
  };

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from('leaders')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaders(data || []);
    } catch (error) {
      console.error('Error fetching leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/yqt-admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
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
      console.log('File details:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      });

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User authenticated:', user ? 'Yes' : 'No');

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `leaders/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Upload to storage with public access
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: imageFile.type
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        console.error('Error details:', JSON.stringify(uploadError, null, 2));
        
        // اگر upload fail ہو تو fallback URL استعمال کریں
        if (formData.image_url) {
          console.log('Using fallback URL from form');
          return formData.image_url;
        }
        
        console.log('Using placeholder image');
        return 'https://via.placeholder.com/400x500/2c5f2d/ffffff?text=تصویر+نہیں';
      }

      console.log('✅ Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', urlData.publicUrl);
      return urlData.publicUrl;

    } catch (error) {
      console.error('❌ Image upload exception:', error);
      
      // Fallback to URL or placeholder
      if (formData.image_url) {
        console.log('Exception: Using URL from form');
        return formData.image_url;
      }
      
      console.log('Exception: Using placeholder');
      return 'https://via.placeholder.com/400x500/2c5f2d/ffffff?text=تصویر+نہیں';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log('=== SUBMIT STARTED ===');
      console.log('Form data:', formData);
      console.log('Image file:', imageFile ? imageFile.name : 'No file');

      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('آپ لاگ ان نہیں ہیں');
      }

      if (!user) {
        alert('❌ آپ لاگ ان نہیں ہیں۔ دوبارہ لاگ ان کریں۔');
        navigate('/yqt-admin/login');
        return;
      }

      // پہلے image upload کریں (اگر ہو)
      let imageUrl = formData.image_url || 'https://via.placeholder.com/400x500/2c5f2d/ffffff?text=No+Image';
      
      if (imageFile) {
        console.log('Uploading image...');
        try {
          imageUrl = await uploadImage();
          console.log('Image uploaded successfully:', imageUrl);
        } catch (imgError) {
          console.error('Image upload failed, using placeholder:', imgError);
          // Image upload fail ہو تو placeholder استعمال کریں
        }
      }

      // پھر database میں save کریں
      const leaderData = {
        name: formData.name,
        position: formData.position,
        description: formData.description,
        image_url: imageUrl,
        display_order: formData.display_order || 999
      };

      console.log('Saving to database:', leaderData);

      let result;
      if (editingLeader) {
        console.log('Updating leader ID:', editingLeader.id);
        result = await supabase
          .from('leaders')
          .update(leaderData)
          .eq('id', editingLeader.id)
          .select();
      } else {
        console.log('Inserting new leader...');
        result = await supabase
          .from('leaders')
          .insert([leaderData])
          .select();
      }

      console.log('Database result:', result);

      if (result.error) {
        console.error('❌ DATABASE ERROR:', result.error);
        console.error('Error details:', JSON.stringify(result.error, null, 2));
        throw result.error;
      }

      console.log('✅ SUCCESS!');
      alert('✅ کامیابی سے محفوظ ہو گیا!');
      setShowModal(false);
      setFormData({ name: '', position: '', description: '', image_url: '', display_order: 999 });
      setImageFile(null);
      setEditingLeader(null);
      fetchLeaders();
    } catch (error) {
      console.error('=== ERROR CAUGHT ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      // مزید تفصیلی error message
      let errorMsg = 'ڈیٹا محفوظ نہیں ہو سکا';
      
      if (error.message) {
        errorMsg += '\n\n' + error.message;
      }
      
      if (error.code) {
        errorMsg += '\n\nError Code: ' + error.code;
      }
      
      if (error.hint) {
        errorMsg += '\n\nHint: ' + error.hint;
      }

      alert(`❌ خرابی:\n${errorMsg}\n\nبراہ کرم F12 دبا کر Console دیکھیں`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (leader) => {
    setEditingLeader(leader);
    setFormData({
      name: leader.name,
      position: leader.position,
      description: leader.description,
      image_url: leader.image_url,
      display_order: leader.display_order || 999
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('کیا آپ واقعی حذف کرنا چاہتے ہیں؟')) {
      try {
        const { error } = await supabase
          .from('leaders')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchLeaders();
      } catch (error) {
        console.error('Error deleting leader:', error);
      }
    }
  };

  const openAddModal = () => {
    setEditingLeader(null);
    setFormData({ name: '', position: '', description: '', image_url: '', display_order: 999 });
    setImageFile(null);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">لوڈ ہو رہا ہے...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🎯 Admin Dashboard</h1>
          <p>یارُوخیل قومی تڑون</p>
        </div>
        <div className="header-right">
          <a href="/" className="btn-home">🏠 ہوم پیج</a>
          <button onClick={handleLogout} className="btn-logout">
            خارج ہوں 🚪
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-header">
          <h2>قائدین کی فہرست</h2>
          <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
            <a href="/yqt-admin/messages" className="btn-add" style={{textDecoration: 'none'}}>
              📨 پیغامات
            </a>
            <a href="/yqt-admin/gallery" className="btn-add" style={{textDecoration: 'none'}}>
              🖼️ گیلری
            </a>
            <a href="/yqt-admin/shura" className="btn-add" style={{textDecoration: 'none'}}>
              🕌 مجلس شوریٰ
            </a>
            <button onClick={openAddModal} className="btn-add">
              ➕ نیا اضافہ کریں
            </button>
          </div>
        </div>

        <div className="leaders-table">
          {leaders.length === 0 ? (
            <div className="empty-state">
              <p>ابھی کوئی ڈیٹا موجود نہیں</p>
              <button onClick={openAddModal} className="btn-add">
                پہلا اضافہ کریں
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>تصویر</th>
                  <th>نام</th>
                  <th>عہدہ</th>
                  <th>تفصیل</th>
                  <th>ایکشن</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader) => (
                  <tr key={leader.id}>
                    <td>
                      <img src={leader.image_url} alt={leader.name} className="leader-thumb" />
                    </td>
                    <td>{leader.name}</td>
                    <td>{leader.position}</td>
                    <td className="description-cell">{leader.description}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleEdit(leader)} className="btn-edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(leader.id)} className="btn-delete">
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
              <h2>{editingLeader ? 'ترمیم کریں' : 'نیا اضافہ کریں'}</h2>
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
                  placeholder="مثال: صاحب خان عاجز"
                />
              </div>

              <div className="form-group">
                <label>عہدہ *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required
                  placeholder="مثال: صدر"
                />
              </div>

              <div className="form-group">
                <label>تفصیل *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="3"
                  placeholder="تفصیل لکھیں..."
                ></textarea>
              </div>

              <div className="form-group">
                <label>ترتیب نمبر (Display Order)</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 999})}
                  placeholder="1, 2, 3, 4... (چھوٹا نمبر پہلے دکھے گا)"
                  min="1"
                />
                <small style={{color: '#666', fontSize: '0.9rem'}}>
                  1 = سب سے پہلے، 2 = دوسرے نمبر پر، وغیرہ
                </small>
              </div>

              <div className="form-group">
                <label>تصویر URL (یا فائل اپ لوڈ کریں)</label>
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

export default AdminDashboard;
