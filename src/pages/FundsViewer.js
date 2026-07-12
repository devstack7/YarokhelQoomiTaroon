import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './FundsViewer.css';

function FundsViewer() {
  const [transactions, setTransactions] = useState([]);
  const [persons, setPersons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [personSummary, setPersonSummary] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [view, setView] = useState('transactions'); // transactions, persons, topdonors
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
      fetchPersonSummary();
    }
  }, [categories]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/funds/login');
      return;
    }

    // Check if user has viewer or manager access
    const { data: userData } = await supabase
      .from('fund_users')
      .select('role')
      .eq('email', user.email)
      .single();

    if (!userData) {
      alert('آپ کو رسائی نہیں ہے');
      navigate('/funds/login');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
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

      // Calculate dynamic summary
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
      
      // Legacy compatibility
      summaryObj.income = summaryObj.total_income;
      summaryObj.expense = summaryObj.total_expense;
      summaryObj.balance = summaryObj.total_balance;
      
      console.log('Viewer summary calculated:', summaryObj);
      setSummary(summaryObj);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories([
        { id: '1', name: 'genealogy_group', name_urdu: 'شجرنسب اور گروپ', icon: '📚', color: '#4caf50', display_order: 1 },
        { id: '2', name: 'event', name_urdu: 'ایونٹ', icon: '🎉', color: '#9c27b0', display_order: 2 }
      ]);
    }
  };

  const fetchPersonSummary = async () => {
    try {
      // Get person-wise income summary
      const { data, error } = await supabase
        .from('fund_transactions')
        .select(`
          person_id,
          amount,
          date,
          person:fund_persons(name)
        `)
        .eq('type', 'income')
        .not('person_id', 'is', null)
        .order('date', { ascending: false });

      if (error) throw error;

      // Group by person
      const grouped = {};
      data?.forEach(t => {
        const personId = t.person_id;
        if (!grouped[personId]) {
          grouped[personId] = {
            person_id: personId,
            name: t.person?.name || 'نامعلوم',
            total_amount: 0,
            donation_count: 0,
            last_donation: t.date,
            transactions: []
          };
        }
        grouped[personId].total_amount += parseFloat(t.amount);
        grouped[personId].donation_count += 1;
        grouped[personId].transactions.push(t);
      });

      const summaryArray = Object.values(grouped).sort((a, b) => b.total_amount - a.total_amount);
      setPersonSummary(summaryArray);
    } catch (error) {
      console.error('Error fetching person summary:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/funds/login');
  };

  const filteredTransactions = transactions.filter(t => {
    // Filter by type
    if (filter !== 'all' && t.type !== filter) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    
    // Filter by person
    if (selectedPerson && t.person_id !== selectedPerson) return false;
    
    return true;
  });

  if (loading) {
    return <div className="loading">لوڈ ہو رہا ہے...</div>;
  }

  return (
    <div className="funds-viewer">
      <div className="viewer-header">
        <div className="header-left">
          <h1>💰 فنڈز رپورٹ</h1>
          <p>📊 View Only Access</p>
        </div>
        <div className="header-right">
          <a href="/" className="btn-home">🏠 ہوم</a>
          <button onClick={handleLogout} className="btn-logout">خارج ہوں 🚪</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-section">
        <h2>📈 مالی خلاصہ</h2>
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
                <p className="amount">Rs. {(summary[`${category.name}_balance`] || 0).toLocaleString()}</p>
                <span className="card-label">
                  آمدن: {(summary[`${category.name}_income`] || 0).toLocaleString()} | 
                  خرچہ: {(summary[`${category.name}_expense`] || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          <div className="summary-card balance-card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>کل باقی رقم</h3>
              <p className="amount">Rs. {(summary.balance || 0).toLocaleString()}</p>
              <span className="card-label">
                آمدن: {(summary.income || 0).toLocaleString()} | 
                خرچہ: {(summary.expense || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="view-tabs">
        <button 
          className={`tab-btn ${view === 'transactions' ? 'active' : ''}`}
          onClick={() => setView('transactions')}
        >
          📝 لین دین
        </button>
        <button 
          className={`tab-btn ${view === 'persons' ? 'active' : ''}`}
          onClick={() => setView('persons')}
        >
          👥 افراد
        </button>
        <button 
          className={`tab-btn ${view === 'topdonors' ? 'active' : ''}`}
          onClick={() => setView('topdonors')}
        >
          🏆 اعلیٰ
        </button>
      </div>

      {/* Transactions View */}
      {view === 'transactions' && (
        <>
          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-row">
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
                    📈 آمدن
                  </button>
                  <button 
                    className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
                    onClick={() => setFilter('expense')}
                  >
                    📉 خرچہ
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

              <div className="filter-group">
                <label>شخص:</label>
                <select
                  value={selectedPerson}
                  onChange={(e) => setSelectedPerson(e.target.value)}
                  className="person-filter"
                >
                  <option value="">تمام افراد</option>
                  {persons.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="results-count">
              {filteredTransactions.length} نتائج
            </p>
          </div>

          {/* Transactions List */}
          <div className="transactions-section">
            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <p>کوئی ریکارڈ نہیں ملا</p>
              </div>
            ) : (
              <div className="transactions-list">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
                    <div className="transaction-header">
                      <div className="transaction-type">
                        <span className={`type-badge ${transaction.type}`}>
                          {transaction.type === 'income' ? '📈 آمدن' : '📉 خرچہ'}
                        </span>
                        <span 
                          className="category-badge-small"
                          style={{
                            background: categories.find(c => c.name === transaction.category)?.color + '26' || '#e0e0e0',
                            color: categories.find(c => c.name === transaction.category)?.color || '#666',
                            border: `1px solid ${categories.find(c => c.name === transaction.category)?.color || '#999'}`,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginLeft: '8px'
                          }}
                        >
                          {categories.find(c => c.name === transaction.category)?.icon} {categories.find(c => c.name === transaction.category)?.name_urdu}
                        </span>
                        <span className="transaction-date">
                          {new Date(transaction.date).toLocaleDateString('ur-PK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'} Rs. {parseFloat(transaction.amount).toLocaleString()}
                      </div>
                    </div>

                    <div className="transaction-body">
                      <h3>{transaction.person?.name || transaction.name}</h3>
                      {transaction.person && transaction.person.name !== transaction.name && (
                        <p className="sub-name">({transaction.name})</p>
                      )}
                      <div className="transaction-details">
                        <div className="detail-item">
                          <span className="detail-label">🎯 مقصد:</span>
                          <span className="detail-value">{transaction.purpose}</span>
                        </div>
                        {transaction.description && (
                          <div className="detail-item">
                            <span className="detail-label">📝 تفصیل:</span>
                            <span className="detail-value">{transaction.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Persons View */}
      {view === 'persons' && (
        <div className="persons-view">
          <div className="persons-header">
            <h2>👥 افراد کی تفصیل</h2>
            <p>{personSummary.length} افراد نے عطیات دیے</p>
          </div>

          {personSummary.length === 0 ? (
            <div className="empty-state">
              <p>ابھی کوئی عطیات نہیں</p>
            </div>
          ) : (
            <div className="persons-list">
              {personSummary.map((person, index) => (
                <div key={person.person_id} className="person-card">
                  <div className="person-rank">#{index + 1}</div>
                  <div className="person-info">
                    <h3>{person.name}</h3>
                    <div className="person-stats">
                      <div className="stat-item">
                        <span className="stat-label">کل رقم:</span>
                        <span className="stat-value income">Rs. {person.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">مرتبہ:</span>
                        <span className="stat-value">{person.donation_count}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">آخری:</span>
                        <span className="stat-value">
                          {new Date(person.last_donation).toLocaleDateString('ur-PK')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="btn-view-details"
                    onClick={() => {
                      setSelectedPerson(person.person_id);
                      setFilter('income');
                      setView('transactions');
                    }}
                  >
                    تفصیل دیکھیں
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Donors View */}
      {view === 'topdonors' && (
        <div className="topdonors-view">
          <div className="topdonors-header">
            <h2>🏆 اعلیٰ عطیہ دہندگان</h2>
            <p>Top 10 Donors</p>
          </div>

          {personSummary.length === 0 ? (
            <div className="empty-state">
              <p>ابھی کوئی عطیات نہیں</p>
            </div>
          ) : (
            <div className="topdonors-list">
              {personSummary.slice(0, 10).map((person, index) => (
                <div key={person.person_id} className={`topdonor-card rank-${index + 1}`}>
                  <div className="rank-badge">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div className="donor-info">
                    <h3>{person.name}</h3>
                  </div>
                  <div className="donor-amount">
                    <span className="amount">Rs. {person.total_amount.toLocaleString()}</span>
                    <span className="count">{person.donation_count} مرتبہ</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="topdonors-summary">
            <h3>📊 کل خلاصہ</h3>
            <div className="summary-row">
              <span>کل عطیہ دہندگان:</span>
              <strong>{personSummary.length}</strong>
            </div>
            <div className="summary-row">
              <span>کل عطیات:</span>
              <strong>Rs. {personSummary.reduce((sum, p) => sum + p.total_amount, 0).toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>اوسط عطیہ:</span>
              <strong>
                Rs. {personSummary.length > 0 
                  ? Math.round(personSummary.reduce((sum, p) => sum + p.total_amount, 0) / personSummary.length).toLocaleString()
                  : 0}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="info-box">
        <h3>ℹ️ نوٹ</h3>
        <p>
          یہ صرف دیکھنے کا access ہے۔ آپ کوئی تبدیلی نہیں کر سکتے۔
          اگر کوئی غلطی نظر آئے تو Manager سے رابطہ کریں۔
        </p>
      </div>
    </div>
  );
}

export default FundsViewer;
