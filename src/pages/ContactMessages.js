import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './ContactMessages.css';

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchMessages();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/yqt-admin/login');
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_contact_stats');

      if (error) throw error;
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Status update نہیں ہو سکا');
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedMessage) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          admin_notes: adminNotes,
          status: 'replied'
        })
        .eq('id', selectedMessage.id);

      if (error) throw error;
      alert('✅ نوٹ محفوظ ہو گیا!');
      setShowModal(false);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('❌ نوٹ محفوظ نہیں ہو سکا');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('کیا آپ واقعی حذف کرنا چاہتے ہیں؟')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('❌ حذف نہیں ہو سکا');
    }
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
    setAdminNotes(message.admin_notes || '');
    setShowModal(true);

    // Mark as read if unread
    if (message.status === 'unread') {
      updateStatus(message.id, 'read');
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filterStatus === 'all') return true;
    return msg.status === filterStatus;
  });

  if (loading) {
    return <div className="loading">لوڈ ہو رہا ہے...</div>;
  }

  return (
    <div className="contact-messages">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>📨 رابطہ پیغامات</h1>
          <p>ویب سائٹ سے موصول ہونے والے پیغامات</p>
        </div>
        <div className="header-right">
          <a href="/yqt-admin/dashboard" className="btn-back">← Dashboard</a>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.total_messages || 0}</h3>
            <p>کل پیغامات</p>
          </div>
        </div>

        <div className="stat-card unread">
          <div className="stat-icon">✉️</div>
          <div className="stat-info">
            <h3>{stats.unread_messages || 0}</h3>
            <p>نئے (Unread)</p>
          </div>
        </div>

        <div className="stat-card read">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats.read_messages || 0}</h3>
            <p>پڑھے ہوئے (Read)</p>
          </div>
        </div>

        <div className="stat-card replied">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.replied_messages || 0}</h3>
            <p>جواب دیا (Replied)</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <button 
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          تمام ({messages.length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'unread' ? 'active' : ''}`}
          onClick={() => setFilterStatus('unread')}
        >
          نئے ({messages.filter(m => m.status === 'unread').length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'read' ? 'active' : ''}`}
          onClick={() => setFilterStatus('read')}
        >
          پڑھے ہوئے ({messages.filter(m => m.status === 'read').length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'replied' ? 'active' : ''}`}
          onClick={() => setFilterStatus('replied')}
        >
          جواب دیا ({messages.filter(m => m.status === 'replied').length})
        </button>
      </div>

      {/* Messages List */}
      <div className="messages-section">
        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            <p>کوئی پیغام موجود نہیں</p>
          </div>
        ) : (
          <div className="messages-grid">
            {filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className={`message-card ${message.status}`}
                onClick={() => openMessageModal(message)}
              >
                <div className="message-header">
                  <h3>{message.name}</h3>
                  <span className={`status-badge ${message.status}`}>
                    {message.status === 'unread' && '🔵 نیا'}
                    {message.status === 'read' && '👁️ پڑھا'}
                    {message.status === 'replied' && '✅ جواب'}
                  </span>
                </div>

                <div className="message-info">
                  <p>
                    <span className="label">📧 ای میل:</span>
                    <span dir="ltr">{message.email}</span>
                  </p>
                  {message.phone && (
                    <p>
                      <span className="label">📞 فون:</span>
                      <span dir="ltr">{message.phone}</span>
                    </p>
                  )}
                </div>

                <div className="message-preview">
                  <p>{message.message.substring(0, 100)}...</p>
                </div>

                <div className="message-footer">
                  <span className="date">
                    📅 {new Date(message.created_at).toLocaleDateString('ur-PK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="message-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => updateStatus(message.id, 'read')} 
                    className="btn-action"
                    title="پڑھا ہوا نشان لگائیں"
                  >
                    👁️
                  </button>
                  <button 
                    onClick={() => updateStatus(message.id, 'replied')} 
                    className="btn-action"
                    title="جواب دیا نشان لگائیں"
                  >
                    ✅
                  </button>
                  <button 
                    onClick={() => handleDelete(message.id)} 
                    className="btn-delete"
                    title="حذف کریں"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>پیغام کی تفصیل</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>بھیجنے والے کی معلومات:</h3>
                <p><strong>نام:</strong> {selectedMessage.name}</p>
                <p><strong>ای میل:</strong> <span dir="ltr">{selectedMessage.email}</span></p>
                {selectedMessage.phone && (
                  <p><strong>فون:</strong> <span dir="ltr">{selectedMessage.phone}</span></p>
                )}
                <p><strong>تاریخ:</strong> {new Date(selectedMessage.created_at).toLocaleString('ur-PK')}</p>
              </div>

              <div className="detail-section">
                <h3>پیغام:</h3>
                <p className="message-text">{selectedMessage.message}</p>
              </div>

              <div className="detail-section">
                <h3>Status:</h3>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => {
                    updateStatus(selectedMessage.id, e.target.value);
                    setSelectedMessage({...selectedMessage, status: e.target.value});
                  }}
                  className="status-select"
                >
                  <option value="unread">نیا (Unread)</option>
                  <option value="read">پڑھا ہوا (Read)</option>
                  <option value="replied">جواب دیا (Replied)</option>
                </select>
              </div>

              <div className="detail-section">
                <h3>Admin Notes:</h3>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="4"
                  placeholder="نوٹ لکھیں..."
                  className="admin-notes"
                ></textarea>
                <button onClick={saveAdminNotes} className="btn-save">
                  نوٹ محفوظ کریں
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactMessages;
