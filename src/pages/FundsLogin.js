import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import './FundsLogin.css';

function FundsLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Check if user has funds access
      const { data: userData, error: userError } = await supabase
        .from('fund_users')
        .select('role')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        await supabase.auth.signOut();
        throw new Error('آپ کو Funds System تک رسائی نہیں ہے');
      }

      // Redirect based on role
      if (userData.role === 'manager') {
        navigate('/funds/dashboard');
      } else if (userData.role === 'viewer') {
        navigate('/funds/view');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'لاگ ان میں خرابی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="funds-login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>💰 فنڈز مینجمنٹ</h1>
          <p>یارُوخیل قومی تڑون</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-alert">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label>ای میل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>پاس ورڈ</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '⏳ لاگ ان ہو رہا ہے...' : '🔐 لاگ ان کریں'}
          </button>

          <div className="login-footer">
            <a href="/">← واپس ہوم پیج پر</a>
          </div>
        </form>

        <div className="login-info">
          <h3>🔑 رسائی کی تفصیلات:</h3>
          <ul>
            <li><strong>Manager:</strong> Add, Edit, Delete کر سکتے ہیں</li>
            <li><strong>Viewer:</strong> صرف دیکھ سکتے ہیں</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FundsLogin;
