import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-visual">
                <div className="visual-content">
                    <h1>AK<span>ADMIN</span></h1>
                    <p>Creative Studio Management Portal</p>
                </div>
                <div className="gradient-sphere"></div>
            </div>

            <div className="login-form-side">
                <div className="login-card glass-panel">
                    <div className="login-header">
                        <h2>Welcome</h2>
                        <p>Authorized personnel only. Please sign in.</p>
                    </div>

                    {error && <div className="error-badge">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-field">
                            <label>Admin Email</label>
                            <div className="field-inner">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-field">
                            <label>Security Key</label>
                            <div className="field-inner">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-actions">
                            <Link to="/admin/forgot-password">Need recovery?</Link>
                            <button type="submit" disabled={loading} className="submit-btn primary-glow">
                                {loading ? <Loader2 className="animate-spin" /> : <>Sign In <LogIn size={18} /></>}
                            </button>
                        </div>
                    </form>

                    <Link to="/" className="return-home">
                        <ChevronLeft size={16} /> Return to Public Site
                    </Link>
                </div>
            </div>

            <style>{`
                .login-wrapper { display: flex; min-height: 100vh; background: #020617; font-family: 'Outfit', sans-serif; overflow: hidden; color: #fff; }
                .login-visual { flex: 1.2; background: #030712; display: flex; align-items: center; justify-content: center; position: relative; border-right: 1px solid rgba(255,255,255,0.05); }
                .login-visual::before { content: ''; position: absolute; inset: 0; background: url('https://w.wallhaven.cc/full/8o/wallhaven-8o9m9j.jpg') center/cover; opacity: 0.1; filter: grayscale(1); }
                .visual-content { position: relative; z-index: 10; text-align: center; }
                .visual-content h1 { font-family: 'Oswald'; font-size: 4rem; letter-spacing: 8px; margin: 0; }
                .visual-content h1 span { color: #fbbf24; }
                .visual-content p { color: #64748b; letter-spacing: 4px; text-transform: uppercase; font-size: 0.8rem; margin-top: 10px; }
                
                .login-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: radial-gradient(circle at center, rgba(251, 191, 36, 0.05), transparent); }
                .glass-panel { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 32px; width: 100%; max-width: 480px; padding: 50px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
                
                .login-header { margin-bottom: 40px; }
                .login-header h2 { font-family: 'Oswald'; font-size: 2.2rem; margin: 0; }
                .login-header p { color: #94a3b8; font-size: 0.95rem; margin-top: 8px; }
                
                .input-field { margin-bottom: 24px; }
                .input-field label { display: block; font-size: 0.85rem; font-weight: 600; color: #cbd5e1; margin-bottom: 10px; }
                .field-inner { display: flex; align-items: center; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 0 16px; transition: all 0.3s; }
                .field-inner:focus-within { border-color: #fbbf24; background: rgba(251, 191, 36, 0.05); }
                .field-inner svg { color: #64748b; }
                .field-inner input { background: transparent; border: none; padding: 14px; color: #fff; width: 100%; outline: none; font-size: 1rem; }
                
                .auth-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 35px; }
                .auth-actions a { color: #94a3b8; font-size: 0.9rem; text-decoration: none; transition: color 0.2s; }
                .auth-actions a:hover { color: #fbbf24; }
                
                .submit-btn { background: #fbbf24; color: #020617; border: none; padding: 14px 28px; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.3s; }
                .primary-glow { box-shadow: 0 0 20px rgba(251, 191, 36, 0.2); }
                .submit-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3); }
                
                .error-badge { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; padding: 12px; border-radius: 12px; font-size: 0.9rem; margin-bottom: 30px; text-align: center; }
                .return-home { display: flex; align-items: center; gap: 8px; color: #64748b; text-decoration: none; font-size: 0.9rem; margin-top: 40px; justify-content: center; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @media (max-width: 992px) { .login-visual { display: none; } .login-form-side { flex: 1; } }
            `}</style>
        </div>
    );
};

export default Login;
