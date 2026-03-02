import { useState, useCallback } from 'react';
import { Mail, Key, Shield, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../api/config';
import Turnstile from '../../components/Turnstile';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleVerify = useCallback((token) => setCaptchaToken(token), []);
    const handleExpire = useCallback(() => setCaptchaToken(null), []);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            setError('Please complete the security verification.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgotpassword', { email, captchaToken });
            setMessage('OTP sent to your email.');
            setStep(2);
            setCaptchaToken(null); // fresh captcha for step 2
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
            setCaptchaToken(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            setError('Please complete the security verification.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.put('/auth/resetpassword', { otp, password: newPassword, captchaToken });
            alert('Password reset successful. Redirecting to login...');
            window.location.href = '/admin/login';
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed.');
            setCaptchaToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-page">
            <div className="auth-card-premium card glass-panel">
                <div className="auth-header">
                    <h2>AK<span>ADMIN</span></h2>
                    <p>Recover Your Access</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="modern-admin-form">
                        <div className="auth-instruction">
                            <AlertCircle size={16} /> Enter your designated email to receive a secure recovery code.
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="input-field">
                            <label>Admin Email</label>
                            <div className="input-inner-box">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="hello@akdesigns.space"
                                    required
                                />
                            </div>
                        </div>

                        {/* ── Cloudflare Turnstile ── */}
                        <Turnstile onVerify={handleVerify} onExpire={handleExpire} theme="dark" />
                        {captchaToken && (
                            <div className="captcha-verified">
                                <ShieldCheck size={14} /> Verification passed
                            </div>
                        )}

                        <button type="submit" disabled={loading || !captchaToken} className="btn-primary full-btn-glow">
                            {loading ? <Loader2 className="animate-spin" /> : 'Request OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="modern-admin-form">
                        <div className="auth-instruction">
                            <Shield size={16} /> An authorization code has been dispatched to {email}.
                        </div>
                        {message && <div className="success-message">{message}</div>}
                        {error && <div className="error-message">{error}</div>}
                        <div className="input-field">
                            <label>One-Time Password (OTP)</label>
                            <div className="input-inner-box">
                                <Shield size={18} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    placeholder="000000"
                                    maxLength="6"
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-field">
                            <label>New Secure Password</label>
                            <div className="input-inner-box">
                                <Key size={18} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* ── Cloudflare Turnstile (fresh for step 2) ── */}
                        <Turnstile onVerify={handleVerify} onExpire={handleExpire} theme="dark" />
                        {captchaToken && (
                            <div className="captcha-verified">
                                <ShieldCheck size={14} /> Verification passed
                            </div>
                        )}

                        <button type="submit" disabled={loading || !captchaToken} className="btn-primary full-btn-glow">
                            {loading ? <Loader2 className="animate-spin" /> : 'Reset & Authenticate'}
                        </button>
                    </form>
                )}
            </div>
            <style>{`
                .admin-auth-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: radial-gradient(circle at center, #0a0f16 0%, #020617 100%); }
                .auth-card-premium { width: 100%; max-width: 440px; padding: 50px 40px; border-radius: 24px; position: relative; overflow: hidden; }
                .auth-card-premium::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(251, 191, 36, 0.05) 0%, transparent 50%); pointer-events: none; z-index: 0; }

                .auth-header { text-align: center; margin-bottom: 40px; position: relative; z-index: 1; }
                .auth-header h2 { font-family: 'Oswald', sans-serif; font-size: 2.5rem; letter-spacing: 2px; margin: 0; color: #fff; font-weight: 700; display: flex; justify-content: center; align-items: center; gap: 5px; }
                .auth-header h2 span { color: var(--primary); }
                .auth-header p { color: var(--text-muted); font-size: 0.95rem; margin: 10px 0 0; text-transform: uppercase; letter-spacing: 2px; }

                .modern-admin-form { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 20px; }

                .auth-instruction { display: flex; align-items: flex-start; gap: 10px; background: rgba(59, 130, 246, 0.05); color: #60a5fa; padding: 15px; border-radius: 12px; font-size: 0.85rem; line-height: 1.5; border: 1px solid rgba(59, 130, 246, 0.1); }
                .error-message { color: #ff4d4d; background: rgba(255, 77, 77, 0.1); padding: 12px; border-radius: 12px; font-size: 0.85rem; border: 1px solid rgba(255, 77, 77, 0.2); }
                .success-message { color: #4ade80; background: rgba(74, 222, 128, 0.08); padding: 12px; border-radius: 12px; font-size: 0.85rem; border: 1px solid rgba(74, 222, 128, 0.2); }

                .input-field label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
                .input-inner-box { display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 16px; padding: 0 16px; transition: all 0.3s; }
                .input-inner-box:focus-within { border-color: var(--primary); background: rgba(251, 191, 36, 0.02); }
                .input-inner-box svg { color: var(--text-muted); }
                .input-inner-box input { background: transparent; border: none; padding: 16px 0; color: #fff; width: 100%; outline: none; font-size: 1rem; }

                .captcha-verified { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #4ade80; background: rgba(74, 222, 128, 0.08); border: 1px solid rgba(74, 222, 128, 0.2); padding: 8px 14px; border-radius: 10px; margin-top: -10px; }

                .full-btn-glow { width: 100%; justify-content: center; padding: 16px; font-size: 1rem; margin-top: 4px; border-radius: 16px; text-transform: uppercase; letter-spacing: 2px; }
                .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

                @media (max-width: 480px) { .auth-card-premium { padding: 36px 20px; } }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
