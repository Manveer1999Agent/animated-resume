import React, { useState } from 'react';
import { Mail, Lock, User, EyeOff, Eye, ArrowRight, Sparkles, Linkedin, MoveLeft } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import './AuthContainer.css';

type AuthView = 'login' | 'signup' | 'forgot-password';

export function AuthContainer({ initialView = 'login' }: { initialView?: 'login' | 'signup' }) {
  const [view, setView] = useState<AuthView>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      if (data.user) {
        navigate('/app/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) throw signUpError;
      
      setMessage('Account created! Please check your email to verify your account.');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (resetError) throw resetError;
      setMessage('Password reset instructions sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'linkedin_oidc') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="auth-container-wrapper">
      <div className="auth-mesh-bg"></div>
      
      <main className="auth-panel">
        <div className="auth-panel-inner">
            
          <div className="auth-header">
              <div className="auth-logo-circle">
                  <Sparkles color="white" size={24} />
              </div>
              <h1 className="auth-title">PortfoliAI</h1>
              <p className="auth-subtitle">Your animated career journey starts here.</p>
          </div>

          {error && <div className="auth-msg error">{error}</div>}
          {message && <div className="auth-msg success">{message}</div>}

          {view !== 'forgot-password' && (
            <div className="auth-tabs">
                <button 
                  onClick={() => { setView('login'); setError(null); setMessage(null); }} 
                  className={`auth-tab-btn ${view === 'login' ? 'active' : 'inactive'}`}
                >
                    Log In
                </button>
                <button 
                  onClick={() => { setView('signup'); setError(null); setMessage(null); }} 
                  className={`auth-tab-btn ${view === 'signup' ? 'active' : 'inactive'}`}
                >
                    Sign Up
                </button>
            </div>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div className="auth-form-view">
                <form 
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} 
                  onSubmit={handleLogin}
                >
                    <div className="auth-form-group">
                        <label className="auth-label">Email Address</label>
                        <div className="auth-input-wrapper">
                            <div className="auth-input-icon">
                                <Mail size={16} />
                            </div>
                            <input 
                              type="email" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="alex@example.com" 
                              className="auth-input" 
                            />
                        </div>
                    </div>
                    
                    <div className="auth-form-group">
                        <div className="auth-form-group-header">
                            <label className="auth-label" style={{ margin: 0 }}>Password</label>
                            <button type="button" onClick={() => setView('forgot-password')} className="auth-forgot-link">Forgot?</button>
                        </div>
                        <div className="auth-input-wrapper">
                            <div className="auth-input-icon">
                                <Lock size={16} />
                            </div>
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••" 
                              className="auth-input" 
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="auth-input-action"
                            >
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="auth-submit-btn">
                        {loading ? 'Logging in...' : 'Log In to Dashboard'}
                    </button>
                </form>
            </div>
          )}

          {/* SIGN UP VIEW */}
          {view === 'signup' && (
            <div className="auth-form-view">
                <form 
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} 
                  onSubmit={handleSignUp}
                >
                    <div className="auth-form-group">
                        <label className="auth-label">Full Name</label>
                        <div className="auth-input-wrapper">
                            <div className="auth-input-icon">
                                <User size={16} />
                            </div>
                            <input 
                              type="text" 
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Alex Developer" 
                              className="auth-input" 
                            />
                        </div>
                    </div>

                    <div className="auth-form-group">
                        <label className="auth-label">Email Address</label>
                        <div className="auth-input-wrapper">
                            <div className="auth-input-icon">
                                <Mail size={16} />
                            </div>
                            <input 
                              type="email" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="alex@example.com" 
                              className="auth-input" 
                            />
                        </div>
                    </div>
                    
                    <div className="auth-form-group">
                        <label className="auth-label">Password</label>
                        <div className="auth-input-wrapper">
                            <div className="auth-input-icon">
                                <Lock size={16} />
                            </div>
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Create a strong password" 
                              className="auth-input" 
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="auth-input-action"
                            >
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="auth-submit-btn" style={{ position: 'relative' }}>
                        <span>{loading ? 'Creating...' : 'Create Account'}</span>
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot-password' && (
            <div className="auth-form-view">
                <button 
                  onClick={() => { setView('login'); setError(null); setMessage(null); }}
                  className="auth-forgot-link"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', width: 'fit-content' }}
                >
                  <MoveLeft size={16} /> Back to Log In
                </button>
                
                <div style={{ marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', margin: '0 0 0.5rem 0' }}>Reset Password</h2>
                  <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: 0 }}>Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <form 
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} 
                  onSubmit={handleForgotPassword}
                >
                    <div className="auth-form-group">
                        <label className="auth-label">Email Address</label>
                        <div className="auth-input-wrapper">
                            <div className="auth-input-icon">
                                <Mail size={16} />
                            </div>
                            <input 
                              type="email" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="alex@example.com" 
                              className="auth-input" 
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="auth-submit-btn">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
          )}

          {/* Social Auth Section */}
          {view !== 'forgot-password' && (
            <div className="auth-social-section">
                <div className="auth-social-divider">
                    <div className="line"></div>
                    <span>Or continue with</span>
                    <div className="line"></div>
                </div>

                <div className="auth-social-grid">
                    <button 
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="auth-social-btn google"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                        <div className="hover-border"></div>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleSocialLogin('linkedin_oidc')}
                      className="auth-social-btn linkedin"
                    >
                        <Linkedin size={20} fill="currentColor" />
                        LinkedIn
                        <div className="hover-border"></div>
                    </button>
                </div>
            </div>
          )}

          <div className="auth-orb-primary"></div>
          <div className="auth-orb-secondary"></div>
        </div>
      </main>
    </div>
  );
}
