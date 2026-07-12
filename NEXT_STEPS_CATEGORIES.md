# Next Steps: Implement Fund Categories

## Summary
Add 2 fund categories to organize donations and expenses:
1. **📚 شجرنسب اور گروپ** (Genealogy & Group)
2. **🎉 ایونٹ** (Events)

## Step 1: Database Setup ✅ READY

Run this SQL in Supabase:

```sql
-- File: ADD_FUND_CATEGORIES.sql
ALTER TABLE fund_transactions ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'genealogy_group';
ALTER TABLE fund_transactions ADD CONSTRAINT fund_category_check CHECK (category IN ('genealogy_group', 'event'));
```

## Step 2: Update Frontend Code

### Files to Modify:
1. `src/pages/FundsDashboard.js` - Manager interface
2. `src/pages/FundsViewer.js` - Viewer interface  
3. `src/pages/FundsDashboard.css` - Styling
4. `src/pages/FundsViewer.css` - Styling

### Changes Needed in FundsDashboard.js:

#### A. Add category to formData (line ~20):
```javascript
const [formData, setFormData] = useState({
  type: 'income',
  category: 'genealogy_group',  // ADD THIS
  person_id: '',
  name: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  purpose: '',
  description: ''
});
```

#### B. Add category filter state (line ~30):
```javascript
const [categoryFilter, setCategoryFilter] = useState('all'); // ADD THIS
```

#### C. Update summary state (line ~25):
```javascript
const [summary, setSummary] = useState({ 
  genealogy_income: 0,
  genealogy_expense: 0,
  genealogy_balance: 0,
  event_income: 0,
  event_expense: 0,
  event_balance: 0,
  total_income: 0,
  total_expense: 0,
  total_balance: 0
});
```

#### D. Update fetchData() to calculate category-wise:
```javascript
const genealogy_income = transData?.filter(t => t.type === 'income' && t.category === 'genealogy_group')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
const genealogy_expense = transData?.filter(t => t.type === 'expense' && t.category === 'genealogy_group')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
const event_income = transData?.filter(t => t.type === 'income' && t.category === 'event')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
const event_expense = transData?.filter(t => t.type === 'expense' && t.category === 'event')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

setSummary({
  genealogy_income,
  genealogy_expense,
  genealogy_balance: genealogy_income - genealogy_expense,
  event_income,
  event_expense,
  event_balance: event_income - event_expense,
  total_income: genealogy_income + event_income,
  total_expense: genealogy_expense + event_expense,
  total_balance: (genealogy_income + event_income) - (genealogy_expense + event_expense)
});
```

#### E. Add category field in form (in modal, after type field):
```jsx
<div className="form-group">
  <label>فنڈ کی قسم *</label>
  <select
    value={formData.category}
    onChange={(e) => setFormData({...formData, category: e.target.value})}
    required
  >
    <option value="genealogy_group">📚 شجرنسب اور گروپ</option>
    <option value="event">🎉 ایونٹ</option>
  </select>
  {formData.type === 'expense' && (
    <small className="hint">یہ رقم {formData.category === 'genealogy_group' ? 'شجرنسب/گروپ' : 'ایونٹ'} سے کٹے گی</small>
  )}
</div>
```

#### F. Update summary cards to show 3 cards:
```jsx
<div className="summary-cards">
  <div className="summary-card genealogy-card">
    <h3>📚 شجرنسب اور گروپ</h3>
    <p>آمدن: Rs. {summary.genealogy_income.toLocaleString()}</p>
    <p>خرچہ: Rs. {summary.genealogy_expense.toLocaleString()}</p>
    <p className="balance">باقی: Rs. {summary.genealogy_balance.toLocaleString()}</p>
  </div>

  <div className="summary-card event-card">
    <h3>🎉 ایونٹ</h3>
    <p>آمدن: Rs. {summary.event_income.toLocaleString()}</p>
    <p>خرچہ: Rs. {summary.event_expense.toLocaleString()}</p>
    <p className="balance">باقی: Rs. {summary.event_balance.toLocaleString()}</p>
  </div>

  <div className="summary-card total-card">
    <h3>💰 کل</h3>
    <p>آمدن: Rs. {summary.total_income.toLocaleString()}</p>
    <p>خرچہ: Rs. {summary.total_expense.toLocaleString()}</p>
    <p className="balance">باقی: Rs. {summary.total_balance.toLocaleString()}</p>
  </div>
</div>
```

