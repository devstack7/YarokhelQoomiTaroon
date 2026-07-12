# Fund Categories Implementation Plan

## Overview
Add category-based fund tracking to organize income and expenses by purpose.

## Categories:

### 1. شجرنسب اور گروپ (Genealogy & Group)
**Code**: `genealogy_group`
**Purpose**: 
- Genealogy documentation (شجرنسب کی ترتیب)
- General group management
- Organizational expenses
- Regular operations

### 2. ایونٹ (Events)
**Code**: `event`
**Purpose**:
- Specific events (تقریبات)
- Event fundraising
- Event-specific expenses
- Celebrations, gatherings

## Database Changes:

### Add Category Column:
```sql
ALTER TABLE fund_transactions
ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'genealogy_group';

ALTER TABLE fund_transactions
ADD CONSTRAINT fund_category_check
CHECK (category IN ('genealogy_group', 'event'));
```

## Frontend Changes Needed:

### 1. FundsDashboard.js (Manager)

#### Add to formData:
```javascript
const [formData, setFormData] = useState({
  type: 'income',
  category: 'genealogy_group',  // NEW
  person_id: '',
  name: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  purpose: '',
  description: ''
});
```

#### Add Category Selector in Form:
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
</div>
```

#### Update Summary to Show Category-wise:
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

#### Calculate Category-wise Summary:
```javascript
const genealogy_income = transData
  ?.filter(t => t.type === 'income' && t.category === 'genealogy_group')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

const genealogy_expense = transData
  ?.filter(t => t.type === 'expense' && t.category === 'genealogy_group')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

const event_income = transData
  ?.filter(t => t.type === 'income' && t.category === 'event')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

const event_expense = transData
  ?.filter(t => t.type === 'expense' && t.category === 'event')
  .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
```

#### Add Category Filter:
```javascript
const [categoryFilter, setCategoryFilter] = useState('all'); // all, genealogy_group, event

const filteredTransactions = transactions.filter(t => {
  if (filter !== 'all' && t.type !== filter) return false;
  if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
  return true;
});
```

#### Display Category in Table:
```jsx
<td>
  <span className={`category-badge ${transaction.category}`}>
    {transaction.category === 'genealogy_group' ? '📚 شجرنسب/گروپ' : '🎉 ایونٹ'}
  </span>
</td>
```

### 2. FundsViewer.js (Read-only)

#### Update Query to Include Category:
```javascript
const { data: transData } = await supabase
  .from('fund_transactions')
  .select(`
    *,
    person:fund_persons(name)
  `)
  .order('date', { ascending: false});
```

#### Add Category-wise Summary Cards:
```jsx
<div className="category-summary">
  <div className="category-card genealogy">
    <h3>📚 شجرنسب اور گروپ</h3>
    <p>آمدن: Rs. {genealogy_income.toLocaleString()}</p>
    <p>خرچہ: Rs. {genealogy_expense.toLocaleString()}</p>
    <p className="balance">باقی: Rs. {(genealogy_income - genealogy_expense).toLocaleString()}</p>
  </div>
  
  <div className="category-card event">
    <h3>🎉 ایونٹ</h3>
    <p>آمدن: Rs. {event_income.toLocaleString()}</p>
    <p>خرچہ: Rs. {event_expense.toLocaleString()}</p>
    <p className="balance">باقی: Rs. {(event_income - event_expense).toLocaleString()}</p>
  </div>
</div>
```

#### Add Category Filter:
```jsx
<div className="category-filter">
  <button onClick={() => setCategoryFilter('all')}>تمام</button>
  <button onClick={() => setCategoryFilter('genealogy_group')}>📚 شجرنسب/گروپ</button>
  <button onClick={() => setCategoryFilter('event')}>🎉 ایونٹ</button>
</div>
```

#### Display Category in Transaction List:
```jsx
<div className="transaction-category">
  {transaction.category === 'genealogy_group' ? '📚 شجرنسب/گروپ' : '🎉 ایونٹ'}
