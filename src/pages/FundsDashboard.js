import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './FundsDashboard.css';

function FundsDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [persons, setPersons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    person_id: '',
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchCategories();
      await fetchPersons();
    };
    init();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchData();
    }
  }, [categories]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/funds/login');
      return;
    }

    // Check if user is manager
    const { data: userData } = await supabase
      .from('fund_users')
      .select('role')
      .eq('email', user.email)
      .single();

    if (!userData || userData.role !== 'manager') {
      alert('آپ Manager نہیں ہیں');
      navigate('/funds/login');
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
      console.error('Error fetching persons:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('fund_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) {
        console.error('Categories table not found or error:', error);
        // Use default hardcoded categories if table doesn't exist
        setCategories([
          { id: '1', name: 'genealogy_group', name_urdu: 'شجرنسب اور گروپ', icon: '📚', color: '#4caf50', display_order: 1 },
          { id: '2', name: 'event', name_urdu: 'ایونٹ', icon: '🎉', color: '#9c27b0', display_order: 2 }
        ]);
        return;
      }
      
      setCategories(data || []);
      
      // Set default category when categories load
      if (data && data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0].name }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories([
        { id: '1', name: 'genealogy_group', name_urdu: 'شجرنسب اور گروپ', icon: '📚', color: '#4caf50', display_order: 1 },
        { id: '2', name: 'event', name_urdu: 'ایونٹ', icon: '🎉', color: '#9c27b0', display_order: 2 }
      ]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all transactions with person info
      const { data: transData, error: transError } = await supabase
        .from('fund_transactions')
        .select(`
          *,
          person:fund_persons(name)
        `)
        .order('date', { ascending: false });

      if (transError) throw transError;
      setTransactions(transData || []);

      // Only calculate if we have categories
      if (categories.length === 0) {
        console.log('No categories loaded yet, skipping summary calculation');
        return;
      }

      // Calculate dynamic category-wise summary
      const summaryObj = {
        total_income: 0,
        total_expense: 0,
        total_balance: 0
      };

      categories.forEach(cat => {
        const cat_income = transData
          ?.filter(t => t.type === 'income' && t.category === cat.name)
          .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

        const cat_expense = transData
          ?.filter(t => t.type === 'expense' && t.category === cat.name)
          .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

        summaryObj[`${cat.name}_income`] = cat_income;
        summaryObj[`${cat.name}_expense`] = cat_expense;
        summaryObj[`${cat.name}_balance`] = cat_income - cat_expense;

        summaryObj.total_income += cat_income;
        summaryObj.total_expense += cat_expense;
      });

      summaryObj.total_balance = summaryObj.total_income - summaryObj.total_expense;
      
      console.log('Summary calculated:', summaryObj);
      setSummary(summaryObj);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const transactionData = {
        type: formData.type,
        category: formData.category,
        person_id: formData.person_id || null,
        name: formData.name,
        amount: parseFloat(formData.amount),
        date: formData.date,
        purpose: formData.purpose,
        description: formData.description,
        created_by: user?.email
      };

      let result;
      if (editingTransaction) {
        result = await supabase
          .from('fund_transactions')
          .update(transactionData)
          .eq('id', editingTransaction.id)
          .select();
      } else {
        result = await supabase
          .from('fund_transactions')
          .insert([transactionData])
          .select();
      }

      if (result.error) throw result.error;

      alert('✅ کامیابی سے محفوظ ہو گیا!');
      setShowModal(false);
      setFormData({
        type: 'income',
        name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        purpose: '',
        description: ''
      });
      setEditingTransaction(null);
      fetchData();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('❌ خرابی: ' + error.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category || (categories.length > 0 ? categories[0].name : ''),
      person_id: transaction.person_id || '',
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      purpose: transaction.purpose,
      description: transaction.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('کیا آپ واقعی حذف کرنا چاہتے ہیں؟')) return;

    try {
      const { error } = await supabase
        .from('fund_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('❌ حذف نہیں ہو سکا');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/funds/login');
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setFormData({
      type: 'income',
      category: categories.length > 0 ? categories[0].name : '',
      person_id: '',
      name: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      purpose: '',
      description: ''
    });
    setShowModal(true);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  if (loading) {
    return <div className="loading">لوڈ ہو رہا ہے...</div>;
  }

  return (
    <div className="funds-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>💰 فنڈز مینجمنٹ</h1>
          <p>Manager Dashboard</p>
        </div>
        <div className="header-right">
          <a href="/" className="btn-home">🏠 ہوم</a>
          <button onClick={handleLogout} className="btn-logout">خارج ہوں 🚪</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        {categories.map((category) => (
          <div key={category.id} className="summary-card" style={{
            background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
            color: category.color === '#ffd700' ? '#1a4d2e' : 'white'
          }}>
            <div className="card-icon" style={{
              background: category.color === '#ffd700' 
                ? 'rgba(26, 77, 46, 0.15)' 
                : 'rgba(255, 255, 255, 0.2)'
            }}>
              {category.icon}
            </div>
            <div className="card-content">
              <h3>{category.name_urdu}</h3>
              <p className="amount-detail">آمدن: Rs. {(summary[`${category.name}_income`] || 0).toLocaleString()}</p>
              <p className="amount-detail">خرچہ: Rs. {(summary[`${category.name}_expense`] || 0).toLocaleString()}</p>
              <p className="amount balance">باقی: Rs. {(summary[`${category.name}_balance`] || 0).toLocaleString()}</p>
            </div>
          </div>
        ))}

        <div className="summary-card total-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>کل مجموعی</h3>
            <p className="amount-detail">آمدن: Rs. {(summary.total_income || 0).toLocaleString()}</p>
            <p className="amount-detail">خرچہ: Rs. {(summary.total_expense || 0).toLocaleString()}</p>
            <p className="amount balance">باقی: Rs. {(summary.total_balance || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        <div className="filter-section">
          <div className="filter-group">
            <label>قسم:</label>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                تمام
              </button>
              <button 
                className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
                onClick={() => setFilter('income')}
              >
                آمدن
              </button>
              <button 
                className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
                onClick={() => setFilter('expense')}
              >
                خرچہ
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>فنڈ:</label>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                تمام
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`filter-btn ${categoryFilter === cat.name ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat.name)}
                >
                  {cat.icon} {cat.name_urdu}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/funds/categories')} className="btn-categories">
            📂 فنڈ کی اقسام
          </button>
          <button onClick={() => navigate('/funds/persons')} className="btn-persons">
            👥 افراد
          </button>
          <button onClick={openAddModal} className="btn-add">
            ➕ نیا
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <h2>لین دین کی تفصیل ({filteredTransactions.length})</h2>
        
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>ابھی کوئی ریکارڈ موجود نہیں</p>
            <button onClick={openAddModal} className="btn-add">پہلا ریکارڈ شامل کریں</button>
          </div>
        ) : (
          <div className="transactions-cards">
            {filteredTransactions.map((transaction) => {
              const category = categories.find(c => c.name === transaction.category);
              return (
                <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
                  <div className="card-header">
                    <span className={`type-badge ${transaction.type}`}>
                      {transaction.type === 'income' ? '📈 آمدن' : '📉 خرچہ'}
                    </span>
                    <span 
                      className="category-badge" 
                      style={{
                        background: category?.color + '26' || '#e0e0e0',
                        color: category?.color || '#666',
                        border: `2px solid ${category?.color || '#999'}`
                      }}
                    >
                      {category?.icon} {category?.name_urdu || transaction.category}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="card-row">
                      <span className="label">نام:</span>
                      <span className="value">
                        {transaction.person?.name || transaction.name}
                        {transaction.person && <small style={{display:'block',color:'#999',fontSize:'0.85em'}}>({transaction.name})</small>}
                      </span>
                    </div>

                    <div className="card-row amount-row">
                      <span className="label">رقم:</span>
                      <span className={`value ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
                        {transaction.type === 'income' ? '+' : '-'} Rs. {parseFloat(transaction.amount).toLocaleString()}
                      </span>
                    </div>

                    <div className="card-row">
                      <span className="label">تاریخ:</span>
                      <span className="value">{new Date(transaction.date).toLocaleDateString('ur-PK')}</span>
                    </div>

                    <div className="card-row">
                      <span className="label">مقصد:</span>
                      <span className="value">{transaction.purpose}</span>
                    </div>

                    {transaction.description && (
                      <div className="card-row full-width">
                        <span className="label">تفصیل:</span>
                        <span className="value description">{transaction.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button onClick={() => handleEdit(transaction)} className="btn-edit" title="ترمیم">
                      ✏️ ترمیم
                    </button>
                    <button onClick={() => handleDelete(transaction.id)} className="btn-delete" title="حذف">
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTransaction ? 'ترمیم کریں' : 'نیا اضافہ کریں'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-row">
                <div className="form-group">
                  <label>قسم *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setFormData({
                        ...formData, 
                        type: newType,
                        // Clear person when switching to expense
                        person_id: newType === 'expense' ? '' : formData.person_id,
                        name: newType === 'expense' ? '' : formData.name
                      });
                    }}
                    required
                  >
                    <option value="income">📈 آمدن</option>
                    <option value="expense">📉 خرچہ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>فنڈ کی قسم *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.icon} {cat.name_urdu}
                      </option>
                    ))}
                  </select>
                  {formData.type === 'expense' && formData.category && (
                    <small className="field-hint" style={{color: '#ff6b6b', fontWeight: 'bold'}}>
                      ⚠️ یہ رقم "{categories.find(c => c.name === formData.category)?.name_urdu}" سے کٹے گی
                    </small>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>رقم (روپے) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    placeholder="مثال: 5000"
                  />
                </div>

                <div className="form-group">
                  <label>تاریخ *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Person Selection - Only for Income */}
              {formData.type === 'income' && (
                <div className="form-group">
                  <label>شخص منتخب کریں <span style={{color: 'red'}}>*</span></label>
                  <select
                    value={formData.person_id}
                    onChange={(e) => {
                      const personId = e.target.value;
                      const selectedPerson = persons.find(p => p.id === personId);
                      setFormData({
                        ...formData, 
                        person_id: personId,
                        name: selectedPerson ? selectedPerson.name : formData.name
                      });
                    }}
                    className="person-select"
                    required
                  >
                    <option value="">-- کسی کو منتخب کریں --</option>
                    {persons.map(person => (
                      <option key={person.id} value={person.id}>
                        {person.name} {person.phone && `(${person.phone})`}
                      </option>
                    ))}
                  </select>
                  <small className="field-hint" style={{color: '#666'}}>
                    عطیہ دہندہ کا انتخاب کریں
                  </small>
                </div>
              )}

              <div className="form-group">
                <label>
                  {formData.type === 'income' ? 'نام' : 'خرچہ کی تفصیل'} *
                  {formData.person_id && <small>(پہلے سے منتخب)</small>}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder={
                    formData.type === 'income' 
                      ? 'مثال: محمد احمد' 
                      : 'مثال: دکان کا کرایہ، بجلی بل، پانی'
                  }
                  disabled={!!formData.person_id}
                />
                {formData.type === 'expense' && (
                  <small className="field-hint" style={{color: '#666'}}>
                    خرچہ کہاں ہوا؟ (کرایہ، بل، تعمیرات، وغیرہ)
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>مقصد *</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  required
                  placeholder="مثال: تعلیمی فنڈ، صحت کی سہولیات"
                />
              </div>

              <div className="form-group">
                <label>تفصیل (اختیاری)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="مزید تفصیل لکھیں..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  منسوخ کریں
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

export default FundsDashboard;
