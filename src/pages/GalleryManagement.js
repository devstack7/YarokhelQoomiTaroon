import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './GalleryManagement.css';

function GalleryManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterType, setFilterType] = useState('all'); // all, image, video
  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    category: '',
    description: '',
    image_url: '',
    video_url: '',
    thumbnail_url: '',
    display_order: 999
  });
  const [imageFile, setImageFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchItems();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/yqt-admin/login');
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;

    try {
      console.log('Starting image upload...');
      const { data: { user } } = await supabase.auth.getUser();
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

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
        return 'https://via.placeholder.com/800x600/2c5f2d/ffffff?text=تصویر+نہیں';
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ Image upload exception:', error);
      if (formData.image_url) return formData.image_url;
      return 'https://via.placeholder.com/800x600/2c5f2d/ffffff?text=تصویر+نہیں';
    }
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return formData.thumbnail_url;

    try {
      console.log('Starting thumbnail upload...');
      
      const fileExt = thumbnailFile.name.split('.').pop();
      const fileName = `thumb_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/thumbnails/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, thumbnailFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: thumbnailFile.type
        });

      if (uploadError) {
        console.error('❌ Thumbnail upload error:', uploadError);
        return formData.thumbnail_url || null;
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ Thumbnail upload exception:', error);
      return formData.thumbnail_url || null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        alert('❌ آپ لاگ ان نہیں ہیں۔ دوبارہ لاگ ان کریں۔');
        navigate('/yqt-admin/login');
        return;
      }

      let imageUrl = formData.image_url;
      let videoUrl = formData.video_url;
      let thumbnailUrl = formData.thumbnail_url;

      // Upload image if file is selected
      if (formData.type === 'image' && imageFile) {
        imageUrl = await uploadImage();
      }

      // Upload thumbnail if file is selected (for videos)
      if (formData.type === 'video' && thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
      }

      // Clean YouTube URL for embedding
      if (formData.type === 'video' && videoUrl) {
        videoUrl = convertToEmbedUrl(videoUrl);
      }

      const itemData = {
        type: formData.type,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        image_url: formData.type === 'image' ? imageUrl : null,
        video_url: formData.type === 'video' ? videoUrl : null,
        thumbnail_url: formData.type === 'video' ? thumbnailUrl : null,
        display_order: formData.display_order || 999
      };

      let result;
      if (editingItem) {
        result = await supabase
          .from('gallery_items')
          .update(itemData)
          .eq('id', editingItem.id)
          .select();
      } else {
        result = await supabase
          .from('gallery_items')
          .insert([itemData])
          .select();
      }

      if (result.error) {
        console.error('❌ DATABASE ERROR:', result.error);
        throw result.error;
      }

      alert('✅ کامیابی سے محفوظ ہو گیا!');
      setShowModal(false);
      setFormData({
        type: 'image',
        title: '',
        category: '',
        description: '',
        image_url: '',
        video_url: '',
        thumbnail_url: '',
        display_order: 999
      });
      setImageFile(null);
      setThumbnailFile(null);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('=== ERROR CAUGHT ===', error);
      alert(`❌ خرابی: ${error.message || 'ڈیٹا محفوظ نہیں ہو سکا'}`);
    } finally {
      setUploading(false);
    }
  };

  const convertToEmbedUrl = (url) => {
    // Convert YouTube watch URL to embed URL
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://youtube.com/shorts/VIDEO_ID
    // → https://www.youtube.com/embed/VIDEO_ID
    
    if (!url) return '';
    
    // Already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Extract video ID from different YouTube URL formats
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/shorts/') || url.includes('youtube.com/shorts/')) {
      // Handle YouTube Shorts
      videoId = url.split('/shorts/')[1]?.split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      title: item.title,
      category: item.category || '',
      description: item.description || '',
      image_url: item.image_url || '',
      video_url: item.video_url || '',
      thumbnail_url: item.thumbnail_url || '',
      display_order: item.display_order || 999
    });
    setShowModal(true);
  };

  const handleToggleActive = async (item) => {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      alert('❌ تبدیلی نہیں ہو سکی');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('کیا آپ واقعی حذف کرنا چاہتے ہیں؟')) {
      try {
        const { error } = await supabase
          .from('gallery_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('❌ حذف نہیں ہو سکا');
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      type: 'image',
      title: '',
      category: '',
      description: '',
      image_url: '',
      video_url: '',
      thumbnail_url: '',
      display_order: 999
    });
    setImageFile(null);
    setThumbnailFile(null);
    setShowModal(true);
  };

  const filteredItems = items.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  if (loading) {
    return <div className="loading">لوڈ ہو رہا ہے...</div>;
  }

  return (
    <div className="gallery-management">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🖼️ گیلری مینجمنٹ</h1>
          <p>تصاویر اور ویڈیوز کا انتظام</p>
        </div>
        <div className="header-right">
          <a href="/yqt-admin/dashboard" className="btn-back">← Dashboard</a>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-header">
          <div className="header-info">
            <h2>گیلری آئٹمز ({filteredItems.length})</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                تمام ({items.length})
              </button>
              <button 
                className={`filter-btn ${filterType === 'image' ? 'active' : ''}`}
                onClick={() => setFilterType('image')}
              >
                🖼️ تصاویر ({items.filter(i => i.type === 'image').length})
              </button>
              <button 
                className={`filter-btn ${filterType === 'video' ? 'active' : ''}`}
                onClick={() => setFilterType('video')}
              >
                🎥 ویڈیوز ({items.filter(i => i.type === 'video').length})
              </button>
            </div>
          </div>
          <button onClick={openAddModal} className="btn-add">
            ➕ نیا اضافہ کریں
          </button>
        </div>

        <div className="gallery-grid">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>ابھی کوئی آئٹم شامل نہیں</p>
              <button onClick={openAddModal} className="btn-add">
                پہلا آئٹم شامل کریں
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className={`gallery-card ${!item.is_active ? 'inactive' : ''}`}>
                <div className="card-preview">
                  {item.type === 'image' ? (
                    <img src={item.image_url} alt={item.title} />
                  ) : (
                    <div className="video-preview">
                      <iframe
                        src={item.video_url}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <span className="type-badge">
                    {item.type === 'image' ? '🖼️ تصویر' : '🎥 ویڈیو'}
                  </span>
                </div>
                
                <div className="card-content">
                  <h3>{item.title}</h3>
                  {item.category && (
                    <span className="category-tag">{item.category}</span>
                  )}
                  {item.description && (
                    <p className="description">{item.description}</p>
                  )}
                  <div className="card-meta">
                    <span className="order">ترتیب: {item.display_order}</span>
                    <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                      {item.is_active ? '✓ فعال' : '⊗ غیر فعال'}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button onClick={() => handleEdit(item)} className="btn-edit" title="ترمیم">
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleToggleActive(item)} 
                    className="btn-toggle"
                    title={item.is_active ? 'غیر فعال کریں' : 'فعال کریں'}
                  >
                    {item.is_active ? '⊗' : '✓'}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn-delete" title="حذف">
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'ترمیم کریں' : 'نیا اضافہ کریں'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>قسم *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="image">🖼️ تصویر</option>
                  <option value="video">🎥 ویڈیو</option>
                </select>
              </div>

              <div className="form-group">
                <label>عنوان *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="مثال: قومی تقریب"
                />
              </div>

              <div className="form-group">
                <label>قسم</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="مثال: تقریبات، قدرتی، ثقافتی"
                />
              </div>

              <div className="form-group">
                <label>تفصیل</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="2"
                  placeholder="تفصیل لکھیں..."
                ></textarea>
              </div>

              {formData.type === 'image' ? (
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
              ) : (
                <div className="form-group">
                  <label>YouTube URL *</label>
                  <input
                    type="text"
                    value={formData.video_url}
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    required
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtube.com/shorts/VIDEO_ID"
                    className="url-input"
                  />
                  <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                    YouTube کا مکمل URL دیں (Video یا Shorts)، خودکار طور پر embed link بن جائے گا
                  </small>
                  {formData.video_url && (
                    <div className="video-preview">
                      <iframe
                        src={convertToEmbedUrl(formData.video_url)}
                        title="Preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  
                  {/* Thumbnail Upload for Videos */}
                  <div style={{marginTop: '20px'}}>
                    <label>تھمبنیل (اختیاری)</label>
                    <input
                      type="text"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="url-input"
                    />
                    <span className="or-text">یا</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="file-input"
                    />
                    <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                      تھمبنیل اپ لوڈ کریں - اگر نہیں تو video iframe دکھائی دے گا
                    </small>
                    {(thumbnailFile || formData.thumbnail_url) && (
                      <div className="image-preview">
                        <img 
                          src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : formData.thumbnail_url} 
                          alt="Thumbnail Preview" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>ترتیب نمبر</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 999})}
                  placeholder="1, 2, 3, 4..."
                  min="1"
                />
                <small style={{color: '#666'}}>چھوٹا نمبر پہلے دکھائی دے گا</small>
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

export default GalleryManagement;