#### G. Add category filter buttons:
```jsx
<div className="category-filter-buttons">
  <button onClick={() => setCategoryFilter('all')}>تمام</button>
  <button onClick={() => setCategoryFilter('genealogy_group')}>📚 شجرنسب/گروپ</button>
  <button onClick={() => setCategoryFilter('event')}>🎉 ایونٹ</button>
</div>
```

#### H. Update filteredTransactions:
```javascript
const filteredTransactions = transactions.filter(t => {
  if (filter !== 'all' && t.type !== filter) return false;
  if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
  return true;
});
```

#### I. Add category column in table:
```jsx
<th>قسم فنڈ</th>
...
<td>
  <span className={`category-badge ${transaction.category}`}>
    {transaction.category === 'genealogy_group' ? '📚 شجرنسب/گروپ' : '🎉 ایونٹ'}
  </span>
</td>
```

#### J. Update handleSubmit to include category:
```javascript
const transactionData = {
  type: formData.type,
  category: formData.category,  // ADD THIS
  person_id: formData.person_id || null,
  // ... rest of fields
};
```

## Step 3: CSS Styling

Add to `FundsDashboard.css`:

```css
/* Category badges */
.category-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
}

.category-badge.genealogy_group {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 2px solid #4caf50;
}

.category-badge.event {
  background: rgba(156, 39, 176, 0.2);
  color: #9c27b0;
  border: 2px solid #9c27b0;
}

/* Category cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.genealogy-card {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
}

.event-card {
  background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
}

.total-card {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1a4d2e;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
```

## Step 4: Testing

### Test Cases:

1. **Add Genealogy Income**
   - Type: آمدن
   - Category: شجرنسب اور گروپ
   - Amount: 5000
   - Verify: genealogy_income increases

2. **Add Event Income**
   - Type: آمدن
   - Category: ایونٹ
   - Amount: 3000
   - Verify: event_income increases

3. **Add Genealogy Expense**
   - Type: خرچہ
   - Category: شجرنسب اور گروپ
   - Amount: 2000
   - Verify: genealogy_balance decreases

4. **Add Event Expense**
   - Type: خرچہ
   - Category: ایونٹ
   - Amount: 1500
   - Verify: event_balance decreases

5. **Filter by Category**
   - Click "شجرنسب/گروپ"
   - Verify: Only genealogy transactions show
   - Click "ایونٹ"
   - Verify: Only event transactions show

6. **Viewer Access**
   - Login as viewer
   - Verify: Can see category-wise reports
   - Verify: Cannot edit or add transactions

## Step 5: Documentation

Create user guide explaining:
- What each category is for
- When to use which category
- How to filter by category
- How to read category reports

## Quick Implementation Checklist:

- [ ] Run `ADD_FUND_CATEGORIES.sql`
- [ ] Add category to formData state
- [ ] Add categoryFilter state
- [ ] Update summary state structure
- [ ] Update fetchData() calculations
- [ ] Add category dropdown in form
- [ ] Update summary cards (3 cards)
- [ ] Add category filter buttons
- [ ] Update filteredTransactions logic
- [ ] Add category column in table
- [ ] Update handleSubmit with category
- [ ] Add CSS for category badges
- [ ] Add CSS for category cards
- [ ] Test all scenarios
- [ ] Update FundsViewer similarly

## Files Reference:

1. **ADD_FUND_CATEGORIES.sql** - Database migration
2. **FUND_CATEGORIES_IMPLEMENTATION.md** - Complete technical docs
3. **NEXT_STEPS_CATEGORIES.md** - This file (step-by-step)

Need help with specific step? Let me know! 🚀