</div>
```

## CSS Changes:

### Category Badges:
```css
.category-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
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
```

### Category Cards:
```css
.category-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.category-card {
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.category-card.genealogy {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
}

.category-card.event {
  background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
  color: white;
}

.category-card h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.category-card p {
  margin: 10px 0;
  font-size: 1.2rem;
}

.category-card .balance {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid rgba(255,255,255,0.3);
}
```

## User Experience Flow:

### Adding Income (Manager):
1. Click "نیا" button
2. Select type: "آمدن"
3. **Select category**: "شجرنسب اور گروپ" or "ایونٹ"
4. Fill amount, person, purpose
5. Save → Income added to selected category

### Adding Expense (Manager):
1. Click "نیا" button
2. Select type: "خرچہ"
3. **Select category**: "شجرنسب اور گروپ" or "ایونٹ"
4. System shows: "اس قسم سے کٹا جائے گا: [category name]"
5. Fill amount, purpose, description
6. Save → Expense deducted from selected category

### Viewing Reports (Manager & Viewer):
1. Dashboard shows 3 summary cards:
   - **شجرنسب/گروپ**: Income, Expense, Balance
   - **ایونٹ**: Income, Expense, Balance
   - **کل**: Total of both

2. Filter transactions by:
   - Type: All / Income / Expense
   - Category: All / Genealogy/Group / Event

3. Each transaction shows category badge

## Benefits:

### ✅ Organized Tracking:
- Separate genealogy funds from event funds
- Clear categorization
- Better financial planning

### ✅ Transparent Reporting:
- Category-wise balances
- Easy to see where money goes
- Better accountability

### ✅ Smart Expense Management:
- Know which category to deduct from
- Prevent mixing different fund purposes
- Track category-specific spending

### ✅ Better Decision Making:
- See if genealogy project needs more funds
- Track event fundraising separately
- Plan future events based on category data

## Implementation Steps:

1. **Run SQL**: `ADD_FUND_CATEGORIES.sql`
2. **Update FundsDashboard.js**: Add category field and filters
3. **Update FundsViewer.js**: Add category display and filters
4. **Update CSS**: Add category badge and card styles
5. **Test**: Add transactions in both categories
6. **Verify**: Check reports show correct category balances

## Example Scenarios:

### Scenario 1: Genealogy Donation
```
Type: Income
Category: شجرنسب اور گروپ
Amount: Rs. 5,000
Purpose: شجرنسب کی کتاب کے لیے
Result: Added to genealogy_group income
```

### Scenario 2: Event Donation
```
Type: Income
Category: ایونٹ
Amount: Rs. 3,000
Purpose: سالانہ تقریب کے لیے
Result: Added to event income
```

### Scenario 3: Genealogy Expense
```
Type: Expense
Category: شجرنسب اور گروپ
Amount: Rs. 2,000
Purpose: پرنٹنگ
Description: شجرنسب کی کتاب کی پرنٹنگ
Result: Deducted from genealogy_group balance
```

### Scenario 4: Event Expense
```
Type: Expense
Category: ایونٹ
Amount: Rs. 1,500
Purpose: ہال کرایہ
Description: سالانہ تقریب کا ہال
Result: Deducted from event balance
```

## Reporting Views:

### Manager Dashboard:
```
┌─────────────────────────────────────────┐
│ 📚 شجرنسب اور گروپ                      │
│ آمدن: Rs. 50,000                        │
│ خرچہ: Rs. 20,000                        │
│ باقی: Rs. 30,000                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🎉 ایونٹ                                │
│ آمدن: Rs. 30,000                        │
│ خرچہ: Rs. 15,000                        │
│ باقی: Rs. 15,000                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💰 کل                                    │
│ آمدن: Rs. 80,000                        │
│ خرچہ: Rs. 35,000                        │
│ باقی: Rs. 45,000                         │
└─────────────────────────────────────────┘
```

Complete category-based fund management! 📊💰
