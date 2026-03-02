import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock, Save, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../api/config';

const AcceptInvite = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.put(`/auth/accept-invite/${token}`, { password });
            localStorage.setItem('token', res.data.token);
            alert('Account activated successfully!');
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to activate account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <div className="auth-header">
                    <ShieldCheck size={40} className="primary-text" />
                    <h2>Activate Account</h2>
                    <p>Set your secure access key to join the AK Design team.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-badge">{error}</div>}

                    <div className="input-field">
                        <label>Secure Access Key</label>
                        <div className="field-inner">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Create password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Verify Access Key</label>
                        <div className="field-inner">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="Repeat password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary full-btn">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Activate Profile</>}
                    </button>
                </form>
            </div>

            <style>{`
                .auth-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; }
                .auth-card { width: 100%; max-width: 450px; padding: 40px; }
                .auth-header { text-align: center; margin-bottom: 30px; }
                .auth-header h2 { font-size: 1.8rem; margin: 15px 0 5px 0; font-family: 'Oswald'; }
                .auth-header p { color: #94a3b8; font-size: 0.9rem; }
                .error-badge { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem; text-align: center; border: 1px solid rgba(239, 68, 68, 0.2); }
                .field-inner { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 0 15px; margin-top: 8px; }
                .field-inner input { background: transparent; border: none; padding: 14px 0; color: #fff; width: 100%; outline: none; }
                .full-btn { width: 100%; justify-content: center; margin-top: 20px; }
                .primary-text { color: #fbbf24; }
            `}</style>
        </div>
    );
};

export default AcceptInvite;
